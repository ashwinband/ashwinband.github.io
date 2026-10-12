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

/* ASHWIN — dropdown navigation.
   The open state is a class set here rather than left to :hover and
   :focus-within alone, so that pointer, keyboard and touch all drive the
   same explicit state and it can be inspected. The CSS keeps matching
   rules for both pseudo-classes, which is what runs if this never loads. */
(function () {
  "use strict";

  var coarse = window.matchMedia && window.matchMedia("(hover: none)").matches;
  var drops = Array.prototype.slice.call(document.querySelectorAll(".nd"));

  function closeAll(except) {
    drops.forEach(function (d) { if (d !== except) d.classList.remove("is-open"); });
  }

  /* Pin a panel that would otherwise hang off the window. Measured each time
     it opens, not once up front: the nav is laid out differently after the
     webfonts land, and body is overflow-x:hidden, so anything past the edge
     is clipped away rather than reachable by scrolling. */
  function place(d) {
    var m = d.querySelector(".nd__m");
    if (!m) return;
    m.classList.remove("is-left", "is-right");
    var b = m.getBoundingClientRect(), pad = 12;
    if (b.left < pad) m.classList.add("is-left");
    else if (b.right > window.innerWidth - pad) m.classList.add("is-right");
  }

  function open(d) { closeAll(d); d.classList.add("is-open"); place(d); }
  function shut(d) { d.classList.remove("is-open"); }

  drops.forEach(function (d) {
    var top = d.querySelector(":scope > a");
    if (!top) return;

    if (!coarse) {
      /* The panel and the bridge pseudo-element are both inside .nd, so
         reaching for either does not count as leaving it. */
      d.addEventListener("mouseenter", function () { open(d); });
      d.addEventListener("mouseleave", function () { shut(d); });
    }

    d.addEventListener("focusin", function () { open(d); });
    d.addEventListener("focusout", function (e) {
      if (!d.contains(e.relatedTarget)) shut(d);
    });

    /* No hover on a touch screen: first tap opens, a second tap on the same
       link follows it to the page. */
    top.addEventListener("click", function (e) {
      if (!coarse) return;
      if (!d.classList.contains("is-open")) { e.preventDefault(); open(d); }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" && e.keyCode !== 27) return;
    var focused = document.querySelector(".nd.is-open :focus");
    closeAll(null);
    if (focused && focused.blur) focused.blur();
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".nd")) closeAll(null);
  });

  /* Only a real width change closes them. A bare resize listener also fires
     when a phone hides its address bar, which would shut the menu underneath
     the thumb that is still reaching for it. */
  var lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    closeAll(null);
  });

  /* ---- the mobile panel ---- */
  var btn = document.getElementById("menuBtn");
  var panel = document.getElementById("mnav");

  if (btn && panel) {
    btn.addEventListener("click", function () {
      var on = panel.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", on ? "true" : "false");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".mn__c"), function (c) {
    c.addEventListener("click", function () {
      var m = document.getElementById(c.getAttribute("aria-controls"));
      if (!m) return;
      var on = m.classList.toggle("is-open");
      c.setAttribute("aria-expanded", on ? "true" : "false");
    });
  });

  /* A link into the page you are already on does not reload, so nothing else
     would shut the panel covering the text you just asked for. */
  if (panel) {
    panel.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      var href = a.getAttribute("href") || "";
      var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      var file = href.split("#")[0].toLowerCase();
      if (href.charAt(0) === "#" || file === "" || file === here) {
        panel.classList.remove("is-open");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
