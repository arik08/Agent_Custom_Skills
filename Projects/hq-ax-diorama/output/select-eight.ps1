$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
foreach($key in @('employee-a','employee-b','ai')){
 $source=[System.Drawing.Bitmap]::new((Join-Path $PSScriptRoot "assets/$key-fullbody-atlas.png"))
 $atlas=[System.Drawing.Bitmap]::new(1024,1024)
 $g=[System.Drawing.Graphics]::FromImage($atlas)
 for($motion=0;$motion -lt 2;$motion++){
  for($frame=0;$frame -lt 8;$frame++){
   $src=$motion*32+$frame*4;$dest=$motion*8+$frame
   $rect=[System.Drawing.Rectangle]::new(($src%8)*256,[int][Math]::Floor($src/8)*256,256,256)
   $target=[System.Drawing.Rectangle]::new(($dest%4)*256,[int][Math]::Floor($dest/4)*256,256,256)
   $g.DrawImage($source,$target,$rect,[System.Drawing.GraphicsUnit]::Pixel)
  }
 }
 $atlas.Save((Join-Path $PSScriptRoot "assets/$key-fullbody8-atlas.png"),[System.Drawing.Imaging.ImageFormat]::Png)
 $g.Dispose();$atlas.Dispose();$source.Dispose()
}
