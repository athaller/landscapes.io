(function (app) {
  'use strict';

  app.registerModule('landscapes',['ngFileUpload','monospaced.elastic','ngLodash','ui.bootstrap','checklist-model']);
  app.registerModule('landscapes.services');
  app.registerModule('landscapes.routes', ['ui.router', 'landscapes.services']);
})(ApplicationConfiguration);
