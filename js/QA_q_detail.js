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
var HotTag = false;
var NewTag = false;

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

function toPlayVioce(type){
	if(type == 1){
		var $willClick = $('.list-hot .qa_listen');
	}else if(type == 0){
		var $willClick = $('.list-new .qa_listen');
	}

	$willClick.on('click',function(){
		var that = this;
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
	});
}

function getHotAndNew(type){
	var selectHotAndNewJson = {"topicId": topicId,"type": type};
	$.ajax({
		// url: location.protocol + '//' + location.host + '/voice/selectHotAndNew?token=' + token,
		url: './js/data/selectHotAndNew.json',
		type: 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(selectHotAndNewJson),
		success: function (d) {
			console.log(d);
			if(d.code == 0){
				var listArr = d.data.list;
				var dom = '';
				for(var i=0; i<listArr.length; i++) {
					var index = listArr[i];
					dom += '<li><div class="qa_name">'+ index.listenerNickName +'<em>|</em>'+ index.listenerProfession +'</div><div class="qa_re"><div class="qa_listenBox"><a data-listenerId="'+ index.listenerId +'" class="qa_listen" href="javascript:;">'+ index.price +'元听</a><audio src="'+ index.voiceUrl +'" controls="controls" hidden></audio><span>60s</span></div><div class="qa_face"><img src="'+ index.listenerHead +'" alt=""></div><div class="qa_renke">'+ index.listenNum +'人认可</div><div class="qa_tingguo">'+ index.praiseNum +'人听过</div></div></li>';//todo 时间从后台获取？
				}
				if(type == 1) {
					$('.list-hot').html(dom);
					HotTag = true;
				}else if(type == 0) {
					$('.list-new').html(dom);
					NewTag = true;
				}
				toPlayVioce(type);
			}
		},
		error: function (e) {

		}
	})
}

function buildMainDom(){
	//todo 创建主要DOM结构 没接口
}

$(function() {
	buildMainDom();
	getHotAndNew(1);
	$('.hn-button').on('click',function(){
		var that = this;
		pauseAllAudio(that);
		$('.hn-button').removeClass('cur');
		var dataType = $(this).attr('data-type');
		$(this).addClass('cur');          //选中
		if(dataType == 1){              //判断热门
			if(HotTag) {
				$('.list-new').addClass('none');
				$('.list-hot').removeClass('none');
			}else {
				getHotAndNew(dataType);
			}
		}else if (dataType == 0) {          //判断最新
			if(NewTag) {
				$('.list-hot').addClass('none');
				$('.list-new').removeClass('none');
			}else {
				getHotAndNew(dataType);
			}
		}
	});

	//如果app外 跳下载    todo 明确哪些跳下载
	if (isnotapp) {
		$('a').attr('href',downloadUrl);
		$('.p-btmfix-s-1').show();
		$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
	}

});