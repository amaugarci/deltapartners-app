
angular.module('starter').controller('leadDetailsCtrl', ['$scope', 'customSliderService', '$state', '$stateParams', function ($scope, customSliderService, $state, $stateParams) {
    $scope.editLead = function() {
        $state.go('tab.edit-lead',{id:$stateParams.id});
    }
}]);
