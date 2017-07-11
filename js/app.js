(function(){
  angular
  .module("wedding", [
    "pouchdb"
  ])
  .run(Run)

  Run.$inject = ["$rootScope", "$timeout", "dbs"];
  function Run($rootScope, $timeout, dbs){

    dbs.sync().then(function(gifs){
      dbs.gifs = gifs;
      return dbs.run();
    });

  }

}())

// https://media.giphy.com/media/hyChEetW9lUC4/giphy.gif -- 1 kneel
// https://media.giphy.com/media/vLq5FWMjfN47S/giphy.gif -- 2
// https://media.giphy.com/media/iZESiPSmgykXS/giphy.gif -- 3 kiss
// https://media.giphy.com/media/l0MYJnJQ4EiYLxvQ4/giphy.gif -- 4
// https://media.giphy.com/media/SUwJMZZ4v2iLS/giphy.gif -- 5 grammy
// https://media.giphy.com/media/b5LTssxCLpvVe/giphy.gif -- 6
