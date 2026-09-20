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
   ARENA 24 RADIO
   NOTICIAS - CARGA MANUAL
   ===================================================== */

const newsGrid = document.getElementById("newsGrid");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const noResults = document.getElementById("noResults");
const breakingText = document.getElementById("breakingText");

let currentCategory = "all";


/* =====================================================
   CARGA MANUAL DE NOTICIAS
   =====================================================

   PARA AGREGAR UNA NOTICIA:

   1. Copiá uno de los bloques.
   2. Cambiá título, resumen, fecha y enlace.
   3. Elegí la categoría:
      rioja
      argentina
      mundo
      deportes

   ===================================================== */

const newsData = [

    /* -------------------------------------------------
       NOTICIA 1
       ------------------------------------------------- */

    {
        category: "rioja",
        categoryName: "LA RIOJA",
        icon: "📍",

        title: "Escribí aquí el título de la noticia",

        summary:
            "Escribí aquí un resumen breve de la noticia. Este texto aparecerá en la tarjeta principal de ARENA 24.",

        date: "20/09/2026 · ARENA 24 INFORMA",

        link: "https://www.ejemplo.com",

        source: "Fuente: ARENA 24"
    },


    /* -------------------------------------------------
       NOTICIA 2
       ------------------------------------------------- */

    {
        category: "rioja",
        categoryName: "LA RIOJA",
        icon: "📰",

        title: "Nueva noticia de La Rioja",

        summary:
            "Colocá aquí la información principal de la noticia y una breve descripción para los lectores.",

        date: "20/09/2026 · ARENA 24",

        link: "https://www.ejemplo.com",

        source: "Fuente: ARENA 24"
    },


    /* -------------------------------------------------
       NOTICIA 3
       ------------------------------------------------- */

    {
        category: "argentina",
        categoryName: "ARGENTINA",
        icon: "🇦🇷",

        title: "Actualidad de Argentina",

        summary:
            "Resumen de la información nacional que quieras publicar en ARENA 24.",

        date: "20/09/2026 · ARENA 24 INFORMA",

        link: "https://www.ejemplo.com",

        source: "Fuente: ARENA 24"
    },


    /* -------------------------------------------------
       NOTICIA 4
       ------------------------------------------------- */

    {
        category: "mundo",
        categoryName: "MUNDO",
        icon: "🌎",

        title: "Noticias del mundo",

        summary:
            "Resumen breve de la información internacional.",

        date: "20/09/2026 · ARENA 24",

        link: "https://www.ejemplo.com",

        source: "Fuente: ARENA 24"
    },


    /* -------------------------------------------------
       NOTICIA 5
       ------------------------------------------------- */

    {
        category: "deportes",
        categoryName: "DEPORTES",
        icon: "⚽",

        title: "Actualidad deportiva",

        summary:
            "Información deportiva de La Rioja, Argentina o el mundo.",

        date: "20/09/2026 · ARENA 24 DEPORTES",

        link: "https://www.ejemplo.com",

        source: "Fuente: ARENA 24"
    }

];


/* =====================================================
   MOSTRAR NOTICIAS
   ===================================================== */

function renderNews() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const filteredNews = newsData.filter(news => {

        const categoryMatch =
            currentCategory === "all" ||
            news.category === currentCategory;

        const textMatch =
            news.title
                .toLowerCase()
                .includes(searchTerm) ||

            news.summary
                .toLowerCase()
                .includes(searchTerm) ||

            news.categoryName
                .toLowerCase()
                .includes(searchTerm);

        return categoryMatch && textMatch;
    });


    newsGrid.innerHTML = "";


    if (filteredNews.length === 0) {

        noResults.style.display = "block";

        return;
    }


    noResults.style.display = "none";


    filteredNews.forEach(news => {

        const card =
            document.createElement("article");

        card.className = "news-card";


        card.innerHTML = `

            <div class="news-image">

                <span>
                    ${news.icon}
                </span>

            </div>


            <div class="news-content">

                <div class="news-category">
                    ${news.categoryName}
                </div>


                <h3 class="news-title">
                    ${news.title}
                </h3>


                <p class="news-summary">
                    ${news.summary}
                </p>


                <div class="news-meta">
                    ${news.date}
                </div>


                <div class="news-source">
                    ${news.source}
                </div>


                <a
                    class="news-link"
                    href="${news.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    AMPLIAR NOTICIA →
                </a>

            </div>

        `;


        newsGrid.appendChild(card);

    });

}


/* =====================================================
   CATEGORÍAS
   ===================================================== */

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category")
                .forEach(btn => {
                    btn.classList.remove("active");
                });


            button.classList.add("active");


            currentCategory =
                button.dataset.category;


            renderNews();

        });

    });


/* =====================================================
   BUSCADOR
   ===================================================== */

searchInput.addEventListener(
    "input",
    renderNews
);


/* =====================================================
   BOTÓN ACTUALIZAR
   ===================================================== */

refreshBtn.addEventListener(
    "click",
    () => {

        renderNews();

        refreshBtn.textContent =
            "✓ ACTUALIZADO";


        setTimeout(() => {

            refreshBtn.textContent =
                "↻ ACTUALIZAR";

        }, 1500);

    }
);


/* =====================================================
   RELOJ
   ===================================================== */

function updateClock() {

    const now = new Date();


    const hours =
        String(now.getHours())
            .padStart(2, "0");


    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");


    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");


    document.getElementById("clock")
        .textContent =
        `${hours}:${minutes}:${seconds}`;

}


setInterval(updateClock, 1000);

updateClock();


/* =====================================================
   TITULAR "ÚLTIMO MOMENTO"
   ===================================================== */

const headlines = [

    "ARENA 24 INFORMA · Noticias de La Rioja",

    "ARENA 24 INFORMA · Actualidad de Argentina",

    "ARENA 24 INFORMA · Información internacional",

    "ARENA 24 INFORMA · ARENA 24 DEPORTES"

];


let headlineIndex = 0;


function changeHeadline() {

    headlineIndex++;


    if (
        headlineIndex >=
        headlines.length
    ) {
        headlineIndex = 0;
    }


    breakingText.textContent =
        headlines[headlineIndex];

}


setInterval(
    changeHeadline,
    6000
);


/* =====================================================
   INICIAR
   ===================================================== */

renderNews();


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

const arena24ChannelID = "UCrHexRcAlWkaTn8P-BLT3LA";


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
    arena24ChannelID === "UCrHexRcAlWkaTn8P-BLT3LA"
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
