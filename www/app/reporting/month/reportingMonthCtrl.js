angular.module('starter').controller('reportingMonthCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicScrollDelegate', function ($scope, $rootScope, $stateParams, $ionicScrollDelegate) {
    $scope.currentTab = 1;

    $scope.selectedTab = function (index) {
        $scope.currentTab = index;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.stats = {
        month: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
        ratio: [100, 90, 70, 50],
        ratioValue: [],
        deliveredTitle: [],
        deliveredPIC: [],

        deliveredRevenue: [],
        deliveredLead: [],
        deliveredDate: [],
        liveTitle: [],
        liveP: [],
        livePIC: [],
        liveRevenue: [],
        liveLead: [],
        liveDate: []
    };

    $scope.statsCF = {
        month: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
        ratio: [100, 90, 70, 50],
        ratioValue: [],
        deliveredTitle: [],
        deliveredPIC: [],

        //advisory
        advisoryRevenue: [],
        advisoryPIC: [],
        advisoryProbability: [],
        advisoryLead: [],
        advisoryDate: [],

        //m_a
        maRevenue: [],
        maPIC: [],
        maProbability: [],
        maLead: [],
        maDate: [],

        //ts
        tsRevenue: [],
        tsPIC: [],
        tsProbability: [],
        tsLead: [],
        tsDate: [],

        //digital
        digitalRevenue: [],
        digitalPIC: [],
        digitalProbability: [],
        digitalLead: [],
        digitalDate: [],


        deliveredLead: [],
        deliveredDate: [],

        liveTitle: [],
        liveP: [],
        livePIC: [],
        liveRevenue: [],
        liveLead: [],
        liveDate: []
    };


    for (var i in $rootScope.reportingMonth.data) {
        if (i == 'being_delivered') {
            if ($rootScope.reportingMonth.data[i].length) {
                for (var j = 0; j < $rootScope.reportingMonth.data[i].length; ++j) {
                    $scope.stats.deliveredLead.push({
                        name: $rootScope.reportingMonth.data[i][j].name,
                        description: $rootScope.reportingMonth.data[i][j].description,
                        account: $rootScope.reportingMonth.data[i][j].account,
                        subAccount: $rootScope.reportingMonth.data[i][j].subAccount
                    });
                    $scope.stats.deliveredPIC.push($rootScope.reportingMonth.data[i][j].pic);
                    $scope.stats.deliveredRevenue.push($rootScope.reportingMonth.data[i][j].revenue);
                    $scope.stats.deliveredDate.push($rootScope.reportingMonth.data[i][j].start_date);
                }
            }
        }
        else if (i == 'live_pipeline') {
            if ($rootScope.reportingMonth.data[i].length) {
                for (var j = 0; j < $rootScope.reportingMonth.data[i].length; ++j) {
                    $scope.stats.liveLead.push({
                        name: $rootScope.reportingMonth.data[i][j].name,
                        description: $rootScope.reportingMonth.data[i][j].description,
                        account: $rootScope.reportingMonth.data[i][j].account,
                        subAccount: $rootScope.reportingMonth.data[i][j].subAccount,
                        startDate: $rootScope.reportingMonth.data[i][j].start_date
                    });
                    $scope.stats.livePIC.push($rootScope.reportingMonth.data[i][j].pic);
                    $scope.stats.liveRevenue.push($rootScope.reportingMonth.data[i][j].revenue);
                    $scope.stats.liveDate.push($rootScope.reportingMonth.data[i][j].start_date);

                    //remove if after Cobis integration
                    $scope.stats.liveP.push($rootScope.reportingMonth.data[i][j].probability);
                }
            }
        }
        else if ($rootScope.reportingMonth.data[i] != undefined && i == 'advisory') {
            if ($rootScope.reportingMonth.data[i].length) {
                for (var j = 0; j < $rootScope.reportingMonth.data[i].length; ++j) {
                    $scope.statsCF.advisoryLead.push({
                        name: $rootScope.reportingMonth.data[i][j].name,
                        description: $rootScope.reportingMonth.data[i][j].description
                    });

                    $scope.statsCF.advisoryPIC.push($rootScope.reportingMonth.data[i][j].pic);
                    $scope.statsCF.advisoryRevenue.push($rootScope.reportingMonth.data[i][j].revenue);
                    $scope.statsCF.advisoryProbability.push($rootScope.reportingMonth.data[i][j].probability);
                }
            }
        } else if ($rootScope.reportingMonth.data[i] != undefined && i == 'm_a') {
            if ($rootScope.reportingMonth.data[i].length) {
                for (var j = 0; j < $rootScope.reportingMonth.data[i].length; ++j) {
                    $scope.statsCF.maLead.push({
                        name: $rootScope.reportingMonth.data[i][j].name,
                        description: $rootScope.reportingMonth.data[i][j].description
                    });

                    $scope.statsCF.maPIC.push($rootScope.reportingMonth.data[i][j].pic);
                    $scope.statsCF.maRevenue.push($rootScope.reportingMonth.data[i][j].revenue);
                    $scope.statsCF.maProbability.push($rootScope.reportingMonth.data[i][j].probability);
                }
            }
        }
        else if ($rootScope.reportingMonth.data[i] != undefined && i == 'ts') {

            if ($rootScope.reportingMonth.data[i].length) {
                for (var j = 0; j < $rootScope.reportingMonth.data[i].length; ++j) {
                    $scope.statsCF.tsLead.push({
                        name: $rootScope.reportingMonth.data[i][j].name,
                        description: $rootScope.reportingMonth.data[i][j].description
                    });

                    $scope.statsCF.tsPIC.push($rootScope.reportingMonth.data[i][j].pic);
                    $scope.statsCF.tsRevenue.push($rootScope.reportingMonth.data[i][j].revenue);
                    $scope.statsCF.tsProbability.push($rootScope.reportingMonth.data[i][j].probability);
                }
            }
        }
        else if ($rootScope.reportingMonth.data[i] != undefined && i == 'digital_partnership') {

            if ($rootScope.reportingMonth.data[i].length) {
                for (var j = 0; j < $rootScope.reportingMonth.data[i].length; ++j) {
                    $scope.statsCF.digitalLead.push({
                        name: $rootScope.reportingMonth.data[i][j].name,
                        description: $rootScope.reportingMonth.data[i][j].description
                    });

                    $scope.statsCF.digitalPIC.push($rootScope.reportingMonth.data[i][j].pic);
                    $scope.statsCF.digitalRevenue.push($rootScope.reportingMonth.data[i][j].revenue);
                    $scope.statsCF.digitalProbability.push($rootScope.reportingMonth.data[i][j].probability);
                }
            }
        }
    }

    $scope.stats.ratioValue = $rootScope.reportingMonth.stats;
    $scope.currentMonth = $scope.stats.month[$stateParams.id];
}]);
