"use-strict";

// imoprt css vars
var contentColor400 = getComputedStyle(document.documentElement).getPropertyValue('--content-color-400');
var contentColor600 = getComputedStyle(document.documentElement).getPropertyValue('--content-color-600');
var bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
var accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');

var sideMenuTransitionDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sidemenu-transition-len')) * 1000;
const sideMenuWidth = getComputedStyle(document.documentElement).getPropertyValue('--side-menu-width');
const bannerHeight = document.getElementById('banner--image').offsetHeight;
const topBarHeight = document.getElementById('top--bar').offsetHeight;
const canHover = window.matchMedia("(hover: hover)").matches;

// useful vars
const myPictureTopY = document.getElementById("my--image").getBoundingClientRect().top + window.scrollY;
let c2Top = 0;
let c3Top = 0;

// set and update screen dimensions
let height = window.innerHeight;
let width = window.innerWidth;  // this includes the scrollbar width
// let width = document.body.clientWidth;  // this doesn't

const minWidth = 900;
const minHeight = 500;
let isMobile = (height < minHeight) || (width < minWidth);
let scrollbarWidth = window.innerWidth - document.body.clientWidth;

// initiate for scroll up/down detection
var lastScrollY = window.pageYOffset;
var lastWidth = width;

const pageClickDelay = 300;

var previouslyClickedBubble = document.getElementsByClassName("bubble")[0];  // this is used inside onResizeFunction


///////////////////////////////////////////////////////////////////////////


window.onload = onLoadFunction();

onResizeFunction();
window.onresize = onResizeFunction;

onScrollFunction();
window.onscroll = onScrollFunction;



///////////////////////////////////////////////////////////////////////////



document.getElementById("burger--menu").addEventListener("click", clickMenu);
document.getElementById("arrow--menu").addEventListener("click", unclickMenu);

document.getElementById("content--pages").addEventListener("click", unclickMenu);
document.getElementById("logo").addEventListener("click", unclickMenu);
for (let colorSwitch of document.getElementsByClassName("color--switch")) {
    colorSwitch.addEventListener("click", toggleNightMode);
}
const pageButtons = document.getElementsByClassName("page--button");
const ButtonPages = ["about--me--page","projects--page","interests--page","contact--page"];
for (var i = 0; i < pageButtons.length; i++) {
    pageButtons[i].addEventListener('click', unclickMenuDelay, true);
    pageButtons[i].pageName = ButtonPages[i]
}

const projectCards = document.getElementsByClassName("project--card");
let previousClickedCard = null;
for (var i = 0; i < projectCards.length; i++) {
    projectCards[i].addEventListener('click', clickProjectCard, true);
    // for hover, if no card is clicked hover is opacity 1, otherwise hovering over not clicked cards has lower opacity
    projectCards[i].addEventListener('mouseover', function(evt) {
        activateProjectCard(evt.currentTarget);
        cardsAreClicked = [];
        for (let c of projectCards) {
            cardsAreClicked.push(c.parentElement.classList.contains("card--container--expanded"));
        }
        if (!evt.currentTarget.parentElement.classList.contains("card--container--expanded")) {
            if (cardsAreClicked.some(e => e === true)) {
                evt.currentTarget.style.opacity = "0.4";
            }
        }
    }, true);
    projectCards[i].addEventListener('mouseout', function(evt) {
        if (!evt.currentTarget.parentElement.classList.contains("card--container--expanded")) {
            deactivateProjectCard(evt.currentTarget);
        }
    }, true);
}

document.getElementById("burger--menu").addEventListener("mouseover", hoverBurger);
document.getElementById("burger--menu").addEventListener("mouseout", hoverBurger);

document.getElementById("arrow--menu").addEventListener("mouseover", hoverArrow);
document.getElementById("arrow--menu").addEventListener("mouseout", hoverArrow);

// do not hide when hovering away
document.getElementById("top--bar--hover").addEventListener("mouseover", revealTopBar);

const cityContainer = document.getElementsByClassName("city--container")[0];
const ro = new ResizeObserver(entries => {
    onResizeFunction();
    onScrollFunction();  // need to have this here because body resizes with an animation delay
  });
// only need to observe one container since the function adjusts for all
ro.observe(cityContainer);

document.getElementById("game--board").addEventListener("click", runWordleClone);
document.getElementById("letter--list").addEventListener("click", runWordleClone);
document.getElementsByClassName("reset--arrow")[0].addEventListener("mouseover", function() {
        const arrowDiv = document.getElementsByClassName("reset--arrow")[0];
        if (!arrowDiv.classList.contains("reset--arrow--clicked")) {
            arrowDiv.classList.add("reset--arrow--hover");
        };
    });
document.getElementsByClassName("reset--arrow")[0].addEventListener("mouseout", function() {
        document.getElementsByClassName("reset--arrow")[0].classList.remove("reset--arrow--hover");
    });
document.getElementsByClassName("reset--arrow")[0].addEventListener("click", function() {
        const arrowDiv = document.getElementsByClassName("reset--arrow")[0];
        arrowDiv.classList.remove("reset--arrow--hover");
        arrowDiv.classList.add("reset--arrow--clicked");
        resetWordle();
    });

document.getElementById('wordle--card').addEventListener('click', function() {
    if (gameBoardIsActive) {
        gameBoardIsActive = false;
        document.removeEventListener('keydown', wordleOnKeyPress, true);
    }
    else {
        gameBoardIsActive = true;
        document.addEventListener('keydown', wordleOnKeyPress, true);
        for (let lt of letterTiles) {
            lt.addEventListener('click', wordleOnKeyPress, true);
        }
    }
})

