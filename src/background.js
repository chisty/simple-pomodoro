var clock;
var timerIsRunning= false;

var startClock= function(){
	chrome.storage.sync.get('pomTimeDB', function(data){
		if(data.pomTimeDB){
			var pomTime= data.pomTimeDB;
			console.log("pomtime refreshed to= "+pomTime);
			console.log("time in background= "+pomTime*60);
			clock= $('.clock').FlipClock(pomTime*60, {
				autoStart: false,
				countdown: true,				
				callbacks:{
					interval: function(){
						var time= clock.getTime().time;						
						if(time == 0){
							clock.stop();
							console.log("Clock stopped");
							chrome.runtime.sendMessage({msg: "complete"});
						}
					}
				}
			});		
			clock.start();				
			console.log('Counter Started.');
		}
	});
};

var stopClock= function(){
	if(clock == undefined) return;

	clock.stop();				
};




chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.msg == "start"){							
			startClock();
			timerIsRunning= true;	
			sendResponse({success: true});
		}
		else if(request.msg == "cancel"){
			console.log('Stop clock command acknowledged.');						
			stopClock();
			timerIsRunning= false;
			sendResponse({success: true});
		}
	}
);
