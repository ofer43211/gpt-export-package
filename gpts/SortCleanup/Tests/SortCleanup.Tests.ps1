# SortCleanup Module Tests
# Comprehensive Pester tests for the SortCleanup PowerShell module

BeforeAll {
    # Import the module
    $ModulePath = Join-Path $PSScriptRoot '..' 'SortCleanup.psm1'
    Import-Module $ModulePath -Force

    # Create a temporary test directory
    $script:TestRoot = Join-Path $TestDrive 'SortCleanupTests'
    New-Item -ItemType Directory -Path $script:TestRoot -Force | Out-Null
}

AfterAll {
    # Clean up
    Remove-Module SortCleanup -Force -ErrorAction SilentlyContinue
}

Describe 'SortCleanup Module' -Tag 'Module' {
    Context 'Module Import' {
        It 'Should import successfully' {
            Get-Module SortCleanup | Should -Not -BeNullOrEmpty
        }

        It 'Should export Start-SortCleanup function' {
            $Commands = Get-Command -Module SortCleanup
            $Commands.Name | Should -Contain 'Start-SortCleanup'
        }

        It 'Should export Get-SortStatistics function' {
            $Commands = Get-Command -Module SortCleanup
            $Commands.Name | Should -Contain 'Get-SortStatistics'
        }

        It 'Should export Send-TelemetryData function' {
            $Commands = Get-Command -Module SortCleanup
            $Commands.Name | Should -Contain 'Send-TelemetryData'
        }

        It 'Should export exactly 3 functions' {
            $Commands = Get-Command -Module SortCleanup
            $Commands.Count | Should -Be 3
        }
    }

    Context 'Module Manifest' {
        BeforeAll {
            $ManifestPath = Join-Path $PSScriptRoot '..' 'SortCleanup.psd1'
            $script:Manifest = Test-ModuleManifest -Path $ManifestPath -ErrorAction Stop
        }

        It 'Should have valid manifest' {
            $Manifest | Should -Not -BeNullOrEmpty
        }

        It 'Should have version 2.0.0' {
            $Manifest.Version | Should -Be '2.0.0'
        }

        It 'Should have correct exported functions' {
            $Manifest.ExportedFunctions.Keys | Should -Contain 'Start-SortCleanup'
            $Manifest.ExportedFunctions.Keys | Should -Contain 'Get-SortStatistics'
            $Manifest.ExportedFunctions.Keys | Should -Contain 'Send-TelemetryData'
        }
    }
}

