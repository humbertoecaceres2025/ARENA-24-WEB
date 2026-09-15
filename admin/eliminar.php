<?php

require_once 'config.php';

verificarSesion();

$id = (int)($_GET['id'] ?? 0);

if (!$id) {
    header('Location: index.php');
    exit;
}

$noticias = [];

if (file_exists(ARCHIVO_NOTICIAS)) {

    $noticias = json_decode(
        file_get_contents(ARCHIVO_NOTICIAS),
        true
    );

    if (!is_array($noticias)) {
        $noticias = [];
    }
}


$nuevas = [];

foreach ($noticias as $noticia) {

    if ((int)($noticia['id'] ?? 0) === $id) {

        /*
         * Eliminar imagen local
         */

        $imagen = $noticia['imagen'] ?? '';

        if (
            str_starts_with(
                $imagen,
                'uploads/'
            )
        ) {

            $archivo =
                dirname(__DIR__) .
                '/' .
                $imagen;

            if (file_exists($archivo)) {
                unlink($archivo);
            }
        }

        continue;
    }

    $nuevas[] = $noticia;
}


file_put_contents(
    ARCHIVO_NOTICIAS,
    json_encode(
        $nuevas,
        JSON_PRETTY_PRINT |
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES
    ),
    LOCK_EX
);


header(
    'Location: index.php'
);

exit;
