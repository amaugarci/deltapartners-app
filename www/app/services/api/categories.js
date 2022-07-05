'use strict';

(function(app) {
  app.factory('apiCategories', ['$http', 'API', fnCategories]);

  function fnCategories($http, API) {
    var self = this;

     self.getCategories = function() {
        return $http.get(API + '/api/leads_cf_categories');
    };

    return self;
  }
})(app);
