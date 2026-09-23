/* =========================================================
   ARENA 24 RADIO Y TV
   APP.JS PRO
   ========================================================= */


/* ================= RADIO ================= */

const STREAM_URL =
  "https://stream.zeno.fm/zuw6xmmwmd0uv";

const TIME_ZONE =
  "America/Argentina/La_Rioja";


const audio =
  document.getElementById("arena24Audio");

const playButton =
  document.getElementById("arena24Play");

const playIcon =
  document.getElementById("arena24PlayIcon");

const volumeControl =
  document.getElementById("arena24Volume");

const statusText =
  document.getElementById("arena24Status");

const connectionState =
  document.getElementById("connectionState");

const fixedPlay =
  document.getElementById("fixedPlay");


/* ================= CONFIGURAR AUDIO ================= */

audio.src = STREAM_URL;

audio.volume = 0.85;

audio.preload = "none";


/* ================= ESTADO ================= */

let radioPlaying = false;


/* ================= REPRODUCIR ================= */

async function playRadio(){

  try{

    statusText.textContent =
      "CONECTANDO...";

    connectionState.textContent =
      "CONECTANDO CON ARENA 24";

    audio.src = STREAM_URL;

    audio.load();

    await audio.play();

    radioPlaying = true;

    updatePlayerUI(true);

  }

  catch(error){

    console.error(
      "Error reproduciendo ARENA 24:",
      error
    );

    radioPlaying = false;

    updatePlayerUI(false);

    statusText.textContent =
      "TOCÁ PLAY PARA INTENTAR NUEVAMENTE";

    connectionState.textContent =
      "NO SE PUDO CONECTAR";

  }

}


/* ================= DETENER ================= */

function pauseRadio(){

  audio.pause();

  radioPlaying = false;

  updatePlayerUI(false);

}


/* ================= PLAY / PAUSE ================= */

async function toggleRadio(){

  if(audio.paused){

    await playRadio();

  }else{

    pauseRadio();

  }

}


/* ================= INTERFAZ ================= */

function updatePlayerUI(isPlaying){

  if(isPlaying){

    playIcon.textContent =
      "❚❚";

    playButton.classList.add(
      "playing"
    );

    statusText.textContent =
      "RADIO EN VIVO";

    connectionState.textContent =
      "CONECTADO";

    if(fixedPlay){

      fixedPlay.textContent =
        "❚❚";

    }

  }else{

    playIcon.textContent =
      "▶";

    playButton.classList.remove(
      "playing"
    );

    statusText.textContent =
      "RADIO DETENIDA";

    if(fixedPlay){

      fixedPlay.textContent =
        "▶";

    }

  }

}


/* ================= BOTONES ================= */

if(playButton){

  playButton.addEventListener(
    "click",
    toggleRadio
  );

}


if(fixedPlay){

  fixedPlay.addEventListener(
    "click",
    toggleRadio
  );

}


/* ================= VOLUMEN ================= */

if(volumeControl){

  volumeControl.addEventListener(
    "input",
    function(){

      audio.volume =
        Number(this.value);

      const icon =
        document.getElementById(
          "arena24VolumeIcon"
        );

      if(audio.volume === 0){

        icon.textContent =
          "🔇";

      }else if(audio.volume < 0.5){

        icon.textContent =
          "🔉";

      }else{

        icon.textContent =
          "🔊";

      }

    }
  );

}


/* ================= EVENTOS AUDIO ================= */

audio.addEventListener(
  "playing",
  function(){

    radioPlaying = true;

    updatePlayerUI(true);

  }
);


audio.addEventListener(
  "pause",
  function(){

    if(!audio.ended){

      radioPlaying = false;

      updatePlayerUI(false);

    }

  }
);


audio.addEventListener(
  "waiting",
  function(){

    statusText.textContent =
      "CARGANDO SEÑAL...";

    connectionState.textContent =
      "ESPERANDO AUDIO";

  }
);


audio.addEventListener(
  "canplay",
  function(){

    if(!radioPlaying){

      connectionState.textContent =
        "SEÑAL DISPONIBLE";

    }

  }
);


