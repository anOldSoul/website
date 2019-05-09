function replaceHTML(callback){this._callback=callback||null;}
replaceHTML.prototype = {
	run:function(){this.searchWeb();},
	showLbiFile:function(){
		if(this._callback){this._callback()}
	},
	searchWeb:function(){
		var self=this;
		var total=$("[data-lbifile]").size();
		var count=0;
		$("[data-lbifile]").each(function(index, element) {
			new loadAjax($(this),$(this).attr("data-lbifile"),function(){
				count++;
				if(count==total){
					self.showLbiFile();
				}
			});
        });
	}
}
function loadAjax(obj,url,callBack){
	$.get(url,function(data,status,xhr){
		obj.replaceWith(data);
		if(callBack)callBack();
	})
}

$(function(){
	new replaceHTML(function(){
		// strat();
	}).run();
});









