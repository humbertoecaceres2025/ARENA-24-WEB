import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import html
import re


OUTPUT = "noticias.json"


def limpiar(texto):
    if not texto:
        return ""

    texto = html.unescape(texto)

    texto = re.sub(
        r"<[^>]+>",
        "",
        texto
    )

    texto = re.sub(
        r"\s+",
        " ",
        texto
    )

    return texto.strip()


def obtener_rss(consulta, cantidad=8):

    query = urllib.parse.quote(
        consulta
    )

    url = (
        "https://news.google.com/rss/search?"
        f"q={query}&hl=es-419&gl=AR&ceid=AR:es-419"
    )

    request = urllib.request.Request(
        url,
        headers={
            "User-Agent":
            "Mozilla/5.0 ARENA24 NewsBot"
        }
    )

    try:

        with urllib.request.urlopen(
            request,
            timeout=30
        ) as response:

            contenido = response.read()

        root = ET.fromstring(contenido)

    except Exception as error:

        print(
            f"Error RSS {consulta}: {error}"
        )

        return []


    resultado = []

    for item in root.findall(
        ".//item"
    )[:cantidad]:

        titulo = limpiar(
            item.findtext("title")
        )

        descripcion = limpiar(
            item.findtext("description")
        )

        fuente = limpiar(
            item.findtext("source")
        )

        fecha = limpiar(
            item.findtext("pubDate")
        )

        link = limpiar(
            item.findtext("link")
        )


        if not titulo:
            continue


        resultado.append({

            "title": titulo,

            "description":
                descripcion[:300],

            "source":
                fuente or "Google News",

            "date":
                fecha,

            "url":
                link

        })


    return resultado


def quitar_duplicados(articulos):

    vistos = set()

    resultado = []

    for articulo in articulos:

        clave = articulo["title"].lower()

        if clave in vistos:
            continue

        vistos.add(clave)

        resultado.append(articulo)

    return resultado


def main():

    print("ARENA 24 — actualizador de noticias")

    noticias = obtener_rss(
        "La Rioja Argentina noticias",
        10
    )

    policiales = obtener_rss(
        "La Rioja Argentina policiales OR seguridad OR justicia",
        10
    )

    deportes = obtener_rss(
        "Argentina deportes fútbol",
        10
    )


    noticias = quitar_duplicados(
        noticias
    )

    policiales = quitar_duplicados(
        policiales
    )

    deportes = quitar_duplicados(
        deportes
    )


    datos = {

        "actualizado":
            datetime.now(
                timezone.utc
            ).isoformat(),

        "noticias":
            noticias[:8],

        "policiales":
            policiales[:8],

        "deportes":
            deportes[:8]

    }


    with open(
        OUTPUT,
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
        "Noticias:",
        len(noticias)
    )

    print(
        "Policiales:",
        len(policiales)
    )

    print(
        "Deportes:",
        len(deportes)
    )


if __name__ == "__main__":
    main()
