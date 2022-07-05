angular.module('starter').controller('leadsCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'apiLeads',
    'loadService', function ($scope, $rootScope, $state, apiLeads, loadService) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.loading = false;

            if (!$scope.data) {
                $scope.initData();
            }

            $scope.loadData(true);
        });

        $scope.setOrderBy = function (value) {
            $scope.data.orderBy = value;
            $scope.loadData(true);
        }

        $scope.setTime = function (value) {
            $scope.data.showLast = value;
            $scope.loadData(true);
        }

        $scope.addLead = function () {
            $state.go('tab.create-lead');
        }

        $scope.initData = function () {
            $scope.data = {
                page: 1,
                limit: 5,
                noMoreData: true,
                orders: {
                    'date': 'start_date',
                    'probability': 'probability'

                },
                times: {
                    'all time': 'all',
                    '1 month': 1,
                    '3 months': 3,
                    '6 months': 6
                },
                orderBy: 'start_date',
                showLast: 'all', // in months
                leads: []
            };

            $scope.loading = false;
        }

        $scope.getTypeOf = function (val) {
            return typeof val;
        };

        $scope.calculateEndDate = function (lead) {
            var startDate = new Date(lead.start_date);
            var endDate = new Date();

            endDate.setDate(startDate.getDate() + lead.days_in_pipe);

            return endDate;
        }

        $scope.loadData = function (refresh) {
            if ($scope.loading) return;
            $scope.loading = true;
            loadService.show();

            if (refresh || $scope.data.leads.length == 0) {
                $scope.data.leads = [];
                $scope.data.page = 1;
            }

            apiLeads.getLeads($scope.data.limit, $scope.data.page, $scope.data.orderBy, $scope.data.showLast).then(function (res) {
                if (res && res.status === 200) {
                    $scope.data.leads = $scope.data.leads.concat(res.data);
                    $scope.loading = false;

                    if ($scope.data.leads.length) $scope.data.noMoreData = true;
                    else $scope.data.noMoreData = true;

                    loadService.hide();

                    $scope.data.page += 1;
                    $scope.$broadcast('scroll.refreshComplete');
                }
                else {
                    $scope.loading = false;

                    throw new Error("Invalid response");
                }
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.editLead = function (id) {
            $state.go('tab.edit-lead', {id: id});
        }

    }]);
