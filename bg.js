//https://developer.chrome.com/apps/idle for checking if user is idle

chrome.tabs.onUpdated.addListener(function checkUpdate(tabId, changeInfo, updatedTab) {
	if(updatedTab.status == "complete" && updatedTab.highlighted == true){
		startTimer(updatedTab);
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


chrome.idle.setDetectionInterval(120); //seconds
chrome.idle.onStateChanged.addListener(function(newState) {
	console.log("state change:" + newState);
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

function urlToHost(url){
	var l = document.createElement("a");
	l.href = url;
	var protocol = l.protocol;
	if(protocol == "http:" || protocol == "https:")
		return l.hostname;
	return "null";
}

function isSameDay(date1, date2){
	return date1.getDate() == date2.getDate()
      && date1.getMonth() == date2.getMonth()
      && date1.getFullYear() == date2.getFullYear();
}

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
	if(localStorage.currentURL != "null"){
		var nowTime = new Date().toLocaleString();
		console.log("STOP URL: " + localStorage.currentURL + " at: " + nowTime);
		addTime(localStorage.startTime, ""+Date.now(), localStorage.currentURL)

		localStorage.currentURL = "null";
	}
}

function addTime(startStamp, endStamp, url){
	console.log("startStamp: "+startStamp);
	console.log("endStamp: "+endStamp);
	var startDate = new Date(parseInt(startStamp));
	var endDate = new Date(parseInt(endStamp));
	while(!isSameDay(startDate,endDate)){
		var endOfStartDate = new Date(startDate);
		endOfStartDate.setHours(23,59,59,0);
		console.log("startDate: "+startDate);
		console.log("endOfStartDate: "+endOfStartDate);
		console.log("isSameDay: "+isSameDay(startDate,endOfStartDate));
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
	console.log(localStorage);
}

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};


function reset(){
	localStorage.clear();
	chrome.storage.local.clear();
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

















