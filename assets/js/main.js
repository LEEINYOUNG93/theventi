$(document).ready(function () {
  //메인비주얼
  var visualSwiper = new Swiper(".main-visual .swiper-container", {
    loop: true,
    loopedSlides: 1,
    slidesPerView: 1,
    effect: "fade",
    speed: 1000,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "이전 슬라이드",
      nextSlideMessage: "다음 슬라이드",
      slideLabelMessage:
        "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
      renderFraction: (currentClass, totalClass) => {
        return (
          '<span class="' +
          currentClass +
          '"></span>' +
          '<span class="slash">/</span>' +
          '<span class="' +
          totalClass +
          '"></span>'
        );
      },
    },
  });

  //추천메뉴
  var beverageSwiper = new Swiper(
    ".main-section-4 .bottom-bx .swiper-container",
    {
      loop: true,
      loopedSlides: 3,
      slidesPerView: 2,
      spaceBetween: 8,
      effect: "slide",
      speed: 1000,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    }
  );
});
