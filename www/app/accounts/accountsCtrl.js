angular.module('starter').controller('accountsCtrl', [
    '$scope',
    '$state',
    'apiAccounts',
    'loadService', function ($scope, $state, apiAccounts, loadService) {

    $scope.data = {
        page: 1,
        limit: 5,
        noMoreData: false,
        accounts: []
    };

    $scope.$on('$ionicView.beforeEnter', function () {
        //loadService.show();
        $scope.loadData(true);
    });

    $scope.loadData = function (refresh) {
        if (refresh) {
            $scope.data.page = 1;
            $scope.data.noMoreData = false;
        }
        apiAccounts.getAccounts().then(function (res) {
            if (res && res.status === 200) {
                $scope.data.accounts = res.data;
                $scope.data.noMoreData = true;

                if (res.data.length == 0) $scope.data.noMoreData = true;
                else $scope.data.page += 1;

                loadService.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }
            else {
                throw new Error("Invalid response");
            }
        }).catch(function (err) {
        });
    }

    $scope.showAccount = function (id) {
        $state.go('tab.accounts-performance', {id: id});
    }

}]);
