# Generated by Django 5.0.6 on 2024-05-29 14:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Competicion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(unique=True)),
                ('nombre', models.CharField(max_length=255)),
                ('ranking_pais', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Equipo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('ano_fundacion', models.IntegerField()),
                ('posicion', models.IntegerField()),
                ('competicion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='equipos', to='futsimapp.competicion')),
            ],
        ),
        migrations.CreateModel(
            name='Jugador',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(unique=True)),
                ('temporada', models.CharField(max_length=50)),
                ('edad', models.IntegerField()),
                ('nombre', models.CharField(max_length=255)),
                ('demarcacion', models.CharField(max_length=50)),
                ('pierna', models.CharField(max_length=10)),
                ('elo', models.IntegerField()),
                ('valor_mercado', models.CharField(max_length=50)),
                ('goles', models.IntegerField()),
                ('asistencias', models.IntegerField()),
                ('minutos_jugados', models.IntegerField()),
                ('posicion_principal', models.CharField(max_length=50)),
                ('posicion_princ_percent', models.FloatField()),
                ('posicion_alternativa', models.CharField(blank=True, max_length=50, null=True)),
                ('posicion_altern_percent', models.FloatField(blank=True, null=True)),
                ('url_imagen', models.URLField(blank=True, null=True)),
                ('competicion', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jugadores', to='futsimapp.competicion')),
                ('equipo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='jugadores', to='futsimapp.equipo')),
            ],
        ),
    ]
