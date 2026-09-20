from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import json, os
R=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(R)))
state={'pid':os.getpid(),'port':server.server_port,'url':f'http://127.0.0.1:{server.server_port}/AI코딩교육_체험과안목_v3.html','root':str(R)}
(R/'validation/preview-server.json').write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf-8')
server.serve_forever()
