var clock, countUp;
var timerIsRunning= false;

var showNotification= function(){
	var opt= {
		type: "image",
		title: "Congrates!",
		message: "Pomodoro complete!",
		iconUrl: "../resources/main-icon.png",	
		imageUrl: "../resources/pom1.jpg",				
		priority: 2			
	};
	var notificationId= "notificationId";

	chrome.notifications.clear(notificationId, function() {
		chrome.notifications.create(notificationId, opt, function(){});	
	});
};

var startClock= function(){
	chrome.storage.sync.get('pomTimeDB', function(data){
		if(data.pomTimeDB){
			var pomTime= data.pomTimeDB;		
			clock= $('.clock').FlipClock(pomTime*60, {
				autoStart: false,
				clockFace: 'Counter'			
			});

			countUp = setInterval(function() {
			    clock.decrement();			    			    	  
		        if(clock.getTime().time == 0) {
		        	clock.stop();	
		        	timerIsRunning= false;		        	
		        	clearInterval(countUp);					
					showNotification();
		        }     
			}, 1000);											
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
