/* ============================================================
   GOOGLE APPS SCRIPT - Paste this in script.google.com
   ============================================================
   Instructions:
   1. Go to https://script.google.com → New Project
   2. Paste this entire file as Code.gs
   3. Replace FOLDER_ID with your Google Drive folder ID
      (it's the long string in the folder's URL)
   4. Click Deploy → New Deployment → Web App
      - Execute as: Me
      - Who has access: Anyone
   5. Copy the Web App URL and paste it into app.js
      as the GOOGLE_SCRIPT_URL constant at the top.
   ============================================================ */

const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';

function doPost(e) {
  try {
    const data     = JSON.parse(e.postData.contents);
    const folder   = DriveApp.getFolderById(FOLDER_ID);
    const stamp    = new Date().toISOString().replace(/[:.]/g, '-');
    const version  = data.version || 'unknown';    // 'before' or 'after'
    const label    = version === 'before' ? 'Before-Nikah' : 'After-Nikah';

    // ── Save reaction video ──────────────────────────────────
    if (data.reactionVideo) {
      const videoBlob  = Utilities.newBlob(
        Utilities.base64Decode(data.reactionVideo),
        'video/webm',
        `Aapa-Reaction-${label}-${stamp}.webm`
      );
      folder.createFile(videoBlob);
    }

    // ── Save uploaded photo / video ──────────────────────────
    if (data.uploadFile) {
      const mimeType = data.uploadMime || 'image/jpeg';
      const ext      = mimeType.split('/')[1] || 'jpg';
      const fileBlob = Utilities.newBlob(
        Utilities.base64Decode(data.uploadFile),
        mimeType,
        `Aapa-${label}-Memory-${stamp}.${ext}`
      );
      folder.createFile(fileBlob);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
