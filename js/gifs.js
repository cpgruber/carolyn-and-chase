(function(){
  angular
  .module("wedding")
  .service("dbs", Gifs)

  Gifs.$inject = ["$sce", "$timeout"];

  function Gifs($sce, $timeout){
    var gifs = {
      sync: sync,
      post: post,
      rdb: new PouchDB("https://cpg.cloudant.com/wedding-gifs"),
      ldb: new PouchDB("gifs"),
      gifs: [],
      run: run,
      timeouts: []
    };
    return gifs;

    function sync(){
      return gifs.rdb.replicate.to(gifs.ldb).then(function(res){
        return gifs.ldb.query("client/gifs").then(function(res){
          return res.rows.map(function(d){ return $sce.trustAsResourceUrl(d.value) });
        });
      });
    }

    function post(doc){
      return gifs.rdb.put(doc).then(function(res){
        return res;
      }).catch(function(err){
        console.log("err", err);
        return err;
      })
    }

    function run(){
      gifs.timeouts.forEach(function(tO){
        $timeout.cancel(tO);
      });
      var tv = angular.element(document.querySelector(".tv-main"));
      gifs.gifs.forEach(function(gif, i){
        changeChannel(gif, i);
      });
      var timeout = $timeout(function(){
        return gifs.run();
      }, gifs.gifs.length * 4000);
      gifs.timeouts.push(timeout);

      function changeChannel(gif, i){
        var timeout = $timeout(function(){
          tv.css("background-image", `url("${gif}")`);
        }, 4000*i);
        gifs.timeouts.push(timeout);
      }
    }

  }

}())
