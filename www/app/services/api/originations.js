'use strict';

(function (app) {
    app.factory('apiOriginations', ['$http', '$rootScope', 'API', fnOriginations]);

    function fnOriginations($http, $rootScope, API) {
        var self = this;

        self.getOriginations = function () {
            var endpoint = API + '/api/miscellaneous/originations';

            return $http.get(endpoint);
        };

        return self;
    }
})(app);
