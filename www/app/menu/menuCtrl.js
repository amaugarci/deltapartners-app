angular.module("starter").controller("menuCtrl", [
  "$scope",
  "$state",
  "$rootScope",
  "$ionicSideMenuDelegate",
  "auth",
  "$window",
  function (
    $scope,
    $state,
    $rootScope,
    $ionicSideMenuDelegate,
    auth,
    $window
  ) {

    $scope.showMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.setMode = function (mode) {
      $rootScope.modeCF = mode;
      $state.reload();
    };
    $scope.logout = function () {
      //cerrar session here!
      auth.logout();
      $ionicSideMenuDelegate.toggleLeft();
      $state.go("login");
    };
  },
]);
