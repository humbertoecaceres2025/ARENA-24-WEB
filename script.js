const playButton = document.getElementById("play");
const audio = document.getElementById("audio");
const statusRadio = document.getElementById("status");
const refreshButton = document.getElementById("refresh");

// ================================
// RADIO
// ================================

playButton.addEventListener("click", async () => {

try {

if (audio.paused) {

  await audio.play();

  playButton.textContent = "⏸ PAUSAR RADIO";
  statusRadio.textContent = "● ARENA 24 · REPRODUCIENDO";

} else {

  audio.pause();

  playButton.textContent = "▶ ESCUCHAR EN VIVO";
  statusRadio.textContent = "● ARENA 24 · EN VIVO";

}


} catch (error) {

statusRadio.textContent =
  "● Tocá nuevamente para iniciar el streaming";


}

});

// ================================
// NOTICIAS
// ================================

async function cargarInformacion() {

try {

const respuesta = await fetch(
  "./noticias.json?v=" + Date.now(),
  {
    cache: "no-store"
  }
);

if (!respuesta.ok) {
  throw new Error("No se pudo cargar noticias.json");
}

const datos = await respuesta.json();

renderNoticias(
  datos.noticias || [],
  "news-grid",
  ["LA RIOJA", "ARGENTINA", "MUNDO"]
);

renderNoticias(
  datos.noticias || [],
  "policiales-grid",
  ["POLICIALES"]
);

renderNoticias(
  datos.noticias || [],
  "deportes-grid",
  ["DEPORTES"]
);

renderDolar(datos.dolar);

renderClima(datos.clima);

if (datos.actualizado) {

  const fecha = new Date(datos.actualizado);

  document.getElementById("last-update").textContent =
    "Actualizado " +
    fecha.toLocaleString("es-AR");

}

const flash = document.getElementById("flash-text");

if (datos.noticias && datos.noticias.length > 0) {

  flash.textContent =
    datos.noticias[0].titulo;

}


} catch (error) {

console.error(error);

mostrarError("news-grid", "No se pudieron cargar las noticias.");
mostrarError("policiales-grid", "No se pudieron cargar policiales.");
mostrarError("deportes-grid", "No se pudieron cargar deportes.");
mostrarError("dolar-grid", "No se pudieron cargar cotizaciones.");

document.getElementById("clima-card").innerHTML =
  `<div class="loading">⚠️ No se pudo cargar el clima.</div>`;


}

}

// ================================
// TARJETAS DE NOTICIAS
// ================================

function renderNoticias(noticias, id, categorias) {

const contenedor = document.getElementById(id);

const filtradas = noticias.filter(noticia =>
categorias.includes(
String(noticia.categoria || "").toUpperCase()
)
);

if (!filtradas.length) {

contenedor.innerHTML = `
  <div class="loading">
    No hay información disponible en este momento.
  </div>
`;

return;


}

contenedor.innerHTML = filtradas
.slice(0, 6)
.map(noticia => `

  <article class="news-card">

    <span class="category">
      ${escapeHTML(noticia.categoria)}
    </span>

    <h3>
      ${escapeHTML(noticia.titulo)}
    </h3>

    <p>
      ${escapeHTML(noticia.resumen || "")}
    </p>

    ${
      noticia.url
      ?
      `<a href="${escapeAttribute(noticia.url)}"
          target="_blank"
          rel="noopener">
          Leer noticia →
       </a>`
      :
      ""
    }

  </article>

`)
.join("");


}

// ================================
// DÓLAR
// ================================

function renderDolar(dolar) {

const contenedor = document.getElementById("dolar-grid");

if (!dolar) {

contenedor.innerHTML =
  `<div class="loading">No hay cotizaciones disponibles.</div>`;

return;


}

const mercados = [
["OFICIAL", dolar.oficial],
["BLUE", dolar.blue],
["MEP", dolar.mep]
];

contenedor.innerHTML = mercados
.filter(item => item[1])
.map(([nombre, valor]) => `

  <article class="money-card">

    <h3>💵 Dólar ${nombre}</h3>

    <div class="money-values">

      <div>
        <small>Compra</small>
        <strong>$${formatearNumero(valor.compra)}</strong>
      </div>

      <div>
        <small>Venta</small>
        <strong>$${formatearNumero(valor.venta)}</strong>
      </div>

    </div>

  </article>

`)
.join("");


}

// ================================
// CLIMA
// ================================

function renderClima(clima) {

const contenedor = document.getElementById("clima-card");

if (!clima) {

contenedor.innerHTML =
  `<div class="loading">No hay información meteorológica.</div>`;

return;


}

contenedor.innerHTML = `

<div class="weather-main">

  <div class="weather-icon">
    ${iconoClima(clima.codigo)}
  </div>

  <div>

    <div class="weather-temp">
      ${Math.round(clima.temperatura)}°C
    </div>

    <strong>
      La Rioja Capital
    </strong>

    <div>
      ${descripcionClima(clima.codigo)}
    </div>

  </div>

</div>

<div class="weather-details">

  <div>
    💨 Viento<br>
    <strong>${Math.round(clima.viento)} km/h</strong>
  </div>

  <div>
    💧 Humedad<br>
    <strong>${clima.humedad}%</strong>
  </div>

  <div>
    🌡️ Sensación<br>
    <strong>${Math.round(clima.sensacion)}°C</strong>
  </div>

</div>


`;

}

// ================================
// UTILIDADES
// ================================

function formatearNumero(numero) {

if (numero === null || numero === undefined) {
return "-";
}

return Number(numero).toLocaleString(
"es-AR",
{
minimumFractionDigits: 0,
maximumFractionDigits: 2
}
);

}

function escapeHTML(text) {

const div = document.createElement("div");

div.textContent = text ?? "";

return div.innerHTML;

}

function escapeAttribute(text) {

return String(text)
.replace(/&/g, "&")
.replace(/"/g, """)
.replace(/</g, "<")
.replace(/>/g, ">");

}

function mostrarError(id, texto) {

const elemento = document.getElementById(id);

if (elemento) {

elemento.innerHTML = `
  <div class="loading">
    ⚠️ ${texto}
  </div>
`;


}

}

function descripcionClima(codigo) {

if (codigo === 0) return "Despejado";

if ([1,2,3].includes(codigo))
return "Parcialmente nublado";

if ([45,48].includes(codigo))
return "Niebla";

if ([51,53,55,56,57].includes(codigo))
return "Llovizna";

if ([61,63,65,66,67].includes(codigo))
return "Lluvia";

if ([71,73,75,77].includes(codigo))
return "Nieve";

if ([80,81,82].includes(codigo))
return "Chaparrones";

if ([95,96,99].includes(codigo))
return "Tormentas";

return "Condiciones variables";

}

function iconoClima(codigo) {

if (codigo === 0)
return "☀️";

if ([1,2,3].includes(codigo))
return "⛅";

if ([45,48].includes(codigo))
return "🌫️";

if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(codigo))
return "🌧️";

if ([95,96,99].includes(codigo))
return "⛈️";

return "🌦️";

}

// ================================
// ACTUALIZACIÓN
// ================================

refreshButton.addEventListener(
"click",
cargarInformacion
);

cargarInformacion();

// Comprobar cada 10 minutos
setInterval(
cargarInformacion,
10 * 60 * 1000
);
