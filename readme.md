Qué has hecho, Alcalde
======================

`publish.rb` arma los HTMLs a partir de la carpeta `source` (en donde `index`, `zapopan` y `guadalajara` son combinados con `header`, `template` y `footer`). Uso un estilo de `frontmatter` y `{{}}` improvisado en los templates. Publish has a major toggle: `$localOnline` que activa/desactiva cosas como el Google Analytics.

`code.js` tambien construye mucho de `zapopan` y `guadalajara` porque sus datos viven en hojas en Google ([esta es la de Zapopan](https://docs.google.com/spreadsheets/d/1xFOEq-kHbPpTp69XOPPOS3xM6h-2hBPNGJLpc49gWLg/edit#gid=616224439) y [esta es la de Guadalajara](https://docs.google.com/spreadsheets/d/1KgtTvqqNeCZn4mCQEIRFYI3Wr4P2dvQvpub3toLFtoE/edit#gid=591683283)). La forma medio hackish en que `code.js` habla con Google Sheets es a traves de un JSON que Google hace publico sin necesidad de ningun handshake ni autenticacion.
