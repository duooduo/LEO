/**
 * Created by Ly on 2016/3/31.
 */
'use strict';
var arrN = 0;
var listJson;
var praiseArr = [];
var likestepArr = [];
$(function () {
	// ajax创建DOM结构
	ajaxBuildDom();
	// 弹幕
	$.ajax({
		// url: location.protocol + '//' + location.host + '/share/comment/list',
		url: './js/data/list_data.json',
		dataType: 'json',
		data: {
			shareId: getQueryStringArgs().shareId,    //分享对话id
			start: 0,            //起始位置
			size: 10            //请求数量
		},
		success: function(d){
			if (d.code == 0) {
				listJson = d.data.list;
				// 弹幕
				var bulletTimer = null;
				var box = $('.p-bullet-box');
				box.step = 50;
				upBullet(box);
				bulletTimer = window.setInterval(function () {
					upBullet(box);
				}, 1500);

				// 弹幕点击
				var hN = 1;
				$('.unit').live('touchend', function(){

					// 伸缩效果
					var obj = $(this);
					var unitId = this.dataset.id;
					obj.addClass('active');
					if(!obj.hasClass('on')){
						obj.addClass('on');
						praiseAjax(unitId);   // 点赞调取后台接口
					}
					window.setTimeout(function () {
						obj.removeClass('active');
					}, 300);

					// 桃心轨迹
					moveHeart();
					return false;
				});

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

			}
		}
	});
	// 发送评论
	$('.p-danBtn').on('touchend', function(){
		var p_danIpt = $.trim($('.p-danIpt').val());
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
		}
		return false;
	});
	// 点赞
	$('#mind-up-btn').on('touchend',function(){
		if (likestepArr.indexOf('like') == -1) {
			$.ajax({
				url: location.protocol + '//' + location.host + ' /share/detail/like_step',
				dataType: 'json',
				data: {
					shareId: getQueryStringArgs().shareId,
					uid: '',
					type: 1
				},
				success: function(d){
					if (d.code == 0) {
						praiseArr.push('like');
						likestepLine(d.data.likeNum,d.data.stepNum);
					}
				}
			})
		}
	});
	// 踩
	$('#mind-down-btn').on('touchend',function(){
		if (likestepArr.indexOf('step') == -1) {
			$.ajax({
				url: location.protocol + '//' + location.host + ' /share/detail/like_step',
				dataType: 'json',
				data: {
					shareId: getQueryStringArgs().shareId,
					uid: '',
					type: 2
				},
				success: function(d){
					if (d.code == 0) {
						praiseArr.push('step');
						likestepLine(d.data.likeNum,d.data.stepNum);
					}
				}
			})
		}
	})
});

// 弹幕刷新
function upBullet(box) {
	var maxN = 5+1; // 5条
	var marginT = 16;
	var op = ['0', '0.4', '0.7', '1', '1', '1'];
	var aBox = box.find('.unitbox');
	var l = aBox.length;
	if(l > maxN){ aBox.eq(0).remove();}
	var step = aBox[l-1] ? (aBox[l-1].clientHeight + marginT): 50;
	box.find('.unitbox').each(function(i){
		var obj = $(this);
		obj.show().attr('top',obj.attr('top') - step);
		if(l<maxN){ var opp = op[i+(maxN-l)];}
		else {var opp = op[i];}
		if($(this).find('.unit').hasClass('on')){ opp = 0.2;}

		obj.attr('style','-webkit-transition: -webkit-transform 0.5s ease-in, opacity 0.5s ease; transition: transform 0.5s ease-in, opacity 0.5s ease;-webkit-transform:translate3d(0, '+obj.attr('top')+'px, 0); transform:translate3d(0, '+obj.attr('top')+'px, 0); opacity:'+ opp +';');
	});
	var tureText = listJson[arrN%listJson.length].text.substring(0,38);
	var $unit = $('<section class="unitbox" top="0" style="-webkit-transform:translate3d(0, 0, 0); transform:translate3d(0, 0, 0); opacity: 0;">' +
		'<div class="unit" data-id="'+ listJson[arrN%listJson.length].id +'">' +
		'<img class="face" src="images/temp/c_cover.jpg" alt="">' +
		'<p class="text">'+ tureText + '</p>' +
		'</div></section>');
	box.append($unit);
	arrN ++;
}

// 生成桃心
function moveHeart() {
	var heart = $('<i class="heart"></i>');
	heart.attr({
		left: parseFloat(this.parentNode.offsetLeft),
		top: parseFloat(this.parentNode.offsetTop + Number(this.parentNode.getAttribute('top')))
	}).css({
		left: heart.attr('left') + 'px',
		top: heart.attr('top') + 'px'
	});
	box.append(heart);
	heart.t0 = new Date().getTime();
	heart.top = Number(heart.attr('top')) + 10;

	if(hN == 1) hN = -1;
	else hN = 1;
	heart.dir = hN;
	heart.k = 10 + Math.random()*20; // 幅度 20
	heart.v = 30 + Math.random()*20; // 速度 20
	heart.w = 2*Math.PI/(70 + Math.random()*10); // 周期T=2π/w，w= 2π/T
	heart.timer = window.setInterval(function () {
		var t1 = new Date().getTime();
		var x = (t1 - heart.t0)/1000*heart.v;
		if(x > heart.top) {
			clearInterval(heart.timer);
			heart.remove();
		}
		var y = heart.dir * heart.k*Math.sin(heart.w*x);
		heart.attr('style','left:'+heart.attr('left')+'px; top:'+heart.attr('top')+'px; -webkit-transform:translate3d('+y+'px,-'+x+'px,0); transform:translate3d('+y+'px,-'+x+'px,0); opacity:'+parseFloat((heart.top-x)/heart.top)+';');
	}, 100);
}

// url地址段最后带参数，例如：'?shareId=1111'
// 获取查询字符串参数
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

// 刷新赞踩比率条
function likestepLine(l,r){
	var lineLInt = parseInt(l / (l+r) * 100);
	var lineRInt = 100 - lineLInt;
	var lineLRate = lineLInt + '%';
	$('.line-l').css('width',lineLRate);
	$('.line-l-n').html(l + '('+ lineLInt +'%)');
	$('.line-r-n').html(r + '('+ lineRInt +'%)');
}

// 创建DOM结构
function ajaxBuildDom() {
	$.ajax({
		// url: location.protocol + '//' + location.host + '/share/detail',
		url: './js/data/mind_detail_data.json',
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

				likestepLine(data.likeNum,data.stepNum);

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

// 弹幕点赞提交
function praiseAjax(unitId) {
	if (praiseArr.indexOf(unitId) == -1) {
		$.ajax({
			url: location.protocol + '//' + location.host + '/share/comment/praise',
			dataType: 'json',
			data: {
				commentId: unitId
			},
			success: function(d){
				praiseArr.push(unitId);
			}
		})
	}

}