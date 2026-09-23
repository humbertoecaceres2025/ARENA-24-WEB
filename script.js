/* =========================================================
   ARENA 24 RADIO Y TV 5.0
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const STREAM_URL =
    "https://stream.zeno.fm/zuw6xmmwmd0uv";

const TIME_ZONE =
    "America/Argentina/La_Rioja";


/*
   TV_LIVE

   false = TV fuera de aire + fondo cinematográfico
   true  = TV YouTube en vivo

   IMPORTANTE:
   En GitHub Pages no podemos consultar de forma fiable
   el estado LIVE de YouTube directamente desde el iframe.

   Este sistema queda preparado para automatización.
*/

let TV_LIVE = false;


/* =========================================================
   ELEMENTOS RADIO
   ========================================================= */

const audio =
    document.getElementById(
        "arena24Audio"
    );

const playButton =
    document.getElementById(
        "arena24Play"
    );

const playIcon =
    document.getElementById(
        "arena24PlayIcon"
    );

const fixedPlay =
    document.getElementById(
        "fixedPlay"
    );

const volumeControl =
    document.getElementById(
        "arena24Volume"
    );

const status =
    document.getElementById(
        "arena24Status"
    );

const connection =
    document.getElementById(
        "connectionState"
    );

const connection2 =
    document.getElementById(
        "connectionState2"
    );

const errorBox =
    document.getElementById(
        "radioError"
    );

const retryButton =
    document.getElementById(
        "radioRetry"
    );

const visualizer =
    document.getElementById(
        "visualizer"
    );


/* =========================================================
   CONFIGURAR AUDIO
   ========================================================= */

audio.src = STREAM_URL;

audio.preload = "none";

audio.volume = 0.85;


/* =========================================================
   ESTADO RADIO
   ========================================================= */

let radioPlaying = false;


/* =========================================================
   UI
   ========================================================= */

