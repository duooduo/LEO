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
		return (price + '元悄悄听');
		
	}
}

function getList(){
	var uidJson = {
		uid: uid
	};
	$.ajax({
		url: location.protocol + '//' + location.host + '/listener/listenerQuestion?token=' + token,
		// url: './js/data/listenerQuestion.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(uidJson),
		success: function (d) {
			console.log(d);
			if(d.code == 0) {
				$('.qa_tit01').html(d.data.content);
				var dom ='';
				for(var i=0; i<d.data.list.length; i++){
					var index = d.data.list[i];
					var realPrice = canListen(index);
					dom += '<li><a data-worryId="'+ index.worryId +'" data-voiceId="'+ index.voiceId +'" data-price="'+ index.price +'" href="QA_a_detail.html?token='+ token +'&worryId='+ index.worryId + '"><div class="qa_issue">'+ index.text +'</div><div class="qa_re"><div class="qa_listenBox"><div class="qa_listen">'+ realPrice +'</div></div><div class="qa_face"><img src="'+ index.listenerHead +'" alt=""></div><div class="qa_renke">'+ index.praiseNum +'人认可</div><div class="qa_tingguo">'+ index.listenNum +'人听过</div></div></a></li>';
				}
				$('.qa_list01').html(dom);
				// toPlayVioce();
			}
		},
		error: function (e) {
			console.log(e);
		}
	})
}

function getUserInfo(){
	var uidJson = {
		uid: uid
	};
	$.ajax({
		url: location.protocol + '//' + location.host + '/listener/info?token=' + token,
		// url: './js/data/listener_info_data.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(uidJson),
		success: function (d) {
			console.log(d);
			if(d.code == 0) {
				var data = d.data;
				$('.qa_face img').attr('src',data.head);
				$('.qa_name').html(data.name);
				$('.qa_infoTXT').html(data.profile);
				$('.qa_price').html('￥' + data.price);
				$('.qa_textarea').attr('placeholder','向'+ data.name +'提问，等ta语音回答，超过48小时未回答，将全额退款，被回答后可免费追问');
				$('.qa_q_btn').on('click',function(){
					var text = $('.qa_textarea').val();
					if(OCModel && OCModel.someOneAskedMeAQuestion) {
						var testJson = {'text': text};
						OCModel.someOneAskedMeAQuestion(JSON.stringify(testJson));
					}
					//跳支付 并把输入内容传给app
				})
			}
		},
		error: function (e) {
			console.log(e);
		}
	})
}

$(function(){
	getUserInfo();
	getList();
	//如果app外 跳下载    todo 明确哪些跳下载
	if (isnotapp) {
		$('a').attr('href',downloadUrl);
		$('.p-btmfix-s-1').show();
		$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
	}
});

function getTextareaResult(t){
	$('.qa_textarea').val(t);
}