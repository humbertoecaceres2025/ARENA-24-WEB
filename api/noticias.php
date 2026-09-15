<?php

header(
    'Content-Type: application/json; charset=utf-8'
);

$archivo =
    dirname(__DIR__) .
    '/noticias.json';

if (!file_exists($archivo)) {

    http_response_code(404);

    echo json_encode([
        'error' => 'No hay noticias disponibles.'
    ]);

    exit;
}

$noticias =
    json_decode(
        file_get_contents($archivo),
        true
    );

if (!is_array($noticias)) {

    http_response_code(500);

    echo json_encode([
        'error' => 'Base de noticias inválida.'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| SOLO PUBLICADAS
|--------------------------------------------------------------------------
*/

$noticias =
    array_filter(
        $noticias,
        function($noticia){

            return
                ($noticia['estado'] ?? 'publicado')
                === 'publicado';

        }
    );


/*
|--------------------------------------------------------------------------
| ORDEN
|--------------------------------------------------------------------------
*/

usort(
    $noticias,
    function($a,$b){

        return
            strtotime($b['fecha_iso'] ?? '') -
            strtotime($a['fecha_iso'] ?? '');

    }
);


$noticias =
    array_values(
        array_slice($noticias,0,50)
    );


echo json_encode(
    $noticias,
    JSON_UNESCAPED_UNICODE |
    JSON_UNESCAPED_SLASHES
);
