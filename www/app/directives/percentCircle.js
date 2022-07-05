 //angular.module('starter').directive('percentCircle', function($timeout) {
		angular.module('starter')
/**
 * 圆形百分比
 * 传如参数说明:
 */
.directive('circleDirective', function() {
	return {
		scope: {
			dataPercent:'@'
		},
		link : function(scope, el, attr) {
			
			var options = {
					color: attr.color,
				    percent: attr.percent,
				    size:  120,
				    lineWidth:  12,
				    rotate:  0
				}

				var canvas = document.createElement('canvas');
				canvas.className="circle-canvas";
				var span = document.createElement('span');
				span.className="circle-span";
				span.textContent = options.percent + '%';
				    
				if (typeof(G_vmlCanvasManager) !== 'undefined') {
				    G_vmlCanvasManager.initElement(canvas);
				}

				var ctx = canvas.getContext('2d');
				canvas.width = canvas.height = options.size;

				el.append(span);
				el.append(canvas);

				ctx.translate(options.size / 2, options.size / 2); // change center
				ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

				//imd = ctx.getImageData(0, 0, 240, 240);
				var radius = (options.size - options.lineWidth) / 2;

				var drawCircle = function(color, lineWidth, percent) {
						percent = Math.min(Math.max(0, percent || 1), 1);
						ctx.beginPath();
						ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
						ctx.strokeStyle = color;
				        ctx.lineCap = 'round'; // butt, round or square
						ctx.lineWidth = lineWidth
						ctx.stroke();
				};
				var colorCircle = '';
				if (options.color == 'color-100') colorCircle = "#00568a";
				if (options.color == 'color-90') colorCircle = "#417505";
				else if (options.color == 'color-70') colorCircle = "#5cac00";
				else if (options.color == 'color-50') colorCircle = "#fc9824";
				else if (options.color == 'color-10') colorCircle = "#d0011b";
				else if (options.color == 'gray') colorCircle = "#7b8994";
				drawCircle('#F2F2F2', options.lineWidth, 100 / 100);
				if (options.percent == 0) options.percent = 0.000001;
				drawCircle(colorCircle, options.lineWidth, options.percent / 100);
			
		}
	};
});