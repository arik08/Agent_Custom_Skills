from pathlib import Path
from PIL import Image
O=Path(__file__).resolve().parents[1]
A=O/'assets/poseokho'; A.mkdir(exist_ok=True)
src=A/'poseokho-hoodie-sheet.png'
im=Image.open(src).convert('RGBA')
for i,name in enumerate(['wave','laptop','think','present','celebrate','checklist']):
    x=i%3*512;y=i//3*512
    tile=im.crop((x,y,x+512,y+512))
    box=tile.getchannel('A').point(lambda v:255 if v>20 else 0).getbbox()
    tile=tile.crop((max(0,box[0]-12),max(0,box[1]-12),min(512,box[2]+12),min(512,box[3]+12)))
    tile.save(A/f'{name}.png')
    print(name,tile.size,tile.getchannel('A').getextrema())
