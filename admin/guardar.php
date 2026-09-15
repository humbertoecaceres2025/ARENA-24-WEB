<?php

require_once 'config.php';

verificarSesion();


/*
|--------------------------------------------------------------------------
| DATOS
|--------------------------------------------------------------------------
*/

$titulo = trim($_POST['titulo'] ?? '');
$resumen = trim($_POST['resumen'] ?? '');
$categoria = trim($_POST['categoria'] ?? '');
$autor = trim($_POST['autor'] ?? 'Redacción Arena 24');
$url = trim($_POST['url'] ?? '#');


if (
    $titulo === '' ||
    $resumen === '' ||
    $categoria === ''
) {

    die('Faltan datos obligatorios.');
}


/*
|--------------------------------------------------------------------------
| CREAR CARPETA DE IMÁGENES
|--------------------------------------------------------------------------
*/

if (!is_dir(CARPETA_IMAGENES)) {

    mkdir(
        CARPETA_IMAGENES,
        0755,
        true
    );
}


/*
|--------------------------------------------------------------------------
| IMAGEN
|--------------------------------------------------------------------------
*/

$imagen = '';


if (
    isset($_FILES['imagen']) &&
    $_FILES['imagen']['error'] === UPLOAD_ERR_OK
) {

    $tmp = $_FILES['imagen']['tmp_name'];

    $info = getimagesize($tmp);

    if (!$info) {
        die('El archivo no es una imagen válida.');
    }

    $mime = $info['mime'];

    $permitidos = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp'
    ];

    if (!isset($permitidos[$mime])) {
        die('Formato de imagen no permitido.');
    }

    $extension = $permitidos[$mime];

    $nombre =
        'arena24-' .
        time() .
        '-' .
        bin2hex(random_bytes(4)) .
        '.' .
        $extension;

    $destino =
        CARPETA_IMAGENES .
        $nombre;

    if (!move_uploaded_file($tmp, $destino)) {
        die('No se pudo guardar la imagen.');
    }

    $imagen = 'uploads/' . $nombre;

}


/*
|--------------------------------------------------------------------------
| NOTICIAS EXISTENTES
|--------------------------------------------------------------------------
*/

$noticias = [];

if (file_exists(ARCHIVO_NOTICIAS)) {

    $contenido =
        file_get_contents(
            ARCHIVO_NOTICIAS
        );

    $noticias =
        json_decode(
            $contenido,
            true
        );

    if (!is_array($noticias)) {
        $noticias = [];
    }
}


/*
|--------------------------------------------------------------------------
| ID
|--------------------------------------------------------------------------
*/

$ids = array_column(
    $noticias,
    'id'
);

$id = $ids
    ? max($ids) + 1
    : 1;


/*
|--------------------------------------------------------------------------
| FECHA
|--------------------------------------------------------------------------
*/

$fechaISO =
    date('c');

$fecha =
    date('d/m/Y · H:i');


/*
|--------------------------------------------------------------------------
| NUEVA NOTICIA
|--------------------------------------------------------------------------
*/

$nueva = [

    'id' => $id,

    'titulo' => $titulo,

    'resumen' => $resumen,

    'categoria' => $categoria,

    'autor' => $autor,

    'fecha' => $fecha,

    'fecha_iso' => $fechaISO,

    'imagen' => $imagen,

    'url' => $url

];


array_unshift(
    $noticias,
    $nueva
);


/*
|--------------------------------------------------------------------------
| GUARDAR JSON
|--------------------------------------------------------------------------
*/

$resultado =
    file_put_contents(
        ARCHIVO_NOTICIAS,
        json_encode(
            $noticias,
            JSON_PRETTY_PRINT |
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        ),
        LOCK_EX
    );


if ($resultado === false) {

    die(
        'No se pudo actualizar noticias.json. ' .
        'Verificá los permisos del archivo.'
    );
}


header(
    'Location: index.php'
);

exit;
