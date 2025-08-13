document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.querySelector(".mobile-filter-btn");
  const filterOverlay = document.querySelector(".filter-overlay");
  const filterClose = document.querySelector(".filter-overlay-close");

  if (filterBtn && filterOverlay && filterClose) {
    filterBtn.addEventListener("click", () => {
      filterOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
    filterClose.addEventListener("click", () => {
      filterOverlay.classList.remove("open");
      document.body.style.overflow = "";
    });
    // Optional: close overlay when clicking outside content
    filterOverlay.addEventListener("click", (e) => {
      if (e.target === filterOverlay) {
        filterOverlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }
});
