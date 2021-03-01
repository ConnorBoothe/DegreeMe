//Wave Animation
$("#wave1").wavify({
  height: 60,
  bones: 3,
  amplitude: 40,
  color: "#1A1A1A",
  speed: 0.25,
});

$("#wave2").wavify({
  height: 60,
  bones: 3,
  amplitude: 40,
  color: "#1f2024",
  speed: 0.25,
});

function callbackFunc(entries, observer) {
  entries.forEach((entry) => {
    var element = document.getElementById(entry.target.id);

    //Navbar color change if section interacts
    if (entry.target.id === "landing--section0" && entry.isIntersecting) {
      document.documentElement.style.setProperty("--landingButton", "#007BFF");
    } else if (
      entry.target.id === "landing--section1" &&
      entry.isIntersecting
    ) {
      document.documentElement.style.setProperty("--landingButton", "#FFCC00");
    } else if (
      entry.target.id === "landing--section2" &&
      entry.isIntersecting
    ) {
      document.documentElement.style.setProperty("--landingButton", "#00CC88");
    } else if (
      entry.target.id === "landing--section3" &&
      entry.isIntersecting
    ) {
      document.documentElement.style.setProperty("--landingButton", "#E84D4D");
    } else if (
      entry.target.id === "landing--section4" &&
      entry.isIntersecting
    ) {
      document.documentElement.style.setProperty("--landingButton", "#007BFF");
    }

    //Remove class
    if (entry.isIntersecting) {
      element.classList.remove(entry.target.id + "--false");
    } else {
      element.classList.remove(entry.target.id + "--true");
    }

    //Add class
    element.classList.add(entry.target.id + "--" + entry.isIntersecting);
    console.log(entry.target.id + "--" + entry.isIntersecting);
  });
}

let sectionOptions = {
  root: null,
  rootMargin: "-100px 20px 30px 40px",
  threshold: 1,
};

let options = {
  root: null,
  rootMargin: "200px",
  threshold: 0.3,
};

let observer = new IntersectionObserver(callbackFunc, options);
let sectionObserver = new IntersectionObserver(callbackFunc, sectionOptions);

observer.observe(document.getElementById("landing--person1--animation"));
observer.observe(document.getElementById("landing--person2--animation"));
observer.observe(document.getElementById("landing--person3--animation"));
observer.observe(document.getElementById("landing--person4--animation"));
observer.observe(document.getElementById("landing--person5--animation"));
observer.observe(document.getElementById("landing--person6--animation"));
observer.observe(document.getElementById("landing--footer--img"));
observer.observe(document.getElementById("landing--image--container"));
observer.observe(document.getElementById("landing--connected"));

sectionObserver.observe(document.getElementById("landing--section0"));
sectionObserver.observe(document.getElementById("landing--section1"));
sectionObserver.observe(document.getElementById("landing--section2"));
sectionObserver.observe(document.getElementById("landing--section3"));
sectionObserver.observe(document.getElementById("landing--section4"));

let menuOpen = false;
let navbarElement = document.getElementById("navbar--hamburger");
let navbarMobile = document.getElementById("navbar--mobile");

navbarElement.onclick = () => {
  if (menuOpen) {
    navbarMobile.classList.remove("navbar--mobile--open");
    navbarMobile.classList.add("navbar--mobile--close");
    menuOpen = false;
  } else {
    navbarMobile.classList.remove("navbar--mobile--close");
    navbarMobile.classList.add("navbar--mobile--open");
    menuOpen = true;
  }

  console.log(menuOpen);
};

navbarMobile.onclick = () => {
  navbarMobile.classList.remove("navbar--mobile--open");
  navbarMobile.classList.add("navbar--mobile--close");
  menuOpen = false;
};

// function openMenu(open) {
//   if (open) {
//     element.classList.remove("navbar--mobile--open");
//     document
//       .getElementById("navbar--mobile")
//       .classList.add("navbar--mobile--open");
//   } else {
//     element.classList.remove("navbar--mobile--close");
//     document
//       .getElementById("navbar--mobile")
//       .classList.add("navbar--mobile--close");
//   }
// }
