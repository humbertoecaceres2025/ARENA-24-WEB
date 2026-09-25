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
   ARENA 24 PLAYER 4.0
===================================================== */

const arenaAudio =
  document.getElementById("radioAudio");

const arenaPlayer =
  document.querySelector(".arena-player-4");

const arenaPlay =
  document.getElementById("arenaPlay");

const arenaPlayIcon =
  document.getElementById("arenaPlayIcon");

const arenaVolume =
  document.getElementById("arenaVolume");

const arenaVolumeValue =
  document.getElementById("arenaVolumeValue");

const arenaReconnect =
  document.getElementById("arenaReconnect");

const arenaConnection =
  document.getElementById("arenaConnection");

const arenaLiveDot =
  document.getElementById("arenaLiveDot");

const arenaLiveText =
  document.getElementById("arenaLiveText");

const arenaPlayerMessage =
  document.getElementById("arenaPlayerMessage");

const arenaMiniClock =
  document.getElementById("arenaMiniClock");


let arenaStopped = true;

let arenaReconnectTimer = null;

let arenaReconnectAttempts = 0;


/* =====================================================
   RELOJ DEL PLAYER
===================================================== */

function updateArenaMiniClock() {

  if (!arenaMiniClock) return;

  arenaMiniClock.textContent =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone:
          "America/Argentina/La_Rioja",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hour12: false
      }
    ).format(new Date());

}

updateArenaMiniClock();

setInterval(
  updateArenaMiniClock,
  1000
);


/* =====================================================
   ESTADO
===================================================== */

function arenaStatus(
  text,
  live = false
) {

  if (arenaConnection) {

    arenaConnection.textContent =
      text;

  }

  if (arenaLiveText) {

    arenaLiveText.textContent =
      live
        ? "EN VIVO"
        : text;

  }

  if (arenaLiveDot) {

    arenaLiveDot.classList.toggle(
      "live",
      live
    );

  }

}


/* =====================================================
   BOTÓN
===================================================== */

function updateArenaButton() {

  if (!arenaAudio) return;

  const playing =
    !arenaAudio.paused &&
    !arenaAudio.ended;


  if (arenaPlayIcon) {

    arenaPlayIcon.textContent =
      playing
        ? "❚❚"
        : "▶";

  }


  if (arenaPlayer) {

    arenaPlayer.classList.toggle(
      "playing",
      playing
    );

  }

}


/* =====================================================
   CONEXIÓN NUEVA
===================================================== */

function connectArenaRadio() {

  if (!arenaAudio) return;


  arenaAudio.pause();

  arenaAudio.removeAttribute("src");

  arenaAudio.load();


  const separator =
    CONFIG.radioStream.includes("?")
      ? "&"
      : "?";


  arenaAudio.src =
    CONFIG.radioStream +
    separator +
    "arena24=" +
    Date.now();


  arenaAudio.preload =
    "none";

  arenaAudio.autoplay =
    false;

  arenaAudio.muted =
    false;


  arenaAudio.volume =
    arenaVolume
      ? Number(arenaVolume.value)
      : 1;

}


/* =====================================================
   PLAY
===================================================== */

async function playArenaRadio() {

  if (!arenaAudio) return;


  arenaStopped = false;


  clearTimeout(
    arenaReconnectTimer
  );


  arenaStatus(
    "CONECTANDO…",
    false
  );


  if (arenaPlayerMessage) {

    arenaPlayerMessage.textContent =
      "CONECTANDO CON ARENA 24…";

  }


  try {

    connectArenaRadio();


    arenaAudio.muted =
      false;


    await arenaAudio.play();


  } catch (error) {

    console.error(
      "ARENA 24 PLAYER 4.0:",
      error
    );


    arenaStatus(
      "NO SE PUDO CONECTAR",
      false
    );


    if (arenaPlayerMessage) {

      arenaPlayerMessage.textContent =
        "PRESIONÁ PLAY PARA INTENTAR NUEVAMENTE";

    }


    updateArenaButton();

  }

}


