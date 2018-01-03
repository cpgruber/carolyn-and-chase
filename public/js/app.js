(function(){
  angular
  .module("wedding", [
    "ui.router",
    "pouchdb",
    "constants"
  ])
  .config(Router)
  .run(Run)
  .directive("scrollTo", scrollTo)
  .directive("scrollWatch", scrollWatch)
  .service("$device", device)

  Router.$inject = ["$stateProvider", "$locationProvider"];
  function Router($stateProvider, $locationProvider){
    $stateProvider
    .state("main", {
      url: "/",
      controller: "ctrl",
      controllerAs: "vm",
      templateUrl: "templates/main.html",
      resolve: {
        loading: loading
      }
    });

    $locationProvider.html5Mode(true);
  }

  Run.$inject = ["dbs", "$timeout", "$location", "$window", "ga_key"];
  function Run(dbs, $timeout, $location, $window, ga_key){
    var path = $location.path().replace("/","");
    $location.path("/");
    $location.hash(path);
    // initialise google analytics
    $window.ga('create', ga_key, 'auto');
  }

  loading.$inject = ["preloader", "dbs", "$location", "$rootScope"];
  function loading(preloader, dbs, $location, $rootScope){
    var images = ["../assets/bg-min.png"];
    return preloader.preloadImages(images).then(function(res){
      return dbs.sync();
    }).catch(function(err){
      console.log(err);
    });
  }

  scrollTo.$inject = ["$location", "$window"];
  function scrollTo($location, $window){
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
        angular.element("html,body").animate({scrollTop: val}, "slow");
        // track pageview on state change
        $window.ga('send', 'pageview', $location.path());
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
        angular.element(document.querySelector(".navbar")).addClass("colorful").removeClass("white");
      }

      function handler(){
        if (windowEl.scrollTop() > windowEl.height()-50 && !scope.changed){
          scope.changed = true;
          angular.element(document.querySelector(".navbar")).addClass("colorful").removeClass("white");
        }else if (windowEl.scrollTop() <= windowEl.height()-50 && scope.changed){
          scope.changed = false;
          angular.element(document.querySelector(".navbar")).removeClass("colorful").addClass("white");
        }
      }

      windowEl.on('scroll', scope.$apply.bind(scope, handler));
    }
  }

  function device(){
    return {
      isMobile: isMobile
    };

    function isMobile() {
      if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
      ){
        return true;
      }
      else {
        return false;
      }
    }

  }

}())
