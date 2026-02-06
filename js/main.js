// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }
});

// Parallax hero banners — only on desktop (skip touch/mobile for perf)
(function () {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  var heroes = document.querySelectorAll('.region-hero__bg');
  if (!heroes.length) return;

  var ticking = false;

  function updateParallax() {
    var scrollY = window.scrollY;
    heroes.forEach(function (img) {
      var parent = img.parentElement;
      var rect = parent.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      var offset = scrollY * 0.4;
      img.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();

// Dropdown toggle for touch devices
(function () {
  var dropdown = document.querySelector('.nav__dropdown');
  var trigger = document.querySelector('.nav__dropdown-trigger');
  if (!dropdown || !trigger) return;

  trigger.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded',
        dropdown.classList.contains('open') ? 'true' : 'false'
      );
    }
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
})();
