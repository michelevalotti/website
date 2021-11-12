"use-strict";

const minScreenWidthQuery = window.matchMedia('(min-width: 768px)');  // true if width > min-width

// this will do for now but it only activates if it changes and changes back
// so if the page is too big for the menu you have to make it bigger and then smaller until you cross the threshold
// and vice versa if it's too big
minScreenWidthQuery.addEventListener("change", unclickMenu)

document.getElementById("burger--menu").addEventListener("click", clickMenu);
document.getElementById("arrow--menu").addEventListener("click", unclickMenu);

const pageButtons = document.getElementsByClassName("page--button");
for (var i = 0; i < pageButtons.length; i++) {
    pageButtons[i].addEventListener('click', unclickMenu, true);
}

document.getElementById("burger--menu").addEventListener("mouseover", hoverBurger);
document.getElementById("burger--menu").addEventListener("mouseout", hoverBurger);

document.getElementById("arrow--menu").addEventListener("mouseover", hoverArrow);
document.getElementById("arrow--menu").addEventListener("mouseout", hoverArrow);

function clickMenu() {
    if (minScreenWidthQuery.matches) {
        document.getElementById("main--body").classList.add("side--menu--shift--main--body");
        document.getElementById("top--bar").classList.add("side--menu--shift--top--bar");
        document.getElementById("side--menu").classList.add("side--menu--shift--side--menu");
    }
    else {
        document.getElementById("side--menu").classList.add("side--menu--overflow");
    }

    document.getElementById("burger--menu").classList.add("burger--menu--clicked");
    document.getElementById("burgerbar1").classList.add("burgerbar1--clicked");
    document.getElementById("burgerbar2").classList.add("burgerbar2--clicked");
    document.getElementById("burgerbar3").classList.add("burgerbar3--clicked");

    document.getElementById("arrowbar1").classList.add("arrowbar1--clicked");
    document.getElementById("arrowbar2").classList.add("arrowbar2--clicked");
    document.getElementById("arrowbar3").classList.add("arrowbar3--clicked");
}

function unclickMenu() {
    if (minScreenWidthQuery.matches) {
        document.getElementById("main--body").classList.remove("side--menu--shift--main--body");
        document.getElementById("top--bar").classList.remove("side--menu--shift--top--bar");
        document.getElementById("side--menu").classList.remove("side--menu--shift--side--menu");
    }
    else {
        document.getElementById("side--menu").classList.remove("side--menu--overflow");
    }

    document.getElementById("burger--menu").classList.remove("burger--menu--clicked");
    document.getElementById("burgerbar1").classList.remove("burgerbar1--clicked");
    document.getElementById("burgerbar2").classList.remove("burgerbar2--clicked");
    document.getElementById("burgerbar3").classList.remove("burgerbar3--clicked");

    document.getElementById("arrowbar1").classList.remove("arrowbar1--clicked");
    document.getElementById("arrowbar2").classList.remove("arrowbar2--clicked");
    document.getElementById("arrowbar3").classList.remove("arrowbar3--clicked");
}


function hoverBurger() {
    document.getElementById("burgerbar1").classList.toggle("burgerbar1--hover");
    document.getElementById("burgerbar3").classList.toggle("burgerbar3--hover");
}

function hoverArrow() {
    document.getElementById("arrow--menu").classList.toggle("arrow--menu--hover");
    document.getElementById("burgerbar3").classList.toggle("burgerbar3--hover");
}