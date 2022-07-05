'use strict';

(function (app) {
    app.factory('apiReports', ['$http', '$rootScope', 'API', fnReports]);

    function fnReports($http, $rootScope, API) {
        var self = this;

        self.getReports = function (locationId) {
            if (!locationId || locationId == 'compended') {
                if ($rootScope.modeCF) {
                    return $http.get(API + '/api/monthly_revenues_cf')
                } else {
                    return $http.get(API + '/api/monthly_revenues')
                }
            } else {
                if ($rootScope.modeCF) {
                    return $http.get(API + '/api/monthly_revenues_cf?leads_cf_category_id=' + locationId);
                } else {
                    return $http.get(API + '/api/monthly_revenues?leads_consulting_location_id=' + locationId);
                }
            }


        };

        self.getReport = function (id) { // NOT USED
            return $http.get(API + '/api/reporting/' + id);
        };

        return self;
    }
})(app);
