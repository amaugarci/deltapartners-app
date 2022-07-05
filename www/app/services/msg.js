app.factory('msgService', ['$ionicPopup', function($ionicPopup){

  this.showMessage = function(message, title) {
    if(!title) {
      title = 'Alerta';
    }
    return $ionicPopup.alert({
      title: title,
      template: message
    });
  };

  return this;
}]);
