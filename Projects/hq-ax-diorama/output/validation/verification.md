# 2026-09-19 검수

- Built-in image_gen: 원본 시트 3장 생성, 직원 A/직원 B/AI 로봇. 4열×6행의 그림을 각각 분리했습니다.
- 개별 256×256 투명 PNG: 72개. 정렬 아틀라스: 3개, 각 1024×1536. 결과 아틀라스 육안 확인.
- 최종 HTML 약 5.2 MB. `file:///.../hq-ax-diorama.html`로 서버 없이 직접 실행.
- Chromium 실제 WebGL 렌더링 성공, 내장 이미지 3개 로딩 성공, 외부 HTTP 요청 0개.
- 분석 버튼으로 motion=3 변경 확인. 일시정지 후 500ms 경과 동안 time 동일 확인.
- 캐릭터 선택, 방향 반전, 속도 변경 조작 및 화면 확인. JavaScript errors 없음.
- 1440×1100 및 390×844 확인. 모바일 수평 overflow 없음.
- `npm run build` 성공, `git diff --check` 오류 없음.

참고: 생성 시트의 동작별 그림은 4프레임이며, 원본의 미세한 잡티/자세 차이가 남아 있습니다. 절단선 근처의 반투명 픽셀이 CSV에서 touchesRowBoundary로 기록될 수 있습니다. 뒷모습과 별도 측면 시트는 아직 없습니다. 전체 업무 시뮬레이션은 이번 자산 검수 디오라마에 포함하지 않았습니다. 실제 발표 노트북 및 Safari는 미검증입니다.

## 자율 행동 업데이트 검증
- 동기화 모션 제어 제거. 3명 각각의 상태·속도·경로·애니메이션 시계 및 작업 선택 구현.
- `node --test autonomy.test.js`: 4/4 통과. 독립 행동, 모든 역 간 가구 회피 경로, 수집→분석→검토 순서, 30분 모델 반복 및 요청 폭주 검증.
- 실제 브라우저에서 서로 다른 위치/모션/업무 확인. 44.84 simulation seconds 시점 완료 1건, 분석·검토·신규 자료 수집이 동시에 진행 중임을 확인.
- 일시정지 시간 유지, 외부 HTTP 요청 0개, JavaScript errors 없음.
- 마지막 빌드 재실행 및 390px 수평 overflow 없음 확인. `autonomous-final.png`는 최종 화면.
- 경로 예약은 통로 단위이며 모든 교차점에서의 물리적 충돌 회피는 구현하지 않았습니다. 가상 업무의 자율 행동이며 실제 LLM 판단은 사용하지 않습니다.

## 사람·AI 역할 분담 업데이트
- AI: 자료 대조·계산·초안, 추가 분석, 결정 후 실행계획/보류 사유 기록.
- 사람: 과제 정의, 현장 맥락 검토, 재분석 요청, 최종 승인·보류.
- 역할 권한과 검토 조건을 상태 전이에서 강제. 추가 분석은 반드시 사람에게 재검토 회신. 실제 LLM이나 업무 시스템 연결 없음.
- `roles.test.js` 5개 및 기존 `autonomy.test.js` 4개 모두 통과. 보완 요청 왕복, 보류 기록, AI 승인 금지, 검토 이전 판단 금지, 30분 반복 포함.
- 실제 file:// 브라우저: 추가 분석 요청 문구와 round=1 → AI 재계산 확인. 1440px 캡처 `role-division.png`.
- HTML 생성 시 JavaScript 문자열 치환의 달러 기호 해석 문제를 발견해 build.mjs를 콜백 치환으로 수정. 최종 HTML 다시 열어 JavaScript errors 0, WebGL ready true 확인.
- 390px 수평 overflow false, 외부 HTTP 요청 0.

## 장비·캐릭터 겹침 수정
- 모든 캐릭터의 평면은 yaw만 카메라를 향하고 pitch는 수직을 유지하도록 변경. 발 기준 위치 역시 수직축만 보정하여 캐릭터 상체가 가구 안으로 기울지 않게 처리.
- hub 작업 위치 [-3.5,2.8] → [-2.8,2.5], 연결 통로도 새 위치를 사용.
- 9개 모델 테스트 및 빌드 통과. 실제 브라우저에서 AI가 장비 옆에 완전히 보이는 초기 작업 상태를 확인(`overlap-fixed.png`). JavaScript errors 0.

