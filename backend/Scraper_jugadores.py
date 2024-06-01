# Importamos las librerías necesarias
from collections import defaultdict
import requests
import os
import time
import pandas as pd
import datetime
from bs4 import BeautifulSoup
from fake_useragent import UserAgent

# Marcamos el inicio del tiempo de ejecución
ini = time.time()

# Creamos un objeto UserAgent para generar cabeceras HTTP aleatorias
ua = UserAgent()
headers = {"user-agent": ua.random}

# Función para elegir la competición a scrapear
def elegir_competicion(nombres_competiciones):
    while True:
        print("Lista de competiciones disponibles:")
        for i, nombre in enumerate(nombres_competiciones):
            print(f"{i}. {nombre}")
        try:
            competicion_elegida = int(
                input(
                    "Elija una competición tecleando un número (0-{}): ".format(
                        len(nombres_competiciones) - 1
                    )
                )
            )
            if 0 <= competicion_elegida <= len(nombres_competiciones) - 1:
                return competicion_elegida
            else:
                print("Por favor elija un número dentro del rango")
        except ValueError:
            print("Por favor introduce un número")

# Función para elegir el grupo dentro de la competición
def elegir_grupo(nombres_grupos_nac):
    while True:
        print("Grupos disponibles:")
        for i, nombre in enumerate(nombres_grupos_nac):
            print(f"{i}. {nombre}")
        try:
            grupo_elegido = int(
                input(
                    "Elija una competición tecleando un número (0-{}): ".format(
                        len(nombres_grupos_nac) - 1
                    )
                )
            )
            if 0 <= grupo_elegido <= len(nombres_grupos_nac) - 1:
                return grupo_elegido
            else:
                print("Por favor elija un número dentro del rango")
        except ValueError:
            print("Por favor introduce un número")

# Listas de nombres de competiciones y grupos disponibles
nombres_grupos_nac = ["grupo1", "grupo2"]
nombres_competiciones = ["primera", "segunda", "primera_division_rfef"]

# Seleccionamos la competición y el grupo
competicion_elegida = elegir_competicion(nombres_competiciones)
grupo_elegido = elegir_grupo(nombres_grupos_nac)

# Lista para almacenar todos los datos recolectados
datos_totales = []

# Seleccionamos el nombre de la competición y grupo elegidos
nombre_competicion = nombres_competiciones[competicion_elegida]
nombre_grupo = nombres_grupos_nac[grupo_elegido]

# Lista para almacenar los URLs de los equipos
urls_equipos = []

# Diccionario para almacenar datos de jugadores con distintas etiquetas
datos = {}

# Listas para almacenar redes sociales, nombres y edades de los jugadores
redes_jugadores = []
nombres_jugadores = []
edad_jugadores = []

# URL de la página de clasificación de la competición
paginaCompeticiones = f"https://es.besoccer.com/competicion/clasificacion/{nombre_competicion}/2024/{nombre_grupo}"
respuestaCompeticiones = requests.get(paginaCompeticiones, headers=headers)
htmlCompeticiones = BeautifulSoup(respuestaCompeticiones.content, "html.parser")
nombresEquipos = htmlCompeticiones.find_all("td", {"class": "name"})

# Guardamos los enlaces a los equipos
urls_equipos = [
    equipo.find("a", href=True)["href"].replace("equipo", "equipo/plantilla")
    for equipo in nombresEquipos
    if equipo.find("span", {"class": "team-name"})
]

# Creamos una sesión para mantener las conexiones HTTP
session = requests.Session()

# Listas para almacenar datos de jugadores y equipos
jugadores = []
equipos_rep = []
urls_jugadores = []
occurrences = defaultdict(int)

