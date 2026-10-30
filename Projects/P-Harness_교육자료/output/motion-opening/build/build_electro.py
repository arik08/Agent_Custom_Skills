"""160 BPM / 15s electro-pop sting. Tight drums, bass, melodic hook, final hit.
Piano attacks: Alexander Holm, Salamander Grand Piano, CC BY 3.0.
All other instruments are synthesized here. Requires numpy, scipy, ffmpeg.
"""
from pathlib import Path
from functools import lru_cache
import json
import subprocess
import numpy as np
from scipy.signal import butter, sosfilt, resample_poly

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
SAMPLES = OUT.parents[1]/'input'/'motion-audio'/'salamander'
SR, DURATION, BPM = 44100, 15, 160
BEAT, N, TAU = 60/BPM, SR*DURATION, 2*np.pi
rng = np.random.default_rng(93121)
drums, bass, lead, chords, effects = [np.zeros((N, 2)) for _ in range(5)]
sources = {48:'C3',54:'Fs3',57:'A3',60:'C4',63:'Ds4',66:'Fs4',69:'A4',72:'C5',75:'Ds5',78:'Fs5'}


def filtered(x, frequency, kind='lowpass'):
    return sosfilt(butter(2, frequency, btype=kind, fs=SR, output='sos'), x, axis=0)


def normalized(x):
    return x/max(.001, np.max(np.abs(x)))


def time(duration):
    return np.arange(round(duration*SR))/SR


def envelope(t, attack=.003, decay=.15, release=.025):
    return np.minimum(t/attack, 1)*np.exp(-t/decay)*np.clip((t[-1]-t)/release, 0, 1)


def place(bus, x, at, level=1, pan=0):
    if x.ndim == 1:
        x = np.column_stack([x, x])
    start = round(at*SR)
    if start < 0:
        x, start = x[-start:], 0
    count = min(len(x), N-start)
    if count > 0:
        bus[start:start+count] += x[:count]*level*np.sqrt([1-pan, 1+pan])


@lru_cache(None)
def piano(midi):
    source = min(sources, key=lambda n: abs(n-midi))
    raw = subprocess.check_output(['ffmpeg','-v','error','-i',str(SAMPLES/(sources[source]+'.mp3')),
        '-f','f32le','-ar',str(SR),'-ac','2','pipe:1'])
    x = np.frombuffer(raw, dtype='<f4').reshape(-1,2).astype(float)
    x = resample_poly(x, 1000, round(1000*2**((midi-source)/12)))
    onset = np.flatnonzero(np.max(np.abs(x),axis=1)>.006)
    if len(onset):
        x = x[max(0,onset[0]-round(.002*SR)):]
    x = normalized(filtered(x[:round(.48*SR)],4700))
    return x*envelope(np.arange(len(x))/SR,.002,.23,.05)[:,None]


@lru_cache(None)
def pluck(midi, duration=.29):
    t = time(duration)
    hz = 440*2**((midi-69)/12)
    result = np.zeros((len(t),2))
    # Slight detuning and quickly closing harmonics avoid a flat beep timbre.
    for channel,cents in enumerate([-5.5,5.5]):
        f = hz*2**(cents/1200)
        for harmonic in range(1,min(14,int(15000/f))):
            color = np.exp(-harmonic*(.09+t*2))/harmonic**.95
            result[:,channel] += np.sin(TAU*f*harmonic*t)*color
    result = normalized(filtered(result,5800))
    return result*envelope(t,.003,.20,.026)[:,None]


@lru_cache(None)
def bass_note(midi,duration):
    t = time(duration)
    f = 440*2**((midi-69)/12)
    x = np.sin(TAU*f*t)+.37*np.sin(TAU*2*f*t)+.18*np.sin(TAU*3*f*t)+.07*np.sin(TAU*5*f*t)
    return normalized(np.tanh(x*1.35))*envelope(t,.002,.35,.02)


# Kick: body, midrange punch and short beater, audible on laptop speakers.
t = time(.29)
phase = TAU*(51*t+115*.015*(1-np.exp(-t/.015)))
kick = np.sin(phase)*np.exp(-t*16)+.22*np.sin(phase*2)*np.exp(-t*34)
kick += .10*filtered(rng.normal(size=len(t)),4800)*np.exp(-t*330)
kick = normalized(np.tanh(kick*1.65))*np.minimum(t/.0007,1)*np.clip((t[-1]-t)/.016,0,1)
# Snare/clap: body plus short bursts, without a long noisy tail.
t = time(.21)
noise = filtered(rng.normal(size=len(t)),[900,8500],'bandpass')
bursts = np.exp(-t*33)
for offset in [.011,.022]:
    bursts += .48*np.exp(-np.maximum(0,t-offset)*170)*(t>=offset)
snare = .5*noise*bursts
snare += .30*np.sin(TAU*(185*t+22*.02*(1-np.exp(-t/.02))))*np.exp(-t*36)
snare += .10*np.sin(TAU*330*t)*np.exp(-t*47)
snare = normalized(snare)*np.minimum(t/.0006,1)*np.clip((t[-1]-t)/.02,0,1)


def hat(opened=False):
    t = time(.16 if opened else .052)
    x = filtered(rng.normal(size=len(t)),[6000,14000],'bandpass')
    x *= envelope(t,.0006,.050 if opened else .015,.01)
    return normalized(x)


