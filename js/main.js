/**
 * Created by Ly on 2016/3/31.
 */
'use strict';

$(function () {

	// 弹幕
	var box = $('.bullet-box');
	var N = 0;
	window.setInterval(function () {

		box.find('.unitbox').each(function(){
			$(this).attr('top',$(this).attr('top') - 50);
			if($(this).attr('top') <= -340) {
				this.remove();
			}
			$(this).attr('style','-webkit-transform:translate3d(0, '+$(this).attr('top')+'px, 0);');
		});

		var $unit = $('<section class="unitbox" top="-50" style="-webkit-transform:translate3d(0, 30%, 0);"><div class="unit"><img class="face" src="images/temp/c_cover.jpg" alt=""><p class="text">new'+ ++N +'</p></div></section>');
		box.append($unit);

	}, 2000);

	// 心
	$('.unit').live('click', function(){
		// 点击效果
		var $t = $(this);
		$t.addClass('active');
		window.setTimeout(function () {
			$t.removeClass('active');
		}, 300);

		// 轨迹
		var k = 20; // 幅度
		var v = 20; // 速度
		var w = 2*Math.PI/80; // 周期T=2π/w，w= 2π/T

		// var l = this.parentNode.offsetLeft;
		// var t = this.parentNode.offsetTop + this.parentNode.getAttribute('top');
		var moveHeart = $('<i class="heart"></i>');

		moveHeart.attr({
			left: parseFloat(this.parentNode.offsetLeft),
			top: parseFloat(this.parentNode.offsetTop + Number(this.parentNode.getAttribute('top')))
		}).css({
			left: moveHeart.attr('left') + 'px',
			top: moveHeart.attr('top') + 'px'
		});
		box.append(moveHeart);
		// console.log(this.parentNode.offsetLeft);
		// console.log(this.parentNode.offsetTop);


		moveHeart.t0 = new Date().getTime();

		// moveHeart.top = parseFloat($t.css('top')) + 20;
		moveHeart.top = parseFloat($t.parent().css('top'))+parseFloat($t.parent().attr('top')) + 10;
		console.log('top:'+moveHeart.top);

		moveHeart.timer = window.setInterval(function () {
			// y=k*sin(w*x)
			var t1 = new Date().getTime();
			var x = (t1 - moveHeart.t0)/1000*v;
			if(x > moveHeart.top) {
				clearInterval(moveHeart.timer);
				moveHeart.remove();
			}
			var y = k*Math.sin(w*x);
			var s = moveHeart.attr('style');
			moveHeart.attr('style','left:'+moveHeart.attr('left')+'px; top:'+moveHeart.attr('top')+'px; -webkit-transform:translate3d('+y+'px,-'+x+'px,0)');
		}, 100);

	});

});