audio.addEventListener(
  "error",
  function(){

    radioPlaying = false;

    updatePlayerUI(false);

    statusText.textContent =
      "ERROR DE SEÑAL";

    connectionState.textContent =
      "REVISÁ LA CONEXIÓN";

  }
);


/* =========================================================
   RELOJ ARGENTINO
   ========================================================= */

function updateClock(){

  const now =
    new Date();


  const time =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }
    ).format(now);


  const date =
    new Intl.DateTimeFormat(
      "es-AR",
      {
        timeZone: TIME_ZONE,
        weekday: "long",
        day: "2-digit",
        month: "long"
      }
    ).format(now);


  const clock =
    document.getElementById(
      "arena24Clock"
    );

  const dateElement =
    document.getElementById(
      "arena24Date"
    );

  const fixedClock =
    document.getElementById(
      "fixedClock"
    );

  const horaActual =
    document.getElementById(
      "horaActual"
    );


  if(clock)
    clock.textContent = time;

  if(dateElement)
    dateElement.textContent =
      "La Rioja · " + date;

  if(fixedClock)
    fixedClock.textContent =
      time.substring(0,5);

  if(horaActual)
    horaActual.textContent =
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
    start: 6,
    end: 12,
    name: "ENRIQUE",
    description:
      "Noticias, actualidad e información de La Rioja, Argentina y el mundo."
  },

  {
    start: 12,
    end: 16,
    name: "ARENA 24 SIESTA",
    description:
      "Música para acompañarte durante la siesta."
  },

  {
    start: 16,
    end: 20,
    name: "VIANA",
    description:
      "Entretenimiento, música y compañía."
  },

  {
    start: 20,
    end: 23,
    name: "NIC",
    description:
      "Deportes, protagonistas, resultados y actualidad."
  },

  {
    start: 23,
    end: 24,
    name: "MAR",
    description:
      "Relax, música actual y compañía durante la noche."
  },

  {
    start: 0,
    end: 6,
    name: "MAR",
    description:
      "Relax, música actual y compañía durante la noche."
  }

];


function getCurrentProgram(){

  const now =
    new Date();

  const hour =
    Number(
      new Intl.DateTimeFormat(
        "es-AR",
        {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          hour12: false
        }
      ).format(now)
    );


  return schedule.find(
    program =>
      hour >= program.start &&
      hour < program.end
  ) || schedule[0];

}


function updateProgram(){

  const program =
    getCurrentProgram();


  const programaActual =
    document.getElementById(
      "programaActual"
    );

  const descripcionActual =
    document.getElementById(
      "descripcionActual"
    );

  const locutorActual =
    document.getElementById(
      "locutorActual"
    );

  const playerProgram =
    document.getElementById(
      "playerProgram"
    );

  const playerDescription =
    document.getElementById(
      "playerDescription"
    );

  const fixedProgram =
    document.getElementById(
      "fixedProgram"
    );

  const fixedLocutor =
    document.getElementById(
      "fixedLocutor"
    );


  if(programaActual)
    programaActual.textContent =
      program.name;

  if(descripcionActual)
    descripcionActual.textContent =
      program.description;

  if(locutorActual)
    locutorActual.textContent =
      program.name;

  if(playerProgram)
    playerProgram.textContent =
      program.name;

  if(playerDescription)
    playerDescription.textContent =
      program.description;

  if(fixedProgram)
    fixedProgram.textContent =
      program.name;

  if(fixedLocutor)
    fixedLocutor.textContent =
      program.description;

}


updateProgram();

setInterval(
  updateProgram,
  30000
);


/* =========================================================
   DESTACAR PROGRAMA ACTUAL
   ========================================================= */

function highlightSchedule(){

  const cards =
    document.querySelectorAll(
      ".schedule-card"
    );

  const current =
    getCurrentProgram();


  cards.forEach(
    card => {

      card.classList.remove(
        "active-program"
      );

      const title =
        card.querySelector("h3");

      if(
        title &&
        title.textContent.trim() ===
        current.name
      ){

        card.classList.add(
          "active-program"
        );

      }

    }
  );

}


