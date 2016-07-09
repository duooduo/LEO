/**
 * Created by Administrator on 2016/7/9.
 */
'use strict';

var downloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forhappy';
var token = getQueryStringArgs().token == undefined? '' : getQueryStringArgs().token;
var uid = getQueryStringArgs().uid == undefined? '' : getQueryStringArgs().uid;
var shareId = getQueryStringArgs().shareId == undefined? '' : getQueryStringArgs().shareId;
var keyId = getQueryStringArgs().keyId == undefined? '' : getQueryStringArgs().keyId;
var worryId = getQueryStringArgs().worryId == undefined? '' : getQueryStringArgs().worryId;
var topicId = getQueryStringArgs().topicId == undefined? '' : getQueryStringArgs().topicId;