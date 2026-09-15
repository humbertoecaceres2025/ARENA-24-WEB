<?php

require_once 'config.php';

if (
    isset($_POST['usuario']) &&
    isset($_POST['password'])
) {

    if (
        hash_equals(ADMIN_USUARIO, $_POST['usuario']) &&
        hash_equals(ADMIN_PASSWORD, $_POST['password'])
    ) {

        session_regenerate_id(true);

        $_SESSION['arena24_admin'] = true;

        header('Location: index.php');
        exit;

    } else {

        $error = 'Usuario o contraseña incorrectos.';
    }
}

if (empty($_SESSION['arena24_admin'])):
?>

<!DOCTYPE html>
<html lang="es">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">

<title>Acceso | Arena 24</title>

<style>

*{box-sizing:border-box}

body{
    margin:0;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:#071a33;
    font-family:Arial,sans-serif;
}

.login{
    width:min(410px,92%);
    background:#fff;
    padding:35px;
    border-radius:15px;
    box-shadow:0 25px 70px rgba(0,0,0,.3);
}

.logo{
    text-align:center;
    font-size:38px;
    font-weight:900;
    color:#071a33;
}

.logo span{
    color:#e21d2f;
}

.sub{
    text-align:center;
    color:#667085;
    margin:5px 0 30px;
}

input{
    width:100%;
    padding:13px;
    border:1px solid #d0d5dd;
    border-radius:7px;
    margin-bottom:15px;
}

button{
    width:100%;
    padding:13px;
    border:0;
    border-radius:7px;
    background:#e21d2f;
    color:white;
    font-weight:bold;
    cursor:pointer;
}

