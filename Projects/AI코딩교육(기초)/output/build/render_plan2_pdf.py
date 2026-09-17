from pathlib import Path
import pymupdf as fitz
from PIL import Image, ImageDraw
import json
O=Path(__file__).resolve().parents[1]
V=O/'validation/plan2';V.mkdir(parents=True,exist_ok=True)
doc=fitz.open(O/'AI코딩교육_기획안2.pdf')
pages=[]
for i,p in enumerate(doc):
    pix=p.get_pixmap(matrix=fitz.Matrix(.5,.5),alpha=False)
    im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
    im.save(V/f'page-{i+1:02}.png')
    pages.append(im)
for start in range(0,len(pages),8):
    sheet=Image.new('RGB',(1440,4*435),'#c5d3dd')
    draw=ImageDraw.Draw(sheet)
    for k,im in enumerate(pages[start:start+8]):
        x=k%2*720;y=k//2*435
        sheet.paste(im,(x,y+25));draw.text((x+12,y+6),f'PAGE {start+k+1:02}',fill='#14384b')
    sheet.save(V/f'overview-{start//8+1}.png')
texts=[p.get_text() for p in doc]
info={'pages':len(doc),'slide_pages':31,'glossary_pages':len(doc)-31,'blank_pages':[i+1 for i,t in enumerate(texts) if len(t.strip())<30],'page_size':list(doc[0].rect),'responses_detail_in_pdf':'해당 방식과 필요한 기능' in texts[28],'missing_policy_in_pdf':'확인 필요' in texts[18]}
(V/'pdf-check.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False))
