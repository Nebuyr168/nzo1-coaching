/* =========================================================
   NZO1 COACHING — script
   - Menu mobile
   - Planning de réservation (14 jours, créneaux 30 min)
   - Formulaire d'avis (localStorage + e-mail)
   - Bandeau cookies (RGPD)
   - Animations au scroll
   ========================================================= */

(function () {
  'use strict';

  var CONTACT_EMAIL = 'nzo1.contact@gmail.com';

  /* ---------- Année footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      mobileMenu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        mobileMenu.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     PLANNING DE RÉSERVATION
     ========================================================= */
  var daysEl = document.getElementById('days');
  var slotsEl = document.getElementById('slots');
  var selectedSlotEl = document.getElementById('selectedSlot');
  var bookingForm = document.getElementById('bookingForm');

  var DOW = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  var MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

  // Créneaux proposés (modifiable par NZO1) — de 14h à 21h30, toutes les 30 min
  var START_HOUR = 14;
  var END_HOUR = 22; // exclusif
  var booking = { day: null, slot: null };

  function buildSlotTimes() {
    var times = [];
    for (var h = START_HOUR; h < END_HOUR; h++) {
      times.push(pad(h) + ':00');
      times.push(pad(h) + ':30');
    }
    return times;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function buildDays() {
    if (!daysEl) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var added = 0;
    for (var i = 0; added < 14 && i < 30; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() + i);
      var dow = d.getDay();
      if (dow === 0) continue; // pas de séance le dimanche (modifiable)

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day';
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', 'false');
      btn.dataset.iso = d.toISOString();
      btn.innerHTML =
        '<span class="day__dow">' + DOW[dow] + '</span>' +
        '<span class="day__date">' + d.getDate() + ' ' + MONTHS[d.getMonth()] + '</span>';

      btn.addEventListener('click', function () {
        daysEl.querySelectorAll('.day').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        this.setAttribute('aria-selected', 'true');
        booking.day = new Date(this.dataset.iso);
        booking.slot = null;
        renderSlots();
        updateSelected();
      });
      daysEl.appendChild(btn);
      added++;
    }
  }

  function renderSlots() {
    if (!slotsEl) return;
    slotsEl.innerHTML = '';
    var times = buildSlotTimes();
    times.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'slot';
      b.textContent = t;
      b.setAttribute('role', 'option');
      b.setAttribute('aria-selected', 'false');
      b.addEventListener('click', function () {
        slotsEl.querySelectorAll('.slot').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        this.setAttribute('aria-selected', 'true');
        booking.slot = t;
        updateSelected();
      });
      slotsEl.appendChild(b);
    });
  }

  function formatDay(d) {
    return DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
  }

  function updateSelected() {
    if (!selectedSlotEl) return;
    if (booking.day && booking.slot) {
      selectedSlotEl.textContent = 'Créneau choisi : ' + formatDay(booking.day) + ' à ' + booking.slot;
      selectedSlotEl.classList.add('is-set');
    } else if (booking.day) {
      selectedSlotEl.textContent = formatDay(booking.day) + ' — choisis une heure';
      selectedSlotEl.classList.remove('is-set');
    } else {
      selectedSlotEl.textContent = 'Aucun créneau sélectionné';
      selectedSlotEl.classList.remove('is-set');
    }
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('bk-name').value.trim();
      var level = document.getElementById('bk-level').value.trim();
      var offer = document.getElementById('bk-offer').value;
      var msg = document.getElementById('bk-msg').value.trim();

      if (!name) { document.getElementById('bk-name').focus(); return; }
      if (!booking.day || !booking.slot) {
        selectedSlotEl.textContent = 'Choisis d\'abord un jour et une heure.';
        selectedSlotEl.classList.remove('is-set');
        return;
      }

      var when = formatDay(booking.day) + ' à ' + booking.slot;
      var subject = 'Réservation coaching — ' + name + ' (' + when + ')';
      var body =
        'Bonjour NZO1,\n\n' +
        'Je souhaite réserver une séance de coaching.\n\n' +
        '• Pseudo / prénom : ' + name + '\n' +
        '• Créneau souhaité : ' + when + '\n' +
        '• Offre : ' + offer + '\n' +
        '• Jeu & niveau : ' + (level || 'non précisé') + '\n' +
        '• Objectif : ' + (msg || 'non précisé') + '\n\n' +
        'Merci, à bientôt !';

      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- Copier le pseudo Discord ---------- */
  var copyDiscord = document.getElementById('copyDiscord');
  if (copyDiscord) {
    copyDiscord.addEventListener('click', function () {
      var handle = this.dataset.discord;
      var self = this;
      var done = function () {
        var old = self.textContent;
        self.textContent = 'copié ✓';
        setTimeout(function () { self.textContent = old; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(handle).then(done, done);
      } else { done(); }
    });
  }

  /* =========================================================
     FORMULAIRE D'AVIS (localStorage + e-mail de validation)
     ========================================================= */
  var reviewForm = document.getElementById('reviewForm');
  var reviewsGrid = document.getElementById('reviewsGrid');
  var reviewNote = document.getElementById('reviewNote');
  var STORE_KEY = 'nzo1_reviews';

  function loadStoredReviews() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }

  function renderStoredReviews() {
    if (!reviewsGrid) return;
    var stored = loadStoredReviews();
    stored.forEach(function (r) {
      reviewsGrid.insertBefore(buildReviewEl(r), reviewsGrid.firstChild);
    });
  }

  function buildReviewEl(r) {
    var fig = document.createElement('figure');
    fig.className = 'review is-new';
    var rating = Math.max(3, Math.min(5, parseInt(r.rating, 10) || 5));
    fig.innerHTML =
      '<div class="stars" aria-label="' + rating + ' sur 5">' + '★'.repeat(rating) + '</div>' +
      '<blockquote></blockquote>' +
      '<figcaption>— <span class="rv-name"></span> <span class="ph-tag">en attente de validation</span></figcaption>';
    fig.querySelector('blockquote').textContent = '« ' + r.text + ' »';
    fig.querySelector('.rv-name').textContent = r.name;
    return fig;
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('rv-name').value.trim();
      var rating = document.getElementById('rv-rating').value;
      var text = document.getElementById('rv-text').value.trim();
      if (!name || !text) return;

      var review = { name: name, rating: rating, text: text };

      // 1) Affichage immédiat (local au navigateur du visiteur)
      var stored = loadStoredReviews();
      stored.push(review);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(stored)); } catch (err) {}
      reviewsGrid.insertBefore(buildReviewEl(review), reviewsGrid.firstChild);

      // 2) Envoi à NZO1 pour validation
      var subject = 'Nouvel avis — ' + name + ' (' + rating + '★)';
      var body = 'Avis laissé sur le site :\n\n' +
        'Nom : ' + name + '\nNote : ' + rating + '/5\n\n' + text;
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      reviewForm.reset();
      if (reviewNote) reviewNote.textContent = 'Merci ! Ton avis est affiché et m\'a été envoyé pour validation.';
    });
  }

  renderStoredReviews();

  /* =========================================================
     BANDEAU COOKIES (RGPD)
     ========================================================= */
  var cookie = document.getElementById('cookie');
  var COOKIE_KEY = 'nzo1_cookie_consent';
  if (cookie) {
    var consent = null;
    try { consent = localStorage.getItem(COOKIE_KEY); } catch (e) {}
    if (!consent) { cookie.hidden = false; }

    function setConsent(v) {
      try { localStorage.setItem(COOKIE_KEY, v); } catch (e) {}
      cookie.hidden = true;
    }
    var acc = document.getElementById('cookieAccept');
    var ref = document.getElementById('cookieRefuse');
    if (acc) acc.addEventListener('click', function () { setConsent('accepted'); });
    if (ref) ref.addEventListener('click', function () { setConsent('refused'); });
  }

  /* =========================================================
     ANIMATIONS AU SCROLL (reveal)
     ========================================================= */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Init ---------- */
  buildDays();

})();
