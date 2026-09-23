/* =========================================================
   ARENA 24 RADIO Y TV 4.0
   Sistema principal
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURACIÓN
     ======================================================= */

  const STREAM_URL =
    "https://stream.zeno.fm/zuw6xmmwmd0uv";

  const TIME_ZONE =
    "America/Argentina/La_Rioja";


  /* =======================================================
     ELEMENTOS
     ======================================================= */

  const audio =
    document.getElementById("arena24Audio");

  const playButton =
    document.getElementById("arena24Play");

  const fixedPlay =
    document.getElementById("fixedPlay");

  const playIcon =
    document.getElementById("arena24PlayIcon");

  const volume =
    document.getElementById("arena24Volume");

  const status =
    document.getElementById("arena24Status");

  const connectionState =
    document.getElementById("connectionState");

  const visualizer =
    document.getElementById("visualizer");

  const clock =
    document.getElementById("arena24Clock");

  const date =
    document.getElementById("arena24Date");

  const hour =
    document.getElementById("horaActual");

  const fixedClock =
    document.getElementById("fixedClock");

  const program =
    document.getElementById("programaActual");

  const description =
    document.getElementById("descripcionActual");

  const locutor =
    document.getElementById("locutorActual");

  const playerProgram =
    document.getElementById("playerProgram");

  const playerDescription =
    document.getElementById("playerDescription");

  const fixedProgram =
    document.getElementById("fixedProgram");

  const fixedLocutor =
    document.getElementById("fixedLocutor");


  /* =======================================================
     STREAM
     ======================================================= */

  if(audio){

    audio.src = STREAM_URL;

    audio.volume =
      volume ? Number(volume.value) : 0.85;

  }


  /* =======================================================
     RELOJ ARGENTINA
     ======================================================= */

  function getArgentinaTime(){

    return new Intl.DateTimeFormat("es-AR", {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());

  }


  function getArgentinaParts(){

    const formatter =
      new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        hour: "numeric",
        minute: "numeric",
        hour12: false
      });

    const parts =
      formatter.formatToParts(new Date());

    const result = {};

    parts.forEach(part => {
      result[part.type] = part.value;
    });

    return {
      hour: Number(result.hour),
      minute: Number(result.minute)
    };

  }


  function updateClock(){

    const now =
      getArgentinaTime();

    if(clock){
      clock.textContent = now;
    }

    if(hour){
      hour.textContent =
        now.substring(0,5);
    }

    if(fixedClock){
      fixedClock.textContent =
        now.substring(0,5);
    }

    if(date){

      const dateText =
        new Intl.DateTimeFormat("es-AR", {
          timeZone: TIME_ZONE,
          weekday:"long",
          day:"2-digit",
          month:"long",
          year:"numeric"
        }).format(new Date());

      date.textContent =
        "La Rioja · " +
        dateText.charAt(0).toUpperCase() +
        dateText.slice(1);

    }

  }


  updateClock();

  setInterval(updateClock,1000);


  /* =======================================================
     PROGRAMACIÓN
     ======================================================= */

  const programs = [

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
        "Relax y música actual durante la noche."
    },

    {
      start:0,
      end:6,
      name:"MAR",
      description:
        "Relax y música actual durante la noche."
    }

  ];


  function updateProgram(){

    const current =
      getArgentinaParts();

    const currentHour =
      current.hour;

    const currentProgram =
      programs.find(item =>
        currentHour >= item.start &&
        currentHour < item.end
      );

    if(!currentProgram) return;


    if(program){
      program.textContent =
        currentProgram.name;
    }

    if(description){
      description.textContent =
        currentProgram.description;
    }

    if(locutor){

      if(currentProgram.name === "ARENA 24 SIESTA"){
        locutor.textContent =
          "ARENA 24";
      }else{
        locutor.textContent =
          "LOCUTOR · " +
          currentProgram.name;
      }

    }


    if(playerProgram){
      playerProgram.textContent =
        currentProgram.name;
    }

    if(playerDescription){
      playerDescription.textContent =
        currentProgram.description;
    }

    if(fixedProgram){
      fixedProgram.textContent =
        currentProgram.name;
    }

    if(fixedLocutor){

      fixedLocutor.textContent =
        currentProgram.name === "ARENA 24 SIESTA"
          ? "Música · Siempre con vos"
          : "Locutor · " + currentProgram.name;

    }


    /* Resaltar programa activo */

    document
      .querySelectorAll(".schedule-card")
      .forEach(card => {

        card.classList.remove("active");

        const title =
          card.querySelector("h3");

        if(!title) return;

        if(
          title.textContent.trim() ===
          currentProgram.name
        ){
          card.classList.add("active");
        }

      });

  }


  updateProgram();

  setInterval(updateProgram,30000);


  /* =======================================================
     REPRODUCTOR
     ======================================================= */

  let isPlaying = false;


  function setPlayingState(state){

    isPlaying = state;


    if(playIcon){
      playIcon.textContent =
        state ? "❚❚" : "▶";
    }

    if(fixedPlay){
      fixedPlay.textContent =
        state ? "❚❚" : "▶";
    }

    if(status){
      status.textContent =
        state
          ? "RADIO EN VIVO"
          : "RADIO DETENIDA";
    }

    if(connectionState){
      connectionState.textContent =
        state
          ? "● CONECTADO"
          : "LISTO PARA ESCUCHAR";
    }

    if(visualizer){

      if(state){
        visualizer.classList.add("playing");
      }else{
        visualizer.classList.remove("playing");
      }

    }

  }


  async function toggleRadio(){

    if(!audio) return;


    if(!isPlaying){

      try{

        /*
         * Recargamos solamente si el navegador
         * perdió la conexión.
         */

        if(
          audio.readyState === 0 ||
          audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
        ){
          audio.src = STREAM_URL;
          audio.load();
        }

        await audio.play();

        setPlayingState(true);

      }catch(error){

        console.error(
          "ARENA 24: error de reproducción",
          error
        );

        if(status){
          status.textContent =
            "NO SE PUDO INICIAR";
        }

        if(connectionState){
          connectionState.textContent =
            "REVISAR CONEXIÓN";
        }

      }

    }else{

      audio.pause();

      setPlayingState(false);

    }

  }


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


  if(audio){

    audio.addEventListener(
      "playing",
      () => setPlayingState(true)
    );

    audio.addEventListener(
      "pause",
      () => setPlayingState(false)
    );

    audio.addEventListener(
      "waiting",
      () => {

        if(status){
          status.textContent =
            "CONECTANDO...";
        }

        if(connectionState){
          connectionState.textContent =
            "CARGANDO SEÑAL";
        }

      }
    );

    audio.addEventListener(
      "error",
      () => {

        setPlayingState(false);

        if(status){
          status.textContent =
            "SEÑAL NO DISPONIBLE";
        }

        if(connectionState){
          connectionState.textContent =
            "REINTENTAR";
        }

      }
    );

  }


  /* =======================================================
     VOLUMEN
     ======================================================= */

  if(volume && audio){

    volume.addEventListener(
      "input",
      () => {

        audio.volume =
          Number(volume.value);

        const icon =
          document.getElementById(
            "arena24VolumeIcon"
          );

        if(!icon) return;

        if(audio.volume === 0){
          icon.textContent = "🔇";
        }else if(audio.volume < .5){
          icon.textContent = "🔉";
        }else{
          icon.textContent = "🔊";
        }

      }
    );

  }


  /* =======================================================
     MENÚ MÓVIL
     ======================================================= */

  const menuButton =
    document.getElementById("menuButton");

  const mainNav =
    document.getElementById("mainNav");


  if(menuButton && mainNav){

    menuButton.addEventListener(
      "click",
      () => {

        mainNav.classList.toggle("open");

      }
    );


    mainNav
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {
            mainNav.classList.remove("open");
          }
        );

      });

  }


  /* =======================================================
     FILTROS DE NOTICIAS
     ======================================================= */

  const filters =
    document.querySelectorAll(
      ".news-filter"
    );

  const newsCards =
    document.querySelectorAll(
      ".news-card"
    );


  filters.forEach(filter => {

    filter.addEventListener(
      "click",
      () => {

        filters.forEach(item =>
          item.classList.remove("active")
        );

        filter.classList.add("active");

        const category =
          filter.dataset.category;

        newsCards.forEach(card => {

          if(
            category === "all" ||
            card.dataset.category === category
          ){
            card.style.display = "";
          }else{
            card.style.display = "none";
          }

        });

      }
    );

  });


  /* =======================================================
     ANIMACIÓN SUAVE AL ENTRAR
     ======================================================= */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if(entry.isIntersecting){

            entry.target.style.opacity = "1";
            entry.target.style.transform =
              "translateY(0)";

          }

        });

      },
      {
        threshold:.08
      }
    );


  document
    .querySelectorAll(
      ".section, .schedule-card, .special-card, .news-card"
    )
    .forEach(element => {

      element.style.opacity = "0";
      element.style.transform =
        "translateY(15px)";
      element.style.transition =
        "opacity .6s ease, transform .6s ease";

      observer.observe(element);

    });


  /* =======================================================
     TECLADO
     ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      /*
       * Barra espaciadora:
       * reproducir / pausar cuando
       * no se está escribiendo.
       */

      const tag =
        document.activeElement?.tagName;

      if(
        event.code === "Space" &&
        tag !== "INPUT" &&
        tag !== "TEXTAREA" &&
        tag !== "BUTTON"
      ){

        event.preventDefault();

        toggleRadio();

      }

    }
  );


  /* =======================================================
     INICIO
     ======================================================= */

  setPlayingState(false);

  console.log(
    "ARENA 24 Radio y TV 4.0 iniciada correctamente."
  );

});
