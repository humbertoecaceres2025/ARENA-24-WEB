document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       STREAM
    ========================================= */

    const STREAM =
        "https://stream.zeno.fm/zuw6xmmwmd0uv";

    const audio =
        document.getElementById("radioAudio");

    const playBtn =
        document.getElementById("playBtn");

    const fixedPlayBtn =
        document.getElementById("fixedPlayBtn");

    const muteBtn =
        document.getElementById("muteBtn");

    const fixedMuteBtn =
        document.getElementById("fixedMuteBtn");

    const equalizer =
        document.getElementById("equalizer");

    const fixedEqualizer =
        document.getElementById("fixedEqualizer");

    const playerStatus =
        document.getElementById("playerStatus");

    const fixedStatus =
        document.getElementById("fixedStatus");

    let playing = false;


    audio.src = STREAM;


    async function togglePlayer(){

        if(!playing){

            try{

                await audio.play();

                playing = true;

                playBtn.textContent = "❚❚";

                fixedPlayBtn.textContent = "❚❚";

                equalizer.classList.add("active");

                fixedEqualizer.classList.add("active");

                playerStatus.textContent =
                    "ARENA 24 está transmitiendo en vivo";

                fixedStatus.textContent =
                    "● EN VIVO · Siempre con vos";

            }catch(error){

                playerStatus.textContent =
                    "No se pudo iniciar el streaming.";

                fixedStatus.textContent =
                    "Error de conexión";

                console.error(error);

            }

        }else{

            audio.pause();

            playing = false;

            playBtn.textContent = "▶";

            fixedPlayBtn.textContent = "▶";

            equalizer.classList.remove("active");

            fixedEqualizer.classList.remove("active");

            playerStatus.textContent =
                "Reproducción pausada";

            fixedStatus.textContent =
                "EN VIVO · Siempre con vos";

        }

    }


    playBtn.addEventListener(
        "click",
        togglePlayer
    );

    fixedPlayBtn.addEventListener(
        "click",
        togglePlayer
    );


    function toggleMute(){

        audio.muted =
            !audio.muted;

        const icon =
            audio.muted ? "🔇" : "🔊";

        muteBtn.textContent = icon;

        fixedMuteBtn.textContent = icon;

    }


    muteBtn.addEventListener(
        "click",
        toggleMute
    );

    fixedMuteBtn.addEventListener(
        "click",
        toggleMute
    );


    /* =========================================
       PROGRAMACIÓN
    ========================================= */

    const programs = [

        {
            start:0,
            end:6,
            host:"Martina",
            title:"Night & Relax",
            description:
                "Música actual y compañía durante la noche."
        },

        {
            start:6,
            end:10,
            host:"Enrique",
            title:"Noticias",
            description:
                "La Rioja, Argentina y las noticias del mundo."
        },

        {
            start:10,
            end:14,
            host:"Viviana",
            title:"Entretenimiento",
            description:
                "Música, actualidad y entretenimiento."
        },

        {
            start:14,
            end:18,
            host:"Nicolás",
            title:"Deportes",
            description:
                "Toda la información deportiva."
        },

        {
            start:18,
            end:21,
            host:"Viviana",
            title:"Entretenimiento",
            description:
                "Música, novedades y compañía."
        },

        {
            start:21,
            end:24,
            host:"Martina",
            title:"Night & Relax",
            description:
                "Música actual para cerrar el día."
        }

    ];


    function getProgram(){

        const now =
            new Date();

        const hour =
            now.getHours() +
            now.getMinutes() / 60;


        for(let i=0;i<programs.length;i++){

            const program =
                programs[i];

            if(
                hour >= program.start &&
                hour < program.end
            ){

                return {
                    current:program,
                    index:i
                };

            }

        }


        return {
            current:programs[0],
            index:0
        };

    }


    function formatHour(hour){

        const h =
            String(
                Math.floor(hour)
            ).padStart(2,"0");

        return h + ":00";

    }


    function updateNow(){

        const result =
            getProgram();

        const current =
            result.current;

        const next =
            programs[
                (result.index + 1) %
                programs.length
            ];


        document.getElementById(
            "nowProgram"
        ).textContent =
            current.title;


        document.getElementById(
            "nowHost"
        ).textContent =
            current.host;


        document.getElementById(
            "nowDescription"
        ).textContent =
            current.description;


        document.getElementById(
            "nextProgram"
        ).textContent =
            next.title;


        document.getElementById(
            "nextTime"
        ).textContent =
            formatHour(next.start);


        document.getElementById(
            "fixedProgram"
        ).textContent =
            current.title +
            " · " +
            current.host;


        updateClock();

        renderSchedule(result.index);

    }


    function updateClock(){

        const now =
            new Date();


        const time =
            now.toLocaleTimeString(
                "es-AR",
                {
                    hour:"2-digit",
                    minute:"2-digit"
                }
            );


        document.getElementById(
            "currentTime"
        ).textContent = time;

    }


    function renderSchedule(activeIndex){

        const grid =
            document.getElementById(
                "scheduleGrid"
            );


        grid.innerHTML = "";


        programs.forEach(
            (program,index) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "program-card" +
                    (
                        index === activeIndex
                        ? " current"
                        : ""
                    );


                card.innerHTML = `

                    <div class="program-time">

                        ${formatHour(program.start)}
                        —
                        ${formatHour(program.end)}

                    </div>

                    <div class="program-number">

                        ${String(index + 1).padStart(2,"0")}

                    </div>

                    <h3>
                        ${program.host}
                    </h3>

                    <h4>
                        ${program.title}
                    </h4>

                    <p>
                        ${program.description}
                    </p>

                `;


                grid.appendChild(card);

            }
        );

    }


    updateNow();


    setInterval(
        updateNow,
        30000
    );


    /* =========================================
       NOTICIAS
    ========================================= */

    const newsGrid =
        document.getElementById(
            "newsGrid"
        );

    const refreshNews =
        document.getElementById(
            "refreshNews"
        );

    const tabs =
        document.querySelectorAll(
            ".news-tab"
        );


    let category =
        "La Rioja";


    function getRSS(category){

        let query;


        if(category === "La Rioja"){

            query =
                "La Rioja Argentina noticias";

        }else if(category === "Argentina"){

            query =
                "Argentina noticias";

        }else if(category === "Mundo"){

            query =
                "mundo noticias";

        }else{

            query =
                "deportes Argentina noticias";

        }


        return (
            "https://news.google.com/rss/search?q=" +
            encodeURIComponent(query) +
            "&hl=es-419&gl=AR&ceid=AR:es-419"
        );

    }


    async function loadNews(){

        newsGrid.innerHTML = `

            <article class="news-loading">

                <div class="loading-circle"></div>

                <p>
                    Actualizando ${category}...
                </p>

            </article>

        `;


        const rss =
            getRSS(category);


        const proxy =
            "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(rss);


        try{

            const response =
                await fetch(
                    proxy,
                    {
                        cache:"no-store"
                    }
                );


            if(!response.ok){

                throw new Error(
                    "RSS error"
                );

            }


            const text =
                await response.text();


            const xml =
                new DOMParser()
                .parseFromString(
                    text,
                    "text/xml"
                );


            const items =
                Array.from(
                    xml.querySelectorAll("item")
                ).slice(0,9);


            if(!items.length){

                throw new Error(
                    "Sin noticias"
                );

            }


            newsGrid.innerHTML = "";


            items.forEach(item => {

                const title =
                    item.querySelector(
                        "title"
                    )?.textContent ||
                    "Noticia";


                const link =
                    item.querySelector(
                        "link"
                    )?.textContent ||
                    "#";


                const source =
                    item.querySelector(
                        "source"
                    )?.textContent ||
                    "Noticias";


                const date =
                    item.querySelector(
                        "pubDate"
                    )?.textContent ||
                    "";


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "news-card";


                article.innerHTML = `

                    <div class="news-source">

                        ${escapeHTML(source)}

                    </div>

                    <h3>

                        ${escapeHTML(title)}

                    </h3>

                    <p>

                        ${formatDate(date)}

                    </p>

                    <a
                        href="${safeURL(link)}"
                        target="_blank"
                        rel="noopener noreferrer">

                        LEER NOTICIA →

                    </a>

                `;


                newsGrid.appendChild(
                    article
                );

            });


        }catch(error){

            console.error(error);


            newsGrid.innerHTML = `

                <article class="news-loading">

                    <p>
                        No se pudieron cargar
                        las noticias.
                    </p>

                    <p>
                        Presioná actualizar para intentar nuevamente.
                    </p>

                </article>

            `;

        }

    }


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                tabs.forEach(
                    item =>
                    item.classList.remove(
                        "active"
                    )
                );


                tab.classList.add(
                    "active"
                );


                category =
                    tab.dataset.category;


                loadNews();

            }
        );

    });


    refreshNews.addEventListener(
        "click",
        loadNews
    );


    loadNews();


    /*
       Actualizar noticias
       cada 10 minutos.
    */

    setInterval(
        loadNews,
        10 * 60 * 1000
    );


    /* =========================================
       FUNCIONES AUXILIARES
    ========================================= */

    function escapeHTML(value){

        return String(value)
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;")
            .replace(/'/g,"&#039;");

    }


    function safeURL(value){

        try{

            const url =
                new URL(value);


            if(
                url.protocol === "https:" ||
                url.protocol === "http:"
            ){

                return url.href;

            }

        }catch(e){}


        return "#";

    }


    function formatDate(value){

        if(!value){

            return "Actualizado recientemente";

        }


        const date =
            new Date(value);


        if(
            Number.isNaN(
                date.getTime()
            )
        ){

            return value;

        }


        return date.toLocaleString(
            "es-AR",
            {
                dateStyle:"medium",
                timeStyle:"short"
            }
        );

    }

});
