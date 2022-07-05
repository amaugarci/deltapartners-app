angular.module('starter').controller('logViewCtrl', ['$scope', 'customSliderService', '$state', '$stateParams', function ($scope, customSliderService, $state, $stateParams) {

    $scope.icon = $stateParams.icon;
    $scope.time = $stateParams.time;
    $scope.message = $stateParams.message;
    $scope.messageHtml = $stateParams.messageHtml;
    $scope.newValue = $stateParams.newValue;
}]);
