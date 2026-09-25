/* =========================================================
   ARENA 24 — APP.JS 4.0
   Radio + Player + Reloj + TV + Interfaz
========================================================= */

"use strict";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

  stationName: "ARENA 24 RADIO",

  stream:
    "https://stream.zeno.fm/zuw6xmmwmd0uv",

  timeZone:
    "America/Argentina/La_Rioja",

  youtubeChannel:
    "UCrHexRcAlWkaTn8P-BLT3LA"

};


/* =========================================================
   ELEMENTOS
========================================================= */

const audio =
  document.getElementById("radioAudio");

const playButton =
  document.getElementById("playButton");

const playIcon =
  document.getElementById("playIcon");

const floatingPlayer =
  document.getElementById("floatingPlayer");

const volumeControl =
  document.getElementById("volumeControl");

const equalizer =
  document.getElementById("equalizer");

const connectionText =
  document.getElementById("connectionText");

const trackTitle =
  document.getElementById("trackTitle");

const argentinaTime =
  document.getElementById("argentinaTime");


/* =========================================================
   ESTADO
========================================================= */

let isPlaying = false;


/* =========================================================
   INICIALIZAR AUDIO
========================================================= */

function initializeAudio() {

  if (!audio) return;

  audio.src = CONFIG.stream;

  audio.volume = 0.8;

  audio.preload = "none";

}


/* =========================================================
   PLAY
========================================================= */

async function playRadio() {

  if (!audio) return;

  try {

    /*
      Recarga el stream cuando sea necesario.
      Esto ayuda a recuperar la conexión si el
      navegador perdió el stream.
    */

    if (
      audio.readyState === 0 ||
      audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
    ) {

      audio.src = CONFIG.stream;
      audio.load();

    }

    await audio.play();

    isPlaying = true;

    updatePlayerUI(true);

  }

  catch (error) {

    console.error(
      "No se pudo iniciar la radio:",
      error
    );

    isPlaying = false;

    updatePlayerUI(false);

    connectionText.textContent =
      "TOCÁ PLAY PARA CONECTAR";

  }

}


/* =========================================================
   PAUSA
========================================================= */

function pauseRadio() {

  if (!audio) return;

  audio.pause();

  isPlaying = false;

  updatePlayerUI(false);

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

function toggleRadio() {

  if (isPlaying) {

    pauseRadio();

  } else {

    playRadio();

  }

}


/* =========================================================
   ACTUALIZAR INTERFAZ
========================================================= */

function updatePlayerUI(playing) {

  if (!playIcon) return;

  if (playing) {

    playIcon.textContent = "❚❚";

    equalizer?.classList.add("active");

    connectionText.textContent =
      "TRANSMISIÓN EN VIVO";

    if (floatingPlayer) {
      floatingPlayer.textContent = "❚❚";
    }

    if (trackTitle) {

      trackTitle.textContent =
        "ARENA 24 · Estás escuchando la radio en vivo";

    }

  } else {

    playIcon.textContent = "▶";

    equalizer?.classList.remove("active");

    connectionText.textContent =
      "RADIO ONLINE";

    if (floatingPlayer) {
      floatingPlayer.textContent = "▶";
    }

    if (trackTitle) {

      trackTitle.textContent =
        "La radio que está siempre con vos";

    }

  }

}


/* =========================================================
   EVENTO PLAY PRINCIPAL
========================================================= */

if (playButton) {

  playButton.addEventListener(
    "click",
    toggleRadio
  );

}


/* =========================================================
   BOTÓN FLOTANTE
========================================================= */

if (floatingPlayer) {

  floatingPlayer.addEventListener(
    "click",
    toggleRadio
  );

}


/* =========================================================
   VOLUMEN
========================================================= */

if (volumeControl) {

  volumeControl.addEventListener(
    "input",
    function () {

      if (audio) {

        audio.volume =
          Number(this.value);

      }

    }
  );

}


/* =========================================================
   EVENTOS DEL AUDIO
========================================================= */

if (audio) {

  audio.addEventListener(
    "playing",
    function () {

      isPlaying = true;

      updatePlayerUI(true);

    }
  );


  audio.addEventListener(
    "pause",
    function () {

      isPlaying = false;

      updatePlayerUI(false);

    }
  );


  audio.addEventListener(
    "waiting",
    function () {

      connectionText.textContent =
        "CONECTANDO...";

    }
  );


  audio.addEventListener(
    "stalled",
    function () {

      connectionText.textContent =
        "RECONECTANDO...";

    }
  );


  audio.addEventListener(
    "error",
    function () {

      console.warn(
        "Error en el stream de ARENA 24"
      );

      connectionText.textContent =
        "REINTENTANDO CONEXIÓN";

    }
  );

}


/* =========================================================
   RELOJ ARGENTINA
========================================================= */

function updateArgentinaClock() {

  if (!argentinaTime) return;

  const now =
    new Date();

  const time =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone: CONFIG.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    ).format(now);

  argentinaTime.textContent =
    time;

}


/* =========================================================
   INICIAR RELOJ
========================================================= */

updateArgentinaClock();

setInterval(
  updateArgentinaClock,
  1000
);


/* =========================================================
   SCROLL SUAVE
========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(function (link) {

    link.addEventListener(
      "click",
      function (event) {

        const targetId =
          this.getAttribute("href");

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


/* =========================================================
   RECUPERACIÓN AUTOMÁTICA DEL STREAM
========================================================= */

let reconnectTimer = null;

function reconnectRadio() {

  if (!audio || !isPlaying) return;

  clearTimeout(reconnectTimer);

  reconnectTimer =
    setTimeout(
      async function () {

        try {

          audio.pause();

          audio.src =
            CONFIG.stream +
            "?v=" +
            Date.now();

          audio.load();

          await audio.play();

          updatePlayerUI(true);

        }

        catch (error) {

          console.warn(
            "Reintentando conexión..."
          );

          reconnectRadio();

        }

      },
      3000
    );

}


/* =========================================================
   DETECTAR PÉRDIDA DE CONEXIÓN
========================================================= */

if (audio) {

  audio.addEventListener(
    "error",
    function () {

      if (isPlaying) {

        reconnectRadio();

      }

    }
  );

}


/* =========================================================
   VISIBILIDAD DE LA PÁGINA
========================================================= */

document.addEventListener(
  "visibilitychange",
  function () {

    /*
      No detenemos la radio cuando el usuario
      cambia de pestaña.
    */

    if (
      document.visibilityState === "visible" &&
      isPlaying &&
      audio.paused
    ) {

      playRadio();

    }

  }
);


/* =========================================================
   INICIO
========================================================= */

initializeAudio();

updatePlayerUI(false);


/* =========================================================
   MENSAJE DE CONSOLA
========================================================= */

console.log(
  "%c ARENA 24 4.0 ",
  "background:#ff6b1a;color:white;font-size:18px;font-weight:bold;padding:8px;"
);

console.log(
  "Radio online · La Rioja · Argentina"
);
