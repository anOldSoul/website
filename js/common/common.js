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
  handleCompanyTabChange: function(options) {
    $('.company_header_box').each(function(index, el) {
      $(this).click(function() {
        $('.company_header_box').removeClass('active')
        $(this).addClass('active')
        $('.hotel_manage').css("background-image", 'url(' + options.srcArr[index] + ')')
        if (index === 1 || index === 2) {
          $('.hotel_box').addClass('fontDiff')
        } else {
          $('.hotel_box').removeClass('fontDiff')
        }
        $('#hotel_title').html(options.htmlArr[index])
        $('#hotel_detail').html(options.htmlDetailArr[index])
      })
    })
  },
  handleProTabChange: function(options) {
    $('.modules_item').each(function(index, el) {
      $(this).click(function() {
        $('.modules_item').removeClass('active')
        $(this).addClass('active')
        $('.moduleboxImg img').attr('src', options.srcArr[index])
        $('.product_img1').attr('src', options.srcArr1[index])
        $('.product_img2').attr('src', options.srcArr2[index])
        $('.product_img3').attr('src', options.srcArr3[index])
        $('#idTitle').html(options.htmlArr[index])
        $('#idSubTitle').html(options.subHtmlArr[index])
        $('#solution_things').html(options.solutionArr[index])
        $('#lock_title1').html(options.solutionTitleArr1[index])
        $('#lock_title2').html(options.solutionTitleArr2[index])
        $('#lock_title3').html(options.solutionTitleArr3[index])
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