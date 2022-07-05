'use strict';

(function(app) {
  app.factory('apiAccountMembers', ['$http', 'API', fnAccountMembers]);

  function fnAccountMembers($http, API) {
    var self = this;

    self.getAccountMembers = function(limit, page, orderBy) {
        return $http.get(API + '/api/accounts/members?limit=' + limit + '&page=' + page + '&order_by=' + orderBy)
    };
    return self;
  }
})(app);
