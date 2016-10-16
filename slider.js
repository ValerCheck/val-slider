$(document).ready(function(){

	const img_w = 1021;
	const img_h = 941;
	var scale = 1,slideNumbers=[],currentSlide,lastSlideNumber = 0;
	var mapOptions = {
		fillColor: '0168c4',
		strokeColor : '000000',
		strokeWidth : 1,
        //fillOpacity: 1,
        //stroke : true,
        scaleMap : false,
        isSelectable: false
	};

	var data = [{
		set : 1,
		title : 'Georgia State University',
		imageUrl : './images/map.png'
	},{
		set: 2,
		imageUrl : './images/map-1.png',
		points : [
			{
				data : [525,463,545,436,575,461,553,485,536,473]
			}
		],
		title : 'Georgia State University 1940'
	},{
		set: 3,
		imageUrl : './images/map-2.png',
		points : [
			{
				data : [569.3,482,599,446.9,622.8,467.9,593,503.1]
			}
		],
		title : 'Georgia State University 1950'
	},{
		set: 4,
		imageUrl : './images/map-3.png',
		points : [
			{ data : [475,535.5,494,512,520,535.5,499.5,555] },
			{ data : [525,535,555,498,585,521,555,558] },
			{ data : [568,557,595.5,523,623,544,595.5,578] },
			{ data : [517,615.5,526.5,603,543,615.5,534,628] }
		],
		title : 'Georgia State University Campus 1960'
	},{
		set: 5,
		imageUrl : './images/map-4.png',
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
		imageUrl : './images/map-5.png',
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
		imageUrl : './images/map-6.png',
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
		imageUrl : './images/map-7.png',
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
		imageUrl : './images/map-8.png',
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
			.attr({
				coords : ScaleCoordinates(point.data),
				onclick : 'alert("Hello")'
			}));
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

		var imageUrl = data.filter(function(el){ return el.set == number; })[0].imageUrl;

		var map = $(slide).children('map');
		map = map.length ? $(map[0]) : ($("<map></map>").attr({id:'map-'+number,name:'map-'+number}));
		$(slide).children('img').attr({id:'img-map-'+number,usemap:'#'+map.attr('name'),src:(imageUrl)});

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
		for (var i = 1; i < lastSlideNumber; i++) 
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
		ImageValues : function() {
			var imgMap = $('.active .img_map');
			var pos = imgMap.position();
			img.obj 	= imgMap;
			img.left 	= pos.left;
			img.top 	= pos.top;
			img.width 	= imgMap.width();
			img.height 	= imgMap.height();
		},
		DeltaValues : function() {
			delta.left 		= (cursor.x - img.left) || 0;
			delta.top 		= (cursor.y - img.top) || 0;
			delta.width 	= img.left + img.width;
			delta.height 	= img.top + img.height;
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
			if (scale * mul < 1 || scale == 1) $('.zoomout').attr('disabled','disabled');
			else $('.zoomout').removeAttr('disabled');
		}
	}

	const zoomer = 0.1;

	function redrawTooltips(){
		var tooltips = $('.tooltips');
		$('div.img_map').append(tooltips);
		var tooltip = $('.tooltip.active');
		if (tooltip.length) tooltip.css({top:(tooltip.position().top - (tooltip.height()/2))});
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
		//active.find('.img_map:not(.mapster_el)').mapster('unbind');

		setTimeout(function(){
			var number = slideNumbers[prevActive.next].number;
			slideNumbers[prevActive.next].active = true;
			$('.slider-list [data-slide-number=' + number + ']').addClass('active');
			var elem = $('.slides-titles > li').toArray().filter(function(el){return $(el).data('slide-number')==number;});
			$(elem).addClass('active');
			setTimeout(slideShowStart,6000);
		},250);

	}

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
					$(this).css({width:args[0].width,height:args[0].height});
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
		
		Update.ControlsStatus(mul);
	}

	function StartDrag(event) {
		Update.Cursor(event);
		Update.ImageValues();
		Update.DeltaValues();
	}

	function StartTouchDrag(event) {
		event.preventDefault();
		Update.Touch(event);
		Update.ImageValues();
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

	controls.appendTo('.val-slide');
	$('.zoomout').attr('disabled','disabled');

	$(document).on('dragstart','.active .img_map',function(){return false;});
	$(document).on('mousedown','.active .img_map',StartDrag);
	$(document).on('touchstart','.active .img_map',StartTouchDrag);
	$(document).on('mousemove','.slider-list',WhileDrag);
	$(document).on('touchmove','.slider-list',WhileTouchDrag);
	$(document).on('mouseup','.slider-list',function(){img.obj = null});
	$(document).on('touchend','.slider-list',function(){img.obj = null});
	$(document).on('click','.slides-titles > li',function(e){
		$('.slides-titles li.active').removeClass('active');
		var target = $(e.currentTarget).addClass('active');
		
		$('.slider-list .active')
		.removeClass('active');
		target = $('.slider-list > li').toArray().filter(function(el){
			return $(el).data('slide-number') == target.data('slide-number');
		});

		if (target.length) {
			target = $(target[0]);
			setTimeout(function(){
				scale = 1;
				target.addClass('active');
				Update.ControlsStatus();
				
			},250);
		}
	});
	$(document).on('click','.zoomout',function(){zoom(1-zoomer + 0.019);});
	$(document).on('click','.zoomin',function(){zoom(1+zoomer);});
	$(document).on('click','.reset',function(){zoom(1.0/scale);});
	
	//setTimeout(slideShowStart,6000);

});