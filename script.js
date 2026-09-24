/* =====================================================
   ARENA 24
   APP.JS
   RADIO + TV + PROGRAMACIÓN + RELOJ
===================================================== */

"use strict";


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const CONFIG = {

  station:
    "ARENA 24 RADIO",

  timeZone:
    "America/Argentina/La_Rioja",

  youtubeLive:
    "https://www.youtube.com/embed/live_stream?channel=UCrHexRcAlWkaTn8P-BLT3LA"

};


/* =====================================================
   ELEMENTOS
===================================================== */

const menuButton =
  document.getElementById("menuButton");

const mainNav =
  document.getElementById("mainNav");

const clock =
  document.getElementById("argentinaClock");

const currentProgram =
  document.getElementById("currentProgram");

const currentDescription =
  document.getElementById("currentDescription");

const newsFilters =
  document.querySelectorAll(".news-filter");

const newsCards =
  document.querySelectorAll(".news-card");

const tv =
  document.querySelector(".cinema-tv");

const tvBackground =
  document.getElementById("tvBackground");

const tvModeButton =
  document.getElementById("tvModeButton");

const tvCinemaButton =
  document.getElementById("tvCinemaButton");

const tvStatus =
  document.getElementById("tvStatus");

const tvOverlay =
  document.getElementById("tvOverlay");

const youtubeLive =
  document.getElementById("youtubeLive");


/* =====================================================
   MENÚ MÓVIL
===================================================== */

if (menuButton) {

  menuButton.addEventListener("click", () => {

    mainNav.classList.toggle("open");

  });

}


document.querySelectorAll("#mainNav a")
  .forEach(link => {

    link.addEventListener("click", () => {

      mainNav.classList.remove("open");

    });

  });


/* =====================================================
   RELOJ ARGENTINA
===================================================== */

function updateClock() {

  if (!clock) return;

  const now = new Date();

  const time = new Intl.DateTimeFormat(
    "es-AR",
    {
      timeZone: CONFIG.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }
  ).format(now);

  clock.textContent = time;

}


updateClock();

setInterval(
  updateClock,
  1000
);


/* =====================================================
   PROGRAMACIÓN
===================================================== */

const schedule = [

  {
    start: 6,
    end: 12,
    name: "ENRIQUE",
    description:
      "Noticias, actualidad e información de La Rioja, Argentina y el mundo."
  },

  {
    start: 12,
    end: 16,
    name: "ARENA 24 SIESTA",
    description:
      "Música para acompañarte durante la siesta."
  },

  {
    start: 16,
    end: 20,
    name: "VIANA",
    description:
      "Entretenimiento, música y compañía."
  },

  {
    start: 20,
    end: 23,
    name: "NIC",
    description:
      "Deportes, protagonistas, resultados y actualidad."
  },

  {
    start: 23,
    end: 24,
    name: "MAR",
    description:
      "Relax, música actual y compañía durante la noche."
  },

  {
    start: 0,
    end: 6,
    name: "MAR",
    description:
      "Relax, música actual y compañía durante la noche."
  }

];


function updateCurrentProgram() {

  if (!currentProgram) return;

  const now =
    new Date();

  const argentinaTime =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone:
          CONFIG.timeZone,

        hour:
          "2-digit",

        hour12:
          false
      }
    ).format(now);

  const hour =
    parseInt(
      argentinaTime,
      10
    );


  const program =
    schedule.find(
      item =>
        hour >= item.start &&
        hour < item.end
    );


  if (program) {

    currentProgram.textContent =
      program.name;

    currentDescription.textContent =
      program.description;

  }

}


updateCurrentProgram();

setInterval(
  updateCurrentProgram,
  60000
);


/* =====================================================
   NOTICIAS
===================================================== */

newsFilters.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const filter =
          button.dataset.filter;


        newsFilters.forEach(
          item =>
            item.classList.remove("active")
        );

        button.classList.add("active");


        newsCards.forEach(
          card => {

            const category =
              card.dataset.category;


            if (
              filter === "todos" ||
              category === filter
            ) {

              card.style.display =
                "";

            } else {

              card.style.display =
                "none";

            }

          }
        );

      }
    );

  }
);


/* =====================================================
   TV
===================================================== */

let tvLive = false;


