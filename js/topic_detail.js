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


//url地址段最后带参数，例如：'?keyid=1111'
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
	var keyIdJson = {
		keyId: keyId
	};
	$.ajax({
		url: location.protocol + '//' + location.host + '/symposium/detail?token=' + token,
		// url: './js/data/topic_detail_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(keyIdJson),
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.topic-box').find('h3').html(data.title);
				$('.topic-txt').find('p').html(data.content);

				$('.p-btmfix a').attr('href','user_center.html?token='+token+'&uid='+uid);
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
	})
});


