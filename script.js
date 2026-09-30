"use strict";

/* =========================================================
   ARENA 24 7.0
   RADIO & TV
   La Rioja - Argentina
========================================================= */


/* =========================================================
   RELOJ ARGENTINA / LA RIOJA
========================================================= */

function updateClock() {

  const now = new Date();

  const options = {
    timeZone: "America/Argentina/La_Rioja",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };

  const time = new Intl.DateTimeFormat(
    "es-AR",
    options
  ).format(now);

  const heroClock =
    document.getElementById("heroClock");

  const radioClock =
    document.getElementById("radioClock");

  if (heroClock) {
    heroClock.textContent = time;
  }

  if (radioClock) {
    radioClock.textContent = time;
  }
}

updateClock();

setInterval(updateClock, 1000);


/* =========================================================
   NAVEGACIÓN SUAVE
========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {

    link.addEventListener("click", event => {

      const id =
        link.getAttribute("href");

      if (!id || id === "#") {
        return;
      }

      const target =
        document.querySelector(id);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


/* =========================================================
   ECUalizador
========================================================= */

const equalizer =
  document.querySelector(".equalizer");

if (equalizer) {

  const bars =
    equalizer.querySelectorAll("i");

  bars.forEach((bar, index) => {

    bar.style.animationDelay =
      `${index * 0.07}s`;

  });

}


/* =========================================================
   HERO ECUALIZADOR
========================================================= */

const heroBars =
  document.querySelectorAll(".hero-eq i");

heroBars.forEach((bar, index) => {

  bar.style.animationDelay =
    `${index * 0.08}s`;

});


/* =========================================================
   ZENO
========================================================= */

const zeno =
  document.querySelector(".zeno-window iframe");

if (zeno) {

  zeno.addEventListener("load", () => {

    console.log(
      "ARENA 24: reproductor Zeno cargado."
    );

  });

}


/* =========================================================
   ANIMACIONES AL HACER SCROLL
========================================================= */

const elements =
  document.querySelectorAll(
    ".program, .news-card, .featured-news, .info-card"
  );

if ("IntersectionObserver" in window) {

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  elements.forEach(element => {

    observer.observe(element);

  });

}


/* =========================================================
   MENSAJE DE CONSOLA
========================================================= */

console.log(
  "%c ARENA 24 RADIO & TV ",
  "background:#ff6900;color:white;font-size:17px;font-weight:900;padding:8px 12px;border-radius:5px;"
);

console.log(
  "%c La Rioja · Argentina · Siempre con vos ",
  "color:#00b9ff;font-size:12px;font-weight:bold;"
);
