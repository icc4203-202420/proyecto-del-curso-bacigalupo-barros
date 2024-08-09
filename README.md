# Proyecto de Aplicaciones Móviles

El proyecto del curso en este semestre consistirá en desarrollar una aplicación móvil para personas aficionadas a las cervezas, que frecuentan bares y eventos que se realizan en ellos.

El nombre de la aplicación lo definirá cada grupo, atendiendo la moral y las buenas costumbres, por supuesto.

## Modelo de Dominio

Según el problema antes descrito, el modelo de dominio de la aplicación 

## Arquitectura del Proyecto Base

El proyecto base está conformado por una aplicación de backend, desarrollada en Rails 7.1 en modo API. La aplicación de backend contiene prácticamente todos los modelos necesarios, con validaciones relevantes y asociaciones. Las tablas tienen índices.

La aplicación además tiene tests escritos con RSpec para la mayor parte de los modelos, y algunos controladores.

No todas las rutas están especificadas en la aplicación, ni todos los controladores creados. Completar esto será trabajo de los grupos de proyecto.

La aplicación de frontend, creada con Vite, está en un nivel muy básico y será su trabajo completarla en el proyecto del curso.

En el despliegue de desarrollo, la aplicación Rails (API) está configurada para operar en el puerto 3001, y la aplicación de frontend en el 3000.

El esquema arquitectónico a ojos del desarrollador que trabaja en su máquina local es el siguiente:

![Vista de arquitectura para despliegue local de desarrollo](docs/images/arquitectura-desarrollador.png)

## Posibilidad de realizar pruebas de carga y stress contra el Backend

Es posible utilizar la herramienta JMeter para realizar pruebas de rendimiento al backend.

## Iniciar la Aplicación

**Desde el sistema host**

**Con Docker**

## Herramientas requeridas

Para desarrollar este proyecto, se requiere un entorno de programación que cuente con:

* Ruby Version Manager (RVM), capaz de ejecutar lenguaje Ruby 3.3.4, disponible en https://rvm.io
* Node 18 o 20, instalable en [Mac con homebrew](https://formulae.brew.sh/formula/node@20), o en Linux ([Ubuntu](https://medium.com/@nsidana123/before-the-birth-of-of-node-js-15ee9262110c)), como sistema operativo host, en una máquina virtual, con Windows Subsystem for Linux (WSL), o con Docker.
* VSCode idealmente para editar el código
* Docker no es estrictamente requerido, pero puede facilitar la instalación, dado que el proyecto incluye archivo `docker-compose` y archivos `Dockerfile`.

Pueden usar la máquina virtual basada en Debian 12 que se encuentra disponible para descarga en el sitio del curso en Canvas, o bien, ustedes mismos instalar el software nombrado arriba.

