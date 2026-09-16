"""Apply the requested POSCO palette to editable deck/demo sources."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
colors={
'#DADFD8':'#DEE7EE','#F6F3EB':'#F5F8FB','#E7EDE3':'#E8F1F7',
'#18564E':'#05507D','#193D37':'#17364A','#425E56':'#405A6D',
'#52645D':'#506474','#B4C4B7':'#B9CBD8','#CED8CD':'#D5E1E9',
'#A83F2A':'#076797','#E8BC54':'#A9DFFA','#E4E5D9':'#DEEAF2',
'#E4EADC':'#E5F1F9','#FAF8F1':'#FFFFFF','#89A994':'#8EAABF',
'#E6EBDF':'#E8F3FA','#B5C5B6':'#BDD3E2','#B7CBBB':'#9FCADE',
'#E7EDE2':'#E8F3FA','#F1E8D4':'#EDF2F7','#173C37':'#14354C',
'#C4D8C9':'#CFDFEB','#BBD3C2':'#C4DAE9','#E5EADD':'#E6F1F8',
'#E7ECDF':'#E8F3FA','#F9F7EF':'#FFFFFF','#A3C0AE':'#7DB5D4',
'#F3F3E8':'#F3F8FC','#DEE4D7':'#DCE9F2','#E3EBDC':'#E1F0F9',
'#E1E9DA':'#E1EFF8','#F0E3C7':'#E5F0F8','#EEF0E6':'#EAF2F8',
}
for name in ['build/build_deck.py','demo/summarize.py']:
    p=root/name
    s=p.read_text(encoding='utf-8')
    s=re.sub(r'#[0-9a-fA-F]{6}',lambda m:colors.get(m[0].upper(),m[0]),s)
    if name.endswith('build_deck.py'):
        s=s.replace("ASSETS/'workshop-illustrations.png'","ASSETS/'workshop-illustrations-posco.png'")
        s=s.replace('--coral:', '--accent:').replace('var(--coral)', 'var(--accent)')
        s=s.replace('--yellow:', '--highlight:')
        s=s.replace('--font-mono:', '--posco-light-blue:#00A5E5;--font-mono:',1)
        s=s.replace(".slide:before{content:",".slide:before{content:")
        s=s.replace('border:3px solid var(--brand);border-radius:15px;transform:rotate(-30deg)', 'border:3px solid var(--posco-light-blue);border-radius:15px;transform:rotate(-30deg)')
        s=s.replace('.art{width:100%;aspect-ratio:1.5;background-image:var(--art);','.art{width:100%;aspect-ratio:1.5;')
        s=s.replace("def art(n, alt): return", "def art(n, alt):\n    if n in (0,1,2): alt='포스코 남성 사무직 직원과 AI 협업 장면: '+alt\n    return")
    p.write_text(s,encoding='utf-8')
print('POSCO source palette and illustration reference updated')
