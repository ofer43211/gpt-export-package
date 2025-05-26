@{
    ModuleVersion = '2.0.0'
    GUID = 'b3d4e5f6-7890-1234-5678-90abcdef1234'
    Author = 'Ofer'
    CompanyName = 'GPT Export Package'
    Copyright = '(c) 2025 Ofer. All rights reserved.'
    Description = 'PowerShell module for sorting and cleaning up files with telemetry'
    PowerShellVersion = '5.1'
    RootModule = 'SortCleanup.psm1'
    FunctionsToExport = @('Start-SortCleanup', 'Get-SortStatistics', 'Send-TelemetryData')
}
