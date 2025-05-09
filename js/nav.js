import { loadPage } from './pageloader';

export function initNavLinks() {
  document.querySelectorAll('[data-page]').forEach((navLink) => {
    navLink.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');

      document
        .querySelectorAll('[data-page]')
        .forEach((nav) => nav.classList.remove('active'));
      this.classList.add('active');

      loadPage(page, () => {
        if (typeof initializeGalleryModal === 'function') {
          initializeGalleryModal();
        }
      });

      const canvas = bootstrap.Offcanvas.getInstance(
        document.getElementById('offcanvasMenu')
      );
      if (canvas) canvas.hide();
    });
  });
}
