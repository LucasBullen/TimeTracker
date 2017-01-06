function urlToHost(url){
	var l = document.createElement("a");
	l.href = url;
	var protocol = l.protocol;
	if(protocol == "http:" || protocol == "https:")
		return l.hostname;
	return "null";
}

function hostToShortString(host){
	return host.replace(/^www\./, "");
}

function isSameDay(date1, date2){
	return date1.getDate() == date2.getDate()
      && date1.getMonth() == date2.getMonth()
      && date1.getFullYear() == date2.getFullYear();
}

function getLSByDay(day){
	if(day == 'today'){
		day = new Date(Date.now());
	}
	if(localStorage[day.yyyymmdd()]){
    	return JSON.parse(localStorage[day.yyyymmdd()]);
    }else{
    	return {};
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

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

function dateToString(date){
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();

    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('/');
}

function reset(){
	localStorage.clear();
	chrome.storage.local.clear();
}