
'use strict';

(function(app) {
  app.service('utils', ['$rootScope', _fnUtils]);

  function _fnUtils($rootScope) {
    var self = this;

    self.getTotalTheoretical = function(phases, feesFte, expenses) {
          var res = 0;
          for (var i = 0; i < phases.length; ++i) {
              res+=(phases[i].weeks*phases[i].fte*feesFte*(52/12));
          }
          res*=(1+(expenses/100));
          return res.toFixed(2);

    };
  }
})(app);
