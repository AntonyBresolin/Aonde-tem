const swiper = new Swiper('.swiper', {
  loop: true,
  width: 380,
  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});