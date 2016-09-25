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
var worryId = getQueryStringArgs().worryId == undefined? '' : getQueryStringArgs().worryId;
var replySendJson = {};
var louzhuId = '';
var louzhuNickName='';


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

function clickHeadImgToUserCenter(){
	$('.cmt-head figure').on('click',function(){
		var userUid = $(this).attr('data-uid');
		if(OCModel && OCModel.goToPersonalDynamicPage) {
			var userUidInfo = {'uid': userUid};
			OCModel.goToPersonalDynamicPage(JSON.stringify(userUidInfo));
		}
	})
}

$(function(){
	//获取详情
	var worryIdJson = {"worryId" : worryId };
	$.ajax({
		url: location.protocol + '//' + location.host + '/worry/forum_list?token=' + token,
		 //url: './js/data/worry_sorrys_data.json',
		type : 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(worryIdJson),
		success: function(d){
			console.log(d);
			if (d.code == 0) {
				var data = d.data;
				louzhuId = '' + data.toId;	//楼主id12312
				louzhuNickName = '' + data.toNickName;
				replySendJson = {
					"replyCommentId":'',
					"worryId": worryId,
					"fromId": uid,
					"toId": louzhuId,
					"toNickName": louzhuNickName
				};
				console.log(replySendJson);
				//$('.cmt-head a').attr('href','QA_home.html?token='+token+'&uid=' + louzhuId);	//跳转个人主页
				$('.cmt-head img').attr('src',data.toHead);  //头像
				$('.cmt-head figure').attr('data-uid',louzhuId);    //存id
				$('.c-landlord h4').prepend(data.toNickName);  //昵称
				$('.c-landlord p').html(data.textCreateTime);	// 时间?

				// 截取140字
				/*var landlordText = cutText(data.list[0].text);
				if(landlordText.length == 1){
					$('.c-landlord-text').html('<span>'+ landlordText +'</span>');
				}else if(landlordText.length == 2){
					$('.c-landlord-text').html('<span>'+ landlordText[0] +'</span><i>...</i><a data-hide-text="'+ landlordText[1] +'" data-mark="0" class="cmt-text-a" href="javascript:;">[展开]</a>');
				}*/
				$('.c-landlord-text').html('<span>'+ data.Text +'</span>');	//文字

				if(data.images){	//图片
					for(var i=0;i<data.images.length; i++){
						$('.c-landlord-text').append('<figure><img src="'+ data.images[i] +'" alt="" class="c-showImg"></figure>');
					}
				}
			/*}
		},
		error: function(e){
			// alert(JSON.stringify(e));
		}
	});

	//获取评论
	$.ajax({
		// url: location.protocol + '//' + location.host + '/worry/forum_list?token=' + token,
		url: './js/data/worry_forumlist_data.json',
		type : 'POST',
		dataType: 'json',
		// headers: {"Content-type": "application/json;charset=UTF-8"},
		contentType: 'application/json;charset=UTF-8',
		data: JSON.stringify(worryIdJson),
		success: function(d){
			console.log(d);
			if(d.code == 0){
				var data = d.data;*/
				if(data.list.length == 0) {
					$('.cmt-main').html('<div class="cmt-box emp"><i class="cmt-empImg"></i><p class="cmt-empP">智慧如你，不想<a class="addcmt" href="javascript:;">发布一点想法</a>吖</p></div>');
					$('.addcmt').on('click',function(e){
						e.preventDefault();
						$('#c-input').focus().val('');

						replySendJson = {
							"replyCommentId":'',
							"worryId": worryId,
							"fromId": uid,
							"toId": louzhuId,
							"toNickName": louzhuNickName
						};
						console.log(replySendJson);
					})
				}else {
					var dom = '';
					for(var i=0; i<data.list.length; i++) {
						dom += '<div class="cmt-box">';
						// face
						var louzhustr = '';
						if(data.list[i].fromId == louzhuId) {
							louzhustr = '<i>楼主</i>';
						}
						dom += '<div class="cmt-head">' +
							'<figure data-uid="'+ data.list[i].fromId +'">' +
								//'<a href="QA_home.html?token='+token+'&uid=' + data.list[i].fromId +'">' +
									'<img src="'+ data.list[i].fromHead +'" alt="">' +
								//'</a>' +
							'</figure>' +
							'<div class="ovh">' +
								'<h4>'+ data.list[i].fromNickName + louzhustr +'</h4>' +
								'<p>'+ data.list[i].commentCreateTime +'</p>' +
							'</div>' +
							'<a class="cmt-zan" href="#" data-commentId="'+ data.list[i].commentId +'"><em>'+ data.list[i].praiseNum +'</em></a></div>';
					// <a data-id="'+data.list[i].fromId+'" data-nickname="'+ data.list[i].nickName +'" href="javascript:;" class="cmt-reply-btn">回复</a></div>';
						// text
						/*var landlordText = cutText(data.list[i].replyText);
						if(landlordText.length == 1){
							dom += '<div class="cmt-text"><p class="reply-btn"><span>'+ landlordText +'</span></p>';
						}else if(landlordText.length == 2){
							dom += '<div class="cmt-text"><p><span>'+ landlordText[0] +'</span><i>...</i><a data-hide-text="'+ landlordText[1] +'" data-mark="0" class="cmt-text-a" href="javascript:;">[展开]</a></p>';
						}*/
						dom += '<div class="cmt-text"><p class="reply-btn" data-commentid="'+ data.list[i].commentId +'" data-id="'+data.list[i].fromId+'" data-nickname="'+ data.list[i].fromNickName +'"><span>'+ data.list[i].replyText +'</span></p>';
						// img
						// var imgDom = '';
						// for(var j=0; j<data.list[i].imageArray.length; j++) {
						// 	imgDom += '<li><div><img src="'+data.list[i].imageArray[j]+'" alt="" class="c-showImg"></div></li>';
						// }
						// if(imgDom != ''){
						// 	dom += '<ul class="cmt-imgbox">'+imgDom+'</ul>';
						// }
						// cmt
						var son = "";
						var btnmore = "";
						var sonLength = data.list[i].sonComment.length;
						if(sonLength>2){
							sonLength = 2;
							btnmore = '<a class="more" href="comment_more.html?token='+token+'&commentId='+ data.list[i].commentId +'&worryId='+ worryId +'">查看更多评论</a>';
						}
						for(var m=0; m< sonLength; m++){
							var s = data.list[i].sonComment[m];
							// var img = '';
							// if(s.img){
							// 	img = '<figure><img src="'+ s.img +'" alt="" class="c-showImg"></figure>';
							// }

							son += '<li data-name="'+ s.fromNickName +'" data-id="'+ s.fromId +'" data-replycommentid="'+ data.list[i].commentId +'" data-commentid="'+ s.commentId +'"><div class="name">'+ s.fromNickName +'：</div> <div class="ovh"> <b>@'+ s.toNickName +'</b>'+ s.replyText + '</div></li>';
						}
						if(son!= ''){
							dom += '<div class="cmt-reply clearfix"><ul>' + son + '</ul>'+ btnmore +'</div></div>';
						} else {
							dom += '</div>';
						}
						dom += '</div>';
					}
					$('.cmt-main').html(dom);
				}
				/*$('.cmt-text-a').on('touchend',function(){
					var $this = $(this);
					var mark = $this.attr('data-mark');
					var hideText = $this.attr('data-hide-text');
					if(mark == '0'){
						$this.prev().html(hideText);
						$this.attr('data-mark','1');
						$this.html('[收起]');
					}else if(mark=='1'){
						$this.prev().html('...');
						$this.attr('data-mark','0');
						$this.html('[展开]');
					}
				});*/

				clickHeadImgToUserCenter();

				$('.cmt-zan').on('click',function(e){
					e.preventDefault();
					var $this = $(this);
					if(!$this.attr('data-mark')){
						var commentId = $this.attr('data-commentId');
						var commentIdJson = {"commentId" : commentId};
						var num = $this.find('em').html()==''? 0:Number($this.find('em').html());
						$.ajax({
							url: location.protocol + '//' + location.host + '/worry/praise?token=' + token,
							// url: './js/data/worry_forumlist_data.json',
							type : 'POST',
							dataType: 'json',
							// headers: {"Content-type": "application/json;charset=UTF-8"},
							contentType: 'application/json;charset=UTF-8',
							data: JSON.stringify(commentIdJson),
							success: function(d){
								$this.find('em').html(num+1);
								$this.attr('data-mark','1');
							}
						})
					}
				});

				// 回复内容
				$('.c-landlord-text span').on('click',function(e){
					e.preventDefault();
					// var toldUid = $(this).get(0).dataset.id;
					// var nickname = $(this).get(0).dataset.nickname;
					$('#c-input').focus().val('');
					replySendJson = {
						"replyCommentId":'',
						"worryId": worryId,
						"fromId": uid,
						"toId": louzhuId,
						"toNickName": louzhuNickName
					};
					console.log(replySendJson);
				});
				// 回复评论一级
				$('.reply-btn').on('click',function(e){
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
				$('.cmt-reply li').on('click',function(e){
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

				var $float = $('.p-float');
				$('.c-showImg').on('click',function(e){
					e.preventDefault();
					var $this = $(this);
					var imgUrl = $this.attr('src');

					$('body').append('<img class="tempImg" style="position: absolute; left: 2000px; top: 2000px; display: block;" src="'+ imgUrl +'">');
					var tempImg = $('.tempImg');
					if(tempImg.width() > tempImg.height()){
						$('.p-float').html('<img style="width: 100%;" src="'+ imgUrl +'">');
					} else {
						$('.p-float').html('<img style="height: 100%;" src="'+ imgUrl +'">');
					}
					tempImg.remove();
					$float.show();
				});
				$float.on('click', function (e) {
					e.preventDefault();
					$float.hide();
				});
				$float.find('img').on('click', function (e) {
					e.preventDefault();
					$float.hide();
				});
			}
			//如果app外 跳下载
			if (isnotapp) {
				$('a').attr('href',downloadUrl);
				$('.p-btmfix-s-1').show();
				$('.p-wrap').prepend('<div style="width: 100%; height: 50px;"></div>');
			}
		}
	});

	// 发送按钮
	$('#c-sendreply').on('click',function(e){
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
					 //url: './js/data/worry_forumlist_data.json',
					type: 'POST',
					dataType: 'json',
					// headers: {"Content-type": "application/json;charset=UTF-8"},
					contentType: 'application/json;charset=UTF-8',
					data: JSON.stringify(replySendJson),
					success: function (d) {
						console.log(d);
						var p_alert = $('.p-alert');
						p_alert.css({'opacity':'1', 'z-index': '200'});
						setTimeout(function () {
							p_alert.css({'opacity':'0', 'z-index': '-10'});
							location.reload();
						}, 2000);
					}
				})
			}
		}
	})
});




