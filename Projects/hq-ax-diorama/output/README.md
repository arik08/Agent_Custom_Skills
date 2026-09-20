# HQ AX · 사람과 AI의 오피스 디오라마

`hq-ax-diorama.html`을 Chrome 또는 Edge에서 열면 시작됩니다. 엔진과 그림을 모두 내장해 인터넷이나 서버 없이 HTML 하나로 실행됩니다. 실제 AI·경영 시스템에 연결하지 않은 교육용 자동 시뮬레이션입니다.

## 현재 적용된 동작

- 사람: 목표·제약 정의, 현장 맥락 검토, 추가 분석 요청, 승인 또는 보류 판단.
- AI: 자료 수집·대조·계산·초안 작성, 추가 분석, 결정 이후 실행계획 또는 보류 기록.
- 세 캐릭터는 서로 다른 작업 시간과 경로로 움직이며, 가구를 피하고 통로 사용 순서를 조정합니다.
- 일시정지, 속도 변경, 새 업무 요청을 지원합니다. 모션 미리보기는 별도 영역입니다.

## 현재 그림 자산

걷기·운반은 동작별 8장의 전신 그림을 재생합니다. 팔다리를 분리해 움직이는 방식은 사용하지 않습니다. 여자 캐릭터의 대기·분석·보고·완료 그림도 현재 보행 외형에 맞춘 그림입니다. 생성 그림에는 프레임 간 미세한 형태 변화가 남아 있습니다.

현재 빌드에 쓰는 아틀라스 6개를 `assets/`에 포함했습니다.

- `employee-a-atlas.png`, `employee-b-consistent-atlas.png`, `ai-atlas.png`
- `employee-a-fullbody8-atlas.png`, `employee-b-fullbody8-atlas.png`, `ai-fullbody8-atlas.png`

미사용 중간 프레임·이전 관절 실험·분리 시안은 배포 대상에서 제외했습니다. 요청 이력과 생성 프롬프트는 `../input/`에 있습니다.

## 재생성 및 검증

이 폴더에서 실행합니다.

```powershell
npm install
node --test gait.test.js roles.test.js autonomy.test.js
npm run build
```

`stage.js`는 화면, `roles.js`는 역할별 작업 순서, `autonomy.js`는 이동과 시간, `gait.js`는 이동 거리에 따른 보행 프레임을 담당합니다. `build.mjs`가 `preview-template.html`에 엔진과 그림을 내장합니다.

2026-09-20에 모델·경로·역할·보행 검사 11개와 재생성 빌드를 통과했습니다. 실제 발표 장비의 GPU 성능과 Safari는 별도 확인이 필요합니다.
