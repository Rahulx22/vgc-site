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

  // Replace OwlCarousel with CSS-based carousel for better performance
  // This will be handled by CSS only, removing the jQuery dependency

  // Optimize counter animation with vanilla JS
  const counterElements = document.querySelectorAll('.counter-count');
  counterElements.forEach(function(element) {
    const countTo = parseInt(element.textContent) || 0;
    
    // Only animate if element is in viewport
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000; // 2 seconds
          const increment = countTo / (duration / 16); // 60fps approximation
          
          const timer = setInterval(function() {
            start += increment;
            if (start >= countTo) {
              element.textContent = countTo;
              clearInterval(timer);
            } else {
              element.textContent = Math.ceil(start);
            }
          }, 16);
          
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  });
});