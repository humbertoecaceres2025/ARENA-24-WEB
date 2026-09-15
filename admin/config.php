<?php

session_start();

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN DEL PANEL ARENA 24
|--------------------------------------------------------------------------
|
| IMPORTANTE:
| Cambiá estos datos antes de subir el sistema al hosting.
|
*/

define('ADMIN_USUARIO', 'admin');
define('ADMIN_PASSWORD', 'CambiarEstaClave123!');

define(
    'ARCHIVO_NOTICIAS',
    dirname(__DIR__) . '/noticias.json'
);

define(
    'CARPETA_IMAGENES',
    dirname(__DIR__) . '/uploads/'
);


/*
|--------------------------------------------------------------------------
| PROTECCIÓN
|--------------------------------------------------------------------------
*/

function verificarSesion()
{
    if (
        empty($_SESSION['arena24_admin']) ||
        $_SESSION['arena24_admin'] !== true
    ) {
        header('Location: index.php');
        exit;
    }
}


/*
|--------------------------------------------------------------------------
| ESCAPAR HTML
|--------------------------------------------------------------------------
*/

function e($texto)
{
    return htmlspecialchars(
        (string)$texto,
        ENT_QUOTES,
        'UTF-8'
    );
}
