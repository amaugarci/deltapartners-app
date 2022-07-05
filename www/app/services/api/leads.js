'use strict';


(function (app) {
    app.factory('apiLeads', ['$http', 'API', '$rootScope', fnLeads]);

    function fnLeads($http, API, $rootScope) {
        var self = this;

        self.getLeads = function (limit, page, orderBy, showLast) {
            if ($rootScope.modeCF) {
                return $http.get(API + '/api/leads_cf?limit=' + limit + '&page=' + page + '&order_by=' + orderBy + '&next_months=' + showLast);
            } else {
                return $http.get(API + '/api/leads_consulting?limit=' + limit + '&page=' + page + '&order_by=' + orderBy + '&next_months=' + showLast);
            }
        };

        self.getLead = function (id) {
            if ($rootScope.modeCF) {
                return $http.get(API + '/api/leads_cf/' + id);
            } else {
                return $http.get(API + '/api/leads_consulting/' + id);
            }
        };

        self.createLead = function (lead) {
            if ($rootScope.modeCF) {
                return $http.post(API + '/api/leads_cf', lead);
            } else {
                return $http.post(API + '/api/leads_consulting', lead);
            }
        };


        self.updateLead = function (id, lead) {
            if ($rootScope.modeCF) {
                return $http.put(API + '/api/leads_cf/' + id, lead);
            } else {
                return $http.put(API + '/api/leads_consulting/' + id, lead);
            }


        };

        return self;
    }
})(app);
