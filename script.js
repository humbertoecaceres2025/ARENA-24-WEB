const playButton = document.getElementById("play");
const audio = document.getElementById("audio");
const statusText = document.getElementById("status");


// ======================================
// RADIO
// ======================================

playButton.addEventListener("click", async () => {

  try {

    if (audio.paused) {

      await audio.play();

      playButton.textContent = "⏸ PAUSAR RADIO";

      statusText.textContent =
        "🔴 ARENA 24 · REPRODUCIENDO";

    } else {

      audio.pause();

      playButton.textContent =
        "▶ ESCUCHAR EN VIVO";

      statusText.textContent =
        "🔴 ARENA 24 · EN VIVO";
    }

  } catch (error) {

    statusText.textContent =
      "⚠️ Tocá nuevamente para iniciar la radio.";

  }

});


// ======================================
// NOTICIAS DESDE noticias.json
// ======================================

async function cargarNoticias() {

  const newsGrid =
    document.getElementById("newsGrid");

  try {

    const respuesta =
      await fetch("noticias.json?t=" + Date.now());

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar noticias.json");
    }

    const datos =
      await respuesta.json();

    newsGrid.innerHTML = "";

    const noticias =
      Array.isArray(datos)
        ? datos
        : datos.noticias || [];

    noticias.forEach(noticia => {

      const article =
        document.createElement("article");

      article.className = "news-card";

      article.innerHTML = `
        <div class="news-card-content">

          <span class="news-category">
            ${escapar(noticia.categoria || "Noticias")}
          </span>

          <h3>
            ${escapar(noticia.titulo || "Sin título")}
          </h3>

          <p>
            ${escapar(noticia.descripcion || "")}
          </p>

        </div>
      `;

      newsGrid.appendChild(article);

    });


    if (!noticias.length) {

      newsGrid.innerHTML =
        '<div class="loading">No hay noticias disponibles.</div>';

    }


    const update =
      document.getElementById("lastUpdate");

    if (update) {

      update.textContent =
        "Actualizado: " +
        new Date().toLocaleString("es-AR");

    }

  } catch (error) {

    console.error(error);

    newsGrid.innerHTML = `
      <div class="loading">
        ⚠️ No se pudieron cargar las noticias.
        <br>
        <small>
          Verificá que exista el archivo noticias.json.
        </small>
      </div>
    `;

  }

}


// ======================================
// DOLAR
// ======================================

async function cargarDolar() {

  const contenedor =
    document.getElementById("dolar");

  try {

    const respuesta =
      await fetch(
        "https://dolarapi.com/v1/dolares"
      );

    const datos =
      await respuesta.json();

    const oficial =
      datos.find(
        item => item.casa === "oficial"
      );

    const blue =
      datos.find(
        item => item.casa === "blue"
      );


    contenedor.innerHTML = `

      <div class="data-row">

        <span class="data-name">
          Dólar Oficial
        </span>

        <span class="data-value">
          $${formatear(oficial?.venta)}
        </span>

      </div>


      <div class="data-row">

        <span class="data-name">
          Dólar Blue
        </span>

        <span class="data-value">
          $${formatear(blue?.venta)}
        </span>

      </div>

    `;

  } catch (error) {

    console.error(error);

    contenedor.innerHTML = `
      <div class="loading">
        ⚠️ Cotización temporalmente no disponible.
      </div>
    `;

  }

}


// ======================================
// CLIMA
// ======================================

async function cargarClima() {

  const contenedor =
    document.getElementById("clima");

  try {

    /*
      La Rioja Capital
      Coordenadas aproximadas:
      -29.4135, -66.8566
    */

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=-29.4135" +
      "&longitude=-66.8566" +
      "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
      "&daily=temperature_2m_max,temperature_2m_min" +
      "&timezone=America%2FArgentina%2FLa_Rioja";

    const respuesta =
      await fetch(url);

    const datos =
      await respuesta.json();

    const actual =
      datos.current;

    const max =
      datos.daily.temperature_2m_max[0];

    const min =
      datos.daily.temperature_2m_min[0];

    contenedor.innerHTML = `

      <div class="data-row">

        <span class="data-name">
          🌡️ Temperatura
        </span>

        <span class="data-value">
          ${Math.round(actual.temperature_2m)} °C
        </span>

      </div>


      <div class="data-row">

        <span class="data-name">
          📈 Máxima
        </span>

        <span class="data-value">
          ${Math.round(max)} °C
        </span>

      </div>


      <div class="data-row">

        <span class="data-name">
          📉 Mínima
        </span>

        <span class="data-value">
          ${Math.round(min)} °C
        </span>

      </div>


      <div class="data-row">

        <span class="data-name">
          💨 Viento
        </span>

        <span class="data-value">
          ${Math.round(actual.wind_speed_10m)} km/h
        </span>

      </div>

    `;

  } catch (error) {

    console.error(error);

    contenedor.innerHTML = `
      <div class="loading">
        ⚠️ Clima temporalmente no disponible.
      </div>
    `;

  }

}


// ======================================
// UTILIDADES
// ======================================

function formatear(valor) {

  if (
    valor === undefined ||
    valor === null
  ) {
    return "--";
  }

  return Number(valor).toLocaleString(
    "es-AR"
  );

}


function escapar(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    String(texto);

  return div.innerHTML;

}


// ======================================
// INICIO
// ======================================

cargarNoticias();
cargarDolar();
cargarClima();


// Actualización automática
// Noticias: cada 5 minutos
// Dólar: cada 5 minutos
// Clima: cada 10 minutos

setInterval(
  cargarNoticias,
  5 * 60 * 1000
);

setInterval(
  cargarDolar,
  5 * 60 * 1000
);

setInterval(
  cargarClima,
  10 * 60 * 1000
);
