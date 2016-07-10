/**
 * Created by Administrator on 2016/7/9.
 */


'use strict';

var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forhappy';
// var token = getQueryStringArgs().token == undefined? '' : getQueryStringArgs().token;
var token,isnotapp;
if(getQueryStringArgs().token == undefined){
	token = '';
	isnotapp = true;
} else {
	token = getQueryStringArgs().token;
	isnotapp = false;
}
var uid = getQueryStringArgs().uid == undefined? '' : getQueryStringArgs().uid;
var shareId = getQueryStringArgs().shareId == undefined? '' : getQueryStringArgs().shareId;
var keyId = getQueryStringArgs().keyId == undefined? '' : getQueryStringArgs().keyId;
var worryId = getQueryStringArgs().worryId == undefined? '' : getQueryStringArgs().worryId;
var topicId = getQueryStringArgs().topicId == undefined? '' : getQueryStringArgs().topicId;
var voiceId = getQueryStringArgs().voiceId == undefined? '' : getQueryStringArgs().voiceId;
var likeordislike = {'like': false, 'dislike': false};

//url地址段最后带参数，例如：'?shareId=10001'
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

function pauseAllAudio(that){
	$('.qa_listen').each(function(index,dom){
		var audio = $(dom).next().get(0);
		if(audio.played && dom != that){
			// console.log(1);
			audio.pause();
		}
	});
}

function toPlayVioce(){
	$('.qa_listen').on('click',function(){
		var willCost = $(this).attr('data-price');
		var that = this;
		if(willCost == 0 || willCost == -1 || willCost == -1.0){
			// console.log(thatIndex);
			pauseAllAudio(that);
			var audio = $(this).next().get(0);
			// console.log($audio);
			// $audio.get(0).play();
			if(audio.paused){
				audio.play();//播放
			}else if(audio.played){
				audio.pause();//暂停
			}
		}else {
			pauseAllAudio(that);
			var thisVoiceId = $(this).attr('data-voiceId');
			var thisPrice = $(this).attr('data-price');
			if(OCModel && OCModel.payForVoice) {
				var voiceInfo = {'voiceId': thisVoiceId,'price': thisPrice};
				OCModel.payForVoice(JSON.stringify(voiceInfo));
			}
		}
	});
}

function canListen(index) {
	var price = index.price;
	if(price == -1 || price == -1.0) {
		return '点击播放';
	}else if(price == 0) {
		return '限时免费听';
	}else{
		return (price + '元悄悄听');

	}
}

function toSendOperation(type) {
	var toSendOperationJson = {"voiceId": voiceId,"type": type};
	$.ajax({
		url: location.protocol + '//' + location.host + '/voice/operation?token=' + token,
		// url: './js/data/operation.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(toSendOperationJson),
		success: function (d) {
			console.log(d);
		},
		error: function(e){
			console.log(e);
		}
	})
}

function toSelectRandom(){
	$.ajax({
		url: location.protocol + '//' + location.host + '/voice/selectRandom?token=' + token,
		// url: './js/data/selectRandom.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		// data: ,
		success: function (d) {
			console.log(d);
			if(d.code == 0) {
				var data = d.data;
				$('.qa_list02 a').attr('href','QA_a_detail.html?token=' + token + '&worryId=' + data.worryId);
				$('.qa_list02 p').html(data.text);
				$('.qa_list02 .qa_name em').html(data.listenerNickName);
				$('.qa_list02 .qa_name i').html(data.listenerProfession);
				$('.qa_list02 li span').html(data.praiseNum + '人认可');

				$('.qa_btn').on('click',function(){
					if(OCModel && OCModel.meWantToBeTheAnswerOwner) {
						// var TopicInfo = {'topicId': topicId};
						OCModel.meWantToBeTheAnswerOwner();
					}
				})
			}

			//如果app外 跳下载
			if (isnotapp) {
				$('a').attr('href',downloadUrl);
				$('.p-btmfix-s-1').show();
				$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
			}
			if(token == ''){
				$('a').unbind('click').on('click', function () {
					console.log('未登录');
					if(OCModel && OCModel.userClickedSendBarrage) {
						OCModel.userClickedSendBarrage();
					}
					return false;
				});

			}
		}
	})
}

