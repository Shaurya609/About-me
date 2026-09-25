/* A single media element keeps permission and playback state consistent across artists. */
(() => {
  const player = document.getElementById('artist-player');
  if (!player) return;
  const cards = [...document.querySelectorAll('.artist-card')];
  const status = document.getElementById('playback-status');
  const enable = document.getElementById('enable-sound');
  const mute = document.getElementById('mute-sound');
  let current = null;
  let pinned = false;
  let blocked = false;
  let request = 0;


  function paint(playing) {
    cards.forEach(card => {
      const active = card === current && playing;
      card.classList.toggle('is-playing', active);
      const button = card.querySelector('.artist-play');
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${active ? 'Pause' : 'Play'} ${card.dataset.artist}`);
      button.firstElementChild.textContent = active ? 'Ⅱ' : '▶';
    });
  }
  function stop(message = 'Hover over another artist, or select Play to listen.') {
    request++;
    player.pause();
    if (player.readyState > 0) player.currentTime = 0;
    current = null;
    pinned = false;
    paint(false);
    status.textContent = message;
  }
  function play(card, fromClick = false) {
    if (player.muted) {
      status.textContent = 'Sound is muted. Select Unmute to listen again.';
      return;
    }
    if (blocked && !fromClick) {
      status.textContent = 'Select Enable sound or an artist’s Play button, then hover to listen.';
      return;
    }
    if (current === card && !player.paused) return;
    const token = ++request;
    player.pause();
    current = card;
    pinned = fromClick;
    paint(false);
    // Assign only when needed; no artist tracks download on page load.
    if (player.getAttribute('src') !== card.dataset.audio) player.src = card.dataset.audio;
    else if (player.readyState > 0) player.currentTime = 0;
    status.textContent = `Loading ${card.dataset.artist}…`;
    // Keep play() directly inside click handlers to retain browser user activation.
    player.play().then(() => {
      if (token !== request) return;
      blocked = false;
      enable.textContent = 'Sound enabled';
      paint(true);
      status.textContent = `Playing ${card.dataset.artist}. ${pinned ? 'Hover another artist to switch, or use Pause.' : 'Move away to stop.'}`;
    }).catch(error => {
      if (token !== request) return;
      paint(false);
      if (error.name === 'NotAllowedError') {
        blocked = true;
        enable.textContent = 'Enable sound';
        status.textContent = 'Your browser needs one click to enable audio. Select Enable sound, then hover to listen.';
      } else if (error.name !== 'AbortError') {
        status.textContent = `Could not play ${card.dataset.artist}. Select Play to try again.`;
      }
    });
  }
  cards.forEach(card => {
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      if (current === card && !player.paused) pinned = false;
      play(card);
    });
    card.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch' && current === card && !pinned) stop();
    });
    card.querySelector('.artist-play').addEventListener('click', () => {
      if (current === card && !player.paused) stop();
      else {
        player.muted = false;
        play(card, true);
      }
    });
  });
  enable.addEventListener('click', () => {
    player.muted = false;
    blocked = false;
    play(current || cards[0], true);
  });
  mute.addEventListener('click', () => {
    player.muted = !player.muted;
    stop(player.muted ? 'Sound is muted. Select Unmute to listen again.' : 'Sound is on. Hover over an artist to listen.');
  });
  player.addEventListener('volumechange', () => {
    mute.setAttribute('aria-pressed', String(player.muted));
    mute.textContent = player.muted ? 'Unmute' : 'Mute';
  });
  player.addEventListener('pause', () => {
    if (player.paused && current) {
      paint(false);
      status.textContent = `Paused ${current.dataset.artist}. Select Play to listen again.`;
    }
  });
  player.addEventListener('playing', () => {
    if (current && !player.paused) {
      paint(true);
      status.textContent = `Playing ${current.dataset.artist}.`;
    }
  });
  player.addEventListener('ended', () => stop('Preview ended. Hover over another artist to listen.'));
  player.addEventListener('error', () => {
    if (current) {
      paint(false);
      status.textContent = `Could not load ${current.dataset.artist}. Select Play to try again.`;
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop('Playback paused while you were away. Hover or select Play to resume.');
  });
  window.addEventListener('pagehide', () => stop());
})();
