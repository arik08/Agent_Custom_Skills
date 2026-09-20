# Verification · 2026-09-18

- `npm test`: 5/5 pass. 모든 20개 이벤트의 7단계 전이, 조치 1회 반영, 광양 생산 재배분, 투자 승인 전후, 400개 이벤트 장기 순환 및 잘못된 시간 입력을 확인했습니다.
- `npm run build`: 성공. Three.js vendor 청크 510.67 kB / gzip 128.84 kB에 대한 Vite 크기 경고가 남습니다. 앱 청크는 20.55 kB입니다.
- `git diff --check`: 오류 없음. 새 프로젝트는 아직 커밋하지 않았습니다.
- agent-browser Chromium: 개발 서버와 배포 빌드 preview 모두 canvas 렌더링, 16개 시설, 자동 실행 확인. 페이지 JavaScript errors 출력 없음.
- 실제 UI에서 시나리오 0 선택, 속도 ×4 전환: age 19.7354, ACTION 단계, 생산 [92,81], EBIT 1237 확인.
- 일시정지 후 800ms 동안 simulation age 동일 확인.
- 실제 UI에서 투자 시나리오 선택 후 재개: age 18.5272, projects 1, CAPEX 345, 건설 중 크레인/시설 screenshot 확인.
- 1440×900, 1264×569, 390×844 캡처 확인. 낮은 창에서 패널 겹침 수정; 낮은 화면은 이벤트 패널 내부 스크롤을 사용하고 생산/활동 보조 HUD를 축소합니다. 모바일은 발표 권장 환경이 아닙니다.
- 배포 빌드: canvas true, 수평 overflow false, 초기 생산 [86,89], paused false 확인.
- screenshots: production-build.png, production-action.png, construction.png, compact.png, mobile.png. initial.png와 desktop.png는 수정 이전 중간 캡처입니다.

## 검증 한계

발표 대상 노트북의 실제 GPU 성능, 장시간 실제 브라우저 soak test, Safari, 터치 조작, 실제 WebGL context loss 및 전체화면 OS 전환은 검증하지 않았습니다. 400개 이벤트 장기 검증은 시뮬레이션 모델 단위 테스트입니다. 실제 경영 모델 정확도는 목표가 아니며 모든 값은 가상입니다.
