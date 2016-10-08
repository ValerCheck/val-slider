$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var cur_w = $('.img_map').width();
	var cur_h = $('.img_map').height();

	function get_x(x){
		return cur_w*x/img_w;
	}

	function get_y(y){
		return cur_h*y/img_h;
	}

	function coords(x,y) {
		return get_x(x) + "," + get_y(y);
	}

	$('area').data('maphilight',{"fillColor":"0168c4","strokeColor":"000000",'strokeWidth':1,"strokeOpacity":0.75});

	$('area').attr('coords',[coords(475,535.5),coords(494,512),coords(520,535.5),coords(499.5,555)].join(","))

	$('.img_map').maphilight({alwaysOn : true,fillOpacity:0.75});
	
	$(document).on('dragstart','div.img_map',function(){
		return false;
	});

	var areas = $('area');
	var areasPoints = {};

	function calculateCoords(area,className){
		var points =  [];
		var point = {};
		area.attr('coords').split(',').forEach(function(el,i){
			if (i % 2 == 0 && !point.x) point.x = parseFloat(el);
			else if (i % 2 == 1 && !point.y) point.y = parseFloat(el);
			if (point.x && point.y) {
				points.push(point);
				point = {};
			}
		});
		areasPoints[className] = {
			className : className,
			points : points
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
			tooltip.toggleClass('active').css({top : (tooltip.offset().top - tooltip.height()/2)});
		});
	})

	var tooltips = $('.tooltips');
	tooltips.parent().find('div.img_map').append(tooltips);

	var img_ele = null,
		map = null,
		x_cursor = 0,
		y_cursor = 0,
		x_img_ele = 0,
		y_img_ele = 0;

	const zoomer = 0.1;


	function zoom(mul) {
		map = $('.img_map');
		var old_width = map.width(), 
			old_height = map.height();
		cur_w = old_width * mul;
		cur_h = old_height * mul;
		map.width(cur_w);
		map.height(cur_h);
		var area = $('area');
		area.attr('coords',[coords(475,535.5),coords(494,512),coords(520,535.5),coords(499.5,555)].join(","));
		var className = "." + [area.parent().attr('id'),area.attr('id')].join("_").replace(/\-/g,"_");
		calculateCoords(area,className);
		tooltip = setTooltipPosition(className,2,20,0);
		var tooltips = $('.tooltips');
		$('img.img_map').maphilight({alwaysOn : true,fillOpacity:0.75});
		$('div.img_map').append(tooltips);
		tooltip.css({top : (tooltip.offset().top - tooltip.height()/2)})
	}

	function zoomIn(){zoom(1+zoomer);}
	function zoomOut(){zoom(1-zoomer);}


	$('#zoomout').on('click',zoomOut);

	$('#zoomin').on('click',zoomIn);

	function start_drag() {
	  img_ele = this;
	  x_img_ele = window.event.clientX - document.querySelector('.img_map').offsetLeft;
	  y_img_ele = window.event.clientY - document.querySelector('.img_map').offsetTop;

	}

	function stop_drag() {
	  img_ele = null;
	}

	function while_drag() {
	  var x_cursor = window.event.clientX;
	  var y_cursor = window.event.clientY;
	  if (img_ele !== null) {
	  	if (x_cursor - x_img_ele > 0) img_ele.style.left = 0;
	  	else img_ele.style.left = (x_cursor - x_img_ele) + 'px';
	  	if (window.event.clientY - y_img_ele > 0) img_ele.style.top = 0;
	    else img_ele.style.top = (window.event.clientY - y_img_ele) + 'px';

	      console.log(img_ele.style.left+' - '+img_ele.style.top);

	  }
	}

	$(document).on('mousedown','div.img_map',start_drag);
	$(document).on('mousemove','.slider-list',while_drag);
	$(document).on('mouseup','.slider-list',stop_drag);

})