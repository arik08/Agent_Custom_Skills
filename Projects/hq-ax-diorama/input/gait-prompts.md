# 보행 재생성

Built-in image_gen, 기존 캐릭터 idle PNG를 identity reference로 사용. 캐릭터별 16프레임: walk 8 + carry 8. 직원 A 1차는 미채택, 2차 채택. 원본 그림의 limb alternation은 완벽하지 않으며 재생 순서와 크기 정렬 검수를 함께 수행합니다.

Create a professionally animated hand-drawn GAME SPRITE SHEET, exact 4 columns x 4 rows, 16 complete character poses, transparent background. Character identity and illustration style from attached single idle reference. Same outfit, face and relative body size. No text, outlines of cells, floor or shadows. Body faces screen RIGHT throughout. Torso/head stay stationary in each cell; animation is in the legs. Fixed hip center and stable head. Do not zoom individual sprites.
Rows 1-2 = a smooth 8-frame walk cycle, rows 3-4 = the same 8-frame gait while carrying cream paper folders.
CRITICAL: Leg closest to viewer must go FORWARD for first step then go BACKWARD for second step. This is not eight copies of one stride. Render the closest leg slightly lighter and far leg slightly darker so alternating legs are unambiguous. Limit knee lift to natural walking, never marching.
Frame 1 (row1 col1): NEAR leg straight forward/right, FAR leg back/left, wide stride contact.
Frame 2: NEAR foot planted ahead, FAR heel coming forward, hips slightly lowered.
Frame 3: NEAR leg planted vertically UNDER hips; FAR knee bent and swinging past it TOWARD RIGHT.
Frame 4: NEAR leg now BEHIND hips toward LEFT with heel raised; FAR foot reaches ahead toward RIGHT.
Frame 5 (row2 col1): NEAR leg straight BACK/LEFT; FAR leg straight FORWARD/RIGHT, EXACT OPPOSITE silhouette/overlap of frame1. Arms reverse too.
Frame 6: FAR foot planted ahead/right; NEAR heel coming forward from left behind.
Frame 7: FAR leg vertically UNDER hips; NEAR knee bent swinging past it TOWARD RIGHT.
Frame 8: FAR leg now BEHIND hips left heel raised; NEAR foot reaches forward right; loops naturally into frame1.
Rows3-4 repeat these exact eight leg positions with stack of folders held still against chest in both arms, no arm swinging. Natural gait, even temporal spacing, two legs only, every silhouette inside its equal-sized cell with generous margins. Preserve body/head height, clothing and identity exactly. All sprites at a consistent near-side three-quarter angle, no turning or perspective changes. A true animation sheet, not a pose collection.

직원 B 추가: cream cardigan, teal blouse and navy trousers. Near/far leg swap 강조.
AI 추가: same ivory teal robot with short articulated legs, alternating feet, no march.
