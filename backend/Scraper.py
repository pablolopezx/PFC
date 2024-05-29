import requests as M
import os
import time as R
import pandas as A1
from bs4 import BeautifulSoup as T
from fake_useragent import UserAgent as A2
from collections import defaultdict as A0
import datetime as AF

# Variables constantes y diccionarios
z = 'MinutosJugados'
y = 'Valor de Mercado'
v = 'Edad'
u = 'Temporada'
t = 'URL'
s = 'href'
r = 'class'
f = 'Posicion Altern%'
e = 'Posicion Alternativa'
d = 'Posicion princ %'
c = 'Posicion principal'
b = 'Twitter'
a = 'Fin de Contrato'
Z = 'elo'
Y = 'Competicion anterior'
X = 'Competicion'
W = 'Equipo'
V = 'span'
U = 'html.parser'
Q = 'Equipo anterior'
P = 'a'
O = True
N = len
L = 'demarcacion'
K = 'Agente'
J = 'pierna'
F = 'Nombre'
AA = 'URL de Imagen'

# Configuración de user-agent
A3 = R.time()
A4 = A2()
D = {'user-agent': A4.random}

# Función para obtener el sufijo de la URL según la competición
def A6(nombre_competicion):
    if nombre_competicion == "primera_division_rfef":
        return "grupoall"
    else:
        return ''

# Lista de competiciones disponibles
S = ['primera', 'segunda', 'primera_division_rfef']

# Solicitar al usuario que elija una competición
print("Elige una competición para scrapear:")
for i, comp in enumerate(S):
    print(f"{i + 1}. {comp}")
eleccion = int(input("Introduce el número de la competición: ")) - 1
competicion_seleccionada = S[eleccion]

# Variables para almacenar datos
g = []
h = []
AL = {}
AM = []
AN = []
AO = []

# Sesión de requests
j = M.Session()
H = []
AC = []
k = []
AD = A0(int)

# Función para obtener las URLs de los jugadores
def AE(headers, urls_equipos, session):
    jugadores = []
    equipos_rep = []
    for D in urls_equipos:
        E = session.get(D, headers=headers)
        B = T(E.text, U)
        C = B.select_one('h2.title.ta-c').text
        AD[C] += 1
        jugadores += B.select('td.name')
        equipos_rep += [C] * N(jugadores)
    return list(set([A.select_one('a[href]')[s] for A in jugadores]))

