$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var scale = 1,scales = [],slideNumbers=[],currentSlide;
	$('.slider-list > li:first-child').addClass('active');
	
	var controls = $("<div class='slider-controls'></div>")
					.append($("<input type='button' class='zoomout button' value='Zoom out'>"))
					.append($("<input type='button' class='zoomin button' value='Zoom in'>"))
					.append($("<input type='button' class='reset button' value='Reset'>"));


	$('.slider-list > li').addClass('val-slide');
	$('.slider-list > li').toArray().forEach(function(el){
		var newLi = $('<li></li>');
		newLi = newLi.append($(el).find('.slide-title')).data('slide-number',$(el).data('slide-number'));
		slideNumbers.push({
			active : $(el).hasClass('active'),
			number : $(el).data('slide-number')
		});
		if ($(el).hasClass('active')) {
			newLi.addClass('active');
		}
		newLi.appendTo('.slides-titles');
		scales.push(1);
	});

	var options = {
        singleSelect: true,
        isDeselectable: false,
        fill: true,
        fillColor: 'ffff00',
        fillOpacity: 0.9
    };

	var cur_w = $('.slider-list > .active >:first-child').width();
	var cur_h = $('.slider-list > .active >:first-child').height();

	function closePoly(arr) {
		if (!arr.length) return;
		arr.push(arr[0]);
		return arr;
	}

	var yearPoints = {
		'map-1':[
			function(){
				return closePoly([coords(475,535.5),coords(494,512),coords(520,535.5),coords(499.5,555)]);
			},
			function(){
				return closePoly([coords(525,535),coords(555,498),coords(585,521),coords(555,558)]);
			}
		],
		'map-2':[
			function(){
				return closePoly([coords(475,535.5),coords(494,512),coords(520,535.5),coords(499.5,555)]);
			},
			function(){
				return closePoly([coords(525,535),coords(555,498),coords(585,521),coords(555,558)]);
			},
			function(){
				return closePoly([coords(568,557),coords(595.5,523),coords(623,544),coords(595.5,578)]);
			},
			function(){
				return closePoly([coords(517,615.5),coords(526.5,603),coords(543,615.5),coords(534,628)]);
			}
		]
	}

	function get_x(x){
		return cur_w*x/img_w;
		return x;
	}

	function get_y(y){
		//return y;
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

	var mapOptions = {
		fillColor: '0168c4',
		strokeColor : '000000',
		strokeWidth : 1,
        fillOpacity: 1,
        stroke : true,
        scaleMap : false
	};

	$('.slider-list > li.active img.img_map').mapster(mapOptions);
    $('area').mapster('set',true);

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

	var cursor = { x : 0, y : 0 },
		delta = {
			left   : 0,
			top    : 0,
			right  : 0,
			bottom : 0
		},
		img = {
			frame  : {
				top    : $('.active .img_map').position().top,
				left   : $('.active .img_map').position().left,
				width  : $('.active .img_map').parent().width(),
				height : $('.active .img_map').parent().height()
			},
			obj    : null,
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
		$('div.img_map').append(tooltips);
		var tooltip = $('.tooltip.active');
		if (tooltip.length) tooltip.css({top:(tooltip.position().top - (tooltip.height()/2))});
	}

	function updateControlsStatus(mul){
		if (scale * mul < 1) $('#zoomout').attr('disabled','disabled');
		else $('#zoomout').removeAttr('disabled');
	}

	function slideShowStart(){

	}

	function zoom(mul) {
		var map = $('.img_map');
		var old_width = map.width(), 
			old_height = map.height(),
			index = $('.slider-list .active').data('slide-number');
		//scales[index - 1] = scales[index - 1] mul;
		scale *= mul;
		cur_w = old_width * mul;
		cur_h = old_height * mul;
		if (scale == 1 || cur_w <= img.frame.width || cur_h <= img.frame.height) {
			$('.active [id^=mapster]').css({top : 0, left : 0});
			$('.active .img_map:not(.mapster_el)').mapster('resize',img.frame.width,img.frame.height);
			updateControlsStatus(mul);
			scale = 1;
			return;
		}
		$('.active .img_map:not(.mapster_el)').mapster('resize',cur_w,cur_h);
		updateControlsStatus(mul);
	}

	function UpdateCursor(event){
		event = window.event || event;
		cursor.x = event.clientX;
		cursor.y = event.clientY;
	}

	function start_drag(event) {
		UpdateCursor(event);
		img.obj 	= $('.active [id^=mapster]');
		img.left 	= $('.active [id^=mapster]').position().left;
		img.top 	= $('.active [id^=mapster]').position().top;
		img.width 	= $('.active [id^=mapster]').width();
		img.height 	= $('.active [id^=mapster]').height();
		delta.left 	= cursor.x - img.left;
		delta.width 	= img.left + img.width;
		delta.height 	= img.top + img.height;
		delta.top 		= cursor.y - img.top;
	}

	function while_drag(event) {
		UpdateCursor(event);
        if (img.obj !== null) {
           	
           	var props = {
           		left : cursor.x - delta.left,
           		top  : cursor.y - delta.top
           	}

           	if (props.left > 0) props.left = 0;
           	else if (props.left + img.width <= img.frame.left + img.frame.width) 
           		props.left = img.frame.width - img.width;
           	if (props.top > 0) props.top = 0;
           	else if (props.top + img.height <= img.frame.top + img.frame.height)
           		props.top = img.frame.height - img.height;

           	$(img.obj).css({
           		top  : props.top,
           		left : props.left
           	});
        }
	}

	//$('.slider-controls').appendTo('.val-slide');
	controls.appendTo('.val-slide');
	$('#zoomout').attr('disabled','disabled');

	function valSliderStart(){
		var slideNumbers = $('.slider-list > li').toArray().map(function(el){
			return $(el).data('slide-number');
		})
	}

	$(document).on('dragstart','.active [id^=mapster]',function(){return false;});

	$(document).on('mousedown','.active [id^=mapster]',start_drag);
	$(document).on('touchstart','div.img_map',start_drag);
	$(document).on('mousemove','.slider-list',while_drag);
	$(document).on('touchmove','.slider-list',while_drag);
	$(document).on('mouseup','.slider-list',function(){img.obj = null});
	$(document).on('touchend','.slider-list',function(){img.obj = null});
	$(document).on('click','.slides-titles > li',function(e){
		$('.slides-titles li.active').removeClass('active');
		var target = $(e.currentTarget);
		target.addClass('active');
		var active = $('.slider-list .active');
		active.removeClass('active');
		active.find('.img_map:not(.mapster_el)').mapster('unbind');
		target = $('.slider-list > li').toArray().filter(function(el){
			return $(el).data('slide-number') == target.data('slide-number');
		});

		if (target.length) {
			target = $(target[0]);
			setTimeout(function(){
				//scale = 1;
				target.addClass('active');
				$('.active .img_map:not(.mapster_el)').mapster('resize',img.frame.width*scale,img.frame.height*scale);
				
			},250);
			if (!target.find('div.img_map').length) {
				target.find('img.img_map').mapster(mapOptions);
				$('area').mapster('set',true);
			}
		}
	});
	$(document).on('click','.zoomout',function(){zoom(1-zoomer + 0.019);});
	$(document).on('click','.zoomin',function(){zoom(1+zoomer);});
	$(document).on('click','.reset',function(){zoom(1.0/scale);});

});