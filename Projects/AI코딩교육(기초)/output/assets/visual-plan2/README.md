# 시각 자산 및 출처

2026-09-17 · 기획안 2 시각화 개편

## 새로 생성한 장면

내장 imagegen 도구, generate 모드로 각각 독립 생성. 1536×1024 RGBA PNG이며 실제 알파 채널을 확인했다. 공식 제품 화면이나 실행 증거가 아닌 교육용 개념 일러스트다. 원본 파일은 수정 없이 저장하고 HTML에는 data URI로 내장했다.

| 파일 | 사용 장 | 내용 |
|---|---:|---|
| collaboration.png | 1 | 사람의 판단과 AI의 제작 |
| architecture.png | 7 | 화면 계층과 서버·데이터 |
| terminal.png | 11 | 명령·실행·결과 |
| environments.png | 12 | 프로젝트별 독립 도구 상자 |

## 공식 아이콘

- vscode.png: [공식 브랜드 안내](https://code.visualstudio.com/brand), [원본](https://code.visualstudio.com/assets/branding/code-stable.png)
- python.svg: [공식 로고 안내](https://www.python.org/community/logos/), [원본](https://s3.dualstack.us-east-2.amazonaws.com/pythondotorg-assets/media/files/python-logo-only.svg)
- nodejs.svg: [공식 브랜드 안내](https://nodejs.org/en/about/branding), [원본](https://nodejs.org/static/logos/nodejsHex.svg)
- git.svg: [공식 로고 안내](https://git-scm.com/community/logos), [원본](https://git-scm.com/images/logos/downloads/Git-Icon-1788C.svg). Git Logo by Jason Long, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). 색과 형태를 변경하지 않고 크기만 조절했다.

공식 아이콘은 식별 목적으로 사용하며 제휴나 보증을 뜻하지 않는다. 브랜드 자산은 각 소유자의 권리를 따른다.

## 직접 작성한 벡터 장면

파일 폴더, 실행 장치, Git 분기, 요청·확인 반복, 접근 범위, API 경로 등은 `../../build/visual_plan2.py`에서 SVG/CSS로 작성했다. 데이터 이동은 해당 장이 활성일 때만 재생하며 감소된 모션 설정을 따른다. 기존 인증 키 자산은 이전 덱에서 재사용했다.

## 생성 프롬프트

다음 공통 프롬프트의 `{SUBJECT}`에 아래 각 장면 설명을 삽입했다.

```
Use case: scientific-educational. Asset type: transparent illustration for a Korean beginner AI coding slide deck. {SUBJECT} Style: premium tactile paper-and-ceramic miniature diorama, precise cut paper edges mixed with soft matte 3D volume, sophisticated technical museum exhibit rather than generic clipart. Palette POSCO blue #05507D, bright azure #00A5E5, icy white #F2F6F8 and silver; natural skin only when a human appears. Soft studio lighting, restrained internal contact shadows. Actual transparent alpha background, no opaque rectangle, no checkerboard, no backdrop or ground outside the object's small platform. No labels, letters, words, watermark or logos. Wide 1536x1024 framing, generous clean transparent margin, crisp edges, coherent three-quarter camera. Intended to integrate directly into HTML slides on pale blue and navy backgrounds.
```

### collaboration

A Korean male office professional in his mid 30s in a pale blue shirt navy trousers and ID lanyard, and a compact elegant blue-white AI robot, actively building a miniature working software interface from a paper work request together on a white-blue workbench. The human points to a task card while the robot physically slots a UI component into a small upright application screen. Make action, human judgment and robot implementation clear. A few neatly placed paper task cards. Entire figures and desk fully visible. A single coherent interaction scene, wide landscape.

### architecture

An exploded cutaway of a miniature software system as tangible physical objects in a clean isometric 3D educational scene. Left a browser window with three clearly distinct separated layers: wireframe skeleton, blue styling frame, and interactive button layer. Center a small connector bridge carrying one document tile. Right a compact blue server module with a visible silver gear inside and an adjacent three-tier cylindrical database. A clear left-to-right spatial relationship, all objects grounded on a small thin platform, no random floating decorations. Single wide landscape scene.

### terminal

A compact open blue laptop displaying simple abstract command lines (no legible text), physically connected to a transparent-sided execution machine with a visible silver gear and small blue Python-like code tile (no brand logo). A paper document enters the machine on the left and a neatly organized three-row result sheet emerges on the right. Coherent small desktop diorama showing command -> execution -> result, no people. Single landscape composition, whole silhouette.

### environments

Two separate open toolboxes side-by-side in an elegant isometric 3D cutaway educational scene. The left toolbox blue with a fitted organizer holding a spreadsheet tile, gear, and chart component. Right toolbox pale cyan holding a differently shaped gear and document extraction component. A small gap clearly separates the boxes; visually distinct versioned parts safely contained in their own compartments. Subtle little geometric dots on gears to distinguish versions, no text. Each box a complete contained object, whole silhouette, wide landscape.
