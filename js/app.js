(function(){
  angular
  .module("wedding", [
    "pouchdb"
  ])
  .run(Run)

  Run.$inject = ["$rootScope", "$timeout", "$sce", "dbs"];
  function Run($rootScope, $timeout, $sce, dbs){

    dbs.rdb.replicate.to(gifs.ldb).then(function(res){
      return gifs.ldb.query("client/gifs").then(function(res){
        return res.rows.map(function(d){ return $sce.trustAsResourceUrl(d.value) });
      });
    }).then(function(gifs){
      return runThru(gifs);
    });

    function runThru(gifs){
      var tv = angular.element(document.querySelector(".tv"));
      gifs.forEach(function(gif, i){
        changeChannel(gif, i+1);
      });
      $timeout(function(){
        return runThru(gifs);
      }, gifs.length * 3000)

      function changeChannel(gif, i){
        return $timeout(function(){
          tv.css("background-image", `url("${gif}")`);
        }, 3000*i);
      }
    }

  }

}())

// https://media.giphy.com/media/hyChEetW9lUC4/giphy.gif -- 1 kneel
// https://media.giphy.com/media/vLq5FWMjfN47S/giphy.gif -- 2
// https://media.giphy.com/media/iZESiPSmgykXS/giphy.gif -- 3 kiss
// https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif -- 4
// https://media.giphy.com/media/SUwJMZZ4v2iLS/giphy.gif -- 5 grammy
// https://media.giphy.com/media/b5LTssxCLpvVe/giphy.gif -- 6
