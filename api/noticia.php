<?php

/*
|--------------------------------------------------------------------------
| ARENA 24 — PÁGINA INDIVIDUAL DE NOTICIA
|--------------------------------------------------------------------------
*/

$archivo = __DIR__ . '/noticias.json';

if (!file_exists($archivo)) {
    http_response_code(404);
    die('No hay noticias disponibles.');
}

$noticias = json_decode(
    file_get_contents($archivo),
    true
);

if (!is_array($noticias)) {
    http_response_code(500);
    die('No se pudo cargar el archivo de noticias.');
}


/*
|--------------------------------------------------------------------------
| SLUG
|--------------------------------------------------------------------------
*/

$slug = trim($_GET['slug'] ?? '');

$noticia = null;

foreach ($noticias as $item) {

    if (
        ($item['slug'] ?? '') === $slug &&
        ($item['estado'] ?? 'publicado') === 'publicado'
    ) {
        $noticia = $item;
        break;
    }
}


/*
|--------------------------------------------------------------------------
| COMPATIBILIDAD CON ID
|--------------------------------------------------------------------------
*/

if (!$noticia && isset($_GET['id'])) {

    $id = (int)$_GET['id'];

    foreach ($noticias as $item) {

        if (
            (int)($item['id'] ?? 0) === $id &&
            ($item['estado'] ?? 'publicado') === 'publicado'
        ) {
            $noticia = $item;
            break;
        }
    }
}


/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

if (!$noticia) {

    http_response_code(404);

    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>

        <meta charset="UTF-8">

        <meta
            name="viewport"
            content="width=device-width,initial-scale=1"
        >

        <title>Noticia no encontrada | Arena 24</title>

        <style>

            body {
                margin:0;
                background:#071a33;
                color:white;
                font-family:Arial,sans-serif;
                display:flex;
                align-items:center;
                justify-content:center;
                min-height:100vh;
                text-align:center;
            }

            a {
                display:inline-block;
                margin-top:20px;
                padding:12px 18px;
                background:#e21d2f;
                color:white;
                text-decoration:none;
                border-radius:6px;
            }

        </style>

    </head>

    <body>

        <div>

            <h1>404</h1>

            <h2>Noticia no encontrada</h2>

            <p>
                La noticia que buscás no existe o fue retirada.
            </p>

            <a href="index.html">
                Volver a Arena 24
            </a>

        </div>

    </body>
    </html>

    <?php

    exit;
}


/*
|--------------------------------------------------------------------------
| HELPERS
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


function crearSlugLocal($texto)
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


/*
|--------------------------------------------------------------------------
| DATOS
|--------------------------------------------------------------------------
*/

$titulo =
    $noticia['titulo']
    ?? 'Arena 24';

$resumen =
    $noticia['resumen']
    ?? '';

$contenido =
    $noticia['contenido']
    ?? '';

$categoria =
    $noticia['categoria']
    ?? 'Noticias';

$autor =
    $noticia['autor']
    ?? 'Redacción Arena 24';

$fecha =
    $noticia['fecha']
    ?? '';

$imagen =
    $noticia['imagen']
    ?? '';

$meta =
    $noticia['meta_description']
    ?? $resumen;

$slugActual =
    $noticia['slug']
    ?? crearSlugLocal($titulo);


/*
|--------------------------------------------------------------------------
| URL CANÓNICA
|--------------------------------------------------------------------------
|
| Si el sitio está en una subcarpeta, podés cambiar esta URL.
|
*/

$protocolo =
    (!empty($_SERVER['HTTPS']) &&
     $_SERVER['HTTPS'] !== 'off')
    ? 'https'
    : 'http';

$host =
    $_SERVER['HTTP_HOST']
    ?? 'localhost';

$urlActual =
    $protocolo .
    '://' .
    $host .
    $_SERVER['REQUEST_URI'];


/*
|--------------------------------------------------------------------------
| IMAGEN ABSOLUTA
|--------------------------------------------------------------------------
*/

$imagenCompartir = '';

if ($imagen !== '') {

    $imagenCompartir =
        $protocolo .
        '://' .
        $host .
        '/' .
        ltrim($imagen, '/');
}


/*
|--------------------------------------------------------------------------
| NOTICIAS RELACIONADAS
|--------------------------------------------------------------------------
*/

$relacionadas = [];

foreach ($noticias as $item) {

    if (
        ($item['estado'] ?? 'publicado') !== 'publicado'
    ) {
        continue;
    }

    if (
        (int)($item['id'] ?? 0) ===
        (int)($noticia['id'] ?? 0)
    ) {
        continue;
    }

    if (
        ($item['categoria'] ?? '') ===
        $categoria
    ) {

        $relacionadas[] = $item;
    }
}

$relacionadas =
    array_slice(
        $relacionadas,
        0,
        3
    );


