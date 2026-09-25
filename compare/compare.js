(() => {
  const root = document.documentElement;
  const selector = document.getElementById('section');
  root.classList.add('js');
  root.dataset.view = 'before';
  document.querySelector('.picker').hidden = false;
  document.querySelector('.switch').hidden = false;
  function selectSection() {
    const page = selector.value;
    const title = selector.selectedOptions[0].textContent;
    for (const [name, path, label] of [['legacy', '../legacy/', 'Original'], ['current', '../', 'Current']]) {
      const frame = document.getElementById(`${name}-frame`);
      frame.src = path + page;
      frame.title = `${label} portfolio - ${title}`;
      document.getElementById(`${name}-link`).href = path + page;
    }
  }
  selector.addEventListener('change', selectSection);
  document.querySelectorAll('[data-view]').forEach(button => {
    if (button.tagName !== 'BUTTON') return;
    button.addEventListener('click', () => {
      root.dataset.view = button.dataset.view;
      document.querySelectorAll('.switch button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      // Reload the hidden frame to stop any music it might be playing.
      const hidden = document.getElementById(button.dataset.view === 'before' ? 'current-frame' : 'legacy-frame');
      hidden.src = hidden.getAttribute('src');
    });
  });
})();
