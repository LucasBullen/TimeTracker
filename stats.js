window.onload = function(){
    //proof of concept that graphs work in stats view
    buildStackedColumnGraph();
    buildPieGraph();
    buildRuleList();
}

function buildRuleHTML(URL, rule, totalTime){
    var timeInType = 0;
    switch(rule.budgetType){
        case "mins":
           timeInType = totalTime / 60000;
            break;
        case "hrs":
           timeInType = totalTime / 3600000;
            break;
    }
    var percent = (timeInType/rule.budget).toFixed(2);
    timeInType = timeInType.toFixed(2);
    return {
            percent:percent,
            html:"<p><b>"+URL+"</p></b>"+
                "<p>Rule: "+rule.budget+" "+rule.budgetType+" / "+rule.length+"</p>"+
                //"<p>Progress: "+timeInType+" / "+rule.budget+" "+rule.budgetType+"</p>"+
                "<p>"+(percent*100).toFixed(0)+"%</p>"+
                progressBar(percent,timeInType+" / "+rule.budget+" "+rule.budgetType)
        };
}

function addRule(site, budget, budgetType, length){
    if(!localStorage.rules)
        localStorage.rules = "{}";
    var rules = JSON.parse(localStorage.rules);
    rules[site] = {budget:budget,budgetType:budgetType,length:length};
    localStorage.rules = JSON.stringify(rules);
}

function buildRuleList(){
    //get rules
    if(localStorage.rules){
        var rules = JSON.parse(localStorage.rules);
        var ruleTable = document.getElementById('rulesList');
        ruleTable.innerHTML = "";
        var ruleHTMLs = [];
        for(var URL in rules){
            var totalTime = 0;
            switch(rules[URL].length){
                case "day":
                    var dayData = getLSByDay('today');
                    for(var site in dayData){
                        if(site == URL){
                            totalTime = dayData[site];
                            break;
                        }
                    }
                    break;
                case "week":
                    var day = new Date(Date.now());
                    while(day.getDay() != 0){
                        var dayData = getLSByDay(day);
                        for(var site in dayData){
                            if(site == URL){
                                totalTime += dayData[site];
                                break;
                            }
                        }
                        day.setDate(day.getDate()-1);
                    }
                    break;
            }
            var ruleHTML = buildRuleHTML(URL, rules[URL], totalTime);
            ruleHTMLs.push(ruleHTML);
        }
        ruleHTMLs.sort(function(a, b) { return a.percent < b.percent ? 1 : -1; });
        ruleHTMLs.map(function(a){ruleTable.innerHTML+=a.html});
        console.log(ruleHTMLs);
        /*for(var rule in ruleHTMLs){
            ruleTable.innerHTML+=rule.html;
        }*/
    }
    //add rule
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

