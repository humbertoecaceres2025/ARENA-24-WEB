const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const floatingButton = document.getElementById("floatingPlay");
const status = document.getElementById("status");

/* =====================================================
REPRODUCTOR ARENA 24
===================================================== */

async function toggleRadio() {

if (!audio || !playButton) return;

try {

if (audio.paused) {

  status.textContent =
    "● CONECTANDO CON ARENA 24...";

  await audio.play();

  playButton.textContent =
    "⏸ PAUSAR RADIO";

  status.textContent =
    "● ARENA 24 · REPRODUCIENDO EN VIVO";

  if (floatingButton) {
    floatingButton.textContent =
      "⏸ PAUSAR ARENA 24";
  }

} else {

  audio.pause();

  playButton.textContent =
    "▶ ESCUCHAR EN VIVO";

  status.textContent =
    "● ARENA 24 · RADIO EN PAUSA";

  if (floatingButton) {
    floatingButton.textContent =
      "🔴 ESCUCHAR ARENA 24";
  }

}


} catch (error) {

console.error(
  "Error al iniciar la radio:",
  error
);

status.textContent =
  "● TOCÁ NUEVAMENTE PARA INICIAR EL STREAM";


}

}

/* =====================================================
BOTÓN PRINCIPAL
===================================================== */

if (playButton) {

playButton.addEventListener(
"click",
toggleRadio
);

}

/* =====================================================
BOTÓN FLOTANTE
===================================================== */

if (floatingButton) {

floatingButton.addEventListener(
"click",
toggleRadio
);

}

/* =====================================================
ESTADOS DEL STREAM
===================================================== */

if (audio) {

audio.addEventListener(
"playing",
() => {

  if (status) {

    status.textContent =
      "● ARENA 24 · TRANSMITIENDO EN VIVO";

  }

  if (playButton) {

    playButton.textContent =
      "⏸ PAUSAR RADIO";

  }

  if (floatingButton) {

    floatingButton.textContent =
      "⏸ PAUSAR ARENA 24";

  }

}


);

audio.addEventListener(
"pause",
() => {

  if (status) {

    status.textContent =
      "● ARENA 24 · RADIO EN PAUSA";

  }

  if (playButton) {

    playButton.textContent =
      "▶ ESCUCHAR EN VIVO";

  }

  if (floatingButton) {

    floatingButton.textContent =
      "🔴 ESCUCHAR ARENA 24";

  }

}


);

audio.addEventListener(
"error",
() => {

  if (status) {

    status.textContent =
      "● STREAM NO DISPONIBLE · INTENTÁ NUEVAMENTE";

  }

}


);

}

/* =====================================================
AÑO AUTOMÁTICO DEL FOOTER
===================================================== */

const footerCopy =
document.querySelector(".footer-copy");

if (footerCopy) {

footerCopy.textContent =
© ${new Date().getFullYear()} ARENA 24 · Todos los derechos reservados.;

}

/* =====================================================
SCROLL SUAVE PARA NAVEGACIÓN
===================================================== */

document.querySelectorAll(
'a[href^="#"]'
).forEach(link => {

link.addEventListener(
"click",
event => {

  const targetId =
    link.getAttribute("href");

  const target =
    document.querySelector(targetId);

  if (!target) return;

  event.preventDefault();

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


);

});
