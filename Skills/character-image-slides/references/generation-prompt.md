# 완성 슬라이드 생성 프롬프트

아래 항목을 현재 원고로 채운다. 문구 목록은 최종 이미지와 대조할 기준이므로 생략하지 않는다. 도구가 지원하는 참조 첨부 방식과 해상도 옵션을 사용하며, 경로를 프롬프트에 적는 것만으로 참조 첨부를 대신하지 않는다.

```text
Create one finished Korean presentation slide as a single image.
Target canvas: 16:9, 1920x1080.

STYLE REFERENCE: [selected bundled style image]
Use its cool white background, deep navy/graphite ink, restrained steel blue
and coral accents, handwritten headline and illustrated workplace explanation.
Do not copy its factual claims, dates, UI, or character identity.

IDENTITY REFERENCE: [current protagonist sheet or user-supplied character]
SUPPORTING CAST REFERENCE: [only characters appearing in this scene]
Keep facial features, hair silhouette, age, proportions and clothing consistent.

SLIDE PURPOSE: [one clear message]
COMPOSITION: [dominant scene, supporting evidence and reading order]
CHARACTER ACTION: [who does what, with which object]
RELATIONSHIPS TO SHOW: [comparison / sequence / dependency / feedback]

EXACT VISIBLE KOREAN TEXT:
Title: [exact title]
Labels: [exact labels with their objects]
Dialogue: [speaker and exact words, only if needed]
Takeaway: [only if useful and supported]

Generate the illustration and all specified text together as a finished slide.
Use large legible Korean lettering and clear contrast. Keep text away from
canvas edges. No additional claims, invented metrics, fake logos, watermark,
page number, tiny filler text, sepia paper or photographic skin.
```

수정 요청은 바뀔 문구·인물·영역을 명시하고 유지해야 할 제목, 관계, 장면, 색을 함께 적는다. 생성된 이미지 전체를 새로 해석하도록 막연하게 요청하지 않는다. 관계·직급·친밀도에 따라 대사의 높임말을 고르며, 기본은 자연스러운 직장 존댓말이다.

도구가 FHD 이외의 이미지를 반환하면 실제 크기를 기록한다. 필요한 캔버스 보정은 지원되는 이미지 편집 기능으로 수행하고 비율과 문구를 다시 확인한다. 단순 확대 결과를 세부 정보가 새로 생긴 고해상도 이미지라고 설명하지 않는다.
