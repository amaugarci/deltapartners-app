angular.module('starter').controller('editLeadCtrl', [
    '$scope',
    '$q',
    '$rootScope',
    'customSliderService',
    'ionicDatePicker',
    '$ionicHistory',
    'loadService',
    'apiLeads',
    'apiCategories',
    'apiQualification',
    'apiOriginations',
    '$stateParams',
    '$ionicPopup',
    '$ionicModal',
    'utils',
    '$ionicScrollDelegate',
    'apiSettings',
    'msgService', function ($scope, $q, $rootScope, customSliderService, ionicDatePicker, $ionicHistory, loadService, apiLeads, apiCategories, apiQualification, apiOriginations, $stateParams, $ionicPopup, $ionicModal, utils, $ionicScrollDelegate, apiSettings, msgService) {

        //set title with rootScope
        $rootScope.titulo = "EDIT LEAD";

        $scope.data = {
            disabled: false, // establece el comportamiento de la pantalla : readOnly o read
            disableOverwrite: false,
            disableSuccessFee: false,
            startingSuccessProb: 100,
            todayStartDate: moment().startOf('day').unix(),
            total: 0,
            answerSelect: [],
            accounts: [],
            subaccounts: [],
            categoriesCF: [],
            qualifications: [],
            'qualificationMatrix': {
                'total': 0,
                'answers': []
            },
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

        $scope.$on('$ionicView.beforeEnter', function () {
            //loadService.show();
            $scope.loadData();
        });

        $scope.enableSuccessFee = false;
        $scope.categorieSelect = null;

        $scope.loadData = function () {
            loadService.show();

            let promises = [];
            promises.push(getQualification());
            promises.push(getOriginations());
            promises.push(getCategories());

            Promise.all(promises)
                .then(data => {
                    loadService.hide();
                })
        };

        function isInArray(value, array) {
            return array.indexOf(value) > -1;
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

        function getCategories() {

            var defered = $q.defer();
            var promise = defered.promise;
            apiCategories.getCategories()
                .then(function (res) {
                    if (res && res.status === 200) {
                        $scope.data.categoriesCF = res.data;

                        apiLeads.getLead($stateParams.id).then(function (res) {
                            var accesible = $stateParams.accesible;

                            if (accesible != undefined) {
                                if (accesible == "true") {
                                    $scope.data.disabled = false; //deshabilito porque permite editar, porque puede editar
                                    $rootScope.titulo = "EDIT LEAD";
                                } else {
                                    $scope.data.disabled = true;
                                    $rootScope.titulo = "VIEW LEAD";
                                }
                            } else {
                                //establezco en falso por defecto
                                $scope.data.diabled = false;
                                $rootScope.titulo = "EDIT LEAD";
                            }

                            if (res.data.overwritten_revenue) {
                                $scope.data.disableOverwrite = true;
                            }

                            if (res.data.successFees.amount != undefined) {
                                $scope.data.disableSuccessFee = true;
                                $scope.data.startingSuccessProb = res.data.successFees.probability;
                            }

                            if (res && res.status === 200) {
                                //seteo el valor de la categoria
                                for (var i = 0; i < $scope.data.categoriesCF.length; ++i) {
                                    if ($scope.data.categoriesCF[i].id == res.data.leads_cf_category_id) {
                                        $scope.categorieSelect = $scope.data.categoriesCF[i].name;
                                    }
                                }

                                $scope.data.lead = res.data;
                                $scope.data.lead.lost_lead_reasons = {
                                    psd: null,
                                    anf_why: null,
                                    anf_who: null,
                                };

                                //if ($scope.data.lead.successFees.probability == undefined) $scope.data.lead.successFees.probability = -1;
                                $rootScope.currentDot = [$rootScope.getIndexFromValue($scope.data.lead.probability), $rootScope.getIndexFromValue($scope.data.lead.successFees.probability)];

                                if (!$scope.data.lead.closure_date) $scope.data.lead.closure_date = moment().format();

                                $scope.data.qualificationMatrix.total = $scope.data.lead.qualification_matrix_value + '%';

                                // Regenerate an aux array to save QualificationMatrix user responses
                                var qualificationMatrixUserResponses = [];

                                for (var y = 0; y < $scope.data.lead.qualificationMatrix.length; y++) {
                                    var answer_id = $scope.data.lead.qualificationMatrix[y].answer_id;

                                    qualificationMatrixUserResponses[y] = answer_id;
                                }

                                // Repopulate selectors with current user responses
                                for (var i = 0; i < $scope.data.qualifications.length; i++) {
                                    var blocks = $scope.data.qualifications[i];

                                    for (var j = 0; j < blocks.questions.length; j++) {
                                        var questions = blocks.questions[j];

                                        for (var z = 0; z < questions.answers.length; z++) {
                                            var question_id = questions.id;
                                            var answer_id = questions.answers[z].id;

                                            if (isInArray(answer_id, qualificationMatrixUserResponses)) {
                                                $scope.data.qualifications[i].questions[j].answers[z].enabled = true;
                                            } else {
                                                $scope.data.qualifications[i].questions[j].answers[z].enabled = false;
                                            }
                                        }
                                    }
                                }

                                $scope.enableSuccessFee = ($scope.data.lead.successFees.amount != undefined);
                                defered.resolve("Success");
                            } else {
                                throw new Error("Invalid response");
                                defered.reject("Error");

                            }

                        }).catch(function (err) {
                            defered.reject("Error");
                        });
                    } else {
                        throw new Error("Invalid response");
                        defered.reject("Error");
                    }
                })
                .catch(function (err) {

                });
            return defered.promise;
        }

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
         * Event onChange for all QualificationMatrix selectors
         *
         * @param currentAnswer
         * @param question
         * @param block
         */
        $scope.showSelectAnswer = function (currentAnswer, question, block) {
            var question_id = question.id;
            var answer_id = JSON.parse(currentAnswer);

            // Generate an json structure for API (TODO: improve)
            var userAnswer = {};
            userAnswer.question_id = question_id;
            userAnswer.answer_id = answer_id;

            // Repopulate selectors with current user responses
            for (var i = 0; i < $scope.data.lead.qualificationMatrix.length; i++) {
                var user_question_id = $scope.data.lead.qualificationMatrix[i].question_id;

                if (user_question_id == question_id) {
                    $scope.data.lead.qualificationMatrix[i].answer_id = answer_id;
                }
            }

            cleanArray($scope.data.qualificationMatrix.answers);
            cleanArray($scope.data.lead.qualificationMatrix);
        };

        function cleanArray(actual) {
            var newArray = new Array();
            for (var i = 0; i < actual.length; i++) {
                if (actual[i]) {
                    newArray.push(actual[i]);
                }
            }
            return newArray;
        }

        //Select categories
        $scope.showSelectCategories = function (categorieSelect) { //TODO - IMPROVE SELECT BEHAVIOUR, loop NOT NEEDED
            $scope.categorieSelect = categorieSelect;

            for (var i = 0; i < $scope.data.categoriesCF.length; ++i) {
                if ($scope.data.categoriesCF[i].name == categorieSelect) {
                    $scope.data.lead.leads_cf_category_id = $scope.data.categoriesCF[i].id;
                    return;
                }
            }
        }

        $scope.qualitativeFocus = function () {
            $scope.prevQualitativeComment = $scope.data.lead.qualitative_comment;
            $scope.data.lead.qualitative_comment = ''
        }

        $scope.qualitativeBlur = function () {
            if ($scope.data.lead.qualitative_comment == '') {
                $scope.data.lead.qualitative_comment = $scope.prevQualitativeComment;
            }
        }

        $scope.updateLead = function () {
            if ($scope.data.lead.successFees && $scope.data.lead.successFees.expected_date == undefined) {
                $scope.data.lead.successFees.expected_date = null;
            }
            if ($scope.data.lead.start_date == null) delete $scope.data.lead["start_date"];

            if (!$scope.data.lead.overwritten_revenue) {
                delete $scope.data.lead["overwrittenRevenues"];
            } else {
                if ($scope.data.lead.overwrittenRevenues.amount) delete $scope.data.lead.overwrittenRevenues["amount"];
            }

            if ($scope.data.lead.successFees && $scope.data.lead.successFees.length == 0) delete $scope.data.lead["successFees"];
            if ($scope.data.lead.created_at) delete $scope.data.lead["created_at"];

            //este fix es porque $scope.data.lead.overwrittenRevenues es un array con claves alfanumemricas, y no las soporta el http
            //entonces se convierte a un objeto
            if ($scope.data.lead.overwritten_revenue) {
                $scope.data.lead.overwrittenRevenues = {
                    overwritten_total_expenses: $scope.data.lead.overwrittenRevenues['overwritten_total_expenses'],
                    overwritten_total_fees: $scope.data.lead.overwrittenRevenues['overwritten_total_fees']
                }
            }

            //validations
            let requiredString = 'This field is required';
            let atLeastOneString = 'You need at least one item';

            $scope.errors = {};
            
            if ($rootScope.modeCF) {

            } else {
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
                    /*
                    if (!$scope.data.lead.phases[i].fte) {
                        $scope.errors.phasesFte[i] = requiredString;
                    }*/
                }

                if ($scope.data.lead.overwritten_revenue) {
                    if ( !$scope.data.lead.overwrittenRevenues.overwritten_total_fees ) {
                        $scope.data.lead.overwrittenRevenues.overwritten_total_fees = 0 ;
                    }
                    if (!$scope.data.lead.overwrittenRevenues.overwritten_total_expenses) {
                        $scope.data.lead.overwrittenRevenues.overwritten_total_expenses = 0 ;
                    }
                }
            }

            //both
            if ((!$scope.data.lead.number_of_competing_firms || $scope.data.lead.number_of_competing_firms == 0) &&  
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

            /*
            for (let i = 0; i < $scope.data.qualifications.length; i++) {
                for (let j = 0; j < $scope.data.qualifications[i].questions.length; j++) {
                    let index = mappedAnswers.indexOf($scope.data.qualifications[i].questions[j].id);
                    if (index === -1) {
                        $scope.errors.qualifications_answers[$scope.data.qualifications[i].questions[j].id] = requiredString;
                    }
                }
            }
            */

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

            let updateLead = function () {
                loadService.show();
                apiLeads.updateLead($stateParams.id, $scope.data.lead).then(function (res) {
                    if (res && res.status >= 200 && res.status < 300) {
                        $scope.data.accounts = res.data;
                        $ionicHistory.goBack();
                        loadService.hide();
                    } else {
                        throw new Error("Invalid response");
                        loadService.hide();
                    }
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
                                updateLead();
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
                                    //updateLead();
                                    var _this = this;
                                    var scope = $rootScope.$new();
                                    scope.lead = {
                                        name: $scope.data.lead.name,
                                        account: $scope.data.lead.account,
                                        partner: $scope.data.lead.partner
                                    };
                                    scope.reason = null;
                                    scope.stoppedReasons = [
                                        'Client does not see the need / not interested',
                                        'No budget',
                                        'Others',
                                    ];
                                    if ( $rootScope.modeCF ) {
                                        scope.lostWhoReasons = [
                                            'Lazard',
                                            'Evercore',
                                            'Rothschild',
                                            'Moelis',
                                            'PJT Partners',
                                            'Greenhill',
                                            'Jefferies',
                                            'GP Bullhound',
                                            'Armapartners',
                                            'Raine Group',
                                            'Drake Star',
                                            'Goldman Sachs',
                                            'JP Morgan',
                                            'Morgan Stanley',
                                            'Deutsche Bank',
                                            'Credit Suisse',
                                            'BoA-ML',
                                            'Citi',
                                            'UBS',
                                            'Others',
                                        ];
                                    } else {
                                        scope.lostWhoReasons = [
                                            'McKinsey',
                                            'BCG',
                                            'Bain',
                                            'Oliver Wyman',
                                            'ATKearney',
                                            'Strategy& (PwC)',
                                            'Roland Berger',
                                            'Accenture',
                                            'Deloitte / Monitor',
                                            'Others'
                                        ];
                                    }
                                   
                                    scope.othersReasons = '';

                                    // TODO: for now on stand by
                                    //scope.othersReasonsWho = '';

                                    scope.lostWhyReasons = [
                                        {checked: false, name: 'Scope of work / methodologies'},
                                        {checked: false, name: 'Prior experience and credentials'},
                                        {checked: false, name: 'Proposed team'},
                                        {checked: false, name: 'Pricing'},
                                        {checked: false, name: 'Brand'},
                                    ];
                                    scope.lost_lead_reasons = {
                                        psd: null,
                                        anf_why: null,
                                        anf_who: null,
                                    };
                                    scope.setReason = function (reason) {
                                        scope.reason = reason;
                                        scope.lost_lead_reasons = {
                                            psd: null,
                                            anf_why: null,
                                            anf_who: null,
                                        };
                                    };
                                    scope.setWhyReasons = function () {
                                        scope.lost_lead_reasons.anf_why = scope.lostWhyReasons
                                            .filter(lostWhyReason => lostWhyReason.checked)
                                            .map(lostWhyReason => lostWhyReason.name)
                                            .join(', ');
                                    };
                                    scope.setReasonDetail = function (reasonDetail) {
                                        scope.lost_lead_reasons.psd = reasonDetail;
                                    };
                                    scope.hideModalProjectLostReasons = function () {
                                        _this.modalProjectLostReasons.remove();
                                    };
                                    scope.setOthersReasons = function (ev) {
                                        scope.othersReasons = ev.othersReasons;
                                    };

                                    // TODO: for now on stand by
                                    /*
                                    scope.setOthersReasonsWho = function(ev) {
                                        scope.othersReasonsWho = ev.othersReasonsWho;
                                    };

                                    scope.setChangeWho = function(ev) {
                                       scope.othersReasonsWho = '';
                                    };
                                     */

                                    scope.finish = function () {
                                        scope.hideModalProjectLostReasons();
                                        if (!scope.lost_lead_reasons.psd) {
                                            let anf_who = scope.lost_lead_reasons.anf_who;
                                            if ( scope.lost_lead_reasons.anf_who === 'Others') {
                                                // TODO: for now on stand by
                                                //anf_who = scope.lost_lead_reasons.anf_who +':'+ scope.othersReasonsWho;
                                                anf_who = scope.lost_lead_reasons.anf_who;
                                            }

                                            scope.lost_lead_reasons = {
                                                anf_who: anf_who ,
                                                anf_why: scope.lost_lead_reasons.anf_why,
                                            }
                                        } else {
                                            if (scope.lost_lead_reasons.psd == 'Others' && scope.othersReasons) {
                                                scope.lost_lead_reasons.psd += ' - ' + scope.othersReasons;
                                            }
                                            scope.lost_lead_reasons = {psd: scope.lost_lead_reasons.psd};
                                        }
                                        $scope.data.lead.lost_lead_reasons = scope.lost_lead_reasons;
                                        updateLead();
                                    };

                                    $ionicModal.fromTemplateUrl('app/leads/modals/project-lost-reasons.html', {
                                        scope: scope,
                                        animation: 'slide-in-up'
                                    }).then(function (modal) {

                                        _this.modalProjectLostReasons = modal;
                                        _this.modalProjectLostReasons.show();
                                    });
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
                    $scope.data.lost_lead_reasons = {
                        psd: null,
                        anf_why: null,
                        anf_who: null,
                    };
                    updateLead();
                }
            }
        };

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        $scope.successFee = 0;
        
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
            callback: function (val) {  //Mandatory
                $scope.data.lead.successFees.expected_date = moment(val).local().unix();//moment(val).format('D') + ' ' + monthNames[moment(val).format('M')-1] + ' ' + moment(val).format('YY');
            },
            //from: new Date(2012, 1, 1), //Optional
            //to: new Date(2016, 10, 30), //Optional
            showTodayButton: true,
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            /*   disableWeekdays: [0],      */ //Optional
            //from: new Date(),
            closeOnSelect: false,       //Optional
            templateType: 'popup'       //Optional
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

        $scope.openDatePicker = function (id) {
            if (id == 'startDate') {
                ipObj1.inputDate = new Date($scope.data.lead.start_date * 1000);
                ionicDatePicker.openDatePicker(ipObj1);
            } else if (id == 'closureDate') {
                if ($scope.data.lead.successFees.expected_date) {
                    ipObj2.inputDate = new Date($scope.data.lead.successFees.expected_date * 1000);
                } else {
                }
                ionicDatePicker.openDatePicker(ipObj2);
            }
        };

        $scope.updateTotalTheoretical = function () {
            apiSettings.getTheoreticalRevenue($scope.data.lead.phases, $scope.data.lead.theoreticalRevenues.expenses_percentage, $scope.data.lead.theoreticalRevenues.fte_fees).then(function (res) {
                $scope.data.lead.theoreticalRevenues.amount = res.data.amount;
            }).catch(function (err) {
            });
            $ionicScrollDelegate.resize();
        }

        $scope.setSuccessFeeProbability = function () {
            $scope.data.lead.successFees.probability = $rootScope.getValueFromIndex($rootScope.currentDot[1]);
        }

        $scope.toggleOverwriteRevenue = function (overwriteRevenue) {
            //if (overwriteRevenue) msgService.showMessage("Once you check this option, you won't be able to uncheck it.", "Alert");
            $scope.data.lead.overwrittenRevenues.overwritten_total_fees = 0 ;
            $scope.data.lead.overwrittenRevenues.overwritten_total_expenses = 0 ;
    
            $scope.overwriteRevenue = overwriteRevenue;
            $ionicScrollDelegate.resize();
        }

        $scope.updateProbability = function () {
            $scope.data.lead.probability = $rootScope.getValueFromIndex($rootScope.currentDot[0]);
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
            $scope.enableSuccessFeeStatus = enableSuccessFee;

            $ionicScrollDelegate.resize();
        }

    }]);
