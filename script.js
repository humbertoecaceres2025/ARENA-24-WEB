/* ============================================================
   ARENA 24 RADIO
   NOTICIAS + POLICIALES + DEPORTES + DÓLAR + CLIMA
   FUNCIONA EN GITHUB PAGES SIN PHP
   ============================================================ */

"use strict";


/* ============================================================
   CONFIGURACIÓN
   ============================================================ */

const ARENA24 = {

    actualizarCada: 5 * 60 * 1000,

    clima: {
        latitud: -29.4135,
        longitud: -66.8568
    },

    rss: {

        rioja:
        "https://news.google.com/rss/search?q=%22La+Rioja%22+Argentina&hl=es-419&gl=AR&ceid=AR:es-419",

        policiales:
        "https://news.google.com/rss/search?q=policiales+%22La+Rioja%22+Argentina&hl=es-419&gl=AR&ceid=AR:es-419",

        deportes:
        "https://news.google.com/rss/search?q=deportes+Argentina&hl=es-419&gl=AR&ceid=AR:es-419"
    }

};


/* ============================================================
   ELEMENTOS
   ============================================================ */

const playButton =
    document.getElementById("play");

const audio =
    document.getElementById("audio");

const status =
    document.getElementById("status");


/* ============================================================
   RADIO EN VIVO
   ============================================================ */

if (playButton && audio) {

    playButton.addEventListener("click", async () => {

        try {

            if (audio.paused) {

                await audio.play();

                playButton.textContent =
                    "⏸ PAUSAR RADIO";

                if (status) {

                    status.textContent =
                        "● ARENA 24 · REPRODUCIENDO EN VIVO";

                }

            } else {

                audio.pause();

                playButton.textContent =
                    "▶ ESCUCHAR EN VIVO";

                if (status) {

                    status.textContent =
                        "● ARENA 24 · RADIO PAUSADA";

                }

            }

        } catch (error) {

            console.error(
                "Radio:",
                error
            );

            if (status) {

                status.textContent =
                    "● Tocá nuevamente para iniciar la radio.";

            }

        }

    });

}


/* ============================================================
   SEGURIDAD
   ============================================================ */

