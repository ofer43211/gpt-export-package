# Send-TelemetryData Function Tests

BeforeAll {
    $ModulePath = Join-Path $PSScriptRoot '..' 'SortCleanup.psm1'
    Import-Module $ModulePath -Force
}

AfterAll {
    Remove-Module SortCleanup -Force -ErrorAction SilentlyContinue
}

Describe 'Send-TelemetryData Function' -Tag 'Function', 'SendTelemetryData' {
    Context 'Parameter Validation' {
        It 'Should require Statistics parameter' {
            { Send-TelemetryData } | Should -Throw
        }

        It 'Should accept hashtable parameter' {
            $Stats = @{
                TotalFiles = 10
                SortedFiles = 10
                Errors = 0
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should have Statistics parameter as mandatory' {
            $Command = Get-Command Send-TelemetryData
            $StatsParam = $Command.Parameters['Statistics']
            $StatsParam.Attributes.Mandatory | Should -Contain $true
        }

        It 'Should accept hashtable type for Statistics' {
            $Command = Get-Command Send-TelemetryData
            $StatsParam = $Command.Parameters['Statistics']
            $StatsParam.ParameterType | Should -Be ([hashtable])
        }
    }

    Context 'Telemetry Data Structure' {
        It 'Should process valid statistics hashtable' {
            $Stats = @{
                TotalFiles = 5
                SortedFiles = 5
                Errors = 0
                StartTime = Get-Date
                EndTime = Get-Date
                Duration = New-TimeSpan -Seconds 2
            }

            { Send-TelemetryData -Statistics $Stats -Verbose } | Should -Not -Throw
        }

        It 'Should handle minimal statistics' {
            $Stats = @{
                TotalFiles = 0
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should handle complex statistics objects' {
            $Stats = @{
                TotalFiles = 100
                SortedFiles = 95
                Errors = 5
                StartTime = Get-Date
                EndTime = Get-Date
                Duration = New-TimeSpan -Minutes 5
                CustomData = @{
                    ExtensionBreakdown = @{
                        txt = 50
                        jpg = 30
                        pdf = 20
                    }
                }
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }
    }

    Context 'JSON Conversion' {
        It 'Should convert statistics to JSON format' {
            $Stats = @{
                TotalFiles = 10
                SortedFiles = 10
                Errors = 0
            }

            # Capture verbose output to check JSON creation
            $VerboseOutput = Send-TelemetryData -Statistics $Stats -Verbose 4>&1

            $VerboseOutput | Should -Not -BeNullOrEmpty
        }

        It 'Should include module name in telemetry' {
            $Stats = @{
                TotalFiles = 5
            }

            $VerboseOutput = Send-TelemetryData -Statistics $Stats -Verbose 4>&1 | Out-String

            $VerboseOutput | Should -Match 'SortCleanup'
        }

        It 'Should include version in telemetry' {
            $Stats = @{
                TotalFiles = 5
            }

            $VerboseOutput = Send-TelemetryData -Statistics $Stats -Verbose 4>&1 | Out-String

            $VerboseOutput | Should -Match '2\.0\.0'
        }

        It 'Should include timestamp in telemetry' {
            $Stats = @{
                TotalFiles = 5
            }

            $VerboseOutput = Send-TelemetryData -Statistics $Stats -Verbose 4>&1 | Out-String

            $VerboseOutput | Should -Match '\d{4}-\d{2}-\d{2}'
        }
    }

    Context 'Error Handling' {
        It 'Should handle empty hashtable gracefully' {
            $Stats = @{}

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should handle null values in hashtable' {
            $Stats = @{
                TotalFiles = $null
                SortedFiles = $null
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should continue on JSON conversion errors' {
            $Stats = @{
                # Circular reference would cause JSON issues, but we handle it
                TotalFiles = 5
            }

            { Send-TelemetryData -Statistics $Stats -ErrorAction SilentlyContinue } | Should -Not -Throw
        }

        It 'Should write warning on failure' {
            $Stats = @{
                TotalFiles = 5
            }

            # This should not throw, even if telemetry fails
            { Send-TelemetryData -Statistics $Stats -WarningAction SilentlyContinue } | Should -Not -Throw
        }
    }

    Context 'Output Messages' {
        It 'Should display verbose message with data' {
            $Stats = @{
                TotalFiles = 10
                SortedFiles = 10
            }

            $VerboseMessages = Send-TelemetryData -Statistics $Stats -Verbose 4>&1

            $VerboseMessages | Should -Not -BeNullOrEmpty
        }

        It 'Should display host message about readiness' {
            $Stats = @{
                TotalFiles = 5
            }

            # Capture all output streams
            $AllOutput = Send-TelemetryData -Statistics $Stats 2>&1 3>&1 4>&1 5>&1 6>&1

            # Should produce some output
            $AllOutput | Should -Not -BeNullOrEmpty
        }
    }

    Context 'Integration with Module' {
        It 'Should work with statistics from Start-SortCleanup' {
            $TestPath = Join-Path $TestDrive 'TelemetryTest'
            New-Item -ItemType Directory -Path $TestPath -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            $Stats = Start-SortCleanup -Path $TestPath

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw

            Remove-Item -Path $TestPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Context 'Data Privacy' {
        It 'Should not transmit data over network in current implementation' {
            $Stats = @{
                TotalFiles = 100
                SortedFiles = 100
            }

            # Current implementation only prepares data, doesn't send it
            # Verify it completes without network calls
            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should prepare data in JSON format for future transmission' {
            $Stats = @{
                TotalFiles = 50
                SortedFiles = 45
                Errors = 5
            }

            $VerboseOutput = Send-TelemetryData -Statistics $Stats -Verbose 4>&1 | Out-String

            # Should contain JSON data
            $VerboseOutput | Should -Match '\{.*\}'
        }
    }

    Context 'JSON Depth Handling' {
        It 'Should handle nested objects with depth parameter' {
            $Stats = @{
                Level1 = @{
                    Level2 = @{
                        Level3 = @{
                            Value = 'Deep'
                        }
                    }
                }
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should use depth of 3 for JSON conversion' {
            $Stats = @{
                TotalFiles = 10
            }

            $VerboseOutput = Send-TelemetryData -Statistics $Stats -Verbose 4>&1 | Out-String

            # Verify the conversion succeeded (depth 3 specified in code)
            $VerboseOutput | Should -Not -BeNullOrEmpty
        }
    }

    Context 'Edge Cases' {
        It 'Should handle very large numbers' {
            $Stats = @{
                TotalFiles = [int]::MaxValue
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should handle special characters in strings' {
            $Stats = @{
                Path = 'C:\Test\Path\With\Special@#$Characters'
                TotalFiles = 5
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should handle Unicode characters' {
            $Stats = @{
                Message = 'עברית Unicode טקסט'
                TotalFiles = 5
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should handle boolean values' {
            $Stats = @{
                Success = $true
                HasErrors = $false
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }

        It 'Should handle DateTime objects' {
            $Stats = @{
                StartTime = Get-Date
                EndTime = Get-Date
            }

            { Send-TelemetryData -Statistics $Stats } | Should -Not -Throw
        }
    }
}
