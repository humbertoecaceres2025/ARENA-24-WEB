"use strict";

/* ============================================================
   ARENA 24
   SISTEMA AUTOMÁTICO
   ============================================================ */

const CONFIG = {

    noticiasCada:
        5 * 60 * 1000,

    dolarCada:
        5 * 60 * 1000,

    climaCada:
        10 * 60 * 1000,

    clima: {
        latitude: -29.4135,
        longitude: -66.8568
    }

};


/* ============================================================
   UTILIDADES
============================================================ */

function escapeHTML(value){

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


function formatearPesos(value){

    if (
        value === null ||
        value === undefined ||
        isNaN(value)
    ){

        return "—";

    }

    return Number(value)
        .toLocaleString(
            "es-AR",
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        );

}


/* ============================================================
   RADIO
============================================================ */

const play =
    document.getElementById("play");

const audio =
    document.getElementById("audio");

const status =
    document.getElementById("status");


if(play && audio){

    play.addEventListener(
        "click",
        async function(){

            try{

                if(audio.paused){

                    await audio.play();

                    play.textContent =
                        "⏸ PAUSAR RADIO";

                    status.textContent =
                        "● ARENA 24 · REPRODUCIENDO";

                }else{

                    audio.pause();

                    play.textContent =
                        "▶ ESCUCHAR EN VIVO";

                    status.textContent =
                        "● RADIO PAUSADA";

                }

            }catch(error){

                console.error(
                    "Radio:",
                    error
                );

                status.textContent =
                    "● Tocá nuevamente para iniciar";

            }

        }
    );

}


/* ============================================================
   CREAR TARJETA DE NOTICIA
============================================================ */

function crearNoticia(
    noticia,
    categoria
){

    const titulo =
        escapeHTML(
            noticia.titulo
        );

    const descripcion =
        escapeHTML(
            noticia.descripcion
        );

    const fuente =
        escapeHTML(
            noticia.fuente ||
            "ARENA 24"
        );

    const url =
        escapeHTML(
            noticia.url
        );


    return `

        <article class="news-card">

            <div class="news-content">

                <span class="news-category">
                    ${escapeHTML(categoria)}
                </span>

                <h3>
                    ${titulo}
                </h3>

                ${
                    descripcion
                    ?
                    `
                    <p>
                        ${descripcion}
                    </p>
                    `
                    :
                    ""
                }

                <small>
                    Fuente:
                    ${fuente}
                </small>

                ${
                    url
                    ?
                    `
                    <a
                        class="news-link"
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer">

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


/* ============================================================
   MOSTRAR NOTICIAS
============================================================ */

function mostrarNoticias(
    id,
    noticias,
    categoria
){

    const contenedor =
        document.getElementById(id);

    if(!contenedor)
        return;


    if(
        !Array.isArray(noticias) ||
        noticias.length === 0
    ){

        contenedor.innerHTML = `

            <div class="loading">

                No hay información disponible
                en este momento.

            </div>

        `;

        return;

    }


    contenedor.innerHTML =
        noticias
            .slice(0,6)
            .map(
                noticia =>
                    crearNoticia(
                        noticia,
                        categoria
                    )
            )
            .join("");

}


/* ============================================================
   NOTICIAS
============================================================ */

async function cargarNoticias(){

    try{

        const respuesta =
            await fetch(
                "news.json?nocache=" +
                Date.now(),
                {
                    cache:"no-store"
                }
            );


        if(!respuesta.ok){

            throw new Error(
                "news.json no disponible"
            );

        }


        const datos =
            await respuesta.json();


        mostrarNoticias(
            "newsGrid",
            datos.noticias,
            "LA RIOJA"
        );


        mostrarNoticias(
            "policeGrid",
            datos.policiales,
            "POLICIALES"
        );


        mostrarNoticias(
            "sportsGrid",
            datos.deportes,
            "DEPORTES"
        );


        mostrarNoticias(
            "argentinaGrid",
            datos.argentina,
            "ARGENTINA"
        );


        mostrarNoticias(
            "worldGrid",
            datos.mundo,
            "MUNDO"
        );


        /* FLASH */

        const flash =
            document.getElementById(
                "breakingNews"
            );


        const todas = [

            ...(datos.noticias || []),

            ...(datos.policiales || []),

            ...(datos.deportes || []),

            ...(datos.argentina || []),

            ...(datos.mundo || [])

        ];


        if(flash){

            flash.textContent =
                todas
                    .slice(0,12)
                    .map(
                        noticia =>
                            "🔥 " +
                            noticia.titulo
                    )
                    .join(
                        "   •   "
                    );

        }


        /* FECHA */

        const ultima =
            document.getElementById(
                "lastUpdate"
            );


        if(
            ultima &&
            datos.actualizado
        ){

            const fecha =
                new Date(
                    datos.actualizado
                );


            ultima.textContent =
                "Noticias actualizadas: " +
                fecha.toLocaleString(
                    "es-AR"
                );

        }


    }catch(error){

        console.error(
            "Noticias:",
            error
        );


        const grids = [

            "newsGrid",

            "policeGrid",

            "sportsGrid",

            "argentinaGrid",

            "worldGrid"

        ];


        grids.forEach(
            id => {

                const elemento =
                    document.getElementById(
                        id
                    );

                if(elemento){

                    elemento.innerHTML = `

                        <div class="loading">

                            ⚠️ Las noticias
                            se están actualizando.

                            <br><br>

                            Volvé a intentar
                            en unos minutos.

                        </div>

                    `;

                }

            }
        );

    }

}


/* ============================================================
   DÓLAR
============================================================ */

async function cargarDolar(){

    const contenedor =
        document.getElementById(
            "dollarGrid"
        );


    if(!contenedor)
        return;


    const endpoints = [

        {
            nombre:"Dólar Oficial",
            url:
            "https://dolarapi.com/v1/dolares/oficial"
        },

        {
            nombre:"Dólar Blue",
            url:
            "https://dolarapi.com/v1/dolares/blue"
        },

        {
            nombre:"Dólar MEP",
            url:
            "https://dolarapi.com/v1/dolares/bolsa"
        },

        {
            nombre:"Dólar CCL",
            url:
            "https://dolarapi.com/v1/dolares/contadoconliqui"
        },

        {
            nombre:"Dólar Tarjeta",
            url:
            "https://dolarapi.com/v1/dolares/tarjeta"
        }

    ];


    try{

        const resultados =
            await Promise.all(
                endpoints.map(
                    async endpoint => {

                        try{

                            const respuesta =
                                await fetch(
                                    endpoint.url,
                                    {
                                        cache:"no-store"
                                    }
                                );


                            if(
                                !respuesta.ok
                            ){

                                return null;

                            }


                            const dato =
                                await respuesta.json();


                            return {

                                ...dato,

                                nombre:
                                    endpoint.nombre

                            };

                        }catch{

                            return null;

                        }

                    }
                )
            );


        const validos =
            resultados.filter(
                Boolean
            );


        if(!validos.length){

            throw new Error(
                "No hay cotizaciones"
            );

        }


        contenedor.innerHTML =
            validos.map(
                dolar => `

                <article class="dollar-card">

                    <small>
                        💵 ${escapeHTML(
                            dolar.nombre
                        )}
                    </small>

                    <strong>
                        $${formatearPesos(
                            dolar.venta
                        )}
                    </strong>

                    <span>
                        Compra:
                        $${formatearPesos(
                            dolar.compra
                        )}
                    </span>

                </article>

                `
            ).join("");


        const update =
            document.getElementById(
                "dollarUpdate"
            );


        if(update){

            const fecha =
                validos[0]
                    .fechaActualizacion;


            update.textContent =
                fecha
                ?
                "Última actualización: " +
                new Date(
                    fecha
                ).toLocaleString(
                    "es-AR"
                )
                :
                "Cotización actualizada automáticamente.";

        }


    }catch(error){

        console.error(
            "Dólar:",
            error
        );


        contenedor.innerHTML = `

            <div class="loading">

                ⚠️ No se pudo consultar
                el dólar en este momento.

            </div>

        `;

    }

}


/* ============================================================
   CLIMA
============================================================ */

function descripcionClima(
    codigo
){

    const mapa = {

        0:"☀️ Despejado",

        1:"🌤️ Mayormente despejado",

        2:"⛅ Parcialmente nublado",

        3:"☁️ Nublado",

        45:"🌫️ Niebla",

        48:"🌫️ Niebla",

        51:"🌦️ Llovizna",

        53:"🌦️ Llovizna",

        55:"🌧️ Llovizna intensa",

        61:"🌧️ Lluvia",

        63:"🌧️ Lluvia moderada",

        65:"🌧️ Lluvia intensa",

        71:"🌨️ Nieve",

        73:"🌨️ Nieve moderada",

        75:"❄️ Nieve intensa",

        80:"🌦️ Chaparrones",

        81:"🌦️ Chaparrones",

        82:"⛈️ Chaparrones fuertes",

        95:"⛈️ Tormenta",

        96:"⛈️ Tormenta con granizo",

        99:"⛈️ Tormenta fuerte"

    };


    return (
        mapa[codigo] ||
        "🌤️ Condiciones actuales"
    );

}


async function cargarClima(){

    const contenedor =
        document.getElementById(
            "weatherCard"
        );


    if(!contenedor)
        return;


    const url =
        "https://api.open-meteo.com/v1/forecast" +

        "?latitude=" +
        CONFIG.clima.latitude +

        "&longitude=" +
        CONFIG.clima.longitude +

        "&current=" +

        "temperature_2m," +

        "relative_humidity_2m," +

        "apparent_temperature," +

        "wind_speed_10m," +

        "weather_code" +

        "&timezone=America%2FArgentina%2FLa_Rioja";


    try{

        const respuesta =
            await fetch(
                url,
                {
                    cache:"no-store"
                }
            );


        if(!respuesta.ok){

            throw new Error(
                "Clima no disponible"
            );

        }


        const datos =
            await respuesta.json();


        const actual =
            datos.current;


        const temperatura =
            Math.round(
                actual.temperature_2m
            );


        const sensacion =
            Math.round(
                actual.apparent_temperature
            );


        const humedad =
            actual.relative_humidity_2m;


        const viento =
            Math.round(
                actual.wind_speed_10m
            );


        contenedor.innerHTML = `

            <div class="weather-main">

                <div>

                    <div class="weather-temperature">
                        ${temperatura}°C
                    </div>

                    <div class="weather-description">
                        ${descripcionClima(
                            actual.weather_code
                        )}
                    </div>

                </div>


                <div>

                    <div class="weather-city">
                        📍 La Rioja Capital
                    </div>

                    <p>
                        Sensación térmica:
                        <strong>
                            ${sensacion}°C
                        </strong>
                    </p>

                </div>

            </div>


            <div class="weather-info">

                <div>

                    <small>
                        HUMEDAD
                    </small>

                    <strong>
                        ${humedad}%
                    </strong>

                </div>


                <div>

                    <small>
                        VIENTO
                    </small>

                    <strong>
                        ${viento} km/h
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


    }catch(error){

        console.error(
            "Clima:",
            error
        );


        contenedor.innerHTML = `

            <div class="loading">

                ⚠️ No se pudo consultar
                el clima en este momento.

            </div>

        `;

    }

}


/* ============================================================
   INICIAR
============================================================ */

async function actualizarTodo(){

    await Promise.allSettled([

        cargarNoticias(),

        cargarDolar(),

        cargarClima()

    ]);

}


actualizarTodo();


/* ============================================================
   ACTUALIZACIONES AUTOMÁTICAS
============================================================ */

setInterval(
    cargarNoticias,
    CONFIG.noticiasCada
);


setInterval(
    cargarDolar,
    CONFIG.dolarCada
);


setInterval(
    cargarClima,
    CONFIG.climaCada
);
