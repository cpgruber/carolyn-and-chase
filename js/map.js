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
      templateUrl: "../templates/_map.html"
    }
    return directive;

    function link(scope, el) {
      scope.active = [];
      scope.data;
      scope.locations;
      scope.toggleFilter = toggleFilter;
      scope.types = [];
      scope.labels = {attraction: 'Sights & Such', food: 'Food & Drink', logistics: 'Logistics'};
      scope.zoomTo = zoom;

      L.mapbox.accessToken = 'pk.eyJ1IjoiY2hhc2VncnViZXIiLCJhIjoidV9tdHNYSSJ9.RRyvDLny4YwDwzPCeOJZrA';
      var map = L.mapbox.map(el[0].querySelector("#map"), 'mapbox.streets', {
        zoomControl: false
      }).setView([40, -74.50], 9);

      L.control.zoom({
        position:'bottomleft'
      }).addTo(map);

      var layer = L.mapbox.featureLayer().addTo(map);

      $.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vR_PQj9VBrTq0kUd2moQtLgO4JLNy6qJMEIKttHkBwl_oihjNhWKaT1c13fHPv6ZF9ASkGdQcUs5I14/pub?output=csv").then(function (res) {
        var data = Papa.parse(res, {header: true});
        scope.data = data.data;
        scope.types = data.data.map(function (d) { return d.type.split(",") })
          .reduce(function (p,n) {
            n.forEach(function (d) {
              if (p.indexOf(d) === -1) {
                p.push(d);
              }
            });
            return p;
          }, []);

        scope.active = angular.copy(scope.types.filter(function (d) {return d !== "logistics"}));
        filterAndZoom();
      });

      function addPoint(d) {
        var marker = L.marker([d.lat, d.lon], {
          icon: L.divIcon({
            className: "custom-icon",
            html: "<div class='"+d.type+"'><i class='fa fa-fw fa-lg fa-"+d['icon-name']+"'></i></div>",
            popupAnchor: [0,-10]
          })
        }).bindPopup(formatPopup(d));
        marker.addTo(layer);
      }

      function formatPopup(d) {
        var html = "<h3>"+d.name+"</h3>";
        html += "<p>"+d.notes+"</p>";
        return html;
      }

      function zoom() {
        map.setView([this.location.lat, this.location.lon], 14);
        var pt = Object.keys(layer._layers).map(function (d) { return layer._layers[d] })
          .find(function (d) {
            return d._latlng.lat+'' === this.location.lat && d._latlng.lng+'' === this.location.lon
          }.bind(this));
        pt.openPopup();
      }

      function toggleFilter(type) {
        var idx = scope.active.indexOf(type);
        if (idx === -1) {
          scope.active.push(type);
        } else if (scope.active.length > 1) {
          scope.active.splice(idx, 1);
        }

        return filterAndZoom();
      }

      function filterAndZoom() {
        layer.clearLayers();
        scope.locations = scope.data.filter(function (d) {
          return scope.active.indexOf(d.type) > -1;
        }).sort(function (a,b) {
          if(a.name < b.name) return -1;
          if(a.name > b.name) return 1;
          return 0;
        });
        scope.locations.forEach(function (d) {
          addPoint(d);
        });
        map.fitBounds(layer.getBounds());
      }

    }
  }
}());
