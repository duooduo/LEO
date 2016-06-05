'use strict';

var goodAtData = {
	"n0":"其他",
	"n1":"家庭",
	"n2":"职场",
	"n3": "情感",
	"n4": "友情",
	"n5": "心理",
	"n6": "家庭关系",
	"n7": "亲子沟通",
	"n8": "婚姻问题",
	"n9": "心理调整",
	"n10": "恋爱心理",
	"n11": "学业职场",
	"n12":"人际关系",
	"n13":"个人成长"
};

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
		success: function(d){
			if (d.code == 0) {
				// alert(JSON.stringify(d));
				var data = d.data;
				$('.user-img img').attr('src', data.background);
				$('.user-info').find('img').attr('src',data.head);
				$('.user-infoR h4').html(data.name);
				$('.user-infoR p').html(data.profession);
				$('.user-infoR-r').find('span').eq(0).html(data.listenNum + '咨询过');
				$('.user-infoR-r').find('span').eq(1).html(data.praiseRate + '%好评');
				$('.user-link01').find('em').html('￥'+ data.price);



				if(data.goodAt.length > 0) {
					var goodAtDom='';
					for(var i=0; i<data.goodAt.length; i++) {
						goodAtDom+='<span>'+ goodAtData['n'+data.goodAt[i]] +'</span>';
					}
					$('.user-label').html(goodAtDom);
				}


				$('.user-edu.edu01').find('.m span').html(data.profession);
				$('.user-edu.edu02').find('.m').html(data.profile);

			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	});

	$.ajax({
		url: location.protocol + '//' + location.host + '/symposium/newlist?token=' + token,
		// url: './js/data/newlist_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(uidJson),
		success: function(d) {
			if(d.code == 0) {
				var data = d.data;
				if(data.length > 0) {
					var hotlistDom = '';
					//newlist
					for(var i=0; i<data.length; i++) {
						var index = data[i];
						var url = 'topic_detail.html?keyId=' + index.keyId+ '&token='+token;
						hotlistDom+='<div class="user-tip"><a href="'+ url +'"><div class="tit">'+ index.title +'</div><p>'+ index.content +'</p></a></div>';
					}
					$('.user-tip-box').html(hotlistDom);
				}
			}
		}
	});

	$.ajax({
		url: location.protocol + '//' + location.host + '/listener/comment_list?token=' + token,
		// url: './js/data/comment_list_data.json',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(uidJson),
		success: function(d) {
			if(d.code == 0) {
				var data = d.data;
				var topThreeDom = '';
				var	othorDom = '';
				if(data.length > 3) {
					$('.user-comm-more a').show();
					for(var i=0; i< 3; i++) {
						var index = data[i];
						var h = "";
						if(index.degree == '满意') {
							h = "<i></i><i></i><i></i>";
						}else if(index.degree == '非常满意') {
							h = "<i></i><i></i><i></i><i></i><i></i>";
						} else if(index.degree == '差评') {
							h = "<i></i>";
						}
						topThreeDom+='<li><div class="user-heart">'+ h +'</div><p>'+ index.text +'</p><div class="user-comm-info"><figure><img src="'+ index.headUrl +'" alt=""></figure><span>'+ index.nickName +'</span><i>'+ index.createTime +'</i></div></li>';
					}
					for (var i=4; i< data.length; i++) {
						var index = data[i];
						var h = "";
						if(index.degree == '满意') {
							h = "<i></i><i></i><i></i>";
						}else if(index.degree == '非常满意') {
							h = "<i></i><i></i><i></i><i></i><i></i>";
						} else if(index.degree == '差评') {
							h = "<i></i>";
						}
						othorDom+='<li><div class="user-heart">'+ h +'</div><p>'+ index.text +'</p><div class="user-comm-info"><figure><img src="'+ index.headUrl +'" alt=""></figure><span>'+ index.nickName +'</span><i>'+ index.createTime +'</i></div></li>';
					}
				}else if(data.length >0 && data.length <= 3) {
					$('.user-comm-more a').hide();
					for(var i=0; i< data.length; i++) {
						var index = data[i];
						var h = "";
						if(index.degree == '满意') {
							h = "<i></i><i></i><i></i>";
						}else if(index.degree == '非常满意') {
							h = "<i></i><i></i><i></i><i></i><i></i>";
						} else if(index.degree == '差评') {
							h = "<i></i>";
						}
						topThreeDom+='<li><div class="user-heart">'+ h +'</div><p>'+ index.text +'</p><div class="user-comm-info"><figure><img src="'+ index.headUrl +'" alt=""></figure><span>'+ index.nickName +'</span><i>'+ index.createTime +'</i></div></li>';
					}
				}
				$('.user-comm').html(topThreeDom);
				$('.user-comm-more a').on('touchend',function(){
					$(this).hide();
					$('.user-comm').append(othorDom);
				});
				//如果app外 跳下载
				if (isnotapp) {
					$('a').attr('href',downloadUrl);
					$('.p-btmfix-s-1').show();
					$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
				}

			}
		}
	})
});