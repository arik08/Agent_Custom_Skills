from pathlib import Path
R=Path(__file__).resolve().parent
p=R/'build.py';s=p.read_text(encoding='utf-8')
start=s.index("add('체험','첫 요청에서 시작합니다'")
end=s.index("add('사람의 역할'",start)
s=s[:start]+'''def ide(page):
    template=(ROOT/'build/ide-workshop.html').read_text(encoding='utf-8')
    initial=page==2
    values={
        '__PAGE__':str(page),
        '__CHAT_TITLE__':'테트리스 첫 버전' if initial else '같은 게임을 하나씩 개선합니다',
        '__CHAT_INTRO__':'먼저 돌아가는 게임을 만듭니다. 자동 플레이는 처음부터 빠르게 실행합니다.' if initial else '색과 화면, 점수판, 착지 효과를 차례로 요청해 보세요. 게임판은 이어집니다.',
        '__CONTEXT__':'tetris-workshop/' if initial else '@tetris.js · @style.css',
        '__PROMPT__':'브라우저에서 실행하는 테트리스를 만들어줘. 처음에는 단순하게 만들고, 자동 플레이를 처음부터 빠르게 넣어줘.' if initial else '블록마다 색을 다르게 하고, 화면을 게임답게 꾸며줘.',
        '__SUGGESTIONS__':'' if initial else '<div class="codex-suggestions"><button data-preset="color">① 블록 색과 화면 디자인</button><button data-preset="hud">② 큰 점수판과 다음 블록</button><button data-preset="effects">③ 착지 위치와 줄 삭제 효과</button></div>'
    }
    for key,value in values.items(): template=template.replace(key,value)
    return template

add('체험','Codex에 테트리스를 만들어 달라고 해봅니다','VS Code에서 요청하고, 생긴 파일과 실행 결과를 함께 확인하는 흐름입니다.',
    ide(2), '첫 버전은 투박해도 됩니다. 자동으로 움직이는 결과를 보고 다음 요청을 정합니다.', 'ide-slide')

add('체험','같은 게임도, 요청할수록 달라집니다','화면 디자인, 점수판, 착지 효과를 하나씩 더하며 전후 차이를 확인합니다.',
    ide(3), '사람이 개선 방향을 정하면 Codex가 파일을 수정합니다. 실행 결과를 보며 다시 판단합니다.', 'ide-slide')

''' + s[end:]
s=s.replace('star-game/','tetris-workshop/').replace('별의 점수 표시','테트리스의 점수 표시').replace('별을 크게 표시','점수를 크게 표시')
s=s.replace("css=(ROOT/'build/style.css').read_text(encoding='utf-8')", "css=(ROOT/'build/style.css').read_text(encoding='utf-8')+'\\n'+(ROOT/'build/ide-workshop.css').read_text(encoding='utf-8')")
s=s.replace("js=(ROOT/'build/app.js').read_text(encoding='utf-8')", "js=(ROOT/'build/tetris-workshop.js').read_text(encoding='utf-8')+'\\n'+(ROOT/'build/app.js').read_text(encoding='utf-8')")
p.write_text(s,encoding='utf-8')
p=R/'app.js';s=p.read_text(encoding='utf-8')
s=s.replace(" if(game.building&&!game.built){game.building=false;$('#game-build').disabled=false;$('#build-log').textContent='요청 과정을 다시 시작할 수 있습니다.';}\n",'')
s=s.replace(" if(index===2)updateEdit();"," window.tetrisWorkshop?.navigate(index);")
start=s.index('const game={');end=s.index('const files=',start)
s=s[:start]+s[end:]
s=s.replace("go(i){go(i);ensureGame();}","go(i){go(i);}")
start=s.index('preparePrint(){game.built=');end=s.index("$('#rule-fix').checked=true;",start)
s=s[:start]+"preparePrint(){window.tetrisWorkshop?.preparePrint();"+s[end:]
s=s.replace("const observer=new MutationObserver(ensureGame);observer.observe($('#page-label'),{childList:true});\nresize();go(parseHash());ensureGame();", "resize();go(parseHash());")
s=s.replace("button,input,textarea,pre,script,.fine","button,input,textarea,pre,script,.fine,.vscode-lab")
s=s.replace('<h1>별 잡기</h1>\\n<button>★</button>\\n<p>점수 0</p>','<h1>테트리스</h1>\\n<canvas id="board"></canvas>\\n<p>점수 0</p>')
s=s.replace('화면에 제목, 별 버튼, 점수 표시가 있다는 구조를 표현합니다.','화면에 제목, 게임판, 점수 표시가 있다는 구조를 표현합니다.')
s=s.replace('크기와 색 같은 표현을 정합니다. 별의 점수 계산을 바꾸는 코드는 아닙니다.','크기와 색 같은 표현을 정합니다. 블록 충돌이나 줄 삭제 규칙을 바꾸는 코드는 아닙니다.')
s=s.replace('별을 누르면 {\\n  점수를 1 높인다;\\n  바뀐 점수를 화면에 표시한다;\\n}','가득 찬 줄이 생기면 {\\n  해당 줄을 지운다;\\n  점수를 계산하고 표시한다;\\n}')
s=s.replace('별을 눌러 점수를 확인합니다.','자동 플레이와 점수 변화를 확인합니다.')
p.write_text(s,encoding='utf-8')
print('Integrated Tetris workshop on slides 2 and 3.')
