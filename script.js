/* =========================================================
   ARENA 24 RADIO WEB 3.2
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CONFIG = {

  stream:
    "https://stream.zeno.fm/zuw6xmmwmd0uv",

  whatsapp:
    "https://web.whatsapp.com/",

  facebook:
    "https://www.facebook.com/arena24radiolarioja",

  instagram:
    "https://www.instagram.com/arena24radio/",

  youtube:
    "https://www.youtube.com/@ARENA24LARIOJA",

  newsRefreshMinutes:
    10

};


/* =========================================================
   PROGRAMACIÓN
   ========================================================= */

const PROGRAMS = [

  {
    start: 0,
    end: 6,

    title:
      "Martina Night & Relax",

    host:
      "Martina",

    description:
      "Música actual, relax y compañía durante la madrugada."

  },

  {
    start: 6,
    end: 10,

    title:
      "ARENA 24 Noticias",

    host:
      "Enrique",

    description:
      "Noticias de La Rioja, Argentina y el mundo para comenzar el día."

  },

  {
    start: 10,
    end: 14,

    title:
      "ARENA 24 Entretenimiento",

    host:
      "Viviana",

    description:
      "Música, actualidad, entretenimiento y compañía."

  },

  {
    start: 14,
    end: 18,

    title:
      "ARENA 24 Deportes",

    host:
      "Nicolás",

    description:
      "Toda la actualidad deportiva y los protagonistas."

  },

  {
    start: 18,
    end: 21,

    title:
      "ARENA 24 Entretenimiento",

    host:
      "Viviana",

    description:
      "La tarde continúa con música y entretenimiento."

  },

  {
    start: 21,
    end: 24,

    title:
      "Martina Night & Relax",

    host:
      "Martina",

    description:
      "Música actual y una noche más tranquila en ARENA 24."

  }

];


/* =========================================================
   ESTADO
   ========================================================= */

let currentProgram = null;

let activeNewsCategory =
  "rioja";

let allNews = [];

let audioStarted = false;


/* =========================================================
   HELPERS
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}


function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function safeURL(url) {

  try {

    const parsed =
      new URL(url, window.location.href);

    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    ) {
      return parsed.href;
    }

  } catch (error) {}

  return "#";
}


function formatHour(hour) {

  return String(hour)
    .padStart(2, "0") + ":00";
}


/* =========================================================
   RADIO
   ========================================================= */

const radioAudio =
  $("#radioAudio");

const playBtn =
  $("#playBtn");

const fixedPlayBtn =
  $("#fixedPlayBtn");

const muteBtn =
  $("#muteBtn");

const fixedMuteBtn =
  $("#fixedMuteBtn");

const volumeControl =
  $("#volumeControl");

const fixedVolumeControl =
  $("#fixedVolumeControl");

const volumeValue =
  $("#volumeValue");

const playerStatus =
  $("#playerStatus");

const fixedStatus =
  $("#fixedStatus");

const equalizer =
  $("#equalizer");


if (radioAudio) {

  radioAudio.src =
    CONFIG.stream;

  radioAudio.volume =
    0.85;
}


/* PLAY */

async function playRadio() {

  if (!radioAudio) {
    return;
  }

  try {

    if (!radioAudio.src) {
      radioAudio.src =
        CONFIG.stream;
    }

    await radioAudio.play();

    audioStarted = true;

    updatePlayerUI(true);

  } catch (error) {

    console.warn(
      "No se pudo iniciar la transmisión:",
      error
    );

    updatePlayerStatus(
      "TOCÁ PLAY PARA ESCUCHAR"
    );

  }
}


/* PAUSE */

function pauseRadio() {

  if (!radioAudio) {
    return;
  }

  radioAudio.pause();

  audioStarted = false;

  updatePlayerUI(false);
}


/* TOGGLE */

function toggleRadio() {

  if (
    radioAudio &&
    !radioAudio.paused
  ) {

    pauseRadio();

  } else {

    playRadio();

  }

}


/* PLAYER UI */

