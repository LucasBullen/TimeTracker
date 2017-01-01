function yyyymmdd(date) {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  return [date.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};
var daysSites;
window.onload = function(){
	var urlHold = localStorage.currentURL
	stopTimer();
	localStorage.currentURL = urlHold;
	localStorage.startTime = ""+Date.now();
	document.getElementById('open-stats-button').onclick = function(){
		chrome.tabs.create({ url: chrome.extension.getURL('stats.html')});
	}
	daysSites = JSON.parse(localStorage[yyyymmdd(new Date(Date.now()))]);
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

function secondsToTimeString(seconds){
	var sInYear = 31536000;
	var sInDay = 86400;
	var sInHour = 3600;
	var sInMinute = 60;

	var string = ""

	if(seconds > sInYear){
		string += Math.floor(seconds/sInYear) + "y ";
		seconds = (seconds%sInYear);
	}
	if(seconds > sInDay){
		string += Math.floor(seconds/sInDay) + "d ";
		seconds = (seconds%sInDay);
	}
	if(seconds > sInHour){
		string += Math.floor(seconds/sInHour) + "h ";
		seconds = (seconds%sInHour);
	}
	if(seconds > sInMinute){
		string += Math.floor(seconds/sInMinute) + "m ";
		seconds = (seconds%sInMinute);
	}
	if(seconds > 1){
		if(string != "")
			string += "and ";
		string += Math.floor(seconds) + "s";
	}
	return string;
}