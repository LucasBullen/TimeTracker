window.onload = function(){
    //proof of concept that graphs work in stats view
    buildStackedColumnGraph();
    buildPieGraph();
}

function buildPieGraph(){
    var data = [];
    var day = new Date(Date.now());
    var dayData = {};
    if(localStorage[day.yyyymmdd()])
        dayData = JSON.parse(localStorage[day.yyyymmdd()]);
    var otherTime = 0;
    var totalTime = 0;
    for(var site in dayData){
        if(Object.keys(dayData).length > 7 && dayData[site]/60000 < 1){
            otherTime +=dayData[site];
        }else{
            data.push({label:site, indexLabel:hostToShortString(site), y:parseFloat((dayData[site]/60000).toFixed(2))});
        }
        totalTime+=dayData[site];
    }
    if (otherTime > 0) {
        data.push({label:"Other", indexLabel:"Other", y:parseFloat((otherTime/60000).toFixed(2))});
    }
    var chart = new CanvasJS.Chart("pieGraph",
    {
        title:{
            text: "Today's Internet Usage: " + secondsToTimeString(totalTime/1000)
        },
        data: [
        {
            type: "pie",
            toolTipContent: '<div><img src="https://s2.googleusercontent.com/s2/favicons?domain="{label}"'+
                '" style="vertical-align:middle;margin:2px;"/><span style="vertical-align:middle;">'+
                '{indexLabel}: {y} mins</span></div>',
            legendText: "{indexLabel}",
            dataPoints: data
        }]
    });
    chart.render();
}

function buildStackedColumnGraph(){
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
            toolTipContent: '<div><img src="https://s2.googleusercontent.com/s2/favicons?domain='+
                site+'" style="vertical-align:middle;margin:2px;"/><span style="vertical-align:middle;">'+
                site+': {y} mins</span></div>',
            dataPoints: siteWeekData[site]
        });
    }
    var chart = new CanvasJS.Chart("stackedColumnGraph", {
        title: {
            text: "How You Spend Your Time"
        },
        dataPointWidth: 40,
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

