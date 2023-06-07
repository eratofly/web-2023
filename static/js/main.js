const humbButton = document.querySelector(".heading__humb-button");
const humbMenu = document.querySelector(".heading__humb-menu");
let isMenuOpen = false;

function openMenu() {
    humbMenu.classList.remove("menu-hidden");
    isMenuOpen = true;
}

function closeMenu() {
    humbMenu.classList.add("menu-hidden");
    isMenuOpen = false;
}

function humbMenuClick() {
    if (isMenuOpen) {
        closeMenu();
    }
    else {
        openMenu();
    }
}

humbButton.addEventListener("click", humbMenuClick);