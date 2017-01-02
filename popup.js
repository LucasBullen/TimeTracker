var daysSites;
window.onload = function(){
	var urlHold = localStorage.currentURL
	localStorage.currentURL = urlHold;
	localStorage.startTime = ""+Date.now();
	document.getElementById('open-stats-button').onclick = function(){
		chrome.tabs.create({ url: chrome.extension.getURL('stats.html')});
	}
	var today = new Date(Date.now())
	daysSites = JSON.parse(localStorage[today.yyyymmdd()]);
	drawTable();
	window.setInterval(tick, 1000);
}

function tick(){
	if(daysSites){
		drawTable();
		if(localStorage.currentURL != "null")
			daysSites[localStorage.currentURL] += 1000;
	}
}

function drawTable(){
	document.getElementById('times-div').innerHTML = "";
	var timesArray = [];
	for (var site in daysSites) {
		timesArray.push({'url':site,'time':(daysSites[site]/1000)});
	}
	var top10 = timesArray.sort(function(a, b) { return a.time < b.time ? 1 : -1; })
                .slice(0, 10);
	for (i = 0; i < top10.length; i++) {
		var timeDiv = document.createElement('div');
		timeDiv.innerHTML = "<p>"+top10[i].url+": "+secondsToTimeString(top10[i].time)+"</p>";
		document.getElementById('times-div').appendChild(timeDiv);
	}
}