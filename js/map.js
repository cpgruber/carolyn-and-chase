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

      $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vR_PQj9VBrTq0kUd2moQtLgO4JLNy6qJMEIKttHkBwl_oihjNhWKaT1c13fHPv6ZF9ASkGdQcUs5I14/pub?output=csv").then(function (res) {
        var data = Papa.parse(res, {header: true});
        data.data.forEach(function (d) {
          addPoint(d);
        });
        map.fitBounds(layer.getBounds());
      });

      function addPoint(d) {
        var marker = L.marker([d.lat, d.lon], {
          icon: L.mapbox.marker.icon({
            'marker-size': 'large',
            'marker-symbol': d['icon-name'],
            'marker-color': d['icon-color']
          })
        }).bindPopup(formatPopup(d));
        marker.addTo(layer);
      }

      function formatPopup(d) {
        var html = "<h3>"+d.name+"</h3>";
        html += "<p>"+d.notes+"</p>";
        return html;
      }

    }
  }
}());
