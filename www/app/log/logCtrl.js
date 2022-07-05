angular.module('starter').controller('logCtrl', [
    '$scope',
    '$state',
    'apiLogs',
    'loadService',
    '$ionicScrollDelegate',
    '$filter',
    '$rootScope',
    '$ionicModal', function ($scope, $state, apiLogs, loadService, $ionicScrollDelegate, $filter, $rootScope, $ionicModal) {

        $scope.data = {
            page: 1,
            limit: 5,
            noMoreData: false,
            messages: []
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $ionicScrollDelegate.scrollTop(true);
            $scope.data.messages = [];
            $scope.loading = false;
            $scope.data.noMoreData = true;
            $scope.loadData(true);
        });

        $scope.showModalMessageDetails = function (message) {
            var _this = this;
            var scope = $rootScope.$new();

            scope.message = message;
            scope.hideModalMessageDetails = function () {
                _this.modalMessageDetails.remove();
            };

            $ionicModal.fromTemplateUrl('app/log/modals/message-details.html', {
                scope: scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                _this.modalMessageDetails = modal;
                _this.modalMessageDetails.show();
            });
        };

        $scope.maxLength = 120;
        $scope.loadData = function (refresh) {
            if ($scope.loading) return;
            $scope.loading = true;
            loadService.show();

            if (refresh || $scope.data.messages.length == 0) {
                $scope.data.messages = [];
                $scope.data.page = 1;
            }
            apiLogs.getLogs($scope.data.limit, $scope.data.page).then(function (res) {
                var tmpData = [];

                for (var i = 0; res.data[String(i)]; ++i) {
                    var tmpMessage = res.data[String(i)].event.message;
                    var collapsable = res.data[String(i)].event.collapsable;
                    var messageLength = tmpMessage.length;
                    var bandNewValue = false;
                    var tmpMessageOriginal = "";

                    if (!res.data[String(i)].icon) res.data[String(i)].icon = 'ion-edit';

                    while (tmpMessage.indexOf('{') != -1) {
                        var tmpVariable = tmpMessage.substring(tmpMessage.indexOf('{'), tmpMessage.indexOf('}') + 1);
                        var newValue = res.data[String(i)].event[tmpVariable.substring(1, tmpVariable.length - 1)];

                        if (tmpVariable == "{partner}") {
                            var toReplace = '<a class="color-darkblue">' + newValue + '</a>';
                            tmpMessage = tmpMessage.replace(tmpVariable, toReplace);
                            messageLength -= tmpVariable.length;
                            messageLength += newValue.length;
                        } else if (tmpVariable == "{lead_name}") {
                            var toReplace = '<a class="color-darkblue text-bold"><strong>' + newValue + '</strong></a>';
                            tmpMessage = tmpMessage.replace(tmpVariable, toReplace);
                            messageLength -= tmpVariable.length;
                            messageLength += newValue.length;
                        } else if (res.data[String(i)].event.is_date && (tmpVariable == "{previous_value}" || tmpVariable == "{new_value}")) { //is a timestamp
                            var toReplace = '<a class="color-black text-bold">' + moment(newValue * 1000).format("DD MMM 'YY") + '</a>';
                            tmpMessage = tmpMessage.replace(tmpVariable, toReplace);
                            messageLength -= tmpVariable.length;
                            messageLength += moment(newValue * 1000).format("DD MMM 'YY").length;
                        } else if (res.data[String(i)].event.format_as_money && (tmpVariable == "{previous_value}" || tmpVariable == "{new_value}")) {  //its money
                            var toReplace = '<a class="color-black text-bold">' + $filter('currency')(newValue, '$', 0) + '</a>';
                            tmpMessage = tmpMessage.replace(tmpVariable, toReplace);
                            messageLength -= tmpVariable.length;
                            messageLength += $filter('currency')(newValue, '$', 0).length;
                            //Aqui se verifica sobre el new_value que contiene el message
                        } else if (tmpVariable == "{previous_value}" || tmpVariable == "{new_value}") {  //is not a timestamp nor money
                            tmpMessageOriginal = tmpMessage.replace(tmpVariable, '<a class="color-black text-bold">' + newValue + '</a>');
                            tmpMessageOriginal = tmpMessage.replace(tmpVariable, '<a class="color-black text-bold">' + newValue + '</a>');
                            tmpMessageNewValue = newValue;

                            if (collapsable) {
                                tmpMessage = tmpMessage.replace(': "{new_value}"', '');
                                messageLength -= tmpVariable.length;
                                messageLength += newValue.length;
                            } else {
                                tmpMessage = tmpMessage.replace(tmpVariable, '<a class="color-black text-bold">' + newValue + '</a>');
                                messageLength -= tmpVariable.length;
                                messageLength += newValue.length;
                            }
                        } else {
                            tmpMessage = tmpMessage.replace(tmpVariable, '<a class="color-darkblue text-bold">' + newValue + '</a>');
                            messageLength -= tmpVariable.length;
                            messageLength += newValue.length;
                        }
                    }

                    res.data[String(i)].event.messageHtml = tmpMessage;
                    res.data[String(i)].event.messageHtmlOriginal = tmpMessageOriginal;
                    res.data[String(i)].event.messageDotted = collapsable ? res.data[String(i)].event.new_value.substr(0, $scope.maxLength) + '...' : res.data[String(i)].event.new_value;
                    tmpData.push(res.data[String(i)]);
                }

                $scope.data.messages = $scope.data.messages.concat(tmpData);

                if (Object.keys(res.data).length == 1) {
                    $scope.data.noMoreData = true;
                }
                else {
                    $scope.data.noMoreData = false;
                }

                //BORRAR ABAJO
                //$scope.data.noMoreData = true;
                loadService.hide();
                $scope.data.page += 1;
                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }).catch(function (err) {
            });
        };
        $scope.showViewMessage = function (message) {
            var _message = message.event.message.replace('{partner}', '<a class="color-darkblue">' + message.event.partner + '</a>')
                .replace('{lead_name}', '<a class="color-darkblue text-bold">' + message.event.lead_name + '</a>')
                .replace(': "{new_value}"', '');
            var _data = {
                messageHtml: _message,
                newValue: message.event.new_value,
                icon: message.icon,
                time: message.timestamp
            };
            $state.go('tab.log-view', _data);
        }

        $scope.editLead = function (id) {
            $state.go('tab.edit-lead', {id: id});
        }
    }]);
