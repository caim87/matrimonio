/* ============================================================
   Cubo-monograma 3D — arrastra para girar, gira solo en reposo
   ============================================================ */
(function cube() {
  const stage = document.getElementById("cubeStage");
  const cube = document.getElementById("cube");
  if (!stage || !cube) return;

  let rx = -20, ry = 28;   // ángulos actuales
  let vx = 0, vy = 0;      // inercia
  let dragging = false, lastX = 0, lastY = 0, auto = true, idleTimer;

  function apply() {
    cube.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
  }
  apply();

  function frame() {
    if (!dragging) {
      if (auto) { ry += 0.32; rx += 0.04; }
      ry += vy; rx += vx;
      vy *= 0.93; vx *= 0.93;
    }
    apply();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function down(x, y) {
    dragging = true; auto = false;
    lastX = x; lastY = y;
    cube.classList.add("drag");
    clearTimeout(idleTimer);
  }
  function move(x, y) {
    if (!dragging) return;
    const dx = x - lastX, dy = y - lastY;
    ry += dx * 0.42; rx -= dy * 0.42;
    vy = dx * 0.045; vx = -dy * 0.045;
    lastX = x; lastY = y;
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    cube.classList.remove("drag");
    idleTimer = setTimeout(() => { auto = true; }, 2800);
  }

  stage.addEventListener("mousedown", (e) => { e.preventDefault(); down(e.clientX, e.clientY); });
  window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
  window.addEventListener("mouseup", up);

  stage.addEventListener("touchstart", (e) => { const t = e.touches[0]; down(t.clientX, t.clientY); }, { passive: true });
  window.addEventListener("touchmove", (e) => { if (!dragging) return; const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
  window.addEventListener("touchend", up);
})();
