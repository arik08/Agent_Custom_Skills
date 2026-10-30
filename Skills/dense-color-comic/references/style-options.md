# 코믹 그림체 옵션

요청에 스타일 이름이나 ID가 있으면 적용합니다. 미지정 시 기존 `dense-ink`를 유지합니다. 새 코믹의 선택지를 안내할 때 아래 두 옵션을 제시할 수 있으며, 이미 정한 스타일을 매번 재확인하지 않습니다.

| ID | 선택 이름 | 적용 |
| --- | --- | --- |
| `dense-ink` | 고밀도 컬러 망가 / 기존 v9 | 잉크 질감, 깊은 명암, 풍부한 환경 묘사. `visual-workflow.md`의 기본 렌더링과 기존 v9 참조를 사용합니다. |
| `rough-anime` | 러프 애니 / 러프애니 / 담백한 러프 애니 | 가벼운 펜 드로잉과 단순한 셀 채색. 아래 프로필과 전용 참조를 사용합니다. |

## rough-anime

출처: [그림체 공유 — 러프애니 그림체](https://gall.dcinside.com/mgallery/board/view/?id=thesingularity&no=1504417), 2026-10-31 확인. 본문 프롬프트와 예시 7장을 확인하여 요약했습니다. 예시는 단일 일러스트이므로 컷 구성·한국어 말풍선은 이 스킬의 코믹 규칙으로 설계합니다.

- 가늘고 거의 일정한 짙은 펜선에 약한 손떨림을 남깁니다.
- 둥근 얼굴과 간결한 표정, 큰 머리 덩어리와 옷 주름으로 형태를 읽히게 합니다.
- 재질마다 기본색과 얕은 그림자 한 단계로 채색합니다. 광택과 그라데이션은 억제합니다.
- 배경은 장소를 설명하는 큰 형태와 필수 소품만 남기며 여백을 보존합니다.
- 예시의 저채도·회보라 분위기는 참고하되 장면에 맞는 색을 씁니다. 미세 질감을 필수 효과로 추가하지 않습니다.

### 참조 역할

생성 전에 다음 원본 두 장을 열어 `rendering/style reference only`로 첨부합니다.

- `assets/style/rough-anime/dc1504417-example-01.png`: 선, 채색, 간단한 장소 묘사.
- `assets/style/rough-anime/dc1504417-example-07.png`: 표정, 낮은 대비, 배경 단순화.

출처와 해시는 `asset-manifest.json`에 있습니다. 선택 승인 범위는 그림체입니다. 예시 인물·의상·뿔·포즈·내용을 새 등장인물 설정으로 가져오지 않습니다. 기존 캐릭터의 나이·얼굴·체형·승인 비율을 유지합니다. 새 캐릭터를 설계할 때만 중간 정도의 머리 확대와 몸 단순화를 제안할 수 있습니다.

### 생성 프롬프트 블록

```text
STYLE_ID: rough-anime
Use delicate, slightly uneven dark pen contours, economical facial marks,
broad hair and garment shapes, muted flat fills, and a single shallow cel
shadow per material. Let essential setting cues sit in generous quiet space.
Keep the approved cast recognizable. Render the requested comic panels and
exact Korean dialogue together. Avoid dense hatching, intricate scenery,
glossy lighting, soft-painted shading, and chibi redesigns.
```

### 코믹 적용과 검증

선택 시 고밀도 배경·굵은 잉크·강한 림라이트 지침을 대체합니다. 내용의 정보량은 짧은 대화, 행동, 필수 증거 소품으로 유지합니다. 요청한 화면비·읽기 순서·양면일 때의 중앙 여백·대사 동시 생성 규칙은 그대로 적용합니다.

검수 시 가는 선, 단순 명암, 배경 여백, 인물 정체성, 한글 가독성을 확인합니다. 어두운 장면도 허용하되 명암 단계를 늘리지 않습니다. 필수 도표나 소품은 단순화하되 생략하지 않습니다. 본 옵션 등록 시 새 샘플 코믹 생성은 수행하지 않았습니다.
