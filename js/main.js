/**
 * Created by Ly on 2016/3/31.
 */
'use strict';
var arr = ['11111111','11111111','阿拉里看的见覅档案局安宽带接口及覅地方看到','阿拉里看的见覅档案局安宽带接口及覅地方看到阿拉里看的见覅档案局安宽带接口及覅地方看到','三季度开始减肥','圣诞节疯狂的减肥is','顶顶顶顶顶是看见的方式开发if阿卡酒店房间爱的疯狂'];
var N = 0;
$(function () {

	// 弹幕
	var box = $('.p-bullet-box');
	box.step = 50;
	upBullet(box);
	window.setInterval(function () {
		upBullet(box);
	}, 1500);

	// 心
	var hN = 1;
	$('.unit').live('click', function(){
		// 点击效果
		var obj = $(this);
		if(obj.parent().css('opacity') != 1){ return;}

		obj.addClass('active');
		if(!obj.hasClass('on')){
			obj.addClass('on');
		}
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

		if(hN == 1) hN = -1;
		else hN = 1;
		moveHeart.dir = hN;
		moveHeart.k = 15 + Math.random()*5; // 幅度 20
		moveHeart.v = 15 + Math.random()*5; // 速度 20
		moveHeart.w = 2*Math.PI/(70 + Math.random()*10); // 周期T=2π/w，w= 2π/T

		// console.log(moveHeart);
		moveHeart.timer = window.setInterval(function () {
			var t1 = new Date().getTime();
			var x = (t1 - moveHeart.t0)/1000*moveHeart.v;
			if(x > moveHeart.top) {
				clearInterval(moveHeart.timer);
				moveHeart.remove();
			}

			var y = moveHeart.dir * moveHeart.k*Math.sin(moveHeart.w*x);
			// var s = moveHeart.attr('style');
			moveHeart.attr('style','left:'+moveHeart.attr('left')+'px; top:'+moveHeart.attr('top')+'px; -webkit-transform:translate3d('+y+'px,-'+x+'px,0)');
		}, 100);
	});
});

// 弹幕刷新
function upBullet(box) {
	var maxN = 5+1;
	var marginT = 16;
	var op = ['0', '0.4', '0.7', '1', '1', '1'];

	var aBox = box.find('.unitbox');
	var l = aBox.length;
	aBox.show();
	console.log(l);
	// 5条
	if(l > maxN){
		var n = l - maxN;
		for(var i=0; i<n; i++){
			aBox[i].remove();
		}
	}

	var step = aBox[l-1] ? (aBox[l-1].clientHeight + marginT): 50;
	box.find('.unitbox').each(function(i){
		var obj = $(this);
		obj.show().attr('top',obj.attr('top') - step);
		// if(obj.attr('top') <= -340) {obj.remove();}
		if(l<maxN){ var opp = op[i+(maxN-l)];}
		else {var opp = op[i];}
		obj.attr('style','-webkit-transform:translate3d(0, '+obj.attr('top')+'px, 0); opacity:'+ opp +';');
	});

	var $unit = $('<section class="unitbox" top="0" style="-webkit-transform:translate3d(0, 30%, 0);">' +
		'<div class="unit">' +
		'<img class="face" src="images/temp/c_cover.jpg" alt="">' +
		'<p class="text">'+ arr[++N%arr.length] +'</p>' +
		'</div>' +
		'</section>');
	box.append($unit);
	$unit.hide();
}