## 캐릭터 세로 압축 수정
- 수직 billboard의 원본 비율을 유지하도록 카메라 elevation에 대한 세로 투영 보정 적용. 발 기준점과 말풍선 높이에 같은 배율 적용.
- 실제 1440×1100 및 390×844 브라우저에서 세 캐릭터 정사각 셀의 화면 종횡비 1.0, 발 world Y=0.1 확인.
- `proportion-fixed.png` 육안 확인: 비율 복원, AI 장비 간격 유지. 최종 HTML 빌드 성공, JavaScript errors 없음.

## 보행 8프레임 업데이트
- Built-in image_gen 생성. 직원 A 1차 미채택, 2차 채택, 직원 B/AI 각 1시트 채택. 48개 신규 프레임과 아틀라스 3개 저장. 화면용 총96프레임, 기존 시트 원본 보존.
- 생성 그림의 인접 다리 자세가 일부 비슷한 한계가 남습니다. 원본과 분리 시트 육안 확인, 실재생 그림 로드 확인.
- 누적 이동 거리 기반 gaitCell의 8칸 선택, 모퉁이 연속성, 정지 중 유지 테스트 포함 11/11 통과.
- file:// Chromium 실행, 96프레임/8gait/이미지 로딩 성공, 실제 이동거리 증가 및 정지 후 유지 확인. 페이지 errors 0, 외부 HTTP 요청0.
- 최종 HTML 7,985,387 bytes. 캡처 gait-in-world.png, gait-review.png.

## 32프레임 최종 검증
- gait32-frames PNG192개, SHA256 고유192개. 반복 복제로 채우지 않음. 원본8 + 생성중간8 + 추가16의 시간순 조립.
- 11/11 tests pass. 32칸 매핑, 이동거리·정지·모퉁이 연속성, 역할별 협업 모델 검증.
- 실제 file:// Chromium: gaitFrames32, total240, 이미지6개 loaded true, WebGL ready true.
- 20ms 간격100회 샘플링으로 실제 렌더러 걷기 texture offset 고유32개 확인. JavaScript errors0.
- 정렬 atlas 육안 확인, gait32.png 저장. 생성그림의 세부 형태 및 유사 자세는 잔존하며 전문 수작업 애니메이션 품질 보장은 아님.

## 2026-09-19 cutout rig
- Replaced interleaved separately generated gait drawings, which visibly changed body geometry.
- 32 sampled poses from one stable drawing per action; opposite leg phases with recovery lift and bottom-pixel floor alignment.
- 11 tests pass. Browser errors empty. Ready/loaded/embedded all true; projected aspect 1.0 and footY 0.1 on three actors.
- Inspected validation/rig-contact.png (8 evenly spaced phases for all six gait/action combinations). Removed stray hand pixels from leg cutouts and added robot hip joint backing.
- Limit: still a simple cutout animation with rigid upper body; not 32 independently drawn motion frames. Non-walking animation untouched.
- User IAB automatic refresh blocked by file URL policy; requires user refresh.

## Torso seam correction
Replaced the horizontal upper-body clip with leg-contour subtraction. Each leg now rotates about its own attachment point, with a small overlap to cover the joint. Removed residual robot source-leg outlines below the belly. Applies to all three actors and both walking actions. Visual contact sheet: validation/seam-contact.png. Browser initialization ready/loaded true, 32 gait phases, no reported errors. Contact sheet checks sampled poses; no claim of full hand-drawn animation quality.

## Full-body replacement (supersedes cutout rig verification)
- 6 newly generated sheets, 32 whole-body frames each, 192 gait frames total.
- stage.js no longer uses rig.js; no per-limb transforms or component erasure.
- Inspected every normalized cell in six 2048x1024 contact sheets fullbody-0..5.png, including walking arm changes and held folders in carrying frames. No cutout seams or detached cutout fragments seen.
- Actual HTML loaded ready=true, loaded=true, embedded=true, gaitFrames=32. Browser errors empty. gait.test.js 2/2 pass. Scene screenshot fullbody-scene.png.
- Limitation: full-body generation has minor shape/pose variation and imperfect gait timing; checks do not certify ideal animation smoothness. Original non-gait action rows were not regenerated.
