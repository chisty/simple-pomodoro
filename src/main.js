$(function (argument) {			

	var updateClock= function (timerIsRunning, totalTime){							
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

	var startPomodoro= function (pomTime) {
		chrome.runtime.sendMessage({msg: "start"}, function(data){
			if(data.success){								
				updateClock(true, pomTime);				
			}			
		});
	};
	

	chrome.storage.sync.get('pomTimeDB', function(data){
		if(data.pomTimeDB){
			var pomTime= data.pomTimeDB;
			$('#pomTime').val(pomTime);

			var totalTime= 0;
			var bgPage= chrome.extension.getBackgroundPage();
			var timerIsRunning= bgPage.timerIsRunning;
			if(timerIsRunning){
				var bgClock= bgPage.clock;		
				if(bgClock == undefined) return;
				
				totalTime= bgClock.getTime().time;			
			}			

			updateClock(timerIsRunning, totalTime);					
		}
	});	

	$('#startPomBtn').click(function () {	
		var pomTime= $('#pomTime').val();
		var breakTime= $('#breakTime').val();		

		chrome.storage.sync.set({'pomTimeDB' : pomTime});		
		chrome.storage.sync.set({'breakTimeDB' : breakTime});			
		
		var timerIsRunning= chrome.extension.getBackgroundPage().timerIsRunning;
		if(timerIsRunning){
			var dialogResult= confirm("Pomodoro running. Do you want to restart?");
			if(dialogResult){
				startPomodoro(pomTime * 60);
			}
		}
		else{
			startPomodoro(pomTime * 60);
			/*startPomodoro(10);*/
		}						
	});

	$('#cancelPomBtn').click(function () {			
		var dialogResult= confirm("Uncle! Do you want to quit?\n Pomodoro is running.");
		if(dialogResult){
			chrome.runtime.sendMessage({msg: "cancel"}, function(data){
				if(data.success){				
					updateClock(false, 0);					
				}
			});
		}			
	});	

	/*chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.msg == "complete"){
			var opt= {
				type: "basic",
				title: "Congrates!",
				message: "Pomodoro complete!",
				iconUrl: "../resources/main-icon.png",				
				priority: 2,
				buttons: 	[
								{ title: 'Take a break!', iconUrl: '../resources/main-icon.png'},
                				{ title: 'Skip break', iconUrl: '../resources/main-icon.png'}
                			]
			};
			var id= "notificationId";			

			chrome.notifications.create(id, opt, function(id){console.log("Notification shown.")});
			var onbuttonClickedCallback= function(notificationId, buttonIndex){
				if(notificationId == 'notificationId'){
					chrome.notifications.clear(id, clearCallback);	
					if(buttonIndex == 0){
						alert('break');
					}			
					else{
						alert('skip');
					}
				}
			}

			chrome.notifications.onButtonClicked.addListener(onbuttonClickedCallback);
		}
	});*/	

	chrome.storage.sync.get('breakTimeDB', function(data){
		if(data.breakTimeDB){
			$('#breakTime').val(data.breakTimeDB);
		}
	});	
});