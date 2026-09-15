<?php

require_once 'config.php';

verificarSesion();

$id = intval($_GET['id'] ?? 0);

$noticias = json_decode(
    file_get_contents(ARCHIVO_NOTICIAS),
    true
);

$noticia = null;

foreach ($noticias as $n) {

    if ((int)$n['id'] === $id) {
        $noticia = $n;
        break;
    }
}

if (!$noticia) {
    die('Noticia no encontrada.');
}

?>

<!DOCTYPE html>

<html lang="es">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
>

<title>Editar noticia | Arena 24</title>

<style>

body{
margin:0;
background:#f4f6f8;
font-family:Arial,sans-serif;
}

.container{
width:min(850px,calc(100% - 30px));
margin:40px auto;
}

.panel{
background:white;
padding:30px;
border-radius:12px;
}

h1{
color:#071a33;
}

label{
display:block;
font-weight:bold;
font-size:13px;
margin:16px 0 6px;
}

input,
textarea,
select{
width:100%;
padding:12px;
border:1px solid #d0d5dd;
border-radius:7px;
font:inherit;
}

textarea{
min-height:150px;
}

button{
margin-top:20px;
width:100%;
padding:13px;
background:#e21d2f;
border:0;
border-radius:7px;
color:white;
font-weight:bold;
}

.imagen{
max-width:300px;
margin-top:10px;
border-radius:8px;
}

.volver{
display:inline-block;
margin-bottom:20px;
color:#071a33;
font-weight:bold;
}

</style>

</head>

<body>

<div class="container">

<a
class="volver"
href="index.php"
>
← Volver al panel
</a>

<div class="panel">

<h1>
Editar noticia
</h1>

<form
action="actualizar.php"
method="POST"
enctype="multipart/form-data"
>

<input
type="hidden"
name="id"
value="<?=intval($noticia['id'])?>"
>

<label>Título</label>

<input
name="titulo"
value="<?=e($noticia['titulo'])?>"
required
>

<label>Resumen</label>

<textarea
name="resumen"
required
><?=e($noticia['resumen'])?></textarea>

<label>Contenido</label>

<textarea
name="contenido"
required
><?=e($noticia['contenido'] ?? '')?></textarea>

<label>Categoría</label>

<select name="categoria">

<?php

$categorias = [
    'La Rioja',
    'Nacional',
    'Política',
    'Economía',
    'Sociedad',
    'Deportes',
    'Internacional',
    'Cultura'
];

foreach($categorias as $categoria):

?>

<option
value="<?=e($categoria)?>"
<?=($noticia['categoria'] ?? '') === $categoria ? 'selected' : ''?>
>
<?=e($categoria)?>
</option>

<?php endforeach; ?>

</select>

<label>Autor</label>

<input
name="autor"
value="<?=e($noticia['autor'] ?? '')?>"
>

<label>Estado</label>

<select name="estado">

<option
value="publicado"
<?=($noticia['estado'] ?? '') === 'publicado' ? 'selected' : ''?>
>
Publicada
</option>

<option
value="borrador"
<?=($noticia['estado'] ?? '') === 'borrador' ? 'selected' : ''?>
>
Borrador
</option>

</select>

<label>Nueva imagen</label>

<input
type="file"
name="imagen"
accept="image/jpeg,image/png,image/webp"
>

<?php if(!empty($noticia['imagen'])): ?>

<img
class="imagen"
src="../<?=e($noticia['imagen'])?>"
alt=""
>

<?php endif; ?>

<label>Meta descripción SEO</label>

<textarea
name="meta_description"
maxlength="160"
><?=e($noticia['meta_description'] ?? '')?></textarea>

<label>Slug</label>

<input
name="slug"
value="<?=e($noticia['slug'] ?? '')?>"
>

<button>
GUARDAR CAMBIOS
</button>

</form>

</div>

</div>

</body>

</html>
