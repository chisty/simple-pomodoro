$(function (argument) {

	$(".clock").hide();

	var updateClock= function (time){
		var clock= $('.clock').FlipClock(time, {
			countdown: true,
			clockFace: 'MinuteCounter'
		});		
		$(".clock").show();
	};	

	chrome.storage.sync.get('pomTimeDB', function(data){
		if(data.pomTimeDB){
			var pomTime= data.pomTimeDB;
			$('#pomTime').val(pomTime);
			chrome.storage.sync.get('lastSavedTime', function(data){
				var currentTimeInSecond= new Date().getTime() / 1000;
				var difference= currentTimeInSecond - data.lastSavedTime;							
				updateClock(pomTime*60-difference);
			});
		}
	});

	chrome.storage.sync.get('breakTimeDB', function(data){
		if(data.breakTimeDB){
			$('#breakTime').val(data.breakTimeDB);
		}
	});	

	$('#startPomBtn').click(function () {	
		var pomTime= $('#pomTime').val();
		var breakTime= $('#breakTime').val();	
		var currentTimeInSecond= new Date().getTime() / 1000;	

		chrome.storage.sync.set({'pomTimeDB' : pomTime});		
		chrome.storage.sync.set({'breakTimeDB' : breakTime});
		chrome.storage.sync.set({'lastSavedTime' : currentTimeInSecond});
		
		updateClock(pomTime*60);
	});
});