angular.module('starter').controller('accountsMembersCtrl', ['$scope', 'apiAccountMembers', 'loadService', '$ionicScrollDelegate', 'auth', 'msgService', function ($scope, apiAccountMembers, loadService, $ionicScrollDelegate, auth, msgService) {

    $scope.data = {
        page: 1,
        limit: 5,
        noMoreData: false,
        accounts: [],
        orders: {
            'name': 'name',
            'email': 'email'
        },
        times: {
            'all time': 'all',
            '1 month': 1,
            '3 months': 3,
            '6 months': 6
        },
        orderBy: 'name',

    };

    $scope.setOrderBy = function (value) {
        $scope.data.orderBy = value;
        $scope.loadData(true);
        $ionicScrollDelegate.scrollTop(true);
        $ionicScrollDelegate.resize();

    }

    $scope.$on('$ionicView.beforeEnter', function () {
        $ionicScrollDelegate.scrollTop(true);
        $ionicScrollDelegate.resize();
        $scope.data.accounts = [];
        $scope.loading = false;
        $scope.data.noMoreData = true;
        $scope.loadData(true);
    });

    $scope.loadData = function (refresh) {
        if ($scope.loading) return;
        $scope.loading = true;
        loadService.show();
        if (refresh || $scope.data.accounts.length == 0) {
            $scope.data.accounts = [];
            $scope.data.page = 1;
        }

        loadService.hide();
        $scope.loading = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');

        apiAccountMembers.getAccountMembers($scope.data.limit, $scope.data.page, $scope.data.orderBy)
            .then(function (res) {
                for (var i = 0; res.data[String(i)]; ++i) {
                    $scope.data.accounts = $scope.data.accounts.concat(res.data[String(i)]);
                }


                loadService.hide();
                $scope.data.page += 1;
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (!res.data[String(0)]) $scope.data.noMoreData = true;
                else $scope.data.noMoreData = false;

            })
            .catch(function (err) {
            });
    };

    $scope.makeCall = function (number) {
        window.open('tel:' + number, '_system', 'location=yes');
    }

    $scope.sendMail = function (mail) {
        window.open('mailto:' + mail, '_system');
    }

    $scope.showAccount = function (id) {
        $state.go('tab.accounts-performance', {id: id});
    }
}]);
