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
			//todo 跳支付
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
		return (price + '元听');
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

function buildMainDom(){
	var idJson = {"topicId": topicId,"voiceId": voiceId};
	$.ajax({
		// url: location.protocol + '//' + location.host + '/voice/selectInfo?token=' + token,
		url: './js/data/selectInfo.json',
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
				//$('.qa_price') todo
				var $span = $('.qa_bar .fr span');
				$span.eq(0).html(d.data.listenNum + '人听过');
				$span.eq(1).html(d.data.praiseNum + '人认可');
				$span.eq(2).html(d.data.stepNum + '人呵呵');
				$('.qa_like').on('click',function(){
					if(!likeordislike.like){
						likeordislike.like = true;
						toSendOperation(1);
					}
				});
				$('.qa_dislike').on('click',function(){
					if(!likeordislike.dislike){
						likeordislike.dislike = true;
						toSendOperation(2);
					}
				});

				var list = d.data.list;
				if(list.length == 1){
					var realPrice = canListen(list[0]);
					var li = '<li class="qa_a_head"><div class="qa_issue">'+ list[0].content +'</div><div class="qa_re"><div class="qa_listenBox"><span>60s</span><a data-listenerId="'+ list[0].listenerId +'" data-price="'+ list[0].price +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ list[0].voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face"><img src="'+ list[0].listenerHead +'" alt=""></div><img src="images/qa-used.png" alt="" class="qa_a_used"></div></li>';
					$('.qa_list01').html(li);
				}else {
					var dom ='';
					for(var i=0; i<list.length; i++){
						var index = list[i];
						var realPrice = canListen(index);
						dom += '<li><div class="qa_issue">'+ index.content +'</div><div class="qa_re"><div class="qa_listenBox"><span>60s</span><a data-listenerId="'+ index.listenerId +'" data-price="'+ index.price +'" class="qa_listen" href="javascript:;">'+ realPrice +'</a><audio src="'+ index.voiceUrl +'" controls="controls" hidden></audio></div><div class="qa_face"><img src="'+ index.listenerHead +'" alt=""></div><img src="images/qa-used.png" alt="" class="qa_a_used"></div></li>';
					}
					$('.qa_list01').html(dom);
					$('.qa_list01 li').eq(0).append('<a class="qa_hide_more" href="javascript:;">【更多】</a>').addClass('qa_a_head');
					$('.qa_hide_more').on('click',function(){
						$('.qa_a_main').removeClass('qa_hide');
					})
				}
				toPlayVioce();

				//倾听者信息
				$('.qa_a_info .qa_face img').attr('src',d.data.listenerHead);
				$('.qa_a_info .ovh h3').html(d.data.listenerNickName);
				$('.qa_a_info .ovh p').html(d.data.listenerProfession);
				$('.qa_a_info .qa_infoMain').attr('data-listenerId',d.data.listenerId); //todo href?

			}
		},
		error: function(e){
			console.log(e);
		}
	})
}

$(function() {
	buildMainDom();

	//如果app外 跳下载    todo 明确哪些跳下载
	if (isnotapp) {
		$('a').attr('href',downloadUrl);
		$('.p-btmfix-s-1').show();
		$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
	}

});