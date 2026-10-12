/* ASHWIN — reveal on scroll + active nav. No dependencies. */
(function () {
  "use strict";

  /* ---- mark the current page in both navs ---- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll(".nav a, .mnav a"), function (a) {
    if ((a.getAttribute("href") || "").toLowerCase() === here) a.classList.add("is-on");
  });

  /* ---- deep links -----------------------------------------------------
     A hash jump (family.html#shanila) is resolved before the webfonts land.
     Once they do, the text reflows taller and the browser never re-aims, so
     the visitor ends up hundreds of pixels short of the profile they clicked.
     Re-aim once things have settled. Skipped if the visitor has scrolled.
  -------------------------------------------------------------------- */
  (function () {
    if (!location.hash || location.hash.length < 2) return;
    var target;
    try { target = document.querySelector(location.hash); } catch (e) { return; }
    if (!target) return;

    /* Cancel on a real gesture, not on a scroll-position change: the browser
       moves the page itself while resolving the hash, and watching scrollY
       made the correction cancel itself. */
    var taken = false;
    ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) {
      window.addEventListener(ev, function () { taken = true; }, { passive: true, once: true });
    });

    function aim() {
      if (taken) return;
      target.scrollIntoView({ block: "start", behavior: "auto" });
    }
    aim();
    window.addEventListener("load", aim);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(aim);
    setTimeout(aim, 500);
    setTimeout(aim, 1500);
  })();

  /* ---- reveal on scroll ---------------------------------------------
     A plain rAF-throttled sweep rather than IntersectionObserver: the
     observer's initial pass runs before webfonts settle, so anything
     sitting across the fold gets measured at the wrong height and is
     never revealed. Sweeping on load / scroll / resize / fonts.ready
     cannot miss. Elements fully above the fold on arrival show at once.
  -------------------------------------------------------------------- */
  var pending = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!pending.length) return;

  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) {
    pending.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var queued = false;

  function sweep() {
    queued = false;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var keep = [];
    for (var i = 0; i < pending.length; i++) {
      var el = pending[i];
      var b = el.getBoundingClientRect();
      /* Visible once its top crosses 94% of the viewport. No lower bound: landing
         on a deep link (family.html#shanila) must also reveal everything the jump
         scrolled past, or the page above the anchor stays blank. */
      if (b.top < h * 0.94) el.classList.add("is-in");
      else keep.push(el);
    }
    pending = keep;
    if (!pending.length) teardown();
  }

  function request() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(sweep);
  }

  function teardown() {
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", request);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  window.addEventListener("load", request);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(request);

  request();
  /* belt and braces: images finishing late can shift the page */
  setTimeout(request, 400);
  setTimeout(request, 1400);
})();

/* ASHWIN — the phone menu.
   One button, one list of pages. Above 760px the CSS hides both and the plain
   row of links in the topbar does the work. */
(function () {
  "use strict";

  var btn = document.getElementById("menuBtn");
  var panel = document.getElementById("mnav");
  if (!btn || !panel) return;

  function set(open) {
    panel.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  btn.addEventListener("click", function () {
    set(!panel.classList.contains("is-open"));
  });

  panel.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("a")) set(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.keyCode === 27) set(false);
  });

  document.addEventListener("click", function (e) {
    if (!panel.classList.contains("is-open")) return;
    if (e.target.closest && !e.target.closest("#mnav, #menuBtn")) set(false);
  });

  /* Only a real width change closes it. A bare resize listener also fires when
     a phone hides its address bar, which would shut the menu under the thumb
     still reaching for it. */
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    set(false);
  });
})();
