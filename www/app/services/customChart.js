angular.module('starter').service('customChartService', ['$rootScope', customChart]);

function customChart($rootScope) {
    var self = this;

    var changeColor = function (chart) {
        var tmpChartId = chart.chart.config.data.datasets[0].yAxisID;

        if (!tmpChartId) {
            tmpChartId = chart.chart.config.data.datasets[0][0].yAxisID;
        }

        var ctx = chart.chart.ctx;
        var gradient = ctx.createLinearGradient(0, 0, 0, 100); // this number should be adjusted to graph height (?)

        if (tmpChartId != 'y-axis-1-inverse') {
            gradient.addColorStop(0, 'rgb(176,188,196)');
            gradient.addColorStop(1, 'rgb(124,138,149)');
        }
        else {
            gradient.addColorStop(0, 'rgb(242,242,242)');
            gradient.addColorStop(1, 'rgb(242,242,242)');
        }

        chart.chart.config.data.datasets[0].backgroundColor = gradient; // main bar
        chart.chart.config.data.datasets[0].borderColor = gradient;


        var gradient = ctx.createLinearGradient(0, 0, 0, 100); // this number should be adjusted to graph height (?)
        gradient.addColorStop(0, 'rgb(242,242,242)');
        gradient.addColorStop(1, 'rgb(242,242,242)');

        if (chart.chart.config.data.datasets.length > 1) {
            chart.chart.config.data.datasets[1].backgroundColor = gradient; // overlapping bar
            chart.chart.config.data.datasets[1].borderColor = gradient;
        }
    };

    $rootScope.$on('chart-create', function (evt, chart) {
        if (chart.chart.canvas.className.indexOf("gradient-gray") != -1) {
            changeColor(chart);
            chart.update();
        }
    });

}
