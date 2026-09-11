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


/* =========================================================
   ARENA 24
   SCRIPT PRINCIPAL
   Versión: definitiva
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const ARENA24_CONFIG = {

  // Archivo generado por GitHub Actions
  newsUrl: "./noticias.json",

  // Cada cuánto volver a consultar noticias
  newsRefreshMs: 5 * 60 * 1000,

  // Cantidad inicial de noticias
  initialNews: 6,

  // Cantidad que se agrega con "Ver más"
  moreNews: 3,

  // Video principal de YouTube
  youtubeVideo:
    "https://www.youtube.com/embed/fdHhyBCjhGQ",

  // Canal oficial
  youtubeChannel:
    "https://www.youtube.com/@ARENA24LARIOJA"

};


/* =========================================================
   ESTADO GLOBAL
========================================================= */

const ARENA24_STATE = {

  news: [],

  visibleNews: ARENA24_CONFIG.initialNews,

  loading: false,

  lastUpdate: null,

  error: false

};


/* =========================================================
   UTILIDADES DOM
========================================================= */

function $(selector) {

  return document.querySelector(selector);

}


function $all(selector) {

  return document.querySelectorAll(selector);

}


/* =========================================================
   ESCAPE HTML
   Evita insertar contenido HTML proveniente del JSON.
========================================================= */

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


/* =========================================================
   URL SEGURA
========================================================= */

function safeURL(value, fallback = "#") {

  if (!value) {
    return fallback;
  }

  try {

    const url = new URL(value, window.location.href);

    if (
      url.protocol === "http:" ||
      url.protocol === "https:"
    ) {

      return url.href;

    }

  } catch (error) {

    console.warn(
      "URL inválida:",
      value
    );

  }

  return fallback;

}


/* =========================================================
   FECHA
========================================================= */

function formatDate(dateValue) {

  if (!dateValue) {
    return "Actualidad";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);

}


/* =========================================================
   TIEMPO RELATIVO
========================================================= */

