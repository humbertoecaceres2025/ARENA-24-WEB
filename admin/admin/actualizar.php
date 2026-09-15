<?php

require_once 'config.php';

verificarSesion();

$id = intval($_POST['id'] ?? 0);

$noticias = json_decode(
    file_get_contents(ARCHIVO_NOTICIAS),
    true
);

if (!is_array($noticias)) {
    die('No se pudo leer el archivo de noticias.');
}


function slugArena24($texto)
{
    $texto = strtolower($texto);

    $texto = iconv(
        'UTF-8',
        'ASCII//TRANSLIT//IGNORE',
        $texto
    );

    $texto = preg_replace(
        '/[^a-z0-9]+/',
        '-',
        $texto
    );

    return trim($texto, '-');
}


foreach ($noticias as &$noticia) {

    if ((int)$noticia['id'] !== $id) {
        continue;
    }

    $noticia['titulo'] =
        trim($_POST['titulo'] ?? '');

    $noticia['resumen'] =
        trim($_POST['resumen'] ?? '');

    $noticia['contenido'] =
        trim($_POST['contenido'] ?? '');

    $noticia['categoria'] =
        trim($_POST['categoria'] ?? '');

    $noticia['autor'] =
        trim($_POST['autor'] ?? 'Redacción Arena 24');

    $noticia['estado'] =
        trim($_POST['estado'] ?? 'publicado');

    $noticia['slug'] =
        slugArena24(
            trim($_POST['slug'] ?? '')
        );

    if ($noticia['slug'] === '') {
        $noticia['slug'] =
            slugArena24(
                $noticia['titulo']
            );
    }

    $noticia['meta_description'] =
        trim(
            $_POST['meta_description'] ??
            $noticia['resumen']
        );


    /*
     * NUEVA IMAGEN
     */

    if (
        isset($_FILES['imagen']) &&
        $_FILES['imagen']['error'] === UPLOAD_ERR_OK
    ) {

        $info =
            getimagesize(
                $_FILES['imagen']['tmp_name']
            );

        $permitidos = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp'
        ];

        if (
            !$info ||
            !isset($permitidos[$info['mime']])
        ) {
            die('Imagen no válida.');
        }

        if (!is_dir(CARPETA_IMAGENES)) {
            mkdir(
                CARPETA_IMAGENES,
                0755,
                true
            );
        }

        $extension =
            $permitidos[$info['mime']];

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

        move_uploaded_file(
            $_FILES['imagen']['tmp_name'],
            $destino
        );

        /*
         * Borrar imagen anterior
         */

        if (!empty($noticia['imagen'])) {

            $anterior =
                dirname(__DIR__) .
                '/' .
                $noticia['imagen'];

            if (
                str_starts_with(
                    $noticia['imagen'],
                    'uploads/'
                ) &&
                file_exists($anterior)
            ) {
                unlink($anterior);
            }
        }

        $noticia['imagen'] =
            'uploads/' . $nombre;
    }

    break;
}

unset($noticia);


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


header('Location: index.php');

exit;
