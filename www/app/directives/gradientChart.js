 angular.module('starter').directive('lineChart', function($timeout){
  return {
    restrict : 'EA',
    scope : {
      data : '=',
      height : '=',
      ctx : '='
    },
    link : function ( scope, elem, attr ) {
      scope.height = scope.height || 260;
      scope.data = scope.data || {};

      // Check for chart.js 
      if(! window.Chart) { throw new Error("Chart.js is required");}

      // Init chart
      scope.ctx = elem[0].getContext("2d");

      // Gradient color
      var gradient = scope.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(243, 103, 101,0.5)');   
          gradient.addColorStop(1, 'rgba(0, 89, 179,0.5)');

      var lineChartData = {
        labels : scope.data.labels,
        datasets : [
            {
                fillColor : gradient,
                pointColor : "rgba(255,255,255,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(151,187,205,1)",
                data : scope.data.values
            }
        ]
      };


      // Options 
      var options = {
          scaleBeginAtZero: true, 
          scaleShowLabels: false, 
          responsive : true, 
          tooltipFontSize: 12,
          showTooltips : false, 
          tooltipFillColor: "rgba(0,0,0,0.2)",
          scaleGridLineColor : "rgba(255,255,255,.04)", 
          tooltipEvents: [],
          onAnimationComplete: function () {
            // to always show tooltip 
            this.showTooltip(this.datasets[0].points, true);
          } 
      };

      var chart = new Chart(scope.ctx).Line(lineChartData, options);  
       var radius = chart.datasets[0].bars[0].width * chart.options.curvature * 0.5;

      // Watch for data change 
      scope.$watch('data', resetChart, true);

      function resetChart(newVal, oldVal) {
          if (chart) chart.destroy();

          // Assign the data
          lineChartData.labels = newVal.labels;
          lineChartData.datasets[0].data = newVal.values;

          $timeout(function () {
            chart = new Chart(scope.ctx).Line(lineChartData, options);
          }, 30);
      }

      scope.$on('$destroy', function () {
            if (chart) chart.destroy();
      });
    }
  };
})
