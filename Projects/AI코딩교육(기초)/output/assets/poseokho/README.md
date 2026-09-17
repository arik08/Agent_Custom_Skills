# 포석호 후드 2D 에셋

Built-in image_gen으로 생성. 사용자의 최종 요청에 따라 후드 차림으로 각색했으며 공식 사원복 디자인으로 주장하지 않는다.

- 원본 시트: poseokho-hoodie-sheet.png
- 3열 × 2행을 잘라 wave, laptop, think, present, celebrate, checklist.png로 저장.
- 투명도: 실제 RGBA alpha 0 포함. 배경색 제거 없이 원본 alpha 유지.
- 적용: 8장 checklist, 18장 laptop, 19장 think, 27장 present, 31장 celebrate.
- HTML 내부에 이미지를 포함하여 단일 파일 사용을 유지.

## 최종 생성 프롬프트
Create ONE sprite sheet containing SIX distinct poses of this exact 2D white bear Poseokho character in sky blue hoodie. Layout STRICT equal 3 columns x 2 rows, landscape canvas. Each complete character contained in its own equal rectangular cell, centered with at least 12% empty transparent margin on ALL sides. Large clear transparent gutters between cells, no overlaps. Same character identity, same sky-blue hoodie, pink cheeks, navy outline throughout. FLAT 2D vector-like cartoon, solid color fills, smooth consistent bold navy lines, no gradients, NO 3D, no texture. Top row left: happily waving hello standing. Top middle: sitting working on small laptop, focused smile. Top right: thinking, paw on chin, head tilted, one small question mark beside head. Bottom left: presenting/explaining, extending paw toward left with confident friendly smile. Bottom middle: celebrating success, both arms raised, joyful closed eyes and two tiny stars. Bottom right: holding a small white checklist with blue checkmarks, satisfied smile. No words, no labels, no grid borders, no floor/shadow. TRUE TRANSPARENT ALPHA BACKGROUND across whole sheet. Every pose fully visible including ears and feet, all elements safely inside their cell. This sheet will be cropped into six individual PNG assets.

## 검증
Chromium 실제 렌더 5장 확인. 기존 52개 회귀 검사 통과. JavaScript 오류 0. 5개 이미지 로드 성공 및 서로 다른 모션 확인. 모션 감소 설정에서 animation:none 확인. 캡처와 결과는 output/validation/poseokho/.
Codex 내장 브라우저가 시간 초과되어 로컬 Playwright Chromium으로 검증했다.
