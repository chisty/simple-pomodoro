$(function (argument) {

	$(".clock").hide();

	var updateClock= function (time){
		var clock= $('.clock').FlipClock(time, {
			autoStart: false,
			countdown: true,
			clockFace: 'MinuteCounter',
			callbacks:{
				interval: function(){
					var time= clock.getTime().time;
					if(time %10 == 0)
						console.log(time);
				}
			}
		});		
		clock.start();
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

		var bgPage= chrome.extension.getBackgroundPage();
		bgPage.process(300);

		/*var pomTime= $('#pomTime').val();
		var breakTime= $('#breakTime').val();	
		var currentTimeInSecond= new Date().getTime() / 1000;	

		chrome.storage.sync.set({'pomTimeDB' : pomTime});		
		chrome.storage.sync.set({'breakTimeDB' : breakTime});
		chrome.storage.sync.set({'lastSavedTime' : currentTimeInSecond});
		
		updateClock(pomTime*60);*/
	});

	$('#cancelPomBtn').click(function () {			

		chrome.runtime.sendMessage({msg: "chisty"}, function(){
			console.log("Requested from pop up");
		});
		/*chrome.storage.sync.set({'pomTimeDB' : 0});		
		chrome.storage.sync.set({'breakTimeDB' : 0});
		chrome.storage.sync.set({'lastSavedTime' : undefined});	*/	
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.fromBgMsg == "done"){
			console.log("Yahooooooo. I got message");
		}
	});

	var getDB= function(value){
		console.log('Popup value is '+value)		;
	}
});