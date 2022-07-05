angular.module('starter').controller('performanceCtrl', [
    '$scope',
    '$rootScope',
    '$timeout',
    'customChartService',
    '$ionicScrollDelegate',
    '$state',
    '$stateParams',
    'apiAccounts',
    'loadService', function ($scope, $rootScope, $timeout, customChartService, $ionicScrollDelegate, $state, $stateParams, apiAccounts, loadService) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.data.showLast = 'all';
            $scope.data.account = {};

            if ($rootScope.currentTab == 1) {
                $scope.loadPipeData();
            } else {
                $scope.loadData();
            }
            $scope.options = null;
        });

        $scope.currentYear = moment().format('YYYY');
        $scope.pageTitle = "ACC PERFORMANCE";

        if ($rootScope.currentTab == undefined) {
            $rootScope.currentTab = 0;
        }

        $scope.selectedTab = function (index) {
            if (index == $rootScope.currentTab) return;

            if (index == 0) {
                $state.go($state.current, {}, {reload: true});
                $scope.pageTitle = "ACC PERFORMANCE";
                $scope.loadData();
            } else {
                $scope.pageTitle = "ACC PIPELINE";
                $scope.loadPipeData();
            }

            $rootScope.currentTab = index;
            $ionicScrollDelegate.scrollTop();
        };

        $scope.data = {
            orderBy: 'probability',
            showLast: 'all', // in months,
            account: {},
            leads: [],
            performance: {},
            orders: {
                'date': 'start_date',
                'probability': 'probability'

            },
            times: {
                'all time': 'all',
                '1 month': 1,
                '3 months': 3,
                '6 months': 6
            }
        };

        $scope.data.graph = [[], []];
        $scope.dataMax = [];
        $scope.labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        $scope.series = ['Series A', 'Series B'];

        $scope.onClick = function (points, evt) {

        };

        $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
        /* END OF TAB-PERFORMANCE */

        $scope.setOrderBy = function (value) {
            $scope.data.orderBy = value;
            $scope.loadPipeData(true);
        }

        $scope.setTime = function (value) {
            $scope.data.showLast = value;
            $scope.loadPipeData(true);
        }

        $scope.loadPipeData = function (refresh) {
            if (refresh || $scope.data.leads.length == 0) {
                $scope.data.leads = [];
                $scope.data.page = 1;
            }

            apiAccounts.getPipelines($stateParams.id, $scope.data.orderBy, $scope.data.showLast).then(function (res) {
                $scope.data.leads = res.data;

                if (res && res.status === 200) {
                    //$scope.data.account = res.data;
                    loadService.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }
                else {
                    throw new Error("Invalid response");
                }
            }).catch(function (err) {
                console.log(err);
            });
        }

        $scope.loadData = function (refresh) {
            if (refresh) {
                //$scope.data.accounts = [];
                $scope.data.page = 1;
                $scope.data.noMoreData = false;
            }
            apiAccounts.getAccount($stateParams.id).then(function (res) {
                if (res && res.status === 200) {
                    $scope.data.account = res.data;

                    loadService.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }
                else {
                    throw new Error("Invalid response");
                }
            }).catch(function (err) {
                console.log(err);
            });

            apiAccounts.getPerformance($stateParams.id).then(function (res) {
                res.data.performance_vs_target.pct100 = res.data.performance_vs_target['100pct'];
                res.data.performance_vs_target.pct90 = res.data.performance_vs_target['90pct'];

                $scope.data.performance = res.data;

                for (var i = 0; i < Object.keys($scope.data.performance.closed_pipeline).length; ++i) {
                    $scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].pipe += $scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].closed;
                    $scope.data.graph[0].push($scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].closed);
                    $scope.data.graph[1].push($scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].pipe);
                    $scope.dataMax.push(Math.max($scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].closed - $scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].pipe, $scope.data.performance.closed_pipeline[Object.keys($scope.data.performance.closed_pipeline)[i]].pipe));
                }

                /* START OF TAB-PERFORMANCE */

                $scope.maxValue = Math.max.apply(null, $scope.dataMax);

                // maxComplementary =  125 / maxValue
                // used to compute the position off the numbers of the graph
                //height setted to 175
                $scope.maxComplementary = 175 / $scope.maxValue;

                $scope.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            stacked: true,
                            display: false,
                        }],
                        yAxes: [
                            {
                                id: 'y-axis-1',
                                type: 'linear',
                                display: false,
                                position: 'left',
                                ticks: {
                                    beginAtZero: true,
                                    max: $scope.maxValue
                                }
                            },
                            {
                                id: 'y-axis-2',
                                type: 'linear',
                                display: false,
                                position: 'right',
                                ticks: {
                                    beginAtZero: true,
                                    max: $scope.maxValue
                                }
                            }
                        ]
                    }
                };

            }).catch(function (err) {

            });
        }

        $scope.editLead = function (_id, _accessible_by_partner) {
            var _data = {
                id: _id,
                accesible: _accessible_by_partner
            };

            $state.go('tab.edit-lead-accounts', _data);
        }

    }]);