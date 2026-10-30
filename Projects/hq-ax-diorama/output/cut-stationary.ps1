$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing.Common,System.Drawing.Primitives,System.Private.Windows.Core,System.Private.Windows.GdiPlus -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
public static class StationaryCutter {
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
$frames=Join-Path $assets 'stationary-frames'
New-Item -ItemType Directory -Force $frames | Out-Null
[StationaryCutter]::Cut((Join-Path $assets 'employee-b-stationary-sheet.png'),$frames,'employee-b-stationary',4)
$source=[System.Drawing.Bitmap]::new((Join-Path $assets 'employee-b-stationary-atlas.png'))
$base=[System.Drawing.Bitmap]::new((Join-Path $assets 'employee-b-atlas.png'))
$atlas=[System.Drawing.Bitmap]::new(1024,1536)
$g=[System.Drawing.Graphics]::FromImage($atlas)
$g.DrawImageUnscaled($base,0,0)
$g.CompositingMode=[System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$rows=@(0,3,4,5)
for($i=0;$i -lt 4;$i++){
 $g.DrawImage($source,[System.Drawing.Rectangle]::new(0,$rows[$i]*256,1024,256),[System.Drawing.Rectangle]::new(0,$i*256,1024,256),[System.Drawing.GraphicsUnit]::Pixel)
}
$atlas.Save((Join-Path $assets 'employee-b-consistent-atlas.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$atlas.Dispose();$base.Dispose();$source.Dispose()