function setRadioUI(playing){

    radioPlaying = playing;


    if(playing){

        playIcon.textContent =
            "❚❚";

        fixedPlay.textContent =
            "❚❚";

        status.textContent =
            "RADIO EN VIVO";

        connection.textContent =
            "CONECTADO";

        connection2.textContent =
            "Señal recibida";

        visualizer.classList.add(
            "active"
        );

        errorBox.classList.remove(
            "show"
        );

    }else{

        playIcon.textContent =
            "▶";

        fixedPlay.textContent =
            "▶";

        status.textContent =
            "RADIO DETENIDA";

        connection2.textContent =
            "Tocá PLAY para escuchar";

        visualizer.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   REPRODUCIR
   ========================================================= */

async function startRadio(){

    try{

        status.textContent =
            "CONECTANDO...";

        connection.textContent =
            "CONECTANDO CON ZENO";

        connection2.textContent =
            "Esperando señal...";

        errorBox.classList.remove(
            "show"
        );


        /*
           NO usamos load() antes de play().
           El navegador ya conoce el stream.
        */

        await audio.play();


        setRadioUI(true);

    }

    catch(error){

        console.error(
            "ARENA 24 RADIO:",
            error
        );

        setRadioUI(false);

        status.textContent =
            "NO SE PUDO REPRODUCIR";

        connection.textContent =
            "ERROR DE CONEXIÓN";

        connection2.textContent =
            "Intentá nuevamente";

        errorBox.classList.add(
            "show"
        );

    }

}


/* =========================================================
   DETENER
   ========================================================= */

function stopRadio(){

    audio.pause();

    setRadioUI(false);

}


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

function toggleRadio(){

    if(audio.paused){

        startRadio();

    }else{

        stopRadio();

    }

}


playButton.addEventListener(
    "click",
    toggleRadio
);


fixedPlay.addEventListener(
    "click",
    toggleRadio
);


retryButton.addEventListener(
    "click",
    function(){

        audio.pause();

        audio.currentTime = 0;

        setTimeout(
            startRadio,
            250
        );

    }
);


/* =========================================================
   VOLUMEN
   ========================================================= */

volumeControl.addEventListener(
    "input",
    function(){

        audio.volume =
            Number(this.value);


        const volumeIcon =
            document.getElementById(
                "arena24VolumeIcon"
            );


        if(audio.volume === 0){

            volumeIcon.textContent =
                "🔇";

        }
        else if(audio.volume < .5){

            volumeIcon.textContent =
                "🔉";

        }
        else{

            volumeIcon.textContent =
                "🔊";

        }

    }
);


/* =========================================================
   EVENTOS AUDIO
   ========================================================= */

audio.addEventListener(
    "playing",
    function(){

        setRadioUI(true);

    }
);


audio.addEventListener(
    "pause",
    function(){

        if(!audio.ended){

            setRadioUI(false);

        }

    }
);


audio.addEventListener(
    "waiting",
    function(){

        status.textContent =
            "CARGANDO SEÑAL...";

        connection.textContent =
            "BUFFER DE AUDIO";

    }
);


audio.addEventListener(
    "stalled",
    function(){

        connection2.textContent =
            "Señal temporalmente detenida";

    }
);


audio.addEventListener(
    "error",
    function(){

        setRadioUI(false);

        status.textContent =
            "ERROR DE STREAM";

        connection.textContent =
            "ZENO NO RESPONDE";

        errorBox.classList.add(
            "show"
        );

    }
);


/* =========================================================
   RELOJ
   ========================================================= */

function updateClock(){

    const now =
        new Date();


    const time =
        new Intl.DateTimeFormat(
            "es-AR",
            {
                timeZone:TIME_ZONE,
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit",
                hour12:false
            }
        ).format(now);


    const date =
        new Intl.DateTimeFormat(
            "es-AR",
            {
                timeZone:TIME_ZONE,
                weekday:"long",
                day:"2-digit",
                month:"long"
            }
        ).format(now);


    document.getElementById(
        "arena24Clock"
    ).textContent =
        time;


    document.getElementById(
        "arena24Date"
    ).textContent =
        "La Rioja · " + date;


    document.getElementById(
        "horaActual"
    ).textContent =
        time.substring(0,5);


    document.getElementById(
        "fixedClock"
    ).textContent =
        time.substring(0,5);

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   PROGRAMACIÓN
   ========================================================= */

const schedule = [

    {
        start:6,
        end:12,
        name:"ENRIQUE",
        description:
        "Noticias, actualidad e información de La Rioja, Argentina y el mundo."
    },

    {
        start:12,
        end:16,
        name:"ARENA 24 SIESTA",
        description:
        "Música para acompañarte durante la siesta."
    },

    {
        start:16,
        end:20,
        name:"VIANA",
        description:
        "Entretenimiento, música y compañía."
    },

    {
        start:20,
        end:23,
        name:"NIC",
        description:
        "Deportes, protagonistas, resultados y actualidad."
    },

    {
        start:23,
        end:24,
        name:"MAR",
        description:
        "Relax, música actual y compañía durante la noche."
    },

    {
        start:0,
        end:6,
        name:"MAR",
        description:
        "Relax, música actual y compañía durante la noche."
    }

];


function currentProgram(){

    const now =
        new Date();


    const hour =
        Number(
            new Intl.DateTimeFormat(
                "es-AR",
                {
                    timeZone:TIME_ZONE,
                    hour:"2-digit",
                    hour12:false
                }
            ).format(now)
        );


    return schedule.find(
        item =>
        hour >= item.start &&
        hour < item.end
    );

}


function updateProgram(){

    const program =
        currentProgram();


    if(!program)
        return;


    document.getElementById(
        "programaActual"
    ).textContent =
        program.name;


    document.getElementById(
        "descripcionActual"
    ).textContent =
        program.description;


    document.getElementById(
        "locutorActual"
    ).textContent =
        program.name;


    document.getElementById(
        "playerProgram"
    ).textContent =
        program.name;


    document.getElementById(
        "playerDescription"
    ).textContent =
        program.description;


    document.getElementById(
        "fixedProgram"
    ).textContent =
        program.name;


    document.getElementById(
        "fixedLocutor"
    ).textContent =
        program.description;

}


updateProgram();

setInterval(
    updateProgram,
    30000
);


/* =========================================================
   TV AUTOMÁTICA
   ========================================================= */

const tvIframe =
    document.getElementById(
        "tvIframe"
    );

const tvOffline =
    document.getElementById(
        "tvOffline"
    );

const tvLiveBadge =
    document.getElementById(
        "tvLiveBadge"
    );

const tvModeButton =
    document.getElementById(
        "tvModeButton"
    );

const tvStatusLabel =
    document.getElementById(
        "tvStatusLabel"
    );

const tvBackground =
    document.getElementById(
        "tvBackground"
    );


/* =========================================================
   CAMBIAR TV
   ========================================================= */

function setTVMode(live){

    TV_LIVE =
        Boolean(live);


    if(TV_LIVE){

        tvOffline.style.display =
            "none";

        tvIframe.style.display =
            "block";

        tvLiveBadge.style.display =
            "block";

        tvStatusLabel.textContent =
            "● TV EN VIVO";

        tvStatusLabel.style.color =
            "#20e58a";

        tvModeButton.textContent =
            "DESACTIVAR TV EN VIVO";

    }
    else{

        tvIframe.style.display =
            "none";

        tvOffline.style.display =
            "flex";

        tvLiveBadge.style.display =
            "none";

        tvStatusLabel.textContent =
            "● TV FUERA DE AIRE";

        tvStatusLabel.style.color =
            "#ff9a42";

        tvModeButton.textContent =
            "ACTIVAR TV EN VIVO";

    }

}


/* =========================================================
   ESTADO INICIAL
   ========================================================= */

setTVMode(false);


/* =========================================================
   BOTÓN TV
   ========================================================= */

tvModeButton.addEventListener(
    "click",
    function(){

        setTVMode(
            !TV_LIVE
        );

    }
);


/* =========================================================
   VIDEO CINEMATOGRÁFICO
   ========================================================= */

if(tvBackground){

    tvBackground.muted =
        true;

    tvBackground.loop =
        true;

    tvBackground.playsInline =
        true;


    tvBackground.play()
        .catch(
            function(){

                console.log(
                    "El navegador requiere interacción para reproducir el fondo."
                );

            }
        );

}


/* =========================================================
   MENÚ
   ========================================================= */

const menuButton =
    document.getElementById(
        "menuButton"
    );

const mainNav =
    document.getElementById(
        "mainNav"
    );


menuButton.addEventListener(
    "click",
    function(){

        mainNav.classList.toggle(
            "open"
        );

    }
);


document.querySelectorAll(
    ".main-nav a"
).forEach(
    link => {

        link.addEventListener(
            "click",
            function(){

                mainNav.classList.remove(
                    "open"
                );

            }
        );

    }
);


/* =========================================================
   FILTRO NOTICIAS
   ========================================================= */

const newsButtons =
    document.querySelectorAll(
        ".news-button"
    );

const newsCards =
    document.querySelectorAll(
        ".news-card"
    );


newsButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function(){

                newsButtons.forEach(
                    b =>
                    b.classList.remove(
                        "active"
                    )
                );


                this.classList.add(
                    "active"
                );


                const category =
                    this.dataset.category;


                newsCards.forEach(
                    card => {

                        if(
                            category === "all" ||
                            card.dataset.category === category
                        ){

                            card.style.display =
                                "";

                        }
                        else{

                            card.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }
);


/* =========================================================
   TECLA ESPACIO
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        if(
            event.code === "Space" &&
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "TEXTAREA"
        ){

            event.preventDefault();

            toggleRadio();

        }

    }
);


/* =========================================================
   MENSAJE
   ========================================================= */

console.log(
    "ARENA 24 5.0 iniciado."
);

console.log(
    "Radio:",
    STREAM_URL
);

console.log(
    "TV:",
    TV_LIVE
        ? "EN VIVO"
        : "FUERA DE AIRE"
);
