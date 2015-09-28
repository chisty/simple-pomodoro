/*chrome.storage.sync.get('pomTimeDB', function(data){
	if(data.pomTimeDB){
		var pomTime= data.pomTimeDB;
		var clock= $('.clock').FlipClock(pomTime*60, {
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
		console.log('Counter Started.');
	}
});*/


var process= function(value){
	console.log('value is '+value);
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.msg == "chisty"){
			console.log('Request passed here');
			/*sendResponse({msg: "goodbye"});*/
			chrome.runtime.sendMessage({fromBgMsg: "done"});
		}
	}
);
