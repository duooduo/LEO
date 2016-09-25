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
var IsAgree = getQueryStringArgs().IsAgree == undefined? '' : getQueryStringArgs().IsAgree;
var lqId = getQueryStringArgs().lqId == undefined? '' : getQueryStringArgs().lqId;
var likeordislike = {'like': false, 'dislike': false};
var voiceIdJsonList = {};

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

function toFreeListenNum(willVoiceId){
	if(voiceIdJsonList[willVoiceId] != willVoiceId){
		var willVoiceIdJson = {"voiceId":willVoiceId,"uid": uid};
		if(token == ''){
			willVoiceIdJson["uid"] = 0;
		}
		$.ajax({
			url: location.protocol + '//' + location.host + '/voice/free_listen_num?token=' + token,
			// url: './js/data/operation.json',
			type: 'POST',
			dataType: 'json',
			// headers: {"Content-type": "application/json;charset=UTF-8"},
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify(willVoiceIdJson),
			success: function (d) {
				console.log(d);
				voiceIdJsonList[willVoiceId] = willVoiceId;
			},
			error: function(e){
				console.log(e);
			}
		})
	}
}

function toPlayVioce(){
	$('.qa_listen').on('click',function(){
		var willCost = $(this).attr('data-price');
		var willVoiceId = $(this).attr('data-voiceId');
		var that = this;
		if(willCost == 0){
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
			toFreeListenNum(willVoiceId);
			audio.addEventListener('ended', function () {
				if(OCModel && OCModel.userDidFinishPlayingTheVoice) {
					OCModel.userDidFinishPlayingTheVoice();
				}
			}, false);
		}else if(willCost == -1 || willCost == -1.0){
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
			audio.addEventListener('ended', function () {
				if(OCModel && OCModel.userDidFinishPlayingTheVoice) {
					OCModel.userDidFinishPlayingTheVoice();
				}
			}, false);
		}else {
			pauseAllAudio(that);
			var thisVoiceId = $(this).attr('data-voiceId');
			var thisPrice = parseInt($(this).attr('data-price'))/100;
			var thisListenerId = $(this).attr('data-listenerId');
			if(OCModel && OCModel.payForVoice) {
				var voiceInfo = {'voiceId': thisVoiceId,'price': thisPrice,'uid': thisListenerId};
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
		return ((parseInt(price)/100) + '元悄悄听');
	}
}

function toSendOperation(type,dataVoiceId) {
	var toSendOperationJson = {};
	if(voiceId == ''){
		toSendOperationJson = {"voiceId": dataVoiceId,"type": type,"uid": uid};
	}else {
		toSendOperationJson = {"voiceId": voiceId,"type": type,"uid": uid};
	}
	if(token == ''){
		toSendOperationJson['uid'] = 0;
	}
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
			if(d.code == 400){
				var p_alert = $('.p-alert2');
				p_alert.html(d.message).show().addClass('show');
				setTimeout(function () {
					p_alert.hide().removeClass('show');
				}, 3000);
			}
		},
		error: function(e){
			console.log(e);
		}
	})
}

function toSelectRandom(){
	var dataJson = {"uid": uid};
	if(token == ''){
		dataJson["uid"] = 0;
	}
	$.ajax({
		url: location.protocol + '//' + location.host + '/voice/selectRandom?token=' + token,
		// url: './js/data/selectRandom.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(dataJson),
		success: function (d) {
			console.log(d);
			if(d.code == 0) {
				var data = d.data;
				$('.qa_list02 a').attr('href','QA_a_detail.html?token=' + token + '&worryId=' + data.worryId + '&uid=' + uid + '&voiceId=' + data.voiceId + '&IsAgree=1');
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
					// console.log('未登录');
					if(OCModel && OCModel.userClickedSendBarrage) {
						OCModel.userClickedSendBarrage();
					}
					return false;
				});

			}
		}
	})
}

function clickHeadImgToUserCenter(){
	$('.qa_face').on('click',function(e){
		e.preventDefault();
		var userUid = $(this).attr('data-uid');
		if(OCModel && OCModel.goToPersonalDynamicPage) {
			var userUidInfo = {'uid': userUid};
			OCModel.goToPersonalDynamicPage(JSON.stringify(userUidInfo));
		}
	})
}


