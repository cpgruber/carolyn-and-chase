(function(){
  angular
  .module("wedding", [
    "pouchdb"
  ])
  .run(Run)

  Run.$inject = ["dbs"];
  function Run(dbs){
    dbs.sync();
  }

}())
