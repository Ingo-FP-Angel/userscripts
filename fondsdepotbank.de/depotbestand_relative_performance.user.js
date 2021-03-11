// ==UserScript==
// @name     relative Fondsperformance Fondsdepotbank
// @version  3
// @grant    none
// @match    https://finanzportal.fondsdepotbank.de/fdb-*/abaxx-?$part=Home.content.Welcome.Dashboard.4&$event=gotoLink
// ==/UserScript==
const getAmount = node => parseFloat(node.innerText.replace('.', '').replace(/,(\d+).*$/, '.$1'));

const createListElementForPercentage = percentage => {
    const li = document.createElement('li');
    li.innerHTML = `${percentage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
    li.style.color = percentage < 0 ? 'red' : 'green';

    return li;
};

const addRelativePerformance = () => {
    const [saldoNode, gewinnNode] = document.querySelectorAll('.abx-portlet-bnk-portfolioselection-detail div.abx-right > ol > li:first-child');

    if (saldoNode && gewinnNode) {
        const saldo = getAmount(saldoNode);
        const gewinn = getAmount(gewinnNode);
        const prozente = (gewinn * 100) / (saldo - gewinn);

        const list = document.querySelector('.abx-portlet-bnk-portfolioselection-detail div.abx-left div.abx-right > ol');
        const li = createListElementForPercentage(prozente);
        list.append(li);
    } else {
        console.warn('Could not parse the page');
    }

    const fondsPerformanceOlNodes = document.querySelectorAll('tbody td.abx-aspect-valueComposite ol');
    fondsPerformanceOlNodes.forEach(node => {
        const einstandswert = getAmount(node.childNodes[0]);
        const gewinn = getAmount(node.childNodes[2]);
        const prozente = (gewinn * 100) / einstandswert;

        const li = createListElementForPercentage(prozente);
        node.append(li);
    });
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        addRelativePerformance();
    }
};
