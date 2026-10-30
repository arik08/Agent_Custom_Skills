# P-Harness 교육 오프닝 — 15초

`p-harness-opening.html`을 열고 **소리와 함께 재생**을 누르세요. JavaScript Canvas 기반 가로 16:9 모션그래픽이며 폰트·음악까지 내장한 단일 HTML입니다. 별도 서버나 외부 파일 없이 전달할 수 있습니다.

P-Harness를 AI 업무 공간으로 소개하며 다양한 업무, Model·Skill·MCP, 대표 조사 사례, 결과물 검토·활용, 브랜드의 여섯 장면으로 구성합니다. 사내외 정보 조사와 보고서는 대표 활용 사례입니다. 네이비·블루 그라데이션, 15초 화면 구성은 유지했습니다.

## 조작

- 재생·일시정지, 처음부터 재생, 구간 탐색, 소리 끄기·켜기.
- 영상 영역 우클릭 또는 F로 전체화면 진입·종료. Esc로 종료.
- 전체화면에는 단축키 안내를 표시하지 않습니다. 일반 화면 아래에는 안내가 남습니다.
- Space 재생·정지, 좌우 방향키 5초 이동, M 소리.
- 동작 줄이기 설정에서는 정지 화면으로 시작합니다. 탭을 떠나면 일시정지합니다.

## 현재 음악: corporate-v4

사용자가 원한 방향은 **짧은 광고에 맞는 비트와 멜로디, 회사 발표에 어울리는 음색**입니다. 느슨한 피아노와 게임처럼 들리는 합성 신스 버전을 모두 대체했습니다.

[Running Out of Time — Ahjay Stelino / Mixkit](https://mixkit.co/free-stock-music/corporate-music/)의 리듬과 멜로디가 들어온 15.94초부터 15초를 사용합니다. 원본 페이지는 Corporate Music, Confident, Positive, Bass, Electric Guitar로 분류합니다. 원곡의 연주는 유지하고 구간 편집, 가장자리 페이드, 음량 조정만 했습니다. 합성 효과음이나 별도 멜로디를 덧붙이지 않았습니다.

[Mixkit Stock Music Free License](https://mixkit.co/license/#musicFree)를 확인했습니다. 이 교육용 웹 모션그래픽에 음악을 동기화하여 사용하며, 음원만 별도 상품·트랙으로 배포하지 않습니다. 원본과 출처·라이선스 기록은 `input/motion-audio/mixkit/`에 있습니다. HTML의 접힌 장면 설명에도 곡명과 출처를 기록했습니다.

## 편집과 빌드

`build/opening.template.html`의 `scene0`–`scene5`, `STARTS`, `render`가 장면과 시간축을 담당합니다.

```powershell
python 'Projects/P-Harness_교육자료/output/motion-opening/build/build_audio.py'
python 'Projects/P-Harness_교육자료/output/motion-opening/build/build.py'
```

현재 음원 편집기는 `build/build_corporate.py`, 빌드 입력은 `audio/opening-corporate.mp3`입니다. 다른 이전 음원과 제작 스크립트는 비교·복구용이며 HTML에서는 사용하지 않습니다.

## 검증

새 음원: 15.000초, 44.1kHz 스테레오, 디코딩 후 클리핑 0샘플. 측정값은 `validation/audio-corporate-checks.json`에 기록했습니다. JavaScript 구문과 HTML 내 음원 내장을 확인했습니다. 이전 전체화면·탐색·모바일 검증 자료도 `validation/`에 있습니다. 실제 스피커 청취 평가는 자동화로 검증하지 않았습니다.

문서와 업무 흐름은 개념 시각화이며 실제 제품 화면·실행 기록이 아닙니다. 기존 HTML 사용자 가이드는 별도 산출물입니다.
