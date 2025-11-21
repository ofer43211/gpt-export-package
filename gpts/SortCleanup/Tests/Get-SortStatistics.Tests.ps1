# Get-SortStatistics Function Tests

BeforeAll {
    $ModulePath = Join-Path $PSScriptRoot '..' 'SortCleanup.psm1'
    Import-Module $ModulePath -Force

    $script:TestRoot = Join-Path $TestDrive 'GetSortStatisticsTests'
    New-Item -ItemType Directory -Path $script:TestRoot -Force | Out-Null
}

AfterAll {
    Remove-Module SortCleanup -Force -ErrorAction SilentlyContinue
}

Describe 'Get-SortStatistics Function' -Tag 'Function', 'GetSortStatistics' {
    BeforeEach {
        $script:TestPath = Join-Path $TestRoot "Test_$(Get-Random)"
        New-Item -ItemType Directory -Path $TestPath -Force | Out-Null
    }

    AfterEach {
        if (Test-Path $TestPath) {
            Remove-Item -Path $TestPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }

    Context 'Parameter Validation' {
        It 'Should require Path parameter' {
            { Get-SortStatistics } | Should -Throw
        }

        It 'Should accept valid path' {
            { Get-SortStatistics -Path $TestPath } | Should -Not -Throw
        }

        It 'Should reject non-existent path' {
            $InvalidPath = 'C:\NonExistentPath_99999'
            { Get-SortStatistics -Path $InvalidPath -ErrorAction Stop } | Should -Throw
        }
    }

    Context 'Basic Statistics' {
        It 'Should return hashtable' {
            $Result = Get-SortStatistics -Path $TestPath
            $Result | Should -BeOfType [hashtable]
        }

        It 'Should return empty hashtable for empty directory' {
            $Result = Get-SortStatistics -Path $TestPath
            $Result.Count | Should -Be 0
        }

        It 'Should count files by extension' {
            New-Item -Path (Join-Path $TestPath 'file1.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file3.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 3
        }

        It 'Should count multiple different extensions' {
            New-Item -Path (Join-Path $TestPath 'file1.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.jpg') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file3.pdf') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 1
            $Result['.jpg'] | Should -Be 1
            $Result['.pdf'] | Should -Be 1
        }

        It 'Should include extension with dot prefix' {
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result.Keys | Should -Contain '.txt'
        }
    }

    Context 'Extension Handling' {
        It 'Should handle files without extension' {
            New-Item -Path (Join-Path $TestPath 'README') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.no-extension'] | Should -Be 1
        }

        It 'Should normalize extensions to lowercase' {
            New-Item -Path (Join-Path $TestPath 'file1.TXT') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 2
        }

        It 'Should handle mixed case extensions' {
            New-Item -Path (Join-Path $TestPath 'file1.PDF') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file2.Pdf') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file3.pdf') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.pdf'] | Should -Be 3
        }

        It 'Should handle files with multiple dots' {
            New-Item -Path (Join-Path $TestPath 'archive.tar.gz') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.gz'] | Should -Be 1
        }
    }

    Context 'Nested Directories' {
        It 'Should process files in subdirectories' {
            $SubDir = Join-Path $TestPath 'SubFolder'
            New-Item -ItemType Directory -Path $SubDir -Force | Out-Null
            New-Item -Path (Join-Path $SubDir 'nested.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 1
        }

        It 'Should aggregate counts from all subdirectories' {
            $SubDir1 = Join-Path $TestPath 'Folder1'
            $SubDir2 = Join-Path $TestPath 'Folder2'
            New-Item -ItemType Directory -Path $SubDir1 -Force | Out-Null
            New-Item -ItemType Directory -Path $SubDir2 -Force | Out-Null

            New-Item -Path (Join-Path $SubDir1 'file1.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $SubDir2 'file2.txt') -ItemType File -Force | Out-Null
            New-Item -Path (Join-Path $TestPath 'file3.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 3
        }

        It 'Should handle deep directory structures' {
            $DeepPath = Join-Path $TestPath 'L1' 'L2' 'L3' 'L4'
            New-Item -ItemType Directory -Path $DeepPath -Force | Out-Null
            New-Item -Path (Join-Path $DeepPath 'deep.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 1
        }
    }

    Context 'Large File Sets' {
        It 'Should handle many files efficiently' {
            # Create 50 files with various extensions
            1..50 | ForEach-Object {
                $Extension = @('.txt', '.jpg', '.pdf', '.doc', '.xlsx')[$_ % 5]
                New-Item -Path (Join-Path $TestPath "file$_$Extension") -ItemType File -Force | Out-Null
            }

            $Result = Get-SortStatistics -Path $TestPath

            $Result.Count | Should -Be 5
            $Result['.txt'] | Should -Be 10
            $Result['.jpg'] | Should -Be 10
            $Result['.pdf'] | Should -Be 10
        }

        It 'Should count all files accurately' {
            1..100 | ForEach-Object {
                New-Item -Path (Join-Path $TestPath "file$_.txt") -ItemType File -Force | Out-Null
            }

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 100
        }
    }

    Context 'Edge Cases' {
        It 'Should handle empty filename with extension' {
            New-Item -Path (Join-Path $TestPath '.gitignore') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            # Hidden files with dot prefix
            $Result.Keys | Should -Contain '.gitignore'
        }

        It 'Should not count directories' {
            New-Item -ItemType Directory -Path (Join-Path $TestPath 'SubFolder') -Force | Out-Null
            New-Item -ItemType Directory -Path (Join-Path $TestPath 'AnotherFolder') -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result.Count | Should -Be 0
        }

        It 'Should handle special characters in filenames' {
            New-Item -Path (Join-Path $TestPath 'file_@#$.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 1
        }

        It 'Should handle Unicode in filenames' {
            New-Item -Path (Join-Path $TestPath 'קובץ.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result['.txt'] | Should -Be 1
        }
    }

    Context 'Return Value Structure' {
        It 'Should return mutable hashtable' {
            $Result = Get-SortStatistics -Path $TestPath

            { $Result['test'] = 1 } | Should -Not -Throw
        }

        It 'Should have string keys' {
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result.Keys | ForEach-Object { $_ | Should -BeOfType [string] }
        }

        It 'Should have integer values' {
            New-Item -Path (Join-Path $TestPath 'test.txt') -ItemType File -Force | Out-Null

            $Result = Get-SortStatistics -Path $TestPath

            $Result.Values | ForEach-Object { $_ | Should -BeOfType [int] }
        }
    }

    Context 'Performance' {
        It 'Should complete in reasonable time for moderate file count' {
            # Create 200 files
            1..200 | ForEach-Object {
                New-Item -Path (Join-Path $TestPath "file$_.txt") -ItemType File -Force | Out-Null
            }

            $Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $Result = Get-SortStatistics -Path $TestPath
            $Stopwatch.Stop()

            # Should complete in under 5 seconds for 200 files
            $Stopwatch.Elapsed.TotalSeconds | Should -BeLessThan 5
        }
    }
}
