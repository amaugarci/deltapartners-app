'use strict';

(function(app) {
  app.factory('apiLogin', ['$http', 'API', login]);

  function login($http, API) {
    var self = this;


    self.login = function(user, password, deviceToken) {
        return $http.post(API + "/api/sessions", {
          email: user,
          password: password,
          token_id: deviceToken
        });
    };

    self.hashLogin = function() {
      var hashLogin = localStorage.hashLogin;

      return $http.post(API + "/api/sessions", {
          hash_login: hashLogin,
      });
    };

    return self;
  }
})(app);
