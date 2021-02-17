/*
 Created by lianxiaozhuang;
 Snake Game;
  created-start-time:2017/3/30;
  end-time:2017/4/17;
 * */
;
(function(win, doc, $, undefined) {
	var Snake = function(main, sele, start, score, stop) {
		this.author = "lianxiaozhuang";
		this.main = $("." + main); //div
		this.sele = $("." + sele); //select下拉框
		this.start = $("." + start); //开始按钮
		this.stop = $("." + stop); //开始按钮
		this.scoreSpan = $("." + score).find("span"); //分数	容器
		this.score = "0"; //初始化分数
		this.snakeWidth = 10; //默认食物或者蛇身身宽度（和css样式中的保持一样）
		this.snakeNum = 5; //当前蛇身个数
		this.speed = 50; //移动一格所用时间（大于0）
		this.speedGap = 50; //移动与下一格的时间间隔（大于0）
		this.timer = null; //当前执行动画的定时器；
		this.dir = { //当前蛇头方向
			up: false,
			down: false,
			left: false,
			right: true
		};
		this.secondKey = { //防止二次按键导致定时器累加
			up: true,
			down: true,
			left: false,
			right: true
		};
		this.snakeBodyArr = [ //蛇身位置容器
			{top: "200px",left: "210px"},
			{top: "200px",left: "200px"}, 
			{top: "200px",left: "190px"}, 
			{top: "200px",left: "180px"}, 
			{top: "200px",left: "170px"}
		];
		this.init();
	}
	Snake.prototype = {
		constructor: Snake,
		init: function() {
			var _this = this;
			var start = function() {
				doc.onkeydown = function(evt) {
					var e = win.event || evt;
					_this.keyBoardEvent(e); //keyBoardEvent键盘事件中获取不到实例的this，用参数传进来
				}
			};
			_this.start.click(function() { //点击开始
				_this.scoreSpan.html(_this.score); //初始化分数
				var _val = _this.sele.val();
				_this.render(_val); //传参绘制画布；初始化蛇 与食物
				start();
			});
			_this.start.click(); //测试用；默认刚加载页面时 点击了开始按钮
			_this.stop.click(function() {
				clearInterval(_this.timer);
			})
		},
		render: function(_val) { //绘制画布；初始化蛇 与食物
			var _this = this;
			var $s = _this.main.find(".s");
			var j = 0,
				html = "",
				classN = "";
			var $obox = this.main.find(".o-box");
			if(_val == "small") {
				j = 400;
				classN = "small";
			} else if(_val == "middle") {
				j = 600;
				classN = "middle";
			} else if(_val == "big") {
				j = 800;
				classN = "big";
			}
			for(var i = 0; i < j * j / 100; i++) {
				html += '<div class="o"></div>'
			}
			this.main.removeClass("small middle big").addClass(classN);
			$obox.html(html);
			this.main.hide().show();
			this.main.find(".snake-box .c").remove();
			this.main.find(".snake-box").append($('<div class="c"></div>'));		
			
			$s.each(function(index, element) {//初始化蛇身
				$(element).css({
					"top": _this.snakeBodyArr[index].top,
					"left": _this.snakeBodyArr[index].left
				});
			});
			this.foodRadomPosition(); //食物随机位置
		},
		foodRadomPosition: function() { //食物的随机位置设置，若与蛇身重合重新设置
			var _this = this,m = Math,
				$snakeleft, $snaketop, //蛇身每一方块相对与盒子的位置
				dleft, dtop, //蛇与食物的距离
				$top, $left; //食物随机位置
			var lap = false; //食物与蛇不重合
			var $s = _this.main.find(".s"); //蛇身
			var $c = _this.main.find(".c"); //食物
			var _snake_box = _this.main.find(".snake-box"); //snake-box
			var _snake_box_left = _snake_box.offset().left,
				_snake_box_top = _snake_box.offset().top; //snake-box的位置
			//递归实现 生成满足要求的随机位置
			var radomSet = function() {
					lap = false; //循环调用时初始化       "是否重合标志"  ，防止死循环
					$top = _this.radomNum(), //每一次递归调用的随机数都不一样
						$left = _this.radomNum();
					//console.log($top+" "+$left);					
					$s.each(function(index, element) {
							var _left = $(element).offset().left; //对蛇的每一个方块循环；当前块相对于window的位置_left和_top
							var _top = $(element).offset().top;
							$snakeleft = _left - _snake_box_left; //蛇相对于snake-box的left值 $snakeleft
							$snaketop = _top - _snake_box_top;
							//食物与蛇身 距离 绝对值
							dleft = m.abs($snakeleft - $left), dtop = m.abs($snaketop - $top);
							//console.log(dleft+" "+dtop);
							if(dleft < _this.snakeWidth && dtop < _this.snakeWidth) { //食物与蛇身left 与 top同时小于自身高度，重合									
								//console.log("有重合");
								lap = true; //重合
								return false; //有重合；跳出循环									
							}
						}) //end each									
					if(!lap) { //若第一组随机数满足要求；直接返回位置数的对象
						//console.log("生成位置对象")
						return {
							"$top": $top,
							"$left": $left
						}
					} else { //若第一组随机数不满足要求(蛇与食物重合)，则递归调用						
						return radomSet();
					}
				} //end radomSet	
			var tempPositionObj = radomSet(); //获取生成的 位置对象;
			$c.css({ //利用radomSet()返回的对象  ； 设置食物的位置
				"top": tempPositionObj.$top,
				"left": tempPositionObj.$left
			}).show();
		},
		radomNum: function() { //食物top和left值得随机位置数（不超出画布），返回值 供radomPosition调用
			var m = Math;
			var _width = this.main.width();
			return m.max(0, parseInt(m.random() * _width / 10) * 10 - 10)
		},
		getCeil: function(a) { //蛇头坐标值向上取整(防止取得值为小数)
			return a % 10 == 0 ? a : 10 * (parseInt(a / 10) + 1)
		},
		getFloor: function(a) { //向下取整
			return a % 10 == 0 ? a : 10 * (parseInt(a / 10))
		},
		changeDirection: function(direc) { //按不同方向键后改变走向
			var _this = this;
			var $top, $left;
			var $s0 = this.main.find(".s0"); //蛇头
			if(direc == "up") { //上上上上上上上上上上上上上上上上上上上上上上上上上上上上上上上					
				_this.secondKeySet("up"); //一旦按下;设置标记											
				if(_this.secondKey.up) {
					clearInterval(_this.timer);
					_this.secondKey.up = _this.secondKey.down = false; //防止二次按up键导致定时器叠加//防止倒退
					_this.timer = setInterval(function() {
						$top = $s0.position().top - 10;
						if(_this.dir.left) {
							$left = _this.getFloor($s0.position().left);
						} else if(_this.dir.right) {
							$left = _this.getCeil($s0.position().left);
							//console.log($left)
						}
						//首次
						else if(_this.dir.up){
							$left = $s0.position().left
						}
						_this.dirSet("up")
						//
						_this.eatFood($top, $left);
						_this.animateSnake($top, $left);
					
					}, _this.speedGap + _this.speed + 100)
				}
			} else if(direc == "down") { //下下下下下下下下下下下下下下下下下下下下下下下下下下下下下
				_this.secondKeySet("down");
				if(_this.secondKey.down) {
					clearInterval(_this.timer);
					_this.secondKey.up = _this.secondKey.down = false; //防止二次按up键导致定时器叠加//防止倒退																						
					_this.timer = setInterval(function() {
						$top = $s0.position().top + 10;
						if(_this.dir.left) {
							$left = _this.getFloor($s0.position().left);
						} else if(_this.dir.right) {
							$left = _this.getCeil($s0.position().left);
						}
						//
						else if(_this.dir.down){
							$left = $s0.position().left
						}
						_this.dirSet("down")
						//
						_this.eatFood($top, $left);
						_this.animateSnake($top, $left);
						
					}, _this.speedGap + _this.speed + 100)
				}
			} else if(direc == "left") { //左左左左左左左左左左左左左左左左左左左左左左左左左左
				_this.secondKeySet("left");
				if(_this.secondKey.left) {
					clearInterval(_this.timer);
					_this.secondKey.right = _this.secondKey.left = false; //防止二次按键导致定时器叠加																				
					_this.timer = setInterval(function() {
						$left = $s0.position().left - 10;
						if(_this.dir.up) {
							$top = _this.getFloor($s0.position().top);
						} else if(_this.dir.down) {
							$top = _this.getCeil($s0.position().top);
						}
						//
						else if(_this.dir.left){
							$top = $s0.position().top
						}
						_this.dirSet("left")
						//
						_this.eatFood($top, $left);
						_this.animateSnake($top, $left);
					}, _this.speedGap + _this.speed + 100)
				}
			} else if(direc == "right") { //右右右右右右右右右右右右右右右右右右右右右右右右右右右右右右右右右右				 
				_this.secondKeySet("right");
				if(_this.secondKey.right) {
					clearInterval(_this.timer);
					_this.secondKey.right = _this.secondKey.left = false; //防止二次按键导致定时器叠加																																													
					_this.timer = setInterval(function() {
						$left = $s0.position().left + 10;
						if(_this.dir.up) {
							$top = _this.getFloor($s0.position().top);
						} else if(_this.dir.down) {
							$top = _this.getCeil($s0.position().top);
						}
						//
						else if(_this.dir.right){
							$top = $s0.position().top
						}
						_this.dirSet("right")
						//
						_this.eatFood($top, $left);
						_this.animateSnake($top, $left);
					}, _this.speedGap + _this.speed + 100)
				}
			}
		},
		eatFood: function($top, $left) {
		
			var _this = this;
			var $s0 = this.main.find(".s0"); //蛇头
			var $c = _this.main.find(".c"); //食物
			var _snake_box = _this.main.find(".snake-box"); //snake-box
			var $last = _snake_box.find(".s:last");
			var $last_top = _this.getFloor($last.position().top),
				$last_left = _this.getFloor($last.position().left);			
			var dtop = $s0.position().top - $c.position().top,
				dleft = $s0.position().left - $c.position().left;		
			if(dtop==0 && dleft== 0) {//吃
				$c.hide();
				_snake_box.append($('<div class="s" style="z-index:' + _this.snakeNum + '"></div>').css({
					top: $last_top,
					left: $last_left
				}));
				_this.snakeBodyArr.unshift({top: $top,left: $left});
				_this.foodRadomPosition();
				_this.snakeNum++;
				_this.score++;
				_this.scoreSpan.html(_this.score);
				if(_this.score>=5){//修改速度
					_this.speed = 20;
					_this.speedGap = 10;
				}else if(_this.score>=10){//修改速度
					_this.speed = 5;
					_this.speedGap = 0;
				}
			}
		},
		animateSnake: function($top, $left) {
			var _this = this;
			var $s0 = this.main.find(".s0"); //蛇头
			var _width =  this.main.width()-this.snakeWidth;
			var $s = this.main.find(".s"); //蛇身 
			_this.snakeBodyArr.pop();
			_this.snakeBodyArr.unshift({top: $top,left: $left});
			var _left = $s0.position().left,_top = $s0.position().top;
			if(_top<0||_left<0||_top>_width||_left>_width){//游戏结束
				clearInterval(_this.timer);
				alert("game over!");
				return;
			}
			
			$s.each(function(index, element) {
				$(element).animate({
					"top": _this.snakeBodyArr[index].top,
					"left": _this.snakeBodyArr[index].left
				}, _this.speed);
			});
			
		},
		dirSet: function(flag) {
			var _this = this;
			if(flag == "up") {
				_this.dir.up = true;
				_this.dir.down = false;
				_this.dir.left = false;
				_this.dir.right = false;
			} else if(flag == "down") {
				_this.dir.up = false;
				_this.dir.down = true;
				_this.dir.left = false;
				_this.dir.right = false;
			} else if(flag == "left") {
				_this.dir.up = false;
				_this.dir.down = false;
				_this.dir.left = true;
				_this.dir.right = false;
			} else if(flag == "right") {
				_this.dir.up = false;
				_this.dir.down = false;
				_this.dir.left = false;
				_this.dir.right = true;
			}
		},
		secondKeySet: function(mark) { //相对于当前移动方向的    “左边与右边方向 ”   的 二次按键标记
			var _this = this;
			if(mark == "up" || mark == "down") {
				_this.secondKey.left = true;
				_this.secondKey.right = true;
			} else if(mark == "left" || mark == "right") {
				_this.secondKey.up = true;
				_this.secondKey.down = true;
			}
		},
		keyBoardEvent: function(e) {			
			var _key = e.keyCode || e.which;　　
			var _this = this;
			switch(_key) {　　　　
				case 37: //左键					
					_this.changeDirection("left");　　　　
					break;　　　　
				case 38: //向上键					
					_this.changeDirection("up");
					break;　　　　
				case 39: //右键					
					_this.changeDirection("right");　　　　
					break;　　　　
				case 40: //向下键					
					_this.changeDirection("down");　　　
					break;　　　　
				case 13: //回车键					　
					alert("暂停");　
					break;
				case 32: //空格					
					clearInterval(_this.timer)　;
					break;
				default:					
					_this.changeDirection("right");　　　
					break;
			}　　
		}

	}
	win.Snake = Snake;
}(window, document, jQuery))