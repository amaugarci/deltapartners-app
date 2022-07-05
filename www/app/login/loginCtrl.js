angular.module("starter").controller("loginCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "apiLogin",
  "auth",
  "user",
  "loadService",
  "msgService",
  "profile",
  function (
    $scope,
    $rootScope,
    $state,
    apiLogin,
    auth,
    user,
    loadService,
    msgService,
    profile
  ) {
    $scope.logIn = function () {
      $state.go("tab.leads");
    };

    $scope.auth = {
      email: "",
      password: "",
      loginError: false,
      loginErrorMsg: "",
      hashLogin: function () {
        loadService.show();
        apiLogin
          .hashLogin()
          .then(function (resp) {
            if (resp.status == 200 || resp.status == 201) {
              return profile.load();
            } else {
              throw resp.statusText;
            }
          })
          .then(function (resp) {
            loadService.hide();
            user.tokenize();
            $state.go("tab.leads");
          })
          .catch(function (err) {
            $scope.auth.loginError = true;
            if (err.data && err.data.reason) {
              if (err.data.reason === "Invalid request data provided") {
                $scope.auth.loginErrorMsg = "The credentials are invalid";
                msgService.showMessage(
                  "The credentials are invalid",
                  "Login error"
                );
              } else if (err.data.reason === "Invalid credentials") {
                $scope.auth.loginErrorMsg = "The password is invalid";
                msgService.showMessage(
                  "The password is invalid",
                  "Login error"
                );
              } else if (err.data.reason === "User account canceled") {
                $scope.auth.loginErrorMsg = "User account canceled";
                msgService.showMessage("User account canceled", "Login error");
              } else {
                $scope.auth.loginErrorMsg = err.data.reason;
                msgService.showMessage(err.data.reason, "Login error");
              }
            } else {
              $scope.auth.loginErrorMsg = "Error";
              msgService.showMessage("Error", "Login error");
            }
            loadService.hide();
            //$log.debug(err);
          });
      },
      login: function () {
        var self = this;
        if ($scope.auth.email != "" && $scope.auth.password != "") {
          loadService.show();
          var tmpEmail = $scope.auth.email;
          if (tmpEmail.indexOf("@") == -1)
            tmpEmail = tmpEmail += "@deltapartnersgroup.com";
          apiLogin
            .login(tmpEmail, $scope.auth.password, $rootScope.deviceToken)
            .then(function (resp) {
              if (resp.status == 200 || resp.status == 201) {
                return profile.load();
              } else {
                throw resp.statusText;
              }
            })
            .then(function (resp) {
              //profile.set(resp.data);
              //miscSvc.countries();
              //$googleFirebase.login();
              loadService.hide();
              user.tokenize();
              $scope.auth.email = "";
              $scope.auth.password = "";
              $scope.auth.loginError = false;
              $scope.auth.loginErrorMsg = "";
              $state.go("tab.leads");
            })
            .catch(function (err) {
              $scope.auth.loginError = true;
              if (err.data && err.data.reason) {
                if (err.data.reason === "Invalid request data provided") {
                  $scope.auth.loginErrorMsg = "The credentials are invalid";
                  msgService.showMessage(
                    "The credentials are invalid",
                    "Login error"
                  );
                } else if (err.data.reason === "Invalid credentials") {
                  $scope.auth.loginErrorMsg = "The password is invalid";
                  msgService.showMessage(
                    "The password is invalid",
                    "Login error"
                  );
                } else if (err.data.reason === "User account canceled") {
                  $scope.auth.loginErrorMsg = "User account canceled";
                  msgService.showMessage(
                    "User account canceled",
                    "Login error"
                  );
                } else {
                  $scope.auth.loginErrorMsg = err.data.reason;
                  msgService.showMessage(err.data.reason, "Login error");
                }
              } else {
                $scope.auth.loginErrorMsg = "Error";
                msgService.showMessage("Error", "Login error");
              }
              loadService.hide();
              //$log.debug(err);
            });
        }
      },
    };

    $scope.$on("$ionicView.loaded", function () {
      if (auth.isAuthed()) {
        profile
          .load()
          .then(function (resp) {
            //loadService.hide();
            if (resp.data.is_active) {
              profile.set(resp.data);
              $state.go("tab.leads");
            }
          })
          .catch(function (err) {
          });
      } else {
      }
    });
  },
]);
