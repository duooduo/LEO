/**
 * floating heart for
 */
'use strict';

$(function () {
	var heartNumber = 0;
	var Time = {};
	$('#c_heart_btn').on('click',function(){
		var heartAnimationRandomNumber = parseInt(Math.random() * 10 + 1);
		$('#c_heart_btn').append('<div class="c_heart ch'+ heartNumber +' cha'+ heartAnimationRandomNumber +'"></div>');
		var i = heartNumber;
		Time[heartNumber] = setTimeout(function(){
			// alert(1);
			$('.ch'+i).remove();
		},3000);
		heartNumber++;

	})
});

