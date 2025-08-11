document.addEventListener("DOMContentLoaded", function () {
  // Only activate slider on small screens
  if (window.matchMedia("(max-width: 34em)").matches) {
    const testimonials = document.querySelectorAll(".testimonial");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    let current = 0;

    function showTestimonial(idx) {
      testimonials.forEach((t, i) => {
        t.classList.toggle("active", i === idx);
      });
    }

    showTestimonial(current);

    leftArrow.addEventListener("click", function () {
      current = (current + 1) % testimonials.length;
      showTestimonial(current);
    });

    rightArrow.addEventListener("click", function () {
      current = (current - 1 + testimonials.length) % testimonials.length;
      showTestimonial(current);
    });
  }
});
