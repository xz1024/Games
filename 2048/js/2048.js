/**
 * 2017.6.9-
 */
(function(win,doc,$,undefined){
	
	var G2048 = function(dom){
		this.c = $(dom);
		this.autor="lianxiaozhuang";
		this.method="对盒子中每一块设置标记；比如位置00,01,02.....,移动方向键时逐行（或列）遍历方块使之移动（实现数的叠加）"
		this.arr = ["2","4","8","16","32","64","128","256","512","1024","2048"];
		this.arrClassName = ["b2","b4","b8","b16","b32","b64","b128","b256","b512","b1024","b2048"];
		this.b_width = 100;//方块宽 。与css保持一致
		this.maxNum = 16;//盒子最多容纳方块个数
		this.initNum = 2;//初始化进来个数
		this.end = false;//结束标志	
		this.timer = null;//移动后延迟添加方块
		this.arrCoreAdd();//ie8添加indexOf方法
		this.init();
	}
	G2048.prototype = {
		constructor:G2048,
		init:function(){
			var _this = this;			
			while(_this.initNum>0){//初始化（盒子里扔进几个最初的块）
				_this.initNum--;
				_this.radomCreateBlock();				
			}
			doc.onkeydown = function(evt) {//键盘		
				if(!_this.end){//结束标志
					_this.keyBoardEvent(win.event || evt);	//键盘事件 
					clearTimeout(_this.timer);
					_this.timer = setTimeout(function(){
						_this.radomCreateBlock();//添加一块
					},300)					
				}										
			}		
		},
		arrCoreAdd:function(){//解决ie8下数组没有indexOf()方法报错
			if (!Array.prototype.indexOf){
			 Array.prototype.indexOf = function(elt /*, from*/){
			    var len = this.length >>> 0;			
			    var from = Number(arguments[1]) || 0;
			    from = (from < 0)? Math.ceil(from): Math.floor(from);
			    if (from < 0)
			      from += len;			
			    for (; from < len; from++){
			      if (from in this &&this[from] === elt)
			        return from;
			    }
			    return -1;
			  };
			}
		},
		radomCreateBlock:function(){//随机生成一块放到盒子
			var _this = this;			
			var c_width = _this.c.width();				
			var c_top = this.c.offset().top,c_left = this.c.offset().left;
			var bl = '<div class="set block b2">'+_this.arr[0]+'</div>';
			_this.c.append($(bl).css({"visibility":"hidden"}));	//先不显示；后判断是否重合
			var $set =  $(".set");
			if($(".ready").length==_this.maxNum){//满了
				_this.end = true;
				alert("Game Over !");
			}						
			if(!_this.end){				
				do{//设置随机位置直到合适为止
				$set.offset({
					"top": c_top+parseInt(Math.random()*4)*_this.b_width,
					"left":c_left+parseInt(Math.random()*4)*_this.b_width
				})
				}while(_this.checkLap().lap)//位置不合适false时；在执行do语句	
			}						
			_this.setMark($set);//设置标记
			$set.css({"visibility":"visible"}).removeClass("set").addClass("ready");	//显示		
		},
		checkLap:function(){//监测本次是否超出或者重合
			var _this = this;
			var lap  = false;//不重合标志
			var s_top = $(".set").offset().top,s_left = $(".set").offset().left;
			_this.c.find(".ready").each(function(index,element){
				var r_top = $(element).offset().top,r_left = $(element).offset().left;		
				if(r_top-s_top==0&&r_left-s_left==0){
					lap = true;//重合
					return false;					
				}
			})
			return{
				lap:lap
			}
		},
		moveBlock:function(dir){//移动			
			var _this = this;		
			var c_top = this.c.offset().top,c_left = this.c.offset().left;			
			if(dir=="left"){/////////////////////////
				for(var loop=0;loop<=3;loop++){//循环四次目的（因为没按一次方向键块只移动一部；一个方向最多移动四次可保证此方向不能再移动）
					for(var i=0;i<=3;i++){//行
						var ii = i.toString();//转为串
						for(j=1;j<=3;j++){//列（从左到右）							
							var jj = j.toString();
							var jj_next = (j-1).toString();//当前块的左边的那一块所在列数														
							var $now= $('.ready[mark="'+ii+jj+'"]');	//当前	
							var  $now_next = $('.ready[mark="'+ii+jj_next+'"]');//当前块左边那一块
							if($now.length!=0){//遍历当前位置存在
								var $now_left = $now.offset().left;
								if($now_next.length!=0){//当前块的左边不为空白位								
									if($now.text()== $now_next.text()){//两块值相等；重叠并求和
										$now_next.remove();//移除重叠块（其中的一个）
										var $text = $now.text();
										var $index = _this.arr.indexOf($text);	//当前移动块的值在数组的下标										
										$now.offset({"left":$now_left-100 }).text(_this.arr[$index+1])
											.removeClass(_this.arrClassName[$index]).addClass(_this.arrClassName[$index+1]);//数值改变，并更换class名
										
									}
								}else{//当前块的左边为空白																
									$now.offset({"left":$now_left-100})
								}
								_this.setMark($now);//当前块从新设置标记
							}														
						}
					}
				}							
			}else if(dir=="right"){////////////////					
				for(var loop=0;loop<=3;loop++){//循环四次目的（因为每按一次方向键块只移动一步，一个方向最多移动四次可保证此方向不能再移动）
					for(var i=0;i<=3;i++){//行
						var ii = i.toString();//数转字符串						
						for(j=2;j>=0;j--){//列（从右到左）												
							var jj = j.toString();//转化为字符串
							var jj_next = (j+1).toString();//当前块的右边的那一块所在列
							var $now= $('.ready[mark="'+ii+jj+'"]');	//当前	
							var  $now_next = $('.ready[mark="'+ii+jj_next+'"]');//当前块右边那一块							
							if($now.length!=0){//遍历当前位置存在
								var $now_left = $now.offset().left;
								if($now_next.length!=0){//当前块的右边不为空白位								
									if($now.text()== $now_next.text()){//两块值相等；重叠并求和
										$now_next.removeClass("ready").hide().remove();//移除重叠块（其中的一个）
										var $text = $now.text();
										var $index = _this.arr.indexOf($text);	//当前移动块的值在数组的下标										
										$now.offset({"left":$now_left+100 }).text(_this.arr[$index+1])
											.removeClass(_this.arrClassName[$index]).addClass(_this.arrClassName[$index+1]);//数值改变，并更换class名
										
									}
								}else{//当前块的右边为空白																
									$now.offset({"left":$now_left+100})
								}
								_this.setMark($now);//当前块从新设置标记
							}																									
						}
					}
				}											
			}else if(dir=="up"){///////////////////
				for(var loop=0;loop<=3;loop++){//循环四次目的（因为每按一次方向键块只移动一步，一个方向最多移动四次可保证此方向不能再移动）
					for(var j=0;j<=3;j++){//列
						var jj = j.toString();//数转字符串						
						for(i=1;i<=3;i++){//行（从上到下）					
							
							var ii = i.toString();//转化为字符串
							var ii_next = (i-1).toString();//当前块的上边的那一块所在行
							var $now= $('.ready[mark="'+ii+jj+'"]');	//当前	
							var  $now_next = $('.ready[mark="'+ii_next+jj+'"]');//当前块上边那一块						
							if($now.length!=0){//遍历当前位置存在
								var $now_top = $now.offset().top;
								if($now_next.length!=0){//当前块的上边不为空白位								
									if($now.text()== $now_next.text()){//两块值相等；重叠并求和
										$now_next.remove();//移除重叠块（其中的一个）
										var $text = $now.text();
										var $index = _this.arr.indexOf($text);	//当前移动块的值在数组的下标										
										$now.offset({"top":$now_top-100 }).text(_this.arr[$index+1])
											.removeClass(_this.arrClassName[$index]).addClass(_this.arrClassName[$index+1]);//数值改变，并更换class名
										
									}
								}else{//当前块的上边为空白																
									$now.offset({"top":$now_top-100})
								}
								_this.setMark($now);//当前块从新设置标记
							}																									
						}
					}
				}	
				
			}else if(dir=="down"){///////////////////
				
				for(var loop=0;loop<=3;loop++){//循环四次目的（因为每按一次方向键块只移动一步，一个方向最多移动四次可保证此方向不能再移动）
					for(var j=0;j<=3;j++){//列
						var jj = j.toString();//数转字符串						
						for(i=2;i>=0;i--){//行（从下到上）					
							
							var ii = i.toString();//转化为字符串
							var ii_next = (i+1).toString();//当前块的下边的那一块所在行
							var $now= $('.ready[mark="'+ii+jj+'"]');	//当前	
							var  $now_next = $('.ready[mark="'+ii_next+jj+'"]');//当前块下边那一块							
							if($now.length!=0){//遍历当前位置存在
								var $now_top = $now.offset().top;
								if($now_next.length!=0){//当前块的下边不为空白位								
									if($now.text()== $now_next.text()){//两块值相等；重叠并求和
										$now_next.remove();//移除重叠块（其中的一个）
										var $text =$now.text();
										var $index = _this.arr.indexOf($text);	//当前移动块的值在数组的下标										
										$now.offset({"top":$now_top+100 }).text(_this.arr[$index+1])
											.removeClass(_this.arrClassName[$index]).addClass(_this.arrClassName[$index+1]);//数值改变，并更换class名
										
									}
								}else{//当前块的上边为空白																
									$now.offset({"top":$now_top+100})
								}
									_this.setMark($now);//当前块从新设置标记
								
								
							}																									
						}
					}
				}	
				
			}						
		},
		setMark:function(dom){//遍历每一块;设置标记(对应所在位置的行列)
			var c_top = this.c.offset().top,c_left = this.c.offset().left;						
			var $left = dom.offset().left,$top = dom.offset().top;
			var left_mark = Math.round(($left-c_left)/100).toString(),//此处加Math.round()防止ie解析的不为整数而错误							
				top_mark = Math.round(($top-c_top)/100).toString();
			dom.attr("mark",top_mark+left_mark);//比如第一行第一块设置为"00"								
						
		},		
		keyBoardEvent: function(e) {//键盘事件
			var _this = this,
				_key = e.keyCode || e.which;　			
			switch(_key) {　　　　
				case 37: //左键	
					_this.moveBlock("left");					
					break;　　　　
				case 38: //向上键	
					_this.moveBlock("up");					
					break;　　　　
				case 39: //右键		
					_this.moveBlock("right");				
					break;　　　　
				case 40: //向下键
					_this.moveBlock("down");
					break;　　　　
				case 13: //回车键					　

					break;
				case 32: //空格											
				
					break;
				default:					　　　
					break;
			}　　
		}
	}
	new G2048(".c")
}(window,document,jQuery))
