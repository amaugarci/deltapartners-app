(function() {
	var pcApp = angular.module('percentCircle-directive', []);

	pcApp.directive('percentCircle', function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			template: 	'<div class="pc-container">' +
							'<div class="pc-border" ng-style="highlight">' + 
								'<div class="pc-circle">' + 
									'<span class="pc-percent">{{curPercent}}%</span>' +
								'</div>' +
							'</div>' +
						'</div>',
			scope: {
				percent : '=',
				colors  : '=?',
				speed   : '=?'
			},
			link: function($scope, element, attrs) {
				if($scope.speed == undefined) $scope.speed = 10;
				$scope.curPercent = 0;
				$scope.highlight;
				var animateTimeout,
					colors = {};

				// build colors object with either user inputs or default value
				function buildColorObj() {
					if(!$scope.colors) $scope.colors = {};
					colors.center    = (!$scope.colors.center)    ? '#F5FBFC' : $scope.colors.center;
					colors.highlight = (!$scope.colors.highlight) ? '#2BCBED' : $scope.colors.highlight;
					colors.remaining = (!$scope.colors.remaining) ? '#C8E0E8' : $scope.colors.remaining;
				}

				// Styles DOM elements with corresponding colors
				function setColors() {
					buildColorObj();

					element[0].querySelector('.pc-border').style.backgroundColor = colors.highlight;
					element[0].querySelector('.pc-circle').style.backgroundColor = colors.center;
					
					setHighlight($scope.curPercent);
				}
				setColors();

				// adjusts the highlighted percentage based on the provided degrees
				function setHighlight(deg) {
					if(deg <= 180) {
				        $scope.highlight = {'background-image' : 'linear-gradient(' + (90+deg) + 'deg, transparent 50%,' + colors.remaining + ' 50%),linear-gradient(90deg,' + colors.remaining + ' 50%, transparent 50%)'};
				    }
				    else {
				        $scope.highlight = {'background-image' : 'linear-gradient(' + (deg-90) + 'deg, transparent 50%,' + colors.highlight + ' 50%),linear-gradient(90deg,' + colors.remaining + ' 50%, transparent 50%)'};
				    }
				}

				// takes the percentage and returns complimentary degrees
				function getDegrees(percent) {
					return (percent/100) * 360;
				}

				// Loop through and increment percentage to animate in DOM
				function animatePercentChange(fromVal, toVal) {
					if(fromVal != toVal) {
						$scope.curPercent = (fromVal < toVal) ? fromVal + 1 : fromVal - 1;
						var deg = getDegrees($scope.curPercent);

						setHighlight(deg);

						animateTimeout = $timeout(function() {
							animatePercentChange($scope.curPercent, toVal);
						}, $scope.speed);
					}
				}

				// if percent changes on scope, update DOM to reflect the change
				$scope.$watch('percent', function(newVal, oldVal) {
					if(!isNaN(newVal)) {
						// make sure value is whole number between 0-100
						newVal = Math.round(newVal);
						if(newVal > 100) newVal = 100;
						if(newVal < 0) newVal = 0;
						
						if($scope.speed) {
							// checks oldVal against currently displayed percent to prevent animation jump
							var startVal = (oldVal !== $scope.curPercent) ? $scope.curPercent : oldVal;
							$timeout.cancel(animateTimeout);
							animatePercentChange(startVal, newVal);
						}
						else { // user set speed to false. Do not animate.
							$scope.curPercent = newVal;
							var deg = getDegrees(newVal);
							setHighlight(deg);
						}
					}
				});

				// if colors change on scope, update DOM to reflect changes
				$scope.$watchCollection('colors', function(newVal, oldVal) {
					setColors();
				});
			}
		};
	});
})();




