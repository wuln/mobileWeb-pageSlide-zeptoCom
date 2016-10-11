(function(){
	var defaults = {
		container : '#container',//容器
		sections : '.section',//子容器
		easing : 'ease',//特效方式，ease-in,ease-out,linear
		'duration' : 1000,//每次动画执行的时间
		'pagination' : true,//是否显示分页
		'loop' : false,//是否循环		
		'direction' : 'vertical'//滑动的方向 horizontal,vertical,		
	};

	var win = $(window),
		container,
		sections;
	var opts = {},		
		iIndex = 0;

	//zepto对象级别组件开发$.fn===Zepto.fn
	var SP = $.fn.switchPage = function(options){
		opts = $.extend({}, defaults , options||{});
		container = $(opts.container);
		sections = container.find(opts.sections);		

		return this.each(function(){			
			if(opts.direction == "horizontal"){
				initLayout();
				container.on('swipeLeft', swipeUpHandler);
				container.on('swipeRight', swipeDownHandler);	
			}else {
				container.on('swipeUp', swipeUpHandler);
				container.on('swipeDown', swipeDownHandler);
			}	
			if(opts.pagination){
				initPagination();
			}		
		});
	}
	//向上或向左滑动事件
	function swipeUpHandler() {
		if (iIndex < sections.length-1) {
			iIndex++;
		} else if(opts.loop){
			iIndex = 0;
		}
		swipePage(sections.eq(iIndex));
	}
	//向下或向右滑动事件
	function swipeDownHandler() {
		if (iIndex > 0) {
			iIndex--;
		} else if(opts.loop){
			iIndex = sections.length-1;
		}
		swipePage(sections.eq(iIndex));
	}

	//页面滑动事件
	function swipePage(element){
		var dest = element.position();  //{top,left}
		if(typeof dest === 'undefined'){ return; }
		initEffects(dest,element);
	}	

	//横向布局初始化
	function initLayout(){
		var length = sections.length,
			width = (length*100)+"%",
			cellWidth = (100/length).toFixed(2)+"%";
		container.width(width);
		sections.width(cellWidth).addClass("left");
	}

	//初始化分页
	function initPagination(){
		var length = sections.length;
		if(length){
			var pageHtml = '<ul id="pages"><li class="active"></li>';
			for(var i=1;i<length;i++){
				pageHtml += '<li></li>';
			}
			pageHtml += '</ul>';
			$("body").append(pageHtml);	
		}		
	}

	//分页事件
	function paginationHandler(){
		var pages = $("#pages li");
		pages.eq(iIndex).addClass("active").siblings().removeClass("active");
	}

	//是否支持css的某个属性,property是属性数组
	function isSuportCss(property){
		var body = $("body")[0];
		for(var i=0; i<property.length;i++){
			if(property[i] in body.style){
				return true;
			}
		}
		return false;
	}

	//渲染效果
	function initEffects(dest,element){
		var transform = ["-webkit-transform","-ms-transform","-moz-transform","transform"],
			transition = ["-webkit-transition","-ms-transition","-moz-transition","transition"];
		
		if(isSuportCss(transform) && isSuportCss(transition)){
			var traslate = "";
			if(opts.direction == "horizontal"){
				traslate = "-"+dest.left+"px, 0px";
			}else{
				traslate = "0px, -"+dest.top+"px";
			}
			container.css({
				"transition":"all "+opts.duration+"ms "+opts.easing,
				"transform":"translate("+traslate+")"
			});			
		}else{
			var cssObj = (opts.direction == "horizontal")?{left: -dest.left}:{top: -dest.top};
			container.animate(cssObj, opts.duration);
		}	
		if(opts.pagination){
			paginationHandler();
		}
	}
	
})();
