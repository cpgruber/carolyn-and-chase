(function(){
  angular
  .module("wedding", [
    "pouchdb"
  ])
  .run(Run)
  .directive("scrollTo", scrollTo)

  Run.$inject = ["dbs"];
  function Run(dbs){
    dbs.sync();
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
