/* =========================================================
   ARENA 24
   SISTEMA AUTOMÁTICO DE NOTICIAS + DÓLAR + CLIMA
   Compatible con GitHub Pages
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CONFIG = {

  /* Actualizar cada 5 minutos */
  refresh: 5 * 60 * 1000,

  /* La Rioja Capital */
  latitude: -29.4135,
  longitude: -66.8568,

  /*
    RSS de Google News convertido mediante RSS2JSON.
    No necesita PHP.
  */

  feeds: {

    rioja:
      "https://news.google.com/rss/search?q=La+Rioja+Argentina&hl=es-419&gl=AR&ceid=AR:es-419",

    policiales:
      "https://news.google.com/rss/search?q=policiales+La+Rioja+Argentina&hl=es-419&gl=AR&ceid=AR:es-419",

    deportes:
      "https://news.google.com/rss/search?q=deportes+Argentina&hl=es-419&gl=AR&ceid=AR:es-419"

  }

};


/* =========================================================
   RADIO
   ========================================================= */

const playButton =
  document.getElementById("play");

const audio =
  document.getElementById("audio");

const status =
  document.getElementById("status");


if (playButton && audio) {

  playButton.addEventListener("click", async () => {

    try {

      if (audio.paused) {

        await audio.play();

        playButton.textContent =
          "⏸ PAUSAR RADIO";

        status.textContent =
          "● ARENA 24 · REPRODUCIENDO EN VIVO";

      } else {

        audio.pause();

        playButton.textContent =
          "▶ ESCUCHAR EN VIVO";

        status.textContent =
          "● ARENA 24 · RADIO PAUSADA";

      }

    } catch (error) {

      status.textContent =
        "● Tocá nuevamente para iniciar la radio.";

    }

  });

}


/* =========================================================
   SEGURIDAD HTML
   ========================================================= */

function escapeHTML(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value || "";

  return div.innerHTML;

}


/* =========================================================
   LIMPIAR DESCRIPCIONES RSS
   ========================================================= */

function cleanDescription(text) {

  if (!text) return "";

  const div =
    document.createElement("div");

  div.innerHTML = text;

  const result =
    div.textContent ||
    div.innerText ||
    "";

  return result
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 180);

}


/* =========================================================
   RSS → JSON
   ========================================================= */

async function getRSS(feedURL) {

  const api =
    "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent(feedURL);

  const response =
    await fetch(api);

  if (!response.ok) {

    throw new Error(
      "No se pudo consultar el RSS"
    );

  }

  const data =
    await response.json();

  if (data.status !== "ok") {

    throw new Error(
      data.message ||
      "RSS no disponible"
    );

  }

  return data.items || [];

}


/* =========================================================
   FORMATEAR FECHA
   ========================================================= */

function formatDate(dateString) {

  if (!dateString)
    return "";

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime()))
    return "";

  return date.toLocaleString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function createCard(
  item,
  category
) {

  const title =
    item.title ||
    "Sin título";

  const description =
    cleanDescription(
      item.description
    );

  const link =
    item.link || "#";

  const date =
    formatDate(
      item.pubDate
    );

  return `

    <article class="news-card">

      <div class="news-content">

        <span class="news-category">
          ${escapeHTML(category)}
        </span>

        <h3>
          ${escapeHTML(title)}
        </h3>

        ${
          description
          ?
          `<p>
            ${escapeHTML(description)}
          </p>`
          :
          ""
        }

        ${
          date
          ?
          `<small>
            🕐 ${escapeHTML(date)}
          </small>`
          :
          ""
        }

        <a
          class="news-link"
          href="${escapeHTML(link)}"
          target="_blank"
          rel="noopener noreferrer">

          LEER NOTICIA →

        </a>

      </div>

    </article>

  `;

}


/* =========================================================
   MOSTRAR ERROR
   ========================================================= */

function showError(
  element,
  message
) {

  if (!element)
    return;

  element.innerHTML = `

    <article class="loading-card">

      <p>
        ⚠️ ${escapeHTML(message)}
      </p>

    </article>

  `;

}


