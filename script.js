"use strict";

/* =========================================================
   ARENA 24 RADIO Y TV 5.0
========================================================= */

const CONFIG = {

    radioStream:
        "https://stream.zeno.fm/zuw6xmmwmd0uv",

    youtubeChannel:
        "UCrHexRcAlWkaTn8P-BLT3LA",

    timeZone:
        "America/Argentina/La_Rioja"

};


/* =========================================================
   ELEMENTOS
========================================================= */

const audio =
    document.getElementById("radioAudio");

const playButton =
    document.getElementById("playButton");

const muteButton =
    document.getElementById("muteButton");

const volumeControl =
    document.getElementById("volumeControl");

const radioConsole =
    document.querySelector(".radio-console");

const radioStatus =
    document.getElementById("radioStatus");

const radioConnection =
    document.getElementById("radioConnection");

const statusLight =
    document.getElementById("statusLight");

const statusText =
    document.getElementById("statusText");

const radioHelp =
    document.getElementById("radioHelp");

const floatingRadio =
    document.getElementById("floatingRadio");

const clock =
    document.getElementById("clock");

const date =
    document.getElementById("date");


/* =========================================================
   VARIABLES
========================================================= */

let reconnectTimer = null;

let userStopped = true;


/* =========================================================
   VOLUMEN
========================================================= */

audio.volume = 0.85;

volumeControl.value = "0.85";


/* =========================================================
   PREPARAR STREAM
========================================================= */

function prepareStream(){

    audio.pause();

    audio.removeAttribute("src");

    audio.load();

    /*
      Usamos directamente la URL que el usuario
      confirmó que funciona técnicamente.
    */

    audio.src = CONFIG.radioStream;

    audio.preload = "none";

}


/* =========================================================
   INICIAR RADIO
========================================================= */

async function startRadio(){

    userStopped = false;

    clearTimeout(reconnectTimer);

    setConnecting();

    /*
      Volvemos a cargar el stream al iniciar.
      Esto evita conservar un estado fallido
      anterior del elemento audio.
    */

    prepareStream();

    try{

        await audio.play();

        setPlaying();

    }catch(error){

        console.error(
            "ARENA 24 - Error al reproducir:",
            error
        );

        /*
          Segundo intento.
          Algunos navegadores necesitan que
          el elemento tenga el src cargado
          antes de play().
        */

        setTimeout(async()=>{

            if(userStopped) return;

            try{

                await audio.play();

                setPlaying();

            }catch(secondError){

                console.error(
                    "ARENA 24 - Segundo intento:",
                    secondError
                );

                setError(
                    "No se pudo iniciar el audio. Tocá nuevamente ▶."
                );

            }

        },400);

    }

}


/* =========================================================
   DETENER
========================================================= */