kick_times = []
for beat_index in range(38):
    at = beat_index*BEAT
    if beat_index == 31:  # One-beat pickup before the logo downbeat.
        continue
    place(drums,kick,at,.82)
    kick_times.append(at)
    if beat_index%2:
        place(drums,snare,at+.003,.49)
    if beat_index<37:
        place(drums,hat(beat_index%4==3),at+BEAT/2,.18,.18)
        place(drums,hat(),at+BEAT/4,.046,-.25)
        place(drums,hat(),at+BEAT*.75,.065,.25)
for boundary in [6,9,12]:
    for fraction,gain in [(.50,.13),(.25,.19)]:
        place(drums,snare,boundary-BEAT*fraction,gain,-.1)

# D / Bm / G / A / D; a recognisable 3-second hook with changing answers.
harmonies = [(38,[62,66,69,76]),(35,[62,66,69,74]),(31,[59,62,66,69]),
             (33,[61,64,69,74]),(38,[62,66,69,76])]
motifs = [[74,78,81,78,76,78,74],[74,78,81,83,81,78,76],
          [74,78,81,78,76,74,71],[73,76,81,83,81,76,73],[74,78,81,78,76,78,74]]
hook_beats = [0,.75,1.5,2.5,3.5,4.75,6]
for phrase,(root,voicing) in enumerate(harmonies):
    start = phrase*3
    for offset,interval,length in [(0,0,.26),(.75,0,.14),(1.5,12,.15),(2.5,7,.16),
            (3,0,.24),(4,0,.24),(4.75,0,.14),(5.5,12,.15),(6.5,7,.19)]:
        if start+offset*BEAT >= 14.25:
            continue
        place(bass,bass_note(root+interval,length),start+offset*BEAT,.37)
    for offset in [0,1.5,3,4,5.5,6.5]:
        if start+offset*BEAT >= 14.25:
            continue
        for i,midi in enumerate(voicing):
            place(chords,pluck(midi,.24),start+offset*BEAT+i*.002,.068,(i-1.5)*.19)
    for k,(offset,midi) in enumerate(zip(hook_beats,motifs[phrase])):
        at = start+offset*BEAT
        if at >= 14.25:
            continue
        sound = pluck(midi)
        place(lead,sound,at,.27,-.05 if k%2 else .05)
        place(lead,piano(midi),at,.17)
        if at<13.8:
            place(lead,sound,at+BEAT*.75,.044,.4)

# Duck the pitched parts briefly so each drum transient stays distinct.
duck = np.ones(N)
for at in kick_times:
    start = round(at*SR)
    t = time(.20)
    count = min(len(t),N-start)
    duck[start:start+count] = np.minimum(duck[start:start+count],1-.57*np.exp(-t[:count]/.060))
bass *= duck[:,None]
chords *= duck[:,None]
lead *= (.84+.16*duck)[:,None]
for cut in [1.875,3.375,6.375,9.375,12]:
    t = time(.25)
    air = filtered(rng.normal(size=(len(t),2)),[700,7000],'bandpass')
    air *= np.sin(np.linspace(0,np.pi,len(t)))[:,None]**2
    place(effects,normalized(air),cut-.13,.074)

# Final composed hit, leaving 0.75s for a short release instead of fading a loop.
end_hit = 14.25
place(drums,kick,end_hit,.95)
place(drums,snare,end_hit,.32)
for i,midi in enumerate([50,62,66,69,74]):
    place(chords,pluck(midi,.60),end_hit,.13,(i-2)*.15)
place(bass,bass_note(38,.52),end_hit,.46)
place(lead,piano(74),end_hit,.23)
mix = drums+bass+lead+chords+effects
for delay,gain in [(.047,.09),(.079,.055),(.113,.03)]:
    shift = round(delay*SR)
    mix[shift:] += lead[:-shift,::-1]*gain
mix *= np.minimum(np.arange(N)/(.001*SR),1)[:,None]
mix *= np.minimum((N-1-np.arange(N))/(.20*SR),1)[:,None]
mix = normalized(mix)*.88
(OUT/'audio').mkdir(exist_ok=True)
(OUT/'validation').mkdir(exist_ok=True)
destination = OUT/'audio'/'opening-electro.mp3'
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i','pipe:0',
    '-af','acompressor=threshold=0.35:ratio=2:attack=10:release=65:makeup=1.15,loudnorm=I=-12:TP=-1.3:LRA=5',
    '-ar',str(SR),'-codec:a','libmp3lame','-b:a','224k','-metadata',
    'comment=P-Harness 160 BPM electro ad sting. Piano attacks: Alexander Holm, Salamander Grand Piano, CC BY 3.0. Edited and arranged.',
    str(destination)],input=mix.astype('<f4').tobytes(),check=True)
decoded = np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(destination),
    '-f','f32le','-ar',str(SR),'-ac','2','pipe:1']),dtype='<f4').reshape(-1,2)
report = {'track':'electro-v3','bpm':BPM,'duration_seconds':len(decoded)/SR,'sample_rate':SR,'channels':2,
    'peak_dbfs':float(20*np.log10(np.max(np.abs(decoded)))),
    'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(decoded**2)))),
    'clipped_samples':int(np.sum(np.abs(decoded)>=1)),
    'scene_accents_seconds':[1.875,3.375,6.375,9.375,12],'ending_hit_seconds':end_hit,
    'rms_per_3_second_phrase':[float(np.sqrt(np.mean(decoded[a*SR:(a+3)*SR]**2))) for a in range(0,15,3)],
    'file_bytes':destination.stat().st_size,'listening_verified':False}
(OUT/'validation'/'audio-electro-checks.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