function timeAgo(dateValue) {

  if (!dateValue) {
    return "Actualidad";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Actualidad";
  }

  const seconds =
    Math.floor(
      (Date.now() - date.getTime()) / 1000
    );

  if (seconds < 60) {
    return "Hace unos segundos";
  }

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {

    return (
      "Hace " +
      minutes +
      (minutes === 1 ? " minuto" : " minutos")
    );

  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {

    return (
      "Hace " +
      hours +
      (hours === 1 ? " hora" : " horas")
    );

  }

  const days =
    Math.floor(hours / 24);

  if (days < 7) {

    return (
      "Hace " +
      days +
      (days === 1 ? " día" : " días")
    );

  }

  return formatDate(dateValue);

}


/* =========================================================
   TEXTO
========================================================= */

function cleanText(value, fallback = "") {

  if (
    value === null ||
    value === undefined
  ) {

    return fallback;

  }

  return String(value)
    .replace(/\s+/g, " ")
    .trim();

}


/* =========================================================
   NORMALIZAR NOTICIA
========================================================= */

function normalizeNews(item, index) {

  if (!item || typeof item !== "object") {
    return null;
  }

  const title = cleanText(
    item.title ||
    item.titulo ||
    item.name
  );

  if (!title) {
    return null;
  }

  const description = cleanText(
    item.description ||
    item.descripcion ||
    item.summary ||
    item.resumen ||
    ""
  );

  const image = safeURL(
    item.image ||
    item.imagen ||
    item.image_url ||
    item.thumbnail ||
    item.urlToImage ||
    "",
    ""
  );

  const link = safeURL(
    item.link ||
    item.url ||
    item.enlace ||
    "#",
    "#"
  );

  const category = cleanText(
    item.category ||
    item.categoria ||
    item.section ||
    item.seccion ||
    "ACTUALIDAD"
  );

  const source = cleanText(
    item.source ||
    item.fuente ||
    item.author ||
    "ARENA 24"
  );

  const date =
    item.date ||
    item.fecha ||
    item.publishedAt ||
    item.published_at ||
    item.pubDate ||
    "";

  return {

    id:
      item.id ||
      item.guid ||
      `${index}-${title}`,

    title,

    description,

    image,

    link,

    category,

    source,

    date

  };

}


/* =========================================================
   VALIDAR JSON
========================================================= */

function extractNews(data) {

  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const possibleKeys = [

    "news",
    "noticias",
    "articles",
    "items",
    "results",
    "data"

  ];

  for (const key of possibleKeys) {

    if (Array.isArray(data[key])) {
      return data[key];
    }

  }

  return [];

}


/* =========================================================
   CARGAR NOTICIAS
========================================================= */

async function loadNews(options = {}) {

  const {

    showLoading = true,
    retry = 0

  } = options;

  if (ARENA24_STATE.loading) {
    return;
  }

  ARENA24_STATE.loading = true;

  if (showLoading && ARENA24_STATE.news.length === 0) {

    showNewsLoading();

  }

  updateNewsStatus(
    "Actualizando información..."
  );

  try {

    const cacheBust =
      `?t=${Date.now()}`;

    const response =
      await fetch(
        ARENA24_CONFIG.newsUrl + cacheBust,
        {
          method: "GET",

          cache: "no-store",

          headers: {
            "Accept":
              "application/json"
          }
        }
      );

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }

    const data =
      await response.json();

    const rawNews =
      extractNews(data);

    const normalized =
      rawNews
        .map(normalizeNews)
        .filter(Boolean);

    if (!normalized.length) {

      throw new Error(
        "El archivo noticias.json no contiene noticias válidas."
      );

    }

    ARENA24_STATE.news =
      removeDuplicates(normalized);

    ARENA24_STATE.error = false;

    ARENA24_STATE.lastUpdate =
      new Date();

    ARENA24_STATE.visibleNews =
      Math.min(
        ARENA24_CONFIG.initialNews,
        ARENA24_STATE.news.length
      );

    renderNews();

    updateNewsStatus(
      "Actualizado " +
      new Intl.DateTimeFormat(
        "es-AR",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      ).format(
        ARENA24_STATE.lastUpdate
      )
    );

    hideNewsError();

  } catch (error) {

    console.error(
      "ARENA 24 - Error cargando noticias:",
      error
    );

    ARENA24_STATE.error = true;

    /*
      Si ya había noticias cargadas,
      NO las borramos.
    */

    if (ARENA24_STATE.news.length) {

      updateNewsStatus(
        "No se pudo actualizar. Mostrando última información disponible."
      );

      showNewsError(false);

    } else {

      showNewsError(true);

    }

    /*
      Reintento automático.
    */

    if (retry < 2) {

      setTimeout(
        () => {

          ARENA24_STATE.loading = false;

          loadNews({
            showLoading: false,
            retry: retry + 1
          });

        },
        4000
      );

      return;

    }

  } finally {

    ARENA24_STATE.loading = false;

  }

}


/* =========================================================
   ELIMINAR DUPLICADOS
========================================================= */

function removeDuplicates(news) {

  const seen = new Set();

  return news.filter(item => {

    const key =
      item.link !== "#"
        ? item.link
        : item.title.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;

  });

}


/* =========================================================
   LOADING
========================================================= */

function showNewsLoading() {

  const grid =
    $("#news-grid");

  if (!grid) {
    return;
  }

  grid.innerHTML = `

    <article class="news-loading">
      <div class="news-loading-image"></div>
      <div class="news-loading-line"></div>
      <div class="news-loading-line short"></div>
      <div class="news-loading-line tiny"></div>
    </article>

    <article class="news-loading">
      <div class="news-loading-image"></div>
      <div class="news-loading-line"></div>
      <div class="news-loading-line short"></div>
      <div class="news-loading-line tiny"></div>
    </article>

    <article class="news-loading">
      <div class="news-loading-image"></div>
      <div class="news-loading-line"></div>
      <div class="news-loading-line short"></div>
      <div class="news-loading-line tiny"></div>
    </article>

  `;

}


/* =========================================================
   RENDERIZAR NOTICIAS
========================================================= */

