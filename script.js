/**
 * Abhishek & Kratika — Lacy Deluxe Digital Invitation
 * Invitely-inspired 3D Envelope Opening, Pearl Aesthetic, Audio, & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. COUNTDOWN TIMER (24 Nov 2026, 18:30 IST)
  // ==========================================
  const targetDate = new Date('2026-11-24T18:30:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    document.getElementById('cdDays').textContent = pad(d);
    document.getElementById('cdHours').textContent = pad(h);
    document.getElementById('cdMins').textContent = pad(m);
    document.getElementById('cdSecs').textContent = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ==========================================
  // 2. CANVAS AMBIENT PETALS & PEARL SHIMMER
  // ==========================================
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const TOTAL_PARTICLES = 28;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 8;
      this.speedY = Math.random() * 1.0 + 0.6;
      this.speedX = Math.random() * 1.2 - 0.6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.isPearl = Math.random() > 0.6;
      this.opacity = Math.random() * 0.4 + 0.4;
    }

    update() {
      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * 0.8 + this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.isPearl) {
        // Pearl Shimmer Particle
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size * 0.4);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.5, '#F5EDE4');
        grad.addColorStop(1, '#D4AF37');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Soft Blush Rose Petal
        const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
        grad.addColorStop(0, '#F7D6D0');
        grad.addColorStop(0.6, '#E5A99B');
        grad.addColorStop(1, '#C27D78');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.5);
        ctx.bezierCurveTo(this.size * 0.5, -this.size * 0.5, this.size * 0.5, this.size * 0.4, 0, this.size * 0.6);
        ctx.bezierCurveTo(-this.size * 0.5, this.size * 0.4, -this.size * 0.5, -this.size * 0.5, 0, -this.size * 0.5);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    particles.push(new Particle());
  }

  function renderAmbient() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(renderAmbient);
  }
  renderAmbient();


  // ==========================================
  // 3. AAJ SAJEYA VE INSTRUMENTAL MUSIC PLAYER
  // ==========================================
  let isPlayingAudio = false;
  const musicBtn = document.getElementById('musicToggleBtn');
  const bgMusic = new Audio('aaj_sajeya_music.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.65;

  function playHarpChime() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.3);
    } catch (e) {}
  }

  function startMusic() {
    bgMusic.play().then(() => {
      isPlayingAudio = true;
      musicBtn.classList.add('playing');
    }).catch(() => {
      isPlayingAudio = false;
      musicBtn.classList.remove('playing');
    });
  }

  function stopMusic() {
    bgMusic.pause();
    isPlayingAudio = false;
    musicBtn.classList.remove('playing');
  }

  musicBtn.addEventListener('click', () => {
    if (isPlayingAudio) {
      stopMusic();
      showToast('Music paused');
    } else {
      startMusic();
      showToast('Playing Aaj Sajeya Ve (Instrumental) 🎶');
    }
  });

  // Inline Video interaction with Background Music
  const inlineVideo = document.getElementById('inlineEngagementVideo');
  if (inlineVideo) {
    inlineVideo.addEventListener('play', () => {
      if (isPlayingAudio) {
        stopMusic();
      }
    });
  }


  // ==========================================
  // 4. 3D LACY ENVELOPE OPENING MECHANISM
  // ==========================================
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

  function openEnvelope() {
    playHarpChime();

    // 1. Trigger flap fold & card slide
    envelopeWrapper.classList.add('opening');

    // 2. Extra celebratory petals
    for (let i = 0; i < 30; i++) {
      const p = new Particle();
      p.x = width * 0.5 + (Math.random() - 0.5) * 150;
      p.y = height * 0.45;
      p.speedY = Math.random() * 4 - 2;
      p.speedX = Math.random() * 6 - 3;
      particles.push(p);
    }

    // 3. Fade out overlay and release body scroll
    setTimeout(() => {
      envelopeOverlay.classList.add('opened');
      document.body.classList.remove('envelope-active');

      if (!isPlayingAudio) {
        startMusic();
      }
      showToast('Welcome to Abhishek & Kratika’s Invitation ✨');
    }, 950);
  }

  openEnvelopeBtn.addEventListener('click', openEnvelope);


  // ==========================================
  // 5. HERO PHOTO SWITCHER & AUTO-CYCLE
  // ==========================================
  const heroImg = document.getElementById('heroCoupleImg');
  const photoDots = document.querySelectorAll('#heroPhotoDots .dot');
  let currentDotIndex = 0;

  photoDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      currentDotIndex = idx;
      switchHeroPhoto(dot);
    });
  });

  function switchHeroPhoto(selectedDot) {
    photoDots.forEach(d => d.classList.remove('active'));
    selectedDot.classList.add('active');
    const newSrc = selectedDot.getAttribute('data-src');

    heroImg.style.opacity = '0.4';
    setTimeout(() => {
      heroImg.src = newSrc;
      heroImg.style.opacity = '1';
    }, 180);
  }

  // Auto cycle every 6 seconds
  setInterval(() => {
    currentDotIndex = (currentDotIndex + 1) % photoDots.length;
    switchHeroPhoto(photoDots[currentDotIndex]);
  }, 6000);


  // ==========================================
  // 6. GROOM & BRIDE MINI THUMBNAILS
  // ==========================================
  function setupMiniThumbs(containerId, targetImgId) {
    const thumbs = document.querySelectorAll(`#${containerId} .mini-thumb`);
    const target = document.getElementById(targetImgId);
    if (!thumbs.length || !target) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const src = thumb.getAttribute('data-src');
        target.style.opacity = '0.3';
        setTimeout(() => {
          target.src = src;
          target.style.opacity = '1';
        }, 150);
      });
    });
  }

  setupMiniThumbs('groomThumbList', 'groomDisplayImg');
  setupMiniThumbs('brideThumbList', 'brideDisplayImg');


  // ==========================================
  // 7. GALLERY FILTER & LIGHTBOX
  // ==========================================
  const tabs = document.querySelectorAll('.lacy-tab');
  const galleryCards = document.querySelectorAll('.gallery-photo-card');
  const lightbox = document.getElementById('lacyLightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lacyCloseBtn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const itemCat = card.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.getAttribute('data-caption');
      lbImg.src = img.src;
      lbCaption.textContent = caption || '';
      lightbox.classList.add('active');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });


  // ==========================================
  // 8. RSVP SUBMISSION
  // ==========================================
  const rsvpForm = document.getElementById('lacyRsvpForm');
  const rsvpDone = document.getElementById('rsvpDoneNotice');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('rsvpName').value,
      phone: document.getElementById('rsvpPhone').value,
      status: document.querySelector('input[name="attendStatus"]:checked').value,
      count: document.getElementById('guestCount').value,
      song: document.getElementById('songRequest').value,
      date: new Date().toISOString()
    };

    const saved = JSON.parse(localStorage.getItem('lacy_rsvps') || '[]');
    saved.push(data);
    localStorage.setItem('lacy_rsvps', JSON.stringify(saved));

    rsvpForm.style.display = 'none';
    rsvpDone.style.display = 'block';

    showToast('RSVP Confirmed! Thank you! 💌');

    // Shower extra petals
    for (let i = 0; i < 20; i++) {
      const p = new Particle();
      p.x = width * 0.5;
      p.y = height * 0.6;
      p.speedY = -Math.random() * 4 - 1;
      particles.push(p);
    }
  });


  // ==========================================
  // 9. MEMORY & BLESSINGS WALL (ANI DUVARI)
  // ==========================================
  const memoryForm = document.getElementById('memoryForm');
  const memoryFeed = document.getElementById('memoryFeed');

  const defaultBlessings = [
    {
      name: "Suresh & Meena Verma",
      charm: "🧿",
      msg: "Dearest Abhishek and Kratika, may this auspicious union bring boundless prosperity, peace, and eternal affection to your homes!"
    },
    {
      name: "Shreya Kapoor",
      charm: "🌹",
      msg: "Kratika you look stunning beyond words! Abhishek bhai, treasure our lovely bride always. Counting days for Patna!"
    },
    {
      name: "Aditya & Neha Singhal",
      charm: "🥂",
      msg: "Wishing the most beautiful couple a lifetime filled with deep laughter, grand adventures, and unending joy!"
    }
  ];

  function loadMemories() {
    const raw = localStorage.getItem('lacy_memories');
    const memories = raw ? JSON.parse(raw) : defaultBlessings;
    renderMemories(memories);
  }

  function renderMemories(list) {
    memoryFeed.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'memory-note-card';
      card.innerHTML = `
        <div class="note-top">
          <span class="note-author">${escapeHTML(item.name)}</span>
          <span class="note-charm">${item.charm || '🌹'}</span>
        </div>
        <p class="note-body">"${escapeHTML(item.msg)}"</p>
      `;
      memoryFeed.appendChild(card);
    });
  }

  memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('memName').value.trim();
    const msg = document.getElementById('memMsg').value.trim();
    const charm = document.querySelector('input[name="charm"]:checked').value;

    if (!name || !msg) return;

    const raw = localStorage.getItem('lacy_memories');
    const memories = raw ? JSON.parse(raw) : defaultBlessings;

    memories.unshift({ name, msg, charm });
    localStorage.setItem('lacy_memories', JSON.stringify(memories));
    renderMemories(memories);

    memoryForm.reset();
    showToast('Blessing posted on Memory Wall! ✨');
  });

  loadMemories();


  // ==========================================
  // 10. CALENDAR & SHARE UTILITIES
  // ==========================================
  function downloadICS() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Abhishek and Kratika//Engagement//EN',
      'BEGIN:VEVENT',
      'UID:ak-engagement-20261124@patna',
      'DTSTART:20261124T130000Z', // 18:30 IST is 13:00 UTC
      'DTEND:20261124T180000Z',
      'SUMMARY:Abhishek & Kratika Engagement Ceremony 💍',
      'DESCRIPTION:Join us to celebrate the joyous engagement of Abhishek & Kratika in Patna! Ring ceremony, Sangeet & Royal Dinner.',
      'LOCATION:Heart of Bihar, Patna',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Abhishek_Kratika_Engagement.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Calendar invite (.ics) downloaded! 📅');
  }

  function openGoogleCal() {
    const title = encodeURIComponent("Abhishek & Kratika's Engagement Ceremony 💍");
    const details = encodeURIComponent("You are cordially invited to celebrate the Engagement of Abhishek & Kratika in Patna!");
    const location = encodeURIComponent("Heart of Bihar, Patna");
    const dates = "20261124T130000Z/20261124T180000Z";
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`, '_blank');
  }

  document.getElementById('calDownloadBtn')?.addEventListener('click', downloadICS);
  document.getElementById('addToCalQuickBtn')?.addEventListener('click', openGoogleCal);

  const inviteShareMsg = "💍 Two Hearts, One Forever! ✨\nYou are cordially invited to celebrate the auspicious Engagement Ceremony of Abhishek & Kratika on Tuesday, 24th November, 2026 in Patna!\n\nOpen digital invitation: " + window.location.href;

  document.getElementById('waShareBtn')?.addEventListener('click', () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(inviteShareMsg)}`, '_blank');
  });

  document.getElementById('copyInviteBtn')?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Invitation link copied! 📋');
      });
    } else {
      showToast('Link ready to share! 📋');
    }
  });


  // ==========================================
  // 11. TOAST HELPER
  // ==========================================
  function showToast(text) {
    const box = document.getElementById('toastBox');
    if (!box) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = text;
    box.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

});
