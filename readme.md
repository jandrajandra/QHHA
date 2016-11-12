Qué has hecho, Alcalde
======================

QHHA es una herramienta de rendición de cuentas de los municipios de Guadalajara, Jalisco, Mexico. Fue programada a partir de casi cero en un sprint intenso del 6 al 14 de Agosto del 2016 del equipo de [Jalisco Como Vamos](http://www.jaliscocomovamos.org/).

`source/publish.rb` arma los HTMLs a partir de la carpeta `source` (en donde `index`, `zapopan` y `guadalajara` son combinados con `header`, `template` y `footer`). Uso un estilo de `frontmatter` y `{{}}` improvisado en los templates. Publish has a major toggle: `$localOnline` que activa/desactiva cosas como el Google Analytics.

`code.js` tambien construye mucho de `zapopan` y `guadalajara` porque sus datos viven en hojas en Google ([esta es la de Zapopan](https://docs.google.com/spreadsheets/d/1xFOEq-kHbPpTp69XOPPOS3xM6h-2hBPNGJLpc49gWLg/edit#gid=616224439) y [esta es la de Guadalajara](https://docs.google.com/spreadsheets/d/1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE/edit#gid=591683283)). La forma medio hackish en que `code.js` habla con Google Sheets es a traves de un JSON que Google hace publico sin necesidad de ningun handshake ni autenticacion.

The [Roboto font](https://fonts.google.com/specimen/Roboto) in 2 weights (100 & 700) is used throughout. The only javascript libraries are jQuery & [ScrollReveal](https://github.com/jlmakes/scrollreveal.js).

Licencia
========

Este codigo se comparte bajo una licencia [CC 4.0 Reconocimiento-NoComercial-SinObraDerivada](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.es_ES) con la esperanza de que sea util a la comunidad. Estamos muy abiertos a adaptaciones (obra derivada) de este sitio, tan solo platiquemoslo antes en [contacto@jaliscocomovamos.org](mailto:contacto@jaliscocomovamos.org).

Contribuir
==========
Gracias por interesarte en este proyecto. Son muy bienvenidas todas las contribuciones en codigo como pull requests. La mejor forma de comunicarte con nosotros es en [contacto@jaliscocomovamos.org](mailto:contacto@jaliscocomovamos.org) o abriendo un issue aqui en Github. Lo ideal seria que tuvieras tu version de la pagina montada en Github Pages para poder comparar tus cambios y verlos en vivo.

Las necesidades mas puntuales son:
* Integracion con redes sociales (Facebook y Twitter).
* Habilidad de filtracion de indicadores estilo [Trudeaumetre](https://www.trudeaumetre.ca/).
* Mejoras a la responsividad y la interaccion siempre son bienvenids, el diseño de interaccion es complicado.
