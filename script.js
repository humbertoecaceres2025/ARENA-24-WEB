/* =====================================================
ARENA 24
SISTEMA PRINCIPAL
===================================================== */

/* AÑO */

document.getElementById("year").textContent =
new Date().getFullYear();

/* =====================================================
MENÚ MÓVIL
===================================================== */

const menuBtn =
document.getElementById("menuBtn");

const mainNav =
document.getElementById("mainNav");

menuBtn.addEventListener("click", () => {

mainNav.classList.toggle("open");

});

document.querySelectorAll("#mainNav a")
.forEach(link => {

link.addEventListener("click", () => {

  mainNav.classList.remove("open");

});


});

/* =====================================================
RADIO
===================================================== */

const play =
document.getElementById("play");

const audio =
document.getElementById("audio");

const status =
document.getElementById("status");

play.addEventListener("click", async () => {

try {

if (audio.paused) {

  await audio.play();

  play.textContent =
    "⏸ PAUSAR RADIO";

  status.textContent =
    "● ARENA 24 · REPRODUCIENDO EN VIVO";

  status.style.color =
    "#59e391";

} else {

  audio.pause();

  play.textContent =
    "▶ ESCUCHAR EN VIVO";

  status.textContent =
    "● ARENA 24 · PAUSADA";

  status.style.color =
    "#f6ce54";

}


} catch (error) {

console.error(error);

status.textContent =
  "● Tocá nuevamente para iniciar la radio.";


}

});

audio.addEventListener("error", () => {

status.textContent =
"● Streaming temporalmente no disponible";

});

/* =====================================================
UTILIDADES
===================================================== */

