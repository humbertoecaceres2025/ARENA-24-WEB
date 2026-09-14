document.addEventListener("DOMContentLoaded", function(){

    /* =========================
       PLAYER
    ========================= */

    const audio = document.getElementById("radioAudio");
    const playBtn = document.getElementById("playBtn");
    const muteBtn = document.getElementById("muteBtn");
    const equalizer = document.getElementById("equalizer");
    const playerStatus = document.getElementById("playerStatus");

    let playing = false;


    playBtn.addEventListener("click", async function(){

        if(!playing){

            try{

                await audio.play();

                playing = true;

                playBtn.textContent = "❚❚";

                equalizer.classList.add("active");

                playerStatus.textContent =
                    "ARENA 24 está transmitiendo en vivo";

                showToast("ARENA 24 EN VIVO");

            }catch(error){

                playerStatus.textContent =
                    "No se pudo iniciar el streaming. Intentá nuevamente.";

                showToast("No se pudo iniciar el reproductor");

                console.error(error);

            }

        }else{

            audio.pause();

            playing = false;

            playBtn.textContent = "▶";

            equalizer.classList.remove("active");

            playerStatus.textContent =
                "Reproducción pausada";

        }

    });


    muteBtn.addEventListener("click", function(){

        audio.muted = !audio.muted;

        muteBtn.textContent =
            audio.muted ? "🔇" : "🔊";

    });


    audio.addEventListener("waiting", function(){

        playerStatus.textContent =
            "Conectando con ARENA 24...";

    });


    audio.addEventListener("playing", function(){

        playerStatus.textContent =
            "ARENA 24 está transmitiendo en vivo";

    });


    audio.addEventListener("error", function(){

        playerStatus.textContent =
            "No se pudo conectar al streaming.";

        equalizer.classList.remove("active");

    });



    /* =========================
       NOTICIAS
    ========================= */

    const newsGrid =
        document.getElementById("newsGrid");

    const refreshNews =
        document.getElementById("refreshNews");

    const tabs =
        document.querySelectorAll(".news-tab");


    let currentCategory = "La Rioja";


    function googleNewsURL(category){

        let query = category;


        if(category === "La Rioja"){

            query =
                "La Rioja Argentina noticias";

        }

        if(category === "Argentina"){

            query =
                "Argentina noticias";

        }

        if(category === "Mundo"){

            query =
                "mundo noticias";

        }

        if(category === "Deportes"){

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
                    Actualizando noticias de ${currentCategory}...
                </p>

            </article>

        `;


        const rss =
            googleNewsURL(currentCategory);


        const proxy =
            "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(rss);


        try{

            const response =
                await fetch(proxy, {
                    cache:"no-store"
                });


            if(!response.ok){

                throw new Error(
                    "No se pudo obtener el RSS"
                );

            }


            const text =
                await response.text();


            const parser =
                new DOMParser();


            const xml =
                parser.parseFromString(
                    text,
                    "text/xml"
                );


            const items =
                Array.from(
                    xml.querySelectorAll("item")
                ).slice(0,9);


            if(!items.length){

                throw new Error(
                    "No hay noticias disponibles"
                );

            }


            newsGrid.innerHTML = "";


            items.forEach(function(item){

                const title =
                    item.querySelector("title")
                    ?.textContent
                    ?.trim() ||
                    "Noticia sin título";


                const link =
                    item.querySelector("link")
                    ?.textContent
                    ?.trim() ||
                    "#";


                const pubDate =
                    item.querySelector("pubDate")
                    ?.textContent
                    ?.trim() ||
                    "";


                const source =
                    item.querySelector("source")
                    ?.textContent
                    ?.trim() ||
                    "Google News";


                const card =
                    document.createElement("article");


                card.className =
                    "news-card";


                card.innerHTML = `

                    <div class="news-source">
                        ${escapeHTML(source)}
                    </div>

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            formatDate(pubDate)
                        )}
                    </p>

                    <a
                        href="${safeURL(link)}"
                        target="_blank"
                        rel="noopener noreferrer">

                        LEER NOTICIA →

                    </a>

                `;


                newsGrid.appendChild(card);

            });


        }catch(error){

            console.error(error);


            newsGrid.innerHTML = `

                <article class="news-loading">

                    <p>
                        No se pudieron actualizar
                        las noticias en este momento.
                    </p>

                    <p>
                        Intentá nuevamente en unos segundos.
                    </p>

                </article>

            `;

        }

    }


    tabs.forEach(function(tab){

        tab.addEventListener("click", function(){

            tabs.forEach(function(item){

                item.classList.remove("active");

            });


            tab.classList.add("active");


            currentCategory =
                tab.dataset.category;


            loadNews();

        });

    });


    refreshNews.addEventListener(
        "click",
        loadNews
    );


    /* =========================
       ACTUALIZACIÓN AUTOMÁTICA
       10 MINUTOS
    ========================= */

    setInterval(
        loadNews,
        10 * 60 * 1000
    );


    /* =========================
       SEGURIDAD HTML
    ========================= */

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
                url.protocol === "http:" ||
                url.protocol === "https:"
            ){

                return url.href;

            }

        }catch(error){}


        return "#";

    }


    function formatDate(value){

        if(!value){

            return "Actualizado recientemente";

        }


        const date =
            new Date(value);


        if(Number.isNaN(date.getTime())){

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


    /* =========================
       TOAST
    ========================= */

    const toast =
        document.getElementById("toast");


    function showToast(message){

        toast.textContent =
            message;

        toast.classList.add("show");


        setTimeout(function(){

            toast.classList.remove("show");

        },2500);

    }


    /* =========================
       INICIO
    ========================= */

    loadNews();

});