/* =========================================================
   CARGAR UNA SECCIÓN RSS
   ========================================================= */

async function loadFeed(
  elementID,
  feedURL,
  category
) {

  const container =
    document.getElementById(elementID);

  if (!container)
    return [];

  try {

    const items =
      await getRSS(feedURL);

    if (!items.length) {

      throw new Error(
        "No hay noticias disponibles."
      );

    }

    const selected =
      items.slice(0, 6);

    container.innerHTML =
      selected
        .map(item =>
          createCard(
            item,
            category
          )
        )
        .join("");

    return selected;

  } catch (error) {

    console.error(
      category,
      error
    );

    showError(
      container,
      `No se pudieron actualizar ${category.toLowerCase()}.`
    );

    return [];

  }

}


/* =========================================================
   NOTICIAS
   ========================================================= */

async function loadNews() {

  return await loadFeed(
    "newsGrid",
    CONFIG.feeds.rioja,
    "LA RIOJA"
  );

}


/* =========================================================
   POLICIALES
   ========================================================= */

async function loadPolice() {

  return await loadFeed(
    "policeGrid",
    CONFIG.feeds.policiales,
    "POLICIALES"
  );

}


/* =========================================================
   DEPORTES
   ========================================================= */

async function loadSports() {

  return await loadFeed(
    "sportsGrid",
    CONFIG.feeds.deportes,
    "DEPORTES"
  );

}


/* =========================================================
   FLASH
   ========================================================= */

function updateFlash(
  news,
  police,
  sports
) {

  const element =
    document.getElementById(
      "breakingNews"
    );

  if (!element)
    return;

  const all = [
    ...news,
    ...police,
    ...sports
  ];

  if (!all.length) {

    element.textContent =
      "ARENA 24 · Siempre con vos.";

    return;

  }

  element.textContent =
    all
      .slice(0, 8)
      .map(item =>
        item.title
      )
      .join("   •   ");

}


/* =========================================================
   DÓLAR
   ========================================================= */

async function loadDollar() {

  const container =
    document.getElementById(
      "dollarGrid"
    );

  if (!container)
    return;


  try {

    const response =
      await fetch(
        "https://dolarapi.com/v1/dolares"
      );

    if (!response.ok)
      throw new Error(
        "API dólar no disponible"
      );

    const data =
      await response.json();


    const wanted = [
      "Oficial",
      "Blue",
      "Bolsa",
      "Contado con liqui",
      "Tarjeta"
    ];


    const filtered =
      data.filter(item =>
        wanted.some(name =>
          (
            item.nombre ||
            ""
          )
          .toLowerCase()
          .includes(
            name.toLowerCase()
          )
        )
      );


    container.innerHTML =
      filtered
        .slice(0, 5)
        .map(item => `

          <article class="dollar-card">

            <small>
              ${escapeHTML(
                item.nombre ||
                item.casa ||
                "DÓLAR"
              )}
            </small>

            <strong>
              $${Number(
                item.venta || 0
              ).toLocaleString(
                "es-AR"
              )}
            </strong>

            <span>
              Compra:
              $${Number(
                item.compra || 0
              ).toLocaleString(
                "es-AR"
              )}
            </span>

            <span>
              Actualizado:
              ${escapeHTML(
                item.fechaActualizacion ||
                ""
              )}
            </span>

          </article>

        `)
        .join("");


    if (!filtered.length) {

      container.innerHTML = `

        <article class="dollar-card">

          <small>DÓLAR</small>

          <strong>
            Sin datos
          </strong>

        </article>

      `;

    }


  } catch (error) {

    console.error(
      "Dólar:",
      error
    );

    container.innerHTML = `

      <article class="dollar-card">

        <small>DÓLAR</small>

        <strong>
          No disponible
        </strong>

        <span>
          Reintentando automáticamente.
        </span>

      </article>

    `;

  }

}


/* =========================================================
   CLIMA
   ========================================================= */

