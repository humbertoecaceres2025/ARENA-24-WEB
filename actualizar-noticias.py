import json
import re
from datetime import datetime, timezone

import requests
import feedparser


# =========================================================
# ARENA 24
# ACTUALIZADOR AUTOMÁTICO DE NOTICIAS
# =========================================================

SALIDA = "noticias.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 "
        "(compatible; ARENA24-NewsBot/1.0)"
    )
}


# =========================================================
# FUENTES RSS
# =========================================================

FUENTES = [

    {
        "categoria": "Noticias",
        "nombre": "Google Noticias - La Rioja",
        "url": (
            "https://news.google.com/rss/"
            "search?q=La+Rioja+Argentina"
            "&hl=es-419"
            "&gl=AR"
            "&ceid=AR:es-419"
        )
    },

    {
        "categoria": "Noticias",
        "nombre": "Google Noticias - Argentina",
        "url": (
            "https://news.google.com/rss/"
            "search?q=Argentina"
            "&hl=es-419"
            "&gl=AR"
            "&ceid=AR:es-419"
        )
    },

    {
        "categoria": "Policiales",
        "nombre": "Google Noticias - Policiales La Rioja",
        "url": (
            "https://news.google.com/rss/"
            "search?q=policiales+La+Rioja+Argentina"
            "&hl=es-419"
            "&gl=AR"
            "&ceid=AR:es-419"
        )
    },

    {
        "categoria": "Deportes",
        "nombre": "Google Noticias - Deportes Argentina",
        "url": (
            "https://news.google.com/rss/"
            "search?q=deportes+Argentina"
            "&hl=es-419"
            "&gl=AR"
            "&ceid=AR:es-419"
        )
    }

]


# =========================================================
# LIMPIAR HTML
# =========================================================

def limpiar_html(texto):

    if not texto:
        return ""

    texto = re.sub(
        r"<[^>]+>",
        "",
        texto
    )

    texto = (
        texto
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
    )

    return " ".join(
        texto.split()
    )


# =========================================================
# OBTENER RSS
# =========================================================

def obtener_feed(url):

    try:

        respuesta = requests.get(
            url,
            headers=HEADERS,
            timeout=20
        )

        respuesta.raise_for_status()

        return feedparser.parse(
            respuesta.content
        )

    except Exception as error:

        print(
            "Error RSS:",
            error
        )

        return None


# =========================================================
# EXTRAER NOTICIAS
# =========================================================

def obtener_noticias():

    resultado = []

    urls_vistas = set()

    for fuente in FUENTES:

        print(
            "Consultando:",
            fuente["nombre"]
        )

        feed = obtener_feed(
            fuente["url"]
        )

        if not feed:
            continue

        for item in feed.entries[:12]:

            titulo = limpiar_html(
                item.get(
                    "title",
                    ""
                )
            )

            descripcion = limpiar_html(
                item.get(
                    "summary",
                    ""
                )
            )

            enlace = (
                item.get(
                    "link",
                    ""
                )
            )

            if not titulo:
                continue

            if enlace in urls_vistas:
                continue

            urls_vistas.add(
                enlace
            )

            fecha = (
                item.get(
                    "published",
                    ""
                )
                or
                item.get(
                    "updated",
                    ""
                )
            )

            resultado.append({

                "categoria":
                    fuente["categoria"],

                "titulo":
                    titulo,

                "descripcion":
                    descripcion[:350],

                "fuente":
                    fuente["nombre"],

                "fecha":
                    fecha,

                "url":
                    enlace

            })


    return resultado


# =========================================================
# DÓLAR
# =========================================================

def obtener_dolar():

    try:

        url = (
            "https://dolarapi.com/"
            "v1/dolares/oficial"
        )

        respuesta = requests.get(
            url,
            timeout=15
        )

        respuesta.raise_for_status()

        data = respuesta.json()

        return {

            "compra":
                data.get(
                    "compra",
                    "--"
                ),

            "venta":
                data.get(
                    "venta",
                    "--"
                )

        }

    except Exception as error:

        print(
            "Error dólar:",
            error
        )

        return {

            "compra": "--",
            "venta": "--"

        }


# =========================================================
# CLIMA
# =========================================================

def obtener_clima():

    try:

        # Coordenadas aproximadas de La Rioja Capital
        lat = -29.4131
        lon = -66.8558

        url = (
            "https://api.open-meteo.com/"
            "v1/forecast"
        )

        parametros = {

            "latitude":
                lat,

            "longitude":
                lon,

            "current":
                "temperature_2m,"
                "weather_code",

            "timezone":
                "America/Argentina/La_Rioja"

        }

        respuesta = requests.get(
            url,
            params=parametros,
            timeout=15
        )

        respuesta.raise_for_status()

        data = respuesta.json()

        actual =
            data.get(
                "current",
                {}
            )

        temperatura =
            actual.get(
                "temperature_2m",
                "--"
            )

        codigo =
            actual.get(
                "weather_code",
                0
            )

        descripcion, icono = \
            interpretar_clima(
                codigo
            )

        return {

            "ciudad":
                "La Rioja",

            "temperatura":
                temperatura,

            "descripcion":
                descripcion,

            "icono":
                icono

        }

    except Exception as error:

        print(
            "Error clima:",
            error
        )

        return {

            "ciudad":
                "La Rioja",

            "temperatura":
                "--",

            "descripcion":
                "No disponible",

            "icono":
                "🌤️"

        }


# =========================================================
# INTERPRETAR CLIMA
# =========================================================

def interpretar_clima(codigo):

    if codigo == 0:
        return "Despejado", "☀️"

    if codigo in [1, 2]:
        return "Parcialmente nublado", "🌤️"

    if codigo == 3:
        return "Nublado", "☁️"

    if codigo in [45, 48]:
        return "Niebla", "🌫️"

    if codigo in [51, 53, 55]:
        return "Llovizna", "🌦️"

    if codigo in [61, 63, 65]:
        return "Lluvia", "🌧️"

    if codigo in [71, 73, 75]:
        return "Nieve", "❄️"

    if codigo in [80, 81, 82]:
        return "Chaparrones", "🌦️"

    if codigo in [95, 96, 99]:
        return "Tormenta", "⛈️"

    return "Condiciones variables", "🌤️"


# =========================================================
# GENERAR JSON
# =========================================================

def guardar():

    print(
        "================================"
    )

    print(
        "ARENA 24"
    )

    print(
        "Actualización automática"
    )

    print(
        "================================"
    )


    noticias =
        obtener_noticias()


    dolar =
        obtener_dolar()


    clima =
        obtener_clima()


    datos = {

        "actualizado":
            datetime.now(
                timezone.utc
            ).isoformat(),

        "noticias":
            noticias,

        "dolar":
            dolar,

        "clima":
            clima

    }


    with open(
        SALIDA,
        "w",
        encoding="utf-8"
    ) as archivo:

        json.dump(
            datos,
            archivo,
            ensure_ascii=False,
            indent=2
        )


    print(
        f"Noticias obtenidas: {len(noticias)}"
    )

    print(
        "Dólar:",
        dolar
    )

    print(
        "Clima:",
        clima
    )

    print(
        "Archivo generado:",
        SALIDA
    )


# =========================================================
# EJECUTAR
# =========================================================

if __name__ == "__main__":

    guardar()