function buildMainDom(){
	var idJson = {};
	if(worryId == '' && topicId != ''){
		idJson = {"topicId": topicId,"voiceId": voiceId};
	}else if(worryId != '' && topicId == ''){
		idJson = {"worryId": worryId};
	}
	// console.log(idJson)
	$.ajax({
		url: location.protocol + '//' + location.host + '/voice/selectInfo?token=' + token,
		// url: './js/data/selectInfo.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(idJson),
		success: function (d) {
			console.log(d);
			if(d.code == 0){
				$('.qa_qner .qa_face img').attr('src',d.data.listenerHead);
				$('.qa_qner .qa_name').html(d.data.listenerNickName);
				$('.qa_qner .qa_price').html('价值￥' + (d.data.acceptMoney == ''? 0:d.data.acceptMoney));
				var $span = $('.qa_bar .fr span');
				$span.eq(0).html(d.data.listenNum + '人听过');
				$span.eq(1).html(d.data.praiseNum + '人认可');
				$span.eq(2).html(d.data.stepNum + '人呵呵');
				$('.qa_like').on('click',function(){
					if(list[0].price == -1 || list[0].price == -1.0 || list[0].price == 0){
						if(!likeordislike.like){
							likeordislike.like = true;
							var p_alert = $('.p-alert2');
							p_alert.html('您认同了此回答，并让回答价值+0.1元').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
							toSendOperation(1);
						}
					}else {
						var p_alert = $('.p-alert2');
						p_alert.html('悄悄听后才能点哦').show().addClass('show');
						setTimeout(function () {
							p_alert.hide().removeClass('show');
						}, 3000);
					}

				});
				$('.qa_dislike').on('click',function(){
					if(list[0].price == -1 || list[0].price == -1.0 || list[0].price == 0){
						if(!likeordislike.dislike){
							likeordislike.dislike = true;
							var p_alert = $('.p-alert2');
							p_alert.html('您呵呵了此回答， 并让回答价值-0.1元').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
							toSendOperation(2);
						}
					}else {
						var p_alert = $('.p-alert2');
						p_alert.html('悄悄听后才能点哦').show().addClass('show');
						setTimeout(function () {
							p_alert.hide().removeClass('show');
						}, 3000);
					}
				});

				var list = d.data.list;
				if(list.length == 1){
					var realPrice = canListen(list[0]);
					var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].content +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ list[0].voiceTime +'&prime;&prime;</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" data-voiceId="'+ index.voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face"><img src="'+ list[0].listenerHead +'" alt=""></div><img src="images/qa-used.png" alt="" class="qa_a_used"></div></li>';
					$('.qa_list01').html(li);
				}else {
					var dom ='';
					for(var i=0; i<list.length; i++){
						var index = list[i];
						var realPrice = canListen(index);
						dom += '<li><div class="qa_issue">'+ index.content +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ index.voiceTime +'&prime;&prime;</span><a data-listenerId="'+ index.listenerId +'" data-price="'+ index.price +'" data-voiceId="'+ index.voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ index.voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face"><img src="'+ index.listenerHead +'" alt=""></div></div></li>';
					}
					$('.qa_list01').html(dom);
					$('.qa_list01 li').eq(0).append('<a class="qa_hide_more" href="javascript:;">【更多】</a>').addClass('qa_a_head').find('.qa_re').append('<img src="images/qa-used.png" alt="" class="qa_a_used">');
					$('.qa_hide_more').on('click',function(){
						if(list[0].price == -1 || list[0].price == -1.0 || list[0].price == 0){
							$('.qa_a_main').removeClass('qa_hide');
						}else {
							var p_alert = $('.p-alert2');
							p_alert.html('悄悄听后才能点哦').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
						}

					})
				}
				toPlayVioce();

				//倾听者信息
				$('.qa_a_info .qa_face img').attr('src',d.data.listenerHead);
				$('.qa_a_info .ovh h3').html(d.data.listenerNickName);
				$('.qa_a_info .ovh p').html(d.data.listenerProfession);
				$('.qa_a_info .qa_infoMain').attr('href','QA_home.html?token='+token+'&uid=' + d.data.listenerId);
				$('.qa_info_btn').on('click',function(){
					if(OCModel && OCModel.rewordForTheSecondAskDetail) {
						// var TopicInfo = {'topicId': topicId};
						OCModel.rewordForTheSecondAskDetail();
					}
				});

				toSelectRandom();

			}
		},
		error: function(e){
			console.log(e);
		}
	})
}

$(function() {
	buildMainDom();



});