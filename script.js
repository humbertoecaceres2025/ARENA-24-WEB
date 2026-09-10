/* =====================================================
   ARENA 24 · RADIO
===================================================== */

const audio = document.getElementById("audio");
const playButton = document.getElementById("play");
const status = document.getElementById("status");


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
        "● ARENA 24 · RADIO EN PAUSA";

    }

  } catch (error) {

    status.textContent =
      "● Tocá nuevamente para iniciar la radio.";

    console.error(error);

  }

});


/* =====================================================
   NOTICIAS
===================================================== */

async function cargarNoticias() {

  try {

    const response =
      await fetch(
        "data/noticias.json?t=" + Date.now()
      );

    if (!response.ok) {
      throw new Error("No se pudo cargar noticias.json");
    }

    const data =
      await response.json();

    const container =
      document.getElementById("news-grid");

    container.innerHTML = "";

    data.noticias
      .slice(0, 12)
      .forEach(noticia => {

        container.innerHTML += crearNoticia(noticia);

      });


    actualizarHora(
      "news-update",
      data.actualizado
    );


    crearTicker(data.noticias);

  } catch (error) {

    console.error(error);

    document.getElementById("news-grid").innerHTML = `
      <div class="loading">
        No se pudieron cargar las noticias.
        Intentá nuevamente en unos minutos.
      </div>
    `;

  }

}


/* =====================================================
   POLICIALES
===================================================== */

async function cargarPoliciales() {

  try {

    const response =
      await fetch(
        "data/policiales.json?t=" + Date.now()
      );

    if (!response.ok) {
      throw new Error("No se pudo cargar policiales.json");
    }

    const data =
      await response.json();

    const container =
      document.getElementById("police-grid");

    container.innerHTML = "";

    data.noticias
      .slice(0, 12)
      .forEach(noticia => {

        container.innerHTML += crearNoticia(noticia);

      });


    actualizarHora(
      "police-update",
      data.actualizado
    );

  } catch (error) {

    console.error(error);

    document.getElementById("police-grid").innerHTML = `
      <div class="loading">
        No se pudieron cargar los policiales.
      </div>
    `;

  }

}


/* =====================================================
   DEPORTES
===================================================== */

async function cargarDeportes() {

  try {

    const response =
      await fetch(
        "data/deportes.json?t=" + Date.now()
      );

    if (!response.ok) {
      throw new Error("No se pudo cargar deportes.json");
    }

    const data =
      await response.json();

    const container =
      document.getElementById("sports-grid");

    container.innerHTML = "";

    data.noticias
      .slice(0, 12)
      .forEach(noticia => {

        container.innerHTML += crearNoticia(noticia);

      });


    actualizarHora(
      "sports-update",
      data.actualizado
    );

  } catch (error) {

    console.error(error);

    document.getElementById("sports-grid").innerHTML = `
      <div class="loading">
        No se pudieron cargar los deportes.
      </div>
    `;

  }

}


/* =====================================================
   TARJETA DE NOTICIA
===================================================== */

function crearNoticia(noticia) {

  const titulo =
    escaparHTML(noticia.titulo || "");

  const resumen =
    escaparHTML(noticia.resumen || "");

  const categoria =
    escaparHTML(noticia.categoria || "ARENA 24");

  const fuente =
    escaparHTML(noticia.fuente || "Fuente");

  const url =
    noticia.url || "#";


  return `

    <article class="news-card">

      <span class="news-category">
        ${categoria}
      </span>

      <h3>
        ${titulo}
      </h3>

      <p>
        ${resumen}
      </p>

      <small>
        Fuente: ${fuente}
      </small>

      <br>

      <a
        href="${url}"
        target="_blank"
        rel="noopener noreferrer">

        LEER NOTA →

      </a>

    </article>

  `;
}


/* =====================================================
   TICKER
===================================================== */

function crearTicker(noticias) {

  const ticker =
    document.getElementById(
      "breaking-track"
    );

  const textos =
    noticias
      .slice(0, 8)
      .map(n => "🔴 " + n.titulo)
      .join("     ·     ");

  ticker.textContent =
    textos || "ARENA 24 · SIEMPRE CON VOS";

}


/* =====================================================
   DÓLAR
===================================================== */