function stopRadio(){

    userStopped = true;

    clearTimeout(reconnectTimer);

    audio.pause();

    setStopped();

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

playButton.addEventListener(
    "click",
    ()=>{

        if(audio.paused){

            startRadio();

        }else{

            stopRadio();

        }

    }
);


/* =========================================================
   EVENTOS DEL AUDIO
========================================================= */

audio.addEventListener(
    "playing",
    ()=>{
        setPlaying();
    }
);


audio.addEventListener(
    "canplay",
    ()=>{

        if(!audio.paused){

            setPlaying();

        }

    }
);


audio.addEventListener(
    "waiting",
    ()=>{

        if(!userStopped){

            setConnecting();

        }

    }
);


audio.addEventListener(
    "stalled",
    ()=>{

        if(!userStopped){

            setConnecting();

        }

    }
);


audio.addEventListener(
    "error",
    ()=>{

        if(userStopped) return;

        console.error(
            "ARENA 24 - Error del stream:",
            audio.error
        );

        setError(
            "Reconectando con ARENA 24..."
        );

        clearTimeout(reconnectTimer);

        reconnectTimer =
            setTimeout(
                ()=>{
                    if(!userStopped){
                        startRadio();
                    }
                },
                5000
            );

    }
);


/* =========================================================
   ESTADO REPRODUCIENDO
========================================================= */

function setPlaying(){

    radioConsole.classList.add(
        "playing"
    );

    radioStatus.textContent =
        "EN VIVO";

    radioConnection.textContent =
        "CONEXIÓN ESTABLE";

    statusText.textContent =
        "ONLINE";

    statusLight.classList.add(
        "connected"
    );

    playButton.textContent =
        "❚❚";

    radioHelp.textContent =
        "Estás escuchando ARENA 24 Radio · La Rioja Argentina.";

}


/* =========================================================
   ESTADO CONECTANDO
========================================================= */

function setConnecting(){

    radioConsole.classList.remove(
        "playing"
    );

    radioStatus.textContent =
        "CONECTANDO";

    radioConnection.textContent =
        "CONECTANDO CON ZENO";

    statusText.textContent =
        "CONECTANDO";

    statusLight.classList.remove(
        "connected"
    );

    playButton.textContent =
        "▶";

    radioHelp.textContent =
        "Conectando con ARENA 24 Radio...";

}


/* =========================================================
   ESTADO DETENIDO
========================================================= */

function setStopped(){

    radioConsole.classList.remove(
        "playing"
    );

    radioStatus.textContent =
        "LISTO";

    radioConnection.textContent =
        "ESPERANDO CONEXIÓN";

    statusText.textContent =
        "OFFLINE";

    statusLight.classList.remove(
        "connected"
    );

    playButton.textContent =
        "▶";

    radioHelp.textContent =
        "Presioná ▶ para comenzar a escuchar.";

}


/* =========================================================
   ERROR
========================================================= */

function setError(message){

    radioConsole.classList.remove(
        "playing"
    );

    radioStatus.textContent =
        "ERROR DE CONEXIÓN";

    radioConnection.textContent =
        "REVISANDO STREAM";

    statusText.textContent =
        "SIN SEÑAL";

    statusLight.classList.remove(
        "connected"
    );

    playButton.textContent =
        "▶";

    radioHelp.textContent =
        message;

}


/* =========================================================
   MUTE
========================================================= */

muteButton.addEventListener(
    "click",
    ()=>{

        audio.muted =
            !audio.muted;

        muteButton.textContent =
            audio.muted
                ? "🔇"
                : "🔊";

    }
);


/* =========================================================
   VOLUMEN
========================================================= */

volumeControl.addEventListener(
    "input",
    ()=>{

        const value =
            Number(
                volumeControl.value
            );

        audio.volume =
            value;

        if(value === 0){

            audio.muted = true;

            muteButton.textContent =
                "🔇";

        }else{

            audio.muted = false;

            muteButton.textContent =
                "🔊";

        }

    }
);


/* =========================================================
   BOTÓN FLOTANTE
========================================================= */

floatingRadio.addEventListener(
    "click",
    ()=>{

        if(audio.paused){

            startRadio();

        }else{

            stopRadio();

        }

    }
);


/* =========================================================
   RELOJ LA RIOJA
========================================================= */

function updateClock(){

    const now =
        new Date();


    const time =
        new Intl.DateTimeFormat(
            "es-AR",
            {
                timeZone:
                    CONFIG.timeZone,

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                hour12:
                    false
            }
        ).format(now);


    const currentDate =
        new Intl.DateTimeFormat(
            "es-AR",
            {
                timeZone:
                    CONFIG.timeZone,

                weekday:
                    "long",

                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"
            }
        ).format(now);


    clock.textContent =
        time;


    date.textContent =
        currentDate
            .charAt(0)
            .toUpperCase()
        +
        currentDate.slice(1);

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   VISIBILIDAD
========================================================= */

document.addEventListener(
    "visibilitychange",
    ()=>{

        /*
          No iniciamos audio automáticamente.
          El navegador debe recibir una acción
          del usuario para permitir reproducción.
        */

        if(
            !document.hidden &&
            !audio.paused
        ){

            setPlaying();

        }

    }
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

prepareStream();

setStopped();


console.log(
    "ARENA 24 5.0 — Radio y TV iniciada."
);
