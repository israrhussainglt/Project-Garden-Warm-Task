import http.server
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        resolved = super().translate_path(path)
        rel = os.path.relpath(resolved, os.getcwd())
        if any(part.startswith(".") and part != "." for part in rel.split(os.sep)):
            return os.path.join(os.getcwd(), ".__blocked__")
        return resolved


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
