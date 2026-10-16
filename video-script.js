/**
 * Abhishek & Kratika — Engagement Video Webpage Script
 * Video playback, Story segment progress bars, Chapters, Fullscreen & Sharing
 */

document.addEventListener('DOMContentLoaded', () => {

  const video = document.getElementById('engagementVideo');
  const playOverlay = document.getElementById('playOverlay');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const timeDisplay = document.getElementById('timeDisplay');
  const chapterToast = document.getElementById('chapterToast');
  const chapterText = document.getElementById('chapterText');
  const segments = document.querySelectorAll('.story-progress-bar .segment');
  const chapterNavItems = document.querySelectorAll('#chapterNavList li');

  const chapters = [
    { start: 0, end: 6.0, title: "॥ श्री गणेशाय नमः ॥ Auspicious Beginning" },
    { start: 6.0, end: 12.0, title: "Kratika & Abhishek — Are Getting Engaged" },
    { start: 12.0, end: 18.0, title: "Cordially Invited — Golden Rings Ceremony" },
    { start: 18.0, end: 24.5, title: "Save The Date — Heart of Bihar, Patna" }
  ];

  let currentChapterIndex = -1;

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function playVideo() {
    video.play().then(() => {
      playOverlay.classList.add('hidden');
      playPauseBtn.textContent = '⏸️';
    }).catch(err => {
      console.log('Playback error:', err);
    });
  }

  function pauseVideo() {
    video.pause();
    playOverlay.classList.remove('hidden');
    playPauseBtn.textContent = '▶️';
  }

  function togglePlay() {
    if (video.paused) {
      playVideo();
    } else {
      pauseVideo();
    }
  }

  bigPlayBtn.addEventListener('click', playVideo);
  playOverlay.addEventListener('click', playVideo);
  playPauseBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  // Mute / Unmute
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? '🔇' : '🔊';
  });

  // Time & Progress Update
  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime;
    const dur = video.duration || 24;

    timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;

    // Update Story Segments
    const segDuration = dur / segments.length;
    segments.forEach((seg, idx) => {
      const segStart = idx * segDuration;
      const segEnd = (idx + 1) * segDuration;
      const fill = seg.querySelector('.fill');

      if (cur < segStart) {
        fill.style.width = '0%';
      } else if (cur >= segEnd) {
        fill.style.width = '100%';
      } else {
        const pct = ((cur - segStart) / segDuration) * 100;
        fill.style.width = `${pct}%`;
      }
    });

    // Determine current chapter
    const chIdx = chapters.findIndex(c => cur >= c.start && cur < c.end);
    if (chIdx !== -1 && chIdx !== currentChapterIndex) {
      currentChapterIndex = chIdx;
      chapterText.textContent = chapters[chIdx].title;
      chapterToast.classList.add('show');
      setTimeout(() => chapterToast.classList.remove('show'), 2400);

      // Highlight in list
      chapterNavItems.forEach((item, i) => {
        if (i === chIdx) item.classList.add('active');
        else item.classList.remove('active');
      });
    }
  });

  video.addEventListener('ended', () => {
    pauseVideo();
    video.currentTime = 0;
  });

  // Click on chapter nav items
  chapterNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const seek = parseFloat(item.getAttribute('data-seek'));
      video.currentTime = seek;
      playVideo();
    });
  });

  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    const viewport = document.getElementById('videoViewport');
    if (!document.fullscreenElement) {
      if (viewport.requestFullscreen) viewport.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // Quick RSVP Form
  const qForm = document.getElementById('quickRsvpForm');
  const qSuccess = document.getElementById('qRsvpSuccess');

  qForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rsvp = {
      name: document.getElementById('qName').value,
      phone: document.getElementById('qPhone').value,
      status: document.getElementById('qAttendance').value,
      count: document.getElementById('qCount').value,
      date: new Date().toISOString()
    };

    const saved = JSON.parse(localStorage.getItem('video_rsvps') || '[]');
    saved.push(rsvp);
    localStorage.setItem('video_rsvps', JSON.stringify(saved));

    qForm.style.display = 'none';
    qSuccess.style.display = 'block';
  });

  // WhatsApp Share
  const shareMsg = "💍 Watch Abhishek & Kratika's Official Engagement Invitation Video! ✨\nDate: Tuesday, 24th November, 2026\nVenue: Heart of Bihar, Patna\n\nWatch & Download Video: " + window.location.href;

  document.getElementById('waShareBtn')?.addEventListener('click', () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`, '_blank');
  });

});
