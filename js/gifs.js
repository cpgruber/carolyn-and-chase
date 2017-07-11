(function(){
  angular
  .module("wedding")
  .service("dbs", Gifs)

  Gifs.$inject = [];

  function Gifs(){
    return {
      sync: sync,
      post: post,
      rdb: new PouchDB("https://cpg.cloudant.com/wedding-gifs"),
      ldb: new PouchDB("gifs")
    }

    function sync(){

    }

    function post(){

    }

  }

}())
