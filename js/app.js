(function(){
  angular
  .module("wedding", [
    "pouchdb"
  ])
  .run(Run)

  Run.$inject = ["dbs"];
  function Run(dbs){

    dbs.sync().then(function(gifs){
      dbs.gifs = gifs;
      return dbs.run();
    });

  }

}())
