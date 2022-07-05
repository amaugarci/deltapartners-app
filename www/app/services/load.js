app.factory('loadService', ['$rootScope', '$ionicLoading', function($rootScope, $ionicLoading){

  var isOpen = false;

  function showLoadDialog() {
    if(!isOpen) {
      isOpen = true;
      $ionicLoading.show({
      template: '<p></p><ion-spinner></ion-spinner>'
    });
    }
  }

  function hideLoadDialog() {
    if(isOpen) {
      isOpen = false;
      try {
        $ionicLoading.hide();
        
      } catch(err) {
        //$cordovaProgress.hide()
      }
    }
  }

  $rootScope.$on('authorization.error', function() {
    hideLoadDialog();
  });

  return {
    show : showLoadDialog,
    hide : hideLoadDialog,
    isOpen:function() {
      return isOpen;
    }
  };
}]);
