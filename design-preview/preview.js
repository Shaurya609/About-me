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
