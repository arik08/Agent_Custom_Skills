"""Build a separate 25-second opening, preserving the original version."""
from pathlib import Path
import base64, json, subprocess, shutil
HERE=Path(__file__).resolve().parent
OUT=HERE.parent
ASSETS=HERE.parents[4]/'Projects'/'AI코딩교육(기초)'/'output'/'assets'
SOURCE=OUT.parents[1]/'input'/'motion-audio'/'user-provided'/'Pulsing Groove.mp3'
AUDIO=OUT/'audio'/'pulsing-groove.mp3'
# Use decoded sample length, excluding MP3 container padding.
pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(SOURCE),'-f','s16le','-ac','1','-ar','48000','pipe:1'])
length=len(pcm)/96000
film_duration=26
scale=length/25
starts=[round(v*scale,6) for v in [0,3,6,11.8,16.8,21.8]]
rates=[round(v/scale,9) for v in [.85,.62,.75,.84,.50,1]]
shutil.copyfile(SOURCE,AUDIO)
html=(HERE/'opening.template.html').read_text(encoding='utf-8')
html=html.replace('DURATION=16,STARTS=[0,1.875,3.375,6.375,9.375,12]', f'DURATION={film_duration},STARTS={json.dumps(starts)}')
# Spread each scene's existing animation over its allocated time.
# Preserve a short reading beat at the end instead of long frozen holds.
html=html.replace('RATES=[1.65,1.6,1.5,1.55,1.5,1.5]', f'RATES={json.dumps(rates)}')
html=html.replace('local<.26','local<.42').replace('out(local/.26)','out(local/.42)')
# Replace only the connection sequence in the longer cut.
start=html.index('  const connect=p(t,2.15,1.2);')
end=html.index("  text('P-HARNESS',1820",start)
html=html[:start]+(HERE/'connections-25s.js').read_text(encoding='utf-8')+html[end:]
html=html.replace('16 SEC',f'{film_duration} SEC').replace('00:00 / 00:16',f'00:00 / 00:{film_duration:.1f}').replace('max="16"',f'max="{film_duration}"').replace('16초 오프닝',f'{film_duration}초 오프닝')
html=html.replace(' / 00:${DURATION}', ' / 00:${DURATION.toFixed(1)}')
html=html.replace('음악: Tech Promo Intro', '음악: Pulsing Groove')
html=html.replace("String(Math.floor(position)).padStart(2,'0')", "position.toFixed(1).padStart(4,'0')")
html=html.replace('// User-provided Tech Promo Intro, embedded as base64 audio.', '// User-provided Pulsing Groove, embedded as base64 audio.')
html=html.replace('<title>P-Harness — 교육 오프닝</title>','<title>P-Harness — 교육 오프닝 · 26초</title>')
html=html.replace('tech-promo-intro-v8-full','pulsing-groove-full')
html=html.replace('// Full original soundtrack, embedded without trimming or added fade.','// Full original Pulsing Groove; scene timings follow its decoded duration.')
for weight,name in [('400','4Regular'),('600','6SemiBold'),('800','8ExtraBold')]:
 html=html.replace(f'__FONT_{weight}__',base64.b64encode((ASSETS/f'Paperlogy-{name}.woff2').read_bytes()).decode('ascii'))
html=html.replace('__AUDIO_MP3__',base64.b64encode(AUDIO.read_bytes()).decode('ascii'))
dest=OUT/'p-harness-opening-25s.html'
dest.write_text(html,encoding='utf-8')
print(f'Built: {dest} ({dest.stat().st_size:,} bytes)')

print(json.dumps({'duration':film_duration,'audio_duration':length,'starts':starts,'rates':rates}))
