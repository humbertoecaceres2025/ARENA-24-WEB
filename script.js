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

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>ARENA 24 INFORMA</title>

<link rel="stylesheet" href="noticias.css">
</head>

<body>

<section id="arena24-noticias">

    <!-- CABECERA -->

    <div class="a24-news-header">

        <div class="a24-news-logo">

            <div class="a24-news-circle">
                A24
            </div>

            <div>
                <h2>ARENA <span>24</span></h2>

                <p>
                    RADIO · INFORMACIÓN · ACTUALIDAD
                </p>
            </div>

        </div>


        <div class="a24-live">

            <span class="a24-live-dot"></span>

            ARENA 24 INFORMA

        </div>

    </div>


    <!-- INFORMACIÓN -->

    <div class="a24-news-info">

        <span>
            📍 LA RIOJA · ARGENTINA
        </span>

        <span id="a24-clock">
            00:00:00
        </span>

    </div>


    <!-- CATEGORÍAS -->

    <div class="a24-categories">

        <button
            class="a24-category active"
            data-category="all">
            TODAS
        </button>

        <button
            class="a24-category"
            data-category="rioja">
            🟠 LA RIOJA
        </button>

        <button
            class="a24-category"
            data-category="argentina">
            🇦🇷 ARGENTINA
        </button>

        <button
            class="a24-category"
            data-category="mundo">
            🌎 MUNDO
        </button>

        <button
            class="a24-category"
            data-category="deportes">
            ⚽ DEPORTES
        </button>

    </div>


    <!-- BUSCADOR -->

    <div class="a24-search">

        <input
            type="search"
            id="a24-search-input"
            placeholder="🔎 Buscar noticias..."
        >

    </div>


    <!-- ÚLTIMO MOMENTO -->

    <div class="a24-breaking">

        <div class="a24-breaking-label">
            🔴 ÚLTIMO MOMENTO
        </div>

        <div
            class="a24-breaking-text"
            id="a24-breaking-text">

            ARENA 24 INFORMA · Noticias de La Rioja,
            Argentina y el mundo

        </div>

    </div>


    <!-- TÍTULO -->

    <div class="a24-section-title">

        <h2>
            <span class="a24-orange-line"></span>
            Noticias
        </h2>

        <button
            class="a24-refresh"
            id="a24-refresh">

            ↻ ACTUALIZAR

        </button>

    </div>


    <!-- NOTICIAS -->

    <div
        class="a24-news-grid"
        id="a24-news-grid">
    </div>


    <!-- SIN RESULTADOS -->

    <div
        class="a24-no-results"
        id="a24-no-results">

        No se encontraron noticias.

    </div>

</section>


<script src="noticias.js"></script>

</body>
</html>




