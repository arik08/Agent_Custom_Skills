"""Copy the full user-selected soundtrack without trimming or re-encoding."""
from pathlib import Path
import shutil
OUT=Path(__file__).resolve().parent.parent
SOURCE=OUT.parents[1]/'input'/'motion-audio'/'user-provided'/'Tech Promo Intro.mp3'
DEST=OUT/'audio'/'tech-promo-intro.mp3'
shutil.copyfile(SOURCE, DEST)
print(f'Copied full original: {DEST}')
