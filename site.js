const skillButtons = document.querySelectorAll('.skill-tile');
const skillDetail = document.getElementById('skill-detail');
skillButtons.forEach(button => {
  button.addEventListener('click', () => {
    skillButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    skillDetail.querySelector('h3').textContent = button.lastElementChild.textContent;
    skillDetail.querySelector('p').textContent = button.dataset.description;
  });
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
const smallScreen = window.matchMedia('(max-width: 760px)');
menuButton.hidden = false;
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.hidden = smallScreen.matches;
}
closeMenu();
smallScreen.addEventListener('change', closeMenu);
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.hidden = !open;
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
// Native dialogs retain image links as a fallback when JavaScript is unavailable.
const zoomLinks = document.querySelectorAll('.zoom-image');
if (zoomLinks.length && typeof HTMLDialogElement !== 'undefined') {
  const dialog = document.createElement('dialog');
  dialog.className = 'image-dialog';
  dialog.setAttribute('aria-labelledby', 'image-caption');
  dialog.innerHTML = '<div class="dialog-toolbar"><h2 id="image-caption"></h2><button class="dialog-close" type="button" autofocus>Close ×</button></div><img alt=""><a target="_blank" rel="noopener">Open full image ↗</a>';
  document.body.append(dialog);
  let opener;
  zoomLinks.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    const caption = link.dataset.caption || link.querySelector('img').alt;
    dialog.querySelector('h2').textContent = caption;
    dialog.querySelector('img').src = link.href;
    dialog.querySelector('img').alt = caption;
    dialog.querySelector('a').href = link.href;
    dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => opener?.focus());
}
