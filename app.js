/* ============================================================
   CONFIGURATION
   Paste your Google Apps Script Web App URL below after setup.
   ============================================================ */
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

/* ============================================================
   LETTER CONTENT
   ============================================================ */
const LETTER_BEFORE = `
<p>Aapa,</p>
<p>I know you're at work right now, and I also know you'll be busy tomorrow. It's your wedding tomorrow, the biggest day of your life, and I really wish I could be there. But yeah… gotta do what you gotta do, and I think the only thing I can do now is probably text you.</p>
<p>I hope you have the best day tomorrow. I know you might get a bit irritated when things don't go your way or aren't exactly the way you wanted them to be, but I hope you enjoy even those little chaotic moments because they'll all become memories someday.</p>
<p>I wish you a beautiful wedding and an even more beautiful life ahead. May you and Umar bhai always be happy together, understand each other, support each other, and keep making each other smile.</p>
<p>I know I can't say all this to your face, but you've always been the coolest, the prettiest, and my favourite.</p>
<p>I really wish I could be there to see you get married and celebrate with you. I really wish I could hold the parda for you. I wished I could bathe you in haldi like Holi colours when I saw the pictures, dance at your Sangeet, and be of help during all the wedding functions. But even though I can't be there, I'll be thinking about you tomorrow.</p>
<p>So, I wish you a happy Nikah tomorrow. May everything go according to how you planned and how you want it to be, and I hope you'll always be happy, Aapa.</p>
<p>Love ya. ❤️</p>
`;

const LETTER_AFTER = `
<p>Aapa,</p>
<p>I also know you're busy. It's your wedding, one of the biggest days of your life, and I really wish I could've been there. But yeah… gotta do what you gotta do, and I think the only thing I could've done was probably this.</p>
<p>I hope you had the best day. I know you might have gotten a bit irritated when things didn't go your way or weren't exactly the way you wanted them to be, but I hope you enjoyed even those little chaotic moments because they'll all become memories someday.</p>
<p>I wish you a beautiful wedding and an even more beautiful life ahead. May you and Umar bhai always be happy together, understand each other, support each other, and keep making each other smile.</p>
<p>I know I can't say all this to your face, but you've always been the coolest, the prettiest, and my favourite.</p>
<p>I really wish I could've been there to see you get married and celebrate with you. I really wish I could've held the parda for you. I wish I could've bathed you in haldi like Holi colours when I saw the pictures, danced at your Sangeet, and been of help during all the wedding functions. But even though I couldn't be there, I'll be thinking about you always.</p>
<p>Congratulations on your Nikah, Aapa. I hope everything went according to your plan and exactly how you wanted it to be. I love you, and I genuinely wish you both a lifetime of happiness. ❤️</p>
`;

const PROMISE_TEXT = `
<p>And if possible, be in touch, Aapa. Call me as much as you can, whether it's about something small or big, something you liked or disliked about what happened at work, something happy or sad, or if something irritated you. Or if you ever feel like you need someone to talk to, just call me and let everything out.</p>
<p>I want you to always remember that you have a younger brother, Aapa. I'll always be there for you, all my life. You can call me 24/7, so don't ever worry about my timing. I'll take care of it; just call me whenever you can.</p>
<p>I miss you guys. ❤️</p>
`;

/* ============================================================
   STATE
   ============================================================ */
let appState = {
  version:        null,   // 'before' | 'after'
  isRecording:    false,
  mediaStream:    null,
  mediaRecorder:  null,
  recordedChunks: [],
  uploadedFile:   null,
  uploadedMime:   null,
};

/* ============================================================
   SCREEN HELPERS
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/* ============================================================
   SCREEN 1 → Choose Status
   ============================================================ */
function chooseStatus(version) {
  appState.version = version;
  showScreen('screen-record');
}

/* ============================================================
   SCREEN 2 → Choose Recording
   ============================================================ */
async function chooseRecord(wantsRecord) {
  if (wantsRecord) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      appState.mediaStream = stream;

      // Show camera preview
      const preview = document.getElementById('camera-preview');
      preview.srcObject = stream;
      preview.classList.remove('hidden');

      // Start MediaRecorder
      const mr = new MediaRecorder(stream, { mimeType: getSupportedMimeType() });
      appState.mediaRecorder = mr;
      appState.recordedChunks = [];

      mr.ondataavailable = e => {
        if (e.data && e.data.size > 0) appState.recordedChunks.push(e.data);
      };
      mr.start(1000); // collect data every second

      appState.isRecording = true;
      document.getElementById('rec-indicator').classList.remove('hidden');

    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      // Continue without recording
    }
  }

  buildLetterScreen();
  showScreen('screen-letter');
  // Ensure letter always starts from the top
  document.getElementById('screen-letter').scrollTop = 0;
}

