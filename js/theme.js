// theme.js
export function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('light-mode', savedTheme === 'light');

  const toggle = document.getElementById('toggleTheme');
  if (toggle) toggle.checked = savedTheme === 'light';

  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light');
  }
}

export function initThemeToggle() {
  const toggle = document.getElementById('toggleTheme');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isLight = toggle.checked;
    document.body.classList.toggle('light-mode', isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}
