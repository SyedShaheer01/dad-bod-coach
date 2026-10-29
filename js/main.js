(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var nav = document.getElementById('mainNav');
  var bar = document.getElementById('progress');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 20);
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Highlight the current section in the menu
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#navMenu .nav-link[href^="#"]'));
  var spySections = navLinks.map(function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  });

  function updateActiveLink() {
    var line = window.innerHeight * 0.35; // section counts as current once its top passes this line
    var current = -1;
    spySections.forEach(function (sec, i) {
      if (sec && sec.getBoundingClientRect().top <= line) { current = i; }
    });
    // The booking form is not in the menu, so clear the highlight there
    var book = document.getElementById('book');
    if (book && book.getBoundingClientRect().top <= line) { current = -1; }
    navLinks.forEach(function (a, i) {
      var on = i === current;
      a.classList.toggle('active', on);
      if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();

  // Close the mobile menu after choosing a link
  var menu = document.getElementById('navMenu');
  if (menu) {
    menu.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a') : null;
      if (a && menu.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  }

  // Photo viewer
  var modal = document.getElementById('imgModal');
  var modalImg = document.getElementById('modalImg');
  if (modal && modalImg) {
    // Move focus out of the dialog before it hides, so the browser does not warn about aria-hidden
    modal.addEventListener('hide.bs.modal', function () {
      if (document.activeElement && modal.contains(document.activeElement)) { document.activeElement.blur(); }
    });
    modal.addEventListener('show.bs.modal', function (ev) {
      var t = ev.relatedTarget;
      if (t) {
        modalImg.src = t.getAttribute('data-img') || '';
        modalImg.alt = t.getAttribute('data-alt') || '';
      }
    });
  }

  // Copy link
  var copyBtn = document.getElementById('copyLink');
  var copyNote = document.getElementById('copyNote');
  if (copyBtn && copyNote) {
    copyBtn.addEventListener('click', function () {
      var url = window.location.href.split('#')[0];
      function fallback() { copyNote.textContent = 'Copy this link: ' + url; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { copyNote.textContent = 'Link copied.'; }, fallback);
      } else { fallback(); }
    });
  }

  // Booking form (demo: not connected to a server yet)
  var form = document.getElementById('bookForm');
  var result = document.getElementById('formResult');
  if (form && result) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        result.className = 'form-result';
        result.textContent = 'Please fill in the highlighted fields.';
        return;
      }
      var name = (document.getElementById('fName').value || '').trim().split(' ')[0];
      result.className = 'form-result ok';
      result.textContent = 'Thank you, ' + name + '. This is a demo preview, so the form is not connected yet. On the final site your request goes straight to your coach.';
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
