/* =====================================================
   ARENA 24
   SISTEMA AUTOMÁTICO DE RADIO + NOTICIAS + DÓLAR + CLIMA
   ===================================================== */


/* ================= RADIO ================= */

const playButton = document.getElementById("play");
const audio = document.getElementById("audio");
const status = document.getElementById("status");

playButton.addEventListener("click", async () => {

  try {

    if (audio.paused) {

      await audio.play();

      playButton.textContent = "⏸ PAUSAR RADIO";
      status.textContent = "● ARENA 24 · REPRODUCIENDO";

    } else {

      audio.pause();

      playButton.textContent = "▶ ESCUCHAR EN VIVO";
      status.textContent = "● ARENA 24 · EN VIVO";

    }

  } catch (error) {

    status.textContent =
      "● Tocá nuevamente para iniciar el streaming";

  }

});


audio.addEventListener("waiting", () => {
  status.textContent = "● ARENA 24 · CONECTANDO...";
});


audio.addEventListener("playing", () => {
  status.textContent = "● ARENA 24 · EN VIVO";
});


/* ================= FECHA ================= */

document.getElementById("year").textContent =
  new Date().getFullYear();


/* =====================================================
   NOTICIAS RSS
   =====================================================

   Usamos Google News RSS + AllOrigins para permitir
   que GitHub Pages pueda consultar los titulares.

   Las búsquedas están orientadas a:
   - La Rioja
   - Policiales
   - Deportes
*/


const RSS_PROXY =
  "https://api.allorigins.win/raw?url=";


const RSS_BASE =
  "https://news.google.com/rss/search?q=";


const RSS_PARAMS =
  "&hl=es-419&gl=AR&ceid=AR:es-419";


/* ================= ESCAPAR HTML ================= */

