/* =========================================
   ARENA 24 RADIO WEB
   JavaScript principal
========================================= */


/* =========================================
   REPRODUCTOR DE RADIO
========================================= */

const radio =
  document.getElementById("radioPlayer");

const playBtn =
  document.getElementById("playBtn");

const volume =
  document.getElementById("volume");

const volumeLabel =
  document.getElementById("volumeLabel");

const radioCard =
  document.querySelector(".radio-card");

const nowStatus =
  document.getElementById("nowStatus");


/* Volumen inicial */

radio.volume =
  Number(volume.value);


/* PLAY / PAUSE */

async function toggleRadio() {

  if (radio.paused) {

    try {

      await radio.play();

      playBtn.textContent = "❚❚";

      playBtn.setAttribute(
        "aria-label",
        "Pausar radio"
      );

      radioCard.classList.add(
        "playing"
      );

      nowStatus.textContent =
        "ARENA 24 está sonando en vivo";

    } catch (error) {

      nowStatus.textContent =
        "No se pudo iniciar el audio. Tocá reproducir nuevamente.";

    }

  } else {

    radio.pause();

    playBtn.textContent = "▶";

    playBtn.setAttribute(
      "aria-label",
      "Reproducir radio"
    );

    radioCard.classList.remove(
      "playing"
    );

    nowStatus.textContent =
      "Radio pausada";
  }
}


playBtn.addEventListener(
  "click",
  toggleRadio
);


/* CONTROL DE VOLUMEN */

volume.addEventListener(
  "input",
  () => {

    radio.volume =
      Number(volume.value);

    volumeLabel.textContent =
      Math.round(
        Number(volume.value) * 100
      ) + "%";

  }
);


/* ERROR DE STREAM */

radio.addEventListener(
  "error",
  () => {

    nowStatus.textContent =
      "La señal no está disponible en este momento.";

    radioCard.classList.remove(
      "playing"
    );

    playBtn.textContent = "▶";

  }
);


/* =========================================
   FILTRO DE NOTICIAS
========================================= */

const filters =
  document.querySelectorAll(
    ".filter"
  );

const newsCards =
  document.querySelectorAll(
    ".news-card"
  );


filters.forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        filters.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );

        button.classList.add(
          "active"
        );

        const filter =
          button.dataset.filter;


        newsCards.forEach(
          card => {

            if (
              filter === "todas" ||
              card.dataset.category === filter
            ) {

              card.style.display = "";

            } else {

              card.style.display =
                "none";

            }

          }
        );

      }
    );

  }
);


/* =========================================
   PROGRAMACIÓN DINÁMICA
========================================= */

const programs = [

  {
    start: 6,
    end: 12,
    name: "Enri",
    text:
      "Noticias · La Rioja · Argentina · Mundo"
  },

  {
    start: 12,
    end: 16,
    name: "ARENA 24 Siesta",
    text:
      "Música y compañía"
  },

  {
    start: 16,
    end: 20,
    name: "Viana",
    text:
      "Entretenimiento y actualidad"
  },

  {
    start: 20,
    end: 23,
    name: "Nic",
    text:
      "Deportes y protagonistas"
  },

  {
    start: 23,
    end: 24,
    name: "Mar",
    text:
      "Relax y música actual"
  },

  {
    start: 0,
    end: 6,
    name: "Mar",
    text:
      "Relax y música actual"
  }

];


function updateCurrentProgram() {

  const hour =
    new Date().getHours();

  const program =
    programs.find(
      item =>
        hour >= item.start &&
        hour < item.end
    );


  const box =
    document.getElementById(
      "currentProgram"
    );


  if (program) {

    box.innerHTML =
      "<strong>AHORA:</strong> " +
      program.name +
      " — " +
      program.text;

  }

}


updateCurrentProgram();


setInterval(
  updateCurrentProgram,
  60000
);


/* =========================================
   AÑO AUTOMÁTICO
========================================= */

document.getElementById(
  "year"
).textContent =
  new Date().getFullYear();


/* =========================================
   MENÚ MÓVIL
========================================= */

const menuToggle =
  document.getElementById(
    "menuToggle"
  );

const mainNav =
  document.getElementById(
    "mainNav"
  );


menuToggle.addEventListener(
  "click",
  () => {

    mainNav.classList.toggle(
      "open"
    );

  }
);


/* Cerrar menú al tocar un enlace */

document
  .querySelectorAll(
    "#mainNav a"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "open"
          );

        }
      );

    }
  );