function setCinemaMode() {

  tvLive = false;

  tv.classList.remove("tv-live");

  youtubeLive.src = "";

  tvStatus.textContent =
    "🎬 MODO CINEMATOGRÁFICO";

  tvOverlay.style.display =
    "grid";

  tvModeButton.textContent =
    "📺 ACTIVAR TV EN VIVO";


  if (tvBackground) {

    tvBackground
      .play()
      .catch(
        () => {}
      );

  }

}


function setLiveMode() {

  tvLive = true;

  tv.classList.add("tv-live");

  youtubeLive.src =
    CONFIG.youtubeLive +
    "?autoplay=1&mute=0";

  tvStatus.textContent =
    "🔴 ARENA 24 TV · EN VIVO";

  tvOverlay.style.display =
    "none";

  tvModeButton.textContent =
    "🎬 VOLVER AL FONDO";

}


if (tvModeButton) {

  tvModeButton.addEventListener(
    "click",
    () => {

      if (tvLive) {

        setCinemaMode();

      } else {

        setLiveMode();

      }

    }
  );

}


if (tvCinemaButton) {

  tvCinemaButton.addEventListener(
    "click",
    () => {

      setCinemaMode();

    }
  );

}


/* =====================================================
   FONDO CINEMATOGRÁFICO
===================================================== */

if (tvBackground) {

  tvBackground.muted =
    true;

  tvBackground.loop =
    true;

  tvBackground.playsInline =
    true;

  tvBackground
    .play()
    .catch(
      () => {}
    );

}


/* =====================================================
   DETECTAR SI EL VIDEO DE FONDO EXISTE
===================================================== */

if (tvBackground) {

  tvBackground.addEventListener(
    "error",
    () => {

      tvBackground.style.display =
        "none";

    }
  );

}


/* =====================================================
   MODO AUTOMÁTICO TV
===================================================== */

/*
  La página no puede confirmar de manera fiable
  desde GitHub Pages si un canal de YouTube
  realmente está transmitiendo en ese instante.

  Por eso el sistema comienza en modo cinematográfico
  y permite activar la transmisión de YouTube.

  Esto evita mostrar una pantalla negra cuando
  la transmisión no está activa.
*/

function iniciarTV() {

  setCinemaMode();

}


iniciarTV();


/* =====================================================
   VISIBILIDAD DE PÁGINA
===================================================== */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      !document.hidden &&
      tvBackground &&
      !tvLive
    ) {

      tvBackground
        .play()
        .catch(
          () => {}
        );

    }

  }
);


/* =====================================================
   TECLA ESPACIO
===================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.code === "Space" &&
      event.target.tagName !== "INPUT" &&
      event.target.tagName !== "TEXTAREA"
    ) {

      event.preventDefault();

      /*
        El audio de ARENA 24 está dentro del
        reproductor oficial de Zeno, por lo que
        la barra espaciadora no intenta controlar
        directamente un elemento <audio>.
      */

      document
        .getElementById("radio")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }

  }
);


/* =====================================================
   ANIMACIÓN DE ENTRADA
===================================================== */

const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );

          }

        }
      );

    },
    {
      threshold: .12
    }
  );


document
  .querySelectorAll(
    ".program-card, .special-card, .news-card, .social-card, .contact-card"
  )
  .forEach(
    element =>
      observer.observe(element)
  );


/* =====================================================
   CONSOLA
===================================================== */

console.log(
  "ARENA 24 Radio Web inicializada."
);

console.log(
  "Reproductor: Zeno.FM oficial."
);

console.log(
  "TV: modo cinematográfico + YouTube Live."
);

<section class="arena-player" id="arenaPlayer">

  <div class="arena-player-glow"></div>

  <div class="arena-player-header">
    <div class="station-brand">
      <div class="station-logo">A24</div>

      <div>
        <h2>ARENA 24</h2>
        <span>RADIO Y TV · LA RIOJA</span>
      </div>
    </div>

    <div class="live-status">
      <span class="live-dot"></span>
      EN VIVO
    </div>
  </div>

  <div class="arena-player-main">

    <div class="radio-disc">
      <div class="disc-ring"></div>
      <div class="disc-center">
        <strong>A24</strong>
        <small>RADIO</small>
      </div>
    </div>

    <div class="radio-info">
      <span class="now-label">AHORA EN ARENA 24</span>
      <h3 id="radioTitle">ARENA 24 RADIO</h3>
      <p id="radioStatus">Listo para reproducir</p>
    </div>

  </div>

  <div class="equalizer" id="equalizer">
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i>
  </div>

  <div class="player-controls">

    <button class="control-button" id="muteButton" title="Silenciar">
      🔊
    </button>

    <button class="play-button" id="playButton" title="Reproducir">
      ▶
    </button>

    <button class="control-button" id="volumeButton" title="Volumen">
      🔉
    </button>

    <input
      type="range"
      id="volumeSlider"
      class="volume-slider"
      min="0"
      max="1"
      step="0.01"
      value="0.85"
    >

  </div>

  <div class="player-footer">

    <div class="connection">
      <span class="connection-dot"></span>
      <span id="connectionText">ESPERANDO CONEXIÓN</span>
    </div>

    <div class="argentina-clock" id="argentinaClock">
      00:00:00
    </div>

  </div>

  <audio id="arenaAudio" preload="none"></audio>

