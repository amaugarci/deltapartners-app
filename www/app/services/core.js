'use strict';

(function (app) {

    function authInterceptor(API, auth, $rootScope, $q, $injector) {
        return {
            // automatically attach Authorization header
            request: function (config) {
                var token = auth.getToken();

                if (config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            // If a token was sent back, save it
            response: function (res) {
                if (res && res.config && res.config.url.indexOf(API) === 0 && res.data && res.data.auth_token) {
                    var _data = {
                        cf: typeof res.data.cf != 'undefined' ? (res.data.cf ? 1 : 0) : 0,
                        mc: typeof res.data.mc != 'undefined' ? (res.data.mc ? 1 : 0) : 0
                    };
                    auth.saveToken(res.data.auth_token, res.data.refresh_token, _data);
                }

                if (res.config.url.indexOf(API) === 0 && !res.data.auth_token) {
                    const refresh_token = window.localStorage.getItem('refresh_token');
                    if(typeof refresh_token !== 'undefined') {
                        checkToken(API);
                    }
                }

                return res;
            },

            responseError: function (response) {
                if (response.status == 401 || response.status == 400 || response.status == 404) {
                    auth.logout();
                    var $state = $injector.get("$state");
                    $state.go('login');
                    var $ionicHistory = $injector.get("$ionicHistory");
                    $ionicHistory.clearCache();
                    $rootScope.$broadcast('authorization.error');

                }

                return $q.reject(response);
            }
        }
    }

    function updateTokenOnAPI(API, refresh_token, authorization) {
        const url = API + '/api/sessions/refresh?refresh_token=' + refresh_token;
        return fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': authorization
            }
          }).then(res => res.json())
          .then((response) => {
            const token = response.auth_token;
            const refresh_token = response.refresh_token;
            if(typeof refresh_token !== 'undefined') {
                window.localStorage.setItem('jwtToken',token);
                window.localStorage.setItem('refresh_token', refresh_token);
            }
            return response;
        });
    }
      
    async function checkToken(API) {
        const authorization = window.localStorage.getItem('jwtToken');
        const refresh_token = window.localStorage.getItem('refresh_token');
        return await updateTokenOnAPI(API, refresh_token, authorization);
    }

    function authService($window) {
        var self = this;
        // Add JWT methods here
        self.parseJwt = function (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            var user = JSON.parse($window.atob(base64));
            user.cf = $window.localStorage['cf'];
            user.mc = $window.localStorage['mc'];
            return user;
        };

        self.saveToken = function (token, refresh_token, extra) {
            $window.localStorage['jwtToken'] = token;
            $window.localStorage['mc'] = extra.mc;
            $window.localStorage['cf'] = extra.cf;
            $window.localStorage['refresh_token'] = refresh_token;
            var params = self.parseJwt(token);
        };

        self.getToken = function () {
            return $window.localStorage['jwtToken'];
        };

        self.isAuthed = function () {
            var token = self.getToken();
            if (token) {
                var params = self.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };

        self.logout = function () {
            $window.localStorage.removeItem('jwtToken');
            $window.localStorage.removeItem('mc');
            $window.localStorage.removeItem('cf');
            $window.localStorage.removeItem('refresh_token');
        };
    }

    function userService($http, API, auth) {
        var self = this;
        // add authentication methods here
        self.register = function (email, password) {
            return $http.post(API + '/auth/accounts', {
                email: email,
                password: password,
                lang: _lang()
            })
        };

        self.tokenize = function () {
            if (auth.isAuthed()) {
                return $http.put(API + '/api/sessions/tokenize', {
                    fcm_token: localStorage.fcm_token,
                    token: localStorage.jwtToken
                });
            }
        };

        self.login = function (email, password) {
            return $http.post(API + '/auth/sessions', {
                email: email,
                password: password,
                lang: _lang()
            })
        };

        self.facebookLogin = function (facebookToken) {
            return $http.put(API + '/auth/sessions', {
                token: facebookToken,
                lang: _lang()
            });
        };

        self.facebookRegister = function (facebookToken) {
            return $http.put(API + '/auth/accounts', {
                token: facebookToken,
                lang: _lang()
            });
        };

        self.facebookLink = function (facebookToken) {
            return $http.put(API + '/users/facebook', {
                token: facebookToken
            });
        };

        self.requestPasswordCode = function (email) {
            return $http.put(API + '/auth/recovery', {
                email: email,
                lang: _lang()
            })
        };

        self.requestPasswordRecovery = function (password, password_confirm, code) {
            return $http.post(API + '/auth/recovery', {
                password: password,
                password_confirmation: password_confirm,
                code: code
            })
        };

    }

    app
        .factory('authInterceptor', ['API', 'auth', '$rootScope', '$q', '$injector', authInterceptor])
        .service('user', ['$http', 'API', 'auth', userService])
        .service('auth', ['$window', authService])

        // Mock server using Apiary
        //.constant('API', 'https://private-c82de4-deltapartners.apiary-mock.com')

        // Local environment
        //.constant('API', 'http://locahost:8080')

        // Development server (nowadays used by the client as production)
        .constant('API', 'https://api-dev.pipeline.deltapartnersgroup.com')

        // Production server (pending migration; operational but with dummy data)
        // .constant('API', 'https://api.pipeline.deltapartnersgroup.com')

        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })

})(app);
