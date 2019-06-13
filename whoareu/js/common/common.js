var comJs = {
  getUrlParam: function(name) {//a标签跳转获取参数
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return (r[2]); return null;
  },
  initNav: function(type) {
    $("[data-navType]").each(function(index, element) {
      if ($(this).attr('data-navType') === type) {
        $(this).addClass('active')
      } else {
        $(this).removeClass('active')
      }
    })
  },
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
}

$(function() {
	if(window.location.href.indexOf("8080") != -1) {
		if(!$.cookie("changeFlag")) {
			window.location.href = navigator.language == "zh-CN" ? "http://localhost:8080/WayWebSite-New/index.html" :
				"http://localhost:8080/WayWebSite-New/index_en.html";
		}
	} else {
		if(window.location.href.indexOf("support.html") != -1 || window.location.href.indexOf("support_en.html") != -1 ||
				window.location.href.indexOf("pc_client/user_contract.html") != -1 || window.location.href.indexOf("pc_client/user_contract_en.html") != -1) {
			return;
		}
		
		if($.cookie("changeFlag") == null) {
			window.location.href = navigator.language == "zh-CN" ? "https://www.whoareyou.live" : "https://www.whoareyou.live/index_en.html";
		}
	}
	$.cookie("changeFlag", true);
});

function toENorCN() {
	if(window.location.href.indexOf("html") == -1) {
		window.location.href = "index_en.html";
	} else {
		window.location.href = window.location.href.indexOf("_en")==-1 ? window.location.href.replace(".html", "_en.html") : window.location.href.replace("_en.html", ".html");
	}
}

