'use strict';

(function(app) {
  app.factory('apiLogs', ['$http', 'API', '$rootScope', fnLogs]);

  function fnLogs($http, API, $rootScope) {
    var self = this;

    self.getLogs = function(limit, page) {
        var leads_type = $rootScope.modeCF ? 'corporate-finance' : 'consulting';
        return $http.get(API + '/api/logs?limit=' + limit + '&page=' + page + '&leads_type=' + leads_type);
    };

    return self;
  }
})(app);
