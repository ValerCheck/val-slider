$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var scale = 1,slideNumbers=[],currentSlide,lastSlideNumber = 0;
	var mapOptions = {
		fillColor: '0168c4',
		strokeColor : '000000',
		strokeWidth : 1,
        fillOpacity: 1,
        stroke : true,
        scaleMap : true,
        isDeselectable: true
	};

	var data = [{
		set : 1,
		title : 'Georgia State University'
	},{
		set: 2,
		points : [
			{
				data : [524.2,458,542,438.3,570.8,461,554,483.5]
			}
		],
		title : 'Georgia State University 1940'
	},{
		set: 3,
		points : [
			{
				data : [569.3,482,599,446.9,622.8,467.9,593,503.1]
			}
		],
		title : 'Georgia State University 1950'
	},{
		set: 4,
		points : [
			{ data : [475,535.5,494,512,520,535.5,499.5,555] },
			{ data : [525,535,555,498,585,521,555,558] },
			{ data : [568,557,595.5,523,623,544,595.5,578] },
			{ data : [517,615.5,526.5,603,543,615.5,534,628] }
		],
		title : 'Georgia State University Campus 1960'
	},{
		set: 5,
		points : [
			{ data : [546,433.6,562.6,415,589,438,572.3,456] },
			{ data : [502,497,526.2,470,546,486.5,521,514] },
			{ data : [534.8,581.3,551.2,564.1,563.2,575.4,546.7,592.9] },
			{ data : [550.1,598.6,571.1,576.8,602.9,604.8,582.2,626.2] },
			{ data : [589,630.7,609,608,625,623,604.5,645] },
			{ data : [610,584.8,621.3,572,639,588.3,627.6,601] },
			{ data : [628,569.9,643.5,552,668,574.5,652.8,592] },
			{ data : [620,553.5,625.5,547,635,555.5,629.5,562] },
			{ data : [666.9,637,701.3,599.3,714,611.6,679.7,649.2], fillColor : '000000'},
			{ data : [686.9,655,721.7,617.3,734,629.6,700.1,667.2], fillColor : '000000'},
			{ data : [727.5,605.5,750.5,580.5,762.9,593.5,740.8,617.6], fillColor : '000000'}
		],
		title : 'Georgia State University Campus 1970'
	}];

	var controls = 
	$("<div class='slider-controls'></div>")
	.append($("<input type='button' class='zoomout button' value='Zoom out'>"))
	.append($("<input type='button' class='zoomin button' value='Zoom in'>"))
	.append($("<input type='button' class='reset button' value='Reset'>"));

	$('.slider-list > li:first-child').addClass('active');

	var cur_w = $('.slider-list > .active >:first-child').width();
	var cur_h = $('.slider-list > .active >:first-child').height();

	function GenerateSlideTitleElement(dataset,options){
		$('<li></li>')
		.append("<span class='slide-title'>"+dataset.title+"</span>")
		.data('slide-number',options.number)
		.addClass((options.active ? 'active' : ''))
		.appendTo('.slides-titles');
	}

	function SetCoordsToMaps(number) {
		if (!data[number].points) return;
		return $.map(data[number].points,function(point){
			return ($("<area shape='poly' href='#'/>")
			.attr('coords',point.data.join(",")));
		});
	}

	function GenerateSlideMapAreas(number,stack = true) {
		var slide = 
		$('.slider-list > li')
		.toArray()
		.filter(function(slide){
			return $(slide).data('slide-number') == number;
		})[0];

		var map = $(slide).children('map');
		map = map.length ? $(map[0]) : ($("<map></map>").attr({id:'map-'+number,name:'map-'+number}));
		$(slide).children('img').attr({id:'img-map-'+number,usemap:'#'+map.attr('name')});

		if (!$(slide).children('map').length) $(slide).prepend(map);

		var areas = [];

		if (stack) for (var i = 0; i < number; i++) areas = areas.concat(SetCoordsToMaps(i));
		else areas = SetCoordsToMaps(number);

		$(slide)
		.children('map')
		.append(areas);
	}

	function GenerateAllMapAreas() {
		$('.slider-list > li')
		.toArray()
		.map(function(slide,id){
			$(slide).data('slide-number',id + 1);
			if (id + 1 > lastSlideNumber) lastSlideNumber = id + 1;
		});
		for (var i = 1; i < lastSlideNumber + 1; i++) 
			GenerateSlideMapAreas(i);
	}

	function GenerateAllTitles() {
		$('.slider-list > li')
		.addClass('val-slide')
		.toArray()
		.forEach(function(slide,id){
			var options = {
				number : $(slide).data('slide-number'),
				active : $(slide).hasClass('active')
			}
			var dataset = data.filter(function(record){return record.set == options.number;})[0];
			GenerateSlideTitleElement(dataset,options);
			slideNumbers.push(options);
		});
	}

	GenerateAllMapAreas();
	GenerateAllTitles();

	$('.slider-list > li.active img.img_map').mapster(mapOptions);
    $('area').mapster('set',true);

	var areas = $('area');
	var areasPoints = {};

	function setTooltipPosition(className,p,xd,yd){
		var tooltip = $(className);
		tooltip.css({
			'top'  : areasPoints[className].points[p].y + yd,
			'left' : areasPoints[className].points[p].x + xd
		});
		return tooltip;
	}

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

	function redrawTooltips(){
		var tooltips = $('.tooltips');
		$('div.img_map').append(tooltips);
		var tooltip = $('.tooltip.active');
		if (tooltip.length) tooltip.css({top:(tooltip.position().top - (tooltip.height()/2))});
	}

	function UpdateControlsStatus(mul = 1){
		if (scale * mul < 1 || scale == 1) $('.zoomout').attr('disabled','disabled');
		else $('.zoomout').removeAttr('disabled');
	}

	function slideShowStart(){

		slideNumbers.forEach(function(el,index){
			if (!el.next) el.next = index+1 < slideNumbers.length ? index + 1 : 0;
		})

		var prevActive = slideNumbers.filter(function(el,index){
			if (el.active) {
				el.active = false;
				return true;
			}
		})[0];

		$('.slides-titles li.active').removeClass('active');

		var active = $('.slider-list .active');
		active.removeClass('active');
		active.find('.img_map:not(.mapster_el)').mapster('unbind');

		setTimeout(function(){
			var number = slideNumbers[prevActive.next].number;
			slideNumbers[prevActive.next].active = true;
			$('.slider-list [data-slide-number=' + number + ']').addClass('active');
			var elem = $('.slides-titles > li').toArray().filter(function(el){return $(el).data('slide-number')==number;});
			$(elem).addClass('active');
			$('.active .img_map:not(.mapster_el').mapster(mapOptions);
			$('area').mapster('set',true);
			setTimeout(slideShowStart,6000);
		},250);

	}

	function zoom(mul) {
		var map = $('.active .img_map');
		var old_width = map.width(), 
			old_height = map.height(),
			index = $('.slider-list .active').data('slide-number');
		scale *= mul;
		cur_w = old_width * mul;
		cur_h = old_height * mul;
		if (scale == 1 || cur_w <= img.frame.width || cur_h <= img.frame.height) {
			$('.active [id^=mapster]').css({top : 0, left : 0});
			$('.active .img_map:not(.mapster_el)').mapster('resize',img.frame.width,img.frame.height);
			UpdateControlsStatus(mul);
			scale = 1;
			return;
		}
		$('.active .img_map:not(.mapster_el)').mapster('resize',cur_w,cur_h);
		UpdateControlsStatus(mul);
	}

	function UpdateCursor(event){
		event = window.event || event;
		cursor.x = event.clientX;
		cursor.y = event.clientY;
	}

	function StartDrag(event) {
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

	function HandleBorders(props) {
		[
			{ pos : 'left', len : 'width'},
			{ pos : 'top' , len : 'height'}
		].forEach(function(obj){
			if (props[obj.pos] > 0) props[obj.pos] = 0;
			else if (props[obj.pos] + img[obj.len] <= img.frame[obj.pos] + img.frame[obj.len])
				props[obj.pos] = img.frame[obj.len] - img[obj.len];
		});
		return props;
	}

	function WhileDrag(event) {
		UpdateCursor(event);
		if (img.obj === null) return;
    	var props = HandleBorders({
       		left : cursor.x - delta.left,
       		top  : cursor.y - delta.top
       	});
       	$(img.obj).css(props);
	}

	controls.appendTo('.val-slide');
	$('.zoomout').attr('disabled','disabled');

	$(document).on('dragstart','.active [id^=mapster]',function(){return false;});
	$(document).on('mousedown','.active [id^=mapster]',StartDrag);
	$(document).on('touchstart','.active [id^=mapster]',StartDrag);
	$(document).on('mousemove','.slider-list',WhileDrag);
	$(document).on('touchmove','.slider-list',WhileDrag);
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
				scale = 1;
				target.addClass('active');
				$('.active .img_map:not(.mapster_el)').mapster('resize',img.frame.width*scale,img.frame.height*scale);
				UpdateControlsStatus();
				
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
	
	//setTimeout(slideShowStart,6000);

});