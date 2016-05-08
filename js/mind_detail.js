'use strict';
var arrN = 0;
var listJson;
var listJson1;
var listJson2;
var praiseArr = [];
var likestepArr = [];
var bulletTimer = null;
var box = $('.p-bullet-box');
var hN = 1;
var likeNum,stepNum;

var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forhappy';
var token = getQueryStringArgs().token == undefined? '' : getQueryStringArgs().token;
var uid = getQueryStringArgs().uid == undefined? '' : getQueryStringArgs().uid;

$(function () {
	// ajax创建DOM结构
	ajaxBuildDom();
	var shareIdJson = {
		shareId: getQueryStringArgs().shareId    //分享对话id
		// start: 0,            //起始位置
		// size: 10            //请求数量
	};
	$.ajax({
		url: location.protocol + '//' + location.host + '/share/comment/toplist?token=' + token,
		// url: './js/data/list_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(shareIdJson),
		success: function(a) {
			listJson = a.data.list;
			var shareIdJson = {
				shareId: getQueryStringArgs().shareId    //分享对话id
				// start: 0,            //起始位置
				// size: 10            //请求数量
			};
			// 弹幕
			$.ajax({
				url: location.protocol + '//' + location.host + '/share/comment/list?token=' + token,
				// url: './js/data/list_data.json',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify(shareIdJson),
				success: function(d){
					if (d.code == 0) {
						listJson2 = d.data.list;
						listJson = listJson.concat(listJson2);
						// 弹幕
						// box.step = 50;
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
							moveHeart(this);
							return false;
						});

						// 弹幕开关
						$('.p-danChange').on('touchend', function () {
							if(this.dataset.onoff == 'on'){
								this.dataset.onoff = 'off';
								$(this).addClass('off');
								clearInterval(bulletTimer);
								box.html('');
								return false;
							} else {
								this.dataset.onoff = 'on';
								$(this).removeClass('off');
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

		}
	});
	// 发送评论
	$('.p-danBtn').on('touchend', function(){
		var p_danIpt = $.trim($('.p-danIpt').val());
		if (p_danIpt != '') {
			var danIptJson = {
				shareId: getQueryStringArgs().shareId,
				text: p_danIpt
			};
			$.ajax({
				url: location.protocol + '//' + location.host + '/share/comment/add?token=' + token,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify(danIptJson),
				success: function(d){
					if (d.code == 0) {
						var p_alert = $('.p-alert');
						p_alert.css({'opacity':'1', 'z-index': '200'});
						setTimeout(function () {
							p_alert.css({'opacity':'0', 'z-index': '-10'});

						}, 2000);

					}
				}
			})
		}
		return false;
	});
	// 点赞
	$('#mind-up-btn').on('touchend',function(){
		var likeJson = {
			shareId: getQueryStringArgs().shareId,
			uid: uid,
			type: 1
		};
		if (likestepArr.indexOf('like') == -1) {
			likestepArr.push('like');
			likestepLine(++likeNum,stepNum);
			$.ajax({
				url: location.protocol + '//' + location.host + '/share/detail/like_step?token=' + token,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify(likeJson),
				success: function(d){
					if (d.code == 0) {

					}
				}
			})
		}
	});
	// 踩
	$('#mind-down-btn').on('touchend',function(){
		var stepJson = {
			shareId: getQueryStringArgs().shareId,
			uid: uid,
			type: 2};
		if (likestepArr.indexOf('step') == -1) {
			likestepArr.push('step');
			likestepLine(likeNum,++stepNum);
			$.ajax({
				url: location.protocol + '//' + location.host + '/share/detail/like_step?token=' + token,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset=UTF-8',
				data: JSON.stringify(stepJson),
				success: function(d){
					if (d.code == 0) {

					}
				},
				error: function(e,d){
					// alert(JSON.stringify(e));
					// alert(d);
				}
			})
		}
	});

	var str = location.href + '#';
	// var str = arr[0]+ '?shareId=0&token=' + token + '&uid=' + uid;
	// $('.mind-award .p-btn').attr('href', str);

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
		if($(this).find('.unit').hasClass('on')){ opp = 0.4;}

		obj.attr('style','-webkit-transition: -webkit-transform 0.5s ease-in, opacity 0.5s ease; transition: transform 0.5s ease-in, opacity 0.5s ease;-webkit-transform:translate3d(0, '+obj.attr('top')+'px, 0); transform:translate3d(0, '+obj.attr('top')+'px, 0); opacity:'+ opp +';');
	});
	var tureText = listJson[arrN%listJson.length].text.substring(0,38);
	var $unit = $('<section class="unitbox" top="0" style="-webkit-transform:translate3d(0, 0, 0); transform:translate3d(0, 0, 0); opacity: 0;">' +
		'<div class="unit" data-id="'+ listJson[arrN%listJson.length].keyId +'">' +
		'<img class="face" src="'+ listJson[arrN%listJson.length].headUrl +'" alt="">' +
		'<p class="text">'+ tureText + '</p>' +
		'</div></section>');
	box.append($unit);
	arrN ++;
}

// 生成桃心
function moveHeart(obj) {
	var heart = $('<i class="heart"></i>');
	// var t = heart;

	heart.attr({
		left: parseFloat(obj.parentNode.offsetLeft),
		top: parseFloat(obj.parentNode.offsetTop + Number(obj.parentNode.getAttribute('top')))
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
	var lr = l+r;
	if (l+r == 0) {
		lr = 1;
	}
	var lineLInt = parseInt(l / lr * 100);
	var lineRInt = 100 - lineLInt;
	var lineLRate = lineLInt + '%';
	$('.line-l').css('width',lineLRate);
	$('.line-l-n').html(l + '('+ lineLInt +'%)');
	$('.line-r-n').html(r + '('+ lineRInt +'%)');
}


// 创建DOM结构
function ajaxBuildDom() {
	var shareIdJson = {
		shareId: getQueryStringArgs().shareId
	};
	$.ajax({
		// url: location.protocol + '//' + location.host + '/share/detail?token=' + token,
		url: './js/data/mind_detail_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(shareIdJson),
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.p-header-h2').html(data.title); //标题
				$('.user-img img').attr('src',data.background); //封面
				$('.mind-txt').html(data.content); //描述
				$('.mind-award').find('em').html(data.rewardNum); //打赏人数
				$('.mind-talkShow').html(data.talkShow);
				$('.mind-award .p-btn').html(data.buttonTitle);
				$('.mind-vote h3').html('【'+ data.tellMe +'】');
				$('#mind-up-btn').html(data.likeText);
				$('#mind-down-btn').html(data.stepText);

				var rewardHeadLength = data.headUrl.length > 21? 21: data.headUrl.length;
				var str = "";
				for (var i = 0; i < rewardHeadLength; i++) {
					var index = data.headUrl[i];
					str += '<li><img src="'+index+'" alt=""></li>';
				}
				$('.mind-face').append(str);

				likeNum = data.likeNum;
				stepNum = data.stepNum;
				likestepLine(likeNum,stepNum);

				getRecommend();

				if (token == '') {
					$('a').attr('href',downloadUrl);
					$('.p-btmfix-s-1').show();
					$('.p-wrap:before').show();
				}
			}
		},
		error: function(e){

		}
	})
}

function getRecommend() {
	var shareIdJson = {
		shareId: getQueryStringArgs().shareId
	};
	$.ajax({
		url: location.protocol + '//' + location.host + '/share/recommend_list?token=' + token,
		// url: './js/data/recommend_list_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(shareIdJson),
		success: function(d){
			if (d.code == 0) {
				var recommend = d.data.list;
				var ulRecommend = $('<ul></ul>');
				for (var i = 0; i< recommend.length; i++) {
					var index = recommend[i];
					ulRecommend.append('' +
						'<li>' +
						'<a href="'+ index.url + '?token='+ token +'&shareId=' + index.hotId +'">' +
						'<figure>' +
						'<img src="'+ index.background +'" alt="">' +
						'</figure>' +
						'<p>'+ index.title +'</p>' +
						'</a>' +
						'</li>');
				}
				$('.mind-sug').append(ulRecommend);

			}

		}
	});

}

// 弹幕点赞提交
function praiseAjax(unitId) {
	if (praiseArr.indexOf(unitId) == -1) {
		var unitIdJson = {
			commentId: unitId
		};
		$.ajax({
			url: location.protocol + '//' + location.host + '/share/comment/praise?token=' + token,
			type: 'POST',
			dataType: 'json',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify(unitIdJson),
			success: function(d){
				praiseArr.push(unitId);
			}
		})
	}

}


