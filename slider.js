$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var scale = 1,slideNumbers=[],currentSlide,lastSlideNumber = 0;

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
	},{
		set : 6,
		imageUrl : 'https://netcommunity.gsu.edu/view.image?Id=3015',
		points : [
			{ data: [388.5,476.9,411,448.8,430.5,464,408.2,492.2] },
			{ data: [487.5,454.8,510,426.8,529.5,442.2,507.8,470.2] },
			{ data: [515.8,566.9,531.3,550.1,543.2,561,527.9,577.9] },
			{ data: [604,519,615.5,505,635,522,623,536] },
			{ data: [647,465.5,682.5,427,711,451.7,675.4,490] },
			{ data: [748.6,392.6,748.6,371.4,763.8,371.4,763.8,392.6] },
			{ data: [856,395,856,368,875,368,875,395] }
		],
		title : 'Georgia State University Campus 1980'
	},{
		set : 7,
		points : [
			{ data : [353.9,199,366.3,189.2,374.1,198,361.5,207.8] },
			{ data : [364,225,383.7,208,397,222,377.1,239] },
			{ data : [348.3,236.5,359,226.1,373.7,241.5,362,251.9] },
			{ data : [308.2,338,323.5,324.4,334,335.5,318.5,349.6] },
			{ data : [330.8,359.5,358.5,334.1,366.6,342.5,339,368] },
			{ data : [292.1,387,305,372.8,324,389.5,311.5,403.2] },
			{ data : [391.4,418,408,395,427.5,407,410,430] },
			{ data : [438,448.5,456,426.7,487.1,449,469,472.3] },
			{ data : [688,494,720.5,458,740,476.5,707,512], fillColor: '000000' },
			{ data : [636,531,668,496,697,520,664,556] },
			{ data : [471.9,576.5,490.1,553.2,523.1,580.8,504,603.8], fillColor : '000000'}
		],
		title : 'Georgia State University Campus 1990'
	},{
		set : 8,
		points : [
			{ data : [836,182,836,119,943,119,943,182] },
			{ data : [375,257,405.5,229,426,252,395.5,280] },
			{ data : [699.9,425.5,726.8,395.5,749.6,415,723.5,445.5] },
			{ data : [728,450.5,756,419,773,435.5,745,466], fillColor: '000000' },
			{ data : [655.5,596.5,705.8,539.9,725.1,558.7,676.7,615.2] }
		],
		title : 'Georgia State University Campus 2000-2009' 
	},
	{
		set : 9,
		points : [
			{ data : [846,91,846,28,933,28,933,91] },
			{ data : [493,254,493,202,544,202,544,254] },
			{ data : [836,259,836,209,856,209,856,259] },
			{ data : [857,287,857,216,886,216,886,287], fillColor : '000000' },
			{ data : [498,305,498,264,546,264,546,305] },
			{ data : [794,287,794,270,822,270,822,287] },
			{ data : [460,386,460,317,496,317,496,386] },
			{ data : [498,387,498,318,527,318,527,387] },
			{ data : [529,386,529,318,583,318,583,386], fillColor : '000000' },
			{ data : [767,382,767,356,776,356,776,382] },
			{ data : [777,379,777,357,788,357,788,379] },
			{ data : [765,395,765,382,791,382,791,392] },
			{ data : [792,389,792,351,819,351,819,389] },
			{ data : [973,396,973,363,993,363,993,396] },
			{ data : [599,672.5,631,638,656,660,624,695] },
			{ data : [830,915,830,823,921,823,921,915] }
		],
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

	var controls = 
	$("<div class='slider-controls'></div>")
	.append($("<input type='button' class='zoomout button'>"))
	.append($("<input type='button' class='zoomin button active-btn' >"))
	.append($("<input type='button' class='reset button active-btn' >"));

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
			data[number].points.push({data:coords});
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

			if (scale * mul < 1 || scale == 1) Disable('.zoomout,.reset');
			else Enable('.zoomout,.reset');

			if (scale * mul > 2) Disable('.zoomin');
			else Enable('.zoomin');
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

		var tooltip = 
		$("<div class='tooltip'></div>")
		.css({opacity:0,left:(-pos.left),top:(-pos.top)})
		.data('used-for',$(this).attr('class'))
		.append('<div class="tooltip-controls"><div class="btn close">&#10006;</div></div>')
		.append("<h3 class='tooltip-title'>Sample title:</h3>")
		.append($("<div class='tooltip-content'></div>").append("<img src='http://www.cbgbuildingcompany.com/images/sus-building.jpg'/>"))
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
		
	});

	var timers = [];

	function ClearTimers(){
		while(timers.length) clearTimeout(timers.pop());
	}

	$('.slideshow-controls').addClass('stop');
	timers.push(setTimeout(slideShowStart,6000));

	var Timer = {
		Start : function(){
			timers.push(setTimeout(slideShowStart,6000));			
		},
		Stop : function(){
			while(timers.length) clearTimeout(timers.pop());
		}
	}

	$(document).on('mouseover','.slider-list',function(){
		Timer.Stop();
		$('.slideshow-controls').removeClass('play stop').addClass('play');
	});

	$(document).on('mouseleave','.slider-list',function(){
		Timer.Start();
		$('.slideshow-controls').removeClass('play stop').addClass('stop');
	});

	$(document).on('click','.slideshow-controls.play',function() {
		Timer.Start();
		$('.slideshow-controls').removeClass('play stop').addClass('stop');
	});

	$(document).on('click','.slideshow-controls.stop',function() {
		Timer.Stop();
		$('.slideshow-controls').removeClass('play stop').addClass('play');
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

		$('.slides-titles .active, .slider-list .active').removeClass('active');

		var t = setTimeout(function(){
			var number = slideNumbers[prevActive.next].number;
			slideNumbers[prevActive.next].active = true;

			var getActive = function(el) {return $(el).data('slide-number') == number;}

			var slide = $('.slider-list > li, .slides-titles > li').toArray().filter(getActive);
			$(slide).addClass('active');
			
			var t2 = setTimeout(function(){
				slideShowStart();
			},6000);
			timers.push(t2);
		},250);
		timers.push(t);

	}

});