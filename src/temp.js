var updateClock= function (time){
		if(time < 0)
			time= 0;
		var clock= $('.clock').FlipClock(time, {
			autoStart: false,
			countdown: true,
			clockFace: 'MinuteCounter',
			callbacks:{
				interval: function(){
					var time= clock.getTime().time;						
					if(time == 0){
						clock.stop();
						console.log("Clock stopped");
						chrome.runtime.sendMessage({msg: "endClockCommand"});
					}				
				}
			}
		});		
		if(time> 0)
			clock.start();
		$(".clock").show();
	};