function escaparHTML(texto) {

if (!texto) return "";

return String(texto)
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll('"', """)
.replaceAll("'", "'");

}

function formatearFecha(fecha) {

try {

return new Date(fecha)
  .toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });


} catch {

return "";


}

}

/* =====================================================
NOTICIAS
===================================================== */

async function cargarNoticias() {

const grid =
document.getElementById("newsGrid");

try {

const respuesta =
  await fetch(
    "data/noticias.json?t=" + Date.now()
  );

if (!respuesta.ok)
  throw new Error("Noticias no disponibles");

const datos =
  await respuesta.json();

if (!datos.noticias?.length)
  throw new Error("Sin noticias");

grid.innerHTML = "";

datos.noticias
  .slice(0, 9)
  .forEach(noticia => {

    const article =
      document.createElement("article");

    article.className =
      "news-card";

    article.innerHTML = `

      <span class="news-category">
        ${escaparHTML(noticia.categoria || "NOTICIAS")}
      </span>

      <h3>
        ${escaparHTML(noticia.titulo)}
      </h3>

      <p>
        ${escaparHTML(noticia.resumen)}
      </p>

      <a
        href="${escaparHTML(noticia.url || "#")}"
        target="_blank"
        rel="noopener noreferrer">

        LEER MÁS →

      </a>

    `;

    grid.appendChild(article);

  });


document.getElementById("newsUpdate")
  .textContent =
  "● Actualizado: " +
  formatearFecha(datos.actualizado);

actualizarTicker(datos.noticias);


} catch (error) {

console.error(error);

grid.innerHTML = `
  <article class="news-card">
    <span class="news-category">
      ARENA 24
    </span>

    <h3>
      Información en actualización
    </h3>

    <p>
      El sistema está intentando obtener
      las últimas noticias.
    </p>
  </article>
`;


}

}

/* =====================================================
POLICIALES
===================================================== */

async function cargarPoliciales() {

const grid =
document.getElementById("policeGrid");

try {

const respuesta =
  await fetch(
    "data/policiales.json?t=" + Date.now()
  );

if (!respuesta.ok)
  throw new Error("Policiales no disponibles");

const datos =
  await respuesta.json();

grid.innerHTML = "";

datos.noticias
  .slice(0, 9)
  .forEach(noticia => {

    const article =
      document.createElement("article");

    article.className =
      "news-card";

    article.innerHTML = `

      <span class="news-category">
        🚔 ${escaparHTML(noticia.categoria || "POLICIALES")}
      </span>

      <h3>
        ${escaparHTML(noticia.titulo)}
      </h3>

      <p>
        ${escaparHTML(noticia.resumen)}
      </p>

      <a
        href="${escaparHTML(noticia.url || "#")}"
        target="_blank"
        rel="noopener noreferrer">

        LEER MÁS →

      </a>

    `;

    grid.appendChild(article);

  });


document.getElementById("policeUpdate")
  .textContent =
  "● Actualizado: " +
  formatearFecha(datos.actualizado);


} catch (error) {

console.error(error);

grid.innerHTML =
  `<article class="news-card">
    <h3>Policiales</h3>
    <p>Información en actualización.</p>
  </article>`;


}

}

/* =====================================================
DEPORTES
===================================================== */

async function cargarDeportes() {

const grid =
document.getElementById("sportsGrid");

try {

const respuesta =
  await fetch(
    "data/deportes.json?t=" + Date.now()
  );

if (!respuesta.ok)
  throw new Error("Deportes no disponibles");

const datos =
  await respuesta.json();

grid.innerHTML = "";

datos.noticias
  .slice(0, 9)
  .forEach(noticia => {

    const article =
      document.createElement("article");

    article.className =
      "news-card";

    article.innerHTML = `

      <span class="news-category">
        ⚽ ${escaparHTML(noticia.categoria || "DEPORTES")}
      </span>

      <h3>
        ${escaparHTML(noticia.titulo)}
      </h3>

      <p>
        ${escaparHTML(noticia.resumen)}
      </p>

      <a
        href="${escaparHTML(noticia.url || "#")}"
        target="_blank"
        rel="noopener noreferrer">

        LEER MÁS →

      </a>

    `;

    grid.appendChild(article);

  });


document.getElementById("sportsUpdate")
  .textContent =
  "● Actualizado: " +
  formatearFecha(datos.actualizado);


} catch (error) {

console.error(error);

grid.innerHTML =
  `<article class="news-card">
    <h3>Deportes</h3>
    <p>Información en actualización.</p>
  </article>`;


}

}

/* =====================================================
TICKER
===================================================== */

function actualizarTicker(noticias) {

if (!noticias?.length) return;

const titulares =
noticias
.slice(0, 5)
.map(n => n.titulo)
.join(" • ");

document.getElementById("tickerText")
.textContent =
titulares;

}

/* =====================================================
DÓLAR
===================================================== */

function dinero(valor) {

if (
valor === null ||
valor === undefined ||
isNaN(valor)
) {

return "--";


}

return "$" +
Number(valor)
.toLocaleString("es-AR", {
minimumFractionDigits: 0,
maximumFractionDigits: 2
});

}

async function cargarDolar() {

const mercados = {

oficial: "dolarOficial",
blue: "dolarBlue",
bolsa: "dolarMep",
contadoconliqui: "dolarCcl"


};

try {

const respuesta =
  await fetch(
    "https://dolarapi.com/v1/dolares",
    {
      cache: "no-store"
    }
  );

if (!respuesta.ok)
  throw new Error("Dólar no disponible");

const datos =
  await respuesta.json();


datos.forEach(dolar => {

  const id =
    mercados[dolar.casa];

  if (!id) return;


  const venta =
    document.getElementById(id);

  const compra =
    document.getElementById(
      id + "Compra"
    );


  if (venta) {

    venta.textContent =
      dinero(dolar.venta);

  }


  if (compra) {

    compra.textContent =
      "Compra " +
      dinero(dolar.compra);

  }

});


document.getElementById("dolarUpdate")
  .textContent =
  "● Cotización actualizada: " +
  new Date().toLocaleTimeString(
    "es-AR",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );


} catch (error) {

console.error(error);

document.getElementById("dolarUpdate")
  .textContent =
  "No se pudo actualizar la cotización.";


}

}

/* =====================================================
CLIMA
LA RIOJA CAPITAL
===================================================== */

const LATITUD =
-29.4131;

const LONGITUD =
-66.8568;

function descripcionClima(code) {

if (code === 0)
return "Despejado";

if (code <= 3)
return "Parcialmente nublado";

if (code <= 48)
return "Nublado";

if (code <= 57)
return "Llovizna";

if (code <= 67)
return "Lluvia";

if (code <= 77)
return "Nieve";

if (code <= 82)
return "Chaparrones";

if (code <= 99)
return "Tormentas";

return "Variable";

}

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

async function cargarClima() {

try {

const url =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${LATITUD}` +
  `&longitude=${LONGITUD}` +
  "&current=temperature_2m,weather_code,wind_speed_10m" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
  "&forecast_days=5" +
  "&timezone=America%2FArgentina%2FLa_Rioja";


const respuesta =
  await fetch(url, {
    cache: "no-store"
  });


if (!respuesta.ok)
  throw new Error("Clima no disponible");


const datos =
  await respuesta.json();


const actual =
  datos.current;


document.getElementById("temperature")
  .textContent =
  Math.round(actual.temperature_2m) +
  "°C";


document.getElementById("weatherDescription")
  .textContent =
  descripcionClima(
    actual.weather_code
  );


document.getElementById("weatherIcon")
  .textContent =
  iconoClima(
    actual.weather_code
  );


document.getElementById("wind")
  .textContent =
  "Viento: " +
  Math.round(actual.wind_speed_10m) +
  " km/h";


const forecast =
  document.getElementById("forecast");


forecast.innerHTML = "";


for (
  let i = 0;
  i < datos.daily.time.length;
  i++
) {

  const fecha =
    new Date(
      datos.daily.time[i] +
      "T12:00:00"
    );


  const dia =
    fecha.toLocaleDateString(
      "es-AR",
      {
        weekday: "short"
      }
    );


  forecast.innerHTML += `

    <div class="forecast-day">

      <strong>
        ${dia}
      </strong>

      <span>
        ${iconoClima(
          datos.daily.weather_code[i]
        )}
      </span>

      <b>
        ${Math.round(
          datos.daily.temperature_2m_max[i]
        )}°
      </b>

      <small>
        ${Math.round(
          datos.daily.temperature_2m_min[i]
        )}°
      </small>

    </div>

  `;

}


document.getElementById("weatherUpdate")
  .textContent =
  "● Actualizado: " +
  new Date().toLocaleTimeString(
    "es-AR",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );


} catch (error) {

console.error(error);

document.getElementById(
  "weatherDescription"
).textContent =
  "No disponible";


}

}

/* =====================================================
ARRANQUE
===================================================== */

cargarNoticias();

cargarPoliciales();

cargarDeportes();

cargarDolar();

cargarClima();

/* =====================================================
ACTUALIZACIONES AUTOMÁTICAS
===================================================== */

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
