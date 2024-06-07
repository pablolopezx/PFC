from django.urls import path
from . import views

urlpatterns = [
    path('competiciones/', views.lista_competiciones, name='lista_competiciones'),
    path('equipos/', views.lista_equipos, name='lista_equipos'),  # Nueva URL para obtener todos los equipos
    path('equipos/competicion/<int:competicion_id>/', views.equipos_por_competicion, name='equipos_por_competicion'),
    path('jugadores/equipo/<int:equipo_id>/', views.jugadores_por_equipo, name='jugadores_por_equipo'),
    path('titulares/<int:equipo_id>/', views.titulares, name='titulares'),
    path('signup/', views.signup, name='signup'),
]
