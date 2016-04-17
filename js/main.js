/**
 * Created by Ly on 2016/3/31.
 */
'use strict';

$(function () {
	// 弹幕
	var box = $('.p-bullet-box');
	upBullet(box);
	window.setInterval(function () {
		upBullet(box);
	}, 2000);

	// 心
	$('.unit').live('click', function(){
		// 点击效果
		var obj = $(this);
		obj.addClass('active');
		window.setTimeout(function () {
			obj.removeClass('active');
		}, 300);

		// 轨迹
		var moveHeart = $('<i class="heart"></i>');
		moveHeart.attr({
			left: parseFloat(this.parentNode.offsetLeft),
			top: parseFloat(this.parentNode.offsetTop + Number(this.parentNode.getAttribute('top')))
		}).css({
			left: moveHeart.attr('left') + 'px',
			top: moveHeart.attr('top') + 'px'
		});
		box.append(moveHeart);
		moveHeart.t0 = new Date().getTime();
		moveHeart.top = parseFloat(obj.parent().css('top'))+parseFloat(obj.parent().attr('top')) + 10;
		// console.log('top:'+moveHeart.top);

		moveHeart.dir = Math.random() - 0.5;
		moveHeart.k = 15 + Math.random()*5; // 幅度 20
		moveHeart.v = 15 + Math.random()*5; // 速度 20
		moveHeart.w = 2*Math.PI/(70 + Math.random()*10); // 周期T=2π/w，w= 2π/T

		console.log(moveHeart);
		moveHeart.timer = window.setInterval(function () {
			var t1 = new Date().getTime();
			var x = (t1 - moveHeart.t0)/1000*moveHeart.v;
			if(x > moveHeart.top) {
				clearInterval(moveHeart.timer);
				moveHeart.remove();
			}
			var y = -moveHeart.k*Math.sin(moveHeart.w*x);
			// var s = moveHeart.attr('style');
			moveHeart.attr('style','left:'+moveHeart.attr('left')+'px; top:'+moveHeart.attr('top')+'px; -webkit-transform:translate3d('+y+'px,-'+x+'px,0)');
		}, 100);
	});
});

function upBullet(box,N) {
	box.find('.unitbox').each(function(){
		var obj = $(this);
		obj.attr('top',obj.attr('top') - 50);
		if(obj.attr('top') <= -340) {obj.remove();}
		obj.attr('style','-webkit-transform:translate3d(0, '+obj.attr('top')+'px, 0);');
	});

	var $unit = $('<section class="unitbox" top="-50" style="-webkit-transform:translate3d(0, 30%, 0);"><div class="unit"><img class="face" src="images/temp/c_cover.jpg" alt=""><p class="text">new'+ ++N +'</p></div></section>');
	box.append($unit);
}

function upHeart(moveHeart) {
	var k = 15 + Math.random()*5; // 幅度 20
	var v = 15 + Math.random()*5; // 速度 20
	var w = 2*Math.PI/80; // 周期T=2π/w，w= 2π/T

	var t1 = new Date().getTime();
	var x = (t1 - moveHeart.t0)/1000*v;
	if(x > moveHeart.top) {
		clearInterval(moveHeart.timer);
		moveHeart.remove();
	}
	var y = k*Math.sin(w*x);
	// var s = moveHeart.attr('style');
	moveHeart.attr('style','left:'+moveHeart.attr('left')+'px; top:'+moveHeart.attr('top')+'px; -webkit-transform:translate3d('+y+'px,-'+x+'px,0)');
}