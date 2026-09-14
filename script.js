/* =========================================================
   ARENA 24 RADIO WEB 3.0
   JavaScript principal
   La Rioja, Argentina
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const ARENA24 = {
    stream: "https://stream.zeno.fm/zuw6xmmwmd0uv",
    stationName: "ARENA 24",
    location: "La Rioja, Argentina"
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const audio = document.getElementById("radioAudio");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const volumeControl = document.getElementById("volumeControl");
const liveStatus = document.getElementById("liveStatus");
const currentProgram = document.getElementById("currentProgram");
const clock = document.getElementById("clock");
const year = document.getElementById("year");
const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelector(".nav-links");


/* =========================================================
   INICIALIZAR STREAM
   ========================================================= */

if (audio) {
    audio.src = ARENA24.stream;
    audio.preload = "none";
    audio.volume = 0.85;
}


/* =========================================================
   REPRODUCTOR PLAY / PAUSA
   ========================================================= */

async function toggleRadio() {

    if (!audio) return;

    try {

        if (audio.paused) {

            await audio.play();

            setPlayingState(true);

        } else {

            audio.pause();

            setPlayingState(false);
        }

    } catch (error) {

        console.error(
            "No se pudo iniciar ARENA 24:",
            error
        );

        updateStatus("Presioná nuevamente PLAY");
    }
}


/* =========================================================
   ESTADO DEL PLAYER
   ========================================================= */

function setPlayingState(isPlaying) {

    if (playIcon) {

        playIcon.textContent =
            isPlaying ? "❚❚" : "▶";
    }

    if (playButton) {

        playButton.setAttribute(
            "aria-label",
            isPlaying
                ? "Pausar ARENA 24"
                : "Escuchar ARENA 24"
        );
    }

    if (liveStatus) {

        liveStatus.textContent =
            isPlaying
                ? "EN VIVO"
                : "RADIO ONLINE";
    }

    document.body.classList.toggle(
        "radio-playing",
        isPlaying
    );
}


/* =========================================================
   BOTÓN PLAY
   ========================================================= */

if (playButton) {

    playButton.addEventListener(
        "click",
        toggleRadio
    );
}


/* =========================================================
   EVENTOS DEL AUDIO
   ========================================================= */

if (audio) {

    audio.addEventListener(
        "playing",
        () => {
            setPlayingState(true);
            updateStatus("ARENA 24 EN VIVO");
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            setPlayingState(false);
        }
    );

    audio.addEventListener(
        "waiting",
        () => {
            updateStatus("Conectando...");
        }
    );

    audio.addEventListener(
        "error",
        () => {
            updateStatus(
                "No se pudo conectar al streaming"
            );
        }
    );
}


/* =========================================================
   VOLUMEN
   ========================================================= */

if (volumeControl && audio) {

    volumeControl.addEventListener(
        "input",
        function () {

            audio.volume =
                Number(this.value);

        }
    );
}


/* =========================================================
   ESTADO DEL PLAYER
   ========================================================= */

function updateStatus(message) {

    const statusElement =
        document.getElementById("playerStatus");

    if (statusElement) {

        statusElement.textContent =
            message;
    }
}


/* =========================================================
   RELOJ EN VIVO
   ========================================================= */

function updateClock() {

    if (!clock) return;

    const now = new Date();

    const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    clock.textContent =
        now.toLocaleTimeString(
            "es-AR",
            options
        );
}

updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   AÑO AUTOMÁTICO
   ========================================================= */

if (year) {

    year.textContent =
        new Date().getFullYear();
}


/* =========================================================
   MENÚ MOBILE
   ========================================================= */

if (menuButton && navLinks) {

    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "menu-open"
            );

            menuButton.classList.toggle(
                "active"
            );

        }
    );


    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove(
                        "menu-open"
                    );

                    menuButton.classList.remove(
                        "active"
                    );
                }
            );

        });
}


/* =========================================================
   SCROLL SUAVE
   ========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


/* =========================================================
   DETECCIÓN DE SECCIÓN ACTIVA
   ========================================================= */

const sections =
    document.querySelectorAll("section[id]");

const navigationLinks =
    document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

if (sections.length && navigationLinks.length) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    navigationLinks.forEach(
                        link => {

                            link.classList.remove(
                                "active"
                            );

                            if (
                                link.getAttribute(
                                    "href"
                                ) ===
                                "#" + entry.target.id
                            ) {

                                link.classList.add(
                                    "active"
                                );
                            }

                        }
                    );

                });

            },
            {
                threshold: 0.35
            }
        );

    sections.forEach(
        section =>
            observer.observe(section)
    );
}


/* =========================================================
   ANIMACIONES AL HACER SCROLL
   ========================================================= */

const animatedElements =
    document.querySelectorAll(
        ".news-card, .social-card, .schedule-item, .radio-player"
    );

if (animatedElements.length) {

    const animationObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "fade-up"
                        );

                        animationObserver.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

    animatedElements.forEach(
        element =>
            animationObserver.observe(element)
    );
}


/* =========================================================
   PROGRAMACIÓN ARENA 24
   ========================================================= */

const programs = [
    {
        start: 6,
        end: 10,
        name: "ARENA 24 NOTICIAS",
        host: "Enrique",
        description:
            "Noticias de La Rioja, Argentina y el mundo."
    },

        description:
            "La mejor música durante la mañana."
    },

    {
    {
        start: 10,
        end: 13,
        name: "ARENA 24 MÚSICA",
        host: "ARENA 24",
        start: 13,
        end: 16,
        name: "ARENA 24 ENTRETENIMIENTO",
        host: "Viviana",
        description:
            "Entretenimiento, actualidad y compañía."
    },

    {
        start: 16,
        end: 20,
        name: "ARENA 24 DEPORTES",
        host: "Nicolás",
        description:
            "Toda la información deportiva."
    },

    {
        start: 20,
        end: 24,
        name: "ARENA 24 RELAX",
        host: "Martina",
        description:
            "Música actual y un cierre relajado."
    }
];


function getCurrentProgram() {

    const hour =
        new Date().getHours();

    return programs.find(
        program =>
            hour >= program.start &&
            hour < program.end
    );
}


function updateCurrentProgram() {

    if (!currentProgram)
        return;

    const program =
        getCurrentProgram();

    if (!program) {

        currentProgram.textContent =
            "ARENA 24 — Siempre con vos";

        return;
    }

    currentProgram.innerHTML = `
        <strong>${program.name}</strong>
        <span>${program.host} · ${program.description}</span>
    `;
}
