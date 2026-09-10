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
            statusText.textContent = "🔴 ARENA 24 · REPRODUCIENDO";

        } else {

            audio.pause();

            playButton.textContent = "▶ ESCUCHAR EN VIVO";
            statusText.textContent = "🔴 ARENA 24 · EN VIVO";

        }

    } catch (error) {

        statusText.textContent =
            "🔴 Tocá nuevamente para iniciar la radio";

    }

});


// ======================================
// NOTICIAS JSON
// ======================================

async function cargarNoticias() {

    const newsGrid = document.getElementById("newsGrid");
    const policeGrid = document.getElementById("policeGrid");
    const sportsGrid = document.getElementById("sportsGrid");

    try {

        const response = await fetch(
            `noticias.json?nocache=${Date.now()}`
        );

        if (!response.ok) {
            throw new Error("No se pudo cargar noticias.json");
        }

        const data = await response.json();

        renderNews(
            newsGrid,
            data.noticias,
            "📰 NOTICIAS"
        );

        renderNews(
            policeGrid,
            data.policiales,
            "🚔 POLICIALES"
        );

        renderNews(
            sportsGrid,
            data.deportes,
            "⚽ DEPORTES"
        );

        if (data.actualizado) {

            const fecha = new Date(data.actualizado);

            document.getElementById("flashText").textContent =
                "Última actualización: " +
                fecha.toLocaleString("es-AR");

        }

    } catch (error) {

        console.error(error);

        newsGrid.innerHTML =
            '<div class="loading">⚠️ No se pudieron cargar las noticias.</div>';

        policeGrid.innerHTML =
            '<div class="loading">⚠️ No se pudieron cargar los policiales.</div>';

        sportsGrid.innerHTML =
            '<div class="loading">⚠️ No se pudieron cargar los deportes.</div>';

    }

}


function renderNews(container, articles, category) {

    if (!articles || articles.length === 0) {

        container.innerHTML =
            '<div class="loading">No hay información disponible.</div>';

        return;
    }

    container.innerHTML = articles
        .slice(0, 6)
        .map(article => {

            const title = escapeHTML(
                article.title || "Sin título"
            );

            const description = escapeHTML(
                article.description || ""
            );

            const source = escapeHTML(
                article.source || "ARENA 24"
            );

            return `

                <article class="news-card">

                    <span class="news-category">
                        ${category}
                    </span>

                    <h3>
                        ${title}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <div class="news-source">
                        ${source}
                    </div>

                </article>

            `;

        })
        .join("");

}


function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ======================================
// DÓLAR
// ======================================

async function cargarDolar() {

    try {

        const [oficialResponse, blueResponse] =
            await Promise.all([

                fetch(
                    "https://dolarapi.com/v1/dolares/oficial"
                ),

                fetch(
                    "https://dolarapi.com/v1/dolares/blue"
                )

            ]);

        if (!oficialResponse.ok || !blueResponse.ok) {
            throw new Error("Error en DolarApi");
        }

        const oficial = await oficialResponse.json();
        const blue = await blueResponse.json();


        document.getElementById("oficialVenta").textContent =
            "$ " + numero(oficial.venta);

        document.getElementById("oficialCompra").textContent =
            "$ " + numero(oficial.compra);


        document.getElementById("blueVenta").textContent =
            "$ " + numero(blue.venta);

        document.getElementById("blueCompra").textContent =
            "$ " + numero(blue.compra);


        document.getElementById("dolarUpdate").textContent =
            "Actualizado: " +
            new Date().toLocaleString("es-AR");

    } catch (error) {

        console.error(error);

        document.getElementById("dolarUpdate").textContent =
            "⚠️ No se pudo consultar el dólar.";

    }

}


function numero(valor) {

    if (valor === undefined || valor === null) {
        return "--";
    }

    return Number(valor).toLocaleString(
        "es-AR",
        {
            minimumFractionDigits:2,
            maximumFractionDigits:2
        }
    );

}


// ======================================
// CLIMA — LA RIOJA CAPITAL
// ======================================

