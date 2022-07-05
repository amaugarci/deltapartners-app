'use strict';

(function (app) {
    app.factory('apiQualification', ['$http', '$rootScope', 'API', fnQualification]);

    function fnQualification($http, $rootScope, API) {
        var self = this;

        self.getQualification = function () {
            // Get current App section (menu checkbox)
            var leadType = $rootScope.modeCF ? 'CF' : 'Consulting';
            var endpoint = API + '/api/qualification_matrix?type=' + leadType;

            return $http.get(endpoint);
        };

        return self;
    }
})(app);