function updatePlayerUI(isPlaying) {

  if (playBtn) {

    playBtn.textContent =
      isPlaying ? "❚❚" : "▶";

  }

  if (fixedPlayBtn) {

    fixedPlayBtn.textContent =
      isPlaying ? "❚❚" : "▶";

  }

  if (equalizer) {

    equalizer.classList.toggle(
      "active",
      isPlaying
    );

  }

  updatePlayerStatus(
    isPlaying
      ? "TRANSMITIENDO"
      : "SEÑAL LISTA"
  );

}


/* STATUS */

function updatePlayerStatus(text) {

  if (playerStatus) {
    playerStatus.textContent =
      text;
  }

  if (fixedStatus) {
    fixedStatus.textContent =
      text;
  }

}


/* MUTE */

function toggleMute() {

  if (!radioAudio) {
    return;
  }

  radioAudio.muted =
    !radioAudio.muted;

  updateMuteUI();

}


/* MUTE UI */

function updateMuteUI() {

  const icon =
    radioAudio &&
    radioAudio.muted
      ? "🔇"
      : "🔊";

  if (muteBtn) {
    muteBtn.textContent =
      icon;
  }

  if (fixedMuteBtn) {
    fixedMuteBtn.textContent =
      icon;
  }

}


/* VOLUME */

function setVolume(value) {

  if (!radioAudio) {
    return;
  }

  const volume =
    Number(value);

  radioAudio.volume =
    volume;

  radioAudio.muted =
    volume === 0;

  if (volumeControl) {
    volumeControl.value =
      volume;
  }

  if (fixedVolumeControl) {
    fixedVolumeControl.value =
      volume;
  }

  if (volumeValue) {

    volumeValue.textContent =
      Math.round(volume * 100) + "%";

  }

  updateMuteUI();
}


/* EVENTS */

if (playBtn) {

  playBtn.addEventListener(
    "click",
    toggleRadio
  );

}

if (fixedPlayBtn) {

  fixedPlayBtn.addEventListener(
    "click",
    toggleRadio
  );

}

if (muteBtn) {

  muteBtn.addEventListener(
    "click",
    toggleMute
  );

}

if (fixedMuteBtn) {

  fixedMuteBtn.addEventListener(
    "click",
    toggleMute
  );

}

if (volumeControl) {

  volumeControl.addEventListener(
    "input",
    event => {
      setVolume(
        event.target.value
      );
    }
  );

}

if (fixedVolumeControl) {

  fixedVolumeControl.addEventListener(
    "input",
    event => {
      setVolume(
        event.target.value
      );
    }
  );

}


if (radioAudio) {

  radioAudio.addEventListener(
    "playing",
    () => {
      updatePlayerUI(true);
    }
  );

  radioAudio.addEventListener(
    "pause",
    () => {
      updatePlayerUI(false);
    }
  );

  radioAudio.addEventListener(
    "waiting",
    () => {
      updatePlayerStatus(
        "CONECTANDO..."
      );
    }
  );

  radioAudio.addEventListener(
    "error",
    () => {

      updatePlayerStatus(
        "REVISAR SEÑAL"
      );

    }
  );

}


/* =========================================================
   RELOJ
   ========================================================= */

function updateClock() {

  const now =
    new Date();

  const clock =
    $("#currentTime");

  if (!clock) {
    return;
  }

  clock.textContent =
    now.toLocaleTimeString(
      "es-AR",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );

}


updateClock();

setInterval(
  updateClock,
  1000
);


/* =========================================================
   PROGRAMACIÓN DINÁMICA
   ========================================================= */

function getCurrentProgram() {

  const now =
    new Date();

  const hour =
    now.getHours();

  return (
    PROGRAMS.find(
      program =>
        hour >= program.start &&
        hour < program.end
    ) ||
    PROGRAMS[0]
  );

}


function getNextProgram() {

  const current =
    getCurrentProgram();

  const index =
    PROGRAMS.indexOf(current);

  return (
    PROGRAMS[
      (index + 1) %
      PROGRAMS.length
    ]
  );

}


