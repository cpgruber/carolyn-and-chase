(function(){
  angular
  .module("wedding")
  .controller("ctrl", ctrl)

  ctrl.$inject = ["dbs", "giphy", "$device", "$location", "$timeout"];
  function ctrl(dbs, giphy, $device, $location, $timeout){

    var vm = this;
    vm.scroll = 0;
    vm.gifForm = {};
    vm.openModal = openModal;
    vm.submitGif = submitGif;
    vm.queryGif = queryGif;
    vm.scan = scan;
    vm.gifPreviews = [];
    vm.mobile = $device.isMobile();

    init();

    function init(){
      var path = $location.hash();
      if (path){
        $timeout(function(){
          angular.element(document.querySelector("a[href='#"+path+"']")).click();
        }, 500);
      }

      var transitionEvts = "transitionend webkitTransitionEnd oTransitionEnd otransitionend";
      angular.element("#loader").css("opacity", 0).on(transitionEvts, function(evt){
        angular.element("#loader").css("display", "none");
      });

      dbs.run();
    }

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
      var device = vm.mobile ? "small" : "big";
      vm.gifForm.style = {"background-image": "url("+vm.gifPreviews[vm.gifForm.index][device]+")"};
    }

    function submitGif(){
      var d = new Date();
      var posting = {
        _id: d.getTime() + "",
        message: vm.gifForm.message,
        url: {
          small: vm.gifPreviews[vm.gifForm.index].small.$$unwrapTrustedValue(),
          big: vm.gifPreviews[vm.gifForm.index].big.$$unwrapTrustedValue()
        },
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
        return dbs.run();
      }).catch(function(err){
        console.log("err", err);
      });
    }
  }

}())
