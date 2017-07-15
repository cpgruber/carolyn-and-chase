(function(){
  angular
  .module("wedding", [
    "ui.router",
    "pouchdb"
  ])
  .config(Router)
  .run(Run)
  .directive("scrollTo", scrollTo)

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

  Run.$inject = ["dbs", "$timeout"];
  function Run(dbs, $timeout){
    $timeout(function(){
      angular.element("#loader").css("display", "none");
      dbs.sync();
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

}())