# Recorremos cada equipo y extraemos los datos de sus jugadores
for url_equipo in urls_equipos:
    response = session.get(url_equipo, headers=headers)
    htmlEquipos = BeautifulSoup(response.text, "html.parser")
    nombre_equipo = htmlEquipos.select_one("h2.title.ta-c").text
    occurrences[nombre_equipo] += 1
    jugadores += htmlEquipos.select("td.name")
    equipos_rep += [nombre_equipo] * len(jugadores)
    urls_jugadores = [jugador.select_one("a[href]")["href"] for jugador in jugadores]

    # Recorremos cada jugador y extraemos sus datos
    for urljugador in urls_jugadores:
        respuestaJugadores = requests.get(urljugador, headers=headers)
        htmlJugadores = BeautifulSoup(respuestaJugadores.content, "html.parser")

        redesJugadores = htmlJugadores.find("div", class_="desc-boxes")
        twitter_url = None
        if redesJugadores is not None:
            twitter = redesJugadores.find_all("div", class_=["sub-text2", "break-url"])
            for sub, url in zip(twitter[::2], twitter[1::2]):
                if sub.text.strip() == "Twitter" and twitter != None:
                    twitter_url = url.text
                    break
        redes_jugadores.append(twitter_url)

        datos = {}
        datos["URL"] = urljugador

        # Extraemos la posición principal del jugador
        main_role = htmlJugadores.find("div", class_="main-role")
        other_roles = htmlJugadores.find("ul", class_="position-list")

        if main_role:
            role_span = main_role.find_all("span")
            if role_span:
                datos["Posicion principal"] = role_span[0].text
                datos["Posicion princ %"] = role_span[1].text
        else:
            datos["Posicion principal"] = None
            datos["Posicion princ %"] = None

        if other_roles:
            other_role = other_roles.find_all("li")
            if other_role:
                for element in other_role:
                    text_split = element.text.strip().split("\n")
                    posicion = text_split[0]
                    porcentaje = text_split[1]
                    datos["Posicion Alternativa"] = posicion
                    datos["Posicion Altern%"] = porcentaje
        else:
            datos["Posicion Alternativa"] = None
            datos["Posicion Altern%"] = None

        # Extraemos otros datos del jugador
        for item_col in htmlJugadores.find_all("div", class_="item-col"):
            main_line = item_col.find("div", class_="main-line")
            other_line = item_col.find("div", class_="other-line")
            if main_line and other_line:
                other_line_texts = other_line.find_all("div")
                for other_line_text in other_line_texts:
                    text = other_line_text.text.strip()
                    if text == "Minutos":
                        datos["MinutosJugados"] = main_line.text.replace("'", "")
                    elif text == "Goles/90'":
                        datos["Goles"] = main_line.text

        divDataPanelTitle = htmlJugadores.find_all("div", class_="panel-subtitle")

        for div in divDataPanelTitle:
            if div.text not in nombres_jugadores:
                nombres_jugadores.append(div.text)
                break
        divDataTableList = htmlJugadores.find_all("div", class_="table-row")

        for div in divDataTableList:
            divText = div.find("div")
            if divText is not None:
                continue
            for elements in divText.next_siblings:
                if elements.isspace() or divText.text == "":
                    continue
                if divText.text.strip() == "Fecha nacimiento":
                    fecha_nacimiento = datetime.datetime.strptime(
                        elements.text.strip(), "%d/%m/%Y"
                    )
                    hoy = datetime.datetime.now()
                    edad = (
                        hoy.year
                        - fecha_nacimiento.year
                        - (
                            (hoy.month, hoy.day)
                            < (fecha_nacimiento.month, fecha_nacimiento.day)
                        )
                    )
                else:
                    datos[divText.text.strip()] = elements.text.strip()
                    link = elements.find("a", class_="image-row link")
                    if link is not None:
                        datos[link.text] = link["href"]
                break

        edad_jugadores.append(edad)

        # Actualizamos el diccionario de datos con los datos recolectados
        min_length = min(
            len(edad_jugadores),
            len(equipos_rep),
            len(nombres_jugadores),
            len(redes_jugadores),
        )
        for i in range(min_length):
            datos.update(
                {
                    "Edad": str(edad_jugadores[i]),
                    "Temporada": "2022/23",
                    "Equipo": equipos_rep[i],
                    "Nombre": nombres_jugadores[i],
                    "Twitter": redes_jugadores[i],
                }
            )

        datos_totales.append(datos)

# Convertimos los datos recolectados a un DataFrame de pandas
df = pd.DataFrame(datos_totales)

# Definimos las columnas del DataFrame
columnas_nuevas = [
    "URL",
    "Temporada",
    "Equipo",
    "Edad",
    "Nombre",
    "Localidad nacimiento",
    "Demarcación",
    "Pierna predominante",
    "ELO",
    "Potencial",
    "Competición principal",
    "Equipo anterior",
    "Competicion anterior",
    "Fin contrato",
    "Valor mercado",
    "Goles",
    "MinutosJugados",
    "Agente",
    "Salario",
    "Twitter",
    "Posicion principal",
    "Posicion princ %",
    "Posicion Alternativa",
    "Posicion Altern%",
]

# Mapeamos los nombres de las columnas para hacerlos más legibles
nuevos_nombres = {
    "Localidad nacimiento": "Lugar nacimiento",
    "Demarcación": "demarcacion",
    "Pierna predominante": "pierna",
    "ELO": "elo",
    "Potencial": "potencial",
    "Competición principal": "Competicion",
    "Competición anterior": "Competicion anterior",
    "Fin contrato": "Fin de Contrato",
    "Valor mercado": "Valor de Mercado",
}

# Reindexamos y renombramos las columnas del DataFrame
df = df.reindex(columns=columnas_nuevas)
df.rename(columns=nuevos_nombres, inplace=True)

# Imprimimos el DataFrame para verificar los datos
print(df)

# Exportamos los datos a un archivo Excel
df.to_excel(
    os.path.expanduser("~/Desktop\\") + "España-" + nombre_competicion + " - " + nombre_grupo + ".xlsx",
    index=False,
    header=True,
)

# Marcamos el fin del tiempo de ejecución y calculamos la duración
fin = time.time()
m, s = divmod(fin - ini, 60)
print(f"Tiempo de ejecución: {m:.0f} minuto(s) y {s:.2f} segundo(s)")
