// ==UserScript==
// @name     tibrosBB_Open_Project_Details
// @version  1
// @grant    none
// @match  https://*/tibrosBB/projektePrueferAnsicht.jsp
// ==/UserScript==
const addLinks = () => {
    document.querySelectorAll('[action="projektAntragDetailsPruefer.jsp"].content-form > input').forEach(node => {
        const a = document.createElement('a');
        a.setAttribute('href', `projektAntragDetailsPruefer.jsp?id=${node.value}`);
        a.setAttribute('target', '_blank');
        a.innerHTML = 'Öffnen';

        node.parentNode.appendChild(a);
    });
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        addLinks();
    }
};
