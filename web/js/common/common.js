var comJs = {
  getUrlParam: function(name) {//a标签跳转获取参数
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return (r[2]); return null;
  },
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
  handleManageItemTabHover: function(className, options) {
    $(className).each(function(index, el) {
      $(this).hover(function() {
        $(className).removeClass('hover')
        $(this).addClass('hover')
        if (className === '.manage_item') {
          $('.manage_img').each(function(imgIndex) {
            $('.manage_img').eq(imgIndex).css('background-image', 'url(' + options.saasBacUnselected[imgIndex] + ')')
          })
          $('.manage_img').eq(index).css('background-image', 'url(' + options.saasBac[index] + ')')
          $('.saas_img img').attr("src", options.saasRightImg[index])
        }
        if (className === '.manage_item1') {
          $('.manage_img_app').each(function(imgIndex) {
            $('.manage_img_app').eq(imgIndex).css('background-image', 'url(' + options.appBacUnselected[imgIndex] + ')')
          })
          $('.manage_img_app').eq(index).css('background-image', 'url(' + options.appBac[index] + ')')
          $('.app_img img').attr("src", options.appRightImg[index])
        }
      })
    })
  },
  handleCaseTabChange: function(options) {
    $('.case_item').each(function(index, el) {
      $(this).click(function() {
        $('.case_item').removeClass('active')
        $(this).addClass('active')
        $('.case_img img').attr('src', options.srcArr[index])
        $('.case_title').html(options.htmlArr[index])
        $('.case_subtitle').html(options.htmlDetailArr[index])
        $('.more_btn a').attr('href', options.htmlHref[index])
      })
    })
  },
  showCurrentCompany: function(options, index) {
    if (index > 0) {      
      $('.company_header_box').removeClass('active')
      $('.company_header_box').eq(index).addClass('active')
      $('.hotel_manage img').attr("src", options.srcArr[index])
      if (index === 1 || index === 2) {
        $('.hotel_box').addClass('fontDiff')
      } else {
        $('.hotel_box').removeClass('fontDiff')
      }
      $('#hotel_title').html(options.htmlArr[index])
      $('#hotel_detail').html(options.htmlDetailArr[index])
      $('#htmlSupport').html(options.htmlSupport[index])
      $('#htmlService').html(options.htmlService[index])
      $('#htmlCooperation').html(options.htmlCooperation[index])
    }
  },
  handleCompanyTabChange: function(options) {
    $('.company_header_box').each(function(index, el) {
      $(this).click(function() {
        $('.company_header_box').removeClass('active')
        $(this).addClass('active')
        $('.hotel_manage img').attr("src", options.srcArr[index])
        if (index === 1 || index === 2) {
          $('.hotel_box').addClass('fontDiff')
        } else {
          $('.hotel_box').removeClass('fontDiff')
        }
        $('#hotel_title').html(options.htmlArr[index])
        $('#hotel_detail').html(options.htmlDetailArr[index])
        $('#htmlSupport').html(options.htmlSupport[index])
        $('#htmlService').html(options.htmlService[index])
        $('#htmlCooperation').html(options.htmlCooperation[index])
      })
    })
  },
  showCurrent: function(options,index) {
    $('.modules_item').removeClass('active')
    $('.modules_item').eq(index).addClass('active')
    comJs.profunc(options, index)
  },
  profunc: function(options,index) {
    $('.moduleboxImg img').attr('src', options.srcArr[index])
    $('.product_img1').attr('src', options.srcArr1[index])
    $('.product_img2').attr('src', options.srcArr2[index])
    $('.product_img3').attr('src', options.srcArr3[index])
    $('#idTitle').html(options.htmlArr[index])
    $('#idSubTitle').html(options.subHtmlArr[index])
    $('#lock_title1').html(options.solutionTitleArr1[index])
    $('#lock_title2').html(options.solutionTitleArr2[index])
    $('#lock_title3').html(options.solutionTitleArr3[index])
    if (index > 0) {
      $("#hideSection").hide();
      $("#hideSection1").hide();
      $("#hideSection2").show();
    } else {
      $("#hideSection").show();
      $("#hideSection1").show();
      $("#hideSection2").hide();
    }
  },
  handleProTabChange: function(options) {
    $('.modules_item').each(function(index, el) {
      $(this).click(function() {
        $('.modules_item').removeClass('active')
        $(this).addClass('active')
        comJs.profunc(options, index)
      })
    })
  },
  initBanner: function(obj) {
  },
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
}