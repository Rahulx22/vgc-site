// Defer initialization until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS if not already initialized by React component
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      once: true,
      easing: "ease-out",
    });
  }

  // Header shrink functionality with better performance
  function initHeaderShrink() {
    let ticking = false;
    const header = document.querySelector("header");
    
    if (!header) return;
    
    const onScroll = function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var distanceY = window.pageYOffset || document.documentElement.scrollTop,
              shrinkOn = 100;
          
          if (distanceY > shrinkOn) {
            header.classList.add("smaller");
          } else {
            header.classList.remove("smaller");
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  
  initHeaderShrink();

  // Initialize OwlCarousel with better performance settings
  if (typeof jQuery !== 'undefined' && jQuery.fn.owlCarousel) {
    const testimonialCarousel = document.getElementById('testimonial-sec');
    if (testimonialCarousel) {
      jQuery("#testimonial-sec").owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000, // Increased timeout
        autoplayHoverPause: true,
        nav: false,
        dots: false,
        autoplaySpeed: 800, // Reduced speed
        responsive: {
          0: { items: 1 },
          320: { items: 1 }
        }
      });
    }
  }

  // Optimize counter animation
  if (typeof jQuery !== 'undefined') {
    jQuery('.counter-count').each(function () {
      const $this = jQuery(this);
      const countTo = $this.text();
      
      // Only animate if element is in viewport
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            $this.prop('Counter', 0).animate({
              Counter: countTo
            }, {
              duration: 3000, // Reduced duration
              easing: 'swing',
              step: function (now) {
                $this.text(Math.ceil(now));
              }
            });
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(this);
    });
  }
});