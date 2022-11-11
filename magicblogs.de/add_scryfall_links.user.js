// ==UserScript==
// @name     Add Scryfall links to magicblogs.de
// @version  1
// @grant    none
// @match    https://magicblogs.de/blog/*/
// ==/UserScript==
const addLinks = () => {
    document.querySelectorAll('.jTip').forEach(node => {
        const a = document.createElement('a');
        a.setAttribute('href', 'https://scryfall.com/search?q=' + node.innerText);
        a.setAttribute('target', '_blank');
        a.innerHTML = '🔗';

        node.insertAdjacentElement('afterend', a);
    });
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        addLinks();
    }
};
