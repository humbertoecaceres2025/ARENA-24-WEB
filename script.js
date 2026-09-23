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
