
$.extend({
	Button : function(className,attr) {
		this.element = $("<input type='button'></input>").addClass(className);
		for (var field in attr) this.element.attr(field,attr[field]);
		this.element = this.element[0];
	}
});

$(document).ready(function(){

	if (!$('.slides-titles').length)
		$('.val-slider .description')
		.append("<ul class='slides-titles'></ul>");

	const img_w = 1021;
	const img_h = 941;
	const zoomer = 0.1;
	var scale = 1, slideNumbers=[], currentSlide, lastSlideNumber = 0, PrevActiveSlide = null, timers = [];
	var cur_w,cur_h,cursor,delta,img;
	var slideTime = parseInt($('.val-slider').data('slide-time'));
	var slideTransitionTime = parseInt($('.val-slider').data('slide-transition-time'));

	var data = [{ set: 1 },{ set: 2 },{ set: 3 },{ set: 4 },{ set: 5 },{ set : 6 },{ set : 7 },{ set : 8 },{ set : 9 }];

	var Load = {
		SlideTitlesFromHtml : function() {
			$('.slider-list > li').toArray()
			.forEach(function(slide){
				slide = $(slide);
				var record = data[slide.data('slide-number')-1];
				if (slide.data('title')) record.title = slide.data('title');
				else if (!record.title) record.title = 'Slide Title #' + slide.data('slide-number');
			});	
		},
		CoordsFromHtml : function(number) {
			if (data[number].points && data[number].points.length) return;
			data[number].points = [];
			var areas = $($('.slider-list > li')
				.toArray()
				.filter(function(slide) {
					return $(slide).data('slide-number') == (number+1);
				})[0])
			.find('area')
			.toArray()
			.map(function(area){
				var coords = $(area).attr('coords').split(',').map(function(el){return parseFloat(el,10)});
				data[number].points.push({
					data : coords,
					title : $(area).data('tooltip-title') || "Sample title",
					content : $(area).data('tooltip-content') || ""
				});
				return area;
			});
			$(areas).remove();
		}
	}

	var Generate = {
		SlideTitleElement : function(dataset,args) {
			$('<li></li>')
			.append("<span class='slide-title'>"+dataset.title+"</span>")
			.data('slide-number',args.number)
			.addClass((args.active ? 'active' : ''))
			.appendTo('.slides-titles');
		},
		InitialCoords : function(number) {
			Load.CoordsFromHtml(number);
			return data[number].points.map(function(point,id){
				var coords = point.data.reduce(function(res,el,i,arr) {
					res += (i % 2) ? (cur_h*el/img_h) : (cur_w*el/img_w);
					res += ((i < (arr.length - 1)) ? "," : "");
					return res;
				},"");
				return ($("<area shape='poly' href='#'/>")
					.addClass("a" + number + "-" + id)
					.attr('coords',coords))[0];
			});
		},
		SlideMapAreas : function(number,stack) {
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
			map = map.attr({id:'map-'+number,name:'map-'+number});
			image.attr({id:'img-map-'+number,usemap:'#'+map.attr('name'),src:(imageUrl)}).removeClass('img_map');
			image = image[0];
			map = map[0];
			$(slide).prepend($("<div class='img_map'></div>").append(image)[0]);
			
			if (!$(slide).children('map').length) $(slide).prepend(map);

			var areas = [];

			if (stack) for (var i = 0; i < number; i++) areas = areas.concat(Generate.InitialCoords(i));
			else areas = Generate.InitialCoords(number);

			$(slide)
			.children('map')
			.append(areas);
		},
		AllMapAreas : function(){
			$('.slider-list > li')
			.toArray()
			.forEach(function(slide,id){
				$(slide).data('slide-number',id + 1);
				if (id + 1 > lastSlideNumber) lastSlideNumber = id + 1;
			});
			for (var i = 1; i < lastSlideNumber + 1; i++) Generate.SlideMapAreas(i);
			Load.SlideTitlesFromHtml();
		},
		MenuTitles : function() {
			var self = this;
			$('.slider-list > li')
			.addClass('val-slide')
			.toArray()
			.forEach(function(slide,id){
				var options = {
					number : $(slide).data('slide-number'),
					active : $(slide).hasClass('active')
				}
				var dataset = data.filter(function(record){return record.set == options.number;})[0];
				self.SlideTitleElement(dataset,options);
				slideNumbers.push(options);
			});
			slideNumbers.forEach(function(el,index){
				if (!el.next) el.next = (index+1 < slideNumbers.length) ? (index + 1) : 0;
			});
		},
		LightBox : function() {
			var container = $('<div id="lightbox"></div>');
			var content = $('<div id="content"></div>');
			var img_wrapper = $('<div class="img-wrapper"><img src="#"/></div>');
			var close = $('<div class="close-btn"></div>');
			container.append(content.append(img_wrapper.append(close))).appendTo('.val-slider');
		}
	}

	var Init = function() {
		
		$('.slider-list >:first-child').addClass('active');
		cur_w = $('.slider-list > .active').width();
		cur_h = $('.slider-list > .active').height();

		Generate.AllMapAreas();
		Generate.MenuTitles();
		$("<div class='slider-controls'></div>")
		.append([
			new $.Button('zoomout button',{disabled:'disabled'}).element,
			new $.Button('zoomin button active-btn').element,
			new $.Button('reset button active-btn').element,
			new $.Button('slideshow button stop active-btn').element
		])
		.appendTo('.val-slide:not(:first)');

		cursor = { x : 0, y : 0 },
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
	}

	Init();

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

			var areaData = 
			$('.active .' + tooltip.data('used-for'))
			.attr('coords').split(',')
			.map(function(c){return parseFloat(c);});

			var center = GetCenterOfPolygon(areaData);
			var params = TooltipPositionCorrection(center,tooltip);

			tooltip
			.removeClass('left right top bottom')
			.addClass(params.class)
			.css({
				left : (center.x + params.x),
				top : (center.y + params.y),
				opacity : 1
			});
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
		},
		AreaCoords : function(slide) {

			var number = $(slide).data('slide-number');

			function GetSlideCoords(num) {
				return data[num].points.map(function(point,id){
					return point.data.reduce(function(res,el,i,arr) {
						res += (i % 2) ? (cur_h*el/img_h) : (cur_w*el/img_w);
						res += ((i < (arr.length - 1)) ? "," : "");
						return res;
					},"");
				});
			};

			var coords = [];

			for (var i=0;i < number;i++) coords = coords.concat(GetSlideCoords(i));

			var areas = $(slide).find('area');

			for (var i=0;i<coords.length;i++) {
				$(areas[i]).attr('coords',coords[i]);
			}
		}
	}

	function GetCenterOfPolygon(data) {
		var center = data
		.reduce(function(p,val,id){
			if (id % 2) p.y += val;
			else p.x += val;
			return p;
		},{x:0,y:0});

		center.x *= 2 / data.length;
		center.y *= 2 / data.length;
		return center;
	}

	function TooltipPositionCorrection(center,tooltip) {
		var params = {
			x : 20,
			y : -tooltip.height()/2,
			class : 'left'
		}

		tooltipPos = {
			top : (center.y + params.y),
			bottom : (center.y + params.y + tooltip.height())
		}

		if ((center.x + tooltip.width() + 20) > (img.width - 20)) {
			center.x -= tooltip.width();
			params.x = -20;
			params.class = 'right';
		}

		if (tooltipPos.top < 0) {
			params.y += (-tooltipPos.top + 10);
			$('.tooltip-arrow').css({top:(-params.y)});
		}
		else if (tooltipPos.bottom > img.height) {
			params.y -= (tooltipPos.bottom - img.height + 10);
			$('.tooltip-arrow').css({top:(-params.y)})
		}
		return params;
	}

	$.fn.extend({
		valSlider : function() {
			var args = [].slice.call(arguments);
			var GenerateCoordsFromArray = function(arr,scale) {
				return arr.reduce(function(res,el,i,arr) {
					//res += (i % 2) ? (cur_h*el*scale/img_h) : (cur_w*el*scale/img_w);
					res += (i % 2) ? el*scale : el*scale;
					res += ((i < (arr.length - 1)) ? "," : "");
					return res;
				},"");
			}
			var ScaleCoordinates = function(scale) {
				$('.slider-list > .active area')
				.toArray()
				.forEach(function(area){
					var values = $(area).attr('coords').split(',');
					$(area).attr('coords',GenerateCoordsFromArray(values,scale));
				});
			}

			var command = args[0];
			args = args.slice(1);
			switch(command){
				case 'resize' :
					$(this).css({width:args[0].width,height:args[0].height,left:0,top:0});
					if (args[0].all) {
						//cur_w = $('.slider-list > li:first').width();
						//cur_h = $('.slider-list > li:first').height();
						$('.slider-list > li')
						.toArray()
						.forEach(function(slide){
							Update.AreaCoords(slide);
							$(slide)
							.find('area')
							.toArray()
							.forEach(function(area){
								var values = $(area).attr('coords').split(',');
								$(area).attr('coords',GenerateCoordsFromArray(values,scale));
							});
						});
						$(this).toArray().forEach(function(img_map){
							$(img_map).css({width:args[0].width,height:args[0].height,left:0,top:0});
						});
						return;
					}
					ScaleCoordinates(args[0].scale);
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

	var Events = {
		StartDrag : function(event,type) {
			event.preventDefault();
			Update[type](event);
			Update.ImageValues(true);
			Update.DeltaValues();	
		},
		WhileDrag : function(event,type) {
			Update[type](event);
			Update.ImageObjectPosition(); 	
		}
	}

	var Timer = {
		Start : function(t){
			if (LightBox.active) return;
			if (!t || typeof(t) !== "number" ) t = setTimeout(slideShowStart,slideTime);
			timers.push(t);
			$('.slideshow.button').removeClass('play stop').addClass('stop');
		},
		Stop : function(){
			while(timers.length) clearTimeout(timers.pop());
			$('.slideshow.button').removeClass('play stop').addClass('play');
		}
	}

	var LightBox = {
		active : false,
		Show : function(img) {
			this.active = true;
			Timer.Stop();
			var contentImg = $('#lightbox #content img');
			contentImg.attr('src',$(img).attr('src'));
			if ($(img).height() > $(img).width()) contentImg.css({'max-height':'500px'})
			$('#lightbox').fadeIn('400', function() {});
		},
		Hide : function() {
			$('#lightbox').fadeOut('200', function() {
				$('#lightbox #content img').attr('src','#');	
			});
			this.active = false;
			Timer.Start();
		}
	}

	function GetPreviousActiveSlideNumberAndDeactivate() {
		return slideNumbers.filter(function(el){
			if (!el.active) return false;
			el.active = false;
			return true;
		})[0];
	}

	$(document).on('click touchstart',"area",function(e){
		if ($('.tooltip').data('used-for') == $(this).attr('class')) {
			$('.tooltip').remove();
			return;
		}
		$('.tooltip').remove();
		var pos = $('.active .img_map').position();

		var ind = $(this).attr('class').slice(1).split('-').map(function(n){ return parseInt(n);});

		var point = data[ind[0]].points[ind[1]];

		var tooltip = 
		$("<div class='tooltip'></div>")
		.css({opacity:0,left:(-pos.left),top:(-pos.top)})
		.data('used-for',$(this).attr('class'))
		.append('<div class="tooltip-controls"><div class="tooltip-btn close">&#10006;</div></div>')
		.append($("<h3 class='tooltip-title'></h3>").html(point.title))
		.append($("<div class='tooltip-content'></div>").append(point.content))
		.append('<div class="tooltip-arrow"></div>')
		.appendTo('.slider-list .active .img_map');

		var areaData = $(this).attr('coords').split(',').map(function(c){return parseFloat(c);});

		var PositionTooltip = function() {
			var center = GetCenterOfPolygon(areaData);
			Update.ImageValues();
			var correction = TooltipPositionCorrection(center,tooltip);
			tooltip
			.addClass(correction.class)
			.css({left:(center.x + correction.x),top:(center.y + correction.y),opacity:1});
		}

		if ($('.tooltip img').length) $('.tooltip img').load(PositionTooltip);
		else PositionTooltip();

	});

	$(document).on('mouseover','.slider-list',function(){
		Timer.Stop();
		if (!$('.slider-list .active').length) {
			var slide = slideNumbers[PrevActiveSlide.next];
			slide.active = true;
			var getActive = function(el) {return $(el).data('slide-number') == slide.number;}
			$($('.slider-list > li, .slides-titles > li')
				.toArray()
				.filter(getActive))
			.addClass('active');
		}
	});

	$(document).on('click','.slides-titles > li',function(e){
		
		zoom(1.0/scale);
		$('.slides-titles .active, .slider-list .active').removeClass('active');
		var target = $(e.currentTarget).addClass('active');

		target = $('.slider-list > li').toArray().filter(function(el){
			return $(el).data('slide-number') == target.data('slide-number');
		});

		if (target.length) {
			setTimeout(function(){
				$(target[0]).addClass('active');
				Update.ControlsStatus();
				var active = $('.active .img_map');
				var activeImg = active.find('img');
				active.css({left:0,top:0});
				

				if (activeImg.width() > active.width()) active.css('width',activeImg.width());
				else if (activeImg.height() > active.height()) active.css('height',activeImg.height());

				
				$('.tooltip').remove();
				GetPreviousActiveSlideNumberAndDeactivate();
				slideNumbers[$('.slider-list .active').data('slide-number')-1].active = true;
			},slideTransitionTime);
		}
	});

	$(document).on('dragstart','.active .img_map, li.active',function(){return false;});
	$(document).on('mousedown','.active .img_map',function(event){Events.StartDrag(event,'Cursor')});
	$(document).on('touchstart','.active .img_map',function(event){Events.StartDrag(event,'Touch')});
	$(document).on('mousemove','.slider-list',function(event){Events.WhileDrag(event,'Cursor');});
	$(document).on('touchmove','.slider-list',function(event){Events.WhileDrag(event,'Touch');});
	$(document).on('mouseup touchend','.slider-list',function() {
		img.obj = null;
	});
	$(document).on('click touchstart','.tooltip-controls .close',function(e){$('.tooltip').remove();});
	$(document).on('click','.zoomout',function(e){zoom(1-zoomer + 0.0109);});
	$(document).on('click','.zoomin',function(e){zoom(1+zoomer);});
	$(document).on('click','.reset',function(e){zoom(1.0/scale);});
	$(document).on('click','.slideshow.button.stop',Timer.Stop);
	$(document).on('mouseleave','.slider-list',Timer.Start);
	$(document).on('click','.slideshow.button.play',Timer.Start);
	
	$(document).on('click','.tooltip-content img',function(e){
		LightBox.Show(this);
	});

	$(document).on('click','#lightbox .close-btn',function() {
		LightBox.Hide();
	});

	function resizeViewport() {
		var wrapper = $('.val-slider-wrapper');
		var imgWrappers = $('.img_map');
		var images = $('.img_map img');
		
		if ($(document).width() > 801) return;
		
		var size = {width:'100%',height:'100%'};
		if (wrapper.width() > wrapper.height()) size.height = 'auto';
		else if (wrapper.width() < wrapper.height()) size.width = 'auto';
		
		imgWrappers.css(size);
		images.css(size);

		cur_w = imgWrappers.width();
		cur_h = imgWrappers.height();

		img.frame  = {
			top    : $('.active .img_map').position().top,
			left   : $('.active .img_map').position().left,
			width  : $('.active .img_map').parent().width(),
			height : $('.active .img_map').parent().height()
		}

		var current = {
			width : $('.active .img_map img').width(),
			height : $('.active .img_map img').height(),
			all : true
		}

		$('.img_map').valSlider('resize',current);

		Update.ImageValues();
		Update.TooltipPosition();
		Update.ControlsStatus(1);
	}

	$(window).on('resize',function(){
		resizeViewport();
	});

	resizeViewport();

	function slideShowStart(){

		PrevActiveSlide = GetPreviousActiveSlideNumberAndDeactivate();

		$('.slides-titles .active, .slider-list .active').removeClass('active');

		var transition = setTimeout(function(){
			var slide = slideNumbers[PrevActiveSlide.next];
			slide.active = true;
			var getActive = function(el) {return $(el).data('slide-number') == slide.number;}
			$($('.slider-list > li, .slides-titles > li').toArray().filter(getActive)).addClass('active');
			PrevActiveSlide = null;
			Update.ControlsStatus();
			Timer.Start();
		},slideTransitionTime);

		Timer.Start(transition);
	}

	Generate.LightBox();
	Timer.Start();

});