for (let bubble of document.getElementsByClassName("bubble")) {
    bubble.addEventListener('click', function(evt) {
        if (document.getElementById("side--menu").classList.contains("side--menu--shift--side--menu")) {
            setTimeout(bubbleOnClick, sideMenuTransitionDuration + 50, evt.currentTarget)
        }
        else { bubbleOnClick(evt.currentTarget); }
    });
}
document.getElementById("bubble--esc").addEventListener("click", function() {
    if (document.getElementById("side--menu").classList.contains("side--menu--shift--side--menu")) {
        setTimeout(function() {escBubbleOnClick();}, sideMenuTransitionDuration + 50)
    }
    else { escBubbleOnClick(); }
});


///////////////////////////////////////////////////////////////////////////


function toggleColorSwitches() {
    if (document.getElementById("top--bar").style.backgroundColor == "rgba(0, 0, 0, 0)") {
        document.getElementById("main--content--color--switch").classList.remove("picture--color--switch--disappear");
        document.getElementById("top--bar--color--switch").classList.add("color--switch--disappear--tb");
    }
    else if (!document.getElementById("side--menu").classList.contains("side--menu--overflow")) {
        document.getElementById("main--content--color--switch").classList.add("picture--color--switch--disappear");
        document.getElementById("top--bar--color--switch").classList.remove("color--switch--disappear--tb");
    }
}


function toggleNightMode() {
    var r = document.querySelector(':root');
    for (var switchButton of document.getElementsByClassName("switch--button")) {
        switchButton.classList.toggle("switch--button--clicked");
    }
    if (bgColor == "33, 33, 33") {
        r.style.setProperty("--bg-color", "210, 210, 210");
        r.style.setProperty("--content-color-600", "140, 140, 140");
        r.style.setProperty("--content-color-400", "60, 60, 60");
        contentColor400 = "60, 60, 60";
        contentColor600 = "140, 140, 140";
        bgColor = "210, 210, 210";
    }
    else {
        r.style.setProperty("--bg-color", "33, 33, 33");
        r.style.setProperty("--content-color-600", "97, 97, 97");
        r.style.setProperty("--content-color-400", "189, 189, 189");
        contentColor400 = "189, 189, 189";
        contentColor600 = "97, 97, 97";
        bgColor = "33, 33, 33";
    }
    toggleTopBarOpacity();
}


function clickMenu() {
    if (width > minWidth) {
        document.getElementById("main--body").classList.add("side--menu--shift--main--body");
        document.getElementById("top--bar").classList.add("side--menu--shift--top--bar");
        document.getElementById("side--menu").classList.add("side--menu--shift--side--menu");
    }
    else {
        document.getElementById("side--menu").classList.add("side--menu--overflow");
        document.getElementById("top--bar--color--switch").classList.add("color--switch--disappear--tb");
        document.body.style.overflow = "hidden";  // disable scrolling
    }

    document.getElementById("burger--menu").classList.add("burger--menu--clicked");
    document.getElementById("burgerbar1").classList.add("burgerbar1--clicked");
    document.getElementById("burgerbar2").classList.add("burgerbar2--clicked");
    document.getElementById("burgerbar3").classList.add("burgerbar3--clicked");

    document.getElementById("arrowbar1").classList.add("arrowbar1--clicked");
    document.getElementById("arrowbar2").classList.add("arrowbar2--clicked");
    document.getElementById("arrowbar3").classList.add("arrowbar3--clicked");

    if (width < 1000 && width > minWidth) {
        // this delay prevents this call to conflict with the one in onResizeFunction
        // REMEMBER setTimeout is asynchronous, so other functions will not pause
        setTimeout(() => {  stackBanner(); }, sideMenuTransitionDuration);
    }
}

function unclickMenu() {
    // when clicking button remove same class you add, but when resizing need to remove the other one
    // so just remove all as it doesn't throw an error anyways

    document.body.style.overflow = "visible";  // reenable scrolling

    document.getElementById("main--body").classList.remove("side--menu--shift--main--body");
    document.getElementById("top--bar").classList.remove("side--menu--shift--top--bar");
    document.getElementById("side--menu").classList.remove("side--menu--shift--side--menu");
    document.getElementById("side--menu").classList.remove("side--menu--overflow");

    document.getElementById("burger--menu").classList.remove("burger--menu--clicked");
    document.getElementById("burgerbar1").classList.remove("burgerbar1--clicked");
    document.getElementById("burgerbar2").classList.remove("burgerbar2--clicked");
    document.getElementById("burgerbar3").classList.remove("burgerbar3--clicked");

    document.getElementById("arrowbar1").classList.remove("arrowbar1--clicked");
    document.getElementById("arrowbar2").classList.remove("arrowbar2--clicked");
    document.getElementById("arrowbar3").classList.remove("arrowbar3--clicked");

    document.getElementById("top--bar--color--switch").classList.remove("color--switch--disappear--tb");

    // these are set to 0 on resize
    document.getElementById("top--bar").style.removeProperty("transition");
    document.getElementById("side--menu").style.removeProperty("transition");

    if (width < 1000 && width > minWidth) {
        setTimeout(() => {  unstackBanner(); }, sideMenuTransitionDuration);
    }
}


// if side menu pushes page, leave time to scroll to link and then close menu
function unclickMenuDelay(evt) {
    var pageToScrollTo = document.getElementById(evt.currentTarget.pageName);
    unclickMenu();
    setTimeout(() => { pageToScrollTo.scrollIntoView(); }, sideMenuTransitionDuration);

    // this is to reveal the topbar when we scroll to a div with pagebuttons,
    // since scrolling hides the topbar on mobile
    // we have to wait for the click delay and the scroll delay
    // the lower we scroll the more we have to wait
    if (isMobile) {
        setTimeout(() => {  revealTopBar(); }, sideMenuTransitionDuration*5);
    }
}

function hoverBurger() {
        document.getElementById("burgerbar1").classList.toggle("burgerbar1--hover");
        document.getElementById("burgerbar3").classList.toggle("burgerbar3--hover");
}

