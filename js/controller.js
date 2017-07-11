(function(){
  angular
  .module("wedding")
  .controller("ctrl", ctrl)

  ctrl.$inject = ["dbs"];
  function ctrl(dbs){

    var vm = this;
    vm.gifForm = {};
    vm.openModal = openModal;
    vm.submitGif = submitGif;

    function openModal(){
      angular.element("#gifModal").modal("show");
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