</section>

"styles.css"

:::writing{variant="standard" id="74106" title="Reproductor ARENA 24 — CSS"}

/* =========================================
   ARENA 24 RADIO PLAYER
   Diseño futurista profesional
========================================= */

.arena-player {
  --orange: #ff6a00;
  --orange-light: #ff9d3d;
  --dark: #07090d;
  --dark-2: #0d1118;
  --dark-3: #151b24;
  --text: #ffffff;
  --muted: #8993a4;

  position: relative;
  width: min(100%, 760px);
  margin: 30px auto;
  padding: 26px;

  background:
    radial-gradient(
      circle at 20% 0%,
      rgba(255,106,0,.18),
      transparent 35%
    ),
    linear-gradient(
      145deg,
      #10151d,
      #05070a
    );

  border: 1px solid rgba(255,106,0,.35);
  border-radius: 24px;

  box-shadow:
    0 25px 70px rgba(0,0,0,.55),
    inset 0 0 40px rgba(255,106,0,.035);

  color: var(--text);
  overflow: hidden;
  font-family:
    Inter,
    Arial,
    Helvetica,
    sans-serif;
}

/* brillo */

.arena-player-glow {
  position: absolute;
  width: 240px;
  height: 240px;
  top: -140px;
  right: -100px;

  background: var(--orange);
  filter: blur(100px);
  opacity: .18;
  pointer-events: none;
}

/* HEADER */

.arena-player-header {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 15px;
}

.station-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.station-logo {
  width: 58px;
  height: 58px;

  display: grid;
  place-items: center;

  border-radius: 16px;

  background:
    linear-gradient(
      135deg,
      var(--orange),
      #ff3600
    );

  color: white;

  font-size: 20px;
  font-weight: 900;

  box-shadow:
    0 0 25px rgba(255,106,0,.35);
}

.station-brand h2 {
  margin: 0;

  font-size: 25px;
  letter-spacing: 1px;
}

.station-brand span {
  display: block;
  margin-top: 3px;

  color: var(--muted);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.7px;
}

/* LIVE */

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 13px;

  border-radius: 30px;

  background: rgba(255,55,55,.08);
  border: 1px solid rgba(255,70,70,.25);

  color: #ff7272;

  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
}

.live-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #ff3838;

  box-shadow:
    0 0 10px #ff3838;

  animation: livePulse 1.4s infinite;
}

@keyframes livePulse {
  0%,100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: .35;
    transform: scale(.65);
  }
}

/* MAIN */

.arena-player-main {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 28px;

  margin-top: 30px;
}

/* DISCO */

.radio-disc {
  position: relative;

  width: 135px;
  height: 135px;

  flex: 0 0 135px;

  border-radius: 50%;

  background:
    repeating-radial-gradient(
      circle,
      #15191f 0px,
      #15191f 3px,
      #0a0d11 4px,
      #0a0d11 7px
    );

  border: 5px solid #202631;

  box-shadow:
    0 0 0 5px rgba(255,106,0,.08),
    0 0 35px rgba(255,106,0,.2);

  animation: rotateDisc 7s linear infinite;
  animation-play-state: paused;
}

.arena-player.playing .radio-disc {
  animation-play-state: running;
}

.disc-ring {
  position: absolute;
  inset: 12px;

  border-radius: 50%;

  border:
    2px solid rgba(255,106,0,.7);
}

.disc-center {
  position: absolute;
  inset: 38px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #ff7a00,
      #d83b00
    );

  box-shadow:
    0 0 20px rgba(255,106,0,.45);
}