function updateNowPlaying() {

  const program =
    getCurrentProgram();

  const next =
    getNextProgram();

  currentProgram =
    program;


  const nowProgram =
    $("#nowProgram");

  const nowHost =
    $("#nowHost");

  const nowDescription =
    $("#nowDescription");

  const nextProgram =
    $("#nextProgram");

  const nextTime =
    $("#nextTime");

  const fixedProgram =
    $("#fixedProgram");


  if (nowProgram) {
    nowProgram.textContent =
      program.title;
  }

  if (nowHost) {
    nowHost.textContent =
      program.host;
  }

  if (nowDescription) {
    nowDescription.textContent =
      program.description;
  }

  if (nextProgram) {
    nextProgram.textContent =
      next.title;
  }

  if (nextTime) {
    nextTime.textContent =
      formatHour(next.start);
  }

  if (fixedProgram) {
    fixedProgram.textContent =
      program.title;
  }


  renderSchedule();

}


updateNowPlaying();

setInterval(
  updateNowPlaying,
  30000
);


/* =========================================================
   RENDER PROGRAMACIÓN
   ========================================================= */

function renderSchedule() {

  const container =
    $("#scheduleGrid");

  if (!container) {
    return;
  }

  const active =
    getCurrentProgram();

  container.innerHTML =
    PROGRAMS.map(
      program => {

        const isCurrent =
          program === active;

        return `

          <article
            class="schedule-card ${
              isCurrent ? "current" : ""
            }"
          >

            ${
              isCurrent
                ? `
                  <span class="schedule-current">
                    ● AHORA
                  </span>
                `
                : ""
            }

            <div class="schedule-time">
              ${formatHour(program.start)}
              -
              ${formatHour(program.end)}
            </div>

            <h3>
              ${escapeHTML(program.title)}
            </h3>

            <p>
              ${escapeHTML(program.description)}
            </p>

            <span class="schedule-host">
              Con ${escapeHTML(program.host)}
            </span>

          </article>

        `;

      }
    ).join("");

}


renderSchedule();


/* =========================================================
   MENÚ MOBILE
   ========================================================= */

const menuToggle =
  $("#menuToggle");

const mainNav =
  $("#mainNav");


if (menuToggle && mainNav) {

  menuToggle.addEventListener(
    "click",
    () => {

      const opened =
        mainNav.classList.toggle(
          "open"
        );

      menuToggle.setAttribute(
        "aria-expanded",
        String(opened)
      );

      menuToggle.textContent =
        opened ? "×" : "☰";

    }
  );


  $$("#mainNav a").forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "open"
          );

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          menuToggle.textContent =
            "☰";

        }
      );

    }
  );

}


/* =========================================================
   NOTICIAS RSS
   ========================================================= */

/*
  IMPORTANTE:

  GitHub Pages es un hosting estático.
  Por eso esta versión utiliza Google News RSS
  mediante un proxy público para obtener los datos.

  Para una versión 4.0 profesional se recomienda
  utilizar un backend/proxy propio.
*/


const NEWS_CONFIG = {

  rioja:
    "La Rioja Argentina",

  argentina:
    "Argentina",

  mundo:
    "mundo",

  deportes:
    "deportes Argentina"

};


function googleNewsRSS(query) {

  return (
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(query) +
    "&hl=es-419&gl=AR&ceid=AR:es-419"
  );

}


function proxyURL(url) {

  return (
    "https://api.allorigins.win/raw?url=" +
    encodeURIComponent(url)
  );

}


/* LOAD NEWS */

async function loadNews(
  category = activeNewsCategory
) {

  const grid =
    $("#newsGrid");

  const status =
    $("#newsStatus");

  if (!grid) {
    return;
  }

  activeNewsCategory =
    category;

  grid.innerHTML =
    `<div class="news-loading">
      Buscando noticias...
    </div>`;

  if (status) {
    status.textContent =
      "Actualizando información...";
  }


  try {

    const rss =
      googleNewsRSS(
        NEWS_CONFIG[category]
      );

    const response =
      await fetch(
        proxyURL(rss),
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error(
        "Error HTTP " +
        response.status
      );
    }

    const xmlText =
      await response.text();

    const parser =
      new DOMParser();

    const xml =
      parser.parseFromString(
        xmlText,
        "text/xml"
      );

    const items =
      Array.from(
        xml.querySelectorAll("item")
      );


    allNews =
      items
        .slice(0, 12)
        .map(
          item => parseNewsItem(
            item,
            category
          )
        );


    renderNews();


    const updated =
      $("#newsUpdated");

    if (updated) {

      updated.textContent =
        "Actualizado " +
        new Date()
          .toLocaleTimeString(
            "es-AR",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          );

    }

    if (status) {

      status.textContent =
        allNews.length +
        " noticias disponibles";

    }


  } catch (error) {

    console.error(
      "Noticias:",
      error
    );

    grid.innerHTML = `

      <div class="news-empty">

        <strong>
          No pudimos actualizar las noticias.
        </strong>

        <br><br>

        Intentá nuevamente con
        <strong>Actualizar</strong>.

      </div>

    `;

    if (status) {
      status.textContent =
        "No se pudo actualizar";
    }

  }

}