function buildMainDomByWorryId(){
	var idJson = {};
	if(worryId == '' && topicId != '' && lqId == ''){
		idJson = {"topicId": topicId,"voiceId": voiceId,"uid": uid};
	}else if(worryId != '' && topicId == '' && lqId == ''){
		idJson = {"worryId": worryId,"voiceId": voiceId,"uid": uid};
	}else if(worryId == '' && topicId == '' && lqId != ''){
		idJson = {"lqId": lqId,"voiceId": voiceId,"uid": uid};
	}
	if(token == ''){
		idJson["uid"] = 0;
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
				var firstData = d.data[0];
				voiceIdJsonList["isOperation"] = firstData.isOperation;
				//$('.qa_qner .qa_face a').attr('href','QA_home.html?token='+token+'&uid=' + firstData.userId);
				$('.qa_qner .qa_face').attr('data-uid',firstData.userId);
				$('.qa_qner .qa_face img').attr('src',firstData.userHead);
				$('.qa_qner .qa_name').html(firstData.userNickName);
				$('.qa_qner .qa_price').html('价值￥' + (firstData.acceptMoney == ''? 0:(parseInt(firstData.acceptMoney)/100)));
				var $span = $('.qa_bar .fr span');
				$span.eq(0).html(firstData.listenNum + '人听过');
				$span.eq(1).html(firstData.praiseNum + '人认可');
				$span.eq(2).html(firstData.stepNum + '人呵呵');
				$('.qa_like').on('click',function(){
					if(firstData.price == -1 || firstData.price == -1.0 || firstData.price == 0){
						if(voiceIdJsonList.isOperation == 0){
							voiceIdJsonList.isOperation = 1;
							var p_alert = $('.p-alert2');
							p_alert.html('您认同了此回答，并让回答价值+0.1元').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
							toSendOperation(1,firstData.voiceId);
						}else {
							var p_alert = $('.p-alert2');
							p_alert.html('您已经表过态了').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
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
					if(firstData.price == -1 || firstData.price == -1.0 || firstData.price == 0){
						if(voiceIdJsonList.isOperation == 0){
							voiceIdJsonList.isOperation = 1;
							var p_alert = $('.p-alert2');
							p_alert.html('您呵呵了此回答， 并让回答价值-0.1元').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
							toSendOperation(2,firstData.voiceId);
						}else {
							var p_alert = $('.p-alert2');
							p_alert.html('您已经表过态了').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
						}
					}else {
						var p_alert = $('.p-alert2');
						p_alert.html('悄悄听后才能点哦').show().addClass('show');
						setTimeout(function () {
							p_alert.hide().removeClass('show');
						}, 3000);
					}
				});

				var qaUsedImg = '';
				var list = d.data;
				if(list.length == 1){
					var realPrice = canListen(list[0]);
					if(IsAgree == 1){
						qaUsedImg = '<img src="images/qa-used.png" alt="" class="qa_a_used">';
					}
					var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].text +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ list[0].voiceTime +'&prime;&prime;</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" data-voiceId="'+ list[0].voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ list[0].listenerId +'"><img src="'+ list[0].listenerHead +'" alt=""></div>'+ qaUsedImg +'</div></li>';
					$('.qa_list01').html(li);
				}else {
					var dom ='';
					for(var i=0; i<list.length; i++){
						var index = list[i];
						var realPrice = canListen(index);
						dom += '<li><div class="qa_issue">'+ index.text +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ index.voiceTime +'&prime;&prime;</span><a data-listenerId="'+ index.listenerId +'" data-price="'+ index.price +'" data-voiceId="'+ index.voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ index.voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ index.listenerId +'"><img src="'+ index.listenerHead +'" alt=""></div></div></li>';
					}
					$('.qa_list01').html(dom);
					if(IsAgree == 1){
						qaUsedImg = '<img src="images/qa-used.png" alt="" class="qa_a_used">';
					}
					$('.qa_list01 li').eq(0).append('<a class="qa_hide_more" href="javascript:;">【更多】</a>').addClass('qa_a_head').find('.qa_re').append(qaUsedImg);
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
				$('.qa_a_info .qa_face').attr('data-uid',firstData.listenerId);
				$('.qa_a_info .qa_face img').attr('src',firstData.listenerHead);
				$('.qa_a_info .ovh h3').html(firstData.listenerNickName);
				$('.qa_a_info .ovh p').html(firstData.listenerProfession);
				$('.qa_a_info .qa_infoMain').attr('href','QA_home.html?token='+token+'&uid=' + firstData.listenerId);
				$('.qa_info_btn').on('click',function(){
					if(OCModel && OCModel.rewordForTheSecondAskDetail) {
						var VoiceInfo = {'voiceId': firstData.voiceId,'uid': firstData.listenerId};
						OCModel.rewordForTheSecondAskDetail(JSON.stringify(VoiceInfo));
					}
				});

				toSelectRandom();
				clickHeadImgToUserCenter();

			}
		},
		error: function(e){
			console.log(e);
		}
	})
}

