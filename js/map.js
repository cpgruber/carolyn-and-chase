"use strict";

(function () {
  angular
  .module("wedding")
  .directive("weddingMap", map)

  map.$inject = [];

  function map() {
    var directive = {
      link: link,
      restrict: "A",
      replace: true,
      template: "<div id='map'></div>"
    }
    return directive;

    function link(scope, el) {
      L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhc2VncnViZXIiLCJhIjoidV9tdHNYSSJ9.RRyvDLny4YwDwzPCeOJZrA';
      var map = L.mapbox.map(el[0], 'mapbox.streets')
        .setView([40, -74.50], 9);

      var layer = L.mapbox.featureLayer().addTo(map);

      $.getJSON('../assets/map-data.json').then(function (data) {
        data.points.forEach(function (d) {
          addPoint(d);
        });
        map.fitBounds(layer.getBounds());
      });

      function addPoint(d) {
        var marker = L.marker(d.coords);
        
        marker.addTo(layer);
      }

    }
  }
}());
