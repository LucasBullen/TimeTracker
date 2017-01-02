//https://developer.chrome.com/apps/idle for checking if user is idle

chrome.tabs.onUpdated.addListener(function checkUpdate(tabId, changeInfo, updatedTab) {
	if(updatedTab.status == "complete" && updatedTab.highlighted == true){
		startTimer(updatedTab);
	}
});

chrome.windows.onFocusChanged.addListener(function callback(highlightInfo){
	if(highlightInfo == -1){
		stopTimer();
	}else{
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			startTimer(tabs[0]);
		});
	}
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
   	//Fires when the active tab in a window changes. url may not be set
   	//startTimer(tab);
   	chrome.tabs.get(activeInfo.tabId, function(tab) {
	   	if (chrome.runtime.lastError) {
        	console.log(chrome.runtime.lastError.message);
    	}else if(tab.status == "complete"){
	   		startTimer(tab);
	   	}
   	});

});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
   	//Fired when a tab is closed.
   	//check if tabId == current tab, if so stop timer
   	stopTimer();
});


chrome.idle.setDetectionInterval(10*60); //seconds
chrome.idle.onStateChanged.addListener(function(newState) {
	if(newState == "active"){
		if(localStorage.currentURL)
			startTimer(localStorage.currentURL);
	}else{
		stopTimer();
	}
});

chrome.management.onEnabled.addListener(function(info) {
	localStorage.startTime = Date.now();
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
	    localStorage.currentURL = urlToHost(tabs[0].url);
	});
	console.log("START URL: " + localStorage.startTime + " at: " + localStorage.currentURL);
})

function startTimer(tab){
	if(tab.status == "complete" && urlToHost(tab.url) != localStorage.currentURL){
		stopTimer()
		var nowTime = new Date().toLocaleString();
		var host = urlToHost(tab.url);
		console.log("START URL: " + host + " at: " + nowTime);
		//stop last timer and start new one
		localStorage.currentURL = host;
		localStorage.startTime = ""+Date.now();
	}
}

function stopTimer() {
	if(localStorage.currentURL && localStorage.currentURL != "null"){
		var nowTime = new Date().toLocaleString();
		console.log("STOP URL: " + localStorage.currentURL + " at: " + nowTime);
		addTime(localStorage.startTime, ""+Date.now(), localStorage.currentURL)

		localStorage.currentURL = "null";
	}
}

function addTime(startStamp, endStamp, url){
	if(!startStamp || !endStamp || !url)
		return;
	var startDate = new Date(parseInt(startStamp));
	var endDate = new Date(parseInt(endStamp));
	while(!isSameDay(startDate,endDate)){
		var endOfStartDate = new Date(startDate);
		endOfStartDate.setHours(23,59,59,0);
		addTime(startDate.getTime(), endOfStartDate.getTime(), url);//for today up till midnight
		startDate = startDate.setHours(0,0,0,0);
		startDate = startDate.setDate(startDate.getDate()+1);//start is next day
	}

	var dateString = startDate.yyyymmdd();
	if(!localStorage[dateString]){
		localStorage[dateString] = "{}";
	}
	var daySites = JSON.parse(localStorage[dateString]);

	if(!daySites[url]){
		daySites[url] = 0;
	}
	daySites[url] = parseInt(daySites[url]) + (endStamp - startStamp);
	localStorage[dateString] = JSON.stringify(daySites);
}

/*
get days object
if over multiple days
	loop through days and call add
if day is there
	add to sites
else
	create day and add to sites

*/

