function buildMainDomByTopicId(){
	var idJson = {};
	if(worryId == '' && topicId != '' && lqId == ''){
		idJson = {"topicId": topicId,"voiceId": voiceId,"uid": uid};
	}else if(worryId != '' && topicId == '' && lqId == ''){
		idJson = {"worryId": worryId,"voiceId": voiceId,"uid": uid};
	}else if(worryId == '' && topicId == '' && lqId != ''){
		idJson = {"lqId": lqId,"voiceId": voiceId,"uid": uid};
	}
	if(token == ''){
		idJson["uid"] = 0;
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
				var firstData = d.data[0];
				voiceIdJsonList["isOperation"] = firstData.isOperation;
				//$('.qa_qner .qa_face a').attr('href','QA_home.html?token='+token+'&uid=' + firstData.userId);
				$('.qa_a_info .qa_face').attr('data-uid',firstData.userId);
				$('.qa_qner .qa_face img').attr('src',firstData.userHead);
				$('.qa_qner .qa_name').html(firstData.userNickName);
				$('.qa_qner .qa_price').html('价值￥' + (firstData.acceptMoney == ''? 0:(parseInt(firstData.acceptMoney)/100)));
				var $span = $('.qa_bar .fr span');
				$span.eq(0).html(firstData.listenNum + '人听过');
				$span.eq(1).html(firstData.praiseNum + '人认可');
				$span.eq(2).html(firstData.stepNum + '人呵呵');
				$('.qa_like').on('click',function(){
					if(firstData.price == -1 || firstData.price == -1.0 || firstData.price == 0){
						if(voiceIdJsonList.isOperation == 0){
							voiceIdJsonList.isOperation = 1;
							var p_alert = $('.p-alert2');
							p_alert.html('您认同了此回答，并让回答价值+0.1元').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
							toSendOperation(1,firstData.voiceId);
						}else {
							var p_alert = $('.p-alert2');
							p_alert.html('您已经表过态了').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
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
					if(firstData.price == -1 || firstData.price == -1.0 || firstData.price == 0){
						if(voiceIdJsonList.isOperation == 0){
							voiceIdJsonList.isOperation = 1;
							var p_alert = $('.p-alert2');
							p_alert.html('您呵呵了此回答， 并让回答价值-0.1元').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
							toSendOperation(2,firstData.voiceId);
						}else {
							var p_alert = $('.p-alert2');
							p_alert.html('您已经表过态了').show().addClass('show');
							setTimeout(function () {
								p_alert.hide().removeClass('show');
							}, 3000);
						}
					}else {
						var p_alert = $('.p-alert2');
						p_alert.html('悄悄听后才能点哦').show().addClass('show');
						setTimeout(function () {
							p_alert.hide().removeClass('show');
						}, 3000);
					}
				});

				var qaUsedImg = '';
				var list = d.data;
				if(list.length == 1){
					var realPrice = canListen(list[0]);
					if(IsAgree == 1){
						qaUsedImg = '<img src="images/qa-used.png" alt="" class="qa_a_used">';
					}
					var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].title +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ list[0].voiceTime +'&prime;&prime;</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" data-voiceId="'+ list[0].voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ list[0].listenerId +'"><img src="'+ list[0].listenerHead +'" alt=""></div>'+ qaUsedImg +'</div></li>';
					$('.qa_list01').html(li);
				}else {
					var dom ='';
					for(var i=0; i<list.length; i++){
						var index = list[i];
						var realPrice = canListen(index);
						dom += '<li><div class="qa_issue">'+ index.title +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ index.voiceTime +'&prime;&prime;</span><a data-listenerId="'+ index.listenerId +'" data-price="'+ index.price +'" data-voiceId="'+ index.voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ index.voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ index.listenerId +'"><img src="'+ index.listenerHead +'" alt=""></div></div></li>';
					}
					$('.qa_list01').html(dom);
					if(IsAgree == 1){
						qaUsedImg = '<img src="images/qa-used.png" alt="" class="qa_a_used">';
					}
					$('.qa_list01 li').eq(0).append('<a class="qa_hide_more" href="javascript:;">【更多】</a>').addClass('qa_a_head').find('.qa_re').append(qaUsedImg);
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
				$('.qa_a_info .qa_face').attr('data-uid',firstData.listenerId);
				$('.qa_a_info .qa_face img').attr('src',firstData.listenerHead);
				$('.qa_a_info .ovh h3').html(firstData.listenerNickName);
				$('.qa_a_info .ovh p').html(firstData.listenerProfession);
				$('.qa_a_info .qa_infoMain').attr('href','QA_home.html?token='+token+'&uid=' + firstData.listenerId);
				$('.qa_info_btn').on('click',function(){
					if(OCModel && OCModel.rewordForTheSecondAskDetail) {
						var VoiceInfo = {'voiceId': firstData.voiceId};
						OCModel.rewordForTheSecondAskDetail(JSON.stringify(VoiceInfo));
					}
				});

				toSelectRandom();
				clickHeadImgToUserCenter();

			}
		},
		error: function(e){
			console.log(e);
		}
	})
}

