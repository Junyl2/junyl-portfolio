// pageLoader.js
import { initializeEnhancements } from './enhancements.js';

let progressInterval;

function startProgressBar() {
  const bar = document.getElementById('progress-bar');
  let width = 0;

  bar.style.transition = 'none';
  bar.style.width = '0%';

  setTimeout(() => {
    bar.style.transition = 'width 0.2s ease';
    progressInterval = setInterval(() => {
      if (width < 90) {
        width += Math.random() * 5;
        bar.style.width = `${Math.min(width, 90)}%`;
      }
    }, 200);
  }, 50);
}

function finishProgressBar() {
  const bar = document.getElementById('progress-bar');
  clearInterval(progressInterval);
  bar.style.width = '100%';

  setTimeout(() => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
  }, 500);
}

export function loadPage(page, callback) {
  const loader = document.getElementById('progress-loader');
  const firstLoader = document.getElementById('first-loader');
  const contentArea = document.getElementById('main-content');

  let slowConnectionTimeout = setTimeout(() => {
    loader.style.display = 'flex';
    startProgressBar();
  }, 500); // only show loader if it takes > 500ms

  fetch(page)
    .then((res) => {
      if (!res.ok) throw new Error('Page not found');
      return res.text();
    })
    .then((html) => {
      clearTimeout(slowConnectionTimeout); // prevent showing progress if already fast
      finishProgressBar(); // if progress did start
      loader.style.display = 'none';

      contentArea.innerHTML = html;
      window.scrollTo({ top: 0 });

      document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.toggle(
          'active',
          link.getAttribute('data-page') === page
        );
      });

      initializeEnhancements();

      const revealContent = () => {
        firstLoader.style.display = 'none';

        const flip = document.querySelector('.flip');
        if (flip) flip.style.animationPlayState = 'running';

        const wrapper = document.getElementById('app-wrapper');
        if (wrapper) wrapper.style.display = 'block';

        if (typeof callback === 'function') callback();
      };

      const lastLetter = document.querySelector(
        '.loader-name h1 span:last-child'
      );
      if (lastLetter) {
        lastLetter.addEventListener('animationend', revealContent, {
          once: true,
        });
      } else {
        setTimeout(revealContent, 4500);
      }
    })
    .catch((err) => {
      clearTimeout(slowConnectionTimeout); // still clear timeout
      console.error('Error loading page:', err);

      loader.style.display = 'flex';
      startProgressBar();

      contentArea.innerHTML = `
        <p class='error-message text-danger'>
          Oops! Something went wrong. This could be due to a poor internet connection or a server issue.
        </p>`;
      finishProgressBar();
    });
}
