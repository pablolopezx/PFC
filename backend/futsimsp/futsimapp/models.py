from django.db import models

class Competicion(models.Model):
    url = models.URLField(unique=True)
    nombre = models.CharField(max_length=255)
    ranking_pais = models.IntegerField()

    def __str__(self):
        return self.nombre

class Equipo(models.Model):
    nombre = models.CharField(max_length=255)
    ano_fundacion = models.IntegerField()
    competicion = models.ForeignKey(Competicion, on_delete=models.CASCADE, related_name='equipos')
    posicion = models.IntegerField()

    def __str__(self):
        return self.nombre

class Jugador(models.Model):
    url = models.URLField(unique=True)
    temporada = models.CharField(max_length=50)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='jugadores')
    edad = models.IntegerField()
    nombre = models.CharField(max_length=255)
    demarcacion = models.CharField(max_length=50)
    pierna = models.CharField(max_length=10)
    elo = models.IntegerField()
    competicion = models.ForeignKey(Competicion, on_delete=models.CASCADE, related_name='jugadores')
    valor_mercado = models.CharField(max_length=50)
    goles = models.IntegerField()
    asistencias = models.IntegerField()
    minutos_jugados = models.IntegerField()
    posicion_principal = models.CharField(max_length=50)
    posicion_princ_percent = models.FloatField()
    posicion_alternativa = models.CharField(max_length=50, blank=True, null=True)
    posicion_altern_percent = models.FloatField(blank=True, null=True)
    url_imagen = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre