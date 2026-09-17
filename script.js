/* =====================================================
   ARENA 24 RADIO WEB
   JAVASCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const ARENA24 = {

  stream:
    "https://stream.zeno.fm/zuw6xmmwmd0uv",

  facebook:
    "https://www.facebook.com/arena24radiolarioja",

  instagram:
    "https://www.instagram.com/arena24radio/",

  youtube:
    "https://www.youtube.com/@ARENA24LARIOJA",

  whatsapp:
    "https://wa.me/543804844124",

  email:
    "arena24radio@gmail.com"

};


/* =====================================================
   PLAYER
===================================================== */

const radio =
  document.getElementById("radioPlayer");

const playButton =
  document.getElementById("playButton");

const volumeControl =
  document.getElementById("volumeControl");

const playerStatus =
  document.getElementById("playerStatus");


/* Volumen inicial */

radio.volume = 0.85;


/* PLAY / PAUSE */

playButton.addEventListener(
  "click",
  async function () {

    try {

      if (radio.paused) {

        playerStatus.textContent =
          "Conectando con ARENA 24...";

        await radio.play();

        playButton.textContent =
          "❚❚";

        playerStatus.textContent =
          "Transmitiendo en vivo";

      }

      else {

        radio.pause();

        playButton.textContent =
          "▶";

        playerStatus.textContent =
          "Radio pausada";

      }

    }

    catch (error) {

      console.error(
        "Error del reproductor:",
        error
      );

      playerStatus.textContent =
        "No se pudo conectar. Intentá nuevamente.";

    }

  }
);


/* VOLUMEN */

volumeControl.addEventListener(
  "input",
  function () {

    radio.volume =
      this.value;

  }
);


/* EVENTOS DEL STREAM */

radio.addEventListener(
  "playing",
  function () {

    playerStatus.textContent =
      "Transmitiendo en vivo";

    playButton.textContent =
      "❚❚";

  }
);


radio.addEventListener(
  "waiting",
  function () {

    playerStatus.textContent =
      "Conectando...";

  }
);


radio.addEventListener(
  "error",
  function () {

    playerStatus.textContent =
      "Stream temporalmente no disponible";

  }
);


/* =====================================================
   NOTICIAS
===================================================== */


/*
   IMPORTANTE:

   GitHub Pages no puede leer directamente
   todos los RSS externos debido a CORS.

   Por eso esta función está preparada
   para recibir un RSS mediante un proxy.

   Podemos conectarla después a un backend
   o Cloudflare Worker para automatización
   profesional.
*/


async function cargarNoticias() {

  try {

    const respuesta =
      await fetch(
        "noticias.json?cache=" + Date.now()
      );

    const noticias =
      await respuesta.json();

    newsContainer.innerHTML = "";

    noticias.forEach(
      function (noticia) {

        const article =
          document.createElement("article");

        article.className =
          "news-card";

        article.innerHTML = `

          <span class="news-tag">
            ${noticia.categoria}
          </span>

          <h3>
            ${noticia.titulo}
          </h3>

          <p>
            ${noticia.resumen}
          </p>

          <small>
            ${noticia.fuente}
          </small>

          <br>

          <a
            href="${noticia.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Leer noticia →
          </a>

        `;

        newsContainer.appendChild(
          article
        );

      }
    );

  }

  catch (error) {

    console.error(
      "Error cargando noticias:",
      error
    );

  }

}
  }

];


function cargarNoticias() {

  newsContainer.innerHTML = "";


  noticiasDemo.forEach(
    function (noticia) {

      const article =
        document.createElement(
          "article"
        );


      article.className =
        "news-card";


      article.innerHTML = `

        <span class="news-tag">
          ${noticia.categoria}
        </span>

        <h3>
          ${noticia.titulo}
        </h3>

        <p>
          ${noticia.texto}
        </p>

      `;


      newsContainer.appendChild(
        article
      );

    }
  );

}


cargarNoticias();


/* =====================================================
   ACTUALIZACIÓN AUTOMÁTICA
===================================================== */

setInterval(
  cargarNoticias,
  10 * 60 * 1000
);


/* =====================================================
   CONSOLA
===================================================== */

console.log(
  "ARENA 24 RADIO WEB cargada correctamente."
);

console.log(
  "Stream:",
  ARENA24.stream
);

/* =====================================================
   ARENA 24 TV — CONFIGURACIÓN
===================================================== */

/*
   CUANDO TENGAS EL ID DEL CANAL DE YOUTUBE,
   CAMBIA SOLAMENTE ESTA LÍNEA.

   Ejemplo:

   const arena24ChannelID =
   "UC123456789xxxxxxxxxxxx";
*/

const arena24ChannelID = "PEGAR_AQUI_EL_ID_DEL_CANAL";


/* =====================================================
   SISTEMA
===================================================== */

const arena24Frame =
  document.getElementById("arena24YouTube");

const arena24Loading =
  document.getElementById("arena24Loading");

const arena24Status =
  document.getElementById("arena24StatusText");


function arena24IniciarTV() {

  if (
    !arena24ChannelID ||
    arena24ChannelID === "PEGAR_AQUI_EL_ID_DEL_CANAL"
  ) {

    arena24Status.textContent =
      "ARENA 24 TV — esperando configuración del canal";

    arena24Loading.innerHTML = `
      <div class="arena24-spinner"></div>
      <span>
        ARENA 24 TV estará disponible cuando agregues
        el ID del canal de YouTube.
      </span>
    `;

    return;
  }


  /*
     YouTube permite utilizar el parámetro
     "channel" para cargar el contenido del canal.
  */

  const youtubeURL =
    "https://www.youtube.com/embed/live_stream" +
    "?channel=" +
    encodeURIComponent(arena24ChannelID) +
    "&autoplay=1" +
    "&mute=1" +
    "&rel=0";

  arena24Frame.src = youtubeURL;


  arena24Frame.addEventListener("load", function () {

    arena24Loading.style.display = "none";

    arena24Status.textContent =
      "ARENA 24 TV — transmisión de YouTube";

  });

}


/* Iniciar */

arena24IniciarTV();
