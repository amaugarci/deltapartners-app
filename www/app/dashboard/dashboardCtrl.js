angular.module('starter').controller('dashboardCtrl', ['$scope', 'customChartService', function ($scope, customChartService) {
    $scope.labels = ["JAN", "FEB", "MAR", "APR"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [1, 2, 1, 3],
    [-2.1, -3.0, -0.5, -2.5]
  ];

  //this number should be the max value in $scope.data
  $scope.maxNumber = 3;
  $scope.dataChance = [
    90, 70, 50, 10
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride1 = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.datasetOverride2 = [{ yAxisID: 'y-axis-1-inverse' }, { yAxisID: 'y-axis-2-inverse' }];
  $scope.optionsLeads = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        display: false,
        
      }],
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: false,
          position: 'left',
          ticks: {
                beginAtZero: true,
                max: $scope.maxNumber
            },
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: false,
          position: 'right',
          ticks: {
                beginAtZero: true,
                max: $scope.maxNumber
            }
        }
      ]
    }
  };

  $scope.optionsPipes = {
    responsive: true,
    maintainAspectRatio: false,
    showTooltips: false, // not working.. Using pointer-events: none; instead..
    scales: {
      xAxes: [{
        stacked: true,
        display: false,
        
      }],
      yAxes: [
        {
          id: 'y-axis-1-inverse',
          type: 'linear',
          display: false,
          position: 'left',
          ticks: {
                beginAtZero: true,
                max: -$scope.maxNumber,
                min:0
            },
        },
        {
          id: 'y-axis-2-inverse',
          type: 'linear',
          display: false,
          position: 'right',
          ticks: {
                beginAtZero: true,
                max: -$scope.maxNumber,
                min:0
            }
            
        }
      ]
    }
  };

  $scope.monthPerformance = {
      month : 'Jan',
      budget : 3.5,
      value100 : 3.5,
      value90 : '--',
      value70 : '--',
      value50 : '--'
};
 
}]);