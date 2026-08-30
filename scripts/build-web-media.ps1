param(
  [Parameter(Mandatory = $true)]
  [string]$FfmpegPath,

  [Parameter(Mandatory = $true)]
  [string]$FfprobePath
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceDir = Join-Path $projectRoot 'public\media'
$outputDir = Join-Path $projectRoot 'public\portfolio-media'
$targetBytes = 80MB
$audioKbps = 96
$maxVideoKbps = 1400
$copyThreshold = 90MB

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Get-ChildItem -LiteralPath $sourceDir -File |
  Where-Object { $_.Extension -in '.jpg', '.png' } |
  ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $outputDir $_.Name) -Force
  }

$videos = Get-ChildItem -LiteralPath $sourceDir -File -Filter '*.mp4' | Sort-Object Name
$index = 0

foreach ($video in $videos) {
  $index += 1
  $destination = Join-Path $outputDir $video.Name
  $codec = (& $FfprobePath -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 -- $video.FullName | Select-Object -First 1).Trim()

  if ($video.Length -le $copyThreshold -and $codec -eq 'h264') {
    Copy-Item -LiteralPath $video.FullName -Destination $destination -Force
    Write-Host ("[{0}/{1}] copied {2}" -f $index, $videos.Count, $video.Name)
    continue
  }

  $durationText = & $FfprobePath -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -- $video.FullName
  $duration = [double]::Parse(($durationText | Select-Object -First 1), [Globalization.CultureInfo]::InvariantCulture)
  $calculatedKbps = [math]::Floor((($targetBytes * 8) / $duration / 1000) - $audioKbps - 16)
  $videoKbps = [math]::Min($maxVideoKbps, [math]::Max(320, $calculatedKbps))
  $maxRateKbps = [math]::Floor($videoKbps * 1.25)
  $bufferKbps = $maxRateKbps * 2
  $temporary = "$destination.tmp.mp4"

  Write-Host ("[{0}/{1}] encoding {2} at {3} kbps" -f $index, $videos.Count, $video.Name, $videoKbps)

  & $FfmpegPath `
    -hide_banner `
    -loglevel error `
    -y `
    -i $video.FullName `
    -map '0:v:0' `
    -map '0:a?' `
    -vf 'scale=1280:1280:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=30' `
    -c:v libx264 `
    -preset veryfast `
    -profile:v high `
    -level 4.0 `
    -pix_fmt yuv420p `
    -b:v "${videoKbps}k" `
    -maxrate "${maxRateKbps}k" `
    -bufsize "${bufferKbps}k" `
    -c:a aac `
    -b:a "${audioKbps}k" `
    -ac 2 `
    -movflags +faststart `
    $temporary

  if ($LASTEXITCODE -ne 0) {
    throw "FFmpeg failed for $($video.Name)"
  }

  Move-Item -LiteralPath $temporary -Destination $destination -Force
  Write-Host ("[{0}/{1}] finished {2} ({3:N1} MiB)" -f $index, $videos.Count, $video.Name, ((Get-Item -LiteralPath $destination).Length / 1MB))
}

Write-Host 'WEB_MEDIA_COMPLETE'