function renderNews() {

  if (!ARENA24_STATE.news.length) {
    return;
  }

  renderFeaturedNews();

  renderNewsGrid();

  updateLoadMoreButton();

}


/* =========================================================
   NOTICIA DESTACADA
========================================================= */

function renderFeaturedNews() {

  const news =
    ARENA24_STATE.news[0];

  if (!news) {
    return;
  }

  const title =
    $("#featured-news-title");

  const description =
    $("#featured-news-description");

  const source =
    $("#featured-news-source");

  const time =
    $("#featured-news-time");

  const link =
    $("#featured-news-link");

  const image =
    $("#featured-news-img");


  if (title) {

    title.textContent =
      news.title;

  }


  if (description) {

    description.textContent =
      news.description ||
      "Toda la información en ARENA 24.";

  }


  if (source) {

    source.textContent =
      news.source;

  }


  if (time) {

    time.textContent =
      timeAgo(news.date);

    if (news.date) {

      time.title =
        formatDate(news.date);

    }

  }


  if (link) {

    link.href =
      safeURL(news.link);

    if (news.link !== "#") {

      link.target = "_blank";

    }

  }


  if (image) {

    if (news.image) {

      image.src =
        news.image;

      image.alt =
        news.title;

      image.onerror =
        function () {

          this.style.display =
            "none";

        };

    } else {

      image.removeAttribute("src");

      image.alt =
        "";

    }

  }

}


/* =========================================================
   GRID
========================================================= */

function renderNewsGrid() {

  const grid =
    $("#news-grid");

  if (!grid) {
    return;
  }

  /*
    La primera noticia se utiliza
    como destacada.
  */

  const items =
    ARENA24_STATE.news
      .slice(
        1,
        ARENA24_STATE.visibleNews
      );

  if (!items.length) {

    grid.innerHTML = `
      <div class="news-empty">
        No hay más noticias disponibles.
      </div>
    `;

    return;

  }

  grid.innerHTML =
    items
      .map(
        (news, index) =>
          createNewsCard(
            news,
            index
          )
      )
      .join("");

}


/* =========================================================
   TARJETA
========================================================= */

