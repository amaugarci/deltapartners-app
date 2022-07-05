angular.module('starter').controller('reportingCtrl', ['$scope', '$rootScope', '$state', 'apiReports', 'loadService', 'apiCategories',
    function ($scope, $rootScope, $state, apiReports, loadService, apiCategories) {
        $scope.data = {
            stats: {},
            filter: {
                'USA': 1,
                'Rest of the world': 2,
                'Compended': 'compended'
            },
            currentFilter: 'compended',
        };


        //load categories
        apiCategories.getCategories().then(function (res) {
            if (res && res.status === 200) {
                $scope.data.categoriesCF = res.data;
                $scope.data.categoriesCF.unshift({id: 'compended', name: 'Total'});
            } else {
                throw new Error("Invalid response");
            }
        }).catch(function (err) {
        });

        $scope.setFilter = function (value) {
            $scope.data.currentFilter = value;
            $scope.getReports($scope.data.currentFilter);
        };

        /**
         * Funcion que permite poder filtrar el
         * listado de meses por la categoria
         * seleccionada
         */
        $scope.showSelectCategories = function (categorieSelect) {
            $scope.data.currentFilter = categorieSelect;
            $scope.getReports($scope.data.currentFilter);
        };

        $scope.getReports = function (filter) {
            loadService.show();
            apiReports.getReports(filter).then(function (res) {
                $scope.stats = {
                    month: [],
                    budget: [],
                    ratio100: [],
                    ratio90: [],
                    ratio70: [],
                    ratio50: [],
                    details: []
                };

                if (res && res.status === 200) {
                    for (var i in res.data) {
                        $scope.stats.month.push(capitalizeFirstLetter(i));
                        $scope.stats.budget.push(res.data[i].budget);
                        $scope.stats.ratio100.push(res.data[i]["100pct"]);
                        $scope.stats.ratio90.push(res.data[i]["90pct"]);
                        $scope.stats.ratio70.push(res.data[i]["70pct"]);
                        $scope.stats.ratio50.push(res.data[i]["50pct"]);

                        if ($rootScope.modeCF) { //Load Corporate Finance
                            $scope.stats.details.push({
                                data: {
                                    closed: res.data[i].closed,
                                    pipe_adjusted: res.data[i].pipe_adjusted,
                                    advisory: res.data[i].advisory,
                                    m_a: res.data[i].m_a,
                                    digital_partnership: res.data[i].digital_partnership,
                                    ts: res.data[i].ts
                                },
                                stats: [res.data[i]["100pct"], res.data[i]["90pct"], res.data[i]["70pct"], res.data[i]["50pct"]]
                            });
                        } else { //Load Consulting
                            $scope.stats.details.push({
                                data: {
                                    being_delivered: res.data[i].being_delivered,
                                    live_pipeline: res.data[i].live_pipeline
                                },
                                stats: [res.data[i]["100pct"], res.data[i]["90pct"], res.data[i]["70pct"], res.data[i]["50pct"]]
                            });
                        }
                    }

                    loadService.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                }
                else {
                    throw new Error("Invalid response");
                }
            }).catch(function (err) {
            });
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.options = null;
            //reload graph

            $scope.showMonth = function (index) {
                $rootScope.reportingMonth = $scope.stats.details[index];
                $state.go('tab.reporting-month', {id: index});
            };

            $scope.getReports($scope.data.currentFilter);
        });

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

    }]);
