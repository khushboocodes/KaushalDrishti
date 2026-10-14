# Project KaushalDrishti (कौशल दृष्टि)
## Public Cloud Deployment & Live Submission Link Guide
### Problem Statement ID: 26246

This guide provides immediate instructions to deploy **KaushalDrishti** and obtain a **publicly accessible HTTPS demo link** for hackathon submission within 3 to 5 minutes.

---

## Method 1: Instant Free Deployment via Render (Recommended)
*Render provides free cloud hosting for Python/FastAPI web applications.*

1. Push this repository to your GitHub account (e.g. `https://github.com/<your-username>/KaushalDrishti`).
2. Go to **[render.com](https://render.com/)** and sign in with GitHub.
3. Click **"New +"** $\rightarrow$ **"Web Service"**.
4. Select your `KaushalDrishti` repository.
5. Render will automatically detect `render.yaml` or fill in the following:
   - **Name:** `kaushaldrishti`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python run.py`
   - **Plan:** `Free`
6. Click **"Deploy Web Service"**.
7. In ~2 minutes, your live link will be generated:
   👉 **`https://kaushaldrishti.onrender.com`** *(Submit this link in your hackathon portal!)*

---

## Method 2: Instant Public Tunnel (Instant 30-Second Live URL)
*If you need a public URL instantly right now from your machine without waiting for cloud builds:*

### Option A: Cloudflare Quick Tunnel (No Sign-up Required)
Run in PowerShell:
```powershell
# In terminal 1: Start KaushalDrishti server
python run.py

# In terminal 2: Expose via Cloudflare tunnel (free, instant HTTPS)
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:8000
```
*Output will give you an instant public URL: `https://<random-id>.trycloudflare.com`.*

### Option B: LocalTunnel (No Sign-up Required)
```powershell
npx localtunnel --port 8000
```
*Output will provide an instant public URL: `https://<unique-name>.loca.lt`.*

---

## Method 3: Vercel Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run from the workspace directory:
   ```bash
   vercel
   ```
3. Follow the CLI prompts. `vercel.json` will automatically configure routing between FastAPI and the static frontend.
4. Your public URL will be:
   👉 **`https://kaushaldrishti.vercel.app`**

---

## Method 4: Docker Deployment
Run anywhere with Docker installed:
```bash
docker build -t kaushaldrishti:latest .
docker run -p 8000:8000 kaushaldrishti:latest
```
Visit `http://localhost:8000` or map to any server IP.

---

## Verification Checklist for Submission
- [x] Visiting root `/` loads the National Skilling Command Center.
- [x] Interactive SVG India Map displays and state hover tooltips function.
- [x] Language toggle (EN / हिन्दी) switches language across all screens.
- [x] District Explorer dropdowns filter between Kanpur, Pune, Bhubaneswar, and other districts.
- [x] Dual Funnel shows demand pull vs leaky training pipeline yield.
- [x] What-If Sandbox sliders dynamically recalculate simulated gaps in real time.
- [x] Target Export tab enables downloading the official MSDE DSDP CSV.
- [x] Interactive Swagger API documentation is accessible at `/docs`.
