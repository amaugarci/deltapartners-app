'use strict';

(function(app) {
  app.factory('apiAccounts', ['$http', 'API', fnAccounts]);

  function fnAccounts($http, API) {
    var self = this;


    self.getAccounts = function() {
        return $http.get(API + '/api/accounts');
    };

    self.getAccount = function(id) {
        return $http.get(API + '/api/accounts/' + id);
    };

    self.createAccount = function(name) {
        return $http.post(API + '/api/accounts', {name: name});
    };

    self.updateAccount = function(id, name) {
        return $http.put(API + '/api/accounts/' + id, {name: name});
    };

    self.getPerformance = function(id) {
        return $http.get(API + '/api/accounts/' + id + '/performance');
    }

    self.getPipelines = function(id, orderBy, months) {
        return $http.get(API + '/api/accounts/' + id + '/pipeline?order_by=' + orderBy + '&next_months=' + months);
    }

    self.getMessages = function(id, limit, page) {
        return $http.get(API + '/api/accounts/' + id + '/messages_board?limit=' + limit + '&page=' + page);
    } 

    self.createMessage = function(id, message) {
        return $http.post(API + '/api/accounts/' + id + '/messages_board', {message:message});
    }

    self.getMembers = function(id, limit, page, orderBy) {
        return $http.get(API + '/api/accounts/' + id + '/members?limit=' + limit + '&page=' + page + '&order_by=' + orderBy);
    }

    self.getSubAccounts = function(id) {
        return $http.get(API + '/api/subaccounts?parent_account_id=' + id);
    };

    self.getSubAccount = function(id) {
        return $http.get(API + '/api/sub_accounts/' + id);
    }; 

    self.createSubAccount = function(id) {
        return $http.post(API + '/api/subaccounts', {sub_account_id: id});
    }; 

    return self;
  }
})(app);
