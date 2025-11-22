// ==UserScript==
// @name     relative Fondsperformance Fondsdepotbank
// @version  5
// @grant    none
// @match    https://finanzportal.fondsdepotbank.de/fdb-*/abaxx-?$part=Home.content.Welcome.Dashboard.4&$event=gotoLink*
// ==/UserScript==
const getAmount = node => parseFloat(node.innerText.replace('.', '').replace(/,(\d+).*$/, '.$1'));

const createListElementForPercentage = (elementType, percentage) => {
    const newElement = document.createElement(elementType);
    newElement.innerHTML = percentage.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' %';
    newElement.style.color = percentage < 0 ? 'red' : 'green';
    newElement.classList.add('text-right', 'abx-primary');

    return newElement;
};

const addRelativePerformance = () => {
    const [saldoNode, gewinnNode] = document.querySelectorAll(
        '.abx-portlet-bnk-portfolioselection-detail div.abx-panel > dl > dd:nth-child(2)'
    );

    if (saldoNode && gewinnNode) {
        const saldo = getAmount(saldoNode);
        const gewinn = getAmount(gewinnNode);
        const prozente = (gewinn * 100) / (saldo - gewinn);

        const list = document.querySelector('.abx-portlet-bnk-portfolioselection-detail div.abx-panel > dl');
        if (list) {
            const dd = createListElementForPercentage('dd', prozente);
            list.append(document.createElement('dt'));
            list.append(dd);
            unsafeWindow.console.info('rFF: Added global relative performance.');
        } else {
            unsafeWindow.console.warn('rFF: Could not parse the page for the global performance list.');
        }
    } else {
        unsafeWindow.console.warn('rFF: Could not parse the page for the "saldo" and "gewinn" nodes.');
    }

    const fondsPerformanceOlNodes = document.querySelectorAll('tbody td.abx-aspect-valueComposite ol');

    if (fondsPerformanceOlNodes.length === 0) {
        unsafeWindow.console.warn('rFF: Could not parse the page for the performance list per position.');
    }

    fondsPerformanceOlNodes.forEach(node => {
        const einstandswert = getAmount(node.childNodes[0]);
        const gewinn = getAmount(node.childNodes[2]);
        const prozente = (gewinn * 100) / einstandswert;

        const li = createListElementForPercentage('li', prozente);
        node.append(li);
        unsafeWindow.console.info('rFF: Added relative performance for one position.');
    });
};

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        unsafeWindow.console.info('rFF: Document complete, will add relative performance nodes.');
        addRelativePerformance();
    }
};

unsafeWindow.console.info('rFF: Initialized relative Fondsperformance Fondsdepotbank (rFF) user script.');
