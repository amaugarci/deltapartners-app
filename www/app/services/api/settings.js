'use strict';

(function(app) {
  app.factory('apiSettings', ['$http', 'API', fnSettings]);

  function fnSettings($http, API) {
    var self = this;


    self.getRevenue = function() {
        return $http.get(API + '/api/revenue_settings');
    };

    self.getTheoreticalRevenue = function(phases, expensesPercentage, fteFees) {
        return $http.post(API + '/api/theoretical_revenues', {phases:phases, expenses_percentage: expensesPercentage, fte_fees: fteFees});
    }

    return self;
  }
})(app);
