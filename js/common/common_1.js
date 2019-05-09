var comJs = {
  initNav: function(type) {
    if (!comJs.getQueryString('m')) {
      $(".header,.bottom").show()
      $("[data-navType]").each(function(index, element) {
        if ($(this).attr('data-navType') === type) {
          $(this).addClass('active')
        } else {
          $(this).removeClass('active')
        }
      })
    }
  },
  handleProTabChange: function(options) {
    $('.modules_item').each(function(index, el) {
      $(this).click(function() {
        $('.modules_item').removeClass('active')
        $(this).addClass('active')
        $('.moduleboxImg img').attr('src', options.srcArr[index])
        $('#idTitle').html(options.htmlArr[index])
        $('#idSubTitle').html(options.subHtmlArr[index])
      })
    })
  },
  initBanner: function(obj) {
    var $scene = null
    var el = $(obj)
    el.mouseover(function() {
      if (!$scene) {
        $scene = el.parallax({
          limitX: 20,
          scalarX: 5,
        })
      } else {
        $scene.parallax('enable')
      }
    })
    el.mouseout(function(event) {
      if ($scene) {
        $scene.parallax('disable')
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