/*
|--------------------------------------------------------------------------
| SI NO HAY RELACIONADAS, USAR ÚLTIMAS
|--------------------------------------------------------------------------
*/

if (count($relacionadas) < 3) {

    foreach ($noticias as $item) {

        if (
            ($item['estado'] ?? 'publicado')
            !== 'publicado'
        ) {
            continue;
        }

        if (
            (int)($item['id'] ?? 0) ===
            (int)($noticia['id'] ?? 0)
        ) {
            continue;
        }

        $yaExiste = false;

        foreach ($relacionadas as $r) {

            if (
                (int)$r['id'] ===
                (int)$item['id']
            ) {
                $yaExiste = true;
                break;
            }
        }

        if (!$yaExiste) {
            $relacionadas[] = $item;
        }

        if (count($relacionadas) >= 3) {
            break;
        }
    }
}


/*
|--------------------------------------------------------------------------
| JSON-LD
|--------------------------------------------------------------------------
*/

$schema = [

    '@context' => 'https://schema.org',

    '@type' => 'NewsArticle',

    'headline' => $titulo,

    'description' => $meta,

    'datePublished' =>
        $noticia['fecha_iso']
        ?? date('c'),

    'dateModified' =>
        $noticia['fecha_iso']
        ?? date('c'),

    'author' => [

        '@type' => 'Person',

        'name' => $autor

    ],

    'publisher' => [

        '@type' => 'Organization',

        'name' => 'Arena 24'

    ],

    'mainEntityOfPage' => [

        '@type' => 'WebPage',

        '@id' => $urlActual

    ]

];

if ($imagenCompartir !== '') {

    $schema['image'] = [
        $imagenCompartir
    ];
}

