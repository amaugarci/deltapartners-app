angular.module('starter').controller('createLeadCFCtrl', ['$scope', '$ionicPopup', '$rootScope', 'ionicDatePicker', 'customSliderService', '$ionicHistory', 'apiLeads', 'apiAccounts', 'apiSettings', 'apiCategories', 'apiQualification', '$ionicScrollDelegate', 'utils', 'msgService', function ($scope, $ionicPopup, $rootScope, ionicDatePicker, customSliderService, $ionicHistory, apiLeads, apiAccounts, apiSettings, apiCategories, apiQualification, $ionicScrollDelegate, utils, msgService) {

    var leads_type = $rootScope.modeCF ? 'corporate-finance' : 'consulting'; 

    $scope.$on('$ionicView.beforeEnter', function() {
       $rootScope.currentDot = [-1, -1];
       
       $scope.loadData();
    });

    $scope.data = {
        locations: {
            'USA': 1,
            'Rest of the world': 2
        },
        lead: {
            "leads_cf_category_id": 1, //correspondiente a  CF,
            "subtype": null,           //correspondiente a CF
            "revenue": null,           //correspondiente a CF
            "location_city": null,
            "leads_consulting_location_id": null, // 1 = USA 2 REST OF THE WORLD
            "project_code": "FAKE",
            "account_id": null,
            "start_date": null,
            "subaccount_id": null,
            "name": null,
            "probability": null,
            "client": null,
            "weeks": null,
            "phases": [
                {
                    "weeks": null,
                    "fte": null
                }
            ],
            "theoreticalRevenues": { //this is obtained via apiSettings.getRevenue() request
                /*"expenses_percentage": 17.93,
                "fte_fees": 53651.82*/
            },
            "overwrittenRevenues":
                {
                    "overwritten_total_fees": null,
                    "overwritten_total_expenses": null
                }
            ,
            "successFees": {
                "amount": null,
                "probability": null,
                "expected_date": null

            }
            /* "success_fee_settings":
              {
                  "amount": null,
                  "probability": null,
                  "expected_date": null
                }
              */
        },
        accounts: [],
        subaccounts: [],
        categoriesCF: []
    };

    $scope.loadData = function () {
        //load accounts
        apiAccounts.getAccounts().then(function (res) {
            if (res && res.status === 200) {
                $scope.data.accounts = res.data;
            } else {
                throw new Error("Invalid response");
            }
        }).catch(function (err) {
        });
        //load categories
        apiCategories.getCategories().then(function (res) {
            if (res && res.status === 200) {
                $scope.data.categoriesCF = res.data;
            } else {
                throw new Error("Invalid response");
            }
        }).catch(function (err) {
        });

        //load settings
        apiSettings.getRevenue().then(function (res) {
            $scope.data.lead.theoreticalRevenues = res.data;
        }).catch(function (err) {

        });

        //load qualification matrix 
        apiQualification.getQualification().then()

    };

    var ipObj1 = {
        callback: function (val) {  //Mandatory
            $scope.data.lead.start_date = moment(val).add(parseFloat(moment(val).format('Z')), 'hours').unix();
        },
        disabledDates: [            //Optional
            /* new Date(2016, 2, 16),
             new Date(2015, 3, 16),
             new Date(2015, 4, 16),
             new Date(2015, 5, 16),
             new Date('Wednesday, August 12, 2015'),
             new Date("08-16-2016"),
             new Date(1439676000000)
           */],
        //from: new Date(2012, 1, 1), //Optional
        //to: new Date(2016, 10, 30), //Optional
        showTodayButton: true,
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        /*   disableWeekdays: [0],      */ //Optional
        from: new Date(),
        closeOnSelect: false,       //Optional
        templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function () {
        ionicDatePicker.openDatePicker(ipObj1);
    };

    $scope.addPhase = function () {
        $scope.data.lead.phases.push({
            "weeks": null,
            "fte": null
        });
    }

    $scope.removePhase = function () {
        $scope.data.lead.phases.pop();
        $scope.updateTotalTheoretical();
    }

    /*$scope.subaccountSelect = 'Subaccount';*/

    $scope.showSelectAccount = function (accountSelect) { //TODO - IMPROVE SELECT BEHAVIOUR, loop NOT NEEDED
        $scope.accountSelect = accountSelect;
        for (var i = 0; i < $scope.data.accounts.length; ++i) {
            if ($scope.data.accounts[i].name == accountSelect) {
                $scope.data.subaccounts = $scope.data.accounts[i].subAccounts;

                $scope.data.lead.account_id = $scope.data.accounts[i].id;
                return;
            }
        }
    }

    $scope.showSelectCategories = function (categorieSelect) { //TODO - IMPROVE SELECT BEHAVIOUR, loop NOT NEEDED
        $scope.categorieSelect = categorieSelect;
        for (var i = 0; i < $scope.data.categoriesCF.length; ++i) {
            if ($scope.data.categoriesCF[i].name == categorieSelect) {
                $scope.data.lead.leads_cf_category_id = $scope.data.categoriesCF[i].id;
                return;
            }
        }
    }

    $scope.showSelectSubaccount = function (subaccountSelect) { //TODO - IMPROVE SELECT BEHAVIOUR, loop NOT NEEDED
        $scope.subaccountSelect = subaccountSelect;
        if (subaccountSelect == 'Others') $scope.data.lead.subaccount = '';
        else if ($scope.subaccountSelect != 'Subaccount') $scope.data.lead.subaccount = subaccountSelect;
        for (var i = 0; i < $scope.data.subaccounts.length; ++i) {
            if ($scope.data.subaccounts[i].name == subaccountSelect) {
                $scope.data.lead.subaccount_id = $scope.data.subaccounts[i].id;
                return;
            }
        }
    }

    $scope.createLead = function () {
        $scope.updateProbability(); //esto deberia de sobrar, pero por si acaso.

        if (!$scope.overwriteRevenue) {
            $scope.data.lead.overwrittenRevenues = Array[0];
        }

        if ($scope.accountSelect == 'Others') {
            $scope.data.lead.subaccount_id = null;
        }

        let createLead = function () {
            loadService.show();
            apiLeads.createLead($scope.data.lead).then(function (res) {
                var qualification_matrix_value = res.data.qualification_matrix_value;
                var qualificationMsg = '';

                if (qualification_matrix_value / 100 < 0.5) {
                    qualificationMsg = "Qualification matrix result: " + res.data.qualification_matrix_value + "%. This lead does not qualify";
                } else if (qualification_matrix_value / 100 >= 0.5 && qualification_matrix_value / 100 < 0.7) {
                    qualificationMsg = "Qualification matrix result: " + res.data.qualification_matrix_value + "%. Lead to be assess offline, based on staffing situation";
                } else {
                    qualificationMsg = "Qualification matrix result: " + res.data.qualification_matrix_value + "%. Pursue opportunity";
                }

                var myPopup = $ionicPopup.show({
                    template: qualificationMsg,
                    title: 'Qualification Matrix',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'Ok',
                            onTap: function (e) {
                                myPopup.close();
                                window.history.back();
                            }
                        }
                    ]
                });

                loadService.hide();
            }).catch(function (err) {
            });
        }

        if ($scope.data.lead.probability >= 90) {
            let confirm = $ionicPopup.confirm({
                template: 'Congrats! You just secured a new project',
                cssClass: 'no-margins',
                buttons: [
                    {
                        text: 'Confirm',
                        onTap: function (e) {
                            confirm.close();
                            createLead();
                        },
                    },
                    {
                        text: 'Cancel',
                        onTap: function (e) {
                            confirm.close();
                        }
                    }]
            });
        } else {
            if ($scope.data.lead.probability === 0) {
                let confirm = $ionicPopup.confirm({
                    template: 'Have we lost this project?',
                    cssClass: 'no-margins',
                    buttons: [
                        {
                            text: 'Confirm',
                            onTap: function (e) {
                                confirm.close();
                                createLead();
                            },
                        },
                        {
                            text: 'Cancel',
                            onTap: function (e) {
                                confirm.close();
                            }
                        }]
                });
            } else {
                createLead();
            }
        }
    }

    $scope.updateTotalTheoretical = function () {
        apiSettings.getTheoreticalRevenue($scope.data.lead.phases, $scope.data.lead.theoreticalRevenues.expenses_percentage, $scope.data.lead.theoreticalRevenues.fte_fees).then(function (res) {
            $scope.data.totalTheoretical = res.data.amount;
        }).catch(function (err) {
        });
        $ionicScrollDelegate.resize();
    }

    $scope.updateProbability = function () {
        $scope.data.lead.probability = $rootScope.getValueFromIndex($rootScope.currentDot[0]);
    }

    $scope.overwriteRevenue = false;
    $scope.toggleOverwriteRevenue = function (overwriteRevenue) {
        $scope.overwriteRevenue = overwriteRevenue;

        //if (overwriteRevenue) msgService.showMessage("Once you check this option, you won't be able to uncheck it.", "Alert");
        $ionicScrollDelegate.resize();
    }

    $scope.showInputOther = function(inputOther) {
    }

    $scope.setLocation = function (locationSelect) {
        $scope.data.lead.leads_consulting_location_id = locationSelect;
    }

    $scope.setSuccessFeeProbability = function () {
        $scope.data.lead.successFees.probability = $rootScope.getValueFromIndex($rootScope.currentDot[1]);
    }

    var tmpSuccessFees;
    $scope.toggleEnableSuccessFee = function (enableSuccessFee) {
        if (!enableSuccessFee) {
            tmpSuccessFees = $scope.data.lead["successFees"];
            delete $scope.data.lead["successFees"];
        } else {
            $scope.data.lead.successFees = tmpSuccessFees;
            if ($scope.data.lead.successFees == undefined) {
                $scope.data.lead.successFees = {};
            }
            if ($scope.data.lead.successFees.probability == undefined) {
                $scope.data.lead.successFees.probability = null;
            }
        }

        $ionicScrollDelegate.resize();
    }

}]);
