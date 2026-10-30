$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing.Common,System.Drawing.Primitives,System.Private.Windows.Core,System.Private.Windows.GdiPlus -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
public static class SpriteCutter {
 static int[] Cuts(Bitmap img,int count,bool vertical) {
  int length=vertical?img.Height:img.Width, across=vertical?img.Width:img.Height;var cuts=new int[count+1];cuts[count]=length;
  for(int i=1;i<count;i++){int expected=i*length/count,best=expected,min=int.MaxValue;int range=vertical?35:90;
   for(int p=expected-range;p<=expected+range;p++){int total=0;for(int q=0;q<across;q++)if((vertical?img.GetPixel(q,p):img.GetPixel(p,q)).A>64)total++;
    if(total<min||(total==min&&Math.Abs(p-expected)<Math.Abs(best-expected))){min=total;best=p;}}
   cuts[i]=best;
  }return cuts;
 }
 public static string Cut(string source, string target, string key) {
  using(var sheet=new Bitmap(source)) using(var atlas=new Bitmap(1024,1536,PixelFormat.Format32bppArgb)) using(var ag=Graphics.FromImage(atlas)) {
   ag.Clear(Color.Transparent); var names=new[]{"idle","walk","carry","analyze","report","celebrate"};
   double[] anchors=new double[4]; string report="";var xs=Cuts(sheet,4,false);var ys=Cuts(sheet,6,true);
   for(int row=0;row<6;row++) for(int col=0;col<4;col++) {
    int x0=xs[col],x1=xs[col+1],y0=ys[row],y1=ys[row+1];
    int left=x1,top=y1,right=x0,bottom=y0,count=0;
    for(int y=y0;y<y1;y++)for(int x=x0;x<x1;x++)if(sheet.GetPixel(x,y).A>32){left=Math.Min(left,x);right=Math.Max(right,x);top=Math.Min(top,y);bottom=Math.Max(bottom,y);count++;}
    if(count<100)throw new Exception("Empty sprite: "+key+row+col);
    if(row==0)anchors[col]=(left+right)*.5;
    int w=right-left+1,h=bottom-top+1,dx=(int)Math.Round(128+left-anchors[col]),dy=244-h;
    if(dx<0||dx+w>256||dy<0)throw new Exception("Sprite exceeds frame: "+key+row+col+" bounds="+left+","+top+","+w+","+h+" target="+dx+","+dy+" anchor="+anchors[col]);
    using(var frame=new Bitmap(256,256,PixelFormat.Format32bppArgb))using(var fg=Graphics.FromImage(frame)){
     fg.Clear(Color.Transparent);fg.DrawImage(sheet,new Rectangle(dx,dy,w,h),new Rectangle(left,top,w,h),GraphicsUnit.Pixel);
     frame.Save(Path.Combine(target,key+"-"+names[row]+"-"+col+".png"),ImageFormat.Png);
     ag.DrawImageUnscaled(frame,col*256,row*256);
    }
    report+=key+","+names[row]+","+col+","+left+","+top+","+w+","+h+","+dx+","+dy+","+(top==y0||bottom==y1-1)+"\n";
   }
   atlas.Save(Path.Combine(target,"..",key+"-atlas.png"),ImageFormat.Png);return report;
  }
 }
}
'@
$assetRoot = Join-Path $PSScriptRoot 'assets'
$framesRoot = Join-Path $assetRoot 'frames'
New-Item -ItemType Directory -Force $framesRoot | Out-Null
$report = "character,motion,frame,sourceX,sourceY,width,height,targetX,targetY,touchesRowBoundary`n"
foreach ($key in @('employee-a','employee-b','ai')) {
 $report += [SpriteCutter]::Cut((Join-Path $assetRoot "$key-sheet.png"), $framesRoot, $key)
}
$report | Set-Content -Encoding utf8 (Join-Path $assetRoot 'frames.csv')
Write-Output 'Saved 72 transparent PNG frames and 3 normalized atlases.'
