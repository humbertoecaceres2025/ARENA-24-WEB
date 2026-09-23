/* =====================================================
   ARENA 24
   JAVASCRIPT PRINCIPAL
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {


  /* ===================================================
     RADIO
     =================================================== */

  const radio = document.getElementById("radioPlayer");

  const playBtn = document.getElementById("playBtn");

  const playerStatus =
    document.getElementById("playerStatus");

  const playerTitle =
    document.getElementById("playerTitle");

  const volume =
    document.getElementById("volume");

  const volumeLabel =
    document.getElementById("volumeLabel");

  const radioCard =
    document.querySelector(".radio-player");


  if (radio) {

    radio.volume = 0.85;


    function updateVolume() {

      const value =
        Number(volume.value);

      radio.volume = value;

      volumeLabel.textContent =
        Math.round(value * 100) + "%";
    }


    volume.addEventListener(
      "input",
      updateVolume
    );


    async function playRadio() {

      try {

        playerStatus.textContent =
          "Conectando con ARENA 24...";

        playBtn.disabled = true;

        /*
          Reiniciamos el elemento para asegurarnos
          de utilizar correctamente el stream.
        */

        radio.load();

        await radio.play();

        playBtn.textContent = "Ⅱ";

        playerTitle.textContent =
          "ARENA 24 — EN VIVO";

        playerStatus.textContent =
          "Transmitiendo desde La Rioja";

        radioCard.classList.add("playing");

      }

      catch (error) {

        console.error(
          "Error al reproducir:",
          error
        );

        playerStatus.textContent =
          "Presioná PLAY nuevamente para conectar";

        playBtn.textContent = "▶";

        radioCard.classList.remove(
          "playing"
        );

      }

      finally {

        playBtn.disabled = false;

      }

    }


    function pauseRadio() {

      radio.pause();

      playBtn.textContent = "▶";

      playerStatus.textContent =
        "Radio pausada";

      radioCard.classList.remove(
        "playing"
      );

    }


    playBtn.addEventListener(
      "click",
      () => {

        if (radio.paused) {

          playRadio();

        } else {

          pauseRadio();

        }

      }
    );


    radio.addEventListener(
      "playing",
      () => {

        playBtn.textContent = "Ⅱ";

        playerTitle.textContent =
          "ARENA 24 — EN VIVO";

        playerStatus.textContent =
          "Transmitiendo desde La Rioja";

        radioCard.classList.add(
          "playing"
        );

      }
    );


    radio.addEventListener(
      "pause",
      () => {

        playBtn.textContent = "▶";

        radioCard.classList.remove(
          "playing"
        );

      }
    );


    radio.addEventListener(
      "waiting",
      () => {

        playerStatus.textContent =
          "Conectando...";

      }
    );


    radio.addEventListener(
      "error",
      () => {

        console.error(
          "No se pudo reproducir el stream."
        );

        playerStatus.textContent =
          "No se pudo conectar. Probá nuevamente.";

        playBtn.textContent = "▶";

        radioCard.classList.remove(
          "playing"
        );

      }
    );

  }


  /* ===================================================
     NOTICIAS
     =================================================== */

  const filters =
    document.querySelectorAll(".filter");

  const newsCards =
    document.querySelectorAll(".news-card");


  filters.forEach(filter => {

    filter.addEventListener(
      "click",
      () => {

        filters.forEach(button => {

          button.classList.remove(
            "active"
          );

        });


        filter.classList.add(
          "active"
        );


        const category =
          filter.dataset.category;


        newsCards.forEach(card => {

          if (
            category === "todos" ||
            card.dataset.category === category
          ) {

            card.style.display = "";

          } else {

            card.style.display = "none";

          }

        });

      }
    );

  });


  /* ===================================================
     PROGRAMACIÓN AUTOMÁTICA
     =================================================== */

  const currentProgram =
    document.getElementById(
      "currentProgram"
    );

  const currentDescription =
    document.getElementById(
      "currentDescription"
    );


  function updateProgram() {

    const now =
      new Date();

    const hour =
      now.getHours();


    let program =
      "ARENA 24 RADIO";

    let description =
      "Siempre con vos.";


    if (
      hour >= 6 &&
      hour < 12
    ) {

      program =
        "ENRIQUE — NOTICIAS";

      description =
        "Noticias y actualidad de La Rioja, Argentina y el mundo.";

    }

    else if (
      hour >= 12 &&
      hour < 16
    ) {

      program =
        "ARENA 24 SIESTA";

      description =
        "Música y compañía.";

    }

    else if (
      hour >= 16 &&
      hour < 20
    ) {

      program =
        "VIVIANA — ENTRETENIMIENTO";

      description =
        "Entretenimiento, música y actualidad.";

    }

    else if (
      hour >= 20 &&
      hour < 23
    ) {

      program =
        "NICOLÁS — DEPORTES";

      description =
        "Toda la actualidad deportiva.";

    }

    else {

      program =
        "MARTINA — RELAX";

      description =
        "Relax y música actual.";

    }


    if (currentProgram) {

      currentProgram.textContent =
        program;

    }


    if (currentDescription) {

      currentDescription.textContent =
        description;

    }

  }


  updateProgram();

  setInterval(
    updateProgram,
    60000
  );


  /* ===================================================
     AÑO DEL FOOTER
     =================================================== */

  const year =
    document.querySelector(
      ".footer-year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* ===================================================
     ANIMACIÓN SUAVE AL HACER SCROLL
     =================================================== */

  const sections =
    document.querySelectorAll(
      ".section"
    );


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

            }

          }
        );

      },
      {
        threshold: 0.08
      }
    );


  sections.forEach(
    section => observer.observe(section)
  );


});
