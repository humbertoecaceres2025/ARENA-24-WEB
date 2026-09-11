"use strict";

/*
=========================================================
 ARENA 24
 SCRIPT PRINCIPAL
 RADIO
 Noticias:
   - LA RIOJA
   - NACIONALES
   - DEPORTES
   - POLICIALES

 Fuente:
   noticias.json

 Compatible con:
   actualizar-datos.yml
=========================================================
*/


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const ARENA24 = {

    newsFile: "./noticias.json",

    refreshTime: 5 * 60 * 1000,

    initialNews: 6,

    moreNews: 3,

    youtubeVideo:
        "https://www.youtube.com/embed/fdHhyBCjhGQ",

    youtubeChannel:
        "https://www.youtube.com/@ARENA24LARIOJA"

};


/* =====================================================
   ESTADO
===================================================== */

const STATE = {

    news: [],

    visible: ARENA24.initialNews,

    loading: false,

    lastUpdate: null,

    error: false

};


/* =====================================================
   DOM
===================================================== */

const $ = selector =>
    document.querySelector(selector);


const $$ = selector =>
    document.querySelectorAll(selector);


/* =====================================================
   TEXTO SEGURO
===================================================== */

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(/\s+/g, " ")
        .trim();

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escapeHTML(value) {

    return cleanText(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   URL SEGURA
===================================================== */

function safeURL(value) {

    if (!value) {
        return "#";
    }

    try {

        const url =
            new URL(
                value,
                window.location.href
            );

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

    return "#";

}


/* =====================================================
   FECHA
===================================================== */

function formatDate(value) {

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

        return cleanText(value);

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


/* =====================================================
   TIEMPO RELATIVO
===================================================== */

function timeAgo(value) {

    if (!value) {
        return "Actualidad";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Actualidad";

    }

    const seconds =
        Math.floor(
            (
                Date.now() -
                date.getTime()
            ) / 1000
        );

    if (seconds < 60) {

        return "Hace unos segundos";

    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    if (minutes < 60) {

        return `Hace ${minutes} ${
            minutes === 1
                ? "minuto"
                : "minutos"
        }`;

    }

    const hours =
        Math.floor(
            minutes / 60
        );

    if (hours < 24) {

        return `Hace ${hours} ${
            hours === 1
                ? "hora"
                : "horas"
        }`;

    }

    const days =
        Math.floor(
            hours / 24
        );

    if (days < 7) {

        return `Hace ${days} ${
            days === 1
                ? "día"
                : "días"
        }`;

    }

    return formatDate(value);

}


/* =====================================================
   NORMALIZAR CATEGORÍA
===================================================== */

function normalizeCategory(category) {

    const value =
        cleanText(category)
            .toUpperCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    if (
        value.includes("RIOJA")
    ) {

        return "LA RIOJA";

    }

    if (
        value.includes("NACIONAL")
        ||
        value === "ARGENTINA"
    ) {

        return "NACIONALES";

    }

    if (
        value.includes("DEPORTE")
    ) {

        return "DEPORTES";

    }

    if (
        value.includes("POLICIAL")
    ) {

        return "POLICIALES";

    }

    return "ACTUALIDAD";

}


/* =====================================================
   NORMALIZAR NOTICIA
===================================================== */

function normalizeNews(item, index) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return null;

    }

    const title =
        cleanText(
            item.title ||
            item.titulo
        );

    if (!title) {
        return null;
    }

    return {

        id:
            item.id ||
            item.guid ||
            `${index}-${title}`,

        title,

        description:
            cleanText(
                item.description ||
                item.descripcion ||
                item.summary ||
                item.resumen
            ),

        image:
            safeURL(
                item.image ||
                item.imagen ||
                item.image_url ||
                item.thumbnail ||
                item.urlToImage
            ),

        link:
            safeURL(
                item.link ||
                item.url ||
                item.enlace
            ),

        category:
            normalizeCategory(
                item.category ||
                item.categoria ||
                item.section ||
                item.seccion
            ),

        source:
            cleanText(
                item.source ||
                item.fuente ||
                "ARENA 24"
            ),

        date:
            item.date ||
            item.fecha ||
            item.publishedAt ||
            item.published_at ||
            item.pubDate ||
            ""

    };

}


/* =====================================================
   OBTENER ARRAY DE NOTICIAS
===================================================== */

function extractNews(data) {

    if (
        Array.isArray(data)
    ) {

        return data;

    }

    if (
        !data ||
        typeof data !== "object"
    ) {

        return [];

    }

    const keys = [

        "noticias",
        "news",
        "articles",
        "items",
        "results",
        "data"

    ];

    for (
        const key of keys
    ) {

        if (
            Array.isArray(
                data[key]
            )
        ) {

            return data[key];

        }

    }

    return [];

}


/* =====================================================
   CARGAR NOTICIAS
===================================================== */

async function loadNews() {

    if (STATE.loading) {
        return;
    }

    STATE.loading = true;

    updateStatus(
        "Actualizando noticias..."
    );

    try {

        const response =
            await fetch(
                `${ARENA24.newsFile}?t=${Date.now()}`,
                {
                    cache: "no-store",
                    headers: {
                        Accept:
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
                .map(
                    normalizeNews
                )
                .filter(Boolean);

        if (
            !normalized.length
        ) {

            throw new Error(
                "No hay noticias válidas."
            );

        }

        STATE.news =
            removeDuplicates(
                normalized
            );

        STATE.lastUpdate =
            new Date();

        STATE.error = false;

        STATE.visible =
            Math.min(
                ARENA24.initialNews,
                STATE.news.length
            );

        renderEverything();

        hideError();

        updateStatus(
            `Actualizado ${new Intl.DateTimeFormat(
                "es-AR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ).format(
                STATE.lastUpdate
            )}`
        );

    } catch (error) {

        console.error(
            "ARENA 24 - Noticias:",
            error
        );

        STATE.error = true;

        /*
        No borramos las noticias
        anteriores si ya existían.
        */

        if (
            STATE.news.length
        ) {

            updateStatus(
                "No se pudo actualizar. Mostrando información disponible."
            );

            showError(false);

        } else {

            showError(true);

            updateStatus(
                "Noticias temporalmente no disponibles."
            );

        }

    } finally {

        STATE.loading = false;

    }

}


/* =====================================================
   DUPLICADOS
===================================================== */

function removeDuplicates(news) {

    const seen =
        new Set();

    return news.filter(
        item => {

            const key =
                item.link !== "#"
                    ? item.link
                    : item.title
                        .toLowerCase();

            if (
                seen.has(key)
            ) {

                return false;

            }

            seen.add(key);

            return true;

        }
    );

}


/* =====================================================
   RENDER GENERAL
===================================================== */

function renderEverything() {

    renderFeatured();

    renderSection(
        "LA RIOJA",
        [
            "#rioja-news",
            "#news-rioja",
            "[data-news-category='LA RIOJA']"
        ]
    );

    renderSection(
        "NACIONALES",
        [
            "#national-news",
            "#news-national",
            "[data-news-category='NACIONALES']"
        ]
    );

    renderSection(
        "DEPORTES",
        [
            "#sports-news",
            "#news-sports",
            "[data-news-category='DEPORTES']"
        ]
    );

    renderSection(
        "POLICIALES",
        [
            "#police-news",
            "#news-police",
            "[data-news-category='POLICIALES']"
        ]
    );

    renderMainGrid();

    updateMoreButton();

}


/* =====================================================
   NOTICIA DESTACADA
===================================================== */

function renderFeatured() {

    const news =
        STATE.news[0];

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
            timeAgo(
                news.date
            );

        time.title =
            formatDate(
                news.date
            );

    }


    if (link) {

        link.href =
            news.link;

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

    }


    if (image) {

        if (
            news.image !== "#"
        ) {

            image.src =
                news.image;

            image.alt =
                news.title;

            image.style.display =
                "block";

        } else {

            image.removeAttribute(
                "src"
            );

            image.style.display =
                "none";

        }

    }

}


/* =====================================================
   RENDER DE SECCIONES
===================================================== */

function renderSection(
    category,
    selectors
) {

    let container = null;

    for (
        const selector of selectors
    ) {

        container =
            $(selector);

        if (container) {
            break;
        }

    }

    if (!container) {
        return;
    }

    const news =
        STATE.news
            .filter(
                item =>
                    item.category ===
                    category
            )
            .slice(0, 6);

    if (!news.length) {

        container.innerHTML = `

            <div class="news-empty">

                <strong>
                    ${category}
                </strong>

                <p>
                    No hay noticias disponibles
                    en este momento.
                </p>

            </div>

        `;

        return;

    }

    container.innerHTML =
        news
            .map(
                (item, index) =>
                    createCard(
                        item,
                        index
                    )
            )
            .join("");

}


/* =====================================================
   GRID PRINCIPAL
===================================================== */

function renderMainGrid() {

    const grid =
        $("#news-grid");

    if (!grid) {
        return;
    }

    /*
      Excluimos la primera noticia,
      que se utiliza como destacada.
    */

    const news =
        STATE.news.slice(
            1,
            STATE.visible
        );

    if (!news.length) {

        grid.innerHTML = `

            <div class="news-empty">

                No hay más noticias disponibles.

            </div>

        `;

        return;

    }

    grid.innerHTML =
        news
            .map(
                createCard
            )
            .join("");

}


/* =====================================================
   CREAR TARJETA
===================================================== */

function createCard(
    news,
    index
) {

    const image =
        news.image !== "#"
            ? `
                <img
                    src="${escapeHTML(
                        news.image
                    )}"
                    alt="${escapeHTML(
                        news.title
                    )}"
                    loading="lazy"
                    onerror="
                        this.style.display='none'
                    "
                >
              `
            : `
                <div class="news-card-placeholder">
                    <span>ARENA</span>
                    <strong>24</strong>
                </div>
              `;


    return `

        <article
            class="news-card"
            data-news-index="${index}"
        >

            <div class="news-card-image">

                ${image}

                <span class="news-card-tag">

                    ${escapeHTML(
                        news.category
                    )}

                </span>

            </div>


            <div class="news-card-body">

                <div class="news-card-source">

                    ${escapeHTML(
                        news.source
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
                                        150
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
                            formatDate(
                                news.date
                            )
                        )}"
                    >

                        ${escapeHTML(
                            timeAgo(
                                news.date
                            )
                        )}

                    </span>


                    <a
                        href="${escapeHTML(
                            news.link
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="news-card-link"
                    >

                        LEER →

                    </a>

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   TRUNCAR
===================================================== */

function truncate(
    text,
    length
) {

    const value =
        cleanText(text);

    if (
        value.length <= length
    ) {

        return value;

    }

    return (
        value
            .substring(
                0,
                length
            )
            .trimEnd() +
        "..."
    );

}


/* =====================================================
   VER MÁS
===================================================== */

function updateMoreButton() {

    const button =
        $("#load-more-news");

    if (!button) {
        return;
    }

    const available =
        Math.max(
            0,
            STATE.news.length - 1
        );

    const visible =
        Math.max(
            0,
            STATE.visible - 1
        );

    if (
        visible >= available
    ) {

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


/* =====================================================
   VER MÁS
===================================================== */

function loadMore() {

    STATE.visible =
        Math.min(
            STATE.visible +
                ARENA24.moreNews,

            STATE.news.length
        );

    renderMainGrid();

    updateMoreButton();

}


/* =====================================================
   ESTADO
===================================================== */

function updateStatus(
    message
) {

    const element =
        $("#news-update-status");

    if (element) {

        element.textContent =
            message;

    }

}


/* =====================================================
   ERROR
===================================================== */

function showError(
    showRetry
) {

    const error =
        $("#news-error");

    if (!error) {
        return;
    }

    error.hidden = false;

    const retry =
        $("#news-retry");

    if (retry) {

        retry.style.display =
            showRetry
                ? "inline-block"
                : "none";

    }

}


function hideError() {

    const error =
        $("#news-error");

    if (error) {

        error.hidden =
            true;

    }

}


/* =====================================================
   REINTENTAR
===================================================== */

function retryNews() {

    STATE.loading =
        false;

    loadNews();

}


/* =====================================================
   ACTUALIZACIÓN AUTOMÁTICA
===================================================== */

function startAutoRefresh() {

    setInterval(
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                loadNews();

            }

        },
        ARENA24.refreshTime
    );

}


/* =====================================================
   YOUTUBE
===================================================== */

function setupYouTube() {

    const player =
        $("#youtube-player");

    if (
        player &&
        !player.src
    ) {

        player.src =
            ARENA24.youtubeVideo;

    }


    $$(
        "[data-youtube-channel]"
    ).forEach(
        element => {

            element.href =
                ARENA24.youtubeChannel;

            element.target =
                "_blank";

            element.rel =
                "noopener noreferrer";

        }
    );

}


/* =====================================================
   RELOJ
===================================================== */

function updateClock() {

    $$(
        "[data-live-clock]"
    ).forEach(
        element => {

            element.textContent =
                new Intl.DateTimeFormat(
                    "es-AR",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                ).format(
                    new Date()
                );

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


/* =====================================================
   AÑO
===================================================== */

function setupYear() {

    const year =
        new Date()
            .getFullYear();

    $$(
        "[data-current-year]"
    ).forEach(
        element => {

            element.textContent =
                year;

        }
    );

}


/* =====================================================
   MENÚ
===================================================== */

function setupMenu() {

    const button =
        $(".menu-toggle");

    const nav =
        $(".main-nav");

    if (
        !button ||
        !nav
    ) {

        return;

    }

    button.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "active"
            );

            button.classList.toggle(
                "active"
            );

        }
    );


    $$(".main-nav a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        nav.classList.remove(
                            "active"
                        );

                        button.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =====================================================
   NAVEGACIÓN
===================================================== */

function setupSmoothNavigation() {

    $$(
        'a[href^="#"]'
    ).forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !id ||
                        id === "#"
                    ) {

                        return;

                    }

                    const target =
                        $(id);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior:
                            "smooth",
                        block:
                            "start"
                    });

                }
            );

        }
    );

}


/* =====================================================
   HEADER
===================================================== */

function setupHeader() {

    const header =
        $("header");

    if (!header) {
        return;
    }

    const update =
        () => {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 20
            );

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


/* =====================================================
   BOTÓN NOTICIAS
===================================================== */

function setupNewsButtons() {

    const more =
        $("#load-more-news");

    if (more) {

        more.addEventListener(
            "click",
            loadMore
        );

    }


    const retry =
        $("#news-retry");

    if (retry) {

        retry.addEventListener(
            "click",
            retryNews
        );

    }

}


/* =====================================================
   VISIBILIDAD
===================================================== */

function setupVisibility() {
/* =====================================================
   ARENA 24 RADIO
   REPRODUCTOR ZENO.FM
===================================================== */

(function () {

    "use strict";


    const STREAM_URL =
        "https://stream.zeno.fm/zuw6xmmwmd0uv";


    function initArenaRadio() {

        const audio =
            document.getElementById(
                "arena-radio-audio"
            );

        const playButton =
            document.getElementById(
                "arena-radio-play"
            );

        const playIcon =
            document.getElementById(
                "arena-radio-play-icon"
            );

        const volume =
            document.getElementById(
                "arena-radio-volume"
            );

        const player =
            document.querySelector(
                ".arena-radio-player"
            );

        const status =
            document.getElementById(
                "arena-radio-status"
            );

        const message =
            document.getElementById(
                "arena-radio-message"
            );


        if (
            !audio ||
            !playButton ||
            !player
        ) {

            console.error(
                "ARENA 24 RADIO: elementos no encontrados."
            );

            return;

        }


        /*
         * Configuramos el stream.
         */

        audio.src = STREAM_URL;

        audio.preload = "none";

        audio.volume = 0.8;


        /*
         * Estado visual.
         */

        function setStatus(
            text,
            type
        ) {

            if (status) {

                const textElement =
                    status.querySelector("b");

                const dot =
                    status.querySelector("span");


                if (textElement) {

                    textElement.textContent =
                        text;

                }


                if (dot) {

                    dot.className =
                        type || "";

                }

            }

        }


        /*
         * REPRODUCIR
         */

        async function playRadio() {

            setStatus(
                "CONECTANDO...",
                "connecting"
            );


            if (message) {

                message.textContent =
                    "Conectando con ARENA 24 Radio...";

            }


            try {

                /*
                 * Recargamos el stream para evitar
                 * conexiones antiguas o fallidas.
                 */

                audio.pause();

                audio.load();


                await audio.play();


            } catch (error) {

                console.error(
                    "ARENA 24 RADIO — ERROR:",
                    error
                );


                setStatus(
                    "NO SE PUDO CONECTAR",
                    "error"
                );


                if (message) {

                    message.textContent =
                        "El servidor de radio no respondió. Intentá nuevamente.";

                }


                player.classList.remove(
                    "playing"
                );

            }

        }


        /*
         * PAUSAR
         */

        function pauseRadio() {

            audio.pause();

            setStatus(
                "RADIO EN PAUSA",
                ""
            );


            if (message) {

                message.textContent =
                    "Presioná reproducir para volver a escuchar.";

            }


            player.classList.remove(
                "playing"
            );


            if (playIcon) {

                playIcon.textContent =
                    "▶";

            }

        }


        /*
         * BOTÓN
         */

        playButton.addEventListener(
            "click",
            function () {

                if (audio.paused) {

                    playRadio();

                } else {

                    pauseRadio();

                }

            }
        );


        /*
         * STREAM INICIADO
         */

        audio.addEventListener(
            "playing",
            function () {

                player.classList.add(
                    "playing"
                );


                if (playIcon) {

                    playIcon.textContent =
                        "❚❚";

                }


                setStatus(
                    "TRANSMITIENDO EN VIVO",
                    "online"
                );


                if (message) {

                    message.textContent =
                        "Estás escuchando ARENA 24 Radio.";

                }

            }
        );


        /*
         * PAUSA
         */

        audio.addEventListener(
            "pause",
            function () {

                if (
                    !audio.ended
                ) {

                    player.classList.remove(
                        "playing"
                    );


                    if (playIcon) {

                        playIcon.textContent =
                            "▶";

                    }

                }

            }
        );


        /*
         * ERROR DEL STREAM
         */

        audio.addEventListener(
            "error",
            function () {

                console.error(
                    "ARENA 24 RADIO: error del stream.",
                    audio.error
                );


                player.classList.remove(
                    "playing"
                );


                if (playIcon) {

                    playIcon.textContent =
                        "▶";

                }


                setStatus(
                    "ERROR DE CONEXIÓN",
                    "error"
                );


                if (message) {

                    message.textContent =
                        "No fue posible recibir la transmisión desde Zeno.FM.";

                }

            }
        );


        /*
         * VOLUMEN
         */

        if (volume) {

            volume.addEventListener(
                "input",
                function () {

                    audio.volume =
                        Number(
                            volume.value
                        );

                }
            );

        }


        /*
         * TECLADO
         */

        playButton.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                }

            }
        );

    }


    /*
     * Esperamos al DOM.
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initArenaRadio
        );

    } else {

        initArenaRadio();

    }

})();
 console.log("ARENA 24: iniciando sistema de noticias...");

// Cargar noticias inmediatamente
loadNews();

// Activar actualización automática
startAutoRefresh();

// Botón VER MÁS
const moreButton = $("#load-more-news");

if (moreButton) {
    moreButton.addEventListener(
        "click",
        loadMore
    );
}

// Botón REINTENTAR
const retryButton = $("#news-retry");

if (retryButton) {
    retryButton.addEventListener(
        "click",
        retryNews
    );
}
 const refreshTime =
    Number(ARENA24.refreshTime) > 0
        ? Number(ARENA24.refreshTime)
        : 5 * 60 * 1000;

console.log(
    `ARENA 24: actualización cada ${
        Math.round(refreshTime / 60000)
    } minutos`
);

setInterval(() => {

    if (
        document.visibilityState === "visible" &&
        !STATE.loading
    ) {

        console.log(
            "ARENA 24: actualizando noticias..."
        );

        loadNews();

    }

}, refreshTime);


