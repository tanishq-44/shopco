document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger-menu");
  const navList = document.querySelector(".nav-list");
  const closeBtn = document.querySelector(".nav-list-close");

  hamburger.addEventListener("click", function () {
    navList.classList.add("open");
  });

  closeBtn.addEventListener("click", function () {
    navList.classList.remove("open");
  });

  // Optional: Close on outside click
  document.addEventListener("click", function (e) {
    if (
      navList.classList.contains("open") &&
      !navList.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navList.classList.remove("open");
    }
  });
});
