/* ==================================================
   ARENA 24 — PROGRAMACIÓN 4.1
   El audio NO es controlado por JavaScript.
   ================================================== */


const programas = [

  {
    inicio: 0,
    fin: 6,
    nombre: "MAR",
    descripcion:
      "Relax y música actual durante la noche."
  },

  {
    inicio: 6,
    fin: 12,
    nombre: "ENRIQUE",
    descripcion:
      "Noticias, actualidad y la información de La Rioja, Argentina y el mundo."
  },

  {
    inicio: 12,
    fin: 16,
    nombre: "ARENA 24 SIESTA",
    descripcion:
      "Música para acompañarte durante la siesta."
  },

  {
    inicio: 16,
    fin: 20,
    nombre: "VIANA",
    descripcion:
      "Entretenimiento, música y compañía."
  },

  {
    inicio: 20,
    fin: 23,
    nombre: "NIC",
    descripcion:
      "Toda la actualidad deportiva."
  },

  {
    inicio: 23,
    fin: 24,
    nombre: "MAR",
    descripcion:
      "Relax y música actual."
  }

];


/* ================= PROGRAMA ACTUAL ================= */

function obtenerProgramaActual() {

  const hora =
    new Date().getHours();

  return programas.find(
    programa =>
      hora >= programa.inicio &&
      hora < programa.fin
  );

}


/* ================= ACTUALIZAR PROGRAMA ================= */

function actualizarPrograma() {

  const programa =
    obtenerProgramaActual();

  const nombre =
    document.getElementById(
      "programaActual"
    );

  const descripcion =
    document.getElementById(
      "descripcionActual"
    );


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


/* ================= RELOJ ================= */

function actualizarReloj() {

  const reloj =
    document.getElementById(
      "horaActual"
    );


  if (!reloj) {
    return;
  }


  const ahora =
    new Date();


  const horas =
    String(
      ahora.getHours()
    ).padStart(2, "0");


  const minutos =
    String(
      ahora.getMinutes()
    ).padStart(2, "0");


  reloj.textContent =
    `${horas}:${minutos}`;

}


/* ================= INICIO ================= */

function iniciarArena24() {

  actualizarPrograma();

  actualizarReloj();

}


document.addEventListener(
  "DOMContentLoaded",
  iniciarArena24
);


/* ================= ACTUALIZACIÓN ================= */

setInterval(
  actualizarReloj,
  1000
);


setInterval(
  actualizarPrograma,
  60000
);
