"use strict";

/* =========================================================
   ARENA 24 RADIO Y TV
   Versión 4.2
   ========================================================= */

const CONFIG = {
  radioStream: "https://stream.zeno.fm/zuw6xmmwmd0uv",
  youtubeChannel: "UCrHexRcAlWkaTn8P-BLT3LA",
  youtubeLive: "https://www.youtube.com/@ARENA24LARIOJA/live",
  timeZone: "America/Argentina/La_Rioja"
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const audio = document.getElementById("radioAudio");
const playButton = document.getElementById("playButton");
const muteButton = document.getElementById("muteButton");
const volumeControl = document.getElementById("volumeControl");

const radioCard = document.querySelector(".radio-card");
const radioStatus = document.getElementById("radioStatus");
const radioDot = document.getElementById("radioDot");

const connectionDot = document.getElementById("connectionDot");
const connectionText = document.getElementById("connectionText");

const radioMessage = document.getElementById("radioMessage");

const heroClock = document.getElementById("heroClock");
const heroDate = document.getElementById("heroDate");

const floatingRadio = document.getElementById("floatingRadio");


/* =========================================================
   CONFIGURACIÓN INICIAL
   ========================================================= */

audio.volume = 0.85;
volumeControl.value = "0.85";

let retryTimer = null;
let manualStop = false;


/* =========================================================
   CARGAR STREAM
   ========================================================= */

function loadRadioStream() {

  clearTimeout(retryTimer);

  try {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();

    audio.src = CONFIG.radioStream;
    audio.preload = "none";

  } catch (error) {
    console.error("Error cargando radio:", error);
  }
}


/* =========================================================
   REPRODUCIR
   ========================================================= */

async function playRadio() {

  manualStop = false;

  if (!audio.src) {
    loadRadioStream();
  }

  setConnecting();

  try {

    await audio.play();

    setPlaying();

  } catch (error) {

    console.error("No se pudo iniciar la radio:", error);

    setError(
      "El navegador no pudo iniciar el stream. Presioná nuevamente ▶."
    );
  }
}


/* =========================================================
   PAUSAR
   ========================================================= */

function pauseRadio() {

  manualStop = true;

  audio.pause();

  setStopped();
}


/* =========================================================
   BOTÓN PLAY
   ========================================================= */

playButton.addEventListener("click", () => {

  if (audio.paused) {
    playRadio();
  } else {
    pauseRadio();
  }

});


/* =========================================================
   EVENTOS AUDIO
   ========================================================= */

audio.addEventListener("loadstart", () => {
  if (!manualStop) setConnecting();
});

audio.addEventListener("waiting", () => {
  if (!manualStop) setConnecting();
});

audio.addEventListener("playing", () => {
  setPlaying();
});

audio.addEventListener("canplay", () => {
  if (!audio.paused) {
    setPlaying();
  }
});

audio.addEventListener("pause", () => {

  if (!manualStop && !audio.ended) {
    setConnecting();
    return;
  }

  if (manualStop) {
    setStopped();
  }

});

audio.addEventListener("error", () => {

  if (manualStop) return;

  console.error("Error del stream:", audio.error);

  setError("Reconectando con ARENA 24...");

  clearTimeout(retryTimer);

  retryTimer = setTimeout(() => {

    if (!manualStop) {

      loadRadioStream();

      playRadio();

    }

  }, 5000);

});


/* =========================================================
   ESTADOS
   ========================================================= */

function setPlaying() {

  radioStatus.textContent = "ARENA 24 · EN VIVO";
  radioDot.style.background = "#00e676";
  radioDot.style.boxShadow = "0 0 12px #00e676";

  connectionDot.classList.add("connected");
  connectionText.textContent = "CONECTADO";

  playButton.textContent = "❚❚";

  radioCard.classList.add("playing");

  radioMessage.textContent =
    "Estás escuchando ARENA 24 Radio · La Rioja Argentina.";

}


function setConnecting() {

  radioStatus.textContent = "CONECTANDO...";
  radioDot.style.background = "#ff9d00";
  radioDot.style.boxShadow = "0 0 12px #ff9d00";

  connectionDot.classList.remove("connected");
  connectionText.textContent = "CONECTANDO";

  playButton.textContent = "▶";

  radioCard.classList.remove("playing");

  radioMessage.textContent =
    "Conectando con ARENA 24 Radio...";

}


function setStopped() {

  radioStatus.textContent = "RADIO DETENIDA";

  radioDot.style.background = "#ff3158";
  radioDot.style.boxShadow = "none";

  connectionDot.classList.remove("connected");
  connectionText.textContent = "DESCONECTADO";

  playButton.textContent = "▶";

  radioCard.classList.remove("playing");

  radioMessage.textContent =
    "Presioná ▶ para volver a escuchar ARENA 24.";

}


function setError(message) {

  radioStatus.textContent = "SIN CONEXIÓN";

  radioDot.style.background = "#ff3158";
  radioDot.style.boxShadow = "0 0 12px #ff3158";

  connectionDot.classList.remove("connected");
  connectionText.textContent = "SIN CONEXIÓN";

  playButton.textContent = "▶";

  radioCard.classList.remove("playing");

  radioMessage.textContent = message;
}


/* =========================================================
   VOLUMEN
   ========================================================= */

volumeControl.addEventListener("input", () => {

  const value = Number(volumeControl.value);

  audio.volume = value;

  if (value === 0) {
    audio.muted = true;
    muteButton.textContent = "🔇";
  } else {
    audio.muted = false;
    muteButton.textContent = "🔊";
  }

});


/* =========================================================
   SILENCIO
   ========================================================= */

muteButton.addEventListener("click", () => {

  audio.muted = !audio.muted;

  muteButton.textContent = audio.muted ? "🔇" : "🔊";

});


/* =========================================================
   RELOJ ARGENTINA / LA RIOJA
   ========================================================= */

function updateClock() {

  const now = new Date();

  const time = new Intl.DateTimeFormat("es-AR", {
    timeZone: CONFIG.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  const date = new Intl.DateTimeFormat("es-AR", {
    timeZone: CONFIG.timeZone,
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(now);

  heroClock.textContent = time;
  heroDate.textContent =
    date.charAt(0).toUpperCase() + date.slice(1);

}

updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   RADIO FLOTANTE
   ========================================================= */

floatingRadio.addEventListener("click", () => {

  if (audio.paused) {
    playRadio();
  } else {
    pauseRadio();
  }

});


/* =========================================================
   DETECTAR CAMBIOS DE VISIBILIDAD
   ========================================================= */

document.addEventListener("visibilitychange", () => {

  /*
   No intentamos reproducir automáticamente cuando
   el usuario vuelve a la página, porque los navegadores
   pueden bloquear reproducción automática.
  */

  if (!document.hidden && !audio.paused) {
    setPlaying();
  }

});


/* =========================================================
   PREPARAR RADIO
   ========================================================= */

loadRadioStream();


/* =========================================================
   LINKS DE YOUTUBE
   ========================================================= */

const youtubePlayer = document.getElementById("youtubePlayer");

if (youtubePlayer) {

  /*
   La inserción depende de la configuración del video
   en YouTube Studio.

   Si el propietario desactiva "Permitir inserción",
   YouTube mostrará el bloqueo dentro del iframe.
  */

  youtubePlayer.addEventListener("load", () => {

    console.log(
      "ARENA 24 TV: iframe de YouTube cargado."
    );

  });

}


/* =========================================================
   PROTECCIÓN CONTRA ERRORES DE SCRIPT
   ========================================================= */

window.addEventListener("error", (event) => {

  console.error(
    "ARENA 24 - Error:",
    event.message
  );

});


console.log("ARENA 24 Radio y TV 4.2 iniciada.");
