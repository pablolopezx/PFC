import os
import pandas as pd
from django.core.management.base import BaseCommand
from futsimapp.models import Equipo, Jugador, Competicion
from django.utils.dateparse import parse_date

class Command(BaseCommand):
    help = 'Load data from Excel file into the database'

    def handle(self, *args, **kwargs):
        # Insertar datos de competiciones
        competiciones_data = [
            {"url": "https://es.besoccer.com/competicion/primera", "nombre": "LaLiga EA Sports", "ranking_pais": 1},
            {"url": "https://es.besoccer.com/competicion/segunda", "nombre": "LaLiga Hypermotion", "ranking_pais": 2},
            {"url": "https://es.besoccer.com/competicion/primera_division_rfef", "nombre": "1ª RFEF", "ranking_pais": 3},
        ]

        for data in competiciones_data:
            competicion, created = Competicion.objects.get_or_create(
                nombre=data["nombre"],
                defaults={
                    "url": data["url"],
                    "ranking_pais": data["ranking_pais"]
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Competición '{data['nombre']}' creada."))
            else:
                self.stdout.write(self.style.WARNING(f"Competición '{data['nombre']}' ya existía."))

        # Obtener la ruta del archivo Excel
        base_dir = os.path.dirname(os.path.abspath(__file__))
        excel_path = os.path.join(base_dir, '..', '..', 'archivo_unificado.xlsx')

        # Leer el archivo Excel
        df = pd.read_excel(excel_path)

        for _, row in df.iterrows():
            # Obtener o crear instancias de Competicion
            competicion = Competicion.objects.get(nombre=row['Competicion'])

            # Obtener o crear instancias de Equipo
            equipo, created_equipo = Equipo.objects.get_or_create(
                nombre=row['Equipo'],
                defaults={'ano_fundacion': None, 'competicion': competicion, 'posicion': None}
            )
            if created_equipo:
                self.stdout.write(self.style.WARNING(f"Equipo '{row['Equipo']}' no existía. Se ha creado uno nuevo con valores nulos."))

            # Preparar el valor de fecha de nacimiento
            fecha_nacimiento = row['Fecha nacimiento']
            if pd.notna(fecha_nacimiento):
                fecha_nacimiento = str(fecha_nacimiento)
                fecha_nacimiento = parse_date(fecha_nacimiento)
            else:
                # Proveer una fecha por defecto, o manejar el error según sea necesario
                fecha_nacimiento = parse_date("1900-01-01")  # Ejemplo de fecha por defecto

            # Preparar valores de porcentaje
            posicion_princ_percent = row['Posicion princ %']
            if pd.notna(posicion_princ_percent) and isinstance(posicion_princ_percent, str) and '%' in posicion_princ_percent:
                posicion_princ_percent = float(posicion_princ_percent.replace('%', ''))
            else:
                posicion_princ_percent = 0.0  # Valor por defecto si es NaN o no válido

            posicion_altern_percent = row['Posicion Altern%']
            if pd.notna(posicion_altern_percent) and isinstance(posicion_altern_percent, str) and '%' in posicion_altern_percent:
                posicion_altern_percent = float(posicion_altern_percent.replace('%', ''))
            else:
                posicion_altern_percent = 0.0  # Valor por defecto si es NaN o no válido

            # Crear o actualizar el jugador
            jugador, created = Jugador.objects.update_or_create(
                url=row['URL'],
                defaults={
                    'temporada': row['Temporada'] if pd.notna(row['Temporada']) else None,
                    'equipo': equipo,
                    'edad': row['Edad'] if pd.notna(row['Edad']) else 0,
                    'nombre': row['Nombre'] if pd.notna(row['Nombre']) else '',
                    'fecha_nacimiento': fecha_nacimiento,
                    'demarcacion': row['demarcacion'] if pd.notna(row['demarcacion']) else '',
                    'pierna': row['pierna'] if pd.notna(row['pierna']) else '',
                    'elo': row['elo'] if pd.notna(row['elo']) else 0,
                    'competicion': competicion,
                    'valor_mercado': row['Valor de Mercado'] if pd.notna(row['Valor de Mercado']) else 0,
                    'goles': row['Goles'] if pd.notna(row['Goles']) else 0,  # Asignar 0 si es NaN
                    'minutos_jugados': row['MinutosJugados'] if pd.notna(row['MinutosJugados']) else 0,
                    'posicion_principal': row['Posicion principal'] if pd.notna(row['Posicion principal']) else '',
                    'posicion_princ_percent': posicion_princ_percent,
                    'posicion_alternativa': row['Posicion Alternativa'] if pd.notna(row['Posicion Alternativa']) else '',
                    'posicion_altern_percent': posicion_altern_percent,
                    'url_imagen': row['image_src'] if pd.notna(row['image_src']) else ''
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Jugador '{jugador.nombre}' creado."))
            else:
                self.stdout.write(self.style.SUCCESS(f"Jugador '{jugador.nombre}' actualizado."))
