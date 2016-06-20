'use strict';


var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forhappy';
// var token = getQueryStringArgs().token == undefined? '' : getQueryStringArgs().token;
// var isnotLoginToken = getQueryStringArgs().token == undefined ? true:false;
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

$(function(){
	var keyIdJson = {"keyId" : keyId };
	$.ajax({
		url: location.protocol + '//' + location.host + '/meeting/detail?token=' + token,
		// url: './js/data/discovery_data.json',
		type : 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(keyIdJson),
		success: function(d){
			console.log(d);
			if (d.code == 0) {
				var data = d.data;
//封面
				$('.dis-title-text').html(data.title);  //标题
				$('.dis-cover-date i').html(data.startTime); //时间
				// $('.dis-cover-place i').html(data.address); //地址
				$('.user-img img').attr('src',data.background);
				var $shareLi = $('.dis-share-ul li');
				// $shareLi.eq(0).find('p').html(data.profile);   //关于主持人
				$shareLi.eq(1).find('p').html(data.content);   //分享会内容
				$('.p-btmfix a').attr('href','#session='+data.groupId);


				//如果app外 跳下载
				if (isnotapp) {
					$('a').attr('href',downloadUrl);
					$('.p-btmfix-s-1').show();
					$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
				}

			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	});

	var uidJson = {
		uid: uid
	};
	$.ajax({
		url: location.protocol + '//' + location.host + '/listener/info?token=' + token,
		// url: './js/data/listener_info_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(uidJson),
		success: function (d) {
			if(d.code == 0) {
				var data = d.data;

				var $shareLi = $('.dis-share-ul li');
				$shareLi.eq(0).find('p').html(data.profile);   //关于主持人
				var $speakerLi = $('.dis-speaker-ul li');
				$speakerLi.eq(0).find('a').attr({'data-href':location.protocol + '//' + location.host + '/front/user_center.html?token='+token+'&uid=' + data.uid,'data-uid': data.uid,'data-name': data.name,'data-price': data.price,'data-url': data.head});
				$speakerLi.eq(0).find('img').attr('src',data.head);
				$speakerLi.eq(0).find('h3').html(data.name);
				$speakerLi.eq(0).find('span').html(data.profession);
				$speakerLi.eq(0).find('p').html(data.profile);

				$speakerLi.eq(0).find('a').on('touchend',function(){
					var $this = $(this);
					if(OCModel && OCModel.getTheInnerUserInfo) {
						var UserInfo = {'uid': $this.attr('data-uid'),'name':$this.attr('data-name'),'price':$this.attr('data-price'),'url': $this.attr('data-url')};
						OCModel.getTheInnerUserInfo(JSON.stringify(UserInfo));
					}

				})

			}
		}
	})
});

function getTheInnerUserInfoResult(){
	location.href = $('.dis-share-ul li a').attr('data-href');
}
