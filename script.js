/* =========================================================
   ARENA 24 RADIO Y TV
   VERSIÓN 4.1
   LA RIOJA - ARGENTINA

   El reproductor visual es completamente propio.
   NO se utiliza iframe de Zeno Media.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* =====================================================
     CONFIGURACIÓN
  ====================================================== */

  const CONFIG = {

    radioStream:
      "https://stream.zeno.fm/zuw6xmmwmd0uv",

    youtubeChannel:
      "UCrHexRcAlWkaTn8P-BLT3LA",

    timeZone:
      "America/Argentina/La_Rioja"

  };


  /* =====================================================
     ELEMENTOS
  ====================================================== */

  const audio =
    document.getElementById("radioAudio");

  const playButton =
    document.getElementById("playRadio");

  const playIcon =
    document.getElementById("playIcon");

  const volumeControl =
    document.getElementById("volumeControl");

  const muteButton =
    document.getElementById("muteButton");

  const radioStatus =
    document.getElementById("radioStatus");

  const connectionText =
    document.getElementById("connectionText");

  const arenaPlayer =
    document.querySelector(".arena-player");

  const radioClock =
    document.getElementById("radioClock");


  /* =====================================================
     ESTADO
  ====================================================== */

  let isPlaying = false;

  let isMuted = false;

  let previousVolume = 0.85;


  /* =====================================================
     PREPARAR STREAM
  ====================================================== */

  if (audio) {

    audio.src =
      CONFIG.radioStream;

    audio.preload = "none";

    audio.volume = 0.85;

  }


  /* =====================================================
     FUNCIONES DE INTERFAZ
  ====================================================== */

  function setStatus(message) {

    if (radioStatus) {
      radioStatus.textContent =
        message;
    }

  }


  function setConnection(message) {

    if (connectionText) {
      connectionText.textContent =
        message;
    }

  }


  function showPlaying() {

    isPlaying = true;

    if (playIcon) {
      playIcon.textContent = "❚❚";
    }

    if (arenaPlayer) {
      arenaPlayer.classList.remove("paused");
    }

    setStatus(
      "🔴 ARENA 24 ESTÁ EN VIVO"
    );

    setConnection("ONLINE");

  }


  function showPaused() {

    isPlaying = false;

    if (playIcon) {
      playIcon.textContent = "▶";
    }

    if (arenaPlayer) {
      arenaPlayer.classList.add("paused");
    }

    setStatus(
      "TOCÁ ▶ PARA ESCUCHAR"
    );

  }


  function showError() {

    isPlaying = false;

    if (playIcon) {
      playIcon.textContent = "▶";
    }

    if (arenaPlayer) {
      arenaPlayer.classList.add("paused");
    }

    setStatus(
      "NO SE PUDO CONECTAR AL STREAM"
    );

    setConnection(
      "SIN CONEXIÓN"
    );

  }


  /* =====================================================
     INICIAR RADIO
  ====================================================== */

  async function startRadio() {

    if (!audio) {
      return;
    }


    setStatus(
      "CONECTANDO CON ARENA 24..."
    );

    setConnection(
      "CONECTANDO"
    );


    try {

      /*
        Si el stream fue detenido por el navegador,
        volvemos a establecer la fuente.
      */

      if (
        audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
      ) {

        audio.src =
          CONFIG.radioStream;

      }


      await audio.play();

      showPlaying();

    }

    catch (error) {

      console.warn(
        "Reproducción bloqueada o stream no disponible:",
        error
      );

      showError();

      setStatus(
        "TOCÁ ▶ NUEVAMENTE PARA INICIAR"
      );

    }

  }


  /* =====================================================
     DETENER RADIO
  ====================================================== */

  function stopRadio() {

    if (!audio) {
      return;
    }

    audio.pause();

    showPaused();

    setConnection(
      "ONLINE"
    );

  }


  /* =====================================================
     BOTÓN PLAY / PAUSA
  ====================================================== */

  if (playButton) {

    playButton.addEventListener(
      "click",
      async () => {

        if (isPlaying) {

          stopRadio();

        } else {

          await startRadio();

        }

      }
    );

  }


  /* =====================================================
     VOLUMEN
  ====================================================== */

  if (volumeControl) {

    volumeControl.addEventListener(
      "input",
      () => {

        if (!audio) {
          return;
        }

        const volume =
          Number(
            volumeControl.value
          );

        audio.volume =
          volume;

        if (volume > 0) {

          previousVolume =
            volume;

          isMuted =
            false;

          if (muteButton) {
            muteButton.textContent =
              "🔊";
          }

        }

      }
    );

  }


  /* =====================================================
     SILENCIO
  ====================================================== */

  if (muteButton) {

    muteButton.addEventListener(
      "click",
      () => {

        if (!audio) {
          return;
        }


        if (!isMuted) {

          previousVolume =
            audio.volume || 0.85;

          audio.volume = 0;

          if (volumeControl) {
            volumeControl.value = 0;
          }

          muteButton.textContent =
            "🔇";

          isMuted = true;

        }

        else {

          audio.volume =
            previousVolume;

          if (volumeControl) {
            volumeControl.value =
              previousVolume;
          }

          muteButton.textContent =
            "🔊";

          isMuted = false;

        }

      }
    );

  }


  /* =====================================================
     EVENTOS DEL AUDIO
  ====================================================== */

  if (audio) {


    audio.addEventListener(
      "playing",
      () => {

        showPlaying();

      }
    );


    audio.addEventListener(
      "waiting",
      () => {

        setStatus(
          "CONECTANDO..."
        );

        setConnection(
          "BUFFER"
        );

      }
    );


    audio.addEventListener(
      "canplay",
      () => {

        setConnection(
          "ONLINE"
        );

      }
    );


    audio.addEventListener(
      "pause",
      () => {

        if (!audio.ended) {
          showPaused();
        }

      }
    );


    audio.addEventListener(
      "error",
      () => {

        console.warn(
          "Error del stream de radio."
        );

        showError();

      }
    );

  }


  /* =====================================================
     RELOJ ARGENTINA
  ====================================================== */

  function updateClock() {

    if (!radioClock) {
      return;
    }


    try {

      const now =
        new Date();


      const time =
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
              "2-digit"
          }
        ).format(now);


      radioClock.textContent =
        time;

    }

    catch (error) {

      const now =
        new Date();

      radioClock.textContent =
        now.toLocaleTimeString(
          "es-AR"
        );

    }

  }


  updateClock();

  setInterval(
    updateClock,
    1000
  );


  /* =====================================================
     VISIBILIDAD DEL PLAYER
  ====================================================== */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const target =
            link.getAttribute("href");

          if (
            !target ||
            target === "#"
          ) {
            return;
          }


          const element =
            document.querySelector(
              target
            );


          if (element) {

            event.preventDefault();

            element.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    });


  /* =====================================================
     INFORMACIÓN DE INICIO
  ====================================================== */

  console.log(
    "ARENA 24 Radio y TV 4.1"
  );

  console.log(
    "Radio:",
    CONFIG.radioStream
  );

  console.log(
    "YouTube:",
    CONFIG.youtubeChannel
  );

});
