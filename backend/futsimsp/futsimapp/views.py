from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from futsimapp.models import Equipo, Jugador, Competicion

# Obtener todas las competiciones
def lista_competiciones(request):
    competiciones = Competicion.objects.all().values('id', 'nombre')
    return JsonResponse(list(competiciones), safe=False)

# Obtener jugadores según el equipo
def jugadores_por_equipo(request, equipo_id):
    equipo = get_object_or_404(Equipo, id=equipo_id)
    jugadores = Jugador.objects.filter(equipo=equipo).values('id', 'nombre', 'demarcacion', 'edad', 'elo', 'posicion_principal', 'url_imagen')
    return JsonResponse(list(jugadores), safe=False)

# Obtener equipos según la competición
def equipos_por_competicion(request, competicion_id):
    competicion = get_object_or_404(Competicion, id=competicion_id)
    equipos = Equipo.objects.filter(competicion=competicion).values('id', 'nombre', 'ano_fundacion', 'posicion')
    return JsonResponse(list(equipos), safe=False)

# Mapear los 11 mejores jugadores del equipo para el apartado de la simulacion, tomamos como titulares a los mejores jugadores por posición
def titulares(request, equipo_id):
    equipo = get_object_or_404(Equipo, id=equipo_id)
    
    # Obtén los jugadores por demarcación y ordenados por 'elo' (mejor a peor)
    porteros = list(Jugador.objects.filter(equipo=equipo, demarcacion__startswith='Portero').order_by('-elo')[:1])
    defensas_laterales = list(Jugador.objects.filter(equipo=equipo, demarcacion__startswith='Defensa').order_by('-elo')) + \
                        list(Jugador.objects.filter(equipo=equipo, demarcacion__startswith='Lateral').order_by('-elo'))
    mediocentros = list(Jugador.objects.filter(equipo=equipo, demarcacion__startswith='Medio').order_by('-elo')[:3])
    delanteros_extremos = list(Jugador.objects.filter(equipo=equipo, demarcacion__startswith='Delantero').order_by('-elo')) + \
                         list(Jugador.objects.filter(equipo=equipo, demarcacion__startswith='Extremo').order_by('-elo'))

    # Limitar a 4 defensas/laterales y 3 delanteros/extremos
    defensas_laterales = sorted(defensas_laterales, key=lambda x: x.elo, reverse=True)[:4]
    delanteros_extremos = sorted(delanteros_extremos, key=lambda x: x.elo, reverse=True)[:3]

    # Combine todos los jugadores seleccionados
    mejores_11 = porteros + defensas_laterales + mediocentros + delanteros_extremos

    # Serializa la lista de jugadores
    jugadores_data = [
        {
            'id': jugador.id,
            'nombre': jugador.nombre,
            'demarcacion': jugador.demarcacion,
            'edad': jugador.edad,
            'elo': jugador.elo,
            'goles':jugador.goles,
            'minutos':jugador.minutos_jugados,
            'posicion_principal': jugador.posicion_principal,
            'url_imagen': jugador.url_imagen  # Asegúrate de que este campo exista en tu modelo
        } for jugador in mejores_11
    ]

    return JsonResponse(jugadores_data, safe=False)

# Registro de usuario
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('home')  # Redirige a la página principal después del registro
    else:
        form = UserCreationForm()
    return render(request, 'registration/signup.html', {'form': form})

# Nueva vista para obtener todos los equipos sin depender de la competición
def lista_equipos(request):
    equipos = Equipo.objects.all().values('id', 'nombre', 'ano_fundacion', 'posicion')
    return JsonResponse(list(equipos), safe=False)