function escapeHTML(text){

  if (!text) return "";

  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


/* ================= FECHA ================= */

function formatDate(date){

  if(!date) return "";

  const d = new Date(date);

  if(isNaN(d)) return "";

  return d.toLocaleString(
    "es-AR",
    {
      day:"2-digit",
      month:"2-digit",
      hour:"2-digit",
      minute:"2-digit"
    }
  );

}


/* ================= RSS ================= */

async function getRSS(query){

  const rssUrl =
    RSS_BASE +
    encodeURIComponent(query) +
    RSS_PARAMS;

  const url =
    RSS_PROXY +
    encodeURIComponent(rssUrl);

  const response =
    await fetch(url, {
      cache:"no-store"
    });

  if(!response.ok){
    throw new Error("No se pudo obtener RSS");
  }

  const text =
    await response.text();

  const parser =
    new DOMParser();

  const xml =
    parser.parseFromString(text,"text/xml");

  const items =
    [...xml.querySelectorAll("item")];

  return items.slice(0,6).map(item => {

    const title =
      item.querySelector("title")?.textContent ||
      "Sin título";

    const link =
      item.querySelector("link")?.textContent ||
      "#";

    const date =
      item.querySelector("pubDate")?.textContent ||
      "";

    const description =
      item.querySelector("description")?.textContent ||
      "";

    const temp =
      document.createElement("div");

    temp.innerHTML =
      description;

    return {

      title:title.trim(),

      link:link.trim(),

      date:date,

      description:
        temp.textContent
          .replace(/\s+/g," ")
          .trim()
          .slice(0,160)

    };

  });

}


/* ================= TARJETAS ================= */

function createNewsCard(article, category){

  return `
    <article class="news-card">

      <div class="news-content">

        <span class="news-tag">
          ${escapeHTML(category)}
        </span>

        <h3>
          ${escapeHTML(article.title)}
        </h3>

        ${
          article.description
          ?
          `<p>${escapeHTML(article.description)}...</p>`
          :
          ""
        }

        <span class="news-date">
          🕐 ${formatDate(article.date)}
        </span>

        ${
          article.link !== "#"
          ?
          `
          <a
            class="news-link"
            href="${article.link}"
            target="_blank"
            rel="noopener">
            LEER NOTICIA →
          </a>
          `
          :
          ""
        }

      </div>

    </article>
  `;

}


/* ================= CARGAR CATEGORIA ================= */

async function loadNews(
  elementId,
  query,
  category,
  updateId
){

  const container =
    document.getElementById(elementId);

  const update =
    document.getElementById(updateId);

  try{

    container.innerHTML =
      `<div class="loading">
        🔄 Actualizando información...
      </div>`;

    const articles =
      await getRSS(query);

    if(!articles.length){

      container.innerHTML =
        `<div class="loading">
          No hay noticias disponibles en este momento.
        </div>`;

      return;

    }

    container.innerHTML =
      articles
        .map(article =>
          createNewsCard(article,category))
        .join("");

    update.textContent =
      new Date().toLocaleTimeString(
        "es-AR",
        {
          hour:"2-digit",
          minute:"2-digit"
        }
      );

  }catch(error){

    console.error(error);

    container.innerHTML =
      `<div class="loading">
        ⚠️ No se pudieron actualizar las noticias.
        Intentaremos nuevamente automáticamente.
      </div>`;

    update.textContent =
      "sin conexión";

  }

}


/* ================= NOTICIAS LA RIOJA ================= */

function loadLocalNews(){

  return loadNews(

    "news-grid",

    "La Rioja Argentina",

    "LA RIOJA",

    "news-update"

  );

}


/* ================= POLICIALES ================= */

function loadPolice(){

  return loadNews(

    "police-grid",

    "policiales La Rioja Argentina",

    "POLICIALES",

    "police-update"

  );

}


/* ================= DEPORTES ================= */

function loadSports(){

  return loadNews(

    "sports-grid",

    "deportes Argentina fútbol",

    "DEPORTES",

    "sports-update"

  );

}


/* =====================================================
   DÓLAR
   =====================================================

   API pública de DolarAPI.
*/


async function loadDollar(){

  try{

    const response =
      await fetch(
        "https://dolarapi.com/v1/dolares",
        {
          cache:"no-store"
        }
      );

    if(!response.ok){
      throw new Error("Dólar no disponible");
    }

    const data =
      await response.json();


    const oficial =
      data.find(
        item => item.casa === "oficial"
      );

    const blue =
      data.find(
        item => item.casa === "blue"
      );

    const mep =
      data.find(
        item => item.casa === "bolsa"
      );


    document.getElementById(
      "dolar-oficial"
    ).textContent =
      oficial
      ?
      "$ " + formatMoney(oficial.venta)
      :
      "$ —";


    document.getElementById(
      "dolar-blue"
    ).textContent =
      blue
      ?
      "$ " + formatMoney(blue.venta)
      :
      "$ —";


    document.getElementById(
      "dolar-mep"
    ).textContent =
      mep
      ?
      "$ " + formatMoney(mep.venta)
      :
      "$ —";


    document.getElementById(
      "dollar-update"
    ).textContent =
      new Date().toLocaleTimeString(
        "es-AR",
        {
          hour:"2-digit",
          minute:"2-digit"
        }
      );


  }catch(error){

    console.error(
      "Error dólar:",
      error
    );

  }

}


function formatMoney(value){

  return Number(value).toLocaleString(
    "es-AR",
    {
      minimumFractionDigits:2,
      maximumFractionDigits:2
    }
  );

}


/* =====================================================
   CLIMA
   =====================================================

   La Rioja Capital:
   Latitud: -29.4131
   Longitud: -66.8563

   Open-Meteo no necesita API key.
*/


async function loadWeather(){

  const latitude = -29.4131;
  const longitude = -66.8563;


  const url =
    "https://api.open-meteo.com/v1/forecast" +

    `?latitude=${latitude}` +

    `&longitude=${longitude}` +

    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +

    "&daily=temperature_2m_max,temperature_2m_min" +

    "&timezone=America%2FArgentina%2FLa_Rioja";


  try{

    const response =
      await fetch(
        url,
        {
          cache:"no-store"
        }
      );

    if(!response.ok){
      throw new Error("Clima no disponible");
    }

    const data =
      await response.json();


    const current =
      data.current;

    const daily =
      data.daily;


    document.getElementById(
      "temperature"
    ).textContent =
      Math.round(current.temperature_2m) + "°";


    document.getElementById(
      "temp-max"
    ).textContent =
      Math.round(daily.temperature_2m_max[0]) + "°";


    document.getElementById(
      "temp-min"
    ).textContent =
      Math.round(daily.temperature_2m_min[0]) + "°";


    document.getElementById(
      "humidity"
    ).textContent =
      current.relative_humidity_2m + "%";


    document.getElementById(
      "wind"
    ).textContent =
      Math.round(current.wind_speed_10m) +
      " km/h";


    const weather =
      weatherDescription(
        current.weather_code
      );


    document.getElementById(
      "weather-icon"
    ).textContent =
      weather.icon;


    document.getElementById(
      "weather-description"
    ).textContent =
      weather.text;


    document.getElementById(
      "weather-update"
    ).textContent =
      new Date().toLocaleTimeString(
        "es-AR",
        {
          hour:"2-digit",
          minute:"2-digit"
        }
      );


  }catch(error){

    console.error(
      "Error clima:",
      error
    );

    document.getElementById(
      "weather-description"
    ).textContent =
      "No se pudo actualizar el clima.";

  }

}


/* ================= CÓDIGOS CLIMA ================= */

function weatherDescription(code){

  if(code === 0){

    return {
      icon:"☀️",
      text:"Despejado"
    };

  }

  if([1,2,3].includes(code)){

    return {
      icon:"🌤️",
      text:"Parcialmente nublado"
    };

  }

  if([45,48].includes(code)){

    return {
      icon:"🌫️",
      text:"Niebla"
    };

  }

  if([51,53,55,56,57].includes(code)){

    return {
      icon:"🌦️",
      text:"Llovizna"
    };

  }

  if([61,63,65,66,67].includes(code)){

    return {
      icon:"🌧️",
      text:"Lluvia"
    };

  }

  if([71,73,75,77].includes(code)){

    return {
      icon:"❄️",
      text:"Nieve"
    };

  }

  if([80,81,82].includes(code)){

    return {
      icon:"🌦️",
      text:"Chaparrones"
    };

  }

  if([95,96,99].includes(code)){

    return {
      icon:"⛈️",
      text:"Tormentas"
    };

  }

  return {

    icon:"🌤️",

    text:"Condiciones variables"

  };

}


/* =====================================================
   INICIALIZAR
   ===================================================== */

async function updateAll(){

  await Promise.allSettled([

    loadLocalNews(),

    loadPolice(),

    loadSports(),

    loadDollar(),

    loadWeather()

  ]);

}


/* ================= PRIMERA CARGA ================= */

updateAll();


/* =====================================================
   ACTUALIZACIÓN AUTOMÁTICA
   =====================================================

   Noticias: cada 10 minutos
   Dólar: cada 5 minutos
   Clima: cada 10 minutos
*/


setInterval(() => {

  loadLocalNews();
  loadPolice();
  loadSports();

}, 10 * 60 * 1000);


setInterval(() => {

  loadDollar();

}, 5 * 60 * 1000);


setInterval(() => {

  loadWeather();

}, 10 * 60 * 1000);


/* ================= FIN ================= */
