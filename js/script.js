document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const menuBtn = document.querySelector('#menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const yearEl = document.querySelector('#year');
  const page = document.body.dataset.page;

  const handleNav = () => {
    if (window.scrollY > 30) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  handleNav();
  window.addEventListener('scroll', handleNav);

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
function toggleMobileMenu() {
  document.getElementById("mobile-menu").classList.toggle("show");
}

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealElements.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (page) {
    const active = document.querySelectorAll(`[data-page-link="${page}"]`);
    active.forEach((link) => link.classList.add('text-accent', 'font-semibold'));
  }
});
