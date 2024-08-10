// ==UserScript==
// @name     Perspective Daily
// @version  2
// @grant    none
// @include  https://perspective-daily.de/article/feed/#/newest*
// @include  https://perspective-daily.de/member/
// ==/UserScript==

const changeClass = (node) => {
    node.className = node.className.replace("longread", "shortread")
}

const changeClassInitial = () => {
    const longreads = document.querySelectorAll(".longread")

    longreads.forEach(node => changeClass(node))
    console.log("PD: changed all article styles")
}

const addObserver = () => {
    sections = document.querySelectorAll(".newest")

    sections.forEach(section => {
        var mutationObserver = new MutationObserver(mutations => {
            changeClassInitial()
        })
        mutationObserver.observe(section, {childList: true})
    })
}

document.onreadystatechange = () => {
    console.log("PD: Trigger for readyState " + document.readyState)
    if (document.readyState === 'complete') {
        changeClassInitial()
        addObserver()
    }
}