function hoverArrow() {
        document.getElementById("arrow--menu").classList.toggle("arrow--menu--hover");
        document.getElementById("burgerbar3").classList.toggle("burgerbar3--hover");
}


function hideTopBar() {
    document.getElementById("top--bar").classList.add("top--bar--hide");
    document.getElementById("top--bar").classList.remove("side--menu--shift--top--bar");
}
function revealTopBar() {
    document.getElementById("top--bar").classList.remove("top--bar--hide");
    // if side menu is open
    if (document.getElementById("side--menu").classList.contains("side--menu--shift--side--menu")) {
        document.getElementById("top--bar").classList.add("side--menu--shift--top--bar");
    }
    const cityNames = document.getElementsByClassName("city--name");
    for (var i = 0; i < cityNames.length; i++) {
        cityNameHeight = topBarHeight+10
        cityNames[i].classList.add("city--name--topbar--revealed")
    }
}

function toggleHideTopBar() {
    // if landscape mobile hide and reveal the topbar based on scrolling direction
    if (isMobile) {
        
        if (window.pageYOffset > lastScrollY) {  // scroll down
            hideTopBar();
            const cityNames = document.getElementsByClassName("city--name");
            for (var i = 0; i < cityNames.length; i++) {
                cityNames[i].classList.remove("city--name--topbar--revealed")
            }
        }
        else {  // scroll up
            revealTopBar();
        }
    }
    // if we have enough height make sure the topbar is visible
    else {
        revealTopBar();
    }
}


function toggleTopBarOpacity() {
    var colorSwitch = document.getElementById("top--bar--color--switch");
    if (window.pageYOffset > bannerHeight-(topBarHeight+1)) {
        document.getElementById('top--bar').style.backgroundColor = "rgba(" + contentColor400 + ", 1)";
        document.getElementById('logo').style.visibility = "visible";  // so you can't click it
        document.getElementById('logo').style.opacity = "1";  // so it transitions smoothly
        colorSwitch.style.opacity = "1";  // this one you can't click cause it moves outside the screen
        document.getElementById("burger--menu").classList.remove("burger--background--on");
    }
    else {
        document.getElementById('top--bar').style.backgroundColor = "rgba(0,0,0,0)";
        document.getElementById('logo').style.visibility = "hidden";
        document.getElementById('logo').style.opacity = "0";
        colorSwitch.style.opacity = "0";
    }
}


function togglePageDotsHighlight() {

    const paragraphs = document.getElementsByClassName("content--paragraph");
    const pageDots = document.getElementsByClassName("page--dot");
    const pageButtons = document.getElementsByClassName("page--button");
    let paragraphTops = [];
    let paragraphBottoms = [];
    let paragraphNames = [];
    for (var i = 0; i < paragraphs.length; i++) {
        const paragraphRect = paragraphs[i].getBoundingClientRect();
        const paragraphMarginBottom = parseInt(window.getComputedStyle(paragraphs[i])["marginBottom"]);
        // minus one is so that when we are exactly at the top of div (e.g. after clicking link)
        // it is still registered as being in div
        paragraphTops[i] = paragraphRect.top + window.scrollY - topBarHeight -1;
        paragraphBottoms[i] = paragraphRect.bottom + window.scrollY - topBarHeight -1 + paragraphMarginBottom;
        paragraphNames[i] = pageButtons[i].innerHTML;
    }
    for (var i = 0; i < paragraphs.length; i++) {
        // if y pos is in div add, else remove
        // cutoff is a third of the way down so you highlight next dot before
        // you have to scrol all the way up to top of div
        pagePosThirdDown = window.pageYOffset + (window.innerHeight/3);
        if (document.getElementById("contact--page").getBoundingClientRect().bottom - height < 10) {  // bottom of page
            document.getElementById("page--name").innerHTML = "";
            pageDots[i].classList.remove("counter--in--focus");
        }
        else if ((pagePosThirdDown >= paragraphTops[i]) &&
            (pagePosThirdDown < paragraphBottoms[i])) {
            pageDots[i].classList.add("counter--in--focus")
            document.getElementById("page--name").innerHTML = "000" + (i+1) + "  _  " + paragraphNames[i];
        }
        else if (pagePosThirdDown < paragraphTops[0]) {
            document.getElementById("page--name").innerHTML = "";
            pageDots[i].classList.remove("counter--in--focus");
        }
        else {
            pageDots[i].classList.remove("counter--in--focus");
        }
    }
}


function stackBanner() {
    document.getElementById("banner--name").innerHTML = "MIC-\nHELE\nVAL-\nOTTI";
    document.getElementById("banner--name").classList.add("stacked--banner--h1");
    document.getElementById("job--title").innerHTML = "Software Engineer\nand Data Scientist";
}

function unstackBanner() {
    document.getElementById("banner--name").innerHTML = "MICHELE\nVALOTTI";
    document.getElementById("banner--name").classList.remove("stacked--banner--h1");
    document.getElementById("job--title").innerHTML = "Software Engineer and Data Scientist";
}

