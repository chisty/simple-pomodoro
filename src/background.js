var clock;
var timerIsRunning= false;
var startClock= function(){
	chrome.storage.sync.get('pomTimeDB', function(data){
		if(data.pomTimeDB){
			var pomTime= data.pomTimeDB;
			console.log("pomtime refreshed to= "+pomTime);
			clock= $('.clock').FlipClock(pomTime*60, {
				autoStart: false,
				countdown: true,
				clockFace: 'MinuteCounter',
				callbacks:{
					interval: function(){
						var time= clock.getTime().time;						
						if(time == 0){
							clock.stop();
							console.log("Clock stopped");
							chrome.runtime.sendMessage({msg: "pomodoroCompleteEvent"});
						}
					}
				}
			});		
			clock.start();	
			timerIsRunning= true;	
			console.log('Counter Started.');
		}
	});
};

var stopClock= function(){
	if(clock == undefined) return;

	clock.stop();			
	timerIsRunning= false;
};




chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.msg == "startClockCommand"){
			console.log('Start clock command acknowledged.');						
			startClock();
			sendResponse({success: true});
		}
		else if(request.msg == "stopClockCommand"){
			console.log('Stop clock command acknowledged.');						
			stopClock();
			sendResponse({success: true});
		}
	}
);
