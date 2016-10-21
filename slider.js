$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var scale = 1,slideNumbers=[],currentSlide,lastSlideNumber = 0,PrevActiveSlide = null;

	var data = [{
		set : 1,
		title : 'Georgia State University'
	},{
		set: 2,
		title : 'Georgia State University 1940'
	},{
		set: 3,
		title : 'Georgia State University 1950'
	},{
		set: 4,
		title : 'Georgia State University Campus 1960'
	},{
		set: 5,
		title : 'Georgia State University Campus 1970'
	},{
		set : 6,
		title : 'Georgia State University Campus 1980'
	},{
		set : 7,
		title : 'Georgia State University Campus 1990'
	},{
		set : 8,
		title : 'Georgia State University Campus 2000-2009' 
	},
	{
		set : 9,
		title : 'Georgia State University Campus 2010-2015'
	}];

	var ScaleArrayOfValues = function(arr) {
		return arr.reduce(function(res,el,i,arr) {
			res += (i % 2) ? (cur_h*el/img_h) : (cur_w*el/img_w);
			res += ((i < (arr.length - 1)) ? "," : "");
			return res;
		},"");
	}

	var ScaleCoordinates = function(data) {
		if (data) return ScaleArrayOfValues(data);
		$('.slider-list > .active area')
		.toArray()
		.forEach(function(area){
			var values = $(area).attr('coords').split(',');
			$(area).attr('coords',ScaleCoordinates(values));
		});
	}

	var Button = function(className) {
		this.element = $("<input type='button'></input>").addClass(className);
	}

	var controls = 
	$("<div class='slider-controls'></div>")
	.append([
		new Button('zoomout button').element,
		new Button('zoomin button active-btn').element,
		new Button('reset button active-btn').element,
		new Button('slideshow button active-btn').element
	]);

	$('.slider-list >:first-child').addClass('active');

	var cur_w = $('.slider-list > .active').width();
	var cur_h = $('.slider-list > .active').height();

	function GenerateSlideTitleElement(dataset,options){
		$('<li></li>')
		.append("<span class='slide-title'>"+dataset.title+"</span>")
		.data('slide-number',options.number)
		.addClass((options.active ? 'active' : ''))
		.appendTo('.slides-titles');
	}

	function LoadCoordsFromHtml(number) {
		data[number].points = [];
		var areas = 
		$($('.slider-list > li').toArray()
		.filter(function(slide){
			return $(slide).data('slide-number') == (number+1);
		})[0]).find('area').toArray();

		areas.forEach(function(area,i){
			var coords = $(area).attr('coords').split(',').map(parseFloat);
			//debugger;
			data[number].points.push({
				data : coords,
				title : $(area).data('tooltip-title') || "Sample title",
				content : $(area).data('tooltip-content') || "Hello world!"

			});
		});
		$(areas).remove();
	}

	function SetCoordsToMaps(number) {
		if (!data[number].points || !data[number].points.length) {
			LoadCoordsFromHtml(number);
		}
		return $.map(data[number].points,function(point,id){
			var ident = "a" + number + "-" + id;
			var area = ($("<area shape='poly' href='#'/>")
			.attr({
				coords : ScaleCoordinates(point.data),
				class : ident
			}));
			return area;
		});
	}

	function GenerateSlideMapAreas(number,stack) {
		if (stack === undefined) stack = true;
		var slide = 
		$('.slider-list > li')
		.toArray()
		.filter(function(slide){
			return $(slide).data('slide-number') == number;
		})[0];

		var image = $(slide).children('img');

		var imageUrl = image.attr('src') || data.filter(function(el){ return el.set == number; })[0].imageUrl;

		var map = $(slide).children('map');
		map = map.length ? $(map[0]) : $("<map></map>");
		map.attr({id:'map-'+number,name:'map-'+number});
		image.attr({id:'img-map-'+number,usemap:'#'+map.attr('name'),src:(imageUrl)}).removeClass('img_map');
		$(slide).prepend($("<div class='img_map'></div>").append(image));
		
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

	var cursor = { x : 0, y : 0 },
		delta = {
			left   : 0, top    : 0,
			right  : 0, bottom : 0
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

	var SetCursorXY = function(x,y) {
		cursor.x = x;
		cursor.y = y;
	}

	var Update = {
		Cursor : function(event) {
			event = window.event || event;
			SetCursorXY(event.clientX,event.clientY);	
		},
		Touch : function(event) {
			var touch = event.originalEvent.touches[0];
			SetCursorXY(touch.pageX,touch.pageY);
		},
		ImageValues : function(isMoving) {
			var imgMap = $('.active .img_map');
			var pos = imgMap.position();
			img.left 	= pos.left;
			img.top 	= pos.top;
			img.width 	= imgMap.width();
			img.height 	= imgMap.height();
			img.obj 	= isMoving ? imgMap : null;
		},
		DeltaValues : function() {
			delta.left 		= (cursor.x - img.left) || 0;
			delta.top 		= (cursor.y - img.top) || 0;
			delta.width 	= img.left + img.width;
			delta.height 	= img.top + img.height;
		},
		TooltipPosition : function() {
			var tooltip = $('.tooltip');
			if (!tooltip.length) return;

			var position = {left:0,top:0};
			var areaData = 
			$('.active .' + tooltip.data('used-for'))
			.attr('coords')
			.split(',')
			.map(function(c){return parseFloat(c);});

			var center = areaData
			.reduce(function(p,val,id){
				if (id % 2) p.y += val;
				else p.x += val;
				return p;
			},{x:0,y:0});

			center.x = 2 * center.x / areaData.length;
			center.y = 2 * center.y / areaData.length;
			
			var params = {
				x : 20,
				y : -tooltip.height()/2,
				class : 'left'
			}

			if ((center.x + tooltip.width() + 20) > (img.width - 10)) {
				center.x -= tooltip.width();
				params.x = -20;
				params.class = 'right';
			}

			tooltipPos = {
				top : (center.y + params.y),
				bottom : (center.y + params.y + tooltip.height())
			}

			if (tooltipPos.top < 0) {
				params.y += (-tooltipPos.top + 10);
				$('.tooltip-arrow').css({top:(-params.y)});
			}
			else if (tooltipPos.bottom > img.height) {
				params.y -= (tooltipPos.bottom - img.height + 10);
				$('.tooltip-arrow').css({top:(-params.y)});
			} else {
				$('.tooltip-arrow').css({top:'50%'});
			}

			var style = {
				left : (center.x + params.x),
				top : (center.y + params.y),
				opacity : 1
			}

			tooltip
			.removeClass('left right top bottom')
			.addClass(params.class)
			.css(style);
		},
		ImageObjectPosition : function() {
			if (img.obj === null) return;
	       	$(img.obj).css(HandleBorders({
	       		left : cursor.x - delta.left,
	       		top  : cursor.y - delta.top
	       	}));
		},
		ControlsStatus : function(mul) {
			
			if (mul === undefined) mul = 1;

			function Disable(selector) { $(selector).attr('disabled','disabled').removeClass('active-btn'); }
			function Enable(selector) { $(selector).removeAttr('disabled').addClass('active-btn');}

			if (scale * mul < 1 || scale == 1) Disable('.active .zoomout,.active .reset');
			else Enable('.active .zoomout, .active .reset');

			if (scale * mul > 2) Disable('.active .zoomin');
			else Enable('.active .zoomin');
		}
	}

	const zoomer = 0.1;

	$.fn.extend({
		valSlider : function() {
			var args = [].slice.call(arguments);
			var ScaleArrayOfValues = function(arr,scale) {
				return arr.reduce(function(res,el,i,arr) {
					res += (i % 2) ? el*scale : el*scale;
					res += ((i < (arr.length - 1)) ? "," : "");
					return res;
				},"");
			}
			var ScaleCoordinates = function(data,scale) {
				if (data) return ScaleArrayOfValues(data,scale);
				$('.slider-list > .active area')
				.toArray()
				.forEach(function(area){
					var values = $(area).attr('coords').split(',');
					$(area).attr('coords',ScaleCoordinates(values,scale));
				});
			}
			var command = args[0];
			args = args.slice(1);
			switch(command){
				case 'resize' :
					$(this).css({width:args[0].width,height:args[0].height,left:0,top:0});
					ScaleCoordinates(null,args[0].scale);
					break;
			}
		}
	});

	function zoom(mul) {
		
		var map = $('.active .img_map');
		scale *= mul;

		var current = {
			width 	: map.width() * mul,
			height 	: map.height() * mul,
			scale 	: mul
		}

		if (current.width <= img.frame.width || current.height <= img.frame.height || scale == 1) {
			scale = 1;
			map.css({top : 0, left : 0});
			current.width = img.frame.width;
			current.height = img.frame.height;
		}

		map.valSlider('resize',current);
		Update.ImageValues();
		Update.TooltipPosition();
		Update.ControlsStatus(mul);
	}

	function StartDrag(event) {
		Update.Cursor(event);
		Update.ImageValues(true);
		Update.DeltaValues();
	}

	function StartTouchDrag(event) {
		event.preventDefault();
		Update.Touch(event);
		Update.ImageValues(true);
		Update.DeltaValues();
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
		Update.Cursor(event);
		Update.ImageObjectPosition(); 
	}

	function WhileTouchDrag(event) {
		Update.Touch(event);
		Update.ImageObjectPosition();
	}

	controls.appendTo('.val-slide:not(:first)');
	$('.zoomout').attr('disabled','disabled');

	$(document).on('dragstart','.active .img_map',function(){return false;});
	$(document).on('mousedown','.active .img_map',StartDrag);
	$(document).on('touchstart','.active .img_map',StartTouchDrag);
	$(document).on('mousemove','.slider-list',WhileDrag);
	$(document).on('touchmove','.slider-list',WhileTouchDrag);
	$(document).on('mouseup','.slider-list',function(){img.obj = null});
	$(document).on('touchend','.slider-list',function(){img.obj = null});
	$(document).on('click touchstart','.tooltip-controls .close',function(e){
		$('.tooltip').remove();
	});

	$(document).on('click touchstart',"area",function(e){
		if ($('.tooltip').data('used-for') == $(this).attr('class')) {
			$('.tooltip').remove();
			return;
		}
		$('.tooltip').remove();
		var pos = $('.active .img_map').position();

		var ind = $(this).attr('class').slice(1).split('-').map(function(n){ return parseInt(n);});

		var point = data[ind[0]].points[ind[1]];
		//debugger;

		var tooltip = 
		$("<div class='tooltip'></div>")
		.css({opacity:0,left:(-pos.left),top:(-pos.top)})
		.data('used-for',$(this).attr('class'))
		.append('<div class="tooltip-controls"><div class="btn close">&#10006;</div></div>')
		.append($("<h3 class='tooltip-title'></h3>").html(point.title))
		.append($("<div class='tooltip-content'></div>").append(point.content))
		.append('<div class="tooltip-arrow"></div>');

		var areaData = $(this).attr('coords').split(',').map(function(c){return parseFloat(c);});

		var center = areaData
		.reduce(function(p,val,id){
			if (id % 2) p.y += val;
			else p.x += val;
			return p;
		},{x:0,y:0});

		center.x *= 2 / areaData.length;
		center.y *= 2 / areaData.length;

		var params = {
			x : 20,
			y : 0,
			class : 'left'
		}

		$('.slider-list .active .img_map').append(tooltip);

		if (!$('.tooltip img').length) {
			Update.ImageValues();
			params.y = -tooltip.height()/2;

			if ((center.x + tooltip.width() + 20) > (img.width - 20)) {
				center.x -= tooltip.width();
				params.x = -20;
				params.class = 'right';
			}

			tooltipPos = {
				top : (center.y + params.y),
				bottom : (center.y + params.y + tooltip.height())
			}

			if (tooltipPos.top < 0) {
				params.y += (-tooltipPos.top + 10);
				$('.tooltip-arrow').css({top:(-params.y)});
			}
			else if (tooltipPos.bottom > img.height) {
				params.y -= (tooltipPos.bottom - img.height + 10);
				$('.tooltip-arrow').css({top:(-params.y)})
			}

			tooltip.addClass(params.class);
			tooltip.css({left:(center.x + params.x),top:(center.y + params.y)});
			tooltip.css('opacity',1);
		} else {
			$('.tooltip img').load(function(){
				Update.ImageValues();
				params.y = -tooltip.height()/2;

				if ((center.x + tooltip.width() + 20) > (img.width - 20)) {
					center.x -= tooltip.width();
					params.x = -20;
					params.class = 'right';
				}

				tooltipPos = {
					top : (center.y + params.y),
					bottom : (center.y + params.y + tooltip.height())
				}

				if (tooltipPos.top < 0) {
					params.y += (-tooltipPos.top + 10);
					$('.tooltip-arrow').css({top:(-params.y)});
				}
				else if (tooltipPos.bottom > img.height) {
					params.y -= (tooltipPos.bottom - img.height + 10);
					$('.tooltip-arrow').css({top:(-params.y)})
				}

				tooltip.addClass(params.class);
				tooltip.css({left:(center.x + params.x),top:(center.y + params.y)});
				tooltip.css('opacity',1);
			});
		}	
	});

	var timers = [];

	function ClearTimers(){
		while(timers.length) clearTimeout(timers.pop());
	}

	$('.slideshow.button').addClass('stop');
	//timers.push(setTimeout(slideShowStart,6000));

	var Timer = {
		Start : function(){
			timers.push(setTimeout(slideShowStart,6000));			
		},
		Stop : function(){
			while(timers.length) clearTimeout(timers.pop());
		}
	}

	$(document).on('mouseover','.slider-list',function(){
		var a = timers;
		Timer.Stop();
		if (!$('.slider-list .active').length) {

			var number = slideNumbers[PrevActiveSlide.next].number;
			slideNumbers[PrevActiveSlide.next].active = true;
			var getActive = function(el) {return $(el).data('slide-number') == number;}

			var slide = $('.slider-list > li, .slides-titles > li').toArray().filter(getActive);
			$(slide).addClass('active');
		}
		$('.slideshow.button').removeClass('play stop').addClass('play');
	});

	$(document).on('click','.slideshow.button.stop',function() {
		Timer.Stop();
		$('.slideshow.button').removeClass('play stop').addClass('play');
	});

	$(document).on('mouseleave','.slider-list',function(){
		//Timer.Start();
		$('.slideshow.button').removeClass('play stop').addClass('stop');
	});

	$(document).on('click','.slideshow.button.play',function() {
		//Timer.Start();
		$('.slideshow.button').removeClass('play stop').addClass('stop');
	});

	$(document).on('click','.slides-titles > li',function(e){
		
		$('.slides-titles .active, .slider-list .active').removeClass('active');
		var target = $(e.currentTarget).addClass('active');

		target = $('.slider-list > li').toArray().filter(function(el){
			return $(el).data('slide-number') == target.data('slide-number');
		});

		if (target.length) {
			setTimeout(function(){
				$(target[0]).addClass('active');
				Update.ControlsStatus();
				$('.active .img_map').css({width:'100%',height:'100%',left:0,top:0});
				$('.tooltip').remove();

				slideNumbers.every(function(el){
					if (!el.active) return true;
					el.active = false;
					return false;
				})[0];

				slideNumbers[$('.slider-list .active').data('slide-number')-1].active = true;

			},250);
		}
	});
	$(document).on('click','.zoomout',function(e){zoom(1-zoomer + 0.019);});
	$(document).on('click','.zoomin',function(e){zoom(1+zoomer);});
	$(document).on('click','.reset',function(e){zoom(1.0/scale);});

	function slideShowStart(){

		slideNumbers.forEach(function(el,index){
			if (!el.next) el.next = (index+1 < slideNumbers.length) ? (index + 1) : 0;
		})

		var prevActive = slideNumbers.filter(function(el){
			if (!el.active) return false;
			el.active = false;
			return true;
		})[0];

		PrevActiveSlide = prevActive;

		$('.slides-titles .active, .slider-list .active').removeClass('active');

		var t = setTimeout(function(){
			var number = slideNumbers[prevActive.next].number;
			slideNumbers[prevActive.next].active = true;

			var getActive = function(el) {return $(el).data('slide-number') == number;}

			var slide = $('.slider-list > li, .slides-titles > li').toArray().filter(getActive);
			$(slide).addClass('active');
			PrevActiveSlide = null;
			Update.ControlsStatus();
			var t2 = setTimeout(function(){
				slideShowStart();
			},6000);
			timers.push(t2);
		},250);
		timers.push(t);

	}

});