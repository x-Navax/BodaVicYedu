'use strict';
(() => {
  const cfg = window.WEDDING_CONFIG;
  const $ = (id) => document.getElementById(id);
  if (cfg.coverPhoto) { $('cover-photo').src = cfg.coverPhoto; $('cover-photo').alt = 'Victoria y Eduardo'; }
  const target = new Date(cfg.ceremonyDate).getTime();
  function tick() {
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const values = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    ['days', 'hours', 'minutes', 'seconds'].forEach((id, i) => $(id).textContent = String(values[i]).padStart(2, '0'));
    if (!s) $('clock-caption').textContent = '¡Llegó nuestro gran día!';
  }
  tick(); setInterval(tick, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

  document.querySelectorAll('[data-gallery]').forEach((root) => {
    const items = cfg.galleries[root.dataset.gallery] || [];
    const track = root.querySelector('.carousel-track');
    const dots = root.querySelector('.carousel-dots');
    const position = root.querySelector('.carousel-position');
    let index = 0, swipeStart = null;
    function placeholder(slide, i) {
      slide.classList.add('photo-pending');
      const star = document.createElement('span'); star.className = 'pending-star'; star.textContent = '✧'; star.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span'); text.className = 'pending-text'; text.textContent = 'Una foto de nuestra historia';
      const note = document.createElement('small'); note.textContent = 'FOTO PENDIENTE · ' + String(i + 1).padStart(2, '0');
      slide.replaceChildren(star, text, note);
    }
    if (!items.length) { root.hidden = true; return; }
    items.forEach((item, i) => {
      const slide = document.createElement('div'); slide.className = 'carousel-slide'; slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'diapositiva'); slide.setAttribute('aria-label', `${i + 1} de ${items.length}`);
      if (item.src) {
        const img = document.createElement('img'); img.src = item.src; img.alt = item.alt || 'Victoria y Eduardo'; img.loading = 'lazy'; img.style.objectPosition = item.position || 'center';
        img.addEventListener('error', () => placeholder(slide, i), { once: true }); slide.append(img);
      } else placeholder(slide, i);
      track.append(slide);
      const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-label', `Ver foto ${i + 1}`); dot.addEventListener('click', () => show(i)); dots.append(dot);
    });
    function show(next) {
      index = (next + items.length) % items.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      Array.from(track.children).forEach((slide, i) => { slide.setAttribute('aria-hidden', String(i !== index)); });
      Array.from(dots.children).forEach((dot, i) => dot.setAttribute('aria-current', i === index ? 'true' : 'false'));
      position.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    }
    root.querySelectorAll('[data-step]').forEach((button) => { button.disabled = items.length < 2; button.addEventListener('click', () => show(index + Number(button.dataset.step))); });
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1)); } });
    track.addEventListener('pointerdown', (e) => swipeStart = {x: e.clientX, y: e.clientY});
    track.addEventListener('pointerup', (e) => { if (!swipeStart) return; const dx = e.clientX - swipeStart.x, dy = e.clientY - swipeStart.y; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1)); swipeStart = null; });
    track.addEventListener('pointercancel', () => swipeStart = null);
    track.querySelectorAll('img').forEach(img => img.draggable = false);
    show(0);
  });

  let toastTimer;
  function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 2800); }
  async function copy(text) {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; } } catch (_) {}
    const area = document.createElement('textarea'); area.value = text; area.style.position = 'fixed'; area.style.opacity = '0'; document.body.append(area); area.select(); area.setSelectionRange(0, text.length);
    let ok = false; try { ok = document.execCommand('copy'); } catch (_) {} area.remove(); return ok;
  }
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => toast(await copy(button.dataset.copy) ? 'Copiado al portapapeles' : 'Seleccioná el dato para copiarlo.')));
  const form = $('rsvp-form');
  const phone = String(cfg.whatsappNumber || '').replace(/\D/g, '');
  const ready = /^[1-9]\d{7,14}$/.test(phone);
  if (!ready) { $('send-rsvp').textContent = 'Preparar mi respuesta'; $('form-help').textContent = 'La confirmación por WhatsApp estará disponible próximamente. Mientras tanto, podés preparar y copiar tu respuesta.'; }
  form.querySelectorAll('[name="attendance"]').forEach(radio => radio.addEventListener('change', () => {
    const yes = form.elements.attendance.value === 'yes'; $('food-field').hidden = !yes; $('food').disabled = !yes; $('form-status').textContent = ''; $('prepared-response').hidden = true;
  }));
  $('guest-name').addEventListener('input', () => $('guest-name').setCustomValidity(''));
  form.addEventListener('submit', (event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const name = $('guest-name').value.trim();
    if (!name) { $('guest-name').setCustomValidity('Escribí tu nombre y apellido.'); $('guest-name').reportValidity(); return; }
    const yes = form.elements.attendance.value === 'yes';
    const lines = ['¡Hola, Victoria y Eduardo!', 'Respondo a la invitación de su boda del 27/02/2027.', '', `Nombre y apellido: ${name}`, `Asistencia: ${yes ? 'Sí, voy a estar' : 'No podré asistir'}`];
    if (yes) lines.push(`Alergias, preferencias o intolerancias: ${$('food').value.trim() || 'Ninguna informada'}`);
    lines.push('', '¡Gracias por invitarnos!');
    const message = lines.join('\n'); $('response-text').value = message; $('prepared-response').hidden = false;
    if (!ready) { $('form-status').textContent = 'Tu respuesta está preparada. Todavía falta habilitar el WhatsApp de los novios.'; return; }
    $('form-status').textContent = 'Enviá el mensaje desde WhatsApp para completar tu confirmación.';
    window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
  });
  $('copy-response').addEventListener('click', async () => toast(await copy($('response-text').value) ? 'Respuesta copiada' : 'Seleccioná tu respuesta para copiarla.'));
})();
