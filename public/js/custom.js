AOS.init({
});


function init() {
 window.addEventListener('scroll', function(e){
  var distanceY = window.pageYOffset || document.documentElement.scrollTop,
   shrinkOn = 100,
   header = document.querySelector("header");
   if (distanceY > shrinkOn) {
   classie.add(header,"smaller");
  } else {
   if (classie.has(header,"smaller")) {
   classie.remove(header,"smaller");
   }
  }
 });
 }
window.onload = init();


jQuery(document).ready(function(){ 
 jQuery("#testimonial-sec").owlCarousel({
  items:1,
  loop:true,
  autoplay:true,
  nav:false,
  dots:false,
  autoplaySpeed:1000,
  responsive:{
  0:{ items:1 },
  320:{ items:1 }
  }
 });
});


$('.counter-count').each(function () {
 $(this).prop('Counter',0).animate({
  Counter: $(this).text()
  }, {
  duration: 5000,
  easing: 'swing',
  step: function (now) {
 $(this).text(Math.ceil(now));
 }
 });
});