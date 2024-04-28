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

const gradientTextDissapearing = document.getElementsByClassName(
  "identifier_gradient_text_dissapearing"
);

function showText(element) {
  if (element.previousElementSibling.clientHeight === 100) {
    element.previousElementSibling.previousElementSibling.style.height = "100%";
    element.previousElementSibling.classList.remove("styles_text_dissapearing");
    element.src = "/images/arrow_up.png";
  } else {
    element.previousElementSibling.previousElementSibling.style.height =
      "100px";
    element.previousElementSibling.classList.add("styles_text_dissapearing");
    element.src = "/images/arrow_down.png";
  }
}
