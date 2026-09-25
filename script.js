/* =========================================================
   ARENA 24 4.1
   JAVASCRIPT
   RADIO ZENO + RELOJ + INTERFAZ
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

  zenoPlayer:
    "https://zeno.fm/player/arena-24-la-rioja-argentina-7bqb",

  timeZone:
    "America/Argentina/La_Rioja"

};


/* =========================================================
   ELEMENTOS
========================================================= */

const clock =
  document.getElementById("argentinaClock");

const equalizer =
  document.getElementById("equalizer");

const zenoPlayer =
  document.getElementById("zenoPlayer");

const radioMessage =
  document.getElementById("radioMessage");


/* =========================================================
   RELOJ ARGENTINA
========================================================= */

function updateClock() {

  if (!clock) {
    return;
  }


  const now =
    new Date();


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


updateClock();


setInterval(
  updateClock,
  1000
);


/* =========================================================
   CONTROL DEL IFRAME
========================================================= */

/*
   El audio es manejado por el reproductor oficial
   de Zeno dentro del iframe.

   No intentamos controlar el audio mediante
   JavaScript porque el iframe pertenece a otro dominio.
*/


function validateZenoPlayer() {

  if (!zenoPlayer) {
    return;
  }


  if (
    !zenoPlayer.src ||
    !zenoPlayer.src.includes("zeno.fm")
  ) {

    console.warn(
      "El reproductor Zeno no tiene una URL válida."
    );

    return;

  }


  radioMessage.textContent =
    "Reproductor conectado · Tocá PLAY para escuchar";

}


validateZenoPlayer();


/* =========================================================
   ANIMACIÓN DEL ECUALIZADOR
========================================================= */

function activateEqualizer() {

  if (!equalizer) {
    return;
  }


  equalizer.classList.add("active");

}


activateEqualizer();


/* =========================================================
   EFECTO AL PASAR SOBRE EL PLAYER
========================================================= */

if (zenoPlayer) {

  zenoPlayer.addEventListener(
    "load",
    function () {

      if (radioMessage) {

        radioMessage.textContent =
          "ARENA 24 está lista para transmitir";

      }

    }
  );

}


/* =========================================================
   SCROLL SUAVE
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(
    function(link) {

      link.addEventListener(
        "click",
        function(event) {

          const targetId =
            this.getAttribute("href");


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
            behavior: "smooth",
            block: "start"
          });

        }
      );

    }
  );


/* =========================================================
   ANIMACIÓN DE ENTRADA
========================================================= */

const observer =
  new IntersectionObserver(
    function(entries) {

      entries.forEach(
        function(entry) {

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
      threshold: 0.12
    }
  );


document
  .querySelectorAll(
    ".program-card, .news-card, .social-card"
  )
  .forEach(
    function(element) {

      observer.observe(element);

    }
  );


/* =========================================================
   MENSAJE DE INICIO
========================================================= */

console.log(
  "%c ARENA 24 4.1 ",
  "background:#ff6819;color:white;font-size:18px;font-weight:900;padding:8px;"
);

console.log(
  "Radio online · La Rioja · Argentina"
);
