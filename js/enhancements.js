export function initializeEnhancements() {
  // Bootstrap Tooltips
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
    new bootstrap.Tooltip(el);
  });

  // AOS animations
  AOS.refresh();

  // Lightbox
  if (typeof GLightbox === 'function') {
    GLightbox({ selector: '.glightbox' });
  }

  // Masonry (wait for images first)
  const grid = document.querySelector('[data-masonry]');
  if (grid && typeof Masonry !== 'undefined') {
    const images = grid.querySelectorAll('img');
    const imageLoadPromises = Array.from(images).map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    });

    Promise.all(imageLoadPromises).then(() => {
      new Masonry(grid, {
        percentPosition: true,
        itemSelector: '.col-sm-6',
      });
    });
  }

  // Form Modal
  const form = document.getElementById('contactForm');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const userNameDisplay = document.getElementById('userName');
      const nameInput = form.querySelector('input[type="text"]');
      if (userNameDisplay && nameInput) {
        userNameDisplay.textContent = nameInput.value.trim();
      }

      new bootstrap.Modal(document.getElementById('thankYouModal')).show();
      form.reset();
    };
  }
}
