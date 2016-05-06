'use strict';

//url地址段最后带参数，例如：'?symposiumId=10001'
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
		url: './js/data/topic_2_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify({
			// symposiumId: getQueryStringArgs().symposiumId
		}),
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.user-img img').attr('src',data.imageUrl); //图片
				$('.topic-box02 h3').html(data.title);  //标题
				$('.topic-txt').append('<p>'+ data.content +'</p>'); //内容

				for (var i=0; i < data.proficient.length; i++) {
					var proficient = data.proficient[i];
					$('.topic-box03 ul').append('' +
						'<li>' +
							'<h4>'+ proficient.title +'</h4>' +
							'<p class="topic-content">'+ proficient.content +'</p>' +
							'<div class="topic-author-box clearfix">' +
								'<figure class="topic-author-img">' +
									'<img alt="" src="'+ proficient.headUrl +'">' +
								'</figure>' +
								'<p class="topic-author-name">'+ proficient.nickName +'</p>' +
								'<a href="javascript:void(0)" class="topic-author-btn">查看详情</a>' +
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


