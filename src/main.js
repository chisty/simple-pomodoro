$(function (argument) {
	/*$(".clock").hide();*/	

	var updateClock= function (){			
		var totalTime= 0;
		var bgPage= chrome.extension.getBackgroundPage();
		var timerIsRunning= bgPage.timerIsRunning;
		if(timerIsRunning){
			var bgClock= bgPage.clock;		
			if(bgClock == undefined) return;
			totalTime= bgClock.getTime().time;
		}
					
		var clock= $('.clock').FlipClock(totalTime, {
			autoStart: false,
			countdown: true,
			clockFace: 'MinuteCounter',
			callbacks:{
				interval: function(){
					var time= clock.getTime().time;						
					if(time == 0){
						clock.stop();						
					}				
				}
			}
		});		

		if(timerIsRunning)		
			clock.start();
		$(".clock").show();
	};	

	chrome.storage.sync.get('pomTimeDB', function(data){
		if(data.pomTimeDB){
			var pomTime= data.pomTimeDB;
			$('#pomTime').val(pomTime);
			updateClock();
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

		chrome.storage.sync.set({'pomTimeDB' : pomTime});		
		chrome.storage.sync.set({'breakTimeDB' : breakTime});			

		chrome.runtime.sendMessage({msg: "startClockCommand"}, function(data){
			if(data.success){
				console.log("Requested from pop up to start the clock in background page.");				
				updateClock();
			}			
		});		
	});

	$('#cancelPomBtn').click(function () {			
		chrome.runtime.sendMessage({msg: "stopClockCommand"}, function(data){
			if(data.success){
				timerIsRunning= false;
				updateClock();
			}
		});		
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.msg == "pomodoroCompleteEvent"){
			var opt= {
				type: "basic",
				title: "Success",
				message: "Pomodoro complete!",
				iconUrl: "../resources/main-icon.png"
			};
			chrome.notifications.create('reset', opt, function(){});
		}
	});	
});