"""Prepare a music excerpt synchronized to the P-Harness opening.

Running Out of Time — Ahjay Stelino / Mixkit Stock Music Free License.
For use in this audiovisual opening only; not a standalone music release.
Source and observed license are saved in input/motion-audio/mixkit.
"""
from pathlib import Path
import subprocess
import json
import numpy as np

OUT = Path(__file__).resolve().parent.parent
SOURCE = OUT.parents[1]/'input'/'motion-audio'/'mixkit'/'running-out-of-time-77.mp3'
DEST = OUT/'audio'/'opening-corporate.mp3'
START, DURATION, SR = 15.94, 15, 44100
# Enter after the introductory build, with the rhythm and melody established.
# Preserve the original performance; only trim, fade edges and set playback level.
subprocess.run(['ffmpeg','-v','error','-y','-ss',str(START),'-i',str(SOURCE),
    '-t',str(DURATION),'-af','afade=t=in:d=0.008,afade=t=out:st=14.55:d=0.45,loudnorm=I=-14.5:TP=-1.8:LRA=7',
    '-ar',str(SR),'-ac','2','-codec:a','libmp3lame','-b:a','224k','-metadata',
    'comment=Excerpt for P-Harness opening. Running Out of Time by Ahjay Stelino / Mixkit Stock Music Free License.',
    str(DEST)],check=True)
decoded = np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(DEST),
    '-f','f32le','-ar',str(SR),'-ac','2','pipe:1']),dtype='<f4').reshape(-1,2)
report = {'track':'corporate-v4','title':'Running Out of Time','author':'Ahjay Stelino',
    'source_start_seconds':START,'duration_seconds':len(decoded)/SR,'sample_rate':SR,'channels':2,
    'peak_dbfs':float(20*np.log10(np.max(np.abs(decoded)))),
    'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(decoded**2)))),
    'clipped_samples':int(np.sum(np.abs(decoded)>=1)),
    'file_bytes':DEST.stat().st_size,'speaker_listening_verified':False}
(OUT/'validation'/'audio-corporate-checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
