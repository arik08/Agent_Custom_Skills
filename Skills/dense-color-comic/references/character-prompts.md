# 캐릭터 재생성 프롬프트

## 공통 프롬프트

```text
Use case: illustration-story
Asset type: 1920x1080 individual master character sheet for the Inchangwon Korean AI lecture.
Image 1 is character-cast-00-protagonist-humorous-face-refined-7_4head-approved-v3.png and is the mandatory layout, proportion and rendering reference. Image 2 is the named character's identity reference.
Create three adult 5-head humorous full-body acting poses on the left, front/3-quarter/side natural 7.4-head professional views on the right, and four varied bust expressions below: neutral, surprised or embarrassed, focused problem-solving, delighted explanation. The left character must be anatomically no more than 5.1 heads from crown to sole: the head is about 20% of total height, with a shorter neck, torso, arms, thighs and calves. Do not create a merely smaller 7.4-head body.
Use a clean cool-white background with faint steel-blue guides, premium clean Korean office-webtoon linework and restrained 2-3 step cel shading. The 5-head mode uses a soft simplified adult base face with diverse exaggerated expressions. The 7.4-head mode is natural and never an 8-head fashion model.
Keep face, hair silhouette, age, body type, outfit and key color identical through all views. No text, letters, numbers, labels, logos or watermark.
Avoid child or chibi mascot, permanently huge eyes, protagonist face copied onto supporting cast, cloned identities, celebrity glamour, romance-cover beauty, photorealism, helmets and factory uniforms.
```

## 인물별 identity specification

- `CAST-00`: 친근하고 담백한 30대 한국인 남성 사무직. 부드러운 타원형 얼굴, 자연스러운 볼과 턱선, 차분한 눈, 자연스럽게 내려오는 검은 앞머리. 하늘색 셔츠, 네이비 슬랙스, 사원증.
- `CAST-01`: 20대 후반~30대 초반 여성 데이터 분석가. 귀 뒤로 넘긴 짧은 검은 단발, 타원형 얼굴, 민트 블라우스, 차콜 와이드 슬랙스. 침착하고 조용히 재치 있는 인상.
- `CAST-02`: 30대 초반 남성 엔지니어. 단정한 사이드 파트, 가는 사각 안경, 긴 타원형 얼굴, 흰 셔츠와 네이비 카디건. 분석적이고 약간 어색한 유머.
- `CAST-03`: 30대 초반 여성 프로젝트 리드. 긴 웨이브 짙은 갈색 머리, 크림 재킷, 코랄 블라우스. 활기차고 설득력 있는 인상.
- `CAST-04`: 30대 초반 남성 기술 리드. 짧고 약간 뾰족한 검은 머리, 곧은 눈썹, 자연스러운 각진 턱, 스틸 블루 셔츠. 실용적이고 단호함.
- `CAST-05`: 30대 초반 여성 운영 담당자. 낮은 번과 얼굴 옆 잔머리, 코랄 블라우스, 차콜 슬랙스. 솔직하고 관찰력이 빠름.
- `CAST-06`: 30대 초반 남성 조사·분석 담당자. 부드러운 곱슬머리, 둥근 검은 안경, 하늘색 잔줄무늬 셔츠. 호기심 많고 꼼꼼함.
- `CAST-07`: 30대 초반 여성 기획 담당자. 낮은 포니테일과 옆머리, 하늘색 블라우스, 네이비 슬랙스. 차분하고 신뢰감 있음.
- `CAST-08`: 40대 중후반 남성 현업 팀장·멘토. 자연스럽게 뒤로 넘긴 짧은 소금후추 머리, 넓고 차분한 얼굴, 네이비 캐주얼 업무 재킷과 흰 셔츠. 임원형이 아닌 실무형.
- `CAST-09`: 40대 초중반 여성 선임 멘토. 귀 뒤로 넘긴 짧은 레이어드 단발, 성숙한 타원형 얼굴, 딥 그린 카디건과 아이보리 블라우스. 따뜻하고 날카로운 실무 조언자.

각 인물의 실제 얼굴과 복장은 `characters.md`에 지정된 개별 PNG를 최우선 identity reference로 사용한다.
