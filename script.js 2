const player = document.getElementById("player");
const playTop = document.getElementById("playTop");

playTop.addEventListener("click", async () => {

  try {

    if (player.paused) {

      await player.play();

      playTop.textContent = "⏸ PAUSAR";

    } else {

      player.pause();

      playTop.textContent = "▶ ESCUCHAR EN VIVO";

    }

  } catch (error) {

    alert(
      "No se pudo iniciar la radio. Probá nuevamente."
    );

  }

});

player.addEventListener("pause", () => {

  playTop.textContent =
    "▶ ESCUCHAR EN VIVO";

});

player.addEventListener("play", () => {

  playTop.textContent =
    "⏸ PAUSAR";

});