/* PARSE NEWS ITEM */

function parseNewsItem(
  item,
  category
) {

  const title =
    item.querySelector("title")
      ?.textContent
      ?.trim() ||
    "Noticia";

  const link =
    item.querySelector("link")
      ?.textContent
      ?.trim() ||
    "#";

  const description =
    item.querySelector("description")
      ?.textContent
      ?.trim() ||
    "";

  const pubDate =
    item.querySelector("pubDate")
      ?.textContent
      ?.trim() ||
    "";


  let source =
    item.querySelector("source")
      ?.textContent
      ?.trim() ||
    "Google News";


  /*
    Intentamos obtener una imagen
    desde media:content / media:thumbnail.
  */

  let image = "";

  const mediaContent =
    item.querySelector(
      "content"
    );

  const mediaThumbnail =
    item.querySelector(
      "thumbnail"
    );


  if (mediaContent) {

    image =
      mediaContent.getAttribute(
        "url"
      ) || "";

  }

  if (!image && mediaThumbnail) {

    image =
      mediaThumbnail.getAttribute(
        "url"
      ) || "";

  }


  /*
    Google News RSS no garantiza
    imágenes directas.
  */

  const cleanDescription =
    stripHTML(description);


  return {

    title,

    link:

      safeURL(link),

    description:

      cleanDescription
        .slice(0, 170),

    date:

      pubDate,

    source,

    category,

    image

  };

}


/* STRIP HTML */

function stripHTML(html) {

  const temporary =
    document.createElement(
      "div"
    );

  temporary.innerHTML =
    html;

  return (
    temporary.textContent ||
    temporary.innerText ||
    ""
  ).trim();

}


/* =========================================================
   RENDER NEWS
   ========================================================= */

function renderNews() {

  const grid =
    $("#newsGrid");

  if (!grid) {
    return;
  }


  const search =
    ($("#newsSearch")?.value || "")
      .trim()
      .toLowerCase();


  const filtered =
    allNews.filter(
      article => {

        if (!search) {
          return true;
        }

        return (

          article.title
            .toLowerCase()
            .includes(search)

          ||

          article.description
            .toLowerCase()
            .includes(search)

          ||

          article.source
            .toLowerCase()
            .includes(search)

        );

      }
    );


  if (!filtered.length) {

    grid.innerHTML = `

      <div class="news-empty">

        No encontramos noticias
        con esa búsqueda.

      </div>

    `;

    return;

  }


  grid.innerHTML =
    filtered
      .map(
        article =>
          createNewsCard(article)
      )
      .join("");

}


/* NEWS CARD */

function createNewsCard(
  article
) {

  const imageHTML =
    article.image
      ? `

        <img
          src="${safeURL(article.image)}"
          alt=""
          loading="lazy"
          onerror="this.style.display='none';"
        >

      `
      : `

        <div class="news-placeholder">
          📰
        </div>

      `;


  const date =
    formatNewsDate(
      article.date
    );


  return `

    <article class="news-card">

      <div class="news-image">

        ${imageHTML}

        <span class="news-category">
          ${escapeHTML(
            categoryName(
              article.category
            )
          )}
        </span>

      </div>


      <div class="news-content">

        <h3>
          ${escapeHTML(
            article.title
          )}
        </h3>

        <p>
          ${escapeHTML(
            article.description
          )}
        </p>


        <div class="news-footer">

          <span>
            ${escapeHTML(
              article.source
            )}
            ·
            ${escapeHTML(date)}
          </span>

          <a
            href="${safeURL(article.link)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            LEER →
          </a>

        </div>

      </div>

    </article>

  `;

}