function adjustTimelineHeight() {
    const cityContainers = document.getElementsByClassName("city--container");
    let containerHeights = [];
    for (var i = 0; i < cityContainers.length; i++) {
        containerHeights[i] = cityContainers[i].offsetHeight;
    }
    var height1 = containerHeights[0]
    var height2 = containerHeights[1]
    var height3 = containerHeights[2]

    if (width > minWidth) {

        document.getElementById("l1").style.height = (height1 + 10 + 30) + "px";  // +30 is from about--me--page margin
        document.getElementById("l3").style.height = (height2 + 4) + "px";
        document.getElementById("l5").style.height = (height3) + "px";

        document.getElementById("l3").style.top = (height1 + 30 - 4) + "px";
        document.getElementById("l5").style.top = ((height1 + height2) + 30 - 4) + "px";
        document.getElementById("l2").style.top = (height1 - 4 + 30) + "px";
        document.getElementById("l4").style.top = ((height1 + height2 + 30) - 4) + "px";
        document.getElementById("c2").style.top = (height1 - 10 + 30) + "px";
        document.getElementById("c3").style.top = ((height1 + height2 + 30) - 10) + "px";
        document.getElementById("c4").style.top = ((height1 + height2 + height3 + 30) - 10) + "px";
        document.getElementById("c2--move").style.top = (height1 - 10 + 30) + "px";
        document.getElementById("c3--move").style.top = ((height1 + height2 + 30) - 10) + "px";
    }
    else {
        // I need to reset all the previously assigned styles
        const elsArray = ["l1", "l2", "l3", "l4", "l5", "c2", "c3", "c4", "c2--move", "c3--move"];
        for (var i = 0; i < elsArray.length; i++) {
            document.getElementById(elsArray[i]).style.height = ""
            document.getElementById(elsArray[i]).style.top = ""
        }

        // margin bottom is 10vh for city--container
        document.getElementById("c2").style.top = (height1 + Math.round(window.innerHeight / 15)) + "px";
        document.getElementById("c3").style.top = (height1 + height2 + Math.round(window.innerHeight / 10) + Math.round(window.innerHeight / 15)) + "px";
    }

    if (width > minWidth) {
        c2Top = parseFloat(document.getElementById('c2--move').style.top);
        c3Top = parseFloat(document.getElementById('c3--move').style.top);
    }
}

function moveTimelineDot() {
    // this funtion depends on scroll position, which is applied asynchronously to the actual page rendering
    // this is for performance reasons (see https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html)
    // but it means that the page render and scroll position can be slightly out of sync giving rise to jitter and jank
    // I don't know of a way to fix this currently, seems to be worse in firefox than chrome, but probably needs a completely different approach
    // this page might have useful info https://css-tricks.com/scroll-linked-animations-with-the-web-animations-api-waapi-and-scrolltimeline/

    // these vars can eventually be refactored in resize fn so they are not recalcd every scroll
    // should probably have a fn called on resize (of window OR of body) that sets all these line heights
    // etc and then they can be queries inside other fns.
    var circleNames = [];
    var circleTopsArray = [];
    var lineNames = [];
    var lineLenTot = 0;
    if (width < minWidth) {
        circleNames = ["c1--move","c--mobile--start"];
        circleTopsArray = [-140, -40];
        lineNames = ["l1","l3"];
    }
    else {
        circleNames = ["c1--move","c2--move","c3--move"];
        circleTopsArray = [-20,c2Top,c3Top];
        lineNames = ["l1","l3","l5"];
    }
    for (let l of lineNames) {
        lineLenTot += document.getElementById(l).offsetHeight;
    }

    for (var i = 0; i < circleNames.length; i++) {
        const circleName = circleNames[i];
        const circleTop = circleTopsArray[i];
        const lineName = lineNames[i];
        let previousLinesLen = 0
        if (i > 0) {
            for (var j = 0; j < i; j++) {
                previousLinesLen += document.getElementById(lineNames[j]).offsetHeight;
            }
        }

        const lineLen = document.getElementById(lineName).offsetHeight + previousLinesLen;
        const linePerc = lineLen/lineLenTot;

        // circle starts moving when its line top is 1/4 of screen down and stops when its line bottom is 3/4 of screen down
        // this means the circle needs to travel 3/4screen - 1/4screen = screen/2
        let cStartMoving = (document.getElementById(lineName).getBoundingClientRect().top) <= (height/4) + ((height/2)*(previousLinesLen/lineLenTot));
        let cStopMoving = (document.getElementById(lineName).getBoundingClientRect().bottom) <= (height/4) + ((height/2)*linePerc);

        if (!cStartMoving && !cStopMoving) {  // before line
            document.getElementById(circleName).style.cursor = "";
            document.getElementById(circleName).style.top = circleTop + "px";
            document.getElementById(circleName).classList.remove("timeline--circle--in--focus")
        }
        if (cStartMoving && !cStopMoving) {  //inside line
            document.getElementById(circleName).style.cursor = "pointer";  // looks better when scrollWithTimelineCircle
            // we use line top to get the "circle position" so that on load we don't have to query circle.top which would return nan
            // this is percent position with percent calculated on (lineLenTot-(height/2)) since we are using the line top
            // and the dot will travel height/2 more than that
            let circlePosOnLine = ((height/4) - document.getElementById(lineNames[0]).getBoundingClientRect().top)/(lineLenTot-(height/2));
            let offset = circlePosOnLine * (height/2);

            document.getElementById(circleName).style.top = (height/4 - document.getElementById(lineName).getBoundingClientRect().top + circleTop + offset) + "px";
            document.getElementById(circleName).classList.add("timeline--circle--in--focus")
        }
        else if (cStartMoving && cStopMoving) {  // after line
            document.getElementById(circleName).style.cursor = "";
            document.getElementById(circleName).style.top = (document.getElementById(lineName).offsetHeight + circleTop - 4) + "px";
            document.getElementById(circleName).classList.remove("timeline--circle--in--focus")
        }
    }
}


function scrollDragTimeline() {
    let timelineCirclesNames = [];
    let lineNames = [];
    let lineLenTot = 0;
    if (width < minWidth) {
        timelineCirclesNames = ["c1--move","c--mobile--start"];
        lineNames = ["l1","l3"];
    }
    else {
        timelineCirclesNames = ["c1--move","c2--move","c3--move"];
        lineNames = ["l1","l3","l5"];
    }

    for (let l of lineNames) {
        lineLenTot += document.getElementById(l).offsetHeight;
    }

    for (var i = 0; i < timelineCirclesNames.length; i++) {
        let timelineCircle = document.getElementById(timelineCirclesNames[i]);
        timelineCircle.lineName = lineNames[i];
        timelineCircle.addEventListener("click", scrollToTimelineStart);
        timelineCircle.addEventListener("mousedown", scrollWithTimelineCircle);
        timelineCircle.addEventListener('touchstart', scrollWithTimelineCircle, {passive:false});
        timelineCircle.lineLenTot = lineLenTot;
    }
}

