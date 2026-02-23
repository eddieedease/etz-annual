Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\eddie\.gemini\antigravity\brain\tempmediaStorage\media__1771836991831.png')
$bmp = new-object System.Drawing.Bitmap($img)
$w = $bmp.Width
$h = $bmp.Height
$y = [int]($h / 2)
for($i=1; $i -le 10; $i++) {
   $x = [int]($w * $i / 11)
   $color = $bmp.GetPixel($x, $y)
   $hex = "#{0:X2}{1:X2}{2:X2}" -f $color.R, $color.G, $color.B
   Write-Host "X: $x - $hex ($($color.R), $($color.G), $($color.B))"
}
