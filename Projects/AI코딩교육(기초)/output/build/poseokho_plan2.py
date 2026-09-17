"""Add a distinct hoodie Poseokho companion to every named example slide."""
from pathlib import Path
import base64
A=Path(__file__).resolve().parents[1]/'assets/poseokho'
def add_companions(slides):
    for s in slides:
        if '포석호' not in s['body']+s['title']+s['sub']:
            continue
        body=s['body']
        if 'request-lab' in body: pose,motion='laptop','bob'
        elif 'revision' in body: pose,motion='think','tilt'
        elif 'api-route' in body: pose,motion='present','sway'
        elif 'final-scene' in body: pose,motion='celebrate','bounce'
        elif 'web-preview' in body: pose,motion='checklist','pulse'
        else: pose,motion='wave','sway'
        data=base64.b64encode((A/f'{pose}.png').read_bytes()).decode()
        s['theme']+=' has-poseokho'
        s['body']+=f'<figure class="poseokho-companion motion-{motion}" data-pose="{pose}" aria-label="후드 차림의 포석호"><img src="data:image/png;base64,{data}" alt="" draggable="false"></figure>'
    return slides
