window.onload = function(){
    //proof of concept that graphs work in stats view
    buildGraph();
    setButtons();
    var ystButton = document.getElementById("back-button");
    var tmrButton = document.getElementById("forward-button");
    ystButton.onclick =  function(){
    /*    day.setDate(day.getDate()-1);
        daySites = {};
        if(localStorage[day.yyyymmdd()])
            daySites = JSON.parse(localStorage[day.yyyymmdd()]);
        setButtons();
        buildGraph();*/
    }
    tmrButton.onclick =  function(){
       /* day.setDate(day.getDate()+1);
        daySites = {};
        if(localStorage[day.yyyymmdd()])
            daySites = JSON.parse(localStorage[day.yyyymmdd()]);
        setButtons();
        buildGraph();*/
    }
}

function setButtons(){
    /*var ystButton = document.getElementById("back-button");
    var tmrButton = document.getElementById("forward-button");
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
    }*/
}

function buildGraph(){
    var siteWeekData = {}
    var day = new Date(Date.now());
    for (var i = 0; i < 7; i++) {
        var dayData = {};
        if(localStorage[day.yyyymmdd()]){
            dayData = JSON.parse(localStorage[day.yyyymmdd()]);

            //TODO: cut down dayData
            var otherTime = 0;
            for (var site in dayData) {
                var mins = dayData[site]/60000;
                if(mins < 1){
                    otherTime += mins;
                    continue;
                }
                if(!siteWeekData[site])
                    siteWeekData[site] = buildWeek(new Date(Date.now()));
                siteWeekData[site][6-i] = ({label:dateToString(day),y:parseFloat(mins.toFixed(2))});
            }
            if(!siteWeekData["Other"])
                siteWeekData["Other"] = buildWeek(new Date(Date.now()));
            siteWeekData["Other"][6-i] = ({label:dateToString(day),y:parseFloat(otherTime.toFixed(2))});
        }else{

        }
        day.setDate(day.getDate()-1);
    }
    var weekData = [];
    for(var site in siteWeekData){
        weekData.push({
            type: "stackedColumn",
            toolTipContent:site+": {y}mins",
            dataPoints: siteWeekData[site]
        });
    }
    console.log(weekData);
    console.log(day);
    console.log(new Date(Date.now()));
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "How You Spend Your Time"
        },
        dataPointWidth: 20,
        axisX: {
            title: "Day"
        },
        axisY:{
            title: "Minutes"
        },
        data: weekData
    });
    chart.render();
}

function buildWeek(day){
    var holdDay = new Date(day);
    var weekArray = [];

    for (var i = 0; i < 7; i++) {
        weekArray.push({label:dateToString(holdDay),y:0});
        holdDay.setDate(holdDay.getDate()-1);
    }
    return weekArray.reverse();
}