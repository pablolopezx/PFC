import pandas as pd
from django.core.management.base import BaseCommand
from futsimapp.models import Competicion, Equipo, Jugador

class Command(BaseCommand):
    help = 'Importar datos desde un archivo Excel'

    def handle(self, *args, **kwargs):
        df = pd.read_excel('ruta/a/tu/excel.xlsx')

        for index, row in df.iterrows():
            competicion, created = Competicion.objects.get_or_create(
                url=row['URL Competicion'],
                defaults={'nombre': row['Nombre Competicion'], 'ranking_pais': row['Ranking Pais']}
            )

            equipo, created = Equipo.objects.get_or_create(
                nombre=row['Nombre Equipo'],
                defaults={'ano_fundacion': row['Ano Fundacion'], 'competicion': competicion, 'posicion': row['Posicion Equipo']}
            )

            Jugador.objects.create(
                url=row['URL Jugador'],
                temporada=row['Temporada'],
                equipo=equipo,
                edad=row['Edad'],
                nombre=row['Nombre Jugador'],
                demarcacion=row['Demarcacion'],
                pierna=row['Pierna'],
                elo=row['ELO'],
                competicion=competicion,
                valor_mercado=row['Valor de Mercado'],
                goles=row['Goles'],
                asistencias=row['Asistencias'],
                minutos_jugados=row['Minutos Jugados'],
                posicion_principal=row['Posicion Principal'],
                posicion_princ_percent=row['Posicion princ %'],
                posicion_alternativa=row['Posicion Alternativa'],
                posicion_altern_percent=row['Posicion altern %'],
                url_imagen=row['URL Imagen']
            )

        self.stdout.write(self.style.SUCCESS('Datos importados correctamente'))
