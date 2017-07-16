(function(){
  angular
  .module("wedding")
  .controller("ctrl", ctrl)

  ctrl.$inject = ["dbs", "giphy"];
  function ctrl(dbs, giphy){

    var vm = this;
    vm.scroll = 0;
    vm.gifForm = {};
    vm.openModal = openModal;
    vm.submitGif = submitGif;
    vm.queryGif = queryGif;
    vm.scan = scan;
    vm.gifPreviews = [];

    function openModal(){
      angular.element("#gifModal").modal("show");
    }

    function queryGif(param, page, index){
      if (param.length < 3){
        vm.gifPreviews = [];
        return false;
      };
      return giphy.query(param, page*25).then(function(urls){
        vm.gifPreviews = urls;
        vm.gifForm.index = index;
        vm.gifForm.page = page;
        setGifFormBg();
      });
    }

    function scan(increment){
      var idx = vm.gifForm.index + increment;
      if (idx < vm.gifPreviews.length && idx >= 0){
        vm.gifForm.index = idx;
        setGifFormBg();
      }else if (idx >= vm.gifPreviews.length){
        var page = vm.gifForm.page + 1;
        return queryGif(vm.gifForm.search, page, 0);
      }else if (idx <= -1){
        var page = vm.gifForm.page - 1 < 0 ? 0 : vm.gifForm.page - 1;
        return vm.gifForm.page - 1 < 0 ? false : queryGif(vm.gifForm.search, page, 24);
      }
    }

    function setGifFormBg(){
      vm.gifForm.style = {"background-image": "url("+vm.gifPreviews[vm.gifForm.index]+")"};
    }

    function submitGif(){
      var d = new Date();
      var posting = {
        _id: d.getTime() + "",
        message: vm.gifForm.message,
        url: vm.gifPreviews[vm.gifForm.index].$$unwrapTrustedValue(),
        search: vm.gifForm.search,
        index: (vm.gifForm.page*25) + vm.gifForm.index
      };
      dbs.post(posting).then(function(res){
        return dbs.sync();
      }).then(function(gifs){
        angular.element("#gifModal").modal("hide");
        dbs.gifs = gifs;
        vm.gifForm = {};
        vm.gifPreviews = [];
        return dbs.sync();
      }).catch(function(err){
        console.log("err", err);
      });
    }
  }

}())
