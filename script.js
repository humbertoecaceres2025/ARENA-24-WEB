/* =====================================================
   ARENA 24 - APP 4.0
===================================================== */


/* =========================
   PROGRAMACIÓN
========================= */

const programas = [

  {
    inicio: 0,
    fin: 6,
    nombre: "Martina",
    descripcion: "Relax y música actual durante la noche."
  },

  {
    inicio: 6,
    fin: 12,
    nombre: "Enrique",
    descripcion: "Noticias, actualidad y la información de La Rioja, Argentina y el mundo."
  },

  {
    inicio: 12,
    fin: 16,
    nombre: "ARENA 24 Siesta",
    descripcion: "Música para acompañarte durante la siesta."
  },

  {
    inicio: 16,
    fin: 20,
    nombre: "Viviana",
    descripcion: "Entretenimiento, música y compañía."
  },

  {
    inicio: 20,
    fin: 23,
    nombre: "Nicolás",
    descripcion: "Toda la actualidad deportiva."
  },

  {
    inicio: 23,
    fin: 24,
    nombre: "Martina",
    descripcion: "Relax y música actual."
  }

];


/* =========================
   OBTENER PROGRAMA
========================= */

function obtenerProgramaActual() {

  const ahora = new Date();

  const hora = ahora.getHours();

  return programas.find(programa => {

    return hora >= programa.inicio &&
           hora < programa.fin;

  });

}


/* =========================
   ACTUALIZAR AHORA EN VIVO
========================= */

function actualizarPrograma() {

  const programa = obtenerProgramaActual();

  const nombre =
    document.getElementById("programaActual");

  const descripcion =
    document.getElementById("descripcionActual");


  if (!nombre || !descripcion) {
    return;
  }


  if (programa) {

    nombre.textContent =
      programa.nombre;

    descripcion.textContent =
      programa.descripcion;

  }

}


/* =========================
   RELOJ
========================= */

function actualizarReloj() {

  const reloj =
    document.getElementById("horaActual");


  if (!reloj) {
    return;
  }


  const ahora = new Date();


  const horas =
    String(ahora.getHours())
      .padStart(2, "0");


  const minutos =
    String(ahora.getMinutes())
      .padStart(2, "0");


  reloj.textContent =
    `${horas}:${minutos}`;

}


/* =========================
   INICIO
========================= */

function iniciarArena24() {

  actualizarPrograma();

  actualizarReloj();

}


/* =========================
   ACTUALIZACIONES
========================= */

setInterval(
  actualizarReloj,
  1000
);


setInterval(
  actualizarPrograma,
  60000
);


document.addEventListener(
  "DOMContentLoaded",
  iniciarArena24
);
