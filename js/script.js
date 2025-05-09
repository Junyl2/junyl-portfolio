// Show loader and load a page dynamically
function loadPage(page, callback) {
    const loader = document.getElementById("progress-loader");
    const firstLoader = document.getElementById("first-loader");
    const contentArea = document.getElementById("main-content");

    loader.style.display = "flex";
    startProgressBar();

    fetch(page)
        .then((res) => {
            if (!res.ok) throw new Error("Page not found");
            return res.text();
        })
        .then((html) => {
            contentArea.innerHTML = html;

            /* Reinitialize G light box */
            setTimeout(() => {
                loader.style.display = "none";
                initializeTooltips();
                AOS.refresh();

                // Reinitialize GLightbox
                if (typeof GLightbox === "function") {
                    GLightbox({ selector: '.glightbox' });
                }

                // Reinitialize Masonry
                const grid = document.querySelector('[data-masonry]');
                if (grid) {
                    new Masonry(grid, {
                        percentPosition: true,
                        itemSelector: '.col-sm-6',
                    });
                }

                if (typeof callback === "function") callback();

            }, 1400);

            document.querySelectorAll(".nav-link").forEach(link => {
                const linkPage = link.getAttribute("data-page");
                link.classList.toggle("active", linkPage === page);
            });

            window.scrollTo({ top: 0, left: 0 });

            thankyouModal();

            setTimeout(() => {
                document.querySelector('.flip').style.animationPlayState = 'running';
                document.getElementById("app-wrapper").style.display = "block";

            }, 3400);

            setTimeout(() => {
                firstLoader.style.display = 'none';
            }, 4000);

            setTimeout(() => {
                finishProgressBar();
            }, 400);

            setTimeout(() => {
                loader.style.display = "none";
                initializeTooltips();
                AOS.refresh();
                if (typeof callback === "function") callback();

            }, 1400);


        })
        .catch((err) => {
            console.error("Error loading page:", err);
            contentArea.innerHTML = "<p class='error-message text-danger'>Oops! Something went wrong. This could be due to a poor internet connection or an issue with the server.</p>";
            loader.style.display = "none";
            finishProgressBar();
        });


}

//real time loading bar on every page starts.
function startProgressBar() {
    const bar = document.getElementById("progress-bar");
    bar.style.width = "0%";
    setTimeout(() => {
        bar.style.transition = "width 0.1s ease";
        bar.style.width = "70";
    }, 50);
}

function finishProgressBar() {
    const bar = document.getElementById("progress-bar");
    bar.style.width = "100%";

    setTimeout(() => {
        bar.style.transition = "none";
        bar.style.width = "0%";
    }, 70);
}


function applySavedTheme() {
    // Get saved theme OR default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    const isLight = savedTheme === 'light';

    document.body.classList.toggle('light-mode', isLight);

    const toggleCheckbox = document.getElementById('toggleTheme');
    if (toggleCheckbox) {
        toggleCheckbox.checked = isLight;
    }

    // Save default to localStorage if not yet set
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
    }
}

function initThemeToggle() {
    const toggleCheckbox = document.getElementById('toggleTheme');
    if (!toggleCheckbox) return;

    toggleCheckbox.addEventListener('change', () => {
        const isLight = toggleCheckbox.checked;
        document.body.classList.toggle('light-mode', isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    initThemeToggle();
});

document.addEventListener("click", function (e) {
    const target = e.target.closest("[data-page]"); // support clicks on child elements too
    if (target) {
        e.preventDefault();
        const page = target.getAttribute("data-page");
        loadPage(page);
    }
});


function thankyouModal() {
    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = form.querySelector('input[type="text"]');
            const userName = document.getElementById("userName");

            if (nameInput && userName) {
                userName.textContent = nameInput.value.trim();
            }

            const thankyou = new bootstrap.Modal(document.getElementById("thankYouModal"));
            thankyou.show();

            this.reset();
        });
    }
}

// Load home.html initially
window.addEventListener("DOMContentLoaded", () => {

    loadPage("home.html", () => {
        initializeGalleryModal();
    });
    AOS.init({
        once: true
    });
});

const lightbox = GLightbox({
    selector: '.glightbox'
});


// Initialize Bootstrap tooltips for newly loaded content
function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
}

// Handle clicks on nav links
document.querySelectorAll("[data-page]").forEach((navLink) => {
    navLink.addEventListener("click", function (e) {
        e.preventDefault();
        const page = this.getAttribute("data-page");

        document.querySelectorAll("[data-page]").forEach((nav) =>
            nav.classList.remove("active")
        );
        this.classList.add("active");

        loadPage(page, () => {
            initializeGalleryModal(); // Rebind modal clicks
        });

        // Close offcanvas if open (mobile)
        const canvas = bootstrap.Offcanvas.getInstance(
            document.getElementById("offcanvasMenu")
        );
        if (canvas) canvas.hide();
    });
});


