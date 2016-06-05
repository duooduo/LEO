'use strict';

var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forhappy';
var token = getQueryStringArgs().token == undefined? '' : getQueryStringArgs().token;
var uid = getQueryStringArgs().uid == undefined? '' : getQueryStringArgs().uid;
var shareId = getQueryStringArgs().shareId == undefined? '' : getQueryStringArgs().shareId;
var keyId = getQueryStringArgs().keyId == undefined? '' : getQueryStringArgs().keyId;

//url地址段最后带参数，例如：'?keyId=10001'
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
		url: location.protocol + '//' + location.host + '/symposium/apply_list?token=' + token,
		// url: './js/data/topic_2_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(keyIdJson),
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.user-img img').attr('src',data.background); //图片
				// $('.topic-box02 h3').html(data.title);  //标题
				$('.topic-txt').html( data.content); //内容

				//如果app外 跳下载
				if (token == '') {
					$('a').attr('href',downloadUrl);
					$('.p-btmfix-s-1').show();
					$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
				}

				for (var i=0; i < data.list.length; i++) {
					var proficient = data.list[i];
					$('.topic-box03 ul').append('' +
						'<li>' +
							'<h4>'+ proficient.title +'</h4>' +
							'<p class="topic-content">'+ proficient.content +'</p>' +
							'<div class="topic-author-box clearfix">' +
								'<figure class="topic-author-img">' +
									'<img alt="" src="'+ proficient.headUrl +'">' +
								'</figure>' +
								'<p class="topic-author-name">'+ proficient.nickName +'</p>' +
								'<a href="topic_detail.html?token='+token+'&keyId='+proficient.keyId+'&uid='+ proficient.uid +'" class="topic-author-btn">查看详情</a>' +
							'</div>' +
						'</li>'
					)
				}

			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	})
});