function scrollToTimelineStart(evt) {
    // // needs some rethinking
    // var circleElement = evt.currentTarget;
    // var lineElement = document.getElementById(circleElement.lineName);
    // var percentOfLineTot = lineElement.offsetHeight/circleElement.lineLenTot;
    // if (!circleElement.classList.contains("timeline--circle--in--focus")) {
    //     // top is wrong here
    //     window.scrollTo({top:(lineElement.getBoundingClientRect().top + window.pageYOffset - (height/4) - (percentOfLineTot))})
    // }
}

function scrollWithTimelineCircle(evt) {
    evt.preventDefault();
    
    document.circleElement = evt.currentTarget

    document.previousMousePos = evt.clientY || evt.touches[0].clientY;
    document.previousCircleTop = parseFloat(evt.currentTarget.style.top);
    
    document.addEventListener("mousemove", movePageWithCircle);
    document.addEventListener("mouseup", detachScrollFromCircle);
    document.addEventListener("touchmove", movePageWithCircle);
    document.addEventListener("touchend", detachScrollFromCircle);

    evt.currentTarget.style.userSelect = "none";
}

function movePageWithCircle(evt) {

    if (evt.currentTarget.circleElement.classList.contains("timeline--circle--in--focus")) {
        var thisClientY = evt.clientY || evt.touches[0].clientY;
        var scaleFactor = (evt.currentTarget.circleElement.lineLenTot - (height/2)) / (height/2);  // scrollBy only takes ints
        // scrollby top value is not perfect, but close enough -- might eventually look into it better
        window.scrollBy({left:0, top:Math.round((thisClientY - document.previousMousePos)*scaleFactor), behavior:"instant"});
        document.previousMousePos = thisClientY;
    }
    else {
        evt.currentTarget.removeEventListener("mousemove", movePageWithCircle);
        evt.currentTarget.removeEventListener("touchmove", movePageWithCircle);
    }
}
function detachScrollFromCircle(evt) {
    evt.currentTarget.removeEventListener("mousemove", movePageWithCircle);
    evt.currentTarget.removeEventListener("touchmove", movePageWithCircle);
    evt.currentTarget.circleElement.style.removeProperty('user-select');
    evt.currentTarget.circleElement.addEventListener("click", scrollToTimelineStart);
}


function activateProjectCard(cardElement) {
    var spanElement = cardElement.getElementsByTagName("span")[0];
    var hElement = cardElement.getElementsByTagName("h2")[0];
    var markElements = hElement.getElementsByTagName("mark");

    cardElement.classList.add("project--card--active");
    spanElement.classList.add("project--card--span--active");
    for (let m of markElements) {
        m.classList.add("card--highlight--active");
    }
}
function deactivateProjectCard(cardElement) {
    var spanElement = cardElement.getElementsByTagName("span")[0];
    var hElement = cardElement.getElementsByTagName("h2")[0];
    var markElements = hElement.getElementsByTagName("mark");
    
    cardElement.classList.remove("project--card--active");
    spanElement.classList.remove("project--card--span--active");
    for (let m of markElements) {
        m.classList.remove("card--highlight--active");
    }   
}


function clickProjectCard(evt) {
    
    var cardElement = evt.currentTarget;

    evt.currentTarget.style.removeProperty("opacity");
    activateProjectCard(evt.currentTarget);

    cardsOnSameLine = [];
    cardsOnOtherLines = [];
    cardsNotClicked = []
    for (let card of document.getElementsByClassName("project--card")) {
        if (card!=cardElement) {
            cardsNotClicked.push(card)
            if (cardElement.offsetTop==card.offsetTop) {
                cardsOnSameLine.push(card);
            }
            else {
                cardsOnOtherLines.push(card);
            }
        }
    }

    
    for (let card of cardsNotClicked) {
        // this is hacky but it works, 200 is the ms animation length for expanding the explanation card
        // so by delaying removing it for all other cards it looks like the expanded container is the same
        // but changing it to the currently open card avoids problems when opening side menu
        setTimeout(function() {card.parentElement.classList.remove("card--container--expanded")}, 200);
        setTimeout(function() {card.nextElementSibling.classList.remove("project--explanation--expanded")}, 200);
        card.nextElementSibling.firstElementChild.classList.remove("explanation--content--expanded");

        deactivateProjectCard(card);
        card.style.opacity = "0.4";
    }


    if (cardElement != previousClickedCard) {
        cardElement.parentElement.classList.add("card--container--expanded");
        cardElement.nextElementSibling.classList.add("project--explanation--expanded");
        // timeout to move content in after card is expanded
        setTimeout(function() {cardElement.nextElementSibling.firstElementChild.classList.add("explanation--content--expanded");}, 200);

        if (!cardsOnSameLine.includes(previousClickedCard)) {
            // scroll to halfway down the card so expanded bit is in view
            // setTimeout is because we have to wait until explanation is expanded
            setTimeout(function() {window.scrollTo({top:window.pageYOffset + cardElement.getBoundingClientRect().top - topBarHeight + cardElement.offsetHeight*0.4});}, 400);
        }
        for (let card of cardsOnSameLine) {
            card.parentElement.classList.add("card--container--expanded");
            card.nextElementSibling.classList.add("project--explanation--expanded");
            card.nextElementSibling.firstElementChild.classList.remove("explanation--content--expanded");
        }
    }
    else {  // reclick
        // timeout is so content moves and then card collapses
        setTimeout(function() {cardElement.parentElement.classList.remove("card--container--expanded")}, 200);
        setTimeout(function() {cardElement.nextElementSibling.classList.remove("project--explanation--expanded")}, 200);
        cardElement.nextElementSibling.firstElementChild.classList.remove("explanation--content--expanded");

        if (!canHover) {
            deactivateProjectCard(evt.currentTarget);
        }
    
        for (let card of cardsNotClicked) {
            card.style.removeProperty("opacity");
        }

        for (let card of cardsOnSameLine) {
            card.parentElement.classList.remove("card--container--expanded");
            card.nextElementSibling.classList.remove("project--explanation--expanded");
        }
    }


    if (cardElement != previousClickedCard) {
        previousClickedCard = cardElement;
    }
    else {  // if we click a button three times we want it to open close and reopen
        previousClickedCard = null;
    }
}