.disc-center strong {
  font-size: 20px;
  font-weight: 1000;
}

.disc-center small {
  font-size: 7px;
  letter-spacing: 1px;
}

@keyframes rotateDisc {
  to {
    transform: rotate(360deg);
  }
}

/* INFO */

.radio-info {
  min-width: 0;
}

.now-label {
  color: var(--orange-light);

  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.radio-info h3 {
  margin: 8px 0 5px;

  font-size: clamp(21px, 4vw, 30px);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.radio-info p {
  margin: 0;

  color: var(--muted);

  font-size: 13px;
}

/* EQUALIZER */

.equalizer {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: end;
  justify-content: center;

  gap: 4px;

  height: 54px;

  margin: 25px 0 15px;
}

.equalizer i {
  display: block;

  width: 5px;
  height: 14px;

  border-radius: 10px;

  background:
    linear-gradient(
      to top,
      var(--orange),
      #ffd09b
    );

  box-shadow:
    0 0 8px rgba(255,106,0,.35);

  animation:
    equalizer 850ms ease-in-out infinite alternate;

  animation-play-state: paused;
}

.arena-player.playing .equalizer i {
  animation-play-state: running;
}

.equalizer i:nth-child(2) { animation-delay: -.2s; }
.equalizer i:nth-child(3) { animation-delay: -.4s; }
.equalizer i:nth-child(4) { animation-delay: -.1s; }
.equalizer i:nth-child(5) { animation-delay: -.6s; }
.equalizer i:nth-child(6) { animation-delay: -.3s; }
.equalizer i:nth-child(7) { animation-delay: -.7s; }
.equalizer i:nth-child(8) { animation-delay: -.4s; }
.equalizer i:nth-child(9) { animation-delay: -.8s; }
.equalizer i:nth-child(10) { animation-delay: -.2s; }

@keyframes equalizer {
  from {
    height: 8px;
  }

  to {
    height: 48px;
  }
}

/* CONTROLES */

.player-controls {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  padding: 15px 0;
}

.control-button,
.play-button {
  border: 0;
  cursor: pointer;

  display: grid;
  place-items: center;

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.control-button {
  width: 42px;
  height: 42px;

  border-radius: 50%;

  color: white;

  background: #171d26;

  border: 1px solid #29313e;
}

.control-button:hover {
  transform: scale(1.08);
  border-color: var(--orange);
}

.play-button {
  width: 64px;
  height: 64px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #ff8a00,
      #f23b00
    );

  color: white;

  font-size: 22px;

  box-shadow:
    0 0 25px rgba(255,106,0,.35);
}

.play-button:hover {
  transform: scale(1.08);

  box-shadow:
    0 0 35px rgba(255,106,0,.55);
}

/* VOLUMEN */

.volume-slider {
  width: 130px;

  accent-color: var(--orange);

  cursor: pointer;
}

/* FOOTER */

.player-footer {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-top: 14px;

  border-top: 1px solid rgba(255,255,255,.07);
}

.connection {
  display: flex;
  align-items: center;
  gap: 7px;

  color: var(--muted);

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connection-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #777;
}

.arena-player.playing .connection-dot {
  background: #26e07f;

  box-shadow:
    0 0 10px #26e07f;
}

.argentina-clock {
  color: var(--orange-light);

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

/* MOBILE */

@media (max-width: 600px) {

  .arena-player {
    padding: 20px;
    border-radius: 20px;
  }

  .arena-player-main {
    gap: 18px;
  }

  .radio-disc {
    width: 100px;
    height: 100px;
    flex-basis: 100px;
  }

  .disc-center {
    inset: 29px;
  }

  .station-brand h2 {
    font-size: 20px;
  }

  .station-brand span {
    font-size: 8px;
  }

  .live-status {
    padding: 7px 9px;
    font-size: 9px;
  }

  .volume-slider {
    width: 90px;
  }

}

@media (max-width: 430px) {

  .arena-player-main {
    flex-direction: column;
    text-align: center;
  }

  .radio-info h3 {
    max-width: 280px;
  }

  .player-footer {
    flex-direction: column;
    gap: 10px;
  }

}

"app.js"

:::writing{variant="standard" id="92614" title="Reproductor ARENA 24 — JavaScript"}

/* =========================================
   ARENA 24 RADIO PLAYER
   JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const player = document.getElementById("arenaPlayer");
  const audio = document.getElementById("arenaAudio");

  const playButton = document.getElementById("playButton");
  const muteButton = document.getElementById("muteButton");
  const volumeButton = document.getElementById("volumeButton");
  const volumeSlider = document.getElementById("volumeSlider");

  const status = document.getElementById("radioStatus");
  const connectionText = document.getElementById("connectionText");
  const clock = document.getElementById("argentinaClock");

  /*
    STREAM ARENA 24

    Reemplaza esta dirección solamente si
    Zeno te proporciona otra URL directa.
  */

  const STREAM_URL =
    "https://stream.zeno.fm/zuw6xmmwmd0uv";

  audio.src = STREAM_URL;
  audio.volume = 0.85;

  let playing = false;

  /* =====================================
     PLAY / PAUSE
  ===================================== */

  playButton.addEventListener("click", async () => {

    if (!playing) {

      try {

        status.textContent = "Conectando con ARENA 24...";
        connectionText.textContent = "CONECTANDO";

        await audio.play();

      } catch (error) {

        console.error(
          "No se pudo iniciar la radio:",
          error
        );

        status.textContent =
          "Pulsa nuevamente para iniciar la radio";

        connectionText.textContent =
          "SIN CONEXIÓN";

      }

    } else {

      audio.pause();

    }

  });

  /* =====================================
     AUDIO PLAY
  ===================================== */

  audio.addEventListener("play", () => {

    playing = true;

    player.classList.add("playing");

    playButton.textContent = "❚❚";

    status.textContent =
      "Transmitiendo en vivo";

    connectionText.textContent =
      "CONECTADO";

  });

  /* =====================================
     AUDIO PAUSE
  ===================================== */

  audio.addEventListener("pause", () => {

    playing = false;

    player.classList.remove("playing");

    playButton.textContent = "▶";

    status.textContent =
      "Radio pausada";

    connectionText.textContent =
      "EN ESPERA";

  });

  /* =====================================
     ERROR
  ===================================== */

  audio.addEventListener("error", () => {

    playing = false;

    player.classList.remove("playing");

    playButton.textContent = "▶";

    status.textContent =
      "No se pudo conectar con la señal";

    connectionText.textContent =
      "ERROR DE CONEXIÓN";

  });

  /* =====================================
     VOLUMEN
  ===================================== */

  volumeSlider.addEventListener("input", () => {

    audio.volume = volumeSlider.value;

    if (audio.volume === 0) {

      muteButton.textContent = "🔇";

    } else if (audio.volume < 0.5) {

      muteButton.textContent = "🔉";

    } else {

      muteButton.textContent = "🔊";

    }

  });

  /* =====================================
     MUTE
  ===================================== */

  muteButton.addEventListener("click", () => {

    audio.muted = !audio.muted;

    if (audio.muted) {

      muteButton.textContent = "🔇";

    } else {

      muteButton.textContent = "🔊";

    }

  });

  /* =====================================
     VOLUME BUTTON
  ===================================== */

  volumeButton.addEventListener("click", () => {

    if (audio.volume > 0) {

      audio.volume = 0;

      volumeSlider.value = 0;

      muteButton.textContent = "🔇";

    } else {

      audio.volume = 0.85;

      volumeSlider.value = 0.85;

      muteButton.textContent = "🔊";

    }

  });

  /* =====================================
     RELOJ ARGENTINA
  ===================================== */

  function updateArgentinaClock() {

    const now = new Date();

    const argentinaTime =
      new Intl.DateTimeFormat(
        "es-AR",
        {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
      ).format(now);

    clock.textContent =
      "ARGENTINA · " + argentinaTime;

  }

  updateArgentinaClock();

  setInterval(
    updateArgentinaClock,
    1000
  );

});

 "https://stream.zeno.fm/zuw6xmmwmd0uv". 

<section class="arena-player" id="arenaPlayer">

  <div class="arena-player-glow"></div>

  <div class="arena-player-header">
    <div class="station-brand">
      <div class="station-logo">A24</div>

      <div>
        <h2>ARENA 24</h2>
        <span>RADIO Y TV · LA RIOJA</span>
      </div>
    </div>

    <div class="live-status">
      <span class="live-dot"></span>
      EN VIVO
    </div>
  </div>

  <div class="arena-player-main">

    <div class="radio-disc">
      <div class="disc-ring"></div>
      <div class="disc-center">
        <strong>A24</strong>
        <small>RADIO</small>
      </div>
    </div>

    <div class="radio-info">
      <span class="now-label">AHORA EN ARENA 24</span>
      <h3 id="radioTitle">ARENA 24 RADIO</h3>
      <p id="radioStatus">Listo para reproducir</p>
    </div>

  </div>

  <div class="equalizer" id="equalizer">
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i><i></i><i></i><i></i>
    <i></i><i></i>
  </div>

  <div class="player-controls">

    <button class="control-button" id="muteButton" title="Silenciar">
      🔊
    </button>

    <button class="play-button" id="playButton" title="Reproducir">
      ▶
    </button>

    <button class="control-button" id="volumeButton" title="Volumen">
      🔉
    </button>

    <input
      type="range"
      id="volumeSlider"
      class="volume-slider"
      min="0"
      max="1"
      step="0.01"
      value="0.85"
    >

  </div>

  <div class="player-footer">

    <div class="connection">
      <span class="connection-dot"></span>
      <span id="connectionText">ESPERANDO CONEXIÓN</span>
    </div>

    <div class="argentina-clock" id="argentinaClock">
      00:00:00
    </div>

  </div>

  <audio id="arenaAudio" preload="none"></audio>

</section>

"styles.css"

:::writing{variant="standard" id="74106" title="Reproductor ARENA 24 — CSS"}

/* =========================================
   ARENA 24 RADIO PLAYER
   Diseño futurista profesional
========================================= */

.arena-player {
  --orange: #ff6a00;
  --orange-light: #ff9d3d;
  --dark: #07090d;
  --dark-2: #0d1118;
  --dark-3: #151b24;
  --text: #ffffff;
  --muted: #8993a4;

  position: relative;
  width: min(100%, 760px);
  margin: 30px auto;
  padding: 26px;

  background:
    radial-gradient(
      circle at 20% 0%,
      rgba(255,106,0,.18),
      transparent 35%
    ),
    linear-gradient(
      145deg,
      #10151d,
      #05070a
    );

  border: 1px solid rgba(255,106,0,.35);
  border-radius: 24px;

  box-shadow:
    0 25px 70px rgba(0,0,0,.55),
    inset 0 0 40px rgba(255,106,0,.035);

  color: var(--text);
  overflow: hidden;
  font-family:
    Inter,
    Arial,
    Helvetica,
    sans-serif;
}

/* brillo */

.arena-player-glow {
  position: absolute;
  width: 240px;
  height: 240px;
  top: -140px;
  right: -100px;

  background: var(--orange);
  filter: blur(100px);
  opacity: .18;
  pointer-events: none;
}

/* HEADER */

.arena-player-header {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 15px;
}

.station-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.station-logo {
  width: 58px;
  height: 58px;

  display: grid;
  place-items: center;

  border-radius: 16px;

  background:
    linear-gradient(
      135deg,
      var(--orange),
      #ff3600
    );

  color: white;

  font-size: 20px;
  font-weight: 900;

  box-shadow:
    0 0 25px rgba(255,106,0,.35);
}

.station-brand h2 {
  margin: 0;

  font-size: 25px;
  letter-spacing: 1px;
}

.station-brand span {
  display: block;
  margin-top: 3px;

  color: var(--muted);

  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.7px;
}

/* LIVE */

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 13px;

  border-radius: 30px;

  background: rgba(255,55,55,.08);
  border: 1px solid rgba(255,70,70,.25);

  color: #ff7272;

  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
}

.live-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #ff3838;

  box-shadow:
    0 0 10px #ff3838;

  animation: livePulse 1.4s infinite;
}