function createNewsCard(news, index) {

  const imageHTML =
    news.image
      ? `
        <img
          src="${escapeHTML(news.image)}"
          alt="${escapeHTML(news.title)}"
          loading="lazy"
          onerror="this.style.display='none'"
        >
      `
      : `
        <div
          class="news-card-placeholder"
          aria-hidden="true"
        >
          ARENA <strong>24</strong>
        </div>
      `;

  const link =
    safeURL(news.link);


  return `

    <article
      class="news-card"
      data-news-index="${index}"
    >

      <div class="news-card-image">

        ${imageHTML}

      </div>


      <div class="news-card-body">

        <div class="news-card-category">

          ${escapeHTML(
            news.category
          )}

        </div>


        <h3>

          ${escapeHTML(
            news.title
          )}

        </h3>


        ${
          news.description
            ? `
              <p>
                ${escapeHTML(
                  truncate(
                    news.description,
                    145
                  )
                )}
              </p>
            `
            : ""
        }


        <div class="news-card-footer">

          <span
            class="news-card-time"
            title="${escapeHTML(
              formatDate(news.date)
            )}"
          >

            ${escapeHTML(
              timeAgo(news.date)
            )}

          </span>


          <a
            class="news-card-link"
            href="${escapeHTML(link)}"
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


/* =========================================================
   TRUNCAR TEXTO
========================================================= */

function truncate(text, maxLength) {

  const value =
    cleanText(text);

  if (
    value.length <= maxLength
  ) {

    return value;

  }

  return (
    value
      .slice(0, maxLength)
      .trimEnd() +
    "..."
  );

}


/* =========================================================
   BOTÓN VER MÁS
========================================================= */

function updateLoadMoreButton() {

  const button =
    $("#load-more-news");

  if (!button) {
    return;
  }

  const available =
    ARENA24_STATE.news.length - 1;

  const visible =
    ARENA24_STATE.visibleNews - 1;

  if (visible >= available) {

    button.style.display =
      "none";

    return;

  }

  button.style.display =
    "inline-flex";

  button.innerHTML =
    `
      VER MÁS NOTICIAS
      <span>→</span>
    `;

}


/* =========================================================
   VER MÁS
========================================================= */

function loadMoreNews() {

  ARENA24_STATE.visibleNews =
    Math.min(
      ARENA24_STATE.visibleNews +
        ARENA24_CONFIG.moreNews,

      ARENA24_STATE.news.length
    );

  renderNewsGrid();

  updateLoadMoreButton();

}


/* =========================================================
   ESTADO
========================================================= */

function updateNewsStatus(message) {

  const element =
    $("#news-update-status");

  if (!element) {
    return;
  }

  element.textContent =
    message;

}


/* =========================================================
   ERROR
========================================================= */

function showNewsError(showRetry = true) {

  const error =
    $("#news-error");

  if (!error) {
    return;
  }

  error.hidden = false;

  const button =
    $("#news-retry");

  if (button) {

    button.style.display =
      showRetry
        ? "inline-block"
        : "none";

  }

}


/* =========================================================
   OCULTAR ERROR
========================================================= */

function hideNewsError() {

  const error =
    $("#news-error");

  if (!error) {
    return;
  }

  error.hidden = true;

}


/* =========================================================
   REINTENTAR
========================================================= */

function retryNews() {

  ARENA24_STATE.loading =
    false;

  loadNews({
    showLoading:
      ARENA24_STATE.news.length === 0
  });

}


/* =========================================================
   ACTUALIZACIÓN AUTOMÁTICA
========================================================= */

function startNewsAutoRefresh() {

  setInterval(
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        loadNews({
          showLoading: false
        });

      }

    },
    ARENA24_CONFIG.newsRefreshMs
  );

}


/* =========================================================
   YOUTUBE
========================================================= */

function setupYouTube() {

  const iframe =
    document.querySelector(
      "#youtube-player"
    );

  if (
    iframe &&
    !iframe.src
  ) {

    iframe.src =
      ARENA24_CONFIG.youtubeVideo;

  }


  /*
    Si existe algún elemento
    con data-youtube-channel,
    se conecta automáticamente.
  */

  $all(
    "[data-youtube-channel]"
  ).forEach(element => {

    element.href =
      ARENA24_CONFIG.youtubeChannel;

    element.target =
      "_blank";

    element.rel =
      "noopener noreferrer";

  });

}


/* =========================================================
   LINKS DE YOUTUBE
========================================================= */

function setupYouTubeLinks() {

  const youtubeLinks =
    $all(
      'a[href*="youtube.com"]'
    );

  youtubeLinks.forEach(link => {

    /*
      Si el enlace estaba vacío,
      lo llevamos al canal oficial.
    */

    const href =
      link.getAttribute("href");

    if (
      !href ||
      href === "#" ||
      href === "https://youtube.com"
    ) {

      link.href =
        ARENA24_CONFIG.youtubeChannel;

    }

    link.target =
      "_blank";

    link.rel =
      "noopener noreferrer";

  });

}


/* =========================================================
   NAVEGACIÓN SUAVE
========================================================= */

function setupSmoothNavigation() {

  $all(
    'a[href^="#"]'
  ).forEach(link => {

    link.addEventListener(
      "click",
      function(event) {

        const targetID =
          this.getAttribute("href");

        if (
          !targetID ||
          targetID === "#"
        ) {

          return;

        }

        const target =
          document.querySelector(
            targetID
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });

}


/* =========================================================
   BOTÓN MENÚ
========================================================= */

function setupMenu() {

  const toggle =
    document.querySelector(
      ".menu-toggle"
    );

  const nav =
    document.querySelector(
      ".main-nav"
    );

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener(
    "click",
    () => {

      nav.classList.toggle(
        "active"
      );

      toggle.classList.toggle(
        "active"
      );

    }
  );


  $all(
    ".main-nav a"
  ).forEach(link => {

    link.addEventListener(
      "click",
      () => {

        nav.classList.remove(
          "active"
        );

        toggle.classList.remove(
          "active"
        );

      }
    );

  });

}


/* =========================================================
   FECHA / HORA
========================================================= */

function updateClock() {

  const elements =
    $all(
      "[data-live-clock]"
    );

  if (!elements.length) {
    return;
  }

  const now =
    new Date();

  const time =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    ).format(now);

  elements.forEach(
    element => {

      element.textContent =
        time;

    }
  );

}


function startClock() {

  updateClock();

  setInterval(
    updateClock,
    1000
  );

}


/* =========================================================
   AÑO AUTOMÁTICO
========================================================= */

function setupYear() {

  const year =
    new Date()
      .getFullYear();

  $all(
    "[data-current-year]"
  ).forEach(
    element => {

      element.textContent =
        year;

    }
  );

}


/* =========================================================
   RADIO
========================================================= */

function setupRadio() {

  const buttons =
    $all(
      "[data-radio-play]"
    );

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        /*
          No se inventa una URL de streaming.
          Si ya existe un reproductor de radio
          en la página, se intenta activar.
        */

        const radio =
          document.querySelector(
            "audio[data-radio]"
          );

        if (!radio) {

          console.warn(
            "ARENA 24: no se encontró el reproductor de radio."
          );

          return;

        }

        if (
          radio.paused
        ) {

          radio.play()
            .catch(
              error => {

                console.warn(
                  "El navegador bloqueó la reproducción automática:",
                  error
                );

              }
            );

          button.classList.add(
            "playing"
          );

        } else {

          radio.pause();

          button.classList.remove(
            "playing"
          );

        }

      }
    );

  });

}


/* =========================================================
   SCROLL HEADER
========================================================= */

function setupHeaderScroll() {

  const header =
    document.querySelector(
      "header"
    );

  if (!header) {
    return;
  }

  const update =
    () => {

      if (
        window.scrollY > 20
      ) {

        header.classList.add(
          "scrolled"
        );

      } else {

        header.classList.remove(
          "scrolled"
        );

      }

    };

  update();

  window.addEventListener(
    "scroll",
    update,
    {
      passive: true
    }
  );

}


/* =========================================================
   LAZY IMAGES
========================================================= */

function setupLazyImages() {

  const images =
    $all(
      "img[data-src]"
    );

  if (!images.length) {
    return;
  }


  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }

              const img =
                entry.target;

              const src =
                img.dataset.src;

              if (src) {

                img.src =
                  src;

              }

              img.removeAttribute(
                "data-src"
              );

              observer.unobserve(
                img
              );

            }
          );

        },
        {
          rootMargin:
            "200px"
        }
      );


    images.forEach(
      img => {

        observer.observe(
          img
        );

      }
    );

  } else {

    images.forEach(
      img => {

        img.src =
          img.dataset.src;

      }
    );

  }

}


/* =========================================================
   EVENTOS DE NOTICIAS
========================================================= */

function setupNewsEvents() {

  const moreButton =
    $("#load-more-news");

  if (moreButton) {

    moreButton.addEventListener(
      "click",
      loadMoreNews
    );

  }


  const retryButton =
    $("#news-retry");

  if (retryButton) {

    retryButton.addEventListener(
      "click",
      retryNews
    );

  }

}


/* =========================================================
   VISIBILIDAD DE PÁGINA
========================================================= */

function setupVisibilityRefresh() {

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        /*
          Si volvemos a la página,
          comprobamos las noticias.
        */

        loadNews({
          showLoading: false
        });

      }

    }
  );

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

async function initArena24() {

  console.log(
    "ARENA 24 iniciado."
  );


  setupYear();

  startClock();

  setupMenu();

  setupHeaderScroll();

  setupSmoothNavigation();

  setupYouTube();

  setupYouTubeLinks();

  setupRadio();

  setupLazyImages();

  setupNewsEvents();

  setupVisibilityRefresh();


  /*
    Noticias
  */

  await loadNews({
    showLoading: true
  });


  startNewsAutoRefresh();


  console.log(
    "ARENA 24 listo."
  );

}


/* =========================================================
   ARRANQUE
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initArena24
  );

} else {

  initArena24();

}