////

function adjustInterestsBubblesPositions() {

    const bubbles = document.getElementsByClassName("bubble");
    const paragraph = document.getElementById("interests--intro");
    const container = document.getElementById("interests--page");
    var topStart = paragraph.offsetHeight + 100 + 30;  // 30 is padding, 100 is aesthethics
    var containerWidth = container.getBoundingClientRect().width - 60;  // 60 is 2*padding
    var bubbleHeight = bubbles[0].offsetHeight;

    var bubbleGap = 10;
    if (isMobile) {
        bubbleGap = 50;
    }

    var containerHeightTotal = topStart + ((bubbleHeight+bubbleGap)*bubbles.length);
    container.style.height = containerHeightTotal + "px";

    var leftPerc = [0.2, 0.7, 0.5, 0.1, 0.7, 0.3];
    for (var i=0; i<bubbles.length; i++) {
        bubble = bubbles[i];
        bubble.style.transition = "none";  // remove transition only for resize
        topPos = topStart + (bubbleHeight+bubbleGap)*i;
        bubble.style.top = topPos + "px";
        leftPos = leftPerc[i]*containerWidth;
        bubble.style.left = leftPos + "px";
        bubble.style.height = window.getComputedStyle(bubble).getPropertyValue('width');
        bubble.style.removeProperty("transition");  // remove inline transition so we go back to ccs defined one

        bubble.getElementsByTagName('h2')[0].style.fontSize = parseInt(bubble.style.height)/7 + "px";
    }

    // default values for movebubble, the position is changed on hover over other bubbles
    moveBubble = document.getElementsByClassName("bubble--move")[0];
    moveBubble.style.transition = "none";  // reset to css defined property on click of bubble or x
    moveBubble.style.height = window.getComputedStyle(bubbles[0]).getPropertyValue('width');
    moveBubble.style.top = previouslyClickedBubble.style.top;
    moveBubble.style.left = previouslyClickedBubble.style.left;

}

function adjustBubbleLinesPositions() {
    
    const lines = document.getElementsByClassName("connector--line");
    const bubbles = document.getElementsByClassName("bubble");
    // keep first index the one for the bubble on the left
    connectsToList = [[0,1],[2,1],[3,2],[3,4],[5,4],[0,2],[3,0],[2,4],[5,2],[3,5]];
    for (var i=0; i<lines.length; i++) {
        var line = lines[i];
        var bubbleLeft = bubbles[connectsToList[i][0]];
        var bubbleRight = bubbles[connectsToList[i][1]];
        var bubbleSize = bubbleLeft.getBoundingClientRect().width;
        var BLTop = parseFloat(bubbleLeft.style.top);
        var BRTop = parseFloat(bubbleRight.style.top);
        var BLLeft = parseFloat(bubbleLeft.style.left);
        var BRLeft = parseFloat(bubbleRight.style.left);
        var lineLeft = BLLeft + bubbleSize/2;
        var lineTop = BLTop + bubbleSize/2;
        var lineWidth = Math.sqrt((BRLeft - BLLeft)**2 + (BRTop - BLTop)**2);
        var lineAngle = Math.atan((BRTop - BLTop)/(BRLeft - BLLeft));
        
        line.style.left = parseInt(lineLeft) + "px";
        line.style.top = parseInt(lineTop) + "px";
        line.style.width = parseInt(lineWidth) + "px";
        line.style.transformOrigin = "left";
        line.style.transform = "rotate(" + parseInt(lineAngle * (180/Math.PI)) + "deg)";
        line.style.animationDelay = (i/10)*3 + "s"
    }
}

function clickBubble(clickedBubble) {

    previouslyClickedBubble = clickedBubble;

    moveBubble = document.getElementsByClassName("bubble--move")[0];
    moveBubble.style.removeProperty("transition");

    moveBubble.classList.add("bubble--expanded");
    moveBubble.style.zIndex = 3;
    document.getElementById("bubble--esc").style.visibility = "visible";
    window.scrollTo({top:window.pageYOffset + document.getElementById("interests--page").getBoundingClientRect().top - topBarHeight})

    for (let escCorner of document.getElementsByClassName("esc--corner")) {
        setTimeout(function() {escCorner.classList.remove("esc--clicked");}, 400);
    }
}

function popBubbleEsc() {
    // give time for animation to play but can prevent button from showing again if another bubble is clicked before the 500ms
    // since it hides it after is has been displayed by the bubble click, kind of an edge case but worth noting
    // I think this is now fixed by the delay in the listener
    setTimeout(function() {document.getElementById("bubble--esc").style.visibility = "hidden";}, 500);
    moveBubble = document.getElementsByClassName("bubble--move")[0];
    setTimeout(function() {moveBubble.classList.remove("bubble--expanded");}, 100);
    setTimeout(function() {moveBubble.style.removeProperty("z-index");}, 500);
}


