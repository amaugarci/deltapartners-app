angular.module('starter').controller('createLeadCtrl', [
    '$scope',
    '$ionicPopup',
    '$q',
    '$rootScope',
    'ionicDatePicker',
    'customSliderService',
    '$ionicHistory',
    'apiLeads',
    'loadService',
    'apiAccounts',
    'apiSettings',
    'apiCategories',
    'apiQualification',
    'apiOriginations',
    '$ionicScrollDelegate',
    'utils',
    'msgService', function (
        $scope,
        $ionicPopup,
        $q,
        $rootScope,
        ionicDatePicker,
        customSliderService,
        $ionicHistory,
        apiLeads,
        loadService,
        apiAccounts,
        apiSettings,
        apiCategories,
        apiQualification,
        apiOriginations,
        $ionicScrollDelegate,
        utils,
        msgService
    ) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.loading = false;
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
                "subtype": null, //correspondiente a CF
                "revenue": null, //correspondiente a CF
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
                "phases": [{
                    "weeks": null,
                    "fte": null
                }],
                "theoreticalRevenues": { //this is obtained via apiSettings.getRevenue() request
                },
                "overwrittenRevenues": {
                    "overwritten_total_fees": null,
                    "overwritten_total_expenses": null
                },
                "successFees": {
                    "amount": null,
                    "probability": null,
                    "expected_date": null

                },
                'qualificationMatrix': [],
                'origination_id': null,
                'number_of_competing_firms': null
            },
            'qualificationMatrix': {
                'total': 0,
                'answers': []
            },
            'qualificationMatrix2': [],
            accounts: [],
            subaccounts: [],
            categoriesCF: [],
            qualifications: [],
            originations: [],
            competing_firms: {
                0: 'No info yet',
                1: 'Single sourced – no competition',
                2: '1 competitor',
                3: '2 competitors',
                4: '3 competitors',
                5: '4 competitors',
                6: '5 competitors',
                99: 'More than 5 competitors',
            }
        };
        $scope.errors = {};

        $scope.loadData = function () {
            var leads_type = $rootScope.modeCF ? 'corporate-finance' : 'consulting';

            if ($scope.loading) return;
            $scope.loading = true;

            loadService.show();

            // Array of functions promises
            $q.all(promises).then(function (data) {
                loadService.hide();
            });
        };

        $scope.showInputOther = function(inputOther) {
          }

        /**
         * Let promise functions
         */
        var promises = {
            originations: getOriginations(),
            accounts: getAccounts(),
            categories: getCategories(),
            revenue: getRevenue(),
            qualifications: getQualification()
            //qualifications:getQualification()
        };

        function getOriginations() {
            var defered = $q.defer();
            var promise = defered.promise;

            //load accounts
            apiOriginations.getOriginations().then(function (res) {
                if (res && res.status === 200) {
                    $scope.data.originations = res.data;
                    defered.resolve("Success");
                } else {
                    throw new Error("Invalid response");
                    defered.reject("Error");
                }
            }).catch(function (err) {
                defered.reject("Error : " + err);
            });

            return defered.promise;
        }

        /**
         * Funcion que permite obtener
         * las accounts, obteniendo una promesa
         * con la carga de la misma
         */
        function getAccounts() {
            var defered = $q.defer();
            var promise = defered.promise;

            //load accounts
            apiAccounts.getAccounts().then(function (res) {
                if (res && res.status === 200) {
                    $scope.data.accounts = res.data;
                    defered.resolve("Success");
                } else {
                    throw new Error("Invalid response");
                    defered.reject("Error");
                }
            }).catch(function (err) {
                defered.reject("Error : " + err);
            });

            return defered.promise;
        }

        /***
         * Returns all blocks, questions and answers from database
         * for Qualification Matrix module
         */
        function getQualification() {
            var defered = $q.defer();
            var promise = defered.promise;

            apiQualification.getQualification().then(function (res) {
                if (res && res.status === 200) {
                    $scope.data.qualifications = res.data;
                    defered.resolve("Success");
                } else {
                    throw new Error("Invalid response");
                    defered.reject("Error");
                }
            }).catch(function (err) {
                defered.reject("Error : " + err);
            });

            return defered.promise;
        }

        /**
         * Funcion que permite realizar la carga
         * de categorias retornando una promesa
         * @return promise
         */
        function getCategories() {
            var defered = $q.defer();
            var promise = defered.promise;

            //load categories
            apiCategories.getCategories().then(function (res) {
                if (res && res.status === 200) {
                    $scope.data.categoriesCF = res.data;
                    defered.resolve("Success");
                    //defered.resolve($scope.data.categoriesCF);
                } else {
                    throw new Error("Invalid response");
                    defered.reject("Invalid response");
                }
            }).catch(function (err) {
                defered.reject("Error" + err);
            });

            return defered.promise;
        }

        function getRevenue() {
            var defered = $q.defer();
            var promise = defered.promise;

            //load settings
            apiSettings.getRevenue().then(function (res) {
                $scope.data.lead.theoreticalRevenues = res.data;
                defered.resolve("Sucess");
            }).catch(function (err) {
                defered.reject("Error " + err);
            });

            return promise;
        }

        var ipObj1 = {
            callback: function (val) {
                $scope.data.lead.start_date = moment(val).local().unix();
            },
            disabledDates: [],
            showTodayButton: true,
            mondayFirst: true,
            from: new Date(),
            closeOnSelect: false,
            templateType: 'popup'
        };

        var ipObj2 = {
            callback: function (val) {
                $scope.data.lead.successFees.expected_date = moment(val).local().unix(); //moment(val).format('D') + ' ' + monthNames[moment(val).format('M')-1] + ' ' + moment(val).format('YY');
            },
            showTodayButton: true,
            inputDate: new Date(),
            mondayFirst: true,
            //from: new Date(),
            closeOnSelect: false,
            templateType: 'popup'
        };

        $scope.openDatePickerNew = function () {
            ionicDatePicker.openDatePicker(ipObj1);
        };

        $scope.openDatePicker = function (id) {
            if (id == 'startDate') {
                ipObj1.inputDate = new Date($scope.data.lead.start_date * 1000);
                ionicDatePicker.openDatePicker(ipObj1);
            } else if (id == 'closureDate') {
                if ($scope.data.lead.successFees.expected_date) {
                    ipObj2.inputDate = new Date($scope.data.lead.successFees.expected_date * 1000);
                }

                ionicDatePicker.openDatePicker(ipObj2);
            }
        };

        $scope.addPhase = function () {
            $scope.data.lead.phases.push({
                "weeks": null,
                "fte": null
            });
        };

        $scope.removePhase = function () {
            $scope.data.lead.phases.pop();
            $scope.updateTotalTheoretical();
        };

        /*$scope.subaccountSelect = 'Subaccount';*/

        function cleanArray(actual) {
            var newArray = new Array();
            for (var i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }
            return newArray;
        }

        /**
         * Event onChange for all QualificationMatrix selectors
         *
         * @param currentAnswer
         * @param question
         * @param block
         */
        $scope.showSelectAnswer = function (currentAnswer, question, block) {
            var question_id = question.id;
            var answer = JSON.parse(currentAnswer);

            // Generate an json structure for API (TODO: improve)a>XBNM.-
            var userAnswer = {};
            userAnswer.question_id = question_id;
            userAnswer.answer_id = answer.id;

            $scope.data.lead.qualificationMatrix.push(userAnswer);
        };

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
        };

        $scope.showSelectCategories = function (categorieSelect) { //TODO - IMPROVE SELECT BEHAVIOUR, loop NOT NEEDED
            $scope.categorieSelect = categorieSelect;

            for (var i = 0; i < $scope.data.categoriesCF.length; ++i) {
                if ($scope.data.categoriesCF[i].name == categorieSelect) {
                    $scope.data.lead.leads_cf_category_id = $scope.data.categoriesCF[i].id;

                    return;
                }
            }
        };

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
        };

        $scope.createLead = function () {
            $scope.updateProbability();

            if (!$scope.overwriteRevenue) {
                $scope.data.lead.overwrittenRevenues = Array[0];
            }

            if ($scope.data.lead.successFees != undefined && $scope.data.lead.successFees.amount == undefined) {
                delete $scope.data.lead["successFees"];
            }
            if ($scope.accountSelect == 'Others') {
                $scope.data.lead.subaccount_id = null;
            }

            //validations
            let requiredString = 'This field is required';
            let atLeastOneString = 'You need at least one item';
            $scope.errors = {};
            if ($rootScope.modeCF) {
                if (!$scope.data.lead.client) {
                    $scope.errors.client = requiredString;
                }
                if (!$scope.categorieSelect) {
                    $scope.errors.leads_cf_category_id = requiredString;
                }
                if (!$scope.data.lead.weeks) {
                    $scope.errors.weeks = requiredString;
                }
                if (!$scope.data.lead.revenue) {
                    $scope.errors.revenue = requiredString;
                }
            } else {
                if (!$scope.data.lead.account_id) {
                    $scope.errors.account_id = requiredString;
                }
                if (!$scope.data.lead.leads_consulting_location_id) {
                    $scope.errors.leads_consulting_location_id = requiredString;
                }
                if ($scope.data.lead.phases.length == 0) {
                    $scope.errors.phases = atLeastOneString;
                }
                for (let i = 0; i < $scope.data.lead.phases.length; i++) {
                    if (typeof $scope.errors.phasesWeeks === 'undefined') {
                        $scope.errors.phasesWeeks = [];
                    }
                    if (!$scope.data.lead.phases[i].weeks) {
                        $scope.errors.phasesWeeks[i] = requiredString;
                    }

                    if (typeof $scope.errors.phasesFte === 'undefined') {
                        $scope.errors.phasesFte = [];
                    }
                }

                if ($scope.overwriteRevenue) {

                    if ( !$scope.data.lead.overwrittenRevenues.overwritten_total_fees ) {
                        $scope.data.lead.overwrittenRevenues.overwritten_total_fees = 0 ;
                    }
                    if (!$scope.data.lead.overwrittenRevenues.overwritten_total_expenses) {
                        $scope.data.lead.overwrittenRevenues.overwritten_total_expenses = 0 ;
                    }
                }
            }

            //both
            if ( (!$scope.data.lead.number_of_competing_firms || $scope.data.lead.number_of_competing_firms == 0) && 
            ($scope.data.lead.probability >= 90  && $scope.data.lead.probability <= 100)) {
                $scope.errors.number_of_competing_firms = requiredString;
            } else {
                $scope.errors.number_of_competing_firms = null;
            }
            if (!$scope.data.lead.start_date) {
                $scope.errors.start_date = requiredString;
            }
            if (!$scope.data.lead.origination_id) {
                $scope.errors.origination_id = requiredString;
            }

            if (typeof $scope.data.lead.probability == 'undefined') {
                $scope.errors.probability = requiredString;
            }
            if (!$scope.data.lead.name) {
                $scope.errors.name = requiredString;
            }
            if ($scope.enableSuccessFeeStatus) {
                if (!($scope.data.lead.successFees && $scope.data.lead.successFees.amount)) {
                    $scope.errors.success_fees_amount = requiredString;
                }
                if (!($scope.data.lead.successFees && $scope.data.lead.successFees.probability)) {
                    $scope.errors.success_fees_probability = requiredString;
                }
                if (!($scope.data.lead.successFees && $scope.data.lead.successFees.expected_date)) {
                    $scope.errors.success_fees_expected_date = requiredString;
                }
            }

            $scope.errors.qualifications_answers = [];
            let mappedAnswers = $scope.data.lead.qualificationMatrix.map(e => e.question_id);

            for (let i = 0; i < $scope.data.qualifications.length; i++) {
                for (let j = 0; j < $scope.data.qualifications[i].questions.length; j++) {
                    let index = mappedAnswers.indexOf($scope.data.qualifications[i].questions[j].id);
                    if (index === -1) {
                        $scope.errors.qualifications_answers[$scope.data.qualifications[i].questions[j].id] = requiredString;
                    }
                }
            }

            let mappedErrors = Object.keys($scope.errors).map(item => {
                if (!Array.isArray($scope.errors[item])) {
                    return $scope.errors[item];
                }
            }).filter(item => !!item);

            if (Object.keys(mappedErrors).length > 0 ||
                (
                    ($scope.errors.phasesFte && Object.keys($scope.errors.phasesFte).length > 0)
                    || ($scope.errors.phasesWeeks && Object.keys($scope.errors.phasesWeeks).length > 0)
                    || ($scope.errors.qualifications_answers && Object.keys($scope.errors.qualifications_answers).length > 0)
                )
            ) {
                let confirm = $ionicPopup.confirm({
                    template: "There's some errors in the form. Can you please fix them?",
                    cssClass: 'no-margins',
                    buttons: [
                        {
                            text: 'OK',
                            onTap: function (e) {
                                confirm.close();
                            }
                        }]
                });
                loadService.hide();
                return false;
            }

            let createLead = function () {
                loadService.show();

                if ( $scope.data.lead.number_of_competing_firms == null ) {
                    $scope.data.lead.number_of_competing_firms = 0;
                }

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
                                    if ($scope.data.lead.probability >= 90) {
                                        $ionicPopup.alert({
                                            title: 'Your project',
                                            template: 'Congrats! You just secured a new project'
                                        });
                                    }
                                }
                            }
                        ]
                    });
                    loadService.hide();
                }).catch(function (err) {
                    loadService.hide();
                });
            };

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
        };

        $scope.updateTotalTheoretical = function () {
            apiSettings.getTheoreticalRevenue($scope.data.lead.phases, $scope.data.lead.theoreticalRevenues.expenses_percentage, $scope.data.lead.theoreticalRevenues.fte_fees).then(function (res) {
                $scope.data.totalTheoretical = res.data.amount;
            }).catch(function (err) {
            });
            $ionicScrollDelegate.resize();
        };

        $scope.updateProbability = function () {
            $scope.data.lead.probability = $rootScope.getValueFromIndex($rootScope.currentDot[0]);
        };

        $scope.overwriteRevenue = false;
        $scope.toggleOverwriteRevenue = function (overwriteRevenue) {
           //if (overwriteRevenue) msgService.showMessage("Once you check this option, you won't be able to uncheck it.", "Alert");
            $scope.data.lead.overwrittenRevenues.overwritten_total_fees = 0 ;
            $scope.data.lead.overwrittenRevenues.overwritten_total_expenses = 0 ;
        
            $scope.overwriteRevenue = overwriteRevenue;
            $ionicScrollDelegate.resize();
        };

        $scope.setLocation = function (locationSelect) {
            $scope.data.lead.leads_consulting_location_id = locationSelect;
        };

        $scope.setSuccessFeeProbability = function () {
            $scope.data.lead.successFees.probability = $rootScope.getValueFromIndex($rootScope.currentDot[1]);
        };

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
            $scope.enableSuccessFeeStatus = enableSuccessFee;

            $ionicScrollDelegate.resize();
        }

    }
]);
