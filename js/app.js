(function(){
  angular
  .module("wedding", [
    "ui.router",
    "pouchdb"
  ])
  .config(Router)
  .run(Run)
  .directive("scrollTo", scrollTo)
  .directive("scrollWatch", scrollWatch)

  Router.$inject = ["$stateProvider", "$locationProvider"];
  function Router($stateProvider, $locationProvider){
    $stateProvider
    .state("main", {
      url: "/",
      controller: "ctrl",
      controllerAs: "vm",
      templateUrl: "templates/main.html"
    });

    $locationProvider.html5Mode(true);
  }

  Run.$inject = ["dbs", "$timeout", "$location", "$rootScope"];
  function Run(dbs, $timeout, $location, $rootScope){
    var path = $location.path().replace("/","");
    $location.path("/");
    $location.hash(path);

    $timeout(function(){
      angular.element("#loader").css("display", "none");
      dbs.sync();
      $rootScope.$broadcast("scroll-to", path);
    }, 2000);
  }

  function scrollTo(){
    var directive = {
      link: link,
      restrict: "A"
    };
    return directive;

    function link(scope, el, attrs){

      el.on("click", function(){
        try {
          var target = angular.element(document.querySelector(attrs.href));
          var val = target.offset().top;
        }catch(err){
          var val = 0;
        }
        angular.element(document.body).animate({scrollTop: val}, "slow");
      });
    }

  }

  scrollWatch.$inject = ["$window"];
  function scrollWatch($window){
    var directive = {
      link: link,
      scope: {
        scroll: "=scrollWatch"
      }
    };
    return directive;

    function link(scope, el, attrs){
      var windowEl = angular.element($window);
      scope.changed = windowEl.scrollTop() > windowEl.height()-50;

      scope.$on("scroll-to", function(evt, location){
        angular.element(document.querySelector("a[href='#"+location+"']")).click();
      });

      if (scope.changed){
        angular.element(document.querySelector(".navbar-brand")).addClass("colorful").removeClass("white");
      }

      function handler(){
        if (windowEl.scrollTop() > windowEl.height()-50 && !scope.changed){
          scope.changed = true;
          angular.element(document.querySelector(".navbar-brand")).addClass("colorful").removeClass("white");
        }else if (windowEl.scrollTop() <= windowEl.height()-50 && scope.changed){
          scope.changed = false;
          angular.element(document.querySelector(".navbar-brand")).removeClass("colorful").addClass("white");
        }
      }

      windowEl.on('scroll', scope.$apply.bind(scope, handler));
    }
  }

}())