@keyframes livePulse {
  0%,100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: .35;
    transform: scale(.65);
  }
}

/* MAIN */

.arena-player-main {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  gap: 28px;

  margin-top: 30px;
}

/* DISCO */

.radio-disc {
  position: relative;

  width: 135px;
  height: 135px;

  flex: 0 0 135px;

  border-radius: 50%;

  background:
    repeating-radial-gradient(
      circle,
      #15191f 0px,
      #15191f 3px,
      #0a0d11 4px,
      #0a0d11 7px
    );

  border: 5px solid #202631;

  box-shadow:
    0 0 0 5px rgba(255,106,0,.08),
    0 0 35px rgba(255,106,0,.2);

  animation: rotateDisc 7s linear infinite;
  animation-play-state: paused;
}

.arena-player.playing .radio-disc {
  animation-play-state: running;
}

.disc-ring {
  position: absolute;
  inset: 12px;

  border-radius: 50%;

  border:
    2px solid rgba(255,106,0,.7);
}

.disc-center {
  position: absolute;
  inset: 38px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border-radius: 50%;

  background:
    linear-gradient(
      145deg,
      #ff7a00,
      #d83b00
    );

  box-shadow:
    0 0 20px rgba(255,106,0,.45);
}

.disc-center strong {
  font-size: 20px;
  font-weight: 1000;
}

