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

function imgShow(outerdiv, innerdiv, bigimg, _this){
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    src = src.replace(".png", "_big.png");
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性
    /*获取当前点击图片的真实大小，并显示弹出层及大图*/
    $("<img/>").attr("src", src).load(function(){
        var windowW = $(window).width();//获取当前窗口宽度
        var windowH = $(window).height();//获取当前窗口高度
        var realWidth = this.width;//获取图片真实宽度
        var realHeight = this.height;//获取图片真实高度
        var imgWidth, imgHeight;
        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
        if(realHeight>windowH*scale) {//判断图片高度
            imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放
            imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度
            if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度
                imgWidth = windowW*scale;//再对宽度进行缩放
            }
        } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度
            imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放
            imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度   
        } else {//如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
        }

        $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放
        var w = (windowW-imgWidth)/2;//计算图片与窗口左边距
        var h = (windowH-imgHeight)/2;//计算图片与窗口上边距
        $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性
        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg

    });

    $(outerdiv).click(function(){//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });
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
	/* 此处为何无效？ */
	/*$(".pimg").click(function(){
		var _this = $(this);//将当前的pimg元素作为_this传入函数
		imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
	});*/
});

function toENorCN() {
	if(window.location.href.indexOf("html") == -1) {
		window.location.href = "index_en.html";
	} else {
		window.location.href = window.location.href.indexOf("_en")==-1 ? window.location.href.replace(".html", "_en.html") : window.location.href.replace("_en.html", ".html");
	}
}

