from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

deck = Path(__file__).resolve().parents[1] / '260929_경영기획DX추진TF팀_AI_CODING_기초교육.html'

class Preview(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.split('?')[0] != '/deck':
            self.send_error(404)
            return
        body = deck.read_bytes()
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

server = ThreadingHTTPServer(('127.0.0.1', 0), Preview)
print(f'http://127.0.0.1:{server.server_port}/deck', flush=True)
server.serve_forever()
