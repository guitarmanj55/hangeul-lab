# Render the app icons in icons/: a white 한 on the indigo brand colour.
# Run from the repo root: powershell -File scripts\make_icons.ps1
Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot "..\icons"
New-Item -ItemType Directory -Force $out | Out-Null

function Make-Icon($size, $name, $glyphScale) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "AntiAlias"
  $g.TextRenderingHint = "AntiAliasGridFit"
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#25406e"))
  $font = New-Object System.Drawing.Font "Malgun Gothic", ($size * $glyphScale), ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = "Center"; $fmt.LineAlignment = "Center"
  $rect = New-Object System.Drawing.RectangleF 0, ($size * 0.03), $size, $size
  $g.DrawString([string][char]0xD55C, $font, [System.Drawing.Brushes]::White, $rect, $fmt)
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

Make-Icon 192 "icon-192.png" 0.58
Make-Icon 512 "icon-512.png" 0.58
Make-Icon 512 "icon-maskable-512.png" 0.42   # smaller glyph stays inside the maskable safe zone
Make-Icon 180 "apple-touch-icon.png" 0.58
