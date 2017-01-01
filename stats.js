var day = new Date(Date.now());
var daySites = {};
if(localStorage[day.yyyymmdd()])
    daySites = JSON.parse(localStorage[day.yyyymmdd()]);
var chart;

window.onload = function(){
    //proof of concept that graphs work in stats view
    buildGraph();
    setButtons();
    var ystButton = document.getElementById("yesterday-button");
    var tmrButton = document.getElementById("tomorrow-button");
    ystButton.onclick =  function(){
        day.setDate(day.getDate()-1);
        daySites = {};
        if(localStorage[day.yyyymmdd()])
            daySites = JSON.parse(localStorage[day.yyyymmdd()]);
        setButtons();
        buildGraph();
    }
    tmrButton.onclick =  function(){
        day.setDate(day.getDate()+1);
        daySites = {};
        if(localStorage[day.yyyymmdd()])
            daySites = JSON.parse(localStorage[day.yyyymmdd()]);
        setButtons();
        buildGraph();
    }
}

function setButtons(){
    var ystButton = document.getElementById("yesterday-button");
    var tmrButton = document.getElementById("tomorrow-button");
    var dayHold = new Date(day);

    dayHold.setDate(day.getDate()+1);
    tmrButton.innerHTML = dayHold.toISOString().substring(0, 10);
    if(!localStorage[dayHold.yyyymmdd()]){
        tmrButton.disabled = true;
    }else{
        tmrButton.disabled = false;
    }

    dayHold.setDate(day.getDate()-1);
    ystButton.innerHTML = dayHold.toISOString().substring(0, 10);
    if(!localStorage[dayHold.yyyymmdd()]){
        ystButton.disabled = true;
    }else{
        ystButton.disabled = false;
    }
}

function buildGraph(){
    if(chart)
        chart.destroy();
    var ctx = document.getElementById("myChart");
    var top10 = [];
    if(Object.keys(daySites).length > 0){
        //top ten then rest
        var timesArray = [];
        for (var site in daySites) {
            timesArray.push({'url':site,'time':(daySites[site]/1000)});
        }
        timesArray = timesArray.sort(function(a, b) { return a.time < b.time ? 1 : -1; })
        top10 = timesArray.slice(0, 10);

        timeSum = 0;
        for (var i = 9; i < timesArray.length; i++) {
            timeSum += timesArray[i].time;
        }
        if(timeSum > 0)
            top10.push({'url':'Other','time':timeSum});
    }
    var max = 0;
    if(top10[0])
        max = top10[0].time;
    var timeLabels = [];
    var timeData = [];
    var timeBackgroundColor = [];
    var timeBorderColor = [];
    for (var i = 0; i < top10.length; i++) {
        top10[i]
        timeLabels.push(top10[i].url);
        timeData.push((Math.floor(parseInt(top10[i].time))/60).toFixed(2));
        var colour = Math.floor(((top10[i].time/max)*255));
        timeBackgroundColor.push('rgba('+ colour +', 0, 0, 0.2)');
        timeBorderColor.push('rgba('+ colour +', 0, 0, 1)');
    }
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: timeLabels,//top X sites & other
            datasets: [{
                label: 'Time Spent on '+day.toISOString().substring(0, 10),
                data: timeData,//time (in mins)(so /60)
                backgroundColor: timeBackgroundColor,
                borderColor: timeBorderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}