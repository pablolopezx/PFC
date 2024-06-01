import os
import pandas as pd
from django.core.management.base import BaseCommand
from futsimapp.models import Equipo, Competicion

class Command(BaseCommand):
    help = 'Cargar datos de equipos desde un archivo Excel y eliminar equipos sin posición'

    def handle(self, *args, **kwargs):
        # Eliminar todos los equipos que no tienen posición
        equipos_sin_posicion = Equipo.objects.filter(posicion__isnull=True)
        count = equipos_sin_posicion.count()
        equipos_sin_posicion.delete()
        self.stdout.write(self.style.SUCCESS(f"{count} equipos sin posición eliminados."))

        # Obtener la ruta del archivo Excel
        base_dir = os.path.dirname(os.path.abspath(__file__))
        excel_path = os.path.join(base_dir, '..', '..', 'equipos_unificado.xlsx')

        # Leer el archivo Excel
        df = pd.read_excel(excel_path)

        # Verificar y mostrar los nombres de las columnas
        print(df.columns)

        # Iterar sobre cada fila del DataFrame
        for _, row in df.iterrows():
            # Obtener la competición correspondiente
            competicion_nombre = row['Competicion']
            competicion = Competicion.objects.get(nombre=competicion_nombre)

            # Manejar el valor del año de fundación
            if pd.notna(row['Fecha de fundación']):
                ano_fundacion = row['Fecha de fundación']
            else:
                ano_fundacion = 0  # Valor por defecto

            # Actualizar o crear instancia de Equipo
            equipo, created = Equipo.objects.update_or_create(
                nombre=row['Nombre'],
                defaults={
                    'ano_fundacion': ano_fundacion,
                    'competicion': competicion,
                    'posicion': row['Posición']
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Equipo '{row['Nombre']}' creado."))
            else:
                self.stdout.write(self.style.SUCCESS(f"Equipo '{row['Nombre']}' actualizado."))
