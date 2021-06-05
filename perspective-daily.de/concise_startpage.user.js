// ==UserScript==
// @name     Perspective Daily
// @version  1
// @grant    none
// @include  https://perspective-daily.de/article/feed/#/newest*
// @include  https://perspective-daily.de/member/
// ==/UserScript==

const changeClass = node => {
    node.className = node.className.replace('longread', 'shortread');
};

const changeClassInitial = () => {
    const longreads = document.querySelectorAll('.longread');

    longreads.forEach(node => changeClass(node));
};

const addObserver = () => {
    let section = document.querySelector('.newest');

    let mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => changeClass(node));
        });
    });

    mutationObserver.observe(section, { childList: true });
};

document.onreadystatechange = () => {
    console.log(`Trigger for readyState ${document.readyState}`);
    if (document.readyState === 'complete') {
        changeClassInitial();
        addObserver();
    }
};
