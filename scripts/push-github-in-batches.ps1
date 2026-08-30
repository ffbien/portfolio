param(
  [string]$Remote = 'origin',
  [string]$Branch = 'main',
  [int]$BatchLimitMiB = 90
)

$ErrorActionPreference = 'Stop'

function Assert-GitSuccess([string]$Action) {
  if ($LASTEXITCODE -ne 0) {
    throw "$Action failed with exit code $LASTEXITCODE"
  }
}

$entryLines = git ls-files -s
Assert-GitSuccess 'Reading the Git index'

$entries = foreach ($line in $entryLines) {
  if ($line -match '^(\d+) ([0-9a-f]+) \d+\t(.+)$') {
    $path = $Matches[3]
    $item = Get-Item -LiteralPath $path
    [pscustomobject]@{
      Mode = $Matches[1]
      Sha = $Matches[2]
      Path = $path
      Length = $item.Length
    }
  }
}

$entries = $entries | Sort-Object Length -Descending
$gitDir = (Resolve-Path (git rev-parse --git-dir)).Path
$temporaryIndex = Join-Path $gitDir ('.codex-upload-index-' + [guid]::NewGuid().ToString('N'))
$temporaryBranch = 'codex-upload-staging'
$remoteTemporaryRef = "refs/heads/$temporaryBranch"
$remoteLine = git ls-remote $Remote $remoteTemporaryRef
Assert-GitSuccess 'Reading the remote staging branch'
$remoteCommit = if ($remoteLine) { ($remoteLine -split '\s+')[0] } else { $null }
$previousCommit = $remoteCommit
$lastTree = $null
$oldIndex = $env:GIT_INDEX_FILE

try {
  $env:GIT_INDEX_FILE = $temporaryIndex

  if ($remoteCommit) {
    git read-tree $remoteCommit
    Assert-GitSuccess 'Restoring the remote staging index'
    $uploadedEntries = @{}
    foreach ($line in (git ls-files -s)) {
      if ($line -match '^\d+ ([0-9a-f]+) \d+\t(.+)$') {
        $uploadedEntries[$Matches[2]] = $Matches[1]
      }
    }
    $entries = $entries | Where-Object {
      -not $uploadedEntries.ContainsKey($_.Path) -or $uploadedEntries[$_.Path] -ne $_.Sha
    }
    $lastTree = (git rev-parse "${remoteCommit}^{tree}").Trim()
    Assert-GitSuccess 'Reading the remote staging tree'
    Write-Host "Resuming from remote staging commit $remoteCommit."
  } else {
    git read-tree --empty
    Assert-GitSuccess 'Creating the temporary Git index'
  }

  $batchLimit = $BatchLimitMiB * 1MB
  $batches = @()
  $current = @()
  $currentBytes = 0L

  foreach ($entry in $entries) {
    if ($current.Count -gt 0 -and ($currentBytes + $entry.Length) -gt $batchLimit) {
      $batches += ,$current
      $current = @()
      $currentBytes = 0L
    }
    $current += $entry
    $currentBytes += $entry.Length
  }

  if ($current.Count -gt 0) {
    $batches += ,$current
  }

  for ($index = 0; $index -lt $batches.Count; $index += 1) {
    $batch = $batches[$index]

    foreach ($entry in $batch) {
      $cacheInfo = "$($entry.Mode),$($entry.Sha),$($entry.Path)"
      git update-index --add --cacheinfo $cacheInfo
      Assert-GitSuccess "Adding $($entry.Path) to upload batch"
    }

    $lastTree = (git write-tree).Trim()
    Assert-GitSuccess 'Writing the staging tree'
    $message = "Upload staging batch $($index + 1)/$($batches.Count)"

    if ($previousCommit) {
      $commit = (git commit-tree $lastTree -p $previousCommit -m $message).Trim()
    } else {
      $commit = (git commit-tree $lastTree -m $message).Trim()
    }
    Assert-GitSuccess 'Creating the staging commit'

    git update-ref "refs/heads/$temporaryBranch" $commit
    Assert-GitSuccess 'Updating the temporary branch'

    $batchMiB = [math]::Round((($batch | Measure-Object Length -Sum).Sum) / 1MB, 1)
    Write-Host "Pushing batch $($index + 1)/$($batches.Count) ($batchMiB MiB)..."
    git push --quiet $Remote "refs/heads/${temporaryBranch}:refs/heads/${temporaryBranch}"
    Assert-GitSuccess "Pushing batch $($index + 1)"

    $previousCommit = $commit
  }

  $mainTree = (git rev-parse "${Branch}^{tree}").Trim()
  Assert-GitSuccess 'Reading the final branch tree'
  if ($lastTree -ne $mainTree) {
    throw "Staging tree $lastTree does not match final tree $mainTree"
  }

  Write-Host "All staged objects uploaded; creating $Branch..."
  git push --set-upstream $Remote $Branch
  Assert-GitSuccess "Pushing $Branch"

  git push $Remote --delete $temporaryBranch
  Assert-GitSuccess 'Removing the temporary upload branch'
  git update-ref -d "refs/heads/$temporaryBranch"
  Assert-GitSuccess 'Removing the local temporary upload branch'
} finally {
  $env:GIT_INDEX_FILE = $oldIndex
  if (Test-Path -LiteralPath $temporaryIndex) {
    Remove-Item -LiteralPath $temporaryIndex -Force
  }
}

git ls-remote $Remote "refs/heads/$Branch"
Assert-GitSuccess "Verifying $Branch"
