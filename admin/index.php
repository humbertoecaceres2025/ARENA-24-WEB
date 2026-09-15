<?php

require_once 'config.php';


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

if (
    isset($_POST['usuario']) &&
    isset($_POST['password'])
) {

    if (
        $_POST['usuario'] === ADMIN_USUARIO &&
        $_POST['password'] === ADMIN_PASSWORD
    ) {

        $_SESSION['arena24_admin'] = true;

        header('Location: index.php');
        exit;

    } else {

        $error = 'Usuario o contraseña incorrectos.';
    }
}


/*
|--------------------------------------------------------------------------
| SI NO ESTÁ LOGUEADO
|--------------------------------------------------------------------------
*/

if (empty($_SESSION['arena24_admin'])):
?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>Admin | Arena 24</title>

<style>

* {
    box-sizing:border-box;
}

body {
    margin:0;
    background:#071a33;
    font-family:Arial,sans-serif;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
}

.login {
    width:min(400px,90%);
    background:white;
    padding:35px;
    border-radius:15px;
    box-shadow:0 20px 60px rgba(0,0,0,.25);
}

.logo {
    text-align:center;
    font-size:36px;
    font-weight:900;
    color:#071a33;
    margin-bottom:5px;
}

.logo span {
    color:#e21d2f;
}

.sub {
    text-align:center;
    color:#667085;
    margin-bottom:30px;
}

input {
    width:100%;
    padding:13px;
    border:1px solid #ddd;
    border-radius:7px;
    margin-bottom:14px;
}

button {
    width:100%;
    padding:13px;
    border:0;
    border-radius:7px;
    background:#e21d2f;
    color:white;
    font-weight:bold;
    cursor:pointer;
}

.error {
    background:#fee2e2;
    color:#991b1b;
    padding:10px;
    border-radius:6px;
    margin-bottom:15px;
}

</style>

</head>

<body>

<div class="login">

    <div class="logo">
        ARENA<span>24</span>
    </div>

    <div class="sub">
        Panel de administración
    </div>

    <?php if (!empty($error)): ?>

        <div class="error">
            <?= e($error) ?>
        </div>

    <?php endif; ?>

    <form method="POST">

        <input
            type="text"
            name="usuario"
            placeholder="Usuario"
            required
        >

        <input
            type="password"
            name="password"
            placeholder="Contraseña"
            required
        >

        <button type="submit">
            INGRESAR
        </button>

    </form>

</div>

</body>
</html>

<?php
exit;
endif;


/*
|--------------------------------------------------------------------------
| PANEL
|--------------------------------------------------------------------------
*/

$noticias = [];

if (file_exists(ARCHIVO_NOTICIAS)) {

    $datos = file_get_contents(ARCHIVO_NOTICIAS);

    $noticias = json_decode($datos, true);

    if (!is_array($noticias)) {
        $noticias = [];
    }
}

usort(
    $noticias,
    function($a,$b) {

        return
            strtotime($b['fecha_iso'] ?? '') -
            strtotime($a['fecha_iso'] ?? '');
    }
);

?>

<!DOCTYPE html>

<html lang="es">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width,initial-scale=1"
>

<title>Panel | Arena 24</title>

<style>

* {
    box-sizing:border-box;
}

body {
    margin:0;
    background:#f4f6f8;
    color:#101828;
    font-family:Arial,sans-serif;
}

.header {
    background:#071a33;
    color:white;
    padding:18px 25px;
    display:flex;
    align-items:center;
    justify-content:space-between;
}

.logo {
    font-size:27px;
    font-weight:900;
}

.logo span {
    color:#e21d2f;
}

.header a {
    color:white;
    text-decoration:none;
}

.container {
    width:min(1150px,calc(100% - 30px));
    margin:30px auto;
}

.grid {
    display:grid;
    grid-template-columns:1fr 1.5fr;
    gap:25px;
}

.panel {
    background:white;
    padding:25px;
    border-radius:12px;
    box-shadow:0 5px 20px rgba(0,0,0,.05);
}

h1 {
    margin-top:0;
}

label {
    display:block;
    font-weight:bold;
    font-size:13px;
    margin:15px 0 6px;
}

input,
textarea,
select {
    width:100%;
    border:1px solid #d0d5dd;
    border-radius:7px;
    padding:11px;
    font:inherit;
}

textarea {
    min-height:130px;
    resize:vertical;
}

button {
    margin-top:18px;
    width:100%;
    padding:13px;
    border:0;
    border-radius:7px;
    background:#e21d2f;
    color:white;
    font-weight:bold;
    cursor:pointer;
}

.noticia {
    border-bottom:1px solid #eee;
    padding:15px 0;
}

.noticia:last-child {
    border-bottom:0;
}

.noticia h3 {
    margin:5px 0;
}

.badge {
    display:inline-block;
    background:#071a33;
    color:white;
    border-radius:4px;
    padding:4px 7px;
    font-size:10px;
}

.eliminar {
    display:inline-block;
    margin-top:8px;
    background:#fee2e2;
    color:#991b1b;
    padding:7px 10px;
    border-radius:5px;
    font-size:12px;
    text-decoration:none;
}

@media(max-width:800px) {

    .grid {
        grid-template-columns:1fr;
    }

}

</style>

</head>

<body>

<header class="header">

    <div class="logo">
        ARENA<span>24</span>
    </div>

    <a href="logout.php">
        Cerrar sesión
    </a>

</header>

<main class="container">

<div class="grid">

<!-- CREAR NOTICIA -->

<section class="panel">

<h1>Nueva noticia</h1>

<form
    action="guardar.php"
    method="POST"
    enctype="multipart/form-data"
>

<label>Título</label>

<input
    type="text"
    name="titulo"
    required
>

<label>Resumen</label>

<textarea
    name="resumen"
    required
></textarea>

<label>Categoría</label>

<select name="categoria" required>

<option value="La Rioja">
La Rioja
</option>

<option value="Nacional">
Nacional
</option>

<option value="Política">
Política
</option>

<option value="Economía">
Economía
</option>

<option value="Sociedad">
Sociedad
</option>

<option value="Deportes">
Deportes
</option>

<option value="Internacional">
Internacional
</option>

</select>

<label>Autor</label>

<input
    type="text"
    name="autor"
    value="Redacción Arena 24"
>

<label>Imagen</label>

<input
    type="file"
    name="imagen"
    accept="image/jpeg,image/png,image/webp"
>

<label>Enlace de la noticia</label>

<input
    type="text"
    name="url"
    value="#"
>

<button type="submit">
PUBLICAR NOTICIA
</button>

</form>

</section>


<!-- LISTADO -->

<section class="panel">

<h1>Noticias publicadas</h1>

<?php if (!$noticias): ?>

<p>
Todavía no hay noticias cargadas.
</p>

<?php endif; ?>


<?php foreach ($noticias as $noticia): ?>

<article class="noticia">

<span class="badge">
<?= e($noticia['categoria'] ?? '') ?>
</span>

<h3>
<?= e($noticia['titulo'] ?? '') ?>
</h3>

<div>
<?= e($noticia['fecha'] ?? '') ?>
</div>

<a
    class="eliminar"
    href="eliminar.php?id=<?= (int)($noticia['id'] ?? 0) ?>"
    onclick="return confirm('¿Eliminar esta noticia?')"
>
Eliminar
</a>

</article>

<?php endforeach; ?>

</section>

</div>

</main>

</body>

</html>