function bubbleOnClick(bubbleClicked) {
    var bubblePar = document.getElementById("paragraph--" + bubbleClicked.id);
    var moveBubble = document.getElementsByClassName("bubble--move")[0];
    moveBubble.style.transition = "none";  // transtion is added back in clickBubble
    moveBubble.style.top = bubbleClicked.style.top;
    moveBubble.style.left = bubbleClicked.style.left;
    var clickedBubble = bubbleClicked;
    // timeout to make sure move--bubble has moved to target bubble before expanding
    setTimeout(function() {clickBubble(clickedBubble);}, 100);
    setTimeout(function() {bubblePar.classList.add("paragraph--bubble--expanded");}, 400);
}
function escBubbleOnClick() {
    for (let bubblePar of document.getElementsByClassName("paragraph--bubble")) {
        bubblePar.classList.remove("paragraph--bubble--expanded");
    }
    for (let corner of document.getElementsByClassName("esc--corner")) {
        corner.classList.add("esc--clicked");
    }
    document.getElementsByClassName("bubble--move")[0].style.removeProperty("transition");
    setTimeout(function() {popBubbleEsc();}, 200);
}

///////////////////////////////////////////////////////////////////////////



function onLoadFunction() {

    var loadPage = document.getElementsByClassName("loader--page")[0];
    setTimeout(function() {loadPage.classList.add("page--loaded")}, 500);

    onScrollFunction();
}

function onScrollFunction() {

    if (window.pageYOffset > myPictureTopY-100) {
        document.getElementById("burger--menu").classList.add("burger--background--on");
    }
    else {
        document.getElementById("burger--menu").classList.remove("burger--background--on");
    }
    toggleTopBarOpacity();
    toggleHideTopBar();
    togglePageDotsHighlight();
    moveTimelineDot();
    toggleColorSwitches();  // this shows and hides the right color switch

    lastScrollY = window.pageYOffset;
}

function onResizeFunction() {

    height = window.innerHeight;
    width = window.innerWidth;
    // width = document.body.clientWidth;
    scrollbarWidth = window.innerWidth - document.body.clientWidth;
    isMobile = (height < minHeight) || (width < minWidth);

    onScrollFunction();  // hacky but makes sure everything is in place, needs to be here before other stuff


    if (document.getElementById("side--menu").classList.contains("side--menu--shift--side--menu")) {
        // because I am transitioning when opening the side menu, topbar and sidemenu still have a 
        // transition duration when I resize the screen, set it to 0 on resize so they don't look like jelly
        // but for top--bar set background-color transition to have duration so that when it moves on top of image
        // we still have smooth transition to transarent
        // these properties are removed when unclicking the menu, returning the elements to their default behaviour
        document.getElementById("top--bar").style.transition = "left 0s ease, width 0s ease, margin-left 0s ease, background-color 0.3s ease";
        document.getElementById("side--menu").style.transitionDuration = "left 0s ease, width 0s ease, margin-left 0s ease";
    }

    // if we cross minWidth close menu -- this is a lot simpler and less messy looking than closing old menu and reopeining new one, or transforming between the two
    if ( ((lastWidth<minWidth)&&(width>minWidth)) || ((lastWidth>minWidth)&&(width<minWidth))) {
        unclickMenu();
    }
    
    mainBodyWidth = document.getElementById("main--body").offsetWidth;
    if (width > minWidth) {
        if (mainBodyWidth < (minWidth-scrollbarWidth)) {
            stackBanner();
        }
        else {
            unstackBanner();
        }
    }
    else {
        unstackBanner();
        document.getElementById("job--title").innerHTML = "Software Engineer\nand Data Scientist";
    }

    if (width > minWidth) {
        document.getElementById("durham").innerHTML = "DUR\n_HAM"
        document.getElementById("milan").innerHTML = "MIL\n_ANO"
        document.getElementById("oxford").innerHTML = "OXF\n_ORD"
    }
    else {
        document.getElementById("durham").innerHTML = "DURHAM"
        document.getElementById("milan").innerHTML = "MILANO"
        document.getElementById("oxford").innerHTML = "OXFORD"
    }


    adjustTimelineHeight();
    scrollDragTimeline();
    adjustInterestsBubblesPositions();
    adjustBubbleLinesPositions();  // needs to be called after adjusting bubbles posns

    lastWidth = width;
}



///////////////////////////////////////////////////////////////////////////

const wordsOfTheDay = wrdl_txt.split('\n');
const allWords = all_wrds.split('\n');
let gameBoardIsActive = false;
let wordOfTheDay = wordsOfTheDay[Math.floor(Math.random() * 200)];
let activeTile = null;
let activeTileN = 0;
let guessedWord = "";
let guessSubmitted = false;
let rowsGuessed = 0;
const letterTiles = document.getElementsByClassName("letter");
const boardTiles = document.getElementsByClassName("board--tile");
var bgColorStr = "rgba(" + bgColor + ", 1)";
var wrongColorStr = "rgba(" + contentColor600 + ", 0.3)";
var midColorStr = "rgba(" + contentColor600 + ", 1)";
var rightColorStr = "rgba(" + accentColor + ", 1)";
var letterScores = [];
for (let lt of letterTiles) {
    letterScores.push(-1);
}

var ignoreClickOnBoard = document.getElementById('game--board');
var ignoreClickOnCard = document.getElementById('wordle--card');
var ignoreClickOnLetters = document.getElementById('letter--list');
document.addEventListener('click', function(event) {
    var isClickInsideBoard = ignoreClickOnBoard.contains(event.target);
    var isClickInsideCard = ignoreClickOnCard.contains(event.target);
    var isClickInsideLetters = ignoreClickOnLetters.contains(event.target);
    if (!isClickInsideBoard && !isClickInsideCard && !isClickInsideLetters) {
        document.removeEventListener('keydown', wordleOnKeyPress, true);
        gameBoardIsActive = false;
    }
});

