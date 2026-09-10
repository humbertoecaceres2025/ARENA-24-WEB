# ARENA 24 — WEB LISTA PARA PUBLICAR
Incluye:
- index.html
- styles.css
- script.js
- Reproductor ZenoMedia configurado con el stream de ARENA 24
- Diseño responsive
- Programación 24/7
- Top 10
- ARENA 24 Flash
- Las cuatro voces
- Contacto

## GitHub Pages
Subí estos archivos al repositorio. Después:
Settings → Pages → Deploy from a branch → rama principal → carpeta raíz.
.github/workflows/actualizar-noticias.yml
generar_noticias.py
news.json

name: ARENA 24 - Actualizar noticias

on:

  schedule:
    - cron: "*/15 * * * *"

  workflow_dispatch:

  push:
    branches:
      - main

permissions:
  contents: write

jobs:

  actualizar-noticias:

    runs-on: ubuntu-latest

    steps:

      - name: Descargar repositorio
        uses: actions/checkout@v4

      - name: Configurar Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.x"

      - name: Generar news.json
        run: python generar_noticias.py

      - name: Guardar actualización
        run: |

          git config user.name "ARENA 24 Bot"

          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

          git add news.json

          if git diff --cached --quiet; then
            echo "No hay cambios."
          else
            git commit -m "ARENA 24 - actualización automática"
            git push
          fi


## IMPORTANTE
 redes sociales 
<img width="1366" height="768" alt="image" src="" />