async function cargarDolar() {

  try {

    const response =
      await fetch(
        "https://dolarapi.com/v1/dolares"
      );

    if (!response.ok) {
      throw new Error("API dólar");
    }

    const datos =
      await response.json();


    datos.forEach(dolar => {

      const venta =
        dolar.venta
          ? "$" +
            Number(dolar.venta)
              .toLocaleString("es-AR")
          : "--";


      if (dolar.casa === "oficial") {

        document.getElementById(
          "dolar-oficial"
        ).textContent = venta;

      }


      if (dolar.casa === "blue") {

        document.getElementById(
          "dolar-blue"
        ).textContent = venta;

      }


      if (dolar.casa === "bolsa") {

        document.getElementById(
          "dolar-mep"
        ).textContent = venta;

      }


      if (dolar.casa === "contadoconliqui") {

        document.getElementById(
          "dolar-ccl"
        ).textContent = venta;

      }

    });


    document.getElementById(
      "dolar-update"
    ).textContent =
      "● Actualizado: " +
      new Date().toLocaleTimeString(
        "es-AR"
      );

  } catch (error) {

    console.error(error);

    document.getElementById(
      "dolar-update"
    ).textContent =
      "No se pudo actualizar el dólar.";

  }

}


/* =====================================================
   CLIMA
   LA RIOJA CAPITAL
===================================================== */

async function cargarClima() {

  const latitude = -29.4131;
  const longitude = -66.8568;


  try {

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + latitude +
      "&longitude=" + longitude +
      "&current=temperature_2m,weather_code,wind_speed_10m" +
      "&daily=temperature_2m_max,temperature_2m_min,weather_code" +
      "&forecast_days=5" +
      "&timezone=America%2FArgentina%2FLa_Rioja";


    const response =
      await fetch(url);


    if (!response.ok) {
      throw new Error("API clima");
    }


    const data =
      await response.json();


    const temperatura =
      Math.round(
        data.current.temperature_2m
      );


    document.getElementById(
      "temperature"
    ).textContent =
      temperatura + "°C";


    document.getElementById(
      "weather-description"
    ).textContent =
      descripcionClima(
        data.current.weather_code
      );


    document.getElementById(
      "weather-icon"
    ).textContent =
      iconoClima(
        data.current.weather_code
      );


    const forecast =
      document.getElementById(
        "forecast"
      );


    forecast.innerHTML = "";


    for (
      let i = 0;
      i < data.daily.time.length;
      i++
    ) {

      const fecha =
        new Date(
          data.daily.time[i] +
          "T12:00:00"
        );


      const dia =
        fecha.toLocaleDateString(
          "es-AR",
          {
            weekday: "short"
          }
        );


      const max =
        Math.round(
          data.daily.temperature_2m_max[i]
        );


      const min =
        Math.round(
          data.daily.temperature_2m_min[i]
        );


      forecast.innerHTML += `

        <div class="forecast-day">

          <strong>
            ${dia}
          </strong>

          <span>
            ${iconoClima(
              data.daily.weather_code[i]
            )}
          </span>

          <b>
            ${max}°
          </b>

          <small>
            ${min}°
          </small>

        </div>

      `;

    }


    document.getElementById(
      "weather-update"
    ).textContent =
      "● Actualizado: " +
      new Date().toLocaleTimeString(
        "es-AR"
      );

  } catch (error) {

    console.error(error);

    document.getElementById(
      "weather-description"
    ).textContent =
      "Clima no disponible.";

  }

}


/* =====================================================
   CLIMA · DESCRIPCIÓN
===================================================== */

function descripcionClima(code) {

  if (code === 0)
    return "Despejado";

  if (code <= 3)
    return "Parcialmente nublado";

  if (code <= 48)
    return "Nublado";

  if (code <= 67)
    return "Lluvias";

  if (code <= 77)
    return "Nieve";

  if (code <= 82)
    return "Chaparrones";

  if (code <= 99)
    return "Tormentas";

  return "Variable";
}


/* =====================================================
   CLIMA · ICONOS
===================================================== */

function iconoClima(code) {

  if (code === 0)
    return "☀️";

  if (code <= 3)
    return "🌤️";

  if (code <= 48)
    return "☁️";

  if (code <= 67)
    return "🌧️";

  if (code <= 77)
    return "❄️";

  if (code <= 82)
    return "🌦️";

  if (code <= 99)
    return "⛈️";

  return "🌤️";
}


/* =====================================================
   UTILIDADES
===================================================== */

function actualizarHora(id, fecha) {

  const elemento =
    document.getElementById(id);

  if (!elemento) return;


  const fechaLocal =
    fecha
      ? new Date(fecha)
      : new Date();


  elemento.textContent =
    "● Actualizado: " +
    fechaLocal.toLocaleString(
      "es-AR"
    );

}


function escaparHTML(texto) {

  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =====================================================
   INICIO
===================================================== */

cargarNoticias();
cargarPoliciales();
cargarDeportes();

cargarDolar();
cargarClima();


/*
   Actualización automática
*/


setInterval(
  cargarNoticias,
  15 * 60 * 1000
);


setInterval(
  cargarPoliciales,
  15 * 60 * 1000
);


setInterval(
  cargarDeportes,
  15 * 60 * 1000
);


setInterval(
  cargarDolar,
  10 * 60 * 1000
);


setInterval(
  cargarClima,
  15 * 60 * 1000
);




  
