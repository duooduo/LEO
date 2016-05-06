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
		// url: location.protocol + '//' + location.host + '',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify({

		}),
		success: function(d){
			if (d.code == 0) {
				// ...
			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	})
});