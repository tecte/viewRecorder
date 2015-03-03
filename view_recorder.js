/**
viewRecorder
The jQuery plugin for doing record activity user.
(c) 2015 Hansen Wong
License & Info: http://www.rockbeat.web.id
	
Powered by the Rockbeat Platform : http://www.rockbeat.web.id/product/viewrecorder

@overview	##Info
@version	1.1
@license	licensed under GPL.
@author		Hansen Wong - e-mail@huanghanzen@gmail.com
*/
function viewRec(opts){
	var record,play,fn = {};
	var cache = {};
	var data = [];
	var timeCache;
	var index = 0;
	var config = $.extend({
		interval:500,
		mark_classname:'vr-mark',
		pointer_idname:'vr-pointer',
		target:window
	},opts);
	var jquery = $(config.target);
	/**
	Construct
	@access private
	**/
	var _construct = function(){
		cache.btn = 0;
		cache.pointer = {x:0,y:0};
		jquery.mousemove(function(e){
			cache.pointer = {
				x:e.pageX,
				y:e.pageY,
			};
		});
		jquery.mousedown(function(e){
			if(e.which !== 0){
				switch(e.button){
				 case 0:cache.btn = 1;break;
				 case 1:cache.btn = 2;break;
				 case 2:cache.btn = 3;break;
				 default: cache.btn = 'N/A';break;
				}
			}
		});
	};
	fn.version = '1.1';
	/**
	Start Record
	**/
	fn.startRecord = function(){
		fn.clearMark();
		fn.clearData();
		timeCache = new Date();
		record = setInterval(_updateData,config.interval);
	};
	/**
	Stop Record
	**/
	fn.stopRecord = function(){
		jquery.trigger('stop_record');
		clearInterval(record);
	}
	/**
	updating record data
	@access private
	**/
	var _updateData = function(){
		jquery.trigger('recording');
		var newTime = new Date();
		cache.scroll = {
			y: $(window).scrollTop(),
			x: $(window).scrollLeft(),
		};
		cache.time = newTime - timeCache;
		cache.id = index;
		timeCache = newTime;
		data.push([
			cache.pointer.x, // 0 mouse pointer x
			cache.pointer.y, // 1 mouse pointer y
			cache.scroll.x,  // 2 scroll position x
			cache.scroll.y,  // 3 scroll position y
			cache.btn,   	 // 4 mouse press button
			cache.time,      // 5 time interval
			cache.id         // 6 id event
		]);
		index++;
		cache.btn = 0;
		jquery.trigger('update');
	};
	fn.clearMark = function(){
		$('.'+config.mark_classname).remove();
	};
	/**
	Playing Record
	**/
	fn.play = function(){
		if(!$('#'+config.pointer_idname).length){
			$('body').after('<div id="'+config.pointer_idname+'" style="position:absolute;top:0;"></div>');
		}
		var i = 0;
		fn.clearMark();
		if(!play){
			if(typeof data[i] !== 'undefined'){
			play = setInterval(function(){
				if(typeof data[i] !== 'undefined'){
					jquery.trigger('play');
					$('#'+config.pointer_idname).animate({top:data[i][1],left:data[i][0]},data[i][5]);
					$(window).scrollTop(data[i][3]);
					$(window).scrollLeft(data[i][2]);
					if(data[i][4] != 0){
						var btn = data[i][4]+' Click';
						$('body').after('<div class="'+config.mark_classname+' '+btn+'" style="position:absolute;top:'+data[i][1]+'px;left:'+data[i][0]+'px;">'+btn+'</div>');
					}
					i++;
					console.log(data[i]);
				}
				else{
					fn.stop();					
				}
			},data[i][5]);
			}
			else{
				fn.stop();
				console.log('No data');
			}
		}
		return this;
	};
	fn.stop = function(){
		clearInterval(play);
		jquery.trigger('stop');
		play ='';
		return this;
	};
	/**
	return data record
	@return array
	**/
	fn.getData = function(){
		return data;
	};
	/**
	set data record
	@param array
	**/
	fn.setData = function(d){
		data = d;
		return this;
	};
	/**
	clear all data record
	**/
	fn.clearData = function(){
		data = [];
		console.log('Data Cleared');
		return this;
	};
	/**
	Event calback
	**/
	fn.on = function(a,b){
		return jquery.on(a,b);
	};
	_construct();
	return fn;
};
