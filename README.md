# Proyecto de Aplicaciones Móviles

El proyecto del curso en este semestre consistirá en desarrollar una aplicación móvil para personas aficionadas a las cervezas, que frecuentan bares y eventos que se realizan en ellos.

El nombre de la aplicación lo definirá cada grupo, atendiendo la moral y las buenas costumbres, por supuesto.

## Modelo de Dominio

Según el problema antes descrito, el modelo de dominio de la aplicación tiene varias entidades y relaciones relevantes:

1. **Usuario** (`User`): Un usuario registrado en la aplicación
2. **Amistad** (`Friendship`): Una relación de amistad entre un `User` y otro.
3. **Dirección** (`Address`): Una dirección de un `User` que puede ir asociada a un `Bar`.
4. **Bar** (`Bar`): Un lugar en donde se sirven `Beer`s y se realizan `Event`s.
5. **Cerveza** (`Beer`): Una cerveza, producida por una `Brewery` y de una cierta `Brand`.
6. **Reseña** (`Review`): Una reseña escrita por un `User` sobre una `Beer`.
7. **Evento** (`Event`): Un evento que ocurre en un `Bar` y al cual asisten `User`s.
8. **Asistencia** (`Attendance`): La asistencia de un `User` en un `Event`.
9. **Imagen del Evento** (`EventPicture`): Una fotografía tomada por un `User` en un `Event`.
10. **Bar-Cerveza** (`BarsBeer`): Entidad intermedia para relación N-N entre `Bar` y `Beer`.
11. **Cervecería** (`Brewery`): Una cervecería que opera en un `Country`.
12. **Marca** (`Brand`): Una marca de `Beer` producida por una `Brewery`.
13. **País** (`Country`): Un país.

Relaciones:

1. **Un Usuario tiene cero o muchas Amistades** (`User` -- `Friendship`)
   - Un Usuario puede ser amigo de muchos otros Usuarios.
   
2. **Un Usuario es dueño de una Dirección** (`User` -- `Address`)
   - Un Usuario puede tener una Dirección.
   
3. **Un Bar tiene una Dirección** (`Bar` -- `Address`)
   - Un Bar puede estar ubicado en una Dirección.
   
4. **Una Cerveza tiene muchas Reseñas** (`Beer` -- `Review`)
   - Una Cerveza puede tener muchas Reseñas.
   
5. **Una Reseña es creada por un Usuario** (`Review` -- `User`)
   - Una Reseña es escrita por un Usuario.
   
6. **Un Evento ocurre en un Bar** (`Event` -- `Bar`)
   - Un Evento tiene lugar en un Bar.
   
7. **Un Usuario tiene Asistencia en un Evento** (`User` -- `Attendance` -- `Event`)
   - Un Usuario puede asistir a muchos Eventos y cada Asistencia está asociada con un Evento específico.
   
8. **Un Usuario genera muchas Imágenes del Evento** (`User` -- `EventPicture`)
   - Un Usuario puede crear muchas Imágenes de Eventos.
   
9. **Una Imagen del Evento pertenece a un Evento** (`EventPicture` -- `Event`)
   - Una Imagen del Evento está asociada con un Evento específico.
   
10. **Un Bar sirve muchas Cervezas y una Cerveza puede ser servida en muchos Bares** (`Bar` -- `BarsBeer` -- `Beer`)
    - Relación N-N entre Bar y Cerveza a través de la entidad intermedia `BarsBeer`.
   
11. **Una Cerveza es producida por una Cervecería** (`Beer` -- `Brewery`)
    - Una Cerveza es elaborada por una Cervecería.
   
12. **Una Cerveza tiene una Marca** (`Beer` -- `Brand`)
    - Cada Cerveza está asociada con una Marca específica.
   
13. **Una Cervecería produce muchas Marcas** (`Brewery` -- `Brand`)
    - Una Cervecería puede producir muchas Marcas.
   
14. **Una Cervecería pertenece a un País** (`Brewery` -- `Country`)
    - Una Cervecería está ubicada en un País.
   
15. **Una Dirección pertenece a un País** (`Address` -- `Country`)
    - Una Dirección está localizada en un País.

![Vista del modelo de dominio de la aplicación](docs/images/entity-model.png)

## Arquitectura del Proyecto Base

El proyecto base está conformado por una aplicación de backend, desarrollada en Rails 7.1 en modo API. La aplicación de backend contiene prácticamente todos los modelos necesarios, con validaciones relevantes y asociaciones. Las tablas tienen índices.

