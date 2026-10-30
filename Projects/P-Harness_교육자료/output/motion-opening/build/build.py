"""Embed local typefaces and soundtrack into the offline single-file opening."""
from pathlib import Path
import base64

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
ASSETS = ROOT / 'Projects' / 'AI코딩교육(기초)' / 'output' / 'assets'
html = (HERE / 'opening.template.html').read_text(encoding='utf-8')
for weight, name in [('400', '4Regular'), ('600', '6SemiBold'), ('800', '8ExtraBold')]:
    data = (ASSETS / f'Paperlogy-{name}.woff2').read_bytes()
    html = html.replace(f'__FONT_{weight}__', base64.b64encode(data).decode('ascii'))
soundtrack = (HERE.parent / 'audio' / 'tech-promo-intro.mp3').read_bytes()
html = html.replace('__AUDIO_MP3__', base64.b64encode(soundtrack).decode('ascii'))
dest = HERE.parent / 'p-harness-opening.html'
dest.write_text(html, encoding='utf-8')
print(f'Built: {dest} ({dest.stat().st_size:,} bytes)')
