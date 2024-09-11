# PFC
Descripción del Proyecto

Esta aplicación web permite a los usuarios simular partidos de fútbol entre diferentes equipos y gestionar cambios de jugadores. La simulación se basa en diferentes estadísticas detalladas de los jugadores, como su ELO(valoracion numérica de 0 a 100) y goles por 90 minutos, para proporcionar resultados realistas. Los usuarios pueden seleccionar equipos, cambiar jugadores y ver los resultados de los partidos simulados.

Estado del proyecto

Estado del proyecto: Finalizado

Versión del proyecto: 1.0

Licencia del proyecto: Licencia MIT

Características de la Aplicación

Simulación de Partidos: Simula el resultado de un partido entre dos equipos basándose en las estadísticas de los jugadores.

Consulta de Plantillas: Permite a los usuarios ver las platillas de los equipos disponibles.

Gestión de Jugadores: Permite cambiar jugadores entre los equipos seleccionados.

Interfaz Intuitiva: Interfaz de usuario fácil de usar para seleccionar equipos, cambiar jugadores y ver los resultados de la simulación.

API REST: Backend construido con Django que proporciona endpoints para gestionar equipos y jugadores.

Autenticación de usuarios: Permite a los usuarios registrarse, iniciar sesión y gestionar sus perfiles individuales.

Acceso al Proyecto

Requisitos Previos
Python
Node.js
Git

Pasos para Ejecutar el Proyecto

1.-Clona el repositorio
  git clone (https://github.com/pablolopezx/PFC.git)
  cd PFC
  
2.-Configura el Backend:

Navega a la carpeta del backend: cd backend

Crea y activa un entorno virtual: python -m venv env
                                  source `env\Scripts\activate` (Windows)
                                  
Instala las dependencias de Python: pip install -r requirements.txt

Realiza las migraciones de la base de datos: python manage.py migrate

Inicia el servidor de desarrollo de Django: python manage.py runserver

3.-Configura el Frontend

Navega a la carpeta del frontend: cd frontend

Instala las dependencias: npm install

Inicia la aplicación de React:npm start

4.-Accede a la Aplicación

Abre tu navegador web y ve a http://localhost:3000 para acceder a la interfaz de usuario.


Tecnologías Utilizadas
Frontend:
React
HTML5, CSS3, JavaScript, Bootstrap
Backend:
Django
Django REST Framework
Base de Datos:
SQLite
Herramientas de Desarrollo:
Node.js
NPM
Git

Persona contribuyente

Pablo López Martínez

Desarrollador del proyecto

Pablo López Martínez

Licencia

Este proyecto se encuentra bajo la Licencia MIT.

Conclusión

Este proyecto proporciona una plataforma interactiva para simular partidos de fútbol y gestionar equipos y jugadores. Utiliza un stack tecnológico moderno con React en el frontend y Django en el backend, ofreciendo una experiencia de usuario fluida y una lógica robusta del lado del servidor. El diseño modular y el uso de APIs REST permiten una fácil escalabilidad y mantenimiento. 
