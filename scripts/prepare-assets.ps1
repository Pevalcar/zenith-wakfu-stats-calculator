# Requires: Windows PowerShell 5.1+
# Generates icon sizes and optional store images, then optionally zips the extension.

param(
  [switch]$Zip
)

Add-Type -AssemblyName System.Drawing

function Resize-Image {
  param(
    [Parameter(Mandatory=$true)][string]$SourcePath,
    [Parameter(Mandatory=$true)][string]$DestPath,
    [Parameter(Mandatory=$true)][int]$Width,
    [Parameter(Mandatory=$true)][int]$Height
  )
  if (!(Test-Path $SourcePath)) { throw "Source image not found: $SourcePath" }
  $src = [System.Drawing.Image]::FromFile($SourcePath)
  $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.SmoothingMode = 'HighQuality'
  $gfx.InterpolationMode = 'HighQualityBicubic'
  $gfx.PixelOffsetMode = 'HighQuality'
  $gfx.Clear([System.Drawing.Color]::Transparent)

  # Fit preserving aspect ratio, centered
  $ratioW = $Width / $src.Width
  $ratioH = $Height / $src.Height
  $ratio = [Math]::Min($ratioW, $ratioH)
  $newW = [int]([Math]::Round($src.Width * $ratio))
  $newH = [int]([Math]::Round($src.Height * $ratio))
  $offsetX = [int](($Width - $newW) / 2)
  $offsetY = [int](($Height - $newH) / 2)

  $rect = New-Object System.Drawing.Rectangle($offsetX, $offsetY, $newW, $newH)
  $gfx.DrawImage($src, $rect)
  $bmp.Save($DestPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $gfx.Dispose(); $bmp.Dispose(); $src.Dispose()
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root

try {
  # Icons from icon.png
  $icon = Join-Path $root 'icons\icon.png'
  if (Test-Path $icon) {
    Write-Host 'Generating icon sizes (16/48/128)...'
    Resize-Image -SourcePath $icon -DestPath (Join-Path $root 'icons\icon-16.png') -Width 16 -Height 16
    Resize-Image -SourcePath $icon -DestPath (Join-Path $root 'icons\icon-48.png') -Width 48 -Height 48
    Resize-Image -SourcePath $icon -DestPath (Join-Path $root 'icons\icon-128.png') -Width 128 -Height 128
  } else {
    Write-Warning 'icon.png not found. Skipping icon generation.'
  }

  # Optional store images from presentacion.png and ejemplo.png
  $presentacion = Join-Path $root 'images\presentacion.png'
  $ejemplo = Join-Path $root 'images\ejemplo.png'

  if (Test-Path $presentacion) {
    Write-Host 'Generating store images from presentacion.png ...'
    Resize-Image -SourcePath $presentacion -DestPath (Join-Path $root 'images\store\store-hero-1280x800.png') -Width 1280 -Height 800
    Resize-Image -SourcePath $presentacion -DestPath (Join-Path $root 'images\store\store-promo-1400x560.png') -Width 1400 -Height 560
  }
  if (Test-Path $ejemplo) {
    Write-Host 'Generating store images from ejemplo.png ...'
    Resize-Image -SourcePath $ejemplo -DestPath (Join-Path $root 'images\store\store-example-1280x800.png') -Width 1280 -Height 800
  }

  if ($Zip) {
    $zipPath = Join-Path $root 'zenith-wakfu-stats.zip'
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    $files = @('manifest.json','content.js','popup.html','popup.css','popup.js','README.md','PRIVACY.md','icons\icon-16.png','icons\icon-48.png','icons\icon-128.png') | ForEach-Object { Join-Path $root $_ }
    $existing = $files | Where-Object { Test-Path $_ }
    if ($existing.Count -eq 0) { throw 'No files to zip. Are you in the project root?' }
    Write-Host 'Creating ZIP package zenith-wakfu-stats.zip ...'
    Compress-Archive -Path $existing -DestinationPath $zipPath
    Write-Host "ZIP created: $zipPath"
  }
} finally {
  Pop-Location
}

Write-Host 'Done.'
