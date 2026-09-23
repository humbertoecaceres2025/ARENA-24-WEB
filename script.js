/* =====================================================
   ARENA 24
   JAVASCRIPT
   REPRODUCTOR ESTABLE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* =================================================
       RADIO
    ================================================= */

    const radio =
        document.getElementById("radioPlayer");

    const playButton =
        document.getElementById("playButton");

    const volume =
        document.getElementById("volume");

    const volumeValue =
        document.getElementById("volumeValue");

    const radioStatus =
        document.getElementById("radioStatus");

    const radioTitle =
        document.getElementById("radioTitle");

    const radioBox =
        document.querySelector(".radio-box");


    if (radio && playButton) {


        /*
         * VOLUMEN INICIAL
         */

        radio.volume = 0.85;


        /*
         * BOTÓN PLAY / PAUSA
         *
         * IMPORTANTE:
         * NO usamos radio.load()
         * NO cambiamos radio.src
         */

        playButton.addEventListener(
            "click",
            async function () {

                if (radio.paused) {

                    radioStatus.textContent =
                        "Conectando con ARENA 24...";

                    playButton.disabled = true;

                    try {

                        await radio.play();

                    }

                    catch (error) {

                        console.error(
                            "Error de reproducción:",
                            error
                        );

                        radioStatus.textContent =
                            "No se pudo iniciar. Presioná PLAY nuevamente.";

                        radioBox.classList.remove(
                            "playing"
                        );

                    }

                    finally {

                        playButton.disabled = false;

                    }

                }

                else {

                    radio.pause();

                }

            }
        );


        /*
         * CUANDO COMIENZA EL AUDIO
         */

        radio.addEventListener(
            "playing",
            function () {

                playButton.textContent =
                    "Ⅱ";

                playButton.setAttribute(
                    "aria-label",
                    "Pausar radio"
                );

                radioTitle.textContent =
                    "ARENA 24 — EN VIVO";

                radioStatus.textContent =
                    "Transmitiendo desde La Rioja";

                radioBox.classList.add(
                    "playing"
                );

            }
        );


        /*
         * PAUSA
         */

        radio.addEventListener(
            "pause",
            function () {

                playButton.textContent =
                    "▶";

                playButton.setAttribute(
                    "aria-label",
                    "Reproducir radio"
                );

                radioStatus.textContent =
                    "Radio pausada";

                radioBox.classList.remove(
                    "playing"
                );

            }
        );


        /*
         * BUFFER / CONEXIÓN
         */

        radio.addEventListener(
            "waiting",
            function () {

                radioStatus.textContent =
                    "Conectando...";

            }
        );


        /*
         * AUDIO LISTO
         */

        radio.addEventListener(
            "canplay",
            function () {

                if (!radio.paused) {

                    radioStatus.textContent =
                        "Transmitiendo desde La Rioja";

                }

            }
        );


        /*
         * ERROR
         */

        radio.addEventListener(
            "error",
            function () {

                console.error(
                    "Error del stream:",
                    radio.error
                );

                playButton.textContent =
                    "▶";

                radioStatus.textContent =
                    "Error de conexión. Probá nuevamente.";

                radioBox.classList.remove(
                    "playing"
                );

            }
        );


        /*
         * VOLUMEN
         */

        if (volume) {

            volume.addEventListener(
                "input",
                function () {

                    const value =
                        Number(volume.value);

                    radio.volume =
                        value;

                    volumeValue.textContent =
                        Math.round(value * 100) + "%";

                }
            );

        }

    }



    /* =================================================
       FILTRO DE NOTICIAS
    ================================================= */

    const filters =
        document.querySelectorAll(".filter");

    const news =
        document.querySelectorAll(".news-card");


    filters.forEach(
        function (filter) {

            filter.addEventListener(
                "click",
                function () {

                    filters.forEach(
                        function (button) {

                            button.classList.remove(
                                "active"
                            );

                        }
                    );


                    filter.classList.add(
                        "active"
                    );


                    const category =
                        filter.dataset.category;


                    news.forEach(
                        function (card) {

                            if (
                                category === "all" ||
                                card.dataset.category === category
                            ) {

                                card.style.display =
                                    "";

                            }

                            else {

                                card.style.display =
                                    "none";

                            }

                        }
                    );

                }
            );

        }
    );



    /* =================================================
       PROGRAMACIÓN AUTOMÁTICA
    ================================================= */

    const currentProgram =
        document.getElementById(
            "currentProgram"
        );

    const currentDescription =
        document.getElementById(
            "currentDescription"
        );


    function updateProgram() {

        const now =
            new Date();

        const hour =
            now.getHours();


        let program =
            "ARENA 24 RADIO";

        let description =
            "Siempre con vos.";


        if (
            hour >= 6 &&
            hour < 12
        ) {

            program =
                "ENRIQUE — NOTICIAS";

            description =
                "Noticias, actualidad y La Rioja.";

        }

        else if (
            hour >= 12 &&
            hour < 16
        ) {

            program =
                "ARENA 24 SIESTA";

            description =
                "Música y compañía.";

        }

        else if (
            hour >= 16 &&
            hour < 20
        ) {

            program =
                "VIVIANA — ENTRETENIMIENTO";

            description =
                "Entretenimiento y música.";

        }

        else if (
            hour >= 20 &&
            hour < 23
        ) {

            program =
                "NICOLÁS — DEPORTES";

            description =
                "Toda la actualidad deportiva.";

        }

        else {

            program =
                "MARTINA — RELAX";

            description =
                "Relax y música actual.";

        }


        if (currentProgram) {

            currentProgram.textContent =
                program;

        }


        if (currentDescription) {

            currentDescription.textContent =
                description;

        }

    }


    updateProgram();


    setInterval(
        updateProgram,
        60000
    );



    /* =================================================
       ANIMACIÓN DE SECCIONES
    ================================================= */

    const sections =
        document.querySelectorAll(
            ".section"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.08
                }
            );


        sections.forEach(
            function (section) {

                observer.observe(section);

            }
        );

    }


});
