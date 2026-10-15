import os
import sys
import uvicorn

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from backend.config import settings

def main():
    port = int(os.environ.get("PORT", settings.PORT))
    host = settings.HOST
    print("=" * 70)
    print(f"[*] Project KaushalDrishti (Kaushal Drishti) - Starting Server")
    print(f"[*] API & Dashboard serving at: http://localhost:{port}")
    print(f"[*] OpenAPI Interactive Documentation: http://localhost:{port}/docs")
    print("=" * 70)
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)

if __name__ == "__main__":
    main()

