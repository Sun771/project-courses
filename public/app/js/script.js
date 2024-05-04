const btnMenu = document.querySelector("#btnMenu");
const header = document.querySelector(".header");
const overlay = document.querySelector(".overlay");
const fadeElems = document.querySelectorAll(".contains-fade");
const body = document.querySelector("body");

btnMenu.addEventListener("click", function () {
  console.log("clicked menu");

  // open and close menu
  if (header.classList.contains("open")) {
    // closing
    body.classList.remove("without-scroll");
    header.classList.remove("open");
    fadeElems.forEach(function (element) {
      element.classList.remove("fade-in");
      element.classList.add("fade-out");
    });
    overlay.classList.remove("fade-in");
    overlay.classList.add("fade-out");
  } else {
    // opening
    body.classList.add("without-scroll");
    header.classList.add("open");
    fadeElems.forEach(function (element) {
      element.classList.remove("fade-out");
      element.classList.add("fade-in");
    });
  }
});

// Mobile/tablet header menu -> links clicked -> close overlay
function closeOverlay() {
  if (header.classList.contains("open")) {
    // closing
    body.classList.remove("without-scroll");
    header.classList.remove("open");
    fadeElems.forEach(function (element) {
      element.classList.remove("fade-in");
      element.classList.add("fade-out");
    });
    overlay.classList.remove("fade-in");
    overlay.classList.add("fade-out");
  }
}

// Contact form: clearing inputs after "submit" button was pressed
function resetForm() {
  const form = document.getElementById("contact_us_form");

  setTimeout(function () {
    form.reset();
  }, 300);
}
