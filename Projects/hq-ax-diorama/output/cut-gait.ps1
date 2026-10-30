$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing.Common,System.Drawing.Primitives,System.Private.Windows.Core,System.Private.Windows.GdiPlus -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
public static class GaitCutter {
 static int[] Cuts(Bitmap img,bool vertical){int length=vertical?img.Height:img.Width,across=vertical?img.Width:img.Height;var cuts=new int[5];cuts[4]=length;for(int i=1;i<4;i++){int expect=i*length/4,min=int.MaxValue,best=expect;for(int p=expect-length/16;p<=expect+length/16;p++){int sum=0;for(int q=0;q<across;q++)if((vertical?img.GetPixel(q,p):img.GetPixel(p,q)).A>64)sum++;if(sum<min||(sum==min&&Math.Abs(p-expect)<Math.Abs(best-expect))){min=sum;best=p;}}cuts[i]=best;}return cuts;}
 public static void Cut(string source,string target,string key){using(var sheet=new Bitmap(source))using(var atlas=new Bitmap(1024,1024,PixelFormat.Format32bppArgb))using(var g=Graphics.FromImage(atlas)){
 var xs=Cuts(sheet,false);var ys=Cuts(sheet,true);var bounds=new Rectangle[16];var heights=new int[16];var anchors=new double[16];
 for(int n=0;n<16;n++){int col=n%4,row=n/4,l=xs[col+1],r=xs[col],t=ys[row+1],b=ys[row];for(int y=ys[row];y<ys[row+1];y++)for(int x=xs[col];x<xs[col+1];x++)if(sheet.GetPixel(x,y).A>64){l=Math.Min(l,x);r=Math.Max(r,x);t=Math.Min(t,y);b=Math.Max(b,y);}if(r<l)throw new Exception("Empty frame");bounds[n]=new Rectangle(l,t,r-l+1,b-t+1);heights[n]=b-t+1;long sum=0,count=0;for(int y=t;y<t+(b-t)*.38;y++)for(int x=l;x<=r;x++)if(sheet.GetPixel(x,y).A>128){sum+=x;count++;}anchors[n]=count>0?(double)sum/count:(l+r)*.5;}
 Array.Sort(heights);double scale=200.0/heights[8];g.Clear(Color.Transparent);
 for(int n=0;n<16;n++){var b=bounds[n];int w=(int)Math.Round(b.Width*scale),h=(int)Math.Round(b.Height*scale),x=(int)Math.Round(128+(b.Left-anchors[n])*scale),y=244-h;if(x<0||x+w>256||y<0)throw new Exception("Sprite clipping: "+key+n);using(var frame=new Bitmap(256,256,PixelFormat.Format32bppArgb))using(var fg=Graphics.FromImage(frame)){fg.Clear(Color.Transparent);fg.InterpolationMode=System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;fg.DrawImage(sheet,new Rectangle(x,y,w,h),b,GraphicsUnit.Pixel);frame.Save(Path.Combine(target,key+"-"+(n<8?"walk":"carry")+"-"+(n%8)+".png"),ImageFormat.Png);g.DrawImageUnscaled(frame,(n%4)*256,(n/4)*256);}}
 atlas.Save(Path.Combine(target,"..",key+"-gait-atlas.png"),ImageFormat.Png);
 }}
}
'@
$assets=Join-Path $PSScriptRoot 'assets'
$frames=Join-Path $assets 'gait-frames'
New-Item -ItemType Directory -Force $frames | Out-Null
foreach($key in @('employee-a','employee-b','ai')){[GaitCutter]::Cut((Join-Path $assets "$key-gait-sheet.png"),$frames,$key)}
Write-Output '48 normalized gait frames; 3 atlases.'
