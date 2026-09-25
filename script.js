/* =========================================================
   ARENA 24 RADIO Y TV
   APP.JS 4.0
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

  station:
    "ARENA 24 RADIO",

  timeZone:
    "America/Argentina/La_Rioja",

  zenoPlayer:
    "https://zeno.fm/player/arena-24-la-rioja-argentina-7bqb",

  youtubeChannel:
    "UCrHexRcAlWkaTn8P-BLT3LA"

};


/* =========================================================
   ELEMENTOS
========================================================= */

const clock =
  document.getElementById(
    "argentinaClock"
  );


const zenoPlayer =
  document.getElementById(
    "zenoPlayer"
  );


/* =========================================================
   RELOJ ARGENTINA
========================================================= */

function updateArgentinaClock() {

  if (!clock) {
    return;
  }

  const now =
    new Date();

  try {

    const formatter =
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
      );

    clock.textContent =
      formatter.format(now);

  }

  catch (error) {

    clock.textContent =
      now.toLocaleTimeString(
        "es-AR",
        {
          hour12: false
        }
      );

  }

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
   VERIFICAR PLAYER ZENO
========================================================= */

function verifyZenoPlayer() {

  if (!zenoPlayer) {
    return;
  }

  const source =
    zenoPlayer.getAttribute(
      "src"
    ) || "";

  if (
    !source.includes(
      "zeno.fm"
    )
  ) {

    console.warn(
      "ARENA 24: verificar URL del reproductor."
    );

    return;

  }

  console.log(
    "ARENA 24: reproductor Zeno cargado."
  );

}


verifyZenoPlayer();


/* =========================================================
   EVENTO PLAYER
========================================================= */

if (zenoPlayer) {

  zenoPlayer.addEventListener(
    "load",
    () => {

      console.log(
        "ARENA 24: iframe de radio listo."
      );

    }
  );

}


/* =========================================================
   ANIMACIÓN DEL PLAYER
========================================================= */

const radioPlayer =
  document.querySelector(
    ".radio-player"
  );


if (radioPlayer) {

  radioPlayer.addEventListener(
    "mouseenter",
    () => {

      radioPlayer.classList.add(
        "player-active"
      );

    }
  );


  radioPlayer.addEventListener(
    "mouseleave",
    () => {

      radioPlayer.classList.remove(
        "player-active"
      );

    }
  );

}


/* =========================================================
   NAVEGACIÓN SUAVE
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        function(event) {

          const targetId =
            this.getAttribute(
              "href"
            );

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              targetId
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start"
          });

        }
      );

    }
  );


/* =========================================================
   REVEAL AL HACER SCROLL
========================================================= */

const revealItems =
  document.querySelectorAll(
    ".program-card, .news-card, .social-card, .special-card, .tv-info-card"
  );


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

              observer.unobserve(
                entry.target
              );

            }

          }
        );

      },
      {
        threshold:
          0.12
      }
    );


  revealItems.forEach(
    item => {

      item.classList.add(
        "reveal"
      );

      observer.observe(
        item
      );

    }
  );

}


/* =========================================================
   ESTILOS DINÁMICOS DEL REVEAL
========================================================= */

const revealStyle =
  document.createElement(
    "style"
  );


revealStyle.textContent = `

  .reveal {
    opacity: 0;
    transform: translateY(22px);
    transition:
      opacity .7s ease,
      transform .7s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

`;


document.head.appendChild(
  revealStyle
);


/* =========================================================
   DETECCIÓN DE VISIBILIDAD
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState ===
      "visible"
    ) {

      updateArgentinaClock();

    }

  }
);


/* =========================================================
   CONSOLA ARENA 24
========================================================= */

console.log(
  "%c ARENA 24 RADIO Y TV ",
  `
    background:#ff5b00;
    color:white;
    font-size:18px;
    font-weight:bold;
    padding:8px 15px;
    border-radius:8px;
  `
);

console.log(
  "Siempre con vos — La Rioja, Argentina"
);