/* CATEGORY NAME */

function categoryName(
  category
) {

  const names = {

    rioja:
      "LA RIOJA",

    argentina:
      "ARGENTINA",

    mundo:
      "MUNDO",

    deportes:
      "DEPORTES"

  };

  return (
    names[category] ||
    "NOTICIAS"
  );

}


/* NEWS DATE */

function formatNewsDate(
  value
) {

  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }

  return date.toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit"
    }
  );

}


/* =========================================================
   NEWS TABS
   ========================================================= */

$$(".news-tab").forEach(
  tab => {

    tab.addEventListener(
      "click",
      () => {

        $$(".news-tab").forEach(
          button => {

            button.classList.remove(
              "active"
            );

          }
        );

        tab.classList.add(
          "active"
        );

        const category =
          tab.dataset.category;

        loadNews(category);

      }
    );

  }
);


/* REFRESH */

const refreshNews =
  $("#refreshNews");

if (refreshNews) {

  refreshNews.addEventListener(
    "click",
    () => {

      loadNews(
        activeNewsCategory
      );

    }
  );

}


/* SEARCH */

const newsSearch =
  $("#newsSearch");

if (newsSearch) {

  newsSearch.addEventListener(
    "input",
    renderNews
  );

}


/* INITIAL NEWS */

loadNews(
  activeNewsCategory
);


/* AUTO REFRESH */

setInterval(
  () => {

    loadNews(
      activeNewsCategory
    );

  },
  CONFIG.newsRefreshMinutes *
  60 *
  1000
);


/* =========================================================
   PEDIDO DE CANCIÓN
   ========================================================= */

const musicModal =
  $("#musicModal");

const musicRequestBtn =
  $("#musicRequestBtn");

const closeModal =
  $("#closeModal");

const musicForm =
  $("#musicForm");


function openMusicModal() {

  if (!musicModal) {
    return;
  }

  musicModal.classList.add(
    "open"
  );

  musicModal.setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeMusicModal() {

  if (!musicModal) {
    return;
  }

  musicModal.classList.remove(
    "open"
  );

  musicModal.setAttribute(
    "aria-hidden",
    "true"
  );

}


if (musicRequestBtn) {

  musicRequestBtn.addEventListener(
    "click",
    openMusicModal
  );

}


if (closeModal) {

  closeModal.addEventListener(
    "click",
    closeMusicModal
  );

}


if (musicModal) {

  musicModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        musicModal
      ) {

        closeMusicModal();

      }

    }
  );

}


/* FORM */

if (musicForm) {

  musicForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        $("#requestName")
          ?.value
          ?.trim() || "";

      const artist =
        $("#requestArtist")
          ?.value
          ?.trim() || "";

      const song =
        $("#requestSong")
          ?.value
          ?.trim() || "";


      const message =
        `Hola ARENA 24. Soy ${name}. ` +
        `Quiero pedir la canción "${song}" ` +
        `de ${artist}.`;


      /*
        Como todavía no tenemos el número
        directo de WhatsApp de la radio,
        abrimos WhatsApp Web y copiamos
        el mensaje para que pueda enviarse.
      */

      navigator.clipboard
        ?.writeText(message)
        .catch(
          () => {}
        );


      window.open(
        CONFIG.whatsapp,
        "_blank",
        "noopener,noreferrer"
      );


      closeMusicModal();

      alert(
        "El pedido fue preparado. " +
        "El mensaje fue copiado si tu navegador lo permite."
      );

    }
  );

}


/* =========================================================
   AÑO
   ========================================================= */

const year =
  $("#year");

if (year) {

  year.textContent =
    new Date()
      .getFullYear();

}


/* =========================================================
   INICIO
   ========================================================= */

setVolume(
  0.85
);

updateMuteUI();

console.log(
  "ARENA 24 Radio Web 3.2 iniciada correctamente."
);
