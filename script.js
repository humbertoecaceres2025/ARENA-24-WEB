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


