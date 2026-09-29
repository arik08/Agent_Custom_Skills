# P-Harness 교육 오프닝 — 16초

`p-harness-opening.html`을 열고 **소리와 함께 재생**을 누르세요. JavaScript Canvas 기반 가로 16:9 모션그래픽이며 폰트·음악까지 내장한 단일 HTML입니다. 별도 서버나 외부 파일 없이 전달할 수 있습니다.

P-Harness를 AI 업무 공간으로 소개하며 다양한 업무, Model·Skill·MCP, 대표 조사 사례, 결과물 검토·활용, 브랜드의 여섯 장면으로 구성합니다. 사내외 정보 조사와 보고서는 대표 활용 사례입니다. 네이비·블루 그라데이션, 16초 화면 구성은 유지했습니다.

## 조작

- 재생·일시정지, 처음부터 재생, 구간 탐색, 소리 끄기·켜기.
- 영상 영역 우클릭 또는 F로 전체화면 진입·종료. Esc로 종료.
- 전체화면에는 단축키 안내를 표시하지 않습니다. 일반 화면 아래에는 안내가 남습니다.
- Space 재생·정지, 좌우 방향키 5초 이동, M 소리.
- 동작 줄이기 설정에서는 정지 화면으로 시작합니다. 탭을 떠나면 일시정지합니다.

## 현재 사운드: tech-promo-intro-v8-full

사용자가 지정한 `Tech Promo Intro.mp3`를 HTML에 Base64로 내장했습니다. 원본은 `input/motion-audio/user-provided/`에 보관하며, 약 15.65초 원곡 전체를 편집·재인코딩 없이 사용합니다. 마지막 장면만 1초 연장하여 총 16초로 마무리합니다. 별도 음원 파일이나 네트워크 연결 없이 재생됩니다. 기존 화면과 조작은 유지했습니다.

## 편집과 빌드

`build/opening.template.html`의 `scene0`–`scene5`, `STARTS`, `render`가 장면과 시간축을 담당합니다.

```powershell
python 'Projects/P-Harness_교육자료/output/motion-opening/build/build_audio.py'
python 'Projects/P-Harness_교육자료/output/motion-opening/build/build.py'
```

현재 음원 준비 스크립트는 `build/build_audio.py`, 빌드 입력은 `audio/tech-promo-intro.mp3`입니다. 이전 음원과 제작 스크립트는 비교·복구용이며 HTML에서는 사용하지 않습니다.

## 검증

내장 음원의 바이트 일치와 JavaScript 구문을 확인했습니다. 검증 기록은 `validation/audio-tech-promo-checks.json`, 브라우저 재생 기록은 `validation/audio-tech-promo-browser-checks.json`입니다. 실제 스피커 청취 평가는 자동화로 검증하지 않았습니다.

문서와 업무 흐름은 개념 시각화이며 실제 제품 화면·실행 기록이 아닙니다. 기존 HTML 사용자 가이드는 별도 산출물입니다.

## AI와 네 개 스킬 심볼

중앙 AI를 검색·분석·문서·검토 아이콘이 든 네 개의 원이 감쌉니다. 공통 `aiSkillMark`를 네 장면에서 공유하며 중앙 원과 주변 원이 차례로 나타납니다. 이는 스킬 유형의 개념 표현입니다.

AI 글자를 최종 Canvas 해상도에 직접 그리고 실제 글자 윤곽의 중심을 원의 중심에 맞췄습니다. 작은 글자 이미지를 확대하던 흐림과 여백에 따른 치우침을 제거하고, 원·아이콘의 선 두께와 어두운 배경의 대비를 보강했습니다. 검증 기록은 `validation/ai-skills-sharp-checks.json`, 화면은 `validation/ai-skills-sharp-*.png`입니다. 장면 시간축과 사운드 파일은 유지했습니다.

## 전체화면 재생 완료
마지막 장면에서 재생이 완료되면 다시 재생·전체화면 나가기 버튼이 나타납니다. 다시 재생하면 버튼이 숨겨지고 전체화면에서 처음부터 재생됩니다. 일반 화면과 재생 중에는 이 버튼을 표시하지 않습니다.

## 전체화면 선명도
Canvas 내부 해상도를 표시 크기와 기기 배율에 맞추고 기존 확대 제한을 제거했습니다. 글자는 최종 화면에 직접 그리며 보고서 그림 캐시도 배율에 맞춰 생성합니다. 모니터 배율 변경에 대응합니다. JavaScript 구문 검사와 현재 내장 브라우저의 2380×1339 렌더링을 확인했습니다. 실제 4K 디스플레이는 별도로 검증하지 않았습니다.

## 별도 25초 버전
`p-harness-opening-25s.html`은 사용자 지정 Pulsing Groove 원본 전체를 내장합니다. 실제 길이는 25.5735초이며 시작점은 0·3.069·6.138·12.071·17.185·22.300초입니다. 기존 장면과 동작 시간을 비례 조정했으며, 연결 마크 완성 후 약 0.89초 여유를 유지합니다. 음악은 반복·자르기·재인코딩 없이 포함합니다.

빌드: `python Projects/P-Harness_교육자료/output/motion-opening/build/build_25s.py`.
검증: 원본과 내장 음악 바이트 일치, 실제 디코딩 길이와 영상 길이 일치, JavaScript 구문 및 장면 완료 시간 확인. 로컬 파일 브라우저 접근 제한으로 이번 화면 재생은 검증하지 않았습니다. 기존 16초 버전은 유지합니다.

## 최종 종료 시간: 26초
후속 요청에 따라 마지막 화면만 0.4265초 늘렸습니다. 장면 시작점·속도·25.5735초 원곡은 유지합니다. 기존 링크를 위해 파일명은 `p-harness-opening-25s.html` 그대로입니다.

검증 자료의 `25s-*` 기록·미리보기와 이전 편집 음악은 중간 버전 기록입니다. 최종 상태는 `validation/26s-ending-checks.json`과 현재 HTML을 기준으로 확인하세요.

## Vercel 자동 배포 구성
배포 주소: https://p-harness-opening.vercel.app

GitHub 연결 대상은 `arik08/Agent_Custom_Skills`의 `main`입니다. 프로젝트 루트는 `Projects/P-Harness_교육자료/output/motion-opening`, 빌드는 `node vercel/build.cjs`, 게시 폴더는 `vercel/public`입니다. 커밋한 최신 `p-harness-opening-25s.html`을 index.html로 복사하므로 클라우드에서 FFmpeg나 원본 음원 처리가 필요하지 않습니다.
