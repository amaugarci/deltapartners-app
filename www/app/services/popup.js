
'use strict';

(function(app) {
  app.service('popupService', ['$rootScope', '$ionicPopup', _fnPopup]);

  function _fnPopup($rootScope, $ionicPopup) {
    var self = this;
    var alertPopup;

    self.showPopUp = function(title, message) {
      alertPopup = $ionicPopup.alert({
       title: title,
       template: message
     });

    };
  }
})(app);
