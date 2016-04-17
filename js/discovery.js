'use strict';

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
	$.ajax({
		// url: location.protocol + '//' + location.host + '/share_meeting/info',
		url: location.protocol + '//' + location.host + '/LEO/js/data/discovery_data.json',
		dataType: 'json',
		data: {
			// shareId: getQueryStringArgs().shareId
		},
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.user-img img').attr('src',data.imageUrl); //封面
				$('.dis-title-text').html(data.title);  //标题
				$('.dis-cover-date i').html(data.time); //时间
				$('.dis-cover-place i').html(data.address); //地址

				var $shareLi = $('.dis-share-ul li');
				$shareLi.eq(0).find('p').html(data.profile);   //关于主持人
				$shareLi.eq(1).find('p').html(data.content);   //分享会内容

				var $speakerLi = $('.dis-speaker-ul li');
				// $speakerLi.eq(0).find('img').attr('src',data.imageUrl);
				$speakerLi.eq(0).find('h3').html(data.nickName);
				$speakerLi.eq(0).find('span').html(data.profession);
				$speakerLi.eq(0).find('p').html(data.profile);
			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	})
});


