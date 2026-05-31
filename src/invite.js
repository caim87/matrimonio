/* ============================================================
   Leonardo & Angélica — interacciones
   ============================================================ */

/* ---- CONFIGURA AQUÍ ------------------------------------------------
   Reemplaza estos valores con tus enlaces reales cuando los tengas.
-------------------------------------------------------------------- */
const CONFIG = {
  // Fecha y hora del evento (ceremonia)
  weddingDate: new Date("2026-08-05T15:00:00-05:00"),
  // Enlace a tu playlist colaborativa de Spotify
  spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
  // Enlace de un video Save the Date (YouTube/Vimeo embed o .mp4). Déjalo vacío para usar solo el póster.
  videoEmbedUrl: "",
  // Álbum compartido de Google Fotos para que los invitados suban y vean fotos
  albumUrl: "https://photos.app.goo.gl/wvn5RZgJannDmine9"
};

/* ---- Countdown ---------------------------------------------------- */
(function countdown() {
  const d = document.getElementById("cd-d");
  const h = document.getElementById("cd-h");
  const m = document.getElementById("cd-m");
  const s = document.getElementById("cd-s");
  if (!d) return;
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    const diff = CONFIG.weddingDate - new Date();
    if (diff <= 0) {
      d.textContent = "00"; h.textContent = "00"; m.textContent = "00"; s.textContent = "00";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    d.textContent = days; h.textContent = pad(hrs); m.textContent = pad(mins); s.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---- Reveal on scroll --------------------------------------------- */
(function reveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
})();

/* ---- Nav active state --------------------------------------------- */
(function nav() {
  const links = document.querySelectorAll(".nav a");
  const map = {};
  links.forEach((a) => { map[a.dataset.sec] = a; });
  const sections = [...links].map((a) => document.getElementById(a.dataset.sec)).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        const a = map[e.target.id];
        if (a) a.classList.add("active");
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((sec) => io.observe(sec));
})();

/* ---- Toast helper ------------------------------------------------- */
const toast = (function () {
  const el = document.getElementById("toast");
  let t;
  return function (msg) {
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(t);
    t = setTimeout(() => el.classList.remove("show"), 2600);
  };
})();

/* ---- Spotify link ------------------------------------------------- */
(function spotify() {
  const link = document.getElementById("spotifyLink");
  if (!link) return;
  link.href = CONFIG.spotifyUrl;
  link.addEventListener("click", (e) => {
    if (!CONFIG.spotifyUrl || CONFIG.spotifyUrl === "#") {
      e.preventDefault();
      toast("Agrega tu enlace de Spotify");
    }
  });
})();

/* ---- Save the Date video ------------------------------------------ */
(function video() {
  const btn = document.getElementById("playBtn");
  const vid = document.getElementById("stdVideo");
  if (!btn || !vid) return;
  vid.addEventListener("click", () => {
    if (!vid.paused) { vid.pause(); }
  });
  vid.addEventListener("play", () => btn.classList.add("hidden"));
  vid.addEventListener("pause", () => btn.classList.remove("hidden"));
  vid.addEventListener("ended", () => btn.classList.remove("hidden"));
  btn.addEventListener("click", () => {
    vid.controls = true;
    const p = vid.play();
    if (p && p.catch) p.catch(() => toast("Toca el video para reproducir"));
  });
})();

/* ---- Gallery lightbox --------------------------------------------- */
(function gallery() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const grid = document.getElementById("galGrid");
  if (!lb || !grid) return;

  const imgs = [...grid.querySelectorAll("img")];
  const sources = imgs.map((im) => im.getAttribute("src"));
  let idx = 0;

  function open(i) {
    idx = i;
    lbImg.src = sources[idx];
    lb.classList.add("open");
  }
  function show(n) { idx = (n + sources.length) % sources.length; lbImg.src = sources[idx]; }

  imgs.forEach((im, i) => im.addEventListener("click", () => open(i)));

  document.getElementById("lbClose").addEventListener("click", () => lb.classList.remove("open"));
  document.getElementById("lbNext").addEventListener("click", () => show(idx + 1));
  document.getElementById("lbPrev").addEventListener("click", () => show(idx - 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.classList.remove("open"); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });
})();

/* ---- Guest photos → Google Photos shared album ------------------- */
(function guestAlbum() {
  const add = document.getElementById("albumAdd");
  const view = document.getElementById("albumView");
  if (!add || !view) return;
  const url = CONFIG.albumUrl;
  add.href = url;
  view.href = url;
  [add, view].forEach((a) => a.addEventListener("click", (e) => {
    if (!url || url === "#") { e.preventDefault(); toast("Agrega el enlace del álbum"); }
  }));
})();

/* ---- RSVP --------------------------------------------------------- */
(function rsvp() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;
  const choice = document.getElementById("attendChoice");
  const guestsField = document.getElementById("guestsField");
  const done = document.getElementById("rsvpDone");
  const doneTitle = document.getElementById("doneTitle");
  const doneMsg = document.getElementById("doneMsg");
  let attending = "yes";

  choice.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      choice.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      attending = b.dataset.v;
      guestsField.style.display = attending === "yes" ? "" : "none";
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("r-name").value.trim();
    if (!name) { toast("Cuéntanos tu nombre"); return; }

    // persist locally (prototype)
    const entry = {
      name,
      attending,
      guests: document.getElementById("r-guests").value,
      note: document.getElementById("r-note").value.trim(),
      at: new Date().toISOString()
    };
    try {
      const all = JSON.parse(localStorage.getItem("lya_rsvps") || "[]");
      all.push(entry);
      localStorage.setItem("lya_rsvps", JSON.stringify(all));
    } catch (err) {}

    // hide fields, show confirmation
    [...form.children].forEach((c) => { if (c !== done) c.style.display = "none"; });
    if (attending === "yes") {
      doneTitle.textContent = "¡Nos vemos pronto!";
      doneMsg.textContent = "Tu lugar quedó confirmado, " + name.split(" ")[0] + ". Te esperamos el 5 de agosto.";
    } else {
      doneTitle.textContent = "Te vamos a extrañar";
      doneMsg.textContent = "Gracias por avisarnos, " + name.split(" ")[0] + ". Estarás con nosotros en el corazón.";
    }
    done.classList.add("show");
  });
})();
