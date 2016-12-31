window.onload = function(){
    //proof of concept that graphs work in stats view
    var ctx = document.getElementById("myChart");
    var today = new Date(Date.now())
    var siteTimes = JSON.parse(localStorage.days)[today.yyyymmdd()];
    if(Object.keys(siteTimes).length > 0){
        //top ten then rest
        var timesArray = [];
        for (var site in siteTimes) {
            timesArray.push({'url':site,'time':(siteTimes[site]/1000)});
        }
        timesArray = timesArray.sort(function(a, b) { return a.time < b.time ? 1 : -1; })
        var top10 = timesArray.slice(0, 10);

        timeSum = 0;
        for (var i = 9; i < timesArray.length; i++) {
            timeSum += timesArray[i].time;
        }

        top10.push({'url':'Other','time':timeSum});
        var max = top10[0].time;
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
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: timeLabels,//top X sites & other
                datasets: [{
                    label: 'Time Spent Today',
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
}