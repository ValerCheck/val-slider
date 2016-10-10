$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var scale = 1;
	var cur_w = $('.img_map').width();
	var cur_h = $('.img_map').height();

	var yearPoints = {
		'map-1':[
			function(){
				return [coords(475,535.5),coords(494,512),coords(520,535.5),coords(499.5,555)];
			},
			function(){
				return [coords(525,535),coords(555,498),coords(585,521),coords(555,558)];
			},
			function(){
				return [coords(568,557),coords(595.5,523),coords(623,544),coords(595.5,578)];	
			},
			function(){
				return [coords(517,615.5),coords(526.5,603),coords(543,615.5),coords(534,628)];
			}
		]
	}

	function get_x(x){
		return cur_w*x/img_w;
	}

	function get_y(y){
		return cur_h*y/img_h;
	}

	function coords(x,y) {
		return get_x(x) + "," + get_y(y);
	}

	$('area')
	.data('maphilight',{"fillColor":"0168c4","strokeColor":"000000",'strokeWidth':1,"strokeOpacity":0.75})
	.toArray()
	.forEach(function(el){
		var a = $(el);
		a.attr('coords',yearPoints[a.parent().attr('id')][a.data('number')-1]().join(","));
	});

	$('.img_map').maphilight({alwaysOn : true,fillOpacity:0.75});
	
	$(document).on('dragstart','div.img_map',function(){
		return false;
	});

	var areas = $('area');
	var areasPoints = {};

	function calculateCoords(area,className){
		var pts =  [];
		var p = {};
		area.attr('coords').split(',').forEach(function(el,i){
			if (i % 2 == 0 && !p.x) p.x = parseFloat(el);
			else if (i % 2 == 1 && !p.y) p.y = parseFloat(el);
			if (p.x && p.y) {
				pts.push(p);
				p = {};
			}
		});
		areasPoints[className] = {
			className : className,
			points 	  : pts
		};
	}

	function setTooltipPosition(className,p,xd,yd){
		var tooltip = $(className);
		
		tooltip.css({
			'top'  : areasPoints[className].points[p].y + yd,
			'left' : areasPoints[className].points[p].x + xd
		});
		return tooltip;
	}

	areas.toArray().forEach(function(elem){
		var tooltips = $('.tooltips');
		var parent = tooltips.parent().find('div.img_map');
		if (parent.length) parent.append(tooltips);
		var area = $(elem);
		$("#" + area.parent().attr('id') + " #" + area.attr('id')).click(function(e){
			e.preventDefault();
			var className = "." + [area.parent().attr('id'),area.attr('id')].join("_").replace(/\-/g,"_");
			if (!areasPoints[className]) calculateCoords(area,className);
			var tooltip = setTooltipPosition(className,2,20,0);
			var isActive = false;
			if (tooltip.hasClass('active')) isActive = true;
			$('.tooltip.active').removeClass('active');
			if (isActive) return;
			tooltip.toggleClass('active').css({top : (tooltip.offset().top - tooltip.height()/2 - $('.img_map').offset().top)});
		});
	})

	var tooltips = $('.tooltips');

	var map = null,
		cursor = {
			x : 0,
			y : 0
		},
		delta = {
			left   : 0,
			top    : 0,
			right  : 0,
			bottom : 0
		},
		img = {
			frame  : {
				top    : $('img.img_map').position().top,
				left   : $('img.img_map').position().left,
				width  : $('div.img_map').parent().width(),
				height : $('div.img_map').parent().height()
			},
			obj    : null,
			x      : 0,
			y 	   : 0,
			width  : 0,
			height : 0
		};

	const zoomer = 0.1;

	function redrawAreas(){
		var areas = $('area');
		areas.toArray().forEach(function(el){
			var area = $(el);
			area.attr('coords',yearPoints[area.parent().attr('id')][area.data('number')-1]().join(","));
			var className = "." + [area.parent().attr('id'),area.attr('id')].join("_").replace(/\-/g,"_");
			calculateCoords(area,className);
			setTooltipPosition(className,2,20,0);
		});
	}

	function redrawTooltips(){
		var tooltips = $('.tooltips');
		$('img.img_map').maphilight({alwaysOn : true,fillOpacity:0.75});
		$('div.img_map').append(tooltips);
		var tooltip = $('.tooltip.active');
		if (tooltip.length) tooltip.css({top : (tooltip.offset().top - tooltip.height()/2)})
	}

	function zoom(mul) {
		map = $('.img_map');
		var old_width = map.width(), 
			old_height = map.height();
		scale *= mul;
		cur_w = old_width * mul;
		cur_h = old_height * mul;
		if (cur_w <= img.frame.width || cur_h <= img.frame.height) {
			$('img.img_map').height(img.frame.height);
			$('img.img_map').width('auto');
			scale = 1;
		}
		map.width(cur_w);
		map.height(cur_h);
		redrawAreas();
		redrawTooltips();
	}

	function zoomIn(){zoom(1+zoomer);}
	function zoomOut(){zoom(1-zoomer + 0.019);}
	function resetView(){
		zoom(1.0/scale);
	}

	function UpdateCursor(){
		cursor.x = window.event.clientX;
		cursor.y = window.event.clientY;
	}

	function start_drag() {
		UpdateCursor();
		img.obj 	= this;
		img.left 	= $('div.img_map').position().left;
		img.top 	= $('div.img_map').position().top;
		img.width 	= $('div.img_map').width();
		img.height 	= $('div.img_map').height();
		delta.left 	= cursor.x - img.left;
		delta.width 	= img.left + img.width;
		delta.height 	= img.top + img.height;
		delta.top 		= cursor.y - img.top;
	}

	function stop_drag() {
		img.obj = null;
	}

	function while_drag() {
		UpdateCursor();
        if (img.obj !== null) {
           	var props = {
           		left : cursor.x - delta.left,
           		top  : cursor.y - delta.top
           	}

           	if (props.left > 0) props.left = 0;
           	if (props.top > 0) props.top = 0;
           	if (props.left + img.width <= img.frame.left + img.frame.width) {
           		props.left = img.frame.width - img.width;
           	}
           	if (props.top + img.height <= img.frame.top + img.frame.height) {
           		props.top = img.frame.height - img.height;
           	}

           	$(img.obj).css({
           		top  : props.top,
           		left : props.left
           	});
        }
	}

	$('.slider-controls').appendTo('.slider-list li');

	$(document).on('mousedown','div.img_map',start_drag);
	$(document).on('mousemove','.slider-list',while_drag);
	$(document).on('mouseup','.slider-list',stop_drag);
	$(document).on('click','#zoomout',zoomOut);
	$(document).on('click','#zoomin',zoomIn);
	$(document).on('click','#reset',resetView);

});