/**
 * Created by Ly on 2016/3/31.
 */
'use strict';
var arr = ['11111111','11111111','阿拉里看的见覅档案局安宽带接口及覅地方看到','阿拉里看的见覅档案局安宽带接口及覅地方看到阿拉里看的见覅档案局安宽带接口及覅地方看到','三季度开始减肥','圣诞节疯狂的减肥is','顶顶顶顶顶是看见的方式开发if阿卡酒店房间爱的疯狂'];
var arrN = 0;
$(function () {
	// 弹幕
	var bulletTimer = null;
	var box = $('.p-bullet-box');
	box.step = 50;
	upBullet(box);
	bulletTimer = window.setInterval(function () {
		upBullet(box);
	}, 1500);

	// 心
	var hN = 1;
	$('.unit').live('touchend', function(){
		// 点击效果
		var obj = $(this);
		if(obj.parent().css('opacity') != 1){ return;}
		obj.addClass('active');
		if(!obj.hasClass('on')){ obj.addClass('on');}
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
		moveHeart.top = Number(moveHeart.attr('top')) + 10;

		if(hN == 1) hN = -1;
		else hN = 1;
		moveHeart.dir = hN;
		moveHeart.k = 10 + Math.random()*20; // 幅度 20
		moveHeart.v = 30 + Math.random()*20; // 速度 20
		moveHeart.w = 2*Math.PI/(70 + Math.random()*10); // 周期T=2π/w，w= 2π/T
		moveHeart.timer = window.setInterval(function () {
			var t1 = new Date().getTime();
			var x = (t1 - moveHeart.t0)/1000*moveHeart.v;
			if(x > moveHeart.top) {
				clearInterval(moveHeart.timer);
				moveHeart.remove();
			}
			var y = moveHeart.dir * moveHeart.k*Math.sin(moveHeart.w*x);
			moveHeart.attr('style','left:'+moveHeart.attr('left')+'px; top:'+moveHeart.attr('top')+'px; -webkit-transform:translate3d('+y+'px,-'+x+'px,0); transform:translate3d('+y+'px,-'+x+'px,0); opacity:'+parseFloat((moveHeart.top-x)/moveHeart.top)+';');
		}, 100);
		return false;
	});

	// ajax
	ajaxGetJson();
	// 弹幕开关
	$('.p-danChange').on('touchend', function () {
		if(this.dataset.onoff == 'on'){
			this.dataset.onoff = 'off';
			clearInterval(bulletTimer);
			box.html('');
			return false;
		} else {
			this.dataset.onoff = 'on';
			box.show();
			upBullet(box);
			bulletTimer = window.setInterval(function () {
				upBullet(box);
			}, 1500);
			return false;
		}
	});
	// 发送评论
	$('.p-danBtn').on('touchend', function(){
		var p_alert = $('.p-alert');
		p_alert.css({'opacity':'1', 'z-index': '200'});
		setTimeout(function () {
			p_alert.css({'opacity':'0', 'z-index': '0'});
		}, 2000);

		/*var p_danIpt = $.trim($('.p-danIpt').val());
		if (p_danIpt != '') {
			$.ajax({
				url: location.protocol + '//' + location.host + '/share/comment/add',
				dataType: 'json',
				data: {
					shareId: getQueryStringArgs().shareId,
					text: p_danIpt
				},
				success: function(d){
					if (d.code == 0) {
						var p_alert = $('.p-alert');
						p_alert.css({'opacity':'1', 'z-index': '200'});
						setTimeout(function () {
							p_alert.css({'opacity':'0', 'z-index': '0'});
						}, 2000);
					}
				}
			})
		}*/
		return false;
	});
});

// 弹幕刷新
function upBullet(box) {
	var maxN = 5+1;
	var marginT = 16;
	var op = ['0', '0.4', '0.7', '1', '1', '1'];

	var aBox = box.find('.unitbox');
	var l = aBox.length;
	// console.log(l);
	// $('#log').append('<p>'+l+'</p>');
//		aBox.show();
	// 5条
	if(l > maxN){ aBox.eq(0).remove();}
	var step = aBox[l-1] ? (aBox[l-1].clientHeight + marginT): 50;
	box.find('.unitbox').each(function(i){
		var obj = $(this);
		obj.show().attr('top',obj.attr('top') - step);
		// if(obj.attr('opacity') == 0) {obj.remove();}
		if(l<maxN){ var opp = op[i+(maxN-l)];}
		else {var opp = op[i];}
		obj.attr('style','-webkit-transition: -webkit-transform 0.5s ease-in, opacity 0.5s ease; transition: transform 0.5s ease-in, opacity 0.5s ease;-webkit-transform:translate3d(0, '+obj.attr('top')+'px, 0); transform:translate3d(0, '+obj.attr('top')+'px, 0); opacity:'+ opp +';');
	});

	var $unit = $('<section class="unitbox" top="0" style="-webkit-transform:translate3d(0, 0, 0); transform:translate3d(0, 0, 0); opacity: 0;">' +
		'<div class="unit">' +
		'<img class="face" src="images/temp/c_cover.jpg" alt="">' +
		'<p class="text">'+ arr[++arrN%arr.length] +
		'</p></div></section>');
	box.append($unit);
}

//url地址段最后带参数，例如：'?shareId=1111'
//获取查询字符串参数
function getQueryStringArgs() {
	var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
		args = {},
		items = qs.length ? qs.split("&") : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;
	for (i = 0; i < len; i++) {
		item = items[i].split('=');
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	}
	return args;
}

function ajaxGetJson() {
	$.ajax({
		// url: location.protocol + '//' + location.host + '/share/detail',
		url: location.protocol + '//' + location.host + '/LEO/js/data/mind_detail.json',
		dataType: 'json',
		data: {
			// shareId: getQueryStringArgs().shareId
		},
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.p-header-h2').html(data.title); //标题
				$('.user-img img').attr('src',data.background); //封面
				$('.mind-txt').html(data.content); //描述
				$('.mind-award').find('em').html(data.rewardNum); //打赏人数

				var rewardHeadLength = data.rewardHeadUrls.length > 21? 21: data.rewardHeadUrls.length;
				var str = "";
				for (var i = 0; i < rewardHeadLength; i++) {
					var index = data.rewardHeadUrls[i];
					str += '<li><img src="'+index+'" alt=""></li>';
				}
				$('.mind-face').append(str);

				var lineLInt = parseInt(data.likeNum / (data.likeNum+data.stepNum) * 100);
				var lineRInt = 100 - lineLInt;
				var lineLRate = lineLInt + '%';
				$('.line-l').css('width',lineLRate);
				$('.line-l-n').html(data.likeNum + '('+ lineLInt +'%)');
				$('.line-r-n').html(data.stepNum + '('+ lineRInt +'%)');

				var recommend = data.recommend;
				var ulRecommend = $('<ul></ul>');
				for (var i = 0; i< recommend.length; i++) {
					var index = recommend[i];
					ulRecommend.append('' +
						'<li>' +
							'<a href="'+ index.url +'">' +
								'<figure>' +
									'<img src="'+ index.background +'" alt="">' +
								'</figure>' +
								'<p>'+ index.title +'</p>' +
							'</a>' +
						'</li>');
				}
				$('.mind-sug').append(ulRecommend);
			}
		},
		error: function(e){

		}
	})
}

