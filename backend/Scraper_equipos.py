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

nombres_competiciones = ["primera", "segunda", "primera_division_rfef"]

competicion_elegida = elegir_competicion(nombres_competiciones)

# Lista para almacenar todos los datos recolectados
datos_totales = []

# Seleccionamos el nombre de la competición y grupo elegidos
nombre_competicion = nombres_competiciones[competicion_elegida]

# Diccionario para almacenar datos de las competiciones
datos = {}

# URL de la página de clasificación de la competición
paginaCompeticiones = f"https://es.besoccer.com/competicion/clasificacion/{nombre_competicion}/2024/"
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

