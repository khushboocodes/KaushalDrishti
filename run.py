import os
import uvicorn
from backend.config import settings

def main():
    port = int(os.environ.get("PORT", settings.PORT))
    host = settings.HOST
    print("=" * 70)
    print(f"🚀 Project KaushalDrishti (कौशल दृष्टि) — Starting Server")
    print(f"📡 API & Dashboard serving at: http://{host}:{port}")
    print(f"📚 OpenAPI Interactive Documentation: http://{host}:{port}/docs")
    print("=" * 70)
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)

if __name__ == "__main__":
    main()