async function cargarClima() {

    const latitude = -29.4131;
    const longitude = -66.8558;

    const url =
        "https://api.open-meteo.com/v1/forecast" +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
        "&forecast_days=3" +
        "&timezone=America%2FArgentina%2FLa_Rioja";


    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error de clima");
        }

        const data = await response.json();

        const current = data.current;


        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + " °C";


        document.getElementById("weatherDescription").textContent =
            weatherDescription(current.weather_code);


        document.getElementById("weatherIcon").textContent =
            weatherIcon(current.weather_code);


        document.getElementById("wind").textContent =
            Math.round(current.wind_speed_10m) + " km/h";


        document.getElementById("humidity").textContent =
            Math.round(current.relative_humidity_2m) + " %";


        document.getElementById("rain").textContent =
            (data.daily.precipitation_probability_max[0] ?? 0) + " %";


        renderForecast(data.daily);


        document.getElementById("weatherUpdate").textContent =
            "Actualizado: " +
            new Date().toLocaleString("es-AR");


    } catch (error) {

        console.error(error);

        document.getElementById("weatherDescription").textContent =
            "No se pudo consultar el clima.";

        document.getElementById("weatherUpdate").textContent =
            "⚠️ Servicio meteorológico temporalmente no disponible.";

    }

}


function renderForecast(daily) {

    const container =
        document.getElementById("forecast");

    container.innerHTML =
        daily.time.map((date, index) => {

            const fecha =
                new Date(date + "T12:00:00");

            const nombre =
                fecha.toLocaleDateString(
                    "es-AR",
                    {
                        weekday:"long",
                        day:"numeric"
                    }
                );

            return `

                <article class="forecast-card">

                    <strong>
                        ${capitalizar(nombre)}
                    </strong>

                    <div style="font-size:35px;margin:8px 0">
                        ${weatherIcon(daily.weather_code[index])}
                    </div>

                    <span>
                        Máx. ${Math.round(
                            daily.temperature_2m_max[index]
                        )} °C
                    </span>

                    <br>

                    <span>
                        Mín. ${Math.round(
                            daily.temperature_2m_min[index]
                        )} °C
                    </span>

                    <br>

                    <span>
                        🌧️ ${
                            daily.precipitation_probability_max[index] ?? 0
                        }%
                    </span>

                </article>

            `;

        }).join("");

}


function capitalizar(texto) {

    return texto.charAt(0).toUpperCase() +
        texto.slice(1);

}


function weatherIcon(code) {

    if (code === 0) return "☀️";

    if ([1,2].includes(code)) return "🌤️";

    if (code === 3) return "☁️";

    if ([45,48].includes(code)) return "🌫️";

    if ([51,53,55,56,57].includes(code)) return "🌦️";

    if ([61,63,65,66,67].includes(code)) return "🌧️";

    if ([71,73,75,77].includes(code)) return "🌨️";

    if ([80,81,82].includes(code)) return "🌦️";

    if ([95,96,99].includes(code)) return "⛈️";

    return "🌤️";

}


function weatherDescription(code) {

    if (code === 0) return "Cielo despejado";

    if ([1,2].includes(code)) return "Parcialmente soleado";

    if (code === 3) return "Nublado";

    if ([45,48].includes(code)) return "Niebla";

    if ([51,53,55].includes(code)) return "Llovizna";

    if ([61,63,65].includes(code)) return "Lluvia";

    if ([80,81,82].includes(code)) return "Chaparrones";

    if ([95,96,99].includes(code)) return "Tormentas";

    return "Condiciones variables";

}


// ======================================
// INICIAR
// ======================================

cargarNoticias();
cargarDolar();
cargarClima();


// Actualizar dólar y clima cada 10 minutos

setInterval(() => {

    cargarDolar();
    cargarClima();

}, 10 * 60 * 1000);


// Actualizar noticias cada 5 minutos

setInterval(() => {

    cargarNoticias();

}, 5 * 60 * 1000);
