# 💌 A Letter For Aapa

A heartfelt interactive wedding letter — built with love by her younger brother.

## What it does

- Shows a personalised letter based on whether Aapa reads it **before** or **after** her Nikah
- Optionally records her reaction via the front camera 🎥
- Lets her upload a photo/video memory 📷
- Sends everything (reaction video + photo) to a private Google Drive folder via Google Apps Script

## Setup

### 1. Deploy the Google Apps Script backend

1. Go to [script.google.com](https://script.google.com) → **New Project**
2. Paste the contents of `google-script.gs` as `Code.gs`
3. Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE` with your actual Google Drive folder ID
4. Click **Deploy → New Deployment → Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the **Web App URL**

### 2. Configure the frontend

Open `app.js` and replace:

```js
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

with your actual Web App URL from Step 1.

### 3. Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → `main` → `/ (root)`**
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- Google Apps Script (serverless backend for file uploads)
- GitHub Pages (hosting)

---

*Made with ❤️ for Aapa. Wishing you a lifetime of happiness.*
