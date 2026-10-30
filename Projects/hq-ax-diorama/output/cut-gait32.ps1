$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing.Common,System.Drawing.Primitives,System.Private.Windows.Core,System.Private.Windows.GdiPlus -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
public static class Gait32Cutter {
 static int[] Cuts(Bitmap img,bool vertical,int cells){int length=vertical?img.Height:img.Width,across=vertical?img.Width:img.Height;var cuts=new int[cells+1];cuts[cells]=length;for(int i=1;i<cells;i++){int expect=i*length/cells,min=int.MaxValue,best=expect;for(int p=expect-length/(cells*4);p<=expect+length/(cells*4);p++){int sum=0;for(int q=0;q<across;q++)if((vertical?img.GetPixel(q,p):img.GetPixel(p,q)).A>64)sum++;if(sum<min||(sum==min&&Math.Abs(p-expect)<Math.Abs(best-expect))){min=sum;best=p;}}cuts[i]=best;}return cuts;}
 public static void Cut(string source,string target,string key,int cols){using(var sheet=new Bitmap(source))using(var atlas=new Bitmap(cols*256,1024,PixelFormat.Format32bppArgb))using(var g=Graphics.FromImage(atlas)){
 var xs=Cuts(sheet,false,cols);var ys=Cuts(sheet,true,4);var bounds=new Rectangle[cols*4];var heights=new int[cols*4];var anchors=new double[cols*4];
 for(int n=0;n<cols*4;n++){int col=n%cols,row=n/cols,l=xs[col+1],r=xs[col],t=ys[row+1],b=ys[row];for(int y=ys[row];y<ys[row+1];y++)for(int x=xs[col];x<xs[col+1];x++)if(sheet.GetPixel(x,y).A>64){l=Math.Min(l,x);r=Math.Max(r,x);t=Math.Min(t,y);b=Math.Max(b,y);}if(r<l)throw new Exception("Empty frame");bounds[n]=new Rectangle(l,t,r-l+1,b-t+1);heights[n]=b-t+1;long sum=0,count=0;for(int y=t;y<t+(b-t)*.38;y++)for(int x=l;x<=r;x++)if(sheet.GetPixel(x,y).A>128){sum+=x;count++;}anchors[n]=count>0?(double)sum/count:(l+r)*.5;}
 Array.Sort(heights);double scale=200.0/heights[cols*2];g.Clear(Color.Transparent);
 for(int n=0;n<cols*4;n++){var b=bounds[n];int w=(int)Math.Round(b.Width*scale),h=(int)Math.Round(b.Height*scale),x=(int)Math.Round(128+(b.Left-anchors[n])*scale),y=244-h;if(x<0||x+w>256||y<0)throw new Exception("Sprite clipping: "+key+n);using(var frame=new Bitmap(256,256,PixelFormat.Format32bppArgb))using(var fg=Graphics.FromImage(frame)){fg.Clear(Color.Transparent);fg.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;fg.DrawImage(sheet,new Rectangle(x,y,w,h),b,GraphicsUnit.Pixel);frame.Save(Path.Combine(target,key+"-"+n+".png"),ImageFormat.Png);g.DrawImageUnscaled(frame,(n%cols)*256,(n/cols)*256);}}
 atlas.Save(Path.Combine(target,"..",key+"-atlas.png"),ImageFormat.Png);
 }}
}
'@
$assets=Join-Path $PSScriptRoot 'assets'
$frames=Join-Path $assets 'gait32-parts'
New-Item -ItemType Directory -Force $frames | Out-Null
foreach($key in @('employee-a','employee-b','ai')){foreach($part in @('mid','quarter')){$cols=if($part -eq 'mid'){4}else{8};[Gait32Cutter]::Cut((Join-Path $assets "$key-$part-sheet.png"),$frames,"$key-$part",$cols)}}
$finalFrames=Join-Path $assets 'gait32-frames'
New-Item -ItemType Directory -Force $finalFrames | Out-Null
foreach($key in @('employee-a','employee-b','ai')){
 $base=[System.Drawing.Bitmap]::new((Join-Path $assets "$key-gait-atlas.png"))
 $mid=[System.Drawing.Bitmap]::new((Join-Path $assets "$key-mid-atlas.png"))
 $quarter=[System.Drawing.Bitmap]::new((Join-Path $assets "$key-quarter-atlas.png"))
 $atlas=[System.Drawing.Bitmap]::new(2048,2048)
 $graphics=[System.Drawing.Graphics]::FromImage($atlas)
 $graphics.Clear([System.Drawing.Color]::Transparent)
 for($n=0;$n -lt 64;$n++){
  $motion=[int][Math]::Floor($n/32);$frame=$n%32;$keyFrame=[int][Math]::Floor($frame/4);$phase=$frame%4
  if($phase -eq 0){$source=$base;$sourceIndex=$motion*8+$keyFrame;$cols=4}
  elseif($phase -eq 2){$source=$mid;$sourceIndex=$motion*8+$keyFrame;$cols=4}
  else{$source=$quarter;$sourceIndex=$motion*16+$keyFrame*2+[int]($phase -eq 3);$cols=8}
  $sourceRect=[System.Drawing.Rectangle]::new(($sourceIndex%$cols)*256,[int][Math]::Floor($sourceIndex/$cols)*256,256,256)
  $tile=[System.Drawing.Bitmap]::new(256,256);$tileGraphics=[System.Drawing.Graphics]::FromImage($tile)
  $tileGraphics.DrawImage($source,[System.Drawing.Rectangle]::new(0,0,256,256),$sourceRect,[System.Drawing.GraphicsUnit]::Pixel)
  $motionName=if($motion -eq 0){'walk'}else{'carry'}
  $tile.Save((Join-Path $finalFrames "$key-$motionName-$frame.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.DrawImageUnscaled($tile,($n%8)*256,[int][Math]::Floor($n/8)*256)
  $tileGraphics.Dispose();$tile.Dispose()
 }
 $atlas.Save((Join-Path $assets "$key-gait32-atlas.png"),[System.Drawing.Imaging.ImageFormat]::Png)
 $graphics.Dispose();$atlas.Dispose();$base.Dispose();$mid.Dispose();$quarter.Dispose()
}
Write-Output '192 gait frames assembled: 3 characters x 2 motions x 32 frames.'
