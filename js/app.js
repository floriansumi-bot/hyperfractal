/* HyperFractal landing — progressive enhancement + hero canvas */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile nav
  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal-on-scroll (visible-by-default via CSS fallback if this never runs)
  var reveals = document.querySelectorAll(".reveal");
  function revealAll() { reveals.forEach(function (el) { el.classList.add("in"); }); }
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    window.addEventListener("load", function () {
      setTimeout(function () { if (!document.querySelector(".reveal.in")) revealAll(); }, 1200);
    });
  }

  // ---- Hero psychedelic plasma (lightweight canvas) ----
  var canvas = document.getElementById("bg");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var blobs = [
      { c: "#00f0ff", x: 0.25, y: 0.35, r: 0.55, sx: 0.00021, sy: 0.00017, px: 0, py: 1.7 },
      { c: "#ff00e6", x: 0.72, y: 0.30, r: 0.52, sx: 0.00018, sy: 0.00023, px: 2.1, py: 0.4 },
      { c: "#9b5cff", x: 0.50, y: 0.65, r: 0.60, sx: 0.00025, sy: 0.00015, px: 4.0, py: 3.1 },
      { c: "#3bff8f", x: 0.35, y: 0.72, r: 0.45, sx: 0.00016, sy: 0.00020, px: 1.0, py: 5.2 }
    ];
    var w = 0, h = 0, dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.4);
      // render at reduced internal resolution for speed (blurry blobs hide it)
      var scale = 0.5 * dpr;
      w = Math.max(1, Math.round(canvas.clientWidth * scale));
      h = Math.max(1, Math.round(canvas.clientHeight * scale));
      canvas.width = w; canvas.height = h;
    }

    function draw(t) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#070512";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var cx = (b.x + Math.sin(t * b.sx + b.px) * 0.18) * w;
        var cy = (b.y + Math.cos(t * b.sy + b.py) * 0.18) * h;
        var rad = b.r * Math.min(w, h);
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, b.c + "cc");
        g.addColorStop(0.45, b.c + "33");
        g.addColorStop(1, b.c + "00");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      draw(8000); // single static frame
    } else {
      var running = true, raf;
      function loop(ts) { if (running) { draw(ts); raf = requestAnimationFrame(loop); } }
      raf = requestAnimationFrame(loop);
      document.addEventListener("visibilitychange", function () {
        running = !document.hidden;
        if (running) raf = requestAnimationFrame(loop);
        else cancelAnimationFrame(raf);
      });
    }
  }

  // Service worker (offline shell)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
