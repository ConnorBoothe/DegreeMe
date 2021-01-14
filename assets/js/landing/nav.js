let menuOpen = false;
let navbarElement = document.getElementById("navbar--hamburger");
let navbarMobile = document.getElementById("navbar--mobile");
document.documentElement.style.setProperty("--landingButton", "#007BFF");

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