function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = this.responseText;
          while (tempDiv.firstChild) {
            elmnt.parentNode.insertBefore(tempDiv.firstChild, elmnt);
          }
          elmnt.parentNode.removeChild(elmnt);
          includeHTML(callback);
          executeScripts(tempDiv);
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (typeof callback === "function") callback();
}

function executeScripts(element) {
  var scripts = element.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; i++) {
    var script = document.createElement("script");
    script.type = scripts[i].type || "text/javascript";
    if (scripts[i].src) {
      script.src = scripts[i].src;
      script.onload = function () {};
      document.head.appendChild(script);
    } else {
      script.text = scripts[i].innerHTML;
      document.head.appendChild(script);
    }
    document.head.removeChild(script);
  }
}

function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const openButton = document.querySelector(".sidebar--open");
  const closeButton = document.querySelector(".sidebar--close");
  const mainVisual = document.querySelector(".main-visual");
  const pickupButtons = document.querySelectorAll(".pickup--open");
  const pickupList = document.querySelector(".pickup-list");
  const backButtons = document.querySelectorAll(".pickup-list .back-btn");

  if (
    !sidebar ||
    !openButton ||
    !closeButton ||
    !pickupButtons ||
    !pickupList
  ) {
    return;
  }

  openButton.addEventListener("click", () => {
    sidebar.classList.add("active");
    mainVisual.classList.add("active");
  });

  closeButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
    mainVisual.classList.remove("active");
  });

  pickupButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelector(".pickup-list.pickup-store")
        /* .querySelector(".pickup-list.pickup-addr") 매장주소 페이지 */
        .classList.add("active");
      mainVisual.classList.add("active");
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pickupList = button.closest(".pickup-list");
      if (pickupList) pickupList.classList.remove("active");
      mainVisual.classList.remove("active");
    });
  });
}

function datePicker() {
  let startDate = null;
  let endDate = null;

  // 달력 초기화
  $(".datepicker").datepicker({
    numberOfMonths: 1,
    dateFormat: "yy.m.d",
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],

    showOtherMonths: true,
    selectOtherMonths: true,

    onSelect: function (dateText, inst) {
      const selectedDate = $(this).datepicker("getDate");

      if (!startDate || endDate) {
        startDate = selectedDate;
        endDate = null;
      } else if (selectedDate > startDate) {
        endDate = selectedDate;
      } else {
        startDate = selectedDate;
        endDate = null;
      }

      $(this).datepicker("refresh");
    },
    beforeShowDay: function (date) {
      const classes = [];

      if (date.getDay() === 0) {
        classes.push("sunday");
      }

      if (!startDate) {
        return [true, classes.join(" ")];
      }

      if (startDate && !endDate && date.getTime() === startDate.getTime()) {
        classes.push("range");
      }

      if (startDate && endDate && date >= startDate && date <= endDate) {
        classes.push("range");
      }

      return [true, classes.join(" ")];
    },
  });

  $(".apply-btn").on("click", function () {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    const formattedStart = $.datepicker.formatDate("yy.m.d", startDate);
    const formattedEnd = $.datepicker.formatDate("yy.m.d", endDate);

    $(".period-input-bx").text(`${formattedStart} ~ ${formattedEnd}`);
    $("#periodPopup").removeClass("open");
  });

  $(".cancel-close").on("click", function () {
    startDate = null;
    endDate = null;
    $(".datepicker").datepicker("setDate", null);
    $(".datepicker").datepicker("refresh");
    $("#periodPopup").removeClass("open");
  });

  $(".period-change-btn").on("click", function () {
    startDate = null;
    endDate = null;
    $(".datepicker").datepicker("setDate", null);
    $(".datepicker").datepicker("refresh");
    $("#periodPopup").addClass("open");
  });
}

//픽업주문
function initMap() {
  const zoomInBtn = document.querySelector(".zoom-in");
  const zoomOutBtn = document.querySelector(".zoom-out");

  if (!zoomInBtn || !zoomOutBtn) {
    console.error(
      "Zoom buttons not found. Make sure the elements with IDs 'zoomInBtn' and 'zoomOutBtn' exist in your HTML."
    );
    return;
  }

  var position = new naver.maps.LatLng(37.3595704, 127.105399);

  var map = new naver.maps.Map("map", {
    center: position,
    zoom: 10,
    zoomControl: false,
  });

  // 지도 확대
  zoomInBtn.addEventListener("click", () => {
    const zoom = map.getZoom();
    if (zoom < 21) map.setZoom(zoom + 1);
  });

  // 지도 축소
  zoomOutBtn.addEventListener("click", () => {
    const zoom = map.getZoom();
    if (zoom > 0) map.setZoom(zoom - 1);
  });

  // 마커 아이콘 기본형
  var defaultIcon = {
    url: "./assets/images/main/custom-marker.svg",
    size: new naver.maps.Size(32, 32),
    anchor: new naver.maps.Point(16, 32),
  };

  // 마커 클릭 시 아이콘
  var clickedIcon = {
    url: "./assets/images/main/custom-marker-active.svg",
    size: new naver.maps.Size(32, 32),
    anchor: new naver.maps.Point(16, 32),
  };

  var marker = new naver.maps.Marker({
    position: position,
    map: map,
    icon: defaultIcon,
  });

  var isClicked = false;

  // 마커 클릭 이벤트
  naver.maps.Event.addListener(marker, "click", function () {
    isClicked = !isClicked;
    marker.setIcon(isClicked ? clickedIcon : defaultIcon);
  });

  function resizeMap() {
    var center = map.getCenter();
    naver.maps.Event.trigger(map, "resize");
    map.setCenter(center);
  }

  $(window).resize(resizeMap);
  resizeMap();
}

