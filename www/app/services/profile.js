/**
 * Created by elmer on 27/05/16.
 */
'use strict';

(function(app) {
  app.service('profile', ['$rootScope', 'auth', '$http', 'API', _fnProfile]);

  function _fnProfile($rootScope, auth, $http, API) {
    var self = this, profile, passport, facebookSync;

    self.getCurrentUserId = function() {
      try {
        return Number(auth.parseJwt(auth.getToken()).sub);
      } catch(e) {
        return 0;
      }
    };

    self.load = function(id) {
      if(!id) {
        id = auth.parseJwt(auth.getToken()).sub;
      }
      //return $http.get(API + '/users/' + id);
    };

    self.get = function() {
      var _profile = { profile : profile, passport : passport, facebookSync : facebookSync };
      try {
        if(_profile.profile && _profile.profile.birthday && ( Object.prototype.toString.call(_profile.profile.birthday) !== "[object Date]" )) {
          _profile.profile.birthday = moment.unix(Number(_profile.profile.birthday)).toDate();
        }
      } catch(err) {}
      return _profile;
    };

    self.set = function(data) {
      profile = angular.merge({}, data.info, data.preferences);
      passport = data.passport;
      facebookSync = data && data.facebook && data.facebook.sync;
    };

    self.setProfile = function(_profile) {
      profile = angular.merge({}, profile, _profile);
    };

    self.destroy = function() {
      profile = null;
    };

    self.delete = function() {
      var user = auth.parseJwt(auth.getToken());
      return $http.delete(API + '/users/'+user.sub);
    };

    self.update = function(data, dataToSet) {
      var user = auth.parseJwt(auth.getToken());
      if(!data) {
        data = profile;
      }
      self.setProfile(dataToSet);
      return $http({
        method : 'PUT',
        data : data,
        url : API + '/users/' + user.sub,
        headers : {
          "Content-Type": "application/json"
        }
      });
    };

    self.deleteAccount = function() {
      var user = auth.parseJwt(auth.getToken());
      return $http.delete(API + '/users/' + user.sub);
    };

    self.notifications = function() {
      var user = auth.parseJwt(auth.getToken());
      return $http.get(API + '/notifications/exploration?user=' + user.sub);
    };

    self.followings = function(userId) {
      if(!userId) {
        var user = auth.parseJwt(auth.getToken());
        userId = user.sub;
      }
      return $http.get(API + '/users/' + userId + '/followings');
    };

    self.followUser = function(userId, userToFollowId) {
      if(!userId) {
        var user = auth.parseJwt(auth.getToken());
        userId = user.sub;
      }
      if(userToFollowId) {
        return $http.post(API + '/users/' + userToFollowId + '/followings', {userID : userToFollowId});
      }
      throw new Error("You must provide the user to follow")
    };

    self.unfollowUser = function(userId, userToUnfollowId) {
      if(!userId) {
        var user = auth.parseJwt(auth.getToken());
        userId = user.sub;
      }
      if(userToUnfollowId) {
        return $http.delete(API + '/users/' + userToUnfollowId + '/unfollow');
      }
      throw new Error("You must provide the user to unfollow")
    };

    self.followers = function(userId) {
      if(!userId) {
        var user = auth.parseJwt(auth.getToken());
        userId = user.sub;
      }
      return $http.get(API + '/users/' + userId + '/followers');
    };

    self.searchUsers = function(data) {
      var allowedFields = ['q','gender','picture','level','orderBy'], i, url = '/users?';
      if(data && Object.size(data) > 0 ) {
        for(i in allowedFields) {
          if(data.hasOwnProperty(allowedFields[i])) {
            url += allowedFields[i] + '=' + data[allowedFields[i]] +',';
          }
        }
        if(url.length > 7) {
          url = url.substr(0, url.length - 1);
        }
      }
      return $http.get(API + url);
    };

    self.uploadAvatar = function(img) {
      var user = auth.parseJwt(auth.getToken());
      if(img) {
        return $http.post(API + '/users/' + user.sub + '/avatars', {image : img});
      }
      return false;
    };

    self.passport = function(_user) {
      if(!_user) {
        _user = auth.parseJwt(auth.getToken()).sub;
      }
      if(_user) {
        return $http.get(API + '/users/' + _user + '/passport');
      }
      return false;
    };

    self.passport_experiences = function(_user, page, limit) {
      if(!page) {
        page = 1;
      }
      if(!limit) {
        limit = 15;
      }
      if(!_user) {
        _user = auth.parseJwt(auth.getToken()).sub;
      }
      if(_user) {
        return $http.get(API + '/users/' + _user + '/passport_experiences?page=' + page + '&limit=' + limit);
      }
      return false;
    };

    self.passport_follows = function(_user) {
      if(!_user) {
        _user = auth.parseJwt(auth.getToken()).sub;
      }
      if(_user) {
        return $http.get(API + '/users/' + _user + '/passport_follows');
      }
      return false;
    };

    self.wishlist = function(_user, page, limit) {
      if(!page) {
        page = 1;
      }
      if(!limit) {
        limit = 15;
      }
      if(!_user) {
        _user = auth.parseJwt(auth.getToken()).sub;
      }
      if(_user) {
        return $http.get(API + '/users/' + _user + '/wishlist?page=' + page + '&limit=' + limit);
      }
      return false;
    };

    self.explored = function(_user, page, limit) {
      if(!page) {
        page = 1;
      }
      if(!limit) {
        limit = 15;
      }
      if(!_user) {
        _user = auth.parseJwt(auth.getToken()).sub;
      }
      if(_user) {
        return $http.get(API + '/users/' + _user + '/explored?page=' + page + '&limit=' + limit);
      }
      return false;
    };

    self.getUnansweredBeachPreference = function(id) {
      if(!id) {
        id = auth.parseJwt(auth.getToken()).sub;
      }
      return $http.get(API + '/users/' + id + '/unanswered_beach_preference?lang=' + _lang());
    };

    self.saveUnansweredBeachPreference = function(id, value, userId) {
      if(!userId) {
        userId = auth.parseJwt(auth.getToken()).sub;
      }
      return $http.put(API + '/users/' + userId + '/beach_preferences', {beach_preference_id : id, value : value});
    };
  }
})(app);