# Función para obtener y procesar los datos de los jugadores
def H(headers, datos_totales, session, urls_jugadores):
    AK = '.sub-text2, .break-url'
    AJ = 'number'
    AI = 'data-box'
    S = 'p'
    B = 'div'
    D = None
    for n in urls_jugadores:
        try:
            A = {}
            AL = session.get(n, headers=headers)
            E = T(AL.content, U)
            A[t] = n
            A[u] = '2023/24'
            o = E.select_one('.team-text.ta-r p.mb5')
            if o:
                A[W] = o.get_text(strip=O)
            p = E.find_all(B, class_=AI)
            if N(p) >= 2:
                g = p[1].find(S, class_=AJ).text
            else:
                g = D
            if g:
                A[v] = g
            q = E.find(B, class_='panel-head ta-c jc-ce')
            R = E.find(B, class_='panel-body table-list')
            if q:
                r = q.find(B, class_='panel-subtitle')
                if r:
                    A[F] = r.text.strip()
                else:
                    print("No se encontró el elemento 'panel-head ta-c jc-ce'")
            M = E.find(S, class_='color-grey2')
            if R:
                try:
                    A1 = R.find(B, string='Competición actual').find_next(P).text.strip()
                except AttributeError:
                    A1 = D
                    print(A[F], 'Error: no se pudo obtener la competición actual')
                try:
                    A2 = R.find(B, string='Competición anterior').find_next(P).text.strip()
                except AttributeError:
                    A2 = D
                    print(A[F], 'Error: no se pudo obtener la competición anterior')
                try:
                    A3 = R.find(B, string=Q).find_next(P).text.strip()
                except AttributeError:
                    A3 = D
                    print(A[F], 'Error: no se pudo obtener el equipo anterior')
                A[X] = A1
                A[Y] = A2
                A[Q] = A3
            else:
                A[X] = D
                A[Y] = D
                A[Q] = D
            h = E.find(B, class_='head-content')
            if h:
                try:
                    A4 = h.find(B, class_=Z)
                    if A4:
                        A[Z] = A4.text
                except AttributeError:
                    print(A[F], 'Error: no se pudo obtener la información del ELO')
                try:
                    i = h.find(B, class_=AI)
                    if i:
                        AM = i.find(S, class_=AJ).text
                        AN = i.find(S, class_='info').text
                        A[y] = AM + AN
                except AttributeError:
                    print(A[F], 'Error: no se pudo obtener la información del valor de mercado')
                A5 = E.find(B, string='Pie preferido')
                if A5:
                    try:
                        j = A5.find_next_sibling(B).text.strip()
                        if j:
                            if j == 'Pie derecho':
                                A[J] = 'Diestro'
                            elif j == 'Pie izquierdo':
                                A[J] = 'Zurdo'
                            else:
                                A[J] = ''
                    except AttributeError:
                        print(A[F], 'Error: no se pudo obtener la información del pie preferido')
                else:
                    A[J] = ''
            A6 = E.find(B, string='Información de contrato')
            try:
                for A7 in E.select('div.item-col:has(div.main-line:has(+div.other-line))'):
                    A8 = A7.select_one('div.main-line').text.replace("'", '')
                    for AO in A7.select('div.other-line div'):
                        A9 = AO.text.strip()
                        if A9 == 'Minutos':
                            A[z] = A8
                        elif A9 == "Goles/90'":
                            A['Goles'] = A8
            except AttributeError:
                print('Error: no se pudo obtener la información de los jugadores')
            try:
                if A6:
                    AA = A6.find_next_sibling(B, class_='table-body')
                    if AA:
                        for AB in AA.find_all(B, class_='table-row'):
                            if AB.find(B).text.strip() == 'Fin contrato':
                                try:
                                    AP = AB.find_all(B)[1].text.strip()
                                except AttributeError:
                                    print(A[F], 'Error: no se pudo obtener la información Fin de Contrato')
                                    A[a] = D
                                A[a] = AP
                I = E.find(B, string=K)
                if I:
                    A[K] = I.find_next_sibling(B).text.strip()
            except AttributeError:
                print('Error: no se pudo obtener la información del agente')
            AQ = {
                'ED': 'Extremo Derecho', 'EI': 'Extremo Izquierdo', 'DC': 'Delantero Centro', 'MCO': 'Mediocentro Ofensivo', 'MC': 'Mediocentro',
                'MCD': 'Mediocentro Defensivo','MP':'Media Punta', 'DFC': 'Defensa Central', 'LI': 'Lateral Izquierdo', 'LD': 'Lateral Derecho', 'PT': 'Portero'
            }
            H = E.find(B, string='En su demarcación')
            if H:
                H = H.find_next(B, class_='image-row')
                if H:
                    H = H.find(V, class_=lambda x: x and x.startswith('player-role bg-role rol'))
                    if H:
                        AC = H.text.strip()
                        A[L] = AQ.get(AC, AC)
                    else:
                        A[L] = D
                else:
                    A[L] = D
            else:
                A[L] = D
            if I:
                I = I.find_next_sibling(B).text.strip()
                A[K] = I
            else:
                A[K] = 'Desconocido'
            k = E.find(B, class_='desc-boxes')
            AD = D
            if k:
                for (AR, AS) in zip(k.select(AK)[::2], k.select(AK)[1::2]):
                    if AR.text.strip() == b:
                        AD = AS.text
            A[b] = AD
            AE = E.find(B, class_='main-role')
            if AE:
                AF = AE.find_all('li')
                if AF:
                    for AT in AF:
                        AG = AT.text.strip().split('\n')
                        AU = AG[0]
                        AV = AG[1]
                        A[e] = AU
                        A[f] = AV
            else:
                A[e] = D
                A[f] = D

            img_wrapper = E.find(B, class_='img-wrapper')
            if img_wrapper:
                img = img_wrapper.find('img')
                if img and img.has_attr('src'):
                    A[AA] = img['src']
                else:
                    A[AA] = D

            datos_totales.append(A)
            print(f"Jugador {A[F]} guardado correctamente")

        except Exception as ex:
            print(f"Error procesando la URL {n}: {ex}")
            continue

E = A6(competicion_seleccionada)
if E:
    i = f"https://es.besoccer.com/competicion/clasificacion/{competicion_seleccionada}/2024/{E}"
else:
    i = f"https://es.besoccer.com/competicion/clasificacion/{competicion_seleccionada}/2024"

A8 = M.get(i, headers=D)
A9 = T(A8.content, U)
AB = A9.find_all('td', {r: 'name'})
h = list(set([A.find(P, href=O)[s].replace('equipo', 'equipo/plantilla') for A in AB if A.find(V, {r: 'team-name'})]))

k = AE(D, h, j)

H(D, g, j, k)

A = A1.DataFrame(g)
AE = [t, u, W, v, F, L, J, Z, X, Y, Q, a, y, 'Goles', z, K, 'Salario', b, c, d, e, f, AA]
AG = AF.datetime.now()
AH = AG.strftime('%B')
I = os.path.expanduser('~/Desktop/besoccer ' + AH)
if not os.path.exists(I):
    os.makedirs(I)

columns_to_add = [col for col in AE if col not in A.columns]
for col in columns_to_add:
    A[col] = D

A = A.sort_values(W)
A = A.reindex(columns=AE)
print(A)
A.to_excel(I + f'/{competicion_seleccionada}_jugadores.xlsx', index=False, header=O)

AI = R.time()
AJ, AK = divmod(AI - A3, 60)
print(f"Tiempo de ejecución: {AJ:.0f} minuto(s) y {AK:.2f} segundo(s)")