/* =========================================================
   ARENA 24 RADIO WEB 4.0
   JavaScript principal
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTOS
       ========================= */

    const audio = document.getElementById("radioAudio");
    const playButton = document.getElementById("playButton");
    const muteButton = document.getElementById("muteButton");
    const volumeControl = document.getElementById("volumeControl");

    const radioPlayer = document.getElementById("radioPlayer");
    const playerMessage = document.getElementById("playerMessage");

    const menuButton = document.getElementById("menuButton");
    const mainMenu = document.getElementById("mainMenu");

    const updateNews = document.getElementById("updateNews");
    const newsContainer = document.getElementById("newsContainer");


    /* =========================
       CONFIGURACIÓN DEL AUDIO
       ========================= */

    if (audio) {
        audio.volume = volumeControl
            ? Number(volumeControl.value)
            : 0.8;
    }


    /* =========================
       REPRODUCTOR PLAY / PAUSE
       ========================= */

    if (playButton && audio) {

        playButton.addEventListener("click", async () => {

            if (audio.paused) {

                playerMessage.textContent =
                    "Conectando con ARENA 24...";

                try {

                    await audio.play();

                } catch (error) {

                    console.error(
                        "Error al iniciar la radio:",
                        error
                    );

                    playerMessage.textContent =
                        "No se pudo iniciar la transmisión. Tocá PLAY nuevamente.";

                    radioPlayer.classList.remove("playing");
                }

            } else {

                audio.pause();
            }

        });
    }


    /* =========================
       AUDIO REPRODUCIÉNDOSE
       ========================= */

    if (audio) {

        audio.addEventListener("playing", () => {

            if (playButton) {
                playButton.textContent = "❚❚";
                playButton.setAttribute(
                    "aria-label",
                    "Pausar radio"
                );
            }

            if (playerMessage) {
                playerMessage.textContent =
                    "ARENA 24 está transmitiendo EN VIVO.";
            }

            if (radioPlayer) {
                radioPlayer.classList.add("playing");
            }

        });


        /* =========================
           AUDIO PAUSADO
           ========================= */

        audio.addEventListener("pause", () => {

            if (playButton) {
                playButton.textContent = "▶";
                playButton.setAttribute(
                    "aria-label",
                    "Reproducir radio"
                );
            }

            if (playerMessage) {
                playerMessage.textContent =
                    "Radio pausada.";
            }

            if (radioPlayer) {
                radioPlayer.classList.remove("playing");
            }

        });


        /* =========================
           ERROR DE CONEXIÓN
           ========================= */

        audio.addEventListener("error", () => {

            if (playButton) {
                playButton.textContent = "▶";
            }

            if (radioPlayer) {
                radioPlayer.classList.remove("playing");
            }

            if (playerMessage) {
                playerMessage.textContent =
                    "No se pudo conectar al streaming. Intentá nuevamente.";
            }

        });
    }


    /* =========================
       CONTROL DE VOLUMEN
       ========================= */

    if (volumeControl && audio) {

        volumeControl.addEventListener("input", () => {

            audio.volume =
                Number(volumeControl.value);

            audio.muted = false;

            if (muteButton) {
                muteButton.textContent = "🔊";
            }

        });
    }


    /* =========================
       MUTE / SONIDO
       ========================= */

    if (muteButton && audio) {

        muteButton.addEventListener("click", () => {

            audio.muted = !audio.muted;

            if (audio.muted) {

                muteButton.textContent = "🔇";

            } else {

                muteButton.textContent = "🔊";
            }

        });
    }


    /* =========================
       MENÚ PARA CELULAR
       ========================= */

    if (menuButton && mainMenu) {

        menuButton.addEventListener("click", () => {

            mainMenu.classList.toggle("open");

        });


        const menuLinks =
            mainMenu.querySelectorAll("a");

        menuLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainMenu.classList.remove("open");

            });

        });
    }


    /* =========================================================
       NOTICIAS
       ========================================================= */

    const RSS_PROXY =
        "https://api.rss2json.com/v1/api.json?rss_url=";


    const fuentes = [

        {
            categoria: "LA RIOJA",
            url:
                "https://news.google.com/rss/search?q=La+Rioja+Argentina&hl=es-419&gl=AR&ceid=AR:es-419"
        },

        {
            categoria: "ARGENTINA",
            url:
                "https://news.google.com/rss/search?q=Argentina&hl=es-419&gl=AR&ceid=AR:es-419"
        },

        {
            categoria: "DEPORTES",
            url:
                "https://news.google.com/rss/search?q=Argentina+Deportes&hl=es-419&gl=AR&ceid=AR:es-419"
        }

    ];


    /* =========================
       SEGURIDAD HTML
       ========================= */

    function escaparHTML(texto) {

        if (!texto) return "";

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================
       LIMPIAR DESCRIPCIÓN
       ========================= */

    function limpiarDescripcion(texto) {

        if (!texto) {
            return "Información disponible en la fuente original.";
        }

        const temporal =
            document.createElement("div");

        temporal.innerHTML = texto;

        let resultado =
            temporal.textContent ||
            temporal.innerText ||
            "";

        resultado =
            resultado.replace(/\s+/g, " ").trim();

        if (resultado.length > 180) {
            resultado =
                resultado.substring(0, 180) + "...";
        }

        return resultado;
    }


    /* =========================
       CARGAR UNA FUENTE RSS
       ========================= */

    async function cargarFuente(fuente) {

        const url =
            RSS_PROXY +
            encodeURIComponent(fuente.url);

        try {

            const respuesta =
                await fetch(url);

            if (!respuesta.ok) {
                throw new Error(
                    "Error HTTP " + respuesta.status
                );
            }

            const datos =
                await respuesta.json();

            if (
                !datos.items ||
                !Array.isArray(datos.items)
            ) {
                return [];
            }

            return datos.items.map(item => {

                return {

                    categoria:
                        fuente.categoria,

                    titulo:
                        item.title || "Sin título",

                    descripcion:
                        limpiarDescripcion(
                            item.description
                        ),

                    enlace:
                        item.link || "#",

                    fecha:
                        item.pubDate || ""

                };

            });

        } catch (error) {

            console.error(
                "Error cargando noticias:",
                fuente.categoria,
                error
            );

            return [];
        }
    }


    /* =========================
       MOSTRAR NOTICIAS
       ========================= */

    function mostrarNoticias(noticias) {

        if (!newsContainer) return;


        if (!noticias.length) {

            newsContainer.innerHTML = `
                <article class="news-card">
                    <span class="news-category">
                        ARENA 24
                    </span>

                    <h3>
                        Noticias disponibles próximamente
                    </h3>

                    <p>
                        No fue posible actualizar las fuentes
                        de noticias en este momento.
                    </p>
                </article>
            `;

            return;
        }


        newsContainer.innerHTML =
            noticias.map(noticia => {

                return `
                    <article class="news-card">

                        <span class="news-category">
                            ${escaparHTML(noticia.categoria)}
                        </span>

                        <h3>
                            ${escaparHTML(noticia.titulo)}
                        </h3>

                        <p>
                            ${escaparHTML(noticia.descripcion)}
                        </p>

                        <a
                            href="${escaparHTML(noticia.enlace)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Leer fuente original ↗
                        </a>

                    </article>
                `;

            }).join("");

    }


    /* =========================
       ACTUALIZAR NOTICIAS
       ========================= */

    async function actualizarNoticias() {

        if (!newsContainer) return;


        newsContainer.innerHTML = `
            <article class="news-card">
                <span class="news-category">
                    ARENA 24 INFORMA
                </span>

                <h3>
                    Actualizando noticias...
                </h3>

                <p>
                    Buscando información de La Rioja,
                    Argentina y Deportes.
                </p>
            </article>
        `;


        const resultados =
            await Promise.all(
                fuentes.map(cargarFuente)
            );


        let todasLasNoticias =
            resultados.flat();


        /* Eliminar títulos repetidos */

        const titulos = new Set();

        todasLasNoticias =
            todasLasNoticias.filter(noticia => {

                const clave =
                    noticia.titulo
                        .toLowerCase()
                        .trim();

                if (titulos.has(clave)) {
                    return false;
                }

                titulos.add(clave);

                return true;
            });


        /* Ordenar por fecha */

        todasLasNoticias.sort(
            (a, b) =>
                new Date(b.fecha) -
                new Date(a.fecha)
        );


        /* Mostrar máximo 9 noticias */

        todasLasNoticias =
            todasLasNoticias.slice(0, 9);


        mostrarNoticias(
            todasLasNoticias
        );

    }


    /* =========================
       BOTÓN ACTUALIZAR
       ========================= */

    if (updateNews) {

        updateNews.addEventListener(
            "click",
            actualizarNoticias
        );

    }


    /* =========================
       CARGA INICIAL
       ========================= */

    actualizarNoticias();


    /* =========================
       ACTUALIZACIÓN AUTOMÁTICA
       CADA 15 MINUTOS
       ========================= */

    setInterval(
        actualizarNoticias,
        15 * 60 * 1000
    );


    /* =========================
       AÑO AUTOMÁTICO
       ========================= */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }

});

