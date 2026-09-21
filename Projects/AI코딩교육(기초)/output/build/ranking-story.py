"""A single slide for the live production handoff."""
def install(add, root):
    def body(name):
        return (root / 'build' / name).read_text(encoding='utf-8')
    add('실제 제작해보기 : 사내 P-GPT LLM API 연동 프로그램', '사내 LLM API로 챗봇을 만들어봅니다',
        'API 호출 샘플을 바탕으로 질문을 입력하고 답변을 받는 챗봇을 함께 만듭니다.',
        body('ranking-live.html'), '', 'ranking-story')
