from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),  # Añade URLs de autenticación predeterminadas
    path('api/', include('futsimapp.urls')),  # Incluye las URLs de tu aplicación
]
