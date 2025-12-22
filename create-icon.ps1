Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap(128, 128)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.Clear([System.Drawing.Color]::FromArgb(76, 175, 80))
$font = New-Object System.Drawing.Font('Arial', 60, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$graphics.DrawString('V', $font, $brush, 30, 20)
$bmp.Save("$PSScriptRoot\icon.png")
$graphics.Dispose()
$bmp.Dispose()

Write-Host "Icon created successfully!"
