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


const newsContainer =
  document.getElementById(
    "newsContainer"
  );


const noticiasDemo = [

  {
    categoria:
      "LA RIOJA",

    titulo:
      "Información y actualidad de La Rioja",

    texto:
      "Las principales noticias de la provincia y sus localidades."
  },

  {
    categoria:
      "ARGENTINA",

    titulo:
      "Actualidad nacional",

    texto:
      "Las noticias más importantes de Argentina."
  },

  {
    categoria:
      "MUNDO",

    titulo:
      "Noticias internacionales",

    texto:
      "Toda la información internacional."
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
