// Playback lifecycle regressions. Run with: node scripts/test_music.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class Element {
  constructor() {
    this.listeners = {};
    this.attributes = {};
    this.dataset = {};
    this.textContent = '';
    this.classList = { toggle() {} };
  }
  addEventListener(type, handler) { (this.listeners[type] ??= []).push(handler); }
  emit(type, event = {}) { (this.listeners[type] || []).forEach(fn => fn(event)); }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key] ?? null; }
}

async function run() {
  const player = new Element();
  Object.assign(player, { paused: true, muted: false, readyState: 4, currentTime: 0, calls: 0 });
  Object.defineProperty(player, 'src', {
    get() { return this.attributes.src; },
    set(value) { this.attributes.src = value; }
  });
  player.pause = () => { player.paused = true; player.emit('pause'); };
  player.play = () => {
    player.calls++;
    if (player.failure) {
      const error = player.failure;
      player.failure = null;
      return Promise.reject(error);
    }
    player.paused = false;
    return player.pending || Promise.resolve();
  };
  const cards = ['Zhu', 'Rezz'].map(name => {
    const card = new Element();
    card.dataset = { artist: name, audio: `Music/${name}.mp3` };
    card.button = new Element();
    card.button.firstElementChild = new Element();
    card.querySelector = () => card.button;
    return card;
  });
  const status = new Element(), enable = new Element(), mute = new Element();
  const document = new Element(), window = new Element();
  document.getElementById = id => ({ 'artist-player': player, 'playback-status': status, 'enable-sound': enable, 'mute-sound': mute })[id];
  document.querySelectorAll = () => cards;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../music.js'), 'utf8'), { document, window });
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
  const hover = card => card.emit('pointerenter', { pointerType: 'mouse' });
  assert.equal(player.calls, 0, 'No downloads/playback on page load');

  player.failure = { name: 'NotAllowedError' };
  hover(cards[0]); await settle();
  assert.match(status.textContent, /one click/, 'Blocked autoplay must not fail silently');
  enable.emit('click'); await settle();
  assert.equal(player.paused, false);
  assert.match(status.textContent, /Playing Zhu/);

  hover(cards[0]);
  cards[0].emit('pointerleave', { pointerType: 'mouse' });
  assert.equal(player.paused, true, 'Leaving the first enabled artist stops hover playback');

  let finish;
  player.pending = new Promise(resolve => { finish = resolve; });
  hover(cards[0]);
  player.pending = null;
  hover(cards[1]); await settle();
  finish(); await settle();
  assert.equal(player.src, 'Music/Rezz.mp3');
  assert.match(status.textContent, /Playing Rezz/, 'Late promise must not restore the previous artist');
  cards[1].emit('pointerleave', { pointerType: 'mouse' });
  assert.equal(player.paused, true);

  const calls = player.calls;
  cards[0].emit('pointerenter', { pointerType: 'touch' });
  assert.equal(player.calls, calls, 'Touch entry must not autoplay before a tap');
  cards[0].button.emit('click'); await settle();
  assert.equal(player.paused, false, 'Tap and keyboard activation play audio');
  cards[0].emit('pointerleave', { pointerType: 'touch' });
  assert.equal(player.paused, false, 'Tapped playback survives touch pointerleave');
  cards[0].button.emit('click');
  assert.equal(player.paused, true, 'Second activation pauses');

  mute.emit('click');
  hover(cards[1]);
  assert.equal(player.paused, true);
  assert.match(status.textContent, /muted/);
  mute.emit('click');
  hover(cards[1]); await settle();
  assert.equal(player.paused, false);
  document.hidden = true; document.emit('visibilitychange');
  assert.equal(player.paused, true, 'Background tabs stop playback');
  console.log('PASS: audio activation, hover, switching, stale promises, touch, pause, mute and visibility.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