highlightSchedule();

setInterval(
  highlightSchedule,
  30000
);


/* =========================================================
   MENÚ MÓVIL
   ========================================================= */

const menuButton =
  document.getElementById(
    "menuButton"
  );

const mainNav =
  document.getElementById(
    "mainNav"
  );


if(menuButton){

  menuButton.addEventListener(
    "click",
    function(){

      mainNav.classList.toggle(
        "open"
      );

    }
  );

}


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
   NOTICIAS
   ========================================================= */

const newsFilters =
  document.querySelectorAll(
    ".news-filter"
  );

const newsCards =
  document.querySelectorAll(
    ".news-card"
  );


newsFilters.forEach(
  button => {

    button.addEventListener(
      "click",
      function(){

        newsFilters.forEach(
          item =>
            item.classList.remove(
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

            }else{

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
   ANIMACIONES
   ========================================================= */

const animatedElements =
  document.querySelectorAll(
    ".section, .schedule-card, .news-card, .social-card, .special-card, .ad-card, .contact-card"
  );


const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if(entry.isIntersecting){

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


animatedElements.forEach(
  element =>
    observer.observe(element)
);


/* =========================================================
   VISUALIZADOR
   ========================================================= */

const visualizer =
  document.getElementById(
    "visualizer"
  );


function visualizerOn(){

  if(!visualizer)
    return;

  visualizer.classList.add(
    "active"
  );

}


function visualizerOff(){

  if(!visualizer)
    return;

  visualizer.classList.remove(
    "active"
  );

}


audio.addEventListener(
  "playing",
  visualizerOn
);

audio.addEventListener(
  "pause",
  visualizerOff
);

audio.addEventListener(
  "error",
  visualizerOff
);


/* =========================================================
   TECLADO
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
   ARENA 24 TV
   =========================================================

   IMPORTANTE:

   En una página GitHub estática no se puede consultar
   directamente desde JavaScript el estado "LIVE" de
   YouTube debido a las restricciones del iframe.

   Por eso existe TV_LIVE.

   false = fondo de TV fuera de aire
   true  = mostrar transmisión YouTube

   Cuando quieras transmitir en vivo, cambiás:

   const TV_LIVE = true;

   ========================================================= */


const TV_LIVE = false;


const tvIframe =
  document.getElementById(
    "arena24TV"
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

const tvBackground =
  document.getElementById(
    "tvBackground"
  );


function setTVMode(live){

  if(live){

    if(tvIframe)
      tvIframe.style.display =
        "block";

    if(tvOffline)
      tvOffline.style.display =
        "none";

    if(tvLiveBadge)
      tvLiveBadge.style.display =
        "block";

    if(tvModeButton)
      tvModeButton.textContent =
        "TV EN VIVO";

  }else{

    if(tvIframe)
      tvIframe.style.display =
        "none";

    if(tvOffline)
      tvOffline.style.display =
        "flex";

    if(tvLiveBadge)
      tvLiveBadge.style.display =
        "none";

    if(tvModeButton)
      tvModeButton.textContent =
        "TV FUERA DE AIRE";

  }

}


/* Estado inicial */

setTVMode(
  TV_LIVE
);


/* Botón para probar ambos modos */

if(tvModeButton){

  tvModeButton.addEventListener(
    "click",
    function(){

      const currentlyLive =
        tvIframe &&
        tvIframe.style.display !== "none";

      setTVMode(
        !currentlyLive
      );

    }
  );

}


/* =========================================================
   VIDEO DE FONDO TV
   ========================================================= */

if(tvBackground){

  tvBackground.play().catch(
    () => {

      /*
        Algunos navegadores bloquean
        autoplay hasta que el usuario
        interactúa con la página.
      */

    }
  );

}


/* =========================================================
   INICIO
   ========================================================= */

console.log(
  "ARENA 24 Radio y TV — sistema iniciado correctamente."
);

console.log(
  "Stream:",
  STREAM_URL
);

console.log(
  "TV:",
  TV_LIVE ? "EN VIVO" : "FUERA DE AIRE"
);
