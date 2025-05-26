function Start-SortCleanup {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        
        [Parameter(Mandatory = $false)]
        [switch]$EnableTelemetry = $false
    )
    
    Write-Verbose "Starting SortCleanup for path: $Path"
    
    if (-not (Test-Path $Path)) {
        Write-Error "Path does not exist: $Path"
        return
    }
    
    $files = Get-ChildItem -Path $Path -File -Recurse
    $statistics = @{
        TotalFiles = $files.Count
        SortedFiles = 0
        Errors = 0
        StartTime = Get-Date
    }
    
    foreach ($file in $files) {
        try {
            $extension = $file.Extension.ToLower().TrimStart('.')
            if ([string]::IsNullOrEmpty($extension)) { $extension = "no-extension" }
            
            $destinationFolder = Join-Path $Path $extension
            
            if (-not (Test-Path $destinationFolder)) {
                New-Item -ItemType Directory -Path $destinationFolder -Force | Out-Null
            }
            
            $destinationPath = Join-Path $destinationFolder $file.Name
            Move-Item -Path $file.FullName -Destination $destinationPath -Force
            
            $statistics.SortedFiles++
            Write-Verbose "Moved: ${file.Name} to ${destinationFolder}"
            
        } catch {
            $statistics.Errors++
            Write-Error "Failed to process file ${file.Name}: ${_}"
        }
    }
    
    $statistics.EndTime = Get-Date
    $statistics.Duration = $statistics.EndTime - $statistics.StartTime
    
    if ($EnableTelemetry) {
        Send-TelemetryData -Statistics $statistics
    }
    
    return $statistics
}

function Get-SortStatistics {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )
    
    if (-not (Test-Path $Path)) {
        Write-Error "Path does not exist: $Path"
        return
    }
    
    $files = Get-ChildItem -Path $Path -File -Recurse
    $stats = @{}
    
    foreach ($file in $files) {
        $extension = $file.Extension.ToLower()
        if ([string]::IsNullOrEmpty($extension)) { $extension = ".no-extension" }
        
        if ($stats.ContainsKey($extension)) {
            $stats[$extension]++
        } else {
            $stats[$extension] = 1
        }
    }
    
    return $stats
}

function Send-TelemetryData {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Statistics
    )
    
    try {
        $telemetryData = @{
            ModuleName = 'SortCleanup'
            Version = '2.0.0'
            Timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
            Statistics = $Statistics
        } | ConvertTo-Json -Depth 3
        
        Write-Verbose "Telemetry data prepared: $telemetryData"
        Write-Host "Telemetry data ready for transmission" -ForegroundColor Yellow
        
    } catch {
        Write-Warning "Failed to send telemetry data: ${_}"
    }
}

Export-ModuleMember -Function 'Start-SortCleanup', 'Get-SortStatistics', 'Send-TelemetryData'
