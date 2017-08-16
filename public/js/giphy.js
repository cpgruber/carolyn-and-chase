(function(){
  angular
  .module("wedding")
  .service("giphy", giphy)

  giphy.$inject = ["giphy_key", "$http", "$sce"];

  function giphy(giphy_key, $http, $sce){
    return {
      query: query
    }

    function query(param, page){
      var url = "https://api.giphy.com/v1/gifs/search?api_key="+giphy_key+"&q="+param+"&limit=25&offset="+page+"&rating=PG-13&lang=en";
      return $http.get(url).then(function(res){
        return res.data.data.map(function(d){
          return {
            big: $sce.trustAsResourceUrl(d.images.original.url),
            small: $sce.trustAsResourceUrl(d.images.fixed_height_downsampled.url)
          };
        });
      });
    }

  }

}())
