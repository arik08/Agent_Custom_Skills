"""160 BPM dynamic stomp-and-clap opening. No melodic, chord or bass instrument.
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
SR, SECONDS, BPM = 44100, 15, 160
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


# Each clap is several slightly staggered palms, with a short stereo room.
# No pitched instruments, chord bed, or continuous cymbal wash.
def clap(group=False):
    length=round(.23*SR)
    result=np.zeros((length,2))
    for voice in range(5 if group else 3):
        delay=round((voice*.006+rng.uniform(0,.004))*SR)
        t=np.arange(length-delay)/SR
        noise=filtered(rng.normal(size=len(t)),[720+voice*80,6100],'bandpass')
        body=filtered(rng.normal(size=len(t)),[350,1600],'bandpass')
        pulse=(noise*.80+body*.32)*np.exp(-t*(48 if group else 64))
        pulse*=np.minimum(t/.0007,1)*np.minimum((t[-1]-t)/.025,1)
        pan=rng.uniform(-.55,.55)
        result[delay:]+=pulse[:,None]*np.sqrt([1-pan,1+pan])
    return normal(result)

claps=[clap(False) for _ in range(6)]
groups=[clap(True) for _ in range(4)]

def hit(name,beat,gain=1):
    at=beat*BEAT
    if name=='K':
        put('stomp-kick',kick,at,gain)
        put('stomp-body',impact,at,.19*gain)
    elif name=='C':
        put('handclap',claps[len(events)%len(claps)],at,.62*gain)
    elif name=='G':
        put('group-handclap',groups[len(events)%len(groups)],at,.70*gain)
        put('snare-accent',snare,at,.23*gain)
    elif name=='T':
        put('dry-drum',tom,at,.43*gain,(-.2 if len(events)%2 else .2))
    else:
        put('closed-hat',hat(),at,.055*gain,.15)

# Five distinct phrases: opening identity, response, build, break, final logo.
# Tuple = instrument, beat within the 3-second phrase, strength.
phrases=[
 [('K',0,1),('K',1,.72),('G',2,.9),('C',3.5,.50),('K',4,.9),('K',5,.66),('G',6,1),('C',7,.55),('C',7.5,.70)],
 [('K',0,1),('C',1,.65),('G',2,1),('C',2.5,.55),('K',3,.74),('K',4,.9),('C',5,.64),('G',6,1),('T',7,.60),('T',7.5,.8)],
 [('K',0,1),('T',.75,.6),('C',1.5,.65),('G',2,1),('K',3,.8),('C',3.5,.6),('K',4,.9),('T',4.75,.7),('C',5.5,.65),('G',6,1),('C',6.5,.6),('T',7,.7)],
 # Start the phrase with space, then rebuild toward the logo at 12 seconds.
 [('C',1,.65),('K',2,.9),('C',3,.70),('K',4,1),('G',5,1),('T',6,.65),('C',6.5,.7),('T',7,.75),('G',7.5,.9)],
 [('K',0,1.1),('G',0,1),('K',1,.8),('C',1.5,.75),('G',2,1),('T',3,.8),('K',4,1),('C',4.5,.8),('T',5,.72),('C',5.25,.75),('T',5.5,.85)]
]
for phrase,pattern in enumerate(phrases):
    for name,beat,gain in pattern:
        hit(name,phrase*8+beat,gain)
    if phrase in [1,2,4]:
        for beat in [.5,1.5,2.5,3.5,4.5]:
            hit('H',phrase*8+beat,.75)

for cut in [1.875,3.375,6.375,9.375,12]:
    put('cut-drum-accent',impact,cut,.21)
END=14.25
put('ending-kick',kick,END,1.1)
put('ending-group-clap',groups[0],END,.85)
put('ending-snare',snare,END,.32)
put('ending-impact',impact,END,.53)

# Very short room reflections preserve body without the previous long tail.
dry=mix.copy()
for delay,gain in [(.037,.075),(.061,.035)]:
    shift=round(delay*SR)
    mix[shift:] += dry[:-shift,::-1]*gain
mix=normal(mix)*.86
mix*=np.minimum((N-1-np.arange(N))/(.12*SR),1)[:,None]
dest=OUT/'audio'/'opening-drums.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0',
    '-af','acompressor=threshold=0.4:ratio=2:attack=12:release=55,loudnorm=I=-13:TP=-1.5:LRA=7',
    '-ar',str(SR),'-codec:a','libmp3lame','-b:a','224k','-metadata',
    'comment=P-Harness percussion-only opening. Includes edited Mixkit Sound Effects, under Mixkit Sound Effects Free License.',
    str(dest)],input=mix.astype('<f4').tobytes(),check=True)
decoded=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(dest),
    '-f','f32le','-ar',str(SR),'-ac','2','pipe:1']),dtype='<f4').reshape(-1,2)
report={'track':'stomp-clap-v6','bpm':BPM,'duration_seconds':len(decoded)/SR,'channels':2,
    'instruments':sorted(set(e['instrument'] for e in events)),
    'melodic_layers':0,'pitched_bass_layers':0,'source_music_tracks':0,
    'peak_dbfs':float(20*np.log10(np.max(np.abs(decoded)))),
    'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(decoded**2)))),
    'clipped_samples':int(np.sum(np.abs(decoded)>=1)),
    'ending_hit_seconds':END,'file_bytes':dest.stat().st_size,'speaker_listening_verified':False,'handclap_hits':sum('clap' in e['instrument'] for e in events),'phrases':['stomp-clap identity','call and response','denser build','break and rebuild','logo hits']}
(OUT/'validation'/'audio-drums-checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