/* =====================================================
   PAUSA
===================================================== */

function pauseArenaRadio() {

  if (!arenaAudio) return;


  arenaStopped = true;


  clearTimeout(
    arenaReconnectTimer
  );


  arenaAudio.pause();


  arenaStatus(
    "PAUSADA",
    false
  );


  if (arenaPlayerMessage) {

    arenaPlayerMessage.textContent =
      "RADIO PAUSADA";

  }


  updateArenaButton();

}


/* =====================================================
   PLAY / PAUSA
===================================================== */

if (arenaPlay) {

  arenaPlay.addEventListener(
    "click",
    async () => {

      if (
        arenaAudio &&
        !arenaAudio.paused
      ) {

        pauseArenaRadio();

      } else {

        await playArenaRadio();

      }

    }
  );

}


/* =====================================================
   VOLUMEN
===================================================== */

if (arenaVolume) {

  arenaVolume.addEventListener(
    "input",
    () => {

      if (arenaAudio) {

        arenaAudio.volume =
          Number(arenaVolume.value);

        arenaAudio.muted =
          false;

      }


      if (arenaVolumeValue) {

        arenaVolumeValue.textContent =
          Math.round(
            Number(arenaVolume.value) * 100
          ) + "%";

      }

    }
  );

}


/* =====================================================
   RECONEXIÓN MANUAL
===================================================== */

if (arenaReconnect) {

  arenaReconnect.addEventListener(
    "click",
    async () => {

      arenaReconnectAttempts = 0;

      clearTimeout(
        arenaReconnectTimer
      );


      arenaStatus(
        "REINICIANDO…",
        false
      );


      await playArenaRadio();

    }
  );

}


/* =====================================================
   AUDIO REPRODUCIENDO
===================================================== */

if (arenaAudio) {

  arenaAudio.addEventListener(
    "playing",
    () => {

      arenaReconnectAttempts = 0;


      arenaStatus(
        "EN VIVO",
        true
      );


      if (arenaPlayerMessage) {

        arenaPlayerMessage.textContent =
          "ARENA 24 · SIEMPRE CON VOS";

      }


      updateArenaButton();


      console.log(
        "🔊 ARENA 24 PLAYER 4.0 · AUDIO OK"
      );

    }
  );


  /* ===================================================
     PAUSA
  =================================================== */

  arenaAudio.addEventListener(
    "pause",
    () => {

      updateArenaButton();

    }
  );


  /* ===================================================
     BUFFER
  =================================================== */

  arenaAudio.addEventListener(
    "waiting",
    () => {

      if (!arenaStopped) {

        arenaStatus(
          "CARGANDO…",
          false
        );

      }

    }
  );


  /* ===================================================
     ERROR
  =================================================== */

  arenaAudio.addEventListener(
    "error",
    () => {

      console.error(
        "ARENA 24 PLAYER 4.0 · ERROR",
        arenaAudio.error
      );


      updateArenaButton();


      if (arenaStopped) return;


      arenaStatus(
        "RECONECTANDO…",
        false
      );


      if (
        arenaPlayerMessage
      ) {

        arenaPlayerMessage.textContent =
          "RECONECTANDO CON LA RADIO…";

      }


      if (
        arenaReconnectAttempts >= 5
      ) {

        arenaStatus(
          "SIN SEÑAL",
          false
        );

        return;

      }


      arenaReconnectAttempts++;


      clearTimeout(
        arenaReconnectTimer
      );


      arenaReconnectTimer =
        setTimeout(
          () => {

            playArenaRadio();

          },
          3000
        );

    }

  );

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

if (arenaAudio) {

  arenaAudio.volume =
    arenaVolume
      ? Number(arenaVolume.value)
      : 1;

  arenaAudio.muted =
    false;

}


arenaStatus(
  "LISTO PARA ESCUCHAR",
  false
);


updateArenaButton();


console.log(
  "ARENA 24 PLAYER 4.0 instalado."
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
