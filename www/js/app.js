// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js


var app = angular.module('starter', ['ionic', 'chart.js', 'ionic-datepicker', 'angularMoment', 'ngCordova'])
    .run(function ($ionicPlatform, $timeout, $rootScope, user) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                //StatusBar.styleDefault();
                StatusBar.styleLightContent();
            }

            // Start of notifications
            if (window.cordova) {
                setTimeout(getTheToken, 1000);

                function getTheToken() {
                    FCMPlugin.getToken(
                        function (token) {
                            if (token == null) {
                                setTimeout(getTheToken, 1000);
                            } else {
                                localStorage.fcm_token = token;
                                user.tokenize();
                            }
                        },
                        function (err) {
                        }
                    );
                }
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.views.maxCache(7);

            $httpProvider.interceptors.push('authInterceptor');
            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");
                $state.go("login");
            });

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js


            $stateProvider
            // setup an abstract state for the tabs directive
                .state('tab', {
                    url: '/tab',
                    abstract: true,
                    templateUrl: 'app/menu/menu.html',
                    controller: 'menuCtrl'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/login/login.html',
                    controller: 'loginCtrl'

                })

                // Each tab has its own nav history stack:
                /*
                      .state('tab.dashboard', {
                        url: '/dashboard',
                        views: {
                          'tab-dashboard': {
                            templateUrl: 'app/dashboard/dashboard.html',
                            controller: 'dashboardCtrl'
                          }
                        }
                      })
                */
                .state('tab.leads', {
                    url: '/leads',
                    views: {
                        'tab-leads': {
                            templateUrl: 'app/leads/leads.html',
                            controller: 'leadsCtrl'
                        }
                    }
                })

                .state('tab.lead-details', {
                    url: '/leadDetails/:id',
                    views: {
                        'tab-leads': {
                            templateUrl: 'app/leads/details/lead-details.html',
                            controller: 'leadDetailsCtrl'
                        }
                    }
                })

                .state('tab.edit-lead', {
                    url: '/editLead/:id',
                    views: {
                        'tab-leads': {
                            templateUrl: 'app/leads/edit/editLead.html',
                            controller: 'editLeadCtrl'
                        }
                    }
                })

                .state('tab.create-lead', {
                    url: '/createLead/:id',
                    views: {
                        'tab-leads': {
                            templateUrl: 'app/leads/create/createLead.html',
                            controller: 'createLeadCtrl'
                        }
                    }
                })


                .state('tab.accounts', {
                    url: '/accounts',
                    views: {
                        'tab-accounts': {
                            templateUrl: 'app/accounts/accounts.html',
                            controller: 'accountsCtrl'
                        }
                    }
                })

                .state('tab.accounts-members', {
                    url: '/accountsMembers',
                    views: {
                        'tab-accounts-members': {
                            templateUrl: 'app/accountsMembers/accounts-members.html',
                            controller: 'accountsMembersCtrl'
                        }
                    }
                })

                .state('tab.edit-lead-accounts', {
                    url: '/editLeadAccounts/:id/:accesible',
                    views: {
                        'tab-accounts': {
                            templateUrl: 'app/leads/edit/editLead.html',
                            controller: 'editLeadCtrl'
                        }
                    }
                })


                .state('tab.log', {
                    url: '/log',
                    views: {
                        'tab-log': {
                            templateUrl: 'app/log/log.html',
                            controller: 'logCtrl'
                        }
                    }
                })

                .state('tab.log-view', {
                    url: '/log/view/:icon/:time/:messageHtml/:newValue',
                    views: {
                        'tab-log': {
                            templateUrl: 'app/log/view/logView.html',
                            controller: 'logViewCtrl'
                        }
                    }
                })
                /* .state('tab.chat-detail', {
                   url: '/chats/:chatId',
                   views: {
                     'tab-chats': {
                       templateUrl: 'templates/chat-detail.html',
                       controller: 'ChatDetailCtrl'
                     }
                   }
                 }) */

                .state('tab.reporting', {
                    url: '/reporting',
                    views: {
                        'tab-reporting': {
                            templateUrl: 'app/reporting/reporting.html',
                            controller: 'reportingCtrl'
                        }
                    }
                })

                .state('tab.reporting-month', {
                    url: '/reporting-month/:id',
                    views: {
                        'tab-reporting': {
                            templateUrl: 'app/reporting/month/reporting-month.html',
                            controller: 'reportingMonthCtrl'
                        }
                    }
                })

                .state('tab.accounts-performance', {

                    url: '/accounts-performance/:id',
                    cache: false,
                    views: {
                        'tab-accounts': {
                            templateUrl: 'app/accounts/performance/performance.html',
                            controller: 'performanceCtrl'
                        }
                    }
                });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/tab/leads');
        }
    );