function buildMainDomByIsNotAgree(){
	var idJson = {};
	if(worryId == '' && topicId != '' && lqId == ''){
		idJson = {"topicId": topicId,"voiceId": voiceId,"uid": uid};
	}else if(worryId != '' && topicId == '' && lqId == ''){
		idJson = {"worryId": worryId,"voiceId": voiceId,"uid": uid};
	}else if(worryId == '' && topicId == '' && lqId != ''){
		idJson = {"lqId": lqId,"voiceId": voiceId,"uid": uid};
	}
	if(token == ''){
		idJson["uid"] = 0;
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
			if (d.code == 0 && worryId == '' && topicId != '' && lqId == '') {
				var firstData = d.data[0];
				//$('.qa_qner .qa_face a').attr('href','QA_home.html?token='+token+'&uid=' + firstData.userId);
				$('.qa_a_info .qa_face').attr('data-uid',firstData.userId);
				$('.qa_qner .qa_face img').attr('src', firstData.userHead);
				$('.qa_qner .qa_name').html(firstData.userNickName);
				var list = d.data;
				var realPrice = canListen(list[0]);
				var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].title +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ list[0].voiceTime +'&prime;&prime;</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" data-voiceId="'+ list[0].voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ list[0].listenerId +'"><img src="'+ list[0].listenerHead +'" alt=""></div></div></li>';
				$('.qa_list01').html(li);
				toPlayVioce();
				$('.qa_bar').hide();
				$('.qa_a_info').hide();
				$('.qa_tit02').hide();
				$('.qa_list02').hide();
			}else if(d.code == 0 && worryId != '' && topicId == '' && lqId == '') {
				var firstData = d.data[0];
				//$('.qa_qner .qa_face a').attr('href','QA_home.html?token='+token+'&uid=' + firstData.userId);
				$('.qa_a_info .qa_face').attr('data-uid',firstData.userId);
				$('.qa_qner .qa_face img').attr('src', firstData.userHead);
				$('.qa_qner .qa_name').html(firstData.userNickName);
				var list = d.data;
				var realPrice = canListen(list[0]);
				var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].text +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ list[0].voiceTime +'&prime;&prime;</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" data-voiceId="'+ list[0].voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ list[0].listenerId +'"><img src="'+ list[0].listenerHead +'" alt=""></div></div></li>';
				$('.qa_list01').html(li);
				toPlayVioce();
				$('.qa_bar').hide();
				$('.qa_a_info').hide();
				$('.qa_tit02').hide();
				$('.qa_list02').hide();
			}else if(d.code == 0 && worryId == '' && topicId == '' && lqId != '') {
				var firstData = d.data[0];
				//$('.qa_qner .qa_face a').attr('href','QA_home.html?token='+token+'&uid=' + firstData.userId);
				$('.qa_a_info .qa_face').attr('data-uid',firstData.userId);
				$('.qa_qner .qa_face img').attr('src', firstData.userHead);
				$('.qa_qner .qa_name').html(firstData.userNickName);
				var list = d.data;
				var realPrice = canListen(list[0]);
				var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].text +'</div><div class="qa_re"><div class="qa_listenBox"><span>'+ list[0].voiceTime +'&prime;&prime;</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" data-voiceId="'+ list[0].voiceId +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face" data-uid="'+ list[0].listenerId +'"><img src="'+ list[0].listenerHead +'" alt=""></div></div></li>';
				$('.qa_list01').html(li);
				toPlayVioce();
				$('.qa_bar').hide();
				$('.qa_a_info').hide();
				$('.qa_tit02').hide();
				$('.qa_list02').hide();
			}
			clickHeadImgToUserCenter()
		}
	})
}


$(function() {

	if(IsAgree == 1){
		if(worryId == '' && topicId != '' && lqId == ''){
			buildMainDomByTopicId();
		}else if(worryId != '' && topicId == '' && lqId == ''){
			buildMainDomByWorryId();
		}else if(worryId == '' && topicId == '' && lqId != ''){
			buildMainDomByWorryId();
		}
	}else {
		buildMainDomByIsNotAgree();
	}




});