(function(){
  angular
  .module("wedding")
  .controller("ctrl", ctrl)

  ctrl.$inject = ["dbs", "giphy"];
  function ctrl(dbs, giphy){

    var vm = this;
    vm.gifForm = {};
    vm.openModal = openModal;
    vm.submitGif = submitGif;
    vm.queryGif = queryGif;
    vm.gifPreviews = [];

    function openModal(){
      angular.element("#gifModal").modal("show");
    }

    function queryGif(param){
      return giphy.query(param).then(function(urls){
        vm.gifPreviews = urls;
        angular.element(document.querySelector(".gif-container")).css("background-image", `url("${urls[0]}")`);
      });
    }

    function submitGif(){
      var d = new Date();
      vm.gifForm._id = d.getTime() + "";
      dbs.post(vm.gifForm).then(function(res){
        vm.gifForm = {};
        return dbs.sync();
      }).then(function(gifs){
        dbs.gifs = gifs;
        angular.element("#gifModal").modal("hide");
        return dbs.run();
      }).catch(function(err){
        console.log("err", err);
      });
    }
  }

}())
