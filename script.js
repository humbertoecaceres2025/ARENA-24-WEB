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
/* =========================================================
   ARENA 24 NOTICIAS
   JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURACIÓN
     ======================================================= */

  const ARENA_CONFIG = {

    /* Coordenadas de La Rioja Capital */
    latitude: -29.4135,
    longitude: -66.8562,

    /* Zona horaria */
    timezone: "America/Argentina/La_Rioja",

   
    */
    newsApi: "/api/noticias",

    /*
      Cada cuánto actualizar noticias.
      60.000 = 1 minuto.
    */
    newsRefresh: 60000

  };


  /* =======================================================
     ELEMENTOS
     ======================================================= */

  const clock = document.getElementById("arenaClock");
  const date = document.getElementById("arenaDate");

  const bigClock = document.getElementById("arenaBigClock");
  const bigDate = document.getElementById("arenaBigDate");

  const year = document.getElementById("arenaYear");

  const menuBtn = document.getElementById("arenaMenuBtn");
  const navLinks = document.getElementById("arenaNavLinks");

  const searchButton =
    document.getElementById("arenaSearchButton");

  const searchBox =
    document.getElementById("arenaSearchBox");

  const searchInput =
    document.getElementById("arenaSearchInput");

  const searchClose =
    document.getElementById("arenaSearchClose");

  const loadMoreButton =
    document.getElementById("loadMoreNews");

  const newsGrid =
    document.getElementById("newsGrid");

  const breakingText =
    document.getElementById("breakingText");


  /* =======================================================
     AÑO
     ======================================================= */

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =======================================================
     RELOJ ARGENTINA
     ======================================================= */

  function updateArgentinaClock() {

    const now = new Date();

    const timeOptions = {
      timeZone: ARENA_CONFIG.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    };

    const dateOptions = {
      timeZone: ARENA_CONFIG.timezone,
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    };

    const time = new Intl.DateTimeFormat(
      "es-AR",
      timeOptions
    ).format(now);

    const formattedDate = new Intl.DateTimeFormat(
      "es-AR",
      dateOptions
    ).format(now);

    if (clock) {
      clock.textContent = time;
    }

    if (bigClock) {
      bigClock.textContent = time;
    }

    if (date) {
      date.textContent = formattedDate;
    }

    if (bigDate) {
      bigDate.textContent = formattedDate;
    }
  }

  updateArgentinaClock();

  setInterval(updateArgentinaClock, 1000);


  /* =======================================================
     MENÚ MOBILE
     ======================================================= */

  if (menuBtn) {

    menuBtn.addEventListener("click", () => {

      navLinks.classList.toggle("active");

    });

  }


  /* =======================================================
     CERRAR MENÚ AL HACER CLICK
     ======================================================= */

  document
    .querySelectorAll(".arena-nav-links a")
    .forEach(link => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("active");

      });

    });


  /* =======================================================
     BUSCADOR
     ======================================================= */

  if (searchButton) {

    searchButton.addEventListener("click", () => {

      searchBox.classList.toggle("active");

      if (searchBox.classList.contains("active")) {
        searchInput.focus();
      }

    });

  }


  if (searchClose) {

    searchClose.addEventListener("click", () => {

      searchBox.classList.remove("active");
      searchInput.value = "";

      filterNews("");

    });

  }


  if (searchInput) {

    searchInput.addEventListener("input", event => {

      filterNews(event.target.value);

    });

  }


  function filterNews(searchTerm) {

    const term = searchTerm
      .toLowerCase()
      .trim();

    const cards =
      document.querySelectorAll(".arena-news-card");

    cards.forEach(card => {

      const text =
        card.textContent.toLowerCase();

      if (!term || text.includes(term)) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

  }


  /* =======================================================
     CLIMA - OPEN METEO
     ======================================================= */

  async function loadWeather() {

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + ARENA_CONFIG.latitude +
      "&longitude=" + ARENA_CONFIG.longitude +
      "&current=temperature_2m,weather_code,wind_speed_10m" +
      "&daily=temperature_2m_max,temperature_2m_min" +
      "&timezone=" + encodeURIComponent(
        ARENA_CONFIG.timezone
      );

    try {

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error consultando clima");
      }

      const data = await response.json();

      const current =
        data.current || {};

      const daily =
        data.daily || {};


      const temperature =
        Math.round(current.temperature_2m);

      const wind =
        Math.round(current.wind_speed_10m);

      const max =
        Math.round(daily.temperature_2m_max[0]);

      const min =
        Math.round(daily.temperature_2m_min[0]);

      const weather =
        getWeatherDescription(
          current.weather_code
        );


      const weatherTemp =
        document.getElementById("weatherTemp");

      const weatherMainTemp =
        document.getElementById("weatherMainTemp");

      const weatherMax =
        document.getElementById("weatherMax");

      const weatherMin =
        document.getElementById("weatherMin");

      const weatherWind =
        document.getElementById("weatherWind");

      const weatherDescription =
        document.getElementById(
          "weatherDescription"
        );

      const weatherIcon =
        document.getElementById("weatherIcon");

      const weatherMainIcon =
        document.getElementById(
          "weatherMainIcon"
        );


      if (weatherTemp)
        weatherTemp.textContent =
          temperature + "°";

      if (weatherMainTemp)
        weatherMainTemp.textContent =
          temperature + "°";

      if (weatherMax)
        weatherMax.textContent =
          max + "°";

      if (weatherMin)
        weatherMin.textContent =
          min + "°";

      if (weatherWind)
        weatherWind.textContent =
          wind + " km/h";

      if (weatherDescription)
        weatherDescription.textContent =
          weather.text;

      if (weatherIcon)
        weatherIcon.textContent =
          weather.icon;

      if (weatherMainIcon)
        weatherMainIcon.textContent =
          weather.icon;


    } catch (error) {

      console.error(
        "ARENA 24 - Error de clima:",
        error
      );

      const description =
        document.getElementById(
          "weatherDescription"
        );

      if (description) {
        description.textContent =
          "No disponible";
      }

    }

  }


  function getWeatherDescription(code) {

    const weatherCodes = {

      0: {
        text: "Despejado",
        icon: "☀️"
      },

      1: {
        text: "Principalmente despejado",
        icon: "🌤️"
      },

      2: {
        text: "Parcialmente nublado",
        icon: "⛅"
      },

      3: {
        text: "Nublado",
        icon: "☁️"
      },

      45: {
        text: "Niebla",
        icon: "🌫️"
      },

      48: {
        text: "Niebla",
        icon: "🌫️"
      },

      51: {
        text: "Llovizna",
        icon: "🌦️"
      },

      53: {
        text: "Llovizna",
        icon: "🌦️"
      },

      55: {
        text: "Llovizna intensa",
        icon: "🌧️"
      },

      61: {
        text: "Lluvia",
        icon: "🌧️"
      },

      63: {
        text: "Lluvia moderada",
        icon: "🌧️"
      },

      65: {
        text: "Lluvia intensa",
        icon: "🌧️"
      },

      71: {
        text: "Nieve",
        icon: "🌨️"
      },

      80: {
        text: "Chaparrones",
        icon: "🌦️"
      },

      81: {
        text: "Chaparrones",
        icon: "🌧️"
      },

      82: {
        text: "Chaparrones fuertes",
        icon: "⛈️"
      },

      95: {
        text: "Tormenta",
        icon: "⛈️"
      }

    };

    return weatherCodes[code] || {
      text: "Condiciones actuales",
      icon: "🌡️"
    };

  }


  loadWeather();


  /*
    Actualizar clima cada 10 minutos.
  */

  setInterval(
    loadWeather,
    10 * 60 * 1000
  );


  /* =======================================================
     NOTICIAS DESDE API
     ======================================================= */

  async function loadNews() {

    if (!ARENA_CONFIG.newsApi) {

      

      return;

    }


    try {

      const response =
        await fetch(ARENA_CONFIG.newsApi, {
          headers: {
            "Accept": "application/json"
          }
        });


      if (!response.ok) {
        throw new Error(
          "Error cargando noticias"
        );
      }


      const news =
        await response.json();


      if (!Array.isArray(news)) {
        throw new Error(
          "La API no devolvió un array"
        );
      }


      renderNews(news);


    } catch (error) {

      console.error(
        "ARENA 24 - Error de noticias:",
        error
      );

    }

  }


  /* =======================================================
     RENDER DE NOTICIAS
     ======================================================= */

  function renderNews(news) {

    if (!newsGrid) return;


    newsGrid.innerHTML = "";


    news.forEach(item => {

      const article =
        document.createElement("article");

      article.className =
        "arena-news-card";


      const image =
        item.image ||
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80";


      const category =
        item.category ||
        "LA RIOJA";


      const title =
        item.title ||
        "Nueva noticia";


      const description =
        item.description ||
        "";


      const date =
        item.date ||
        "Ahora";


      const link =
        item.url ||
        "#";


      article.innerHTML = `

        <div class="news-card-image">

          <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(title)}"
            loading="lazy"
          >

          <span>
            ${escapeHtml(category)}
          </span>

        </div>

        <div class="news-card-content">

          <small>
            ${escapeHtml(date)}
          </small>

          <h3>
            ${escapeHtml(title)}
          </h3>

          <p>
            ${escapeHtml(description)}
          </p>

          <a
            href="${escapeHtml(link)}"
          >
            Leer más →
          </a>

        </div>

      `;


      newsGrid.appendChild(article);

    });


    /*
      Actualizar titular de último momento.
    */

    if (
      breakingText &&
      news.length > 0
    ) {

      breakingText.textContent =
        news[0].title;

    }

  }


  /* =======================================================
     SEGURIDAD HTML
     ======================================================= */

  function escapeHtml(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =======================================================
     CARGAR MÁS
     ======================================================= */

  if (loadMoreButton) {

    loadMoreButton.addEventListener(
      "click",
      async () => {

        loadMoreButton.disabled = true;

        loadMoreButton.textContent =
          "Actualizando...";


        await loadNews();


        setTimeout(() => {

          loadMoreButton.disabled = false;

          loadMoreButton.textContent =
            "Cargar más noticias";

        }, 500);

      }
    );

  }


  /* =======================================================
     ACTUALIZACIÓN AUTOMÁTICA
     ======================================================= */

  if (ARENA_CONFIG.newsApi) {

    loadNews();

    setInterval(
      loadNews,
      ARENA_CONFIG.newsRefresh
    );

  }


});