.error{
    background:#fee2e2;
    color:#991b1b;
    padding:10px;
    border-radius:7px;
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
Panel editorial
</div>

<?php if(!empty($error)): ?>

<div class="error">
<?=e($error)?>
</div>

<?php endif; ?>

<form method="POST">

<input
type="text"
name="usuario"
placeholder="Usuario"
required
autocomplete="username"
>

<input
type="password"
name="password"
placeholder="Contraseña"
required
autocomplete="current-password"
>

<button>
INGRESAR
</button>

</form>

</div>

</body>
</html>

<?php
exit;
endif;


/* CARGAR NOTICIAS */

$noticias=[];

if(file_exists(ARCHIVO_NOTICIAS)){

    $noticias=json_decode(
        file_get_contents(ARCHIVO_NOTICIAS),
        true
    );

    if(!is_array($noticias)){
        $noticias=[];
    }
}

usort(
    $noticias,
    function($a,$b){

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

<title>Panel Editorial | Arena 24</title>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
background:#f4f6f8;
font-family:Arial,sans-serif;
color:#101828;
}

.header{
background:#071a33;
color:white;
padding:16px 25px;
display:flex;
align-items:center;
justify-content:space-between;
}

.logo{
font-size:27px;
font-weight:900;
}

.logo span{
color:#e21d2f;
}

.header-right{
display:flex;
gap:15px;
align-items:center;
}

.header a{
color:white;
text-decoration:none;
font-size:13px;
}

.container{
width:min(1200px,calc(100% - 30px));
margin:30px auto;
}

.toolbar{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.toolbar h1{
margin:0;
}

.nueva{
background:#e21d2f;
color:white;
padding:11px 16px;
border-radius:7px;
text-decoration:none;
font-weight:bold;
font-size:13px;
}

.grid{
display:grid;
grid-template-columns:1.3fr 2fr;
gap:25px;
}

.panel{
background:white;
padding:25px;
border-radius:12px;
box-shadow:0 5px 20px rgba(0,0,0,.05);
}

.panel h2{
margin-top:0;
}

.stats{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:12px;
margin-bottom:25px;
}

.stat{
background:#071a33;
color:white;
padding:18px;
border-radius:10px;
}

.stat strong{
font-size:28px;
display:block;
}

.stat span{
font-size:11px;
color:#cbd5e1;
}

.noticia{
display:grid;
grid-template-columns:120px 1fr;
gap:15px;
padding:17px 0;
border-bottom:1px solid #eee;
}

.noticia img{
width:120px;
height:85px;
object-fit:cover;
border-radius:8px;
}

.noticia h3{
margin:4px 0;
font-family:Georgia,serif;
font-size:18px;
}

.noticia small{
color:#667085;
}

.badge{
display:inline-block;
padding:4px 7px;
border-radius:4px;
font-size:10px;
font-weight:bold;
background:#e9eff7;
color:#071a33;
}

.badge-publicado{
background:#dcfce7;
color:#166534;
}

.badge-borrador{
background:#fef3c7;
color:#92400e;
}

.acciones{
margin-top:8px;
display:flex;
gap:7px;
}

.acciones a{
padding:6px 9px;
border-radius:5px;
font-size:11px;
text-decoration:none;
}

.editar{
background:#e9eff7;
color:#071a33;
}

.eliminar{
background:#fee2e2;
color:#991b1b;
}

label{
display:block;
font-size:13px;
font-weight:bold;
margin:14px 0 6px;
}

input,
textarea,
select{
width:100%;
padding:11px;
border:1px solid #d0d5dd;
border-radius:7px;
font:inherit;
}

textarea{
min-height:110px;
resize:vertical;
}

button{
width:100%;
padding:13px;
border:0;
border-radius:7px;
background:#e21d2f;
color:white;
font-weight:bold;
cursor:pointer;
margin-top:18px;
}

@media(max-width:850px){

.grid{
grid-template-columns:1fr;
}

}

@media(max-width:600px){

.stats{
grid-template-columns:1fr;
}

.noticia{
grid-template-columns:90px 1fr;
}

.noticia img{
width:90px;
height:70px;
}

}

</style>

</head>

<body>

<header class="header">

<div class="logo">
ARENA<span>24</span>
</div>

<div class="header-right">

<a href="../" target="_blank">
Ver sitio
</a>

<a href="logout.php">
Salir
</a>

</div>

</header>


<main class="container">

<div class="toolbar">

<h1>Panel editorial</h1>

<a class="nueva" href="#nueva">
+ NUEVA NOTICIA
</a>

</div>


<?php

$total=count($noticias);

$publicadas=0;
$borradores=0;

foreach($noticias as $n){

    if(($n['estado'] ?? 'publicado')==='publicado'){
        $publicadas++;
    }else{
        $borradores++;
    }

}

?>

<div class="stats">

<div class="stat">
<strong><?=$total?></strong>
<span>Noticias totales</span>
</div>

<div class="stat">
<strong><?=$publicadas?></strong>
<span>Publicadas</span>
</div>

<div class="stat">
<strong><?=$borradores?></strong>
<span>Borradores</span>
</div>

</div>


<div class="grid">


<section class="panel" id="nueva">

<h2>Nueva noticia</h2>

<form
action="guardar.php"
method="POST"
enctype="multipart/form-data"
>

<label>Título</label>

<input
name="titulo"
required
maxlength="180"
>

<label>Resumen / bajada</label>

<textarea
name="resumen"
required
maxlength="400"
></textarea>

<label>Contenido</label>

<textarea
name="contenido"
required
style="min-height:240px"
placeholder="Escribí aquí el contenido de la noticia..."
></textarea>

<label>Categoría</label>

<select name="categoria">

<option>La Rioja</option>
<option>Nacional</option>
<option>Política</option>
<option>Economía</option>
<option>Sociedad</option>
<option>Deportes</option>
<option>Internacional</option>
<option>Cultura</option>

</select>

<label>Autor</label>

<input
name="autor"
value="Redacción Arena 24"
>

<label>Estado</label>

<select name="estado">

<option value="publicado">
Publicar ahora
</option>

<option value="borrador">
Guardar como borrador
</option>

</select>

<label>Imagen principal</label>

<input
type="file"
name="imagen"
accept="image/jpeg,image/png,image/webp"
>

<label>Meta descripción SEO</label>

<textarea
name="meta_description"
maxlength="160"
placeholder="Descripción que podrán mostrar los buscadores..."
></textarea>

<label>URL personalizada</label>

<input
name="slug"
placeholder="ejemplo-noticia-arena-24"
>

<button>
GUARDAR NOTICIA
</button>

</form>

</section>


<section class="panel">

<h2>Noticias</h2>

<?php foreach($noticias as $n): ?>

<article class="noticia">

<?php if(!empty($n['imagen'])): ?>

<img
src="../<?=e($n['imagen'])?>"
alt=""
>

<?php else: ?>

<div
style="
background:#e9eff7;
border-radius:8px;
height:85px;
"
></div>

<?php endif; ?>


<div>

<span class="badge">
<?=e($n['categoria'] ?? '')?>
</span>

<?php if(($n['estado'] ?? 'publicado')==='publicado'): ?>

<span class="badge badge-publicado">
PUBLICADA
</span>

<?php else: ?>

<span class="badge badge-borrador">
BORRADOR
</span>

<?php endif; ?>

<h3>
<?=e($n['titulo'] ?? '')?>
</h3>

<small>
<?=e($n['fecha'] ?? '')?>
·
<?=e($n['autor'] ?? '')?>
</small>

<div class="acciones">

<a
class="editar"
href="editar.php?id=<?=intval($n['id'])?>"
>
Editar
</a>

<a
class="eliminar"
href="eliminar.php?id=<?=intval($n['id'])?>"
onclick="return confirm('¿Eliminar esta noticia?')"
>
Eliminar
</a>

</div>

</div>

</article>

<?php endforeach; ?>

</section>

</div>

</main>

</body>

</html>
