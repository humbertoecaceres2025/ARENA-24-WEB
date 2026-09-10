/* =====================================================
   ARENA 24
   SISTEMA AUTOMÁTICO DE NOTICIAS
   DÓLAR + CLIMA + RADIO
===================================================== */

"use strict";


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const DATA_URL = "noticias.json";

const LAT = -29.4135;
const LON = -66.8568;


/* =====================================================
   RADIO
===================================================== */

const playButton =
  document.getElementById("play");

const audio =
  document.getElementById("audio");

const status =
  document.getElementById("status");


if (playButton && audio) {

  playButton.addEventListener(
    "click",
    async () => {

      try {

        if (audio.paused) {

          await audio.play();

          playButton.textContent =
            "⏸ PAUSAR RADIO";

          if (status) {

            status.textContent =
              "● ARENA 24 · REPRODUCIENDO";
          }

        } else {

          audio.pause();

          playButton.textContent =
            "▶ ESCUCHAR EN VIVO";

          if (status) {

            status.textContent =
              "● RADIO EN VIVO";
          }
        }

      } catch (error) {

        if (status) {

          status.textContent =
            "● TOCÁ NUEVAMENTE PARA INICIAR";
        }

      }

    }
  );

}


/* =====================================================
   UTILIDADES
===================================================== */

function escapeHTML(value) {

  if (!value) return "";

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatDate(date) {

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      dateStyle: "short",
      timeStyle: "short"
    }
  ).format(date);
}


/* =====================================================
   NOTICIAS
===================================================== */

async function cargarNoticias() {

  const containers = {

    noticias:
      document.getElementById(
        "news-grid"
      ),

    policiales:
      document.getElementById(
        "policiales-grid"
      ),

    deportes:
      document.getElementById(
        "sports-grid"
      )

  };


  try {

    const response =
      await fetch(
        `${DATA_URL}?v=${Date.now()}`,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "No se pudo cargar noticias.json"
      );
    }


    const data =
      await response.json();


    renderNews(
      containers.noticias,
      data.noticias || [],
      "NOTICIAS"
    );


    renderNews(
      containers.policiales,
      data.policiales || [],
      "POLICIALES"
    );


    renderNews(
      containers.deportes,
      data.deportes || [],
      "DEPORTES"
    );


    const update =
      document.getElementById(
        "last-update"
      );


    if (update) {

      if (data.actualizado) {

        update.textContent =
          "Última actualización: " +
          data.actualizado;

      } else {

        update.textContent =
          "Datos actualizados automáticamente";

      }

    }

  } catch (error) {

    console.error(error);


    const message = `
      <div class="loading">
        <strong>No se pudieron cargar las noticias.</strong>
        <br>
        <small>
          El sistema volverá a intentarlo automáticamente.
        </small>
      </div>
    `;


    if (containers.noticias) {

      containers.noticias.innerHTML =
        message;
    }

    if (containers.policiales) {

      containers.policiales.innerHTML =
        message;
    }

    if (containers.deportes) {

      containers.deportes.innerHTML =
        message;
    }

  }

}


/* =====================================================
   RENDER NOTICIAS
===================================================== */

function renderNews(
  container,
  items,
  category
) {

  if (!container) return;


  if (!items.length) {

    container.innerHTML = `
      <div class="loading">
        No hay información disponible en este momento.
      </div>
    `;

    return;
  }


  container.innerHTML =
    items
      .slice(0, 9)
      .map(item => {

        const title =
          escapeHTML(item.titulo);

        const description =
          escapeHTML(
            item.descripcion || ""
          );

        const link =
          escapeHTML(
            item.url || "#"
          );

        const source =
          escapeHTML(
            item.fuente || "ARENA 24"
          );


        return `

          <article class="news-card">

            <div class="news-category">
              ${escapeHTML(category)}
            </div>

            <h3>
              ${title}
            </h3>

            <p>
              ${description}
            </p>

            <a
              href="${link}"
              target="_blank"
              rel="noopener noreferrer"
            >
              LEER NOTICIA · ${source} →
            </a>

          </article>

        `;

      })
      .join("");

}


/* =====================================================
   DÓLAR
===================================================== */

async function cargarDolar() {

  const container =
    document.getElementById(
      "dollar-grid"
    );


  if (!container) return;


  try {

    const response =
      await fetch(
        "https://dolarapi.com/v1/dolares",
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "Error al obtener dólar"
      );
    }


    const data =
      await response.json();


    const tipos =
      data.filter(
        item =>
          [
            "Oficial",
            "Blue",
            "MEP"
          ].includes(item.nombre)
      );


    if (!tipos.length) {

      throw new Error(
        "No hay cotizaciones"
      );
    }


    container.innerHTML =
      tipos
        .map(item => `

          <article class="money-card">

            <h3>
              💵 Dólar ${escapeHTML(item.nombre)}
            </h3>

            <div class="money-values">

              <div>

                <small>
                  Compra
                </small>

                <strong>
                  ${formatMoney(item.compra)}
                </strong>

              </div>

              <div>

                <small>
                  Venta
                </small>

                <strong>
                  ${formatMoney(item.venta)}
                </strong>

              </div>

            </div>

          </article>

        `)
        .join("");


  } catch (error) {

    console.error(error);


    container.innerHTML = `

      <div class="loading">

        💵 Cotización no disponible
        en este momento.

      </div>

    `;

  }

}