$(document).ready(function () {
  includeHTML(function () {
    initSidebar();
    initMap();
    datePicker();
    AOS.init({
      duration: 1200,
      once: true,
    });

    $(window).scroll(function () {
      var curr = $(this).scrollTop();

      if (curr > 0) {
        $(".header").addClass("scrolled");
      } else {
        $(".header").removeClass("scrolled");
      }
    });

    //뒤로가기버튼
    const mainVisual = $(".main-visual");

    $(document).on("click", ".back-btn", function (e) {
      e.preventDefault();

      const $stampList = $(this).closest(".stamp-save-list");
      $stampList.removeClass("active");
      mainVisual.removeClass("active");
    });

    //찜버튼
    $("[data-toggle=toggle]").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();

      var $this = $(this);
      var $target = $this.data("target") ? $($this.data("target")) : $this;

      $target
        .toggleClass("active")
        .find("[class^=icon-]")
        .toggleClass("active");
    });

    // 달력

    //팝업
    $("[data-toggle=popup]").on("click", function (e) {
      e.preventDefault();

      var targetSelector = $(this).data("target");
      if (!targetSelector) return;

      var $popup = $(targetSelector);

      if (!$popup.hasClass("active")) {
        $popup.css("display", "flex");
        setTimeout(() => {
          $popup.addClass("active");
        }, 10);

        $("body").css("overflow", "hidden");
      } else {
        $popup.removeClass("active");
        setTimeout(() => {
          $popup.css("display", "none");
        }, 300);

        $("body").css("overflow", "");
      }
    });

    $(".popup").on("click", ".popup-close", function () {
      var $popup = $(this).closest(".popup");
      $popup.removeClass("active");
      setTimeout(() => {
        $popup.css("display", "none");
      }, 300);
      $("body").css("overflow", "");
    });

    $(".popup").on("click", ".confirm-btn", function () {
      var $popup = $(this).closest(".popup");
      $popup.removeClass("active");
      setTimeout(() => {
        $popup.css("display", "none");
      }, 300);
      $("body").css("overflow", "");
    });

    //탭메뉴
    $(".tab-header li").on("click", function () {
      var tabId = $(this).data("tab");

      $(".tab-header li").removeClass("active");
      $(this).addClass("active");

      $(".header").addClass("active");
      $(".footer-inner").addClass("active");

      $(".tab-content").removeClass("active").hide();

      const $target = $('.tab-content[data-tab="' + tabId + '"]');

      $target.show();
      setTimeout(() => {
        $target.addClass("active");
        $("body").addClass("no-scroll");
      }, 10);
    });

    //푸터 고정영역

    $(".footer-login-on .updown-btn").on("click", function () {
      const $parent = $(this).closest(".footer-inner");
      const isActive = $parent.hasClass("active");

      $parent.toggleClass("active");

      if (!isActive) {
        if ($(".tab-header li.active").length === 0) {
          const $firstTab = $(".tab-header li").first();
          const tabId = $firstTab.data("tab");

          $(".tab-header li").removeClass("active");
          $firstTab.addClass("active");
          $(".header").addClass("active");
          $(".footer-inner").addClass("active");

          $(".tab-content").removeClass("active").hide();
          const $target = $('.tab-content[data-tab="' + tabId + '"]');
          $target.show();
          setTimeout(() => {
            $target.addClass("active");
          }, 10);
        }

        $("body").css("overflow", "hidden");
      } else {
        $(".tab-header li").removeClass("active");
        $(".tab-content").removeClass("active").hide();
        $(".header").removeClass("active");
        $(".footer-inner").removeClass("active");
        $("body").css("overflow", "");
      }
    });

    $(".footer-login-off .updown-btn").on("click", function () {
      const $parent = $(this).closest(".footer-inner");
      $parent.toggleClass("active");
      if ($parent.hasClass("active")) {
        $("body").css("overflow", "hidden");
      } else {
        $("body").css("overflow", "");
      }
    });

    //푸터 아이콘클릭
    $(".footer-icon-item li").on("click", function () {
      $(".footer-icon-item li").removeClass("active");
      $(this).addClass("active");
    });

    //스탬프 새로고침 & 적립내역
    $(".reload-close-btn").on("click", function () {
      $(".reload-info-bx").hide();
    });

    $(".stamp-list-btn").on("click", function () {
      $(".stamp-save-list").addClass("active");
      $(".header").removeClass("active");
    });

    //검색어초기화

    $(".input-reset-btn").on("click", function () {
      const $form = $(this).closest("form");
      const $input = $form.find(".search-input");

      if ($input.length) {
        $input.val("").focus();
      }
    });

    //선택권한(고객확인용) 개발시 해당 스크립트 삭제부탁드립니다.
    $(".intro-next-btn").click(function () {
      $(".intro-area").hide();
    });
  });
});