.disc-center small {
  font-size: 7px;
  letter-spacing: 1px;
}

@keyframes rotateDisc {
  to {
    transform: rotate(360deg);
  }
}

/* INFO */

.radio-info {
  min-width: 0;
}

.now-label {
  color: var(--orange-light);

  font-size: 10px;
  font-weight: 900;
  letter-spacing: 2px;
}

.radio-info h3 {
  margin: 8px 0 5px;

  font-size: clamp(21px, 4vw, 30px);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.radio-info p {
  margin: 0;

  color: var(--muted);

  font-size: 13px;
}

/* EQUALIZER */

.equalizer {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: end;
  justify-content: center;

  gap: 4px;

  height: 54px;

  margin: 25px 0 15px;
}

.equalizer i {
  display: block;

  width: 5px;
  height: 14px;

  border-radius: 10px;

  background:
    linear-gradient(
      to top,
      var(--orange),
      #ffd09b
    );

  box-shadow:
    0 0 8px rgba(255,106,0,.35);

  animation:
    equalizer 850ms ease-in-out infinite alternate;

  animation-play-state: paused;
}

.arena-player.playing .equalizer i {
  animation-play-state: running;
}

.equalizer i:nth-child(2) { animation-delay: -.2s; }
.equalizer i:nth-child(3) { animation-delay: -.4s; }
.equalizer i:nth-child(4) { animation-delay: -.1s; }
.equalizer i:nth-child(5) { animation-delay: -.6s; }
.equalizer i:nth-child(6) { animation-delay: -.3s; }
.equalizer i:nth-child(7) { animation-delay: -.7s; }
.equalizer i:nth-child(8) { animation-delay: -.4s; }
.equalizer i:nth-child(9) { animation-delay: -.8s; }
.equalizer i:nth-child(10) { animation-delay: -.2s; }

@keyframes equalizer {
  from {
    height: 8px;
  }

  to {
    height: 48px;
  }
}

/* CONTROLES */

.player-controls {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  padding: 15px 0;
}

.control-button,
.play-button {
  border: 0;
  cursor: pointer;

  display: grid;
  place-items: center;

  transition:
    transform .2s ease,
    box-shadow .2s ease;
}

.control-button {
  width: 42px;
  height: 42px;

  border-radius: 50%;

  color: white;

  background: #171d26;

  border: 1px solid #29313e;
}

.control-button:hover {
  transform: scale(1.08);
  border-color: var(--orange);
}

.play-button {
  width: 64px;
  height: 64px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #ff8a00,
      #f23b00
    );

  color: white;

  font-size: 22px;

  box-shadow:
    0 0 25px rgba(255,106,0,.35);
}

.play-button:hover {
  transform: scale(1.08);

  box-shadow:
    0 0 35px rgba(255,106,0,.55);
}

/* VOLUMEN */

.volume-slider {
  width: 130px;

  accent-color: var(--orange);

  cursor: pointer;
}

/* FOOTER */

.player-footer {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-top: 14px;

  border-top: 1px solid rgba(255,255,255,.07);
}

.connection {
  display: flex;
  align-items: center;
  gap: 7px;

  color: var(--muted);

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.connection-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #777;
}

.arena-player.playing .connection-dot {
  background: #26e07f;

  box-shadow:
    0 0 10px #26e07f;
}

.argentina-clock {
  color: var(--orange-light);

  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

/* MOBILE */

@media (max-width: 600px) {

  .arena-player {
    padding: 20px;
    border-radius: 20px;
  }

  .arena-player-main {
    gap: 18px;
  }

  .radio-disc {
    width: 100px;
    height: 100px;
    flex-basis: 100px;
  }

  .disc-center {
    inset: 29px;
  }

  .station-brand h2 {
    font-size: 20px;
  }

  .station-brand span {
    font-size: 8px;
  }

  .live-status {
    padding: 7px 9px;
    font-size: 9px;
  }

  .volume-slider {
    width: 90px;
  }

}

@media (max-width: 430px) {

  .arena-player-main {
    flex-direction: column;
    text-align: center;
  }

  .radio-info h3 {
    max-width: 280px;
  }

  .player-footer {
    flex-direction: column;
    gap: 10px;
  }

}

"app.js"

:::writing{variant="standard" id="92614" title="Reproductor ARENA 24 — JavaScript"}

/* =========================================
   ARENA 24 RADIO PLAYER
   JavaScript
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const player = document.getElementById("arenaPlayer");
  const audio = document.getElementById("arenaAudio");

  const playButton = document.getElementById("playButton");
  const muteButton = document.getElementById("muteButton");
  const volumeButton = document.getElementById("volumeButton");
  const volumeSlider = document.getElementById("volumeSlider");

  const status = document.getElementById("radioStatus");
  const connectionText = document.getElementById("connectionText");
  const clock = document.getElementById("argentinaClock");

  /*
    STREAM ARENA 24

    Reemplaza esta dirección solamente si
    Zeno te proporciona otra URL directa.
  */

  const STREAM_URL =
    "https://stream.zeno.fm/zuw6xmmwmd0uv";

  audio.src = STREAM_URL;
  audio.volume = 0.85;

  let playing = false;

  /* =====================================
     PLAY / PAUSE
  ===================================== */

  playButton.addEventListener("click", async () => {

    if (!playing) {

      try {

        status.textContent = "Conectando con ARENA 24...";
        connectionText.textContent = "CONECTANDO";

        await audio.play();

      } catch (error) {

        console.error(
          "No se pudo iniciar la radio:",
          error
        );

        status.textContent =
          "Pulsa nuevamente para iniciar la radio";

        connectionText.textContent =
          "SIN CONEXIÓN";

      }

    } else {

      audio.pause();

    }

  });

  /* =====================================
     AUDIO PLAY
  ===================================== */

  audio.addEventListener("play", () => {

    playing = true;

    player.classList.add("playing");

    playButton.textContent = "❚❚";

    status.textContent =
      "Transmitiendo en vivo";

    connectionText.textContent =
      "CONECTADO";

  });

  /* =====================================
     AUDIO PAUSE
  ===================================== */

  audio.addEventListener("pause", () => {

    playing = false;

    player.classList.remove("playing");

    playButton.textContent = "▶";

    status.textContent =
      "Radio pausada";

    connectionText.textContent =
      "EN ESPERA";

  });

  /* =====================================
     ERROR
  ===================================== */

  audio.addEventListener("error", () => {

    playing = false;

    player.classList.remove("playing");

    playButton.textContent = "▶";

    status.textContent =
      "No se pudo conectar con la señal";

    connectionText.textContent =
      "ERROR DE CONEXIÓN";

  });

  /* =====================================
     VOLUMEN
  ===================================== */

  volumeSlider.addEventListener("input", () => {

    audio.volume = volumeSlider.value;

    if (audio.volume === 0) {

      muteButton.textContent = "🔇";

    } else if (audio.volume < 0.5) {

      muteButton.textContent = "🔉";

    } else {

      muteButton.textContent = "🔊";

    }

  });

  /* =====================================
     MUTE
  ===================================== */

  muteButton.addEventListener("click", () => {

    audio.muted = !audio.muted;

    if (audio.muted) {

      muteButton.textContent = "🔇";

    } else {

      muteButton.textContent = "🔊";

    }

  });

  /* =====================================
     VOLUME BUTTON
  ===================================== */

  volumeButton.addEventListener("click", () => {

    if (audio.volume > 0) {

      audio.volume = 0;

      volumeSlider.value = 0;

      muteButton.textContent = "🔇";

    } else {

      audio.volume = 0.85;

      volumeSlider.value = 0.85;

      muteButton.textContent = "🔊";

    }

  });

  /* =====================================
     RELOJ ARGENTINA
  ===================================== */

  function updateArgentinaClock() {

    const now = new Date();

    const argentinaTime =
      new Intl.DateTimeFormat(
        "es-AR",
        {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
      ).format(now);

    clock.textContent =
      "ARGENTINA · " + argentinaTime;

  }

  updateArgentinaClock();

  setInterval(
    updateArgentinaClock,
    1000
  );

});


