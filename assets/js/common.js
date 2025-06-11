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

document.addEventListener("DOMContentLoaded", function () {
  includeHTML(function () {
    initSidebar();
    initMap();
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
    document.querySelectorAll(".footer-icon-item li").forEach((item) => {
      item.addEventListener("click", () => {
        document.querySelectorAll(".footer-icon-item li").forEach((el) => {
          el.classList.remove("active");
        });

        item.classList.add("active");
      });
    });

    //검색어초기화

    const resetButtons = document.querySelectorAll(".input-reset-btn");

    resetButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const form = btn.closest("form");
        if (!form) return;

        const input = form.querySelector(".search-input");
        if (input) {
          input.value = "";
          input.focus();
        }
      });
    });

    //선택권한(고객확인용) 개발시 해당 스크립트 삭제부탁드립니다.
    $(".intro-next-btn").click(function () {
      $(".intro-area").hide();
    });
  });
});
