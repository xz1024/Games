/*
 Lian-Russia Block Game,
 date:2017/5/3--2017/5/9
 * */
(function(win, doc, $, undefined) {
	var K = function(k) {
		var $k = $("."+k);
		this.author="lianxiaozhuang";
		this.method="核心思想：用一个监测函数checkOverLap(时刻监测是否超出盒子或者与内部方块重合),"+
							"若当前移动不符合要求(超出的或者重合了)则隐式的撤回当前步";
		this.main = $k.find(".main");
		this.mainWidth = this.main.width();
		this.mainHeight = this.main.height();
		this.next = $k.find(".next");
		this.score =0;//分数值
		this.sel = $k.find(".sel");
		this.start = $k.find(".start");
		this.stop = $k.find(".stop");
		this.timer = null;//定时器
		this.index =0;//初始下落块的索引(可修改)
		this.width = 30;//方块宽(和css样式保持一致)
		this.speed = 400;//下落块定时器速度
		this.mark = false;//暂停或者开始标记
		this.end = false;//游戏结束标记
		this.init();
	}
	K.prototype = {
		constructor: K,
		init: function() {
			var _this = this;
			var flag= false;	//二次点击标记	
			this.start.click(function() {//点击开始
				if(!_this.end){//游戏结束标记(标记为true停止任何键盘或鼠标事件)
					_this.mark = true;//用于点击start和stop之间切换的标记
					$(this).addClass("active").siblings().removeClass("active");
					if(!flag){//防止二次点击
						flag = true;									
						if(_this.main.find(".running").length!=0){//中途暂停后在点击开始
							_this.goDown();//下落函数
						}else{//首次点开始
							_this.main.append(_this.blockStr[_this.index]);
							//下落块顺序出现
							_this.index  = (_this.index >= _this.blockClass.length-1) ? 0 : _this.index+1;
							//右侧的下一块提示窗
							_this.next.find("."+_this.blockClass[_this.index]).show().siblings().hide();
							_this.goDown();
						}	
					}
				}				
			});		
			this.stop.click(function(){	//暂停
				if(!_this.end){//游戏结束标记(标记为true停止任何键盘或鼠标事件)
					flag = false;
					_this.mark = false;//用于点击start和stop之间切换的标记
					clearInterval(_this.timer);
					//点击start和stop按钮后的颜色变化
					$(this).addClass("active").siblings().removeClass("active");	
				}											
			});
			doc.onkeydown = function(evt) {//键盘
				if(!_this.end){//游戏结束标记(标记为true停止任何键盘或鼠标事件)
					_this.keyBoardEvent(win.event || evt);
				}				
			}
		},
		blockClass: ["o", "l", "oooo","bar","zhuang","o", "l", "oooo","o", "l", "oooo","o", "l","oooo",],//块对应class名
		blockStr: [//每一个块的html代码、和上面的class名一一对应
			'<div class="running o top" style="left:150px;">'+
				'<div class="block"></div>'+
			'</div>',

			'<div class="running l top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',

			'<div class="running oooo top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',
			'<div class="running bar top" style="left:120px;top: -60px;">'+
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>'+
					'<div class="block ii"></div>'+
					'<div class="block iii"></div>'+
				'</div>'+		
			'</div>',
			
			'<div class="running zhuang top" style="left: 120px;top: -120px;">'+
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>'+
					'<div class="block ii"></div>'+
					'<div class="block iii"></div>'+
					'<div class="block iiii"></div>'+
					'<div class="block iiiii"></div>'+
					'<div class="block iiiiii"></div>'+
					'<div class="block iiiiiii"></div>'+
					'<div class="block iiiiiiii"></div>'+
					'<div class="block _i"></div>'+
					'<div class="block _ii"></div>'+
					'<div class="block _iii"></div>'+
					'<div class="block _iiii"></div>'+
					'<div class="block _iiiii"></div>'+
					'<div class="block _iiiiii"></div>'+
					'<div class="block _iiiiiii"></div>'+
				'</div>',
			'<div class="running o top" style="left:150px;">'+
				'<div class="block"></div>'+
			'</div>',

			'<div class="running l top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',

			'<div class="running oooo top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',
			'<div class="running o top" style="left:150px;">'+
				'<div class="block"></div>'+
			'</div>',

			'<div class="running l top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',

			'<div class="running oooo top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',
			
			'<div class="running o top" style="left:150px;">'+
				'<div class="block"></div>'+
			'</div>',

			'<div class="running l top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>',

			'<div class="running oooo top" style="left:120px;top:-30px;">' +
				'<div class="inset">'+
					'<div class="block i0"></div>'+
					'<div class="block i"></div>' +
					'<div class="block ii"></div>' +
					'<div class="block iii"></div>' +
				'</div>'+
			'</div>'
		],
		rotateBlock: function(dom) { //换class实现旋转(旋转的时候也是(先设置不可见)如果旋转后不满足要求就退回上一步操作;直到满足要求了块才会显示)
			var _this = this;
			var tempClassN = ["top","left", "bottom", "right"];//下落块的四个旋转方向对应的class数组
			var t = dom.attr("class").split(" ");//取出当前运动的running的class值放到一个数组
			var i = $.inArray(t[t.length - 1], tempClassN); //上面的那个末尾的class名在tempClassN中的位置
			var _i = (i+1==tempClassN.length)?0:i+1;//取tempClassN中的下一值（可循环）
			dom.removeClass(tempClassN[i]).addClass(tempClassN[_i]).css({"visibility":"hidden"});//先设置不可见。之后判断此步是否符合要求
			if(_this.checkOverLap()){//不符合要求
				dom.removeClass(tempClassN[_i]).addClass(tempClassN[i]).css({"visibility":"visible"});//退回上一次旋转(效果页面看不到的)
			}else{
				dom.css({"visibility":"visible"});//符合要求、显示
			}
		},
		moveBlock: function(dom, n){//左右移动
			var _this = this,a = 1;
			a = n?-1:1;	//系数a为正或负实现左移右移	
			var  _left = parseInt(dom.css("left"));			
			dom.css({"left":_left +a*_this.width,"visibility":"hidden"});
			//console.log(_this.checkOverLap());
			if(_this.checkOverLap()){//超出或者重合					
				var  _left = parseInt(dom.css("left"));	
				dom.css({"left":_left - a*_this.width,"visibility":"visible"});
			}else{
				dom.css({"visibility":"visible"});
			}
		},
		goDown:function(){//下落
			var _this = this;			
			_this.timer = setInterval(function() {								
				_this.interVal()
			 },_this.speed);			
		},
		fastGoDown:function(){//快速下落
			var _this = this;		
			clearInterval(_this.timer);
			_this.timer = setInterval(function() {	//实际上就是	goDown函数的一个快速的执行						
				_this.interVal()
			 },5);			
		},
		interVal:function(){//定时器内部下落实现的函数.供goDown和fastGoDown里的setInterval调用
			var  _this = this;			
			var r = _this.main.find(".running");				
			var _top  = r.offset().top;
			if(_top!=null){//经测试，防止按快速下落，ie8报错
				r.offset({"top":_top + _this.width}).css({"visibility":"hidden"});
			}										
			if(_this.checkOverLap()){//如果移动的这一步超出了范围或者重合了(不满足要求了).就让它退回来这一步(这都是隐藏操作的所以也没看不到)
				var _top = parseInt(r.css("top"));
				r.css({"top": _top - _this.width}).css({"visibility":"visible"});					
				clearInterval(_this.timer);					
				_this.checkGameOver(r);//检查游戏结束
				r.removeClass("running");
				r.find(".block").addClass("fallen");
				_this.checkOverFlow();//检查是否一行排满
				//重新开始下一轮降落
				if(!_this.end){//为true时停止下落函数的回调
					_this.main.append(_this.blockStr[_this.index]);
					var _val = _this.sel.val();		
					console.log(_val)
					if(_val=="1"){//顺序出现下落块
						_this.index  = (_this.index >= _this.blockClass.length-1) ? 0 : _this.index+1;
					}else if(_val=="0"){//随机
						_this.index = parseInt(Math.random()*_this.blockClass.length);														
					}
					//console.log(_this.index);
					_this.next.find("."+_this.blockClass[_this.index]).show().siblings().hide();					
					_this.goDown();	//设置完毕后回调
				}
								
			}else{//满足要求。显示当方块
				r.css({"visibility":"visible"});
			}
		},
		checkOverLap:function(){//移动过程中检测是否超出或者重合
			var m = Math,_this = this,overlap = false;
			var $main_left = this.main.offset().left,$main_top = this.main.offset().top;
			var e_left_min=Infinity,e_left_max=-Infinity,e_top_min=Infinity,e_top_max=-Infinity;			
			$(".running").find(".block").each(function(index,element){//取下落块的位置最值
				var e_left = $(element).offset().left,e_top = $(element).offset().top;					
				e_left_min = m.min(e_left_min,e_left);
				e_top_min = m.min(e_top_min,e_top);
				e_left_max = m.max(e_left_max,e_left);
				e_top_max = m.max(e_top_max,e_top);
			   $(".fallen").each(function(index,element){
			    	 var $f_top = $(element).offset().top,
			    	 	$f_left = $(element).offset().left;
			    	 	//console.log($left+" "+$f_left);				    	 	
			    	if(e_top==$f_top&&e_left==$f_left){
			    		overlap = true;
			    	}
			    });
			});	
			//不超出左边、右边和底部;且不与已经下落的方块重合
			//console.log($main_top+_this.mainHeight-e_top_max)
			if((e_left_min-$main_left>=0)&&($main_left+_this.mainWidth-_this.width-e_left_max >=0)
											&&($main_top+_this.mainHeight-e_top_max>0)&&(!overlap)){
				return false;//符合要求的移动
			}else{
				return true;//不合符要求
			}
		},
		checkOverFlow:function(){//若有一行排满；删除并得分
			var _this = this;			
			var ary = [], res = [];  
			$(".fallen").each(function(index,element){
				var $top = $(element).offset().top;
				ary.push($top);
			});			
			ary.sort();  
			//下面的两个for循环摘自网上；用于打印出一个js数组中个个元素出现的个数
			for(var i = 0;i<ary.length;){  				   
				var count = 0;  
				for(var j=i;j<ary.length;j++) {  				       
				   if(ary[i] == ary[j]){  
				  	 count++;  
				   }  				    
				 }  
				res.push([ary[i],count]);  
			 	i+=count;  				   
			}  
			//res 二维数维中保存了 值和值的重复数  
			for(var  i = 0 ;i<res.length;i++){  				
				// console.log("值:"+res[i][0]+"     重复次数:"+res[i][1]);  
				 if(res[i][1]==_this.mainWidth/_this.width){//如果有一行满了
				 	//console.log(res[i][0])
				 	$(".fallen").each(function(index,element){
						var $top = $(element).offset().top;
						if($top==res[i][0]){
							$(element).remove();
							_this.score++;//加分							
							$(".score").html(_this.score);
							if(_this.score>=100){//大于100分加速
								_this.speed=200;
							}
							if(_this.score>=200){
								alert("恭喜通关！！！！");
							}
						}											
					});
					$(".fallen").each(function(index,element){//本次删除行上面的块下移动一格						
						var _top  = $(element).offset().top;					
						if(_top<res[i][0]){
							$(element).offset({"top":_top + _this.width});
						}											
					});
				 }
			}
		},
		checkGameOver:function(dom){//检查游戏结束
			var _this = this;
			var $main_top = this.main.offset().top;
			//console.log($main_top);
			dom.each(function(index,element){//下落块下落完毕后检查有超出最上面的情况则Game Over
				if($(element).offset().top<$main_top){
					_this.end = true;
					if(_this.score<=50){//提示语设置
						var l ="垃圾！！"
					}else if(_this.score>50&&_this.score<=100){
						l = " 还行！"
					}else if(_this.score>100&&_this.score<=150){
						l =" 很棒！";
					}else if(_this.score>150&&_this.score<200){
						l =" 牛人！！！！";
					}else if(_this.score>=200){
						l =" 超越神啦！！！！";
					}
					alert("Game Over!"+"  "+"得分:"+_this.score+" "+l);					
					return;
				}
			});
		},
		keyBoardEvent: function(e) {
			var _this = this,
				_key = e.keyCode || e.which;　
			var $running = $(".main .running");
			switch(_key) {　　　　
				case 37: //左键	
					if(_this.mark){//暂停后不可操作
						_this.moveBlock($running, 1);
					}				
					break;　　　　
				case 38: //向上键	
					if(_this.mark){
						_this.rotateBlock($running);
					}					
					break;　　　　
				case 39: //右键		
					if(_this.mark){
						_this.moveBlock($running, 0);
					}						
					break;　　　　
				case 40: //向下键
					if(_this.mark){
						_this.fastGoDown($running);
					}
					break;　　　　
				case 13: //回车键					　

					break;
				case 32: //空格											
					return _this.mark?_this.stop.click():_this.start.click();
					break;
				default:					　　　
					break;
			}　　
		}
	}

	new K("k");

}(window, document, jQuery))