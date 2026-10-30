Add-Type -AssemblyName System.Drawing

$src = "C:\Users\nirma\.gemini\antigravity\brain\f861a983-b812-40e4-b4b5-31930e179fc4\.user_uploaded\media_1793269309194_f407a819.jpg"
if (-not (Test-Path $src)) {
    $src = "C:\Users\nirma\.gemini\antigravity\brain\f861a983-b812-40e4-b4b5-31930e179fc4\.user_uploaded\media_1793268803600_98040787.jpg"
}
$outDir = "c:\Btech\Freelance\booking_platform\public\images\events"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$img = [System.Drawing.Image]::FromFile($src)
$w = $img.Width
$h = $img.Height

Write-Host "Source event collage size: ${w}x${h}"

$halfW = [int]($w / 2)
$halfH = [int]($h / 2)

# Border margin to cleanly remove the white cross divider lines
$borderMargin = 4

# Quadrant mapping:
# Top-Left: LEA (Concert / Singer)
# Top-Right: KlangKollektiv (Techno / Electronic Clubbing)
# Bottom-Left: Felix Lobrecht (Stand-up Comedy)
# Bottom-Right: Cultural / Traditional / World Music & Dance
$quadrants = @(
    @{ Name = "lea.png";             X = 0;                          Y = 0;                          W = ($halfW - $borderMargin);         H = ($halfH - $borderMargin) },
    @{ Name = "klangkollektiv.png";   X = ($halfW + $borderMargin);  Y = 0;                          W = ($w - $halfW - $borderMargin); H = ($halfH - $borderMargin) },
    @{ Name = "felix-lobrecht.png";  X = 0;                          Y = ($halfH + $borderMargin);  W = ($halfW - $borderMargin);         H = ($h - $halfH - $borderMargin) },
    @{ Name = "cultural-dance.png";  X = ($halfW + $borderMargin);  Y = ($halfH + $borderMargin);  W = ($w - $halfW - $borderMargin); H = ($h - $halfH - $borderMargin) }
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
Write-Host "All 4 event tiles cropped successfully!"
