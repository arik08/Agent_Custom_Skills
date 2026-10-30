"""128 BPM percussion-only opening. No melodic, chord or bass instrument.
Drum hits: Mixkit SFX 579 (first snare only), 558 (dry drum), 563 (impact).
Licensed under Mixkit Sound Effects Free License for this audiovisual end product.
"""
from pathlib import Path
import subprocess
import json
import numpy as np
from scipy.signal import butter, sosfilt

OUT = Path(__file__).resolve().parent.parent
SOURCE = OUT.parents[1]/'input'/'motion-audio'/'mixkit-drums'
SR, SECONDS, BPM = 44100, 15, 128
N, BEAT = SR*SECONDS, 60/BPM
rng = np.random.default_rng(710)
mix = np.zeros((N,2))
events = []


def filtered(x,hz,kind='lowpass'):
    return sosfilt(butter(2,hz,btype=kind,fs=SR,output='sos'),x,axis=0)


def normal(x):
    return x/max(.001,np.max(np.abs(x)))


def load(id,duration,cutoff=11000):
    raw = subprocess.check_output(['ffmpeg','-v','error','-i',str(SOURCE/f'{id}.mp3'),
        '-f','f32le','-ar',str(SR),'-ac','2','pipe:1'])
    x = np.frombuffer(raw,dtype='<f4').reshape(-1,2).astype(float)
    onset = np.flatnonzero(np.max(np.abs(x),axis=1)>.02)
    x = x[max(0,onset[0]-44):][:round(duration*SR)]
    x = normal(filtered(x,cutoff))
    t = np.arange(len(x))/SR
    edge = np.minimum(t/.001,1)*np.minimum((t[-1]-t)/.035,1)
    return x*edge[:,None]


def put(name,x,at,gain=1,pan=0):
    if at>=SECONDS:
        return
    if x.ndim==1:
        x=np.column_stack([x,x])
    start=round(at*SR); count=min(len(x),N-start)
    mix[start:start+count] += x[:count]*gain*np.sqrt([1-pan,1+pan])
    events.append({'instrument':name,'at':round(at,4)})


# Isolate one snare from the source, not the source's original comic fill.
snare=load(579,.19,8500)
tom=load(558,.29,5200)
impact=load(563,.80,2600)
t=np.arange(round(.24*SR))/SR
# Percussive kick body only: short pitch decay with no sustained musical note.
phase=2*np.pi*(53*t+95*.014*(1-np.exp(-t/.014)))
kick=np.sin(phase)*np.exp(-t*19)+.20*np.sin(phase*2)*np.exp(-t*40)
kick+=.05*filtered(rng.normal(size=len(t)),4500)*np.exp(-t*240)
kick=normal(np.tanh(kick*1.3))*np.minimum(t/.001,1)*np.minimum((t[-1]-t)/.022,1)


def hat():
    t=np.arange(round(.055*SR))/SR
    x=filtered(rng.normal(size=len(t)),[5500,11000],'bandpass')
    return normal(x*np.exp(-t*78))*np.minimum(t/.001,1)*np.minimum((t[-1]-t)/.01,1)


END=14.0625
for bar in range(8):
    at=bar*4*BEAT
    # Punchy backbeat, with syncopation rather than a nonstop kick on every beat.
    for beat,gain in [(0,.91),(1.5,.65),(2,.83),(3.25,.61)]:
        when=at+beat*BEAT
        if when<END:
            put('kick',kick,when,gain)
    for beat in [1,3]:
        when=at+beat*BEAT
        if when<END:
            put('snare',snare,when,.62 if bar<4 else .68)
    for eighth in range(8):
        when=at+eighth*.5*BEAT
        if when<END:
            put('closed-hat',hat(),when,.055 if eighth%2==0 else .09,.16)
    if bar in [1,3,5,6]:
        for beat,gain,pan in [(2.75,.22,-.3),(3.5,.31,.2),(3.75,.4,-.12)]:
            when=at+beat*BEAT
            if when<END:
                put('dry-drum',tom,when,gain,pan)

# The video cuts get a short drum accent; no melodic stings or tonal risers.
for cut in [0,1.875,3.375,6.375,9.375,12]:
    put('low-drum-impact',impact,cut,.32 if cut else .44)
for offset,gain,pan in [(.3516,.25,-.25),(.2344,.34,.25),(.1172,.42,0)]:
    put('final-fill',tom,END-offset,gain,pan)
put('ending-kick',kick,END,1)
put('ending-snare',snare,END,.72)
put('ending-impact',impact,END,.68)

# Very short room reflections preserve body without the previous long tail.
dry=mix.copy()
for delay,gain in [(.037,.075),(.061,.035)]:
    shift=round(delay*SR)
    mix[shift:] += dry[:-shift,::-1]*gain
mix=normal(mix)*.86
mix*=np.minimum((N-1-np.arange(N))/(.12*SR),1)[:,None]
dest=OUT/'audio'/'opening-drums.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0',
    '-af','acompressor=threshold=0.4:ratio=2:attack=12:release=55,loudnorm=I=-14:TP=-1.5:LRA=7',
    '-ar',str(SR),'-codec:a','libmp3lame','-b:a','224k','-metadata',
    'comment=P-Harness percussion-only opening. Includes edited Mixkit Sound Effects, under Mixkit Sound Effects Free License.',
    str(dest)],input=mix.astype('<f4').tobytes(),check=True)
decoded=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(dest),
    '-f','f32le','-ar',str(SR),'-ac','2','pipe:1']),dtype='<f4').reshape(-1,2)
report={'track':'drums-v5','bpm':BPM,'duration_seconds':len(decoded)/SR,'channels':2,
    'instruments':sorted(set(e['instrument'] for e in events)),
    'melodic_layers':0,'pitched_bass_layers':0,'source_music_tracks':0,
    'peak_dbfs':float(20*np.log10(np.max(np.abs(decoded)))),
    'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(decoded**2)))),
    'clipped_samples':int(np.sum(np.abs(decoded)>=1)),
    'ending_hit_seconds':END,'file_bytes':dest.stat().st_size,'speaker_listening_verified':False}
(OUT/'validation'/'audio-drums-checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
