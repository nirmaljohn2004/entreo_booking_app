Add-Type -AssemblyName System.Drawing

$src = "C:\Users\nirma\.gemini\antigravity\brain\f861a983-b812-40e4-b4b5-31930e179fc4\.user_uploaded\media_1793190566098_a3e01f20.jpg"
$outDir = "c:\Btech\Freelance\booking_platform\public\images\cities"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height

Write-Host "Source image size: ${w}x${h}"

# Notice there is a thin white divider border between the quadrants.
# Let's inspect where the split occurs. Typically exactly at w/2 and h/2.
$halfW = [int]($w / 2)
$halfH = [int]($h / 2)

# Slight inset to remove any white border if present (e.g. 2-4 pixels)
$borderMargin = 4

# Quadrant definitions
# Top-Left: Berlin
# Top-Right: Hamburg
# Bottom-Left: Munich
# Bottom-Right: Cologne
$quadrants = @(
    @{ Name = "berlin.png";   X = 0;                  Y = 0;                  W = ($halfW - $borderMargin); H = ($halfH - $borderMargin) },
    @{ Name = "hamburg.png";  X = ($halfW + $borderMargin); Y = 0;            W = ($w - $halfW - $borderMargin); H = ($halfH - $borderMargin) },
    @{ Name = "munich.png";   X = 0;                  Y = ($halfH + $borderMargin); W = ($halfW - $borderMargin); H = ($h - $halfH - $borderMargin) },
    @{ Name = "cologne.png";  X = ($halfW + $borderMargin); Y = ($halfH + $borderMargin); W = ($w - $halfW - $borderMargin); H = ($h - $halfH - $borderMargin) }
)

foreach ($q in $quadrants) {
    $rect = New-Object System.Drawing.Rectangle($q.X, $q.Y, $q.W, $q.H)
    $bmp = New-Object System.Drawing.Bitmap($q.W, $q.H)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $q.W, $q.H)
    $g.DrawImage($img, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $destPath = Join-Path $outDir $q.Name
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved $($q.Name) (${q.W}x${q.H}) to $destPath"
}

$img.Dispose()
Write-Host "All 4 cities cropped successfully!"

