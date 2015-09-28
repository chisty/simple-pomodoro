$(function (argument) {

	var clock= $('.clock').FlipClock(3000, {
		countdown: true,
		clockFace: 'MinuteCounter'
	});


	$('#pomDuration').focusout(function () {
		var duration= $('#pomDuration').val();
		if(isNaN(duration) || duration < 0)			
			alert("Please enter a numeric value greater than 0.")
		chrome.storage.sync.set({'pomDurationDB' : duration});
	});

	$('#breakDuration').focusout(function () {
		var breakDuration= $('#breakDuration').val();
		if(isNaN(breakDuration) || breakDuration < 0)			
			alert("Please enter a numeric value greater than 0.")
		chrome.storage.sync.set({'breakDurationDB' : breakDuration});
	});

	$('#startPomBtn').click(function () {		

	});
});