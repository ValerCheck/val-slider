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
	//debugger;
	areas.toArray().forEach(function(elem){
		var area = $(elem);
		$("#" + area.parent().attr('id') + " #" + area.attr('id')).click(function(e){
			e.preventDefault();
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
			var tooltip = $("." + [area.parent().attr('id'),area.attr('id')].join("_").replace(/\-/g,"_"));
			tooltip.css({'top':(points[2].y),'left' : points[2].x + 20});
			tooltip.toggle().css({top : (tooltip.offset().top - tooltip.height()/2)});
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
		$('area').attr('coords',[coords(475,535.5),coords(494,512),coords(520,535.5),coords(499.5,555)].join(","));
		$('img.img_map').maphilight({alwaysOn : true,fillOpacity:0.75});
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