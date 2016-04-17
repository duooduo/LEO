'use strict';


//data:{shareId : 10001 }
$(function(){
	$.ajax({
		// url: location.protocol + '//' + location.host + '/share_meeting/info',
		url: location.protocol + '//' + location.host + '/LEO/js/data/discovery_data.json',
		dataType: 'json',
		success: function(d){
			if (d.code == 0) {
				var data = d.data;
				$('.dis-title-text').html(data.title);  //标题
				$('.dis-cover-date i').html(data.time); //时间
				$('.dis-cover-place i').html(data.address); //地址

				$('.dis-share-ul li').eq(0).find('p').html(data.profile);   //关于主持人
				$('.dis-share-ul li').eq(1).find('p').html(data.content);   //分享会内容

				$('.dis-speaker-ul li').eq(0).find('img').attr('src',data.imageUrl);
				$('.dis-speaker-ul li').eq(0).find('dis-speaker-info').find('h3').html(data.nickName);
				$('.dis-speaker-ul li').eq(0).find('dis-speaker-info').find('span').html(data.profession);
				$('.dis-speaker-ul li').eq(0).find('p').html(data.profile);
			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	})
});