ActiveStorage viene pre-configurado en la aplicación de backend y algunos de los modelos como `Bar`, `Beer` e `Event` permiten adjuntar fotografías.

Devise y Devise-JWT también vienen pre-configurados y es posible usar la API del backend autenticando con tokens del tipio JavaScript Web Tokens (JWT).

La aplicación además tiene tests escritos con RSpec para la mayor parte de los modelos, y algunos controladores.

No todas las rutas están especificadas en la aplicación, ni todos los controladores están creados. Completar esto será trabajo de los grupos de proyecto.

La aplicación de frontend, creada con Vite, está en un nivel muy básico y será su trabajo completarla en el proyecto del curso.

En el despliegue de desarrollo, la aplicación Rails (API) está configurada para operar en el puerto 3001, y la aplicación de frontend en el 3000.

El esquema arquitectónico a ojos del desarrollador que trabaja en su máquina local es el siguiente:

![Vista de arquitectura para despliegue local de desarrollo](docs/images/arquitectura-desarrollador.png)

## Posibilidad de realizar pruebas de carga y stress contra el Backend

Es posible utilizar la herramienta JMeter para realizar pruebas de rendimiento al backend.

## Iniciar la Aplicación

**Desde el sistema host**

**Con Docker**

En el directorio raíz de la aplicación hay un archivo de configuración `docker-compose.yml` preonfigurado para hacer funcionar las aplicaciones de `frontend` y `backend` en ambiente de desarrollo. Es importante hacer algunas configuraciones previas en el aplicación Rails (ver el archivo `backend/README.md`) antes de iniciar por primera vez.

Con Docker Compose, se instalarán automáticamente todas las imágenes necesarias. Ejecutar el siguiente comando:

```sh
$ docker-compose up
```

Se pueden detener las aplicaciones con `Ctrl+C`. Así queda compose utilizando el terminal actual para mostrar la salida de los contenedores. También se puede desacoplar del terminal:

```sh
$ docker-compose up -d
```

En este modo desacoplado se pueden inspeccionar los logs con:

```sh
$ docker logs -f
```

Para detener las aplicaciones

```sh
$ docker-compose down
```

Si tienes aplicaciones docker compose concurrentes (p.ej., en otros cursos), es una buena idea usar proyectos para rotular las imágenes y que no haya choques entre proyectos distintos:

```sh
$ docker-compose up -p appsmoviles -d
```

En este último caso, para detener la aplicación se puede usar el mismo comando de arriba (down). Se puede pasar el nombre del proyecto por variable de entorno:

```sh
$ COMPOSE_PROJECT_NAME=appsmoviles docker-compose down
```

Finalmente, hay situaciones en las que quedan contenedores huérfanos, por ejemplo, cuando hay caídas de contenedores. La forma de detener y eliminar contenedores huérfanos es a través del comando:

```sh
$ docker-compose down --remove-orphans
```

## Herramientas requeridas

Para desarrollar este proyecto, se requiere un entorno de programación que cuente con:

* Ruby Version Manager (RVM), capaz de ejecutar lenguaje Ruby 3.3.4, disponible en https://rvm.io. En Mac es importante instalar OpenSSL versión 1 para que ruby compile con RVM. Los comandos son:
```sh
$ brew install openssl@1.1
$ rvm install 3.3.4 -C --with-openssl-dir=$(brew --prefix openssl@1.1)
```
La aplicación rails en el directorio `backend` cuenta con archivos `.ruby-version` y `.ruby-gemset` que permiten cambiar automáticamente a la versión y gemset correcta.
* Node 18 o 20, instalable en [Mac con homebrew](https://formulae.brew.sh/formula/node@20), o en Linux ([Ubuntu](https://medium.com/@nsidana123/before-the-birth-of-of-node-js-15ee9262110c)), como sistema operativo host, en una máquina virtual, con Windows Subsystem for Linux (WSL), o con Docker.
* VSCode idealmente para editar el código
* Docker no es estrictamente requerido, pero puede facilitar la instalación, dado que el proyecto incluye archivo `docker-compose` y archivos `Dockerfile`.

Pueden usar la máquina virtual basada en Debian 12 que se encuentra disponible para descarga en el sitio del curso en Canvas, o bien, ustedes mismos instalar el software nombrado arriba.