function formatMoney(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "—";
  }


  return new Intl.NumberFormat(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }
  ).format(value);

}


/* =====================================================
   CLIMA
===================================================== */

async function cargarClima() {

  const container =
    document.getElementById(
      "weather-card"
    );


  if (!container) return;


  try {

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LAT}` +
      `&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&timezone=America%2FArgentina%2FLa_Rioja`;


    const response =
      await fetch(
        url,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        "No se pudo obtener clima"
      );
    }


    const data =
      await response.json();


    const current =
      data.current;


    const weather =
      getWeatherDescription(
        current.weather_code
      );


    container.innerHTML = `

      <div class="weather-main">

        <div class="weather-icon">
          ${weather.icon}
        </div>

        <div>

          <div class="weather-temp">
            ${Math.round(
              current.temperature_2m
            )}°C
          </div>

          <div class="weather-location">
            📍 La Rioja Capital
          </div>

          <div class="weather-description">
            ${weather.text}
          </div>

        </div>

      </div>


      <div class="weather-details">

        <div class="weather-detail">

          💧 Humedad

          <strong>
            ${current.relative_humidity_2m}%
          </strong>

        </div>


        <div class="weather-detail">

          🌡️ Sensación

          <strong>
            ${Math.round(
              current.apparent_temperature
            )}°C
          </strong>

        </div>


        <div class="weather-detail">

          💨 Viento

          <strong>
            ${Math.round(
              current.wind_speed_10m
            )} km/h
          </strong>

        </div>

      </div>

    `;


  } catch (error) {

    console.error(error);


    container.innerHTML = `

      <div class="loading">

        🌦️ No se pudo actualizar
        el clima.

      </div>

    `;

  }

}


/* =====================================================
   CÓDIGOS METEOROLÓGICOS
===================================================== */

function getWeatherDescription(code) {

  if (code === 0) {

    return {
      icon: "☀️",
      text: "Despejado"
    };

  }


  if (
    code === 1 ||
    code === 2
  ) {

    return {
      icon: "🌤️",
      text: "Parcialmente nublado"
    };

  }


  if (code === 3) {

    return {
      icon: "☁️",
      text: "Nublado"
    };

  }


  if (
    code >= 45 &&
    code <= 48
  ) {

    return {
      icon: "🌫️",
      text: "Niebla"
    };

  }


  if (
    code >= 51 &&
    code <= 67
  ) {

    return {
      icon: "🌧️",
      text: "Lluvia"
    };

  }


  if (
    code >= 71 &&
    code <= 77
  ) {

    return {
      icon: "❄️",
      text: "Nieve"
    };

  }


  if (
    code >= 80 &&
    code <= 82
  ) {

    return {
      icon: "🌦️",
      text: "Chaparrones"
    };

  }


  if (
    code >= 95
  ) {

    return {
      icon: "⛈️",
      text: "Tormenta"
    };

  }


  return {
    icon: "🌦️",
    text: "Condiciones variables"
  };

}


/* =====================================================
   ACTUALIZACIÓN MANUAL
===================================================== */

const refreshButton =
  document.getElementById(
    "refresh-news"
  );


if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    async () => {

      refreshButton.disabled =
        true;

      refreshButton.textContent =
        "↻ ACTUALIZANDO...";


      await Promise.all([
        cargarNoticias(),
        cargarDolar(),
        cargarClima()
      ]);


      refreshButton.disabled =
        false;

      refreshButton.textContent =
        "↻ ACTUALIZAR";

    }
  );

}


/* =====================================================
   INICIO
===================================================== */

async function iniciarArena24() {

  await Promise.all([
    cargarNoticias(),
    cargarDolar(),
    cargarClima()
  ]);

}


/* =====================================================
   ACTUALIZACIÓN AUTOMÁTICA
===================================================== */

/*
   Noticias:
   cada 10 minutos.

   Dólar:
   cada 5 minutos.

   Clima:
   cada 10 minutos.
*/

setInterval(
  cargarNoticias,
  10 * 60 * 1000
);

setInterval(
  cargarDolar,
  5 * 60 * 1000
);

setInterval(
  cargarClima,
  10 * 60 * 1000
);


iniciarArena24();