function getSupportedMimeType() {
  const types = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

/* ============================================================
   SCREEN 3 → Build Letter
   ============================================================ */
function buildLetterScreen() {
  const { version } = appState;

  // Letter body
  document.getElementById('letter-body').innerHTML = version === 'before' ? LETTER_BEFORE : LETTER_AFTER;

  // Promise section
  document.getElementById('promise-text').innerHTML = PROMISE_TEXT;

  // Action prompt & icon
  if (version === 'before') {
    document.getElementById('action-prompt').textContent =
      '📸 Take a picture of yourself in your Nikah dress — I want a sneak peek!';
    document.getElementById('upload-icon').textContent = '📷';
    document.getElementById('upload-label').textContent = 'Tap to snap / upload a photo';
    document.getElementById('file-input').setAttribute('accept', 'image/*');
  } else {
    document.getElementById('action-prompt').textContent =
      '💕 Send me your favourite moment of the wedding!';
    document.getElementById('upload-icon').textContent = '🎞️';
    document.getElementById('upload-label').textContent = 'Tap to upload a photo or video';
    document.getElementById('file-input').setAttribute('accept', 'image/*,video/*');
  }
}

/* ============================================================
   FILE UPLOAD HANDLER
   ============================================================ */
function triggerUpload() {
  document.getElementById('file-input').click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  appState.uploadedMime = file.type;

  const reader = new FileReader();
  reader.onload = (e) => {
    // Store base64 (strip data URI prefix)
    appState.uploadedFile = e.target.result.split(',')[1];

    // Show preview
    const previewArea = document.getElementById('preview-area');
    previewArea.classList.remove('hidden');
    previewArea.innerHTML = '';

    if (file.type.startsWith('image/')) {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewArea.appendChild(img);
    } else if (file.type.startsWith('video/')) {
      const vid = document.createElement('video');
      vid.src = e.target.result;
      vid.controls = true;
      previewArea.appendChild(vid);
    }
  };
  reader.readAsDataURL(file);
}

/* ============================================================
   SUBMIT
   ============================================================ */
async function submitAll() {
  const btn    = document.getElementById('btn-submit');
  const status = document.getElementById('submit-status');

  btn.disabled = true;
  status.textContent = 'Sending everything to your brother… 💌';

  // Stop recording
  let reactionBase64 = null;
  if (appState.isRecording && appState.mediaRecorder) {
    reactionBase64 = await stopRecording();
  }

  const payload = {
    version:       appState.version,
    reactionVideo: reactionBase64,
    uploadFile:    appState.uploadedFile  || null,
    uploadMime:    appState.uploadedMime  || null,
  };

  // If no script URL configured, just go to farewell
  if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    console.warn('Google Apps Script URL not configured. Skipping upload.');
    goToFarewell();
    return;
  }

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body:   JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.status === 'ok') {
      status.textContent = 'Sent! ❤️';
    } else {
      status.textContent = 'Hmm, something went wrong. But the letter was read! ❤️';
    }
  } catch (err) {
    console.error('Upload failed:', err);
    status.textContent = 'Could not send files right now, but the letter was read! ❤️';
  }

  setTimeout(goToFarewell, 1500);
}

function stopRecording() {
  return new Promise((resolve) => {
    const mr = appState.mediaRecorder;
    if (!mr || mr.state === 'inactive') { resolve(null); return; }

    mr.onstop = () => {
      const blob   = new Blob(appState.recordedChunks, { type: 'video/webm' });
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result.split(',')[1]);
      reader.readAsDataURL(blob);

      // Stop all tracks
      if (appState.mediaStream) {
        appState.mediaStream.getTracks().forEach(t => t.stop());
      }
    };
    mr.stop();
  });
}

/* ============================================================
   FAREWELL SCREEN
   ============================================================ */
function goToFarewell() {
  showScreen('screen-farewell');
  startConfetti();
}

/* ============================================================
   CONFETTI
   ============================================================ */
function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#c9a84c','#e8d08a','#c2637a','#f4c6cf','#fff8e7','#f7c0ce'];
  const pieces = Array.from({ length: 120 }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * -canvas.height,
    r:    Math.random() * 6 + 3,
    d:    Math.random() * 4 + 1,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    tilt:  Math.random() * 10 - 10,
    tiltAngle: 0,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      } else {
        ctx.rect(p.x, p.y, p.r * 1.5, p.r * 0.6);
      }
      ctx.fill();

      p.y    += p.d;
      p.tiltAngle += p.tiltSpeed;
      p.x    += Math.sin(p.tiltAngle) * 1.5;

      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
    frame = requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => cancelAnimationFrame(frame), 8000);
}

/* ============================================================
   FLOATING PETALS BACKGROUND
   ============================================================ */
(function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const EMOJIS = ['🌸', '🌹', '✨', '💮', '🌺'];
  const petals = Array.from({ length: 22 }, () => createPetal());

  function createPetal() {
    return {
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight * -1,
      size:  Math.random() * 18 + 10,
      speed: Math.random() * 0.7 + 0.3,
      sway:  Math.random() * 2 - 1,
      swayT: Math.random() * Math.PI * 2,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      alpha: Math.random() * 0.4 + 0.15,
    };
  }

  function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.swayT += 0.018;
      p.x     += Math.sin(p.swayT) * p.sway;
      p.y     += p.speed;

      ctx.globalAlpha = p.alpha;
      ctx.font = `${p.size}px serif`;
      ctx.fillText(p.emoji, p.x, p.y);

      if (p.y > window.innerHeight + 30) {
        Object.assign(p, createPetal(), { y: -30, x: Math.random() * window.innerWidth });
      }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawPetals);
  }
  drawPetals();
})();