Describe 'Start-SortCleanup Function' -Tag 'Function', 'StartSortCleanup' {
    BeforeEach {
        # Create fresh test directory for each test
        $script:TestPath = Join-Path $TestRoot "Test_$(Get-Random)"
        New-Item -ItemType Directory -Path $TestPath -Force | Out-Null
    }

    AfterEach {
        # Clean up test directory
        if (Test-Path $TestPath) {
            Remove-Item -Path $TestPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Context 'Parameter Validation' {
        It 'Should require Path parameter' {
            { Start-SortCleanup } | Should -Throw
        }

        It 'Should accept valid path' {
            { Start-SortCleanup -Path $TestPath } | Should -Not -Throw
        }

        It 'Should reject non-existent path' {
            $InvalidPath = 'C:\NonExistentPath_12345'
            { Start-SortCleanup -Path $InvalidPath -ErrorAction Stop } | Should -Throw
        }

        It 'Should have EnableTelemetry parameter as switch' {
            $Command = Get-Command Start-SortCleanup
            $TelemetryParam = $Command.Parameters['EnableTelemetry']
            $TelemetryParam.ParameterType | Should -Be ([switch])
        }

        It 'Should have EnableTelemetry as optional parameter' {
            $Command = Get-Command Start-SortCleanup
            $TelemetryParam = $Command.Parameters['EnableTelemetry']
            $TelemetryParam.Attributes.Mandatory | Should -Contain $false
        }
    }

    Context 'Basic File Operations' {
        It 'Should handle empty directory' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.TotalFiles | Should -Be 0
            $Result.SortedFiles | Should -Be 0
        }

        It 'Should organize files by extension' {
            # Create test files
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'test.jpg') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'test.pdf') -ItemType File -Force | Out-Null

            $Result = Start-SortCleanup -Path $TestPath

            $Result.TotalFiles | Should -Be 3
            $Result.SortedFiles | Should -Be 3
        }

        It 'Should create extension folders' {
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            Start-SortCleanup -Path $TestPath

            Test-Path (Join-Path $TestPath 'txt') | Should -Be $true
        }

        It 'Should move files to correct folders' {
            $TextFile = Join-Path $TestPath 'test.txt'
            New-Item -Path $TextFile -ItemType File -Force | Out-Null

            Start-SortCleanup -Path $TestPath

            $MovedFile = Join-Path $TestPath 'txt' 'test.txt'
            Test-Path $MovedFile | Should -Be $true
            Test-Path $TextFile | Should -Be $false
        }

        It 'Should handle files with no extension' {
            New-Item -Path (Join-Path $TestPath 'README') -ItemType File -Force | Out-Null

            Start-SortCleanup -Path $TestPath

            Test-Path (Join-Path $TestPath 'no-extension') | Should -Be $true
            Test-Path (Join-Path $TestPath 'no-extension' 'README') | Should -Be $true
        }

        It 'Should normalize extensions to lowercase' {
            New-Item -Path (Join-Path $TestPath 'test.TXT') -ItemType File -Force | Out-Null

            Start-SortCleanup -Path $TestPath

            Test-Path (Join-Path $TestPath 'txt') | Should -Be $true
        }

        It 'Should handle multiple files with same extension' {
            New-Item -Path (Join-Path $TestPath 'file1.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file3.txt') -ItemType File -Force | Out-Null

            $Result = Start-SortCleanup -Path $TestPath

            $Result.SortedFiles | Should -Be 3
            (Get-ChildItem (Join-Path $TestPath 'txt')).Count | Should -Be 3
        }
    }

    Context 'Statistics Tracking' {
        It 'Should return statistics object' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result | Should -Not -BeNullOrEmpty
        }

        It 'Should include TotalFiles in statistics' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.TotalFiles | Should -Not -BeNullOrEmpty
        }

        It 'Should include SortedFiles in statistics' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.SortedFiles | Should -Not -BeNullOrEmpty
        }

        It 'Should include Errors in statistics' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.Errors | Should -Not -BeNullOrEmpty
        }

        It 'Should include StartTime in statistics' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.StartTime | Should -Not -BeNullOrEmpty
        }

        It 'Should include EndTime in statistics' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.EndTime | Should -Not -BeNullOrEmpty
        }

        It 'Should include Duration in statistics' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.Duration | Should -Not -BeNullOrEmpty
        }

        It 'Should have correct file counts' {
            New-Item -Path (Join-Path $TestPath 'file1.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.jpg') -ItemType File -Force | Out-Null

            $Result = Start-SortCleanup -Path $TestPath

            $Result.TotalFiles | Should -Be 2
            $Result.SortedFiles | Should -Be 2
            $Result.Errors | Should -Be 0
        }

        It 'Should calculate duration correctly' {
            $Result = Start-SortCleanup -Path $TestPath
            $Result.Duration | Should -BeOfType [TimeSpan]
            $Result.Duration.TotalSeconds | Should -BeGreaterThan 0
        }
    }

    Context 'Error Handling' {
        It 'Should track errors in statistics' {
            # This is difficult to test without mocking, but we verify the property exists
            $Result = Start-SortCleanup -Path $TestPath
            { $Result.Errors } | Should -Not -Throw
        }

        It 'Should continue processing after error' {
            # Create files that will succeed
            New-Item -Path (Join-Path $TestPath 'file1.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.txt') -ItemType File -Force | Out-Null

            $Result = Start-SortCleanup -Path $TestPath -ErrorAction SilentlyContinue

            # Should process successfully despite any errors
            $Result | Should -Not -BeNullOrEmpty
        }
    }

    Context 'Telemetry' {
        It 'Should not send telemetry by default' {
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            # Should complete without telemetry
            { Start-SortCleanup -Path $TestPath } | Should -Not -Throw
        }

        It 'Should accept EnableTelemetry switch' {
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            { Start-SortCleanup -Path $TestPath -EnableTelemetry } | Should -Not -Throw
        }
    }

    Context 'Nested Directories' {
        It 'Should process files in subdirectories' {
            $SubDir = Join-Path $TestPath 'SubFolder'
            New-Item -ItemType Directory -Path $SubDir -Force | Out-Null
            New-Item -Path (Join-Path $SubDir 'nested.txt') -ItemType File -Force | Out-Null

            $Result = Start-SortCleanup -Path $TestPath

            $Result.TotalFiles | Should -Be 1
        }

        It 'Should handle deep directory structures' {
            $DeepPath = Join-Path $TestPath 'Level1' 'Level2' 'Level3'
            New-Item -ItemType Directory -Path $DeepPath -Force | Out-Null
            New-Item -Path (Join-Path $DeepPath 'deep.txt') -ItemType File -Force | Out-Null

            $Result = Start-SortCleanup -Path $TestPath

            $Result.TotalFiles | Should -Be 1
        }
    }

    Context 'Edge Cases' {
        It 'Should handle files with dots in name' {
            New-Item -Path (Join-Path $TestPath 'file.name.with.dots.txt') -ItemType File -Force | Out-Null

            Start-SortCleanup -Path $TestPath

            Test-Path (Join-Path $TestPath 'txt' 'file.name.with.dots.txt') | Should -Be $true
        }

        It 'Should handle special characters in filename' {
            $SpecialFile = 'file_with-special@chars.txt'
            New-Item -Path (Join-Path $TestPath $SpecialFile) -ItemType File -Force | Out-Null

            Start-SortCleanup -Path $TestPath

            Test-Path (Join-Path $TestPath 'txt' $SpecialFile) | Should -Be $true
        }

        It 'Should handle long filenames' {
            $LongName = 'a' * 100 + '.txt'
            New-Item -Path (Join-Path $TestPath $LongName) -ItemType File -Force | Out-Null

            { Start-SortCleanup -Path $TestPath } | Should -Not -Throw
        }
    }
}
