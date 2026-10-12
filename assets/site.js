/* ASHWIN — reveal on scroll + active nav. No dependencies. */
(function () {
  "use strict";

  /* ---- mark the current page in both navs ---- */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll(".nav a, .mnav a"), function (a) {
    if ((a.getAttribute("href") || "").toLowerCase() === here) a.classList.add("is-on");
  });

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
      /* visible once its top crosses 94% of the viewport and it is not past the top */
      if (b.top < h * 0.94 && b.bottom > -40) el.classList.add("is-in");
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
