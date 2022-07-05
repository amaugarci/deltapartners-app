var app = angular.module('percentCircleDemo', ['percentCircle-directive']);

app.controller('mainController', ['$scope', function($scope) {
	$scope.percent = 0;

	$scope.changePercent = function(newPercent) {
		$scope.percent = newPercent;
	}
}]);