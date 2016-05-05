'use strict';

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
	$.ajax({
		// url: location.protocol + '//' + location.host + '/symposium/info',
		url: location.protocol + '//' + location.host + '/LEO/js/data/topic_detail_data.json',
		dataType: 'json',
		data: {
			// keyId: getQueryStringArgs().keyid
		},
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.topic-box').find('h3').html(data.title);
				$('.topic-txt').find('p').html(data.content);
			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	})
});