async function loadWeather() {

  const container =
    document.getElementById(
      "weatherCard"
    );

  if (!container)
    return;


  const url =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" +
    CONFIG.latitude +
    "&longitude=" +
    CONFIG.longitude +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code" +
    "&timezone=America%2FArgentina%2FLa_Rioja";


  try {

    const response =
      await fetch(url);

    if (!response.ok)
      throw new Error(
        "Clima no disponible"
      );

    const data =
      await response.json();

    const current =
      data.current;


    const weatherText =
      getWeatherDescription(
        current.weather_code
      );


    container.innerHTML = `

      <div class="weather-main">

        <div>

          <div class="weather-temperature">

            ${Math.round(
              current.temperature_2m
            )}°C

          </div>

          <div class="weather-description">

            ${weatherText}

          </div>

        </div>


        <div>

          <h3>
            🌦️ La Rioja Capital
          </h3>

          <p>
            Sensación:
            ${Math.round(
              current.apparent_temperature
            )}°C
          </p>

        </div>

      </div>


      <div class="weather-info">

        <div>

          <small>HUMEDAD</small>

          <strong>
            ${current.relative_humidity_2m}%
          </strong>

        </div>


        <div>

          <small>VIENTO</small>

          <strong>
            ${Math.round(
              current.wind_speed_10m
            )} km/h
          </strong>

        </div>


        <div>

          <small>ACTUALIZACIÓN</small>

          <strong>
            Ahora
          </strong>

        </div>

      </div>

    `;


  } catch (error) {

    console.error(
      "Clima:",
      error
    );

    container.innerHTML = `

      <div>

        <h3>
          🌦️ La Rioja Capital
        </h3>

        <p>
          No se pudo actualizar
          el clima en este momento.
        </p>

      </div>

    `;

  }

}


/* =========================================================
   DESCRIPCIÓN DEL CLIMA
   ========================================================= */

function getWeatherDescription(
  code
) {

  const descriptions = {

    0:
      "☀️ Cielo despejado",

    1:
      "🌤️ Principalmente despejado",

    2:
      "⛅ Parcialmente nublado",

    3:
      "☁️ Nublado",

    45:
      "🌫️ Niebla",

    48:
      "🌫️ Niebla",

    51:
      "🌦️ Llovizna",

    53:
      "🌦️ Llovizna",

    55:
      "🌧️ Llovizna intensa",

    61:
      "🌧️ Lluvia",

    63:
      "🌧️ Lluvia moderada",

    65:
      "🌧️ Lluvia intensa",

    71:
      "❄️ Nieve",

    73:
      "❄️ Nieve moderada",

    75:
      "❄️ Nieve intensa",

    80:
      "🌦️ Chaparrones",

    81:
      "🌦️ Chaparrones moderados",

    82:
      "⛈️ Chaparrones fuertes",

    95:
      "⛈️ Tormenta",

    96:
      "⛈️ Tormenta con granizo",

    99:
      "⛈️ Tormenta fuerte con granizo"

  };

  return (
    descriptions[code] ||
    "🌤️ Condiciones actuales"
  );

}


/* =========================================================
   ACTUALIZAR TODO
   ========================================================= */

async function updateAll() {

  console.log(
    "ARENA 24 · Actualizando información..."
  );


  const results =
    await Promise.all([

      loadNews(),

      loadPolice(),

      loadSports(),

      loadDollar(),

      loadWeather()

    ]);


  updateFlash(
    results[0],
    results[1],
    results[2]
  );


  console.log(
    "ARENA 24 · Actualización completa."
  );

}


/* =========================================================
   INICIO
   ========================================================= */

updateAll();


/* =========================================================
   ACTUALIZACIÓN AUTOMÁTICA
   ========================================================= */

setInterval(
  updateAll,
  CONFIG.refresh
);


/* =========================================================
   ACTUALIZAR AL VOLVER A LA PÁGINA
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState ===
      "visible"
    ) {

      updateAll();

    }

  }
);