/* =========================================================
       PROGRAMACIÓN AUTOMÁTICA ARENA 24
       ========================================================= */

    const currentProgramCategory =
        document.getElementById("currentProgramCategory");

    const currentProgramName =
        document.getElementById("currentProgramName");

    const currentProgramDescription =
        document.getElementById("currentProgramDescription");

    const currentProgramTime =
        document.getElementById("currentProgramTime");

    const scheduleGrid =
        document.getElementById("scheduleGrid");


    const programacionSemana = [

        {
            inicio: 0,
            fin: 6,
            nombre: "ARENA 24 Madrugada",
            categoria: "MÚSICA",
            descripcion:
                "Música para acompañarte durante la madrugada.",
            conductor: "ARENA 24",
            horario: "00:00 - 06:00"
        },

        {
            inicio: 6,
            fin: 10,
            nombre: "ARENA 24 Noticias",
            categoria: "NOTICIAS",
            descripcion:
                "Noticias de La Rioja, Argentina y el mundo.",
            conductor: "Enrique",
            horario: "06:00 - 10:00"
        },

        {
            inicio: 10,
            fin: 14,
            nombre: "ARENA 24 Entretenimiento",
            categoria: "ENTRETENIMIENTO",
            descripcion:
                "Música, actualidad, entretenimiento y compañía.",
            conductor: "Viviana",
            horario: "10:00 - 14:00"
        },

        {
            inicio: 14,
            fin: 18,
            nombre: "ARENA 24 Música",
            categoria: "MÚSICA",
            descripcion:
                "Los mejores sonidos para acompañar tu tarde.",
            conductor: "ARENA 24",
            horario: "14:00 - 18:00"
        },

        {
            inicio: 18,
            fin: 22,
            nombre: "ARENA 24 Deportes",
            categoria: "DEPORTES",
            descripcion:
                "Información y actualidad deportiva.",
            conductor: "Nicolás",
            horario: "18:00 - 22:00"
        },

        {
            inicio: 22,
            fin: 24,
            nombre: "ARENA 24 Relax",
            categoria: "RELAX",
            descripcion:
                "Música actual y sonidos para terminar el día.",
            conductor: "Martina",
            horario: "22:00 - 00:00"
        }

    ];


    const programacionFinDeSemana = [

        {
            inicio: 0,
            fin: 9,
            nombre: "ARENA 24 Weekend",
            categoria: "MÚSICA",
            descripcion:
                "Música para comenzar el fin de semana.",
            conductor: "ARENA 24",
            horario: "00:00 - 09:00"
        },

        {
            inicio: 9,
            fin: 13,
            nombre: "ARENA 24 Entretenimiento",
            categoria: "ENTRETENIMIENTO",
            descripcion:
                "Entretenimiento, música y actualidad.",
            conductor: "Viviana",
            horario: "09:00 - 13:00"
        },

        {
            inicio: 13,
            fin: 18,
            nombre: "ARENA 24 Deportes",
            categoria: "DEPORTES",
            descripcion:
                "Actualidad deportiva y música.",
            conductor: "Nicolás",
            horario: "13:00 - 18:00"
        },

        {
            inicio: 18,
            fin: 22,
            nombre: "ARENA 24 Especial",
            categoria: "MÚSICA",
            descripcion:
                "Música, artistas y programación especial.",
            conductor: "ARENA 24",
            horario: "18:00 - 22:00"
        },

        {
            inicio: 22,
            fin: 24,
            nombre: "ARENA 24 Relax",
            categoria: "RELAX",
            descripcion:
                "Música actual para cerrar el día.",
            conductor: "Martina",
            horario: "22:00 - 00:00"
        }

    ];


    function obtenerProgramacionActual() {

        const ahora = new Date();

        const hora =
            ahora.getHours();

        const dia =
            ahora.getDay();

        const esFinDeSemana =
            dia === 0 || dia === 6;

        const lista =
            esFinDeSemana
                ? programacionFinDeSemana
                : programacionSemana;

        return lista.find(programa =>
            hora >= programa.inicio &&
            hora < programa.fin
        );
    }


    function mostrarProgramacion() {

        if (!currentProgramName) {
            return;
        }

        const programa =
            obtenerProgramacionActual();

        if (!programa) {
            return;
        }


        currentProgramCategory.textContent =
            programa.categoria;

        currentProgramName.textContent =
            programa.nombre;

        currentProgramDescription.textContent =
            programa.descripcion;

        currentProgramTime.textContent =
            programa.horario;


        if (scheduleGrid) {

            scheduleGrid.innerHTML =
                programaListaActual()
                    .map(item => {

                        const activo =
                            item.nombre ===
                            programa.nombre;

                        return `
                            <article
                                class="schedule-card
                                ${activo ? "active" : ""}"
                            >

                                <span class="schedule-time">
                                    ${item.horario}
                                </span>

                                <h3>
                                    ${item.nombre}
                                </h3>

                                <p>
                                    ${item.descripcion}
                                </p>

                                <span class="host">
                                    🎙️ Conduce:
                                    ${item.conductor}
                                </span>

                            </article>
                        `;

                    })
                    .join("");
        }

    }


    function programaListaActual() {

        const ahora = new Date();

        const dia =
            ahora.getDay();

        const esFinDeSemana =
            dia === 0 || dia === 6;

        return esFinDeSemana
            ? programacionFinDeSemana
            : programacionSemana;
    }


    mostrarProgramacion();


    /* Actualizar cada minuto */

    setInterval(
        mostrarProgramacion,
        60 * 1000
    );
