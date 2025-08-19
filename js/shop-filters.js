document.addEventListener("DOMContentLoaded", function () {
  const filterBtn = document.querySelector(".mobile-filter-btn");
  const filterOverlay = document.querySelector(".filter-overlay");
  const filterClose = document.querySelector(".filter-overlay-close");
  const filterDropdown = document.querySelectorAll(".down-icon");

  if (filterBtn && filterOverlay && filterClose) {
    filterBtn.addEventListener("click", () => {
      filterOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
    filterClose.addEventListener("click", () => {
      filterOverlay.classList.remove("open");
      document.body.style.overflow = "";
    });
    filterOverlay.addEventListener("click", (e) => {
      if (e.target === filterOverlay) {
        filterOverlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  filterDropdown.forEach(function (dropdown) {
    dropdown.addEventListener("click", function () {
      let parent = dropdown.closest(".filter-group");
      
      if (!parent) parent = dropdown.closest(".filter-div");
      let content = parent ? parent.nextElementSibling : null;
      if (!content || !content.classList.contains("filter-content")) {
        content = parent ? parent.querySelector(".filter-content") : null;
      }
      if (content) {
        content.classList.toggle("hide");
        dropdown.classList.toggle("open");
      }
    });
  });
});