function safe(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


/* ============================================================
   LIMPIAR HTML DEL RSS
   ============================================================ */

function cleanText(text) {

    if (!text)
        return "";

    const div =
        document.createElement("div");

    div.innerHTML =
        text;

    return (
        div.textContent ||
        div.innerText ||
        ""
    )
    .replace(/\s+/g, " ")
    .trim();

}


/* ============================================================
   RSS2JSON
   ============================================================ */

async function consultarRSS(rss) {

    const url =
        "https://api.rss2json.com/v1/api.json?rss_url=" +
        encodeURIComponent(rss);

    const response =
        await fetch(
            url,
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            "RSS2JSON respondió " +
            response.status
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


/* ============================================================
   FECHA
   ============================================================ */

function fechaNoticia(fecha) {

    if (!fecha)
        return "";

    const d =
        new Date(fecha);

    if (
        Number.isNaN(
            d.getTime()
        )
    ) {

        return "";

    }

    return d.toLocaleString(
        "es-AR",
        {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* ============================================================
   TARJETA DE NOTICIA
   ============================================================ */

function tarjetaNoticia(
    noticia,
    categoria
) {

    const titulo =
        noticia.title ||
        "Noticia sin título";

    const descripcion =
        cleanText(
            noticia.description ||
            noticia.content ||
            ""
        );

    const enlace =
        noticia.link ||
        "#";

    const fecha =
        fechaNoticia(
            noticia.pubDate
        );

    return `

        <article class="news-card">

            <div class="news-content">

                <span class="news-category">
                    ${safe(categoria)}
                </span>

                <h3>
                    ${safe(titulo)}
                </h3>

                ${
                    descripcion
                    ?
                    `
                    <p>
                        ${safe(
                            descripcion.substring(
                                0,
                                190
                            )
                        )}
                    </p>
                    `
                    :
                    ""
                }

                ${
                    fecha
                    ?
                    `
                    <small>
                        🕐 ${safe(fecha)}
                    </small>
                    `
                    :
                    ""
                }

                <a
                    class="news-link"
                    href="${safe(enlace)}"
                    target="_blank"
                    rel="noopener noreferrer">

                    LEER NOTICIA →

                </a>

            </div>

        </article>

    `;

}


/* ============================================================
   MOSTRAR FECHA DE ACTUALIZACIÓN
   ============================================================ */

function mostrarActualizacion() {

    const ahora =
        new Date();

    const texto =
        ahora.toLocaleString(
            "es-AR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    console.log(
        "ARENA 24 · Actualizado:",
        texto
    );

}


/* ============================================================
   CARGAR NOTICIAS
   ============================================================ */

async function cargarNoticias() {

    const contenedor =
        document.getElementById(
            "newsGrid"
        );

    if (!contenedor)
        return [];

    try {

        const noticias =
            await consultarRSS(
                ARENA24.rss.rioja
            );

        if (!noticias.length) {

            throw new Error(
                "El RSS no devolvió noticias."
            );

        }

        contenedor.innerHTML =
            noticias
            .slice(0, 6)
            .map(
                noticia =>
                    tarjetaNoticia(
                        noticia,
                        "LA RIOJA"
                    )
            )
            .join("");

        return noticias.slice(0, 8);

    } catch (error) {

        console.error(
            "Noticias:",
            error
        );

        contenedor.innerHTML = `

            <article class="loading-card">

                <p>
                    ⚠️ No se pudieron actualizar
                    las noticias de La Rioja.
                </p>

            </article>

        `;

        return [];

    }

}


/* ============================================================
   POLICIALES
   ============================================================ */

async function cargarPoliciales() {

    const contenedor =
        document.getElementById(
            "policeGrid"
        );

    if (!contenedor)
        return [];

    try {

        const noticias =
            await consultarRSS(
                ARENA24.rss.policiales
            );

        if (!noticias.length) {

            throw new Error(
                "No hay policiales."
            );

        }

        contenedor.innerHTML =
            noticias
            .slice(0, 6)
            .map(
                noticia =>
                    tarjetaNoticia(
                        noticia,
                        "POLICIALES"
                    )
            )
            .join("");

        return noticias.slice(0, 8);

    } catch (error) {

        console.error(
            "Policiales:",
            error
        );

        contenedor.innerHTML = `

            <article class="loading-card dark-card">

                <p>
                    ⚠️ No se pudieron actualizar
                    los policiales.
                </p>

            </article>

        `;

        return [];

    }

}


/* ============================================================
   DEPORTES
   ============================================================ */

async function cargarDeportes() {

    const contenedor =
        document.getElementById(
            "sportsGrid"
        );

    if (!contenedor)
        return [];

    try {

        const noticias =
            await consultarRSS(
                ARENA24.rss.deportes
            );

        if (!noticias.length) {

            throw new Error(
                "No hay deportes."
            );

        }

        contenedor.innerHTML =
            noticias
            .slice(0, 6)
            .map(
                noticia =>
                    tarjetaNoticia(
                        noticia,
                        "DEPORTES"
                    )
            )
            .join("");

        return noticias.slice(0, 8);

    } catch (error) {

        console.error(
            "Deportes:",
            error
        );

        contenedor.innerHTML = `

            <article class="loading-card">

                <p>
                    ⚠️ No se pudieron actualizar
                    los deportes.
                </p>

            </article>

        `;

        return [];

    }

}


/* ============================================================
   ARENA 24 FLASH
   ============================================================ */

function actualizarFlash(
    noticias,
    policiales,
    deportes
) {

    const flash =
        document.getElementById(
            "breakingNews"
        );

    if (!flash)
        return;

    const todas = [

        ...noticias,
        ...policiales,
        ...deportes

    ];

    if (!todas.length) {

        flash.textContent =
            "ARENA 24 · Siempre con vos.";

        return;

    }

    flash.textContent =
        todas
        .slice(0, 8)
        .map(
            noticia =>
                noticia.title
        )
        .join(
            "   •   "
        );

}


/* ============================================================
   DÓLAR
   ============================================================ */

async function obtenerDolar(
    endpoint
) {

    const response =
        await fetch(
            "https://dolarapi.com/v1/dolares/" +
            endpoint +
            "?_=" +
            Date.now(),
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Dólar API " +
            response.status
        );

    }

    return await response.json();

}


async function cargarDolar() {

    const contenedor =
        document.getElementById(
            "dollarGrid"
        );

    if (!contenedor)
        return;


    try {

        const [
            oficial,
            blue,
            bolsa,
            ccl,
            tarjeta
        ] =
        await Promise.all([

            obtenerDolar(
                "oficial"
            ),

            obtenerDolar(
                "blue"
            ),

            obtenerDolar(
                "bolsa"
            ),

            obtenerDolar(
                "contadoconliqui"
            ),

            obtenerDolar(
                "tarjeta"
            )

        ]);


        const dolares = [

            oficial,

            blue,

            bolsa,

            ccl,

            tarjeta

        ];


        contenedor.innerHTML =
            dolares
            .filter(Boolean)
            .map(
                dolar => `

                    <article class="dollar-card">

                        <small>
                            ${safe(
                                dolar.nombre ||
                                dolar.casa ||
                                "DÓLAR"
                            )}
                        </small>

                        <strong>
                            $${Number(
                                dolar.venta || 0
                            ).toLocaleString(
                                "es-AR"
                            )}
                        </strong>

                        <span>
                            Compra:
                            $${Number(
                                dolar.compra || 0
                            ).toLocaleString(
                                "es-AR"
                            )}
                        </span>

                        <span>
                            Actualizado:
                            ${safe(
                                dolar.fechaActualizacion ||
                                ""
                            )}
                        </span>

                    </article>

                `
            )
            .join("");


    } catch (error) {

        console.error(
            "Dólar:",
            error
        );

        contenedor.innerHTML = `

            <article class="dollar-card">

                <small>
                    💵 DÓLAR
                </small>

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


/* ============================================================
   CLIMA
   ============================================================ */

async function cargarClima() {

    const contenedor =
        document.getElementById(
            "weatherCard"
        );

    if (!contenedor)
        return;


    const url =
        "https://api.open-meteo.com/v1/forecast" +

        "?latitude=" +
        ARENA24.clima.latitud +

        "&longitude=" +
        ARENA24.clima.longitud +

        "&current=" +
        "temperature_2m," +
        "relative_humidity_2m," +
        "apparent_temperature," +
        "wind_speed_10m," +
        "weather_code" +

        "&timezone=auto";


    try {

        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Clima API " +
                response.status
            );

        }

        const data =
            await response.json();

        const actual =
            data.current;


        const descripcion =
            descripcionClima(
                actual.weather_code
            );


        contenedor.innerHTML = `

            <div class="weather-main">

                <div>

                    <div class="weather-temperature">

                        ${Math.round(
                            actual.temperature_2m
                        )}°C

                    </div>

                    <div class="weather-description">

                        ${descripcion}

                    </div>

                </div>


                <div>

                    <h3>
                        🌦️ La Rioja Capital
                    </h3>

                    <p>
                        Sensación:
                        ${Math.round(
                            actual.apparent_temperature
                        )}°C
                    </p>

                </div>

            </div>


            <div class="weather-info">

                <div>

                    <small>
                        HUMEDAD
                    </small>

                    <strong>
                        ${actual.relative_humidity_2m}%
                    </strong>

                </div>


                <div>

                    <small>
                        VIENTO
                    </small>

                    <strong>
                        ${Math.round(
                            actual.wind_speed_10m
                        )} km/h
                    </strong>

                </div>


                <div>

                    <small>
                        ACTUALIZADO
                    </small>

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

        contenedor.innerHTML = `

            <div>

                <h3>
                    🌦️ La Rioja Capital
                </h3>

                <p>
                    No se pudo actualizar
                    el clima.
                </p>

            </div>

        `;

    }

}


/* ============================================================
   CÓDIGOS METEOROLÓGICOS
   ============================================================ */

function descripcionClima(
    codigo
) {

    const mapa = {

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
        "❄️ Nieve",

        75:
        "❄️ Nieve intensa",

        80:
        "🌦️ Chaparrones",

        81:
        "🌦️ Chaparrones",

        82:
        "⛈️ Chaparrones fuertes",

        95:
        "⛈️ Tormenta",

        96:
        "⛈️ Tormenta con granizo",

        99:
        "⛈️ Tormenta fuerte"

    };


    return (
        mapa[codigo] ||
        "🌤️ Condiciones actuales"
    );

}


/* ============================================================
   ACTUALIZAR TODO
   ============================================================ */

async function actualizarTodo() {

    console.log(
        "🔄 ARENA 24 · Actualizando..."
    );


    const resultados =
        await Promise.all([

            cargarNoticias(),

            cargarPoliciales(),

            cargarDeportes(),

            cargarDolar(),

            cargarClima()

        ]);


    actualizarFlash(

        resultados[0],

        resultados[1],

        resultados[2]

    );


    mostrarActualizacion();


    console.log(
        "✅ ARENA 24 · Actualización terminada."
    );

}


/* ============================================================
   ARRANQUE
   ============================================================ */

actualizarTodo();


/* ============================================================
   ACTUALIZACIÓN AUTOMÁTICA
   ============================================================ */

setInterval(

    actualizarTodo,

    ARENA24.actualizarCada

);


/* ============================================================
   AL VOLVER A LA PÁGINA
   ============================================================ */

document.addEventListener(

    "visibilitychange",

    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            actualizarTodo();

        }

    }

);