function runWordleClone() {
    if (gameBoardIsActive) {
        return null;
    }
    document.addEventListener('keydown', wordleOnKeyPress, true);
    for (let lt of letterTiles) {
        lt.addEventListener('click', wordleOnKeyPress, true);
    }
}


function wordleOnKeyPress(event) {
    gameBoardIsActive = true;

    if (event.key !== undefined) {
        var letterPressed = event.key.toUpperCase();
    }
    else {
        var letterPressed = event.currentTarget.textContent;
    }
    
    if (letterPressed.charCodeAt(0) < 65 || letterPressed.charCodeAt(0) > 90) {
        return null;
    }
    if (!(letterPressed.length == 1 || ['BACKSPACE', 'ENTER'].includes(letterPressed))) {
        return null;
    }

    for (var i = 0; i < boardTiles.length; i++) {
        if (activeTile === null) {
            break;
        }
        else if (boardTiles[i].textContent == "") {
            activeTileN = i;
            break;
        }
        else {  // when we reach end of board, I know this is hacky
            activeTileN = 30;
        }
    }
    activeTile = boardTiles[activeTileN]

    if (letterPressed == 'BACKSPACE') {
        if (activeTileN%5 ==0 && parseInt(activeTileN/5) == rowsGuessed) {
            return null;
        }
        guessedWord = guessedWord.slice(0, -1);
        activeTileN = activeTileN-1;
        activeTile = boardTiles[activeTileN];
        activeTile.textContent = "";
        return null;
    }


    if (guessedWord.length == 5) {
        if (letterPressed == 'ENTER') {
            if (!doesWordExists(guessedWord)) {
                guessSubmitted = false;
                return null;
            }
            guessSubmitted = true;
        }
        else {
            guessSubmitted = false;
            return null;
        }
    }
    else {
        if (letterPressed == 'ENTER') {
            return null;
        }
        // submit letter
        guessSubmitted = false;
        activeTile.textContent = letterPressed;
        guessedWord += letterPressed;
    }

    var guessCorrect = false;
    if (guessSubmitted) {
        rowsGuessed += 1;
        var ratingsArray = getWordScores(guessedWord, wordOfTheDay);

        const ratingToColorD = {0: wrongColorStr, 1: midColorStr, 2: rightColorStr};

        var wordColors = [];
        for (var i=0; i<5; i++) {
            wordColors.push(ratingToColorD[ratingsArray[i]])
        }

        guessCorrect = ratingsArray.every( v => v === 2);

        let letterToRatingD = {};
        for (var i=0; i<5; i++) {
            if (!letterToRatingD[guessedWord[i]]) {
                letterToRatingD[guessedWord[i]] = [];
            }
            letterToRatingD[guessedWord[i]].push(ratingsArray[i]);
        }

        for (var i=0; i<5; i++) {
            boardTile = boardTiles[(rowsGuessed-1)*5+i];
            boardTile.style.background = wordColors[i];
            boardTile.style.opacity = "0.5";
        }
        for (let key in letterToRatingD) {
            var charCode = key.charCodeAt(0);
            var tilePos = charCode - 65;
            var letterTile = letterTiles[tilePos];  // enter and backspace are positioned at the start in css but are the last two spans in the DOM

            var letterScore = Math.max(...letterToRatingD[key]);
            var previousScore = letterScores[tilePos];

            if (letterScore > previousScore) {
                letterTile.style.background = ratingToColorD[letterScore];
                letterScores[tilePos] = letterScore;
            }
        }
        guessedWord = "";
    }

    if ((activeTileN == 30 && guessSubmitted) || guessCorrect) {  // end of board or correct word guessed
        const endScreen = document.getElementsByClassName("endscreen")[0];
        document.getElementById("wordle--solution").textContent = wordOfTheDay.toUpperCase();
        if (guessCorrect) {
            document.getElementById("solution--message").textContent = "Congratulations! That's correct!";
        }
        else {
            document.getElementById("solution--message").textContent = "Better luck next time!";
        }
        endScreen.classList.add("endscreen--active");
        document.removeEventListener('keydown', wordleOnKeyPress, true);
    }
}

function getWordScores(guessedWord, wordToGuess) {
    wordToGuess = wordToGuess.toUpperCase();
    var ratingsArray = [0,0,0,0,0];
    for (var i=0; i<5; i++) {
        let correctLetter = wordToGuess[i];            
        let maxRating = 0;
        let rightPos = 0;
        let foundLetter = false;
        for (var j=0; j<5; j++) {
            let myLetter = guessedWord[j];
            if (myLetter == correctLetter) {
                foundLetter = true;
                if (i==j) {
                    maxRating = 2;
                    rightPos = j;
                    break;
                }
                if (maxRating < 2) {
                    maxRating = 1;
                    rightPos = j;
                }
            }
        }
        if (foundLetter) {
            ratingsArray[rightPos] = maxRating;
        }
    }

    return ratingsArray;
}

function resetWordle() {
    gameBoardIsActive = false;
    wordOfTheDay = wordsOfTheDay[Math.floor(Math.random() * 200)];
    activeTile = null;
    activeTileN = 0;
    guessedWord = "";
    guessSubmitted = false;
    rowsGuessed = 0;
    letterScores = [];
    for (let boardTile of boardTiles) {
        boardTile.textContent = "";
        boardTile.style.background = ""
        boardTile.style.opacity = "";
    }
    for (let letter of letterTiles) {
        letter.style.background = ""
        letterScores.push(-1);
    }
    setTimeout(function() {document.addEventListener('keydown', wordleOnKeyPress, true);}, 400);
    setTimeout(function() {document.getElementsByClassName("endscreen")[0].classList.remove("endscreen--active");}, 400);
    setTimeout(function() {document.getElementsByClassName("reset--arrow")[0].classList.remove("reset--arrow--clicked");}, 1000);
}

function doesWordExists(word) {
    if (allWords.includes(word.toLowerCase())) {
        return true;
    }
    return false;
}