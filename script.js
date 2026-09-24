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

  /*
    STREAM DIRECTO DE ARENA 24
  */

  radioStream:
    "https://stream.zeno.fm/zuw6xmmwmd0uv",

  /*
    CANAL OFICIAL DE YOUTUBE
  */

  youtubeChannel:
    "UCrHexRcAlWkaTn8P-BLT3LA",

  youtubeLive:
    "https://www.youtube.com/embed/live_stream?channel=UCrHexRcAlWkaTn8P-BLT3LA"

};


/* =====================================================
   FUNCIÓN RÁPIDA
===================================================== */

const $ = id =>
  document.getElementById(id);


/* =====================================================
   MENÚ
===================================================== */

const menuButton =
  $("menuButton");

const mainNav =
  $("mainNav");


if (menuButton) {

  menuButton.addEventListener(
    "click",
    () => {

      mainNav.classList.toggle(
        "open"
      );

    }
  );

}


document
  .querySelectorAll("#mainNav a")
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "open"
          );

        }
      );

    }
  );


/* =====================================================
   RELOJ ARGENTINA
===================================================== */

const clock =
  $("argentinaClock");


function updateClock() {

  if (!clock) return;

  clock.textContent =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone:
          CONFIG.timeZone,

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",

        hour12:
          false
      }
    ).format(
      new Date()
    );

}


updateClock();


setInterval(
  updateClock,
  1000
);


/* =====================================================
   PROGRAMACIÓN
===================================================== */

const currentProgram =
  $("currentProgram");

const currentDescription =
  $("currentDescription");


const schedule = [

  {
    start: 6,
    end: 12,

    name:
      "ENRIQUE",

    description:
      "Noticias, actualidad e información de La Rioja, Argentina y el mundo."
  },

  {
    start: 12,
    end: 16,

    name:
      "ARENA 24 SIESTA",

    description:
      "Música para acompañarte durante la siesta."
  },

  {
    start: 16,
    end: 20,

    name:
      "VIANA",

    description:
      "Entretenimiento, música y compañía."
  },

  {
    start: 20,
    end: 23,

    name:
      "NIC",

    description:
      "Deportes, protagonistas, resultados y actualidad."
  },

  {
    start: 23,
    end: 24,

    name:
      "MAR",

    description:
      "Relax, música actual y compañía durante la noche."
  },

  {
    start: 0,
    end: 6,

    name:
      "MAR",

    description:
      "Relax, música actual y compañía durante la noche."
  }

];


function updateProgram() {

  if (!currentProgram)
    return;


  const hour =
    Number(

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
      ).format(
        new Date()
      )

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


updateProgram();


setInterval(
  updateProgram,
  60000
);


/* =====================================================
   FILTROS DE NOTICIAS
===================================================== */

document
  .querySelectorAll(".news-filter")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".news-filter"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          const filter =
            button.dataset.filter;


          document
            .querySelectorAll(
              ".news-card"
            )
            .forEach(
              card => {

                if (
                  filter === "todos" ||
                  card.dataset.category === filter
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
   RADIO ARENA 24
===================================================== */

const audio =
  $("radioAudio");

const player =
  document.querySelector(
    ".arena-player"
  );

const playButton =
  $("radioPlayButton");

const playIcon =
  $("radioPlayIcon");

const volume =
  $("radioVolume");

const volumeValue =
  $("radioVolumeValue");

const reloadButton =
  $("radioReloadButton");

const status =
  $("playerStatus");

const statusDot =
  $("playerStatusDot");

const connection =
  $("playerConnection");

const fixedPlay =
  $("fixedPlayButton");

const fixedStatus =
  $("fixedPlayerStatus");


let reconnectTimer =
  null;

let reconnectAttempts =
  0;

let userStopped =
  false;


/* =====================================================
   ESTADO DEL PLAYER
===================================================== */

function setRadioStatus(
  text,
  type = "ready"
) {

  if (status) {

    status.textContent =
      text;

  }


  if (connection) {

    connection.textContent =
      text;

  }


  if (fixedStatus) {

    fixedStatus.textContent =
      text
        .charAt(0)
        .toUpperCase()
      +
      text
        .slice(1)
        .toLowerCase();

  }


  if (statusDot) {

    statusDot.className =
      "status-dot " +
      type;

  }

}


/* =====================================================
   SINCRONIZAR BOTONES
===================================================== */

function syncButtons() {

  if (!audio)
    return;


  const playing =
    !audio.paused &&
    !audio.ended;


  if (playIcon) {

    playIcon.textContent =
      playing
        ? "❚❚"
        : "▶";

  }


  if (fixedPlay) {

    fixedPlay.textContent =
      playing
        ? "❚❚"
        : "▶";

  }


  if (player) {

    player.classList.toggle(
      "playing",
      playing
    );

  }

}


/* =====================================================
   PREPARAR AUDIO
===================================================== */

function prepareAudio() {

  if (!audio)
    return;


  if (
    audio.src !==
    CONFIG.radioStream
  ) {

    audio.src =
      CONFIG.radioStream;

  }


  audio.volume =
    volume
      ? Number(volume.value)
      : 1;

}


/* =====================================================
   REPRODUCIR RADIO
===================================================== */

async function playRadio() {

  if (!audio)
    return;


  userStopped =
    false;


  prepareAudio();


  setRadioStatus(
    "CONECTANDO…",
    "ready"
  );


  try {

    await audio.play();

    reconnectAttempts =
      0;

    setRadioStatus(
      "EN VIVO",
      "live"
    );

  }

  catch (error) {

    setRadioStatus(
      "NO SE PUDO CONECTAR",
      "error"
    );

    console.warn(
      "ARENA 24 Radio:",
      error
    );

  }


  syncButtons();

}


/* =====================================================
   PAUSAR
===================================================== */

function pauseRadio() {

  if (!audio)
    return;


  userStopped =
    true;


  audio.pause();


  setRadioStatus(
    "PAUSADA",
    "ready"
  );


  syncButtons();

}


/* =====================================================
   PLAY / PAUSE
===================================================== */

async function toggleRadio() {

  if (!audio)
    return;


  if (
    audio.paused
  ) {

    await playRadio();

  } else {

    pauseRadio();

  }

}


if (playButton) {

  playButton.addEventListener(
    "click",
    toggleRadio
  );

}


if (fixedPlay) {

  fixedPlay.addEventListener(
    "click",
    toggleRadio
  );

}


/* =====================================================
   VOLUMEN
===================================================== */

if (volume) {

  volume.addEventListener(
    "input",
    () => {

      if (audio) {

        audio.volume =
          Number(
            volume.value
          );

      }


      if (volumeValue) {

        volumeValue.textContent =
          Math.round(
            Number(
              volume.value
            ) * 100
          ) + "%";

      }

    }
  );

}


/* =====================================================
   RECONECTAR
===================================================== */

if (reloadButton) {

  reloadButton.addEventListener(
    "click",
    async () => {

      userStopped =
        false;


      audio.pause();

      audio.removeAttribute(
        "src"
      );

      audio.load();


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            150
          )
      );


      await playRadio();

    }
  );

}


/* =====================================================
   EVENTOS DEL AUDIO
===================================================== */

if (audio) {

  audio.addEventListener(
    "playing",
    () => {

      reconnectAttempts =
        0;

      setRadioStatus(
        "EN VIVO",
        "live"
      );

      syncButtons();

    }
  );


  audio.addEventListener(
    "pause",
    syncButtons
  );


  audio.addEventListener(
    "waiting",
    () => {

      setRadioStatus(
        "CONECTANDO…",
        "ready"
      );

    }
  );


  audio.addEventListener(
    "stalled",
    () => {

      setRadioStatus(
        "REINTENTANDO…",
        "ready"
      );

    }
  );


  audio.addEventListener(
    "error",
    () => {

      setRadioStatus(
        "ERROR DE CONEXIÓN",
        "error"
      );


      syncButtons();


      if (
        !userStopped &&
        reconnectAttempts < 3
      ) {

        clearTimeout(
          reconnectTimer
        );


        reconnectAttempts++;


        reconnectTimer =
          setTimeout(
            () => {

              audio.load();

              playRadio();

            },
            2500
          );

      }

    }
  );

}


prepareAudio();

syncButtons();


/* =====================================================
   TECLA ESPACIO
===================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.code === "Space" &&
      event.target.tagName !== "INPUT" &&
      event.target.tagName !== "TEXTAREA" &&
      event.target.tagName !== "BUTTON"
    ) {

      event.preventDefault();

      toggleRadio();

    }

  }
);


/* =====================================================
   ARENA 24 TV
===================================================== */

const tv =
  $("tv");

const tvBackground =
  $("tvBackground");

const youtube =
  $("youtubeLive");

const youtubeContainer =
  $("youtubeContainer");

const tvModeButton =
  $("tvModeButton");

const tvCinemaButton =
  $("tvCinemaButton");

const tvStatus =
  $("tvStatus");

const tvOverlay =
  $("tvOverlay");


/* =====================================================
   MODO CINEMATOGRÁFICO
===================================================== */

function setCinemaMode() {

  if (!tv)
    return;


  tv.classList.remove(
    "live"
  );


  youtubeContainer.classList.remove(
    "active"
  );


  youtube.src =
    "";


  tvOverlay.style.display =
    "grid";


  tvStatus.textContent =
    "🎬 MODO CINEMATOGRÁFICO";


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


/* =====================================================
   TV YOUTUBE
===================================================== */

function setLiveMode() {

  if (!tv)
    return;


  tv.classList.add(
    "live"
  );


  youtube.src =
    CONFIG.youtubeLive +
    "?autoplay=1&mute=1&rel=0";


  youtubeContainer.classList.add(
    "active"
  );


  tvOverlay.style.display =
    "none";


  tvStatus.textContent =
    "🔴 ARENA 24 TV · EN VIVO";


  tvModeButton.textContent =
    "🎬 VOLVER AL FONDO";

}


/* =====================================================
   BOTONES TV
===================================================== */

if (tvModeButton) {

  tvModeButton.addEventListener(
    "click",
    () => {

      if (
        tv.classList.contains(
          "live"
        )
      ) {

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
    setCinemaMode
  );

}


/* =====================================================
   VIDEO DE FONDO
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


  tvBackground.addEventListener(
    "error",
    () => {

      tvBackground.style.display =
        "none";

    }
  );

}


/* =====================================================
   RECUPERAR VIDEO AL VOLVER
===================================================== */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      !document.hidden &&
      tv &&
      !tv.classList.contains(
        "live"
      ) &&
      tvBackground
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
   ANIMACIÓN DE ENTRADA
===================================================== */

if (
  "IntersectionObserver"
  in window
) {

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
        threshold:
          0.1
      }
    );


  document
    .querySelectorAll(
      ".program-card,.news-card,.specials article"
    )
    .forEach(
      element =>
        observer.observe(
          element
        )
    );

}


/* =====================================================
   CONSOLA
===================================================== */

console.log(
  "ARENA 24 Radio Web profesional inicializada."
);

console.log(
  "Radio: reproductor ARENA 24 conectado al stream directo."
);

console.log(
  "TV: canal YouTube ARENA 24 integrado."
);
