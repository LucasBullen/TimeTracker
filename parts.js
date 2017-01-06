function progressBar(progress, text){
	console.log(progress);
	var colNum = Math.floor(progress*255);
	var beforeOrAfter = '</div><span style="vertical-align:top;margin-top: 3px;margin-left: 5px;display: inline-block;">'+text+'</span>';
	if(progress > 0.5)
		beforeOrAfter = '<span style="margin-top: 3px;margin-right: 5px;color: white;float: right;display: inline-block;">'+text+'</span></div>';

	var width = progress*100
	if(width > 100)
		width = 100;

	return '<div style="width:100%;height:20px;border: 2px black solid;">'+
  		'<div style="height:100%;width: '+width+'%;background-color:rgb('+colNum+
  		',0,0);display: inline-block;">'+beforeOrAfter+'</div>';
}