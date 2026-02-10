# 🚀 QueueFlow Pro: Render Deployment Guide

Follow these steps to deploy your application for free on **Render.com**. 
> **Note on Free Tier**: Render's free "Web Services" will go to sleep after 15 minutes of inactivity. The first request after a sleep period may take 30-40 seconds to "wake up" the server. Additionally, the JSON database files will reset every time the server restarts.

---

## 1. Deploy the Backend (Commonly first)

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `queueflow-api` (or similar)
    *   **Root Directory**: `server`
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Instance Type**: `Free`
5.  Click **Advanced** and add the following **Environment Variables**:
    *   `JWT_SECRET`: (Your secret key)
    *   `ADMIN_EMAIL`: `admin@gmail.com`
    *   `ADMIN_PASSWORD`: (Your admin password)
    *   `NODE_ENV`: `production`
6.  Click **Create Web Service**. 
7.  **Copy the URL** Render gives you (e.g., `https://queueflow-api.onrender.com`).

---

## 2. Deploy the Frontend

1.  In Render Dashboard, click **New +** > **Static Site**.
2.  Connect the same GitHub repository.
3.  Configure the site:
    *   **Name**: `queueflow-app` (or similar)
    *   **Root Directory**: `client`
    *   **Build Command**: `npm install && npm run build`
    *   **Publish Directory**: `dist`
4.  Add the following **Environment Variable**:
    *   `VITE_API_URL`: (Paste the Backend URL you copied in Step 1)
5.  Click **Create Static Site**.

---

## 3. Verify Deployment

*   Once both are "Live," visit your **Static Site URL**.
*   Try Logging in. 
*   **Pro Tip**: If the login fails initially, wait 30 seconds for the backend to "wake up" and try again!

---

### Why this setup?
- **Static Site** for frontend is fast and never sleeps.
- **Web Service** for backend handles your logic and real-time sockets.
- **Root Directory** settings ensure Render only looks at the specific folder it needs.

**You are now ready to go live!** 🌍🚀🛡️💎