$schemaJSON =
    json_encode(
        $schema,
        JSON_UNESCAPED_UNICODE |
        JSON_UNESCAPED_SLASHES |
        JSON_PRETTY_PRINT
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

<title>
<?=e($titulo)?> | Arena 24
</title>

<meta
    name="description"
    content="<?=e($meta)?>"
>

<link
    rel="canonical"
    href="<?=e($urlActual)?>"
>


<!-- OPEN GRAPH -->

<meta
    property="og:type"
    content="article"
>

<meta
    property="og:title"
    content="<?=e($titulo)?>"
>

<meta
    property="og:description"
    content="<?=e($meta)?>"
>

<meta
    property="og:url"
    content="<?=e($urlActual)?>"
>

<meta
    property="og:site_name"
    content="Arena 24"
>

<?php if ($imagenCompartir !== ''): ?>

<meta
    property="og:image"
    content="<?=e($imagenCompartir)?>"
>

<?php endif; ?>


<!-- TWITTER / X -->

<meta
    name="twitter:card"
    content="summary_large_image"
>

<meta
    name="twitter:title"
    content="<?=e($titulo)?>"
>

<meta
    name="twitter:description"
    content="<?=e($meta)?>"
>

<?php if ($imagenCompartir !== ''): ?>

<meta
    name="twitter:image"
    content="<?=e($imagenCompartir)?>"
>

<?php endif; ?>


<!-- JSON-LD -->

<script type="application/ld+json">
<?= $schemaJSON ?>
</script>


<style>

/*
|--------------------------------------------------------------------------
| RESET
|--------------------------------------------------------------------------
*/

* {
    box-sizing:border-box;
}

body {
    margin:0;
    background:#f5f6f8;
    color:#101828;
    font-family:
        Arial,
        Helvetica,
        sans-serif;
}


/*
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
*/

.header {
    background:#071a33;
    color:white;
}

.header-inner {
    width:min(
        1180px,
        calc(100% - 30px)
    );

    min-height:70px;

    margin:auto;

    display:flex;

    align-items:center;

    justify-content:space-between;
}

.logo {
    color:white;
    text-decoration:none;

    font-size:30px;

    font-weight:900;

    letter-spacing:-1px;
}

.logo span {
    color:#e21d2f;
}

.menu {
    display:flex;
    gap:22px;
}

.menu a {
    color:white;
    text-decoration:none;

    font-size:13px;

    font-weight:bold;
}

.menu a:hover {
    color:#ff4656;
}


/*
|--------------------------------------------------------------------------
| BARRA SUPERIOR
|--------------------------------------------------------------------------
*/

.topline {
    border-bottom:1px solid #e5e7eb;
    background:white;
}

.topline-inner {
    width:min(
        1180px,
        calc(100% - 30px)
    );

    margin:auto;

    padding:11px 0;

    color:#667085;

    font-size:12px;
}


/*
|--------------------------------------------------------------------------
| CONTENIDO
|--------------------------------------------------------------------------
*/

.container {
    width:min(
        1180px,
        calc(100% - 30px)
    );

    margin:35px auto 70px;
}

.breadcrumb {
    color:#667085;
    font-size:13px;
    margin-bottom:20px;
}

.breadcrumb a {
    color:#071a33;
    text-decoration:none;
    font-weight:bold;
}


/*
|--------------------------------------------------------------------------
| ARTÍCULO
|--------------------------------------------------------------------------
*/

.article {
    background:white;

    border-radius:12px;

    overflow:hidden;

    box-shadow:
        0 8px 30px
        rgba(16,24,40,.06);
}

.article-header {
    padding:
        38px
        38px
        25px;
}

.category {
    display:inline-block;

    background:#e21d2f;

    color:white;

    padding:6px 10px;

    border-radius:4px;

    font-size:11px;

    font-weight:bold;

    text-transform:uppercase;
}

h1 {
    font-family:
        Georgia,
        'Times New Roman',
        serif;

    font-size:
        clamp(
            34px,
            5vw,
            58px
        );

    line-height:1.04;

    letter-spacing:-1.5px;

    margin:
        17px
        0
        15px;

    color:#071a33;
}

.bajada {
    font-family:
        Georgia,
        serif;

    font-size:20px;

    line-height:1.5;

    color:#475467;

    max-width:900px;
}

.meta {
    margin-top:20px;

    padding-top:17px;

    border-top:1px solid #eee;

    color:#667085;

    font-size:13px;
}


/*
|--------------------------------------------------------------------------
| FOTO
|--------------------------------------------------------------------------
*/

.hero {
    width:100%;

    max-height:650px;

    object-fit:cover;

    display:block;
}

.hero-placeholder {
    height:350px;

    background:
        linear-gradient(
            135deg,
            #071a33,
            #153b68
        );

    display:flex;

    align-items:center;

    justify-content:center;

    color:white;

    font-size:35px;

    font-weight:900;
}


/*
|--------------------------------------------------------------------------
| CUERPO
|--------------------------------------------------------------------------
*/

.article-content {
    padding:
        35px
        38px
        45px;

    max-width:900px;

    margin:auto;
}

.article-content p {
    font-family:
        Georgia,
        'Times New Roman',
        serif;

    font-size:19px;

    line-height:1.75;

    margin:
        0
        0
        22px;
}

.article-content h2 {
    font-family:Georgia,serif;

    font-size:28px;

    margin:
        35px
        0
        15px;
}

.article-content strong {
    color:#071a33;
}


/*
|--------------------------------------------------------------------------
| COMPARTIR
|--------------------------------------------------------------------------
*/

.share {
    display:flex;

    align-items:center;

    gap:8px;

    margin-top:35px;

    padding-top:25px;

    border-top:1px solid #eee;
}

.share span {
    font-size:13px;

    font-weight:bold;

    margin-right:5px;
}

.share a {
    display:flex;

    align-items:center;

    justify-content:center;

    width:38px;

    height:38px;

    border-radius:50%;

    color:white;

    text-decoration:none;

    font-size:13px;

    font-weight:bold;
}

.whatsapp {
    background:#25d366;
}

.facebook {
    background:#1877f2;
}

.x {
    background:#000;
}


/*
|--------------------------------------------------------------------------
| RELACIONADAS
|--------------------------------------------------------------------------
*/

.related {
    margin-top:40px;
}

.related h2 {
    font-family:Georgia,serif;

    color:#071a33;

    font-size:28px;
}

.related-grid {
    display:grid;

    grid-template-columns:
        repeat(3,1fr);

    gap:20px;
}

.card {
    background:white;

    border-radius:10px;

    overflow:hidden;

    box-shadow:
        0 5px 20px
        rgba(16,24,40,.06);
}

.card img {
    width:100%;

    height:170px;

    object-fit:cover;

    display:block;
}

.card-placeholder {
    height:170px;

    background:#071a33;
}

.card-body {
    padding:17px;
}

.card-category {
    color:#e21d2f;

    font-size:10px;

    font-weight:bold;

    text-transform:uppercase;
}

.card h3 {
    margin:
        7px
        0
        0;

    font-family:Georgia,serif;

    font-size:20px;

    line-height:1.2;
}

.card a {
    color:#071a33;

    text-decoration:none;
}


/*
|--------------------------------------------------------------------------
| FOOTER
|--------------------------------------------------------------------------
*/

.footer {
    background:#071a33;

    color:#cbd5e1;

    padding:35px 0;

    margin-top:60px;
}

.footer-inner {
    width:min(
        1180px,
        calc(100% - 30px)
    );

    margin:auto;

    display:flex;

    justify-content:space-between;

    gap:20px;
}

.footer-logo {
    color:white;

    font-size:25px;

    font-weight:900;
}

.footer-logo span {
    color:#e21d2f;
}


/*
|--------------------------------------------------------------------------
| RESPONSIVE
|--------------------------------------------------------------------------
*/

@media(max-width:800px) {

    .menu {
        display:none;
    }

    .article-header {
        padding:25px 20px 20px;
    }

    h1 {
        font-size:36px;
    }

    .bajada {
        font-size:18px;
    }

    .article-content {
        padding:
            25px
            20px
            35px;
    }

    .article-content p {
        font-size:18px;
    }

    .related-grid {
        grid-template-columns:1fr;
    }

    .hero {
        max-height:400px;
    }

    .footer-inner {
        flex-direction:column;
    }
}

</style>

</head>


<body>


<header class="header">

<div class="header-inner">

<a
class="logo"
href="index.html"
>
ARENA<span>24</span>
</a>

<nav class="menu">

<a href="index.html">
INICIO
</a>

<a href="index.html#la-rioja">
LA RIOJA
</a>

<a href="index.html#politica">
POLÍTICA
</a>

<a href="index.html#sociedad">
SOCIEDAD
</a>

<a href="index.html#deportes">
DEPORTES
</a>

</nav>

</div>

</header>


<div class="topline">

<div class="topline-inner">

Arena 24 · Información y actualidad

</div>

</div>


<main class="container">


<div class="breadcrumb">

<a href="index.html">
Arena 24
</a>

&nbsp; / &nbsp;

<?=e($categoria)?>

&nbsp; / &nbsp;

Noticia

</div>


<article class="article">


<header class="article-header">


<span class="category">

<?=e($categoria)?>

</span>


<h1>

<?=e($titulo)?>

</h1>


<div class="bajada">

<?=e($resumen)?>

</div>


<div class="meta">

Por
<strong>
<?=e($autor)?>
</strong>

&nbsp; · &nbsp;

<?=e($fecha)?>

</div>


</header>


<?php if ($imagen !== ''): ?>

<img
class="hero"
src="<?=e($imagen)?>"
alt="<?=e($titulo)?>"
loading="eager"
>

<?php else: ?>

<div class="hero-placeholder">

ARENA 24

</div>

<?php endif; ?>


<div class="article-content">


<?php

/*
|--------------------------------------------------------------------------
| PÁRRAFOS
|--------------------------------------------------------------------------
|
| El contenido se separa por saltos de línea.
|
*/

$parrafos =
    preg_split(
        "/\r\n|\n|\r/",
        $contenido
    );

foreach ($parrafos as $parrafo):

    $parrafo =
        trim($parrafo);

    if ($parrafo === '') {
        continue;
    }

?>

<p>
<?=nl2br(e($parrafo))?>
</p>

<?php endforeach; ?>


<div class="share">

<span>
Compartir:
</span>


<a
class="whatsapp"
target="_blank"
rel="noopener"
href="https://api.whatsapp.com/send?text=<?=rawurlencode($titulo . ' ' . $urlActual)?>"
aria-label="Compartir por WhatsApp"
>
WA
</a>


<a
class="facebook"
target="_blank"
rel="noopener"
href="https://www.facebook.com/sharer/sharer.php?u=<?=rawurlencode($urlActual)?>"
aria-label="Compartir en Facebook"
>
f
</a>


<a
class="x"
target="_blank"
rel="noopener"
href="https://twitter.com/intent/tweet?text=<?=rawurlencode($titulo)?>&url=<?=rawurlencode($urlActual)?>"
aria-label="Compartir en X"
>
X
</a>

</div>


</div>

</article>


<?php if (count($relacionadas) > 0): ?>

<section class="related">

<h2>
También te puede interesar
</h2>


<div class="related-grid">


<?php foreach ($relacionadas as $r): ?>

<?php

$rSlug =
    $r['slug']
    ?? crearSlugLocal(
        $r['titulo'] ?? ''
    );

?>

<article class="card">

<?php if (!empty($r['imagen'])): ?>

<img
src="<?=e($r['imagen'])?>"
alt="<?=e($r['titulo'])?>"
loading="lazy"
>

<?php else: ?>

<div class="card-placeholder">
</div>

<?php endif; ?>


<div class="card-body">

<div class="card-category">

<?=e($r['categoria'] ?? '')?>

</div>

<h3>

<a
href="noticia.php?slug=<?=rawurlencode($rSlug)?>"
>

<?=e($r['titulo'] ?? '')?>

</a>

</h3>

</div>

</article>

<?php endforeach; ?>


</div>

</section>

<?php endif; ?>


</main>


<footer class="footer">

<div class="footer-inner">

<div>

<div class="footer-logo">
ARENA<span>24</span>
</div>

<div>
Información y actualidad.
</div>

</div>


<div>
© <?=date('Y')?> Arena 24
</div>

</div>

</footer>


</body>

</html>
