'use strict';


var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forhappy';
var token = getQueryStringArgs().token == undefined? '' : getQueryStringArgs().token;
var uid = getQueryStringArgs().uid == undefined? '' : getQueryStringArgs().uid;
var shareId = getQueryStringArgs().shareId == undefined? '' : getQueryStringArgs().shareId;
var keyId = getQueryStringArgs().keyId == undefined? '' : getQueryStringArgs().keyId;
var worryId = getQueryStringArgs().worryId == undefined? '' : getQueryStringArgs().worryId;
var commentId = getQueryStringArgs().commentId == undefined? '' : getQueryStringArgs().commentId;
var replySendJson = {};

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

function cutText(text){
	var textArr = text.split('');
	var returnArr = [];
	if (textArr.length <= 140) {
		returnArr.push(text);
		return returnArr;
	}else {
		var returnShowText = '';
		var returnHideText = '';
		for(var i=0; i<140;i++){
			returnShowText+=textArr[i];
		}
		for(var j=140; j<textArr.length; j++) {
			returnHideText+=textArr[j];
		}
		returnArr.push(returnShowText);
		returnArr.push(returnHideText);
		return returnArr;
	}
}

$(function(){
	var worryIdJson = {"worryId" : worryId };
	var louzhu = '';
	$.ajax({
		url: location.protocol + '//' + location.host + '/worry/forum_list?token=' + token,
		// url: './js/data/worry_forumlist_data.json',
		type : 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(worryIdJson),
		success: function(d){
			console.log(d);
			if (d.code == 0) {
				var data = d.data;
				var sonReply;
				var index;
				for(var i=0;i<data.list.length; i++) {
					if(data.list[i].commentId == commentId){
						index=i;break;
					}
				}
				// var landlordText = cutText(data.list[index].replyText);
				// if(landlordText.length == 1){
				// 	$('.c-landlord-text').html('<span>'+ landlordText +'</span>');
				// }else if(landlordText.length == 2){
				// 	$('.c-landlord-text').html('<span>'+ landlordText[0] +'</span><i>...</i><a data-hide-text="'+ landlordText[1] +'" data-mark="0" class="cmt-text-a" href="javascript:;">[展开]</a>');
				// }
				$('.c-landlord-text').html('<span>'+ data.list[index].replyText +'</span>').attr({'data-id':data.list[i].fromId, 'data-nickname':data.list[i].fromNickName, 'data-commentid': data.list[i].commentId});

				// // img todo 接口不全imageArray
				// var imgDom = '';
				// for(var j=0; j<data.list[index].imageArray.length; j++) {
				// 	imgDom += '<li><div><img src="'+data.list[index].imageArray[j]+'" alt="" class="c-showImg"></div></li>';
				// }
				// if(imgDom != ''){
				// 	$('.cmt-imgbox').html(imgDom);
				// }

				// cmt todo 接口不全sonReply
				var son = "";
				var btnmore = "";
				var sonLength = data.list[index].sonComment.length;
				for(var m=0; m< sonLength; m++){
					var s = data.list[index].sonComment[m];
					// var img = '';
					// if(s.img){
					// 	img = '<figure><img src="'+ s.img +'" alt="" class="c-showImg"></figure>';
					// }

					son += '<li data-name="'+ s.fromNickName +'" data-id="'+ s.fromId +'" data-replycommentid="'+ data.list[index].commentId +'" data-commentid="'+ s.commentId +'"><div class="name">'+ s.fromNickName +'：</div> <div class="ovh"> <b>@'+ s.toNickName +'</b>'+ s.replyText + '</div></li>';
				}
				if(son!= ''){
					$('.cmt-reply ul').append(son);
				}

				// 回复评论一级
				$('.c-landlord-text').on('touchend',function(e){
					e.preventDefault();
					var replycommentId = $(this).get(0).dataset.commentid;
					var toId = $(this).get(0).dataset.id;
					var nickname = $(this).get(0).dataset.nickname;
					$('#c-input').focus().val('@'+nickname +' ').attr('data-nickname','@'+nickname);
					replySendJson = {
						"replyCommentId": replycommentId,
						"worryId": worryId,
						"fromId": uid,
						"toId": toId,
						"toNickName": nickname
					};
					console.log(replySendJson);
				});
				// 回复评论二级
				$('.cmt-reply li').on('touchend',function(e){
					e.preventDefault();
					var replycommentId = this.dataset.replycommentid;
					var toId = this.dataset.id;
					var nickname = this.dataset.name;
					// var nickname = $(this).get(0).dataset.nickname;
					$('#c-input').focus().val('@'+ nickname +' ').attr('data-nickname','@'+ nickname);
					replySendJson = {
						"replyCommentId": replycommentId,
						"worryId": worryId,
						"fromId": uid,
						"toId": toId,
						"toNickName": nickname
					};
					console.log(replySendJson);
				});
			}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	});

	// 发送按钮
	$('#c-sendreply').on('touchend',function(e){
		e.preventDefault();
		if(token == ''){
			if(OCModel && OCModel.userClickedSendBarrage) {
				OCModel.userClickedSendBarrage();
			}
		}else {
			// var sendReplyJson = {"worryId": worryId,"fromId": uid,"told": louzhu,"replyText": value};
			var value = $.trim($('#c-input').val());
			var nickname = $('#c-input').get(0).dataset.nickname;

			var str = "";
			var n = value.indexOf(nickname);
			if (n == 0) {
				str = value.substring(nickname.length);
			} else {
				str = value;
			}
			str = $.trim(str);


			if (str != '') {
				replySendJson['replyText'] = str;
				$('#c-input').val('');
				console.log(replySendJson);
				$.ajax({
					url: location.protocol + '//' + location.host + '/worry/forum_add?token=' + token,
					// url: './js/data/worry_forumlist_data.json',
					type: 'POST',
					dataType: 'json',
					// headers: {"Content-type": "application/json;charset=UTF-8"},
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify(replySendJson),
					success: function (d) {
						alert('评论成功!');
					}
				})
			}
		}
	})



});




