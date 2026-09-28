"""Render a sparse 15s piano sound design. No drum loop or repeated arpeggio.

Piano: Salamander Grand Piano by Alexander Holm, CC BY 3.0.
Original samples and license are preserved in input/motion-audio/salamander.
Requires numpy, scipy and ffmpeg. Outputs are embedded by build.py.
"""
from pathlib import Path
from functools import lru_cache
import json
import subprocess
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
SAMPLES = OUT.parents[1] / 'input' / 'motion-audio' / 'salamander'
SR, DURATION = 44100, 15
N = SR * DURATION
rng = np.random.default_rng(5821)
piano = np.zeros((N, 2))
texture = np.zeros((N, 2))
fx = np.zeros((N, 2))
sources = {48: 'C3', 54: 'Fs3', 57: 'A3', 60: 'C4', 63: 'Ds4',
           66: 'Fs4', 69: 'A4', 72: 'C5', 75: 'Ds5', 78: 'Fs5'}


def lowpass(x, hz):
    return sosfilt(butter(2, hz, fs=SR, output='sos'), x, axis=0)


@lru_cache(None)
def sample(midi):
    source = min(sources, key=lambda note: abs(note-midi))
    raw = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-i', str(SAMPLES / (sources[source]+'.mp3')),
        '-f', 'f32le', '-ar', str(SR), '-ac', '2', 'pipe:1'])
    x = np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(float)
    x = resample_poly(x, 1000, round(1000 * 2**((midi-source)/12)))
    onset = np.flatnonzero(np.max(np.abs(x), axis=1) > .006)
    if len(onset):
        x = x[max(0, onset[0]-int(.003*SR)):]
    x = lowpass(x, 3300)
    x /= max(.01, np.max(np.abs(x)))
    x[:int(.004*SR)] *= np.linspace(0, 1, int(.004*SR))[:, None]
    return x


def place(bus, x, at, level=1, pan=0):
    start = round(at*SR)
    if start < 0:
        x, start = x[-start:], 0
    count = min(len(x), N-start)
    if count <= 0:
        return
    balance = np.sqrt([1-pan, 1+pan])
    bus[start:start+count] += x[:count] * level * balance


def note(at, midi, level, hold=2.1, pan=0):
    x = sample(midi)[:round((hold+.6)*SR)].copy()
    t = np.arange(len(x))/SR
    x *= np.exp(-np.maximum(t-hold, 0)*7)[:, None]
    place(piano, x, at, level, pan)


# Small opening signature, one response, and a resolved brand signature.
for at, midi, level in [(.08, 62, .31), (.48, 69, .24), (.92, 76, .23),
                        (1.90, 74, .17), (3.48, 71, .19), (4.23, 74, .14),
                        (6.49, 73, .20), (7.26, 78, .15),
                        (9.48, 71, .20), (10.14, 69, .17),
                        (12.08, 69, .27), (12.40, 76, .24), (12.79, 78, .25)]:
    note(at, midi, level, pan=(midi-70)/42)

# Open voicings, with room between the phrases. No per-beat bass or drums.
chords = [(0.08, [50, 57, 66], .15), (3.40, [43, 54, 62], .12),
          (6.40, [47, 57, 66], .12), (9.40, [45, 57, 64], .13),
          (12.04, [50, 57, 66, 74], .16)]
for at, notes, level in chords:
    for i, midi in enumerate(notes):
        note(at+i*.024, midi, level, hold=2.6, pan=(i-1)*.12)

# A quiet piano-derived swell under each cut, rather than a buzzy synth pad.
for cut, midi in [(1.875, 69), (3.375, 74), (6.375, 73), (9.375, 69), (12, 74)]:
    x = lowpass(sample(midi)[:round(.62*SR)][::-1].copy(), 1700)
    env = np.sin(np.linspace(0, np.pi, len(x)))**1.5
    x *= env[:, None]
    place(texture, x, cut-.49, .037, -.15)
    # Broad, soft air movement with no piercing high-frequency hiss.
    n = round(.34*SR)
    air = rng.normal(size=(n, 2))
    air = sosfilt(butter(2, [500, 2300], btype='bandpass', fs=SR, output='sos'), air, axis=0)
    air *= np.sin(np.linspace(0, np.pi, n))[:, None]**2
    place(fx, air, cut-.16, .016)

# Stereo early reflections and a damped diffuse tail.
wet = np.zeros_like(piano)
for channel in range(2):
    length = round(1.6*SR)
    t = np.arange(length)/SR
    impulse = lowpass(rng.normal(size=length), 2400) * np.exp(-t*5.2)
    impulse[:round(.045*SR)] = 0
    impulse /= max(.01, np.linalg.norm(impulse))
    for delay, amplitude in [(.047+channel*.006, .22), (.083-channel*.009, .15), (.137+channel*.013, .08)]:
        impulse[round(delay*SR)] += amplitude
    wet[:, channel] = fftconvolve(piano[:, channel], impulse)[:N]

mix = piano + wet*.17 + texture + fx
fade = np.minimum(np.arange(N)/(.012*SR), 1)
fade *= np.minimum((N-1-np.arange(N))/(.80*SR), 1)**1.5
mix *= fade[:, None]
mix *= .78 / np.max(np.abs(mix))
(OUT/'audio').mkdir(exist_ok=True)
(OUT/'validation').mkdir(exist_ok=True)
destination = OUT/'audio'/'opening-piano.mp3'
subprocess.run([
    'ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2',
    '-i', 'pipe:0', '-af', 'loudnorm=I=-18:TP=-2:LRA=8', '-ar', str(SR),
    '-codec:a', 'libmp3lame', '-b:a', '192k', '-metadata',
    'comment=Piano samples: Alexander Holm / Salamander Grand Piano / CC BY 3.0; edited and arranged for P-Harness.',
    str(destination)], input=mix.astype('<f4').tobytes(), check=True)
decoded = np.frombuffer(subprocess.check_output([
    'ffmpeg', '-v', 'error', '-i', str(destination), '-f', 'f32le',
    '-ar', str(SR), '-ac', '2', 'pipe:1']), dtype='<f4').reshape(-1, 2)
report = {
    'duration_seconds': len(decoded)/SR,
    'sample_rate': SR, 'channels': 2,
    'peak_dbfs': float(20*np.log10(np.max(np.abs(decoded)))),
    'rms_dbfs': float(20*np.log10(np.sqrt(np.mean(decoded**2)))),
    'clipped_samples': int(np.sum(np.abs(decoded)>=1)),
    'stereo_difference_rms': float(np.sqrt(np.mean((decoded[:, 0]-decoded[:, 1])**2))),
    'file_bytes': destination.stat().st_size,
    'listening_verified': False,
}
(OUT/'validation'/'audio-mix-checks.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
