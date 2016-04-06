/**
 * Created by Ly on 2016/3/31.
 */
'use strict';

$(function () {
	console.log('start');
	var box = $('.bullet-box');
	var N = 0;

	window.setInterval(function () {

		box.find('.unit').each(function(){
			$(this).attr('top',$(this).attr('top') - 50);
			if($(this).attr('top') <= -340) {
				this.remove();
			}
			$(this).attr('style','-webkit-transform:translate3d(0, '+$(this).attr('top')+'px, 0);');
		});

		var $unit = $('<section class="unit" top="-50" style="-webkit-transform:translate3d(0, 30%, 0);"><img class="face" src="images/temp/c_cover.jpg" alt=""><p class="text">new'+ ++N +'</p></section>');
		box.append($unit);

	}, 2000);
});