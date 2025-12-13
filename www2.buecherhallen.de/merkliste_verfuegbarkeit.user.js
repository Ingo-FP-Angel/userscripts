// ==UserScript==
// @name         Verfügbare Einträge der Buecherhallen Merkliste
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Zeigt die verfügbaren Medien der Merkliste auf der Startseite in einem Overlay an
// @author       Ingo-FP-Angel
// @match        https://www2.buecherhallen.de/startseite
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Welche Liste abgerufen werden soll
    const LIST_NAME = 'Merkliste';
    // Für welchen Standort die Verfügbarkeit geprüft werden soll
    const LOCATION = "Zentralbibliothek";
    const API_URL = 'https://www2.buecherhallen.de/api/items?type=lists';
    const API_URL_DETAILS = 'https://www2.buecherhallen.de/api/record?id=';

    // Funktion zum Erstellen des Overlay-Containers
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'merkliste-json-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 10%;
            width: 80%;
            max-height: 100%;
            background-color: white;
            border: 1px solid #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            overflow: auto;
            padding: 20px;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border-radius: 8px;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        closeButton.onclick = () => overlay.remove();
        overlay.appendChild(closeButton);

        const title = document.createElement('h3');
        title.textContent = 'Verfügbare Einträge meiner Buecherhallen Merkliste';
        title.style.cssText = `
            color: #333;
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        `;
        overlay.appendChild(title);

        return overlay;
    }

    // Funktion zum Konvertieren eines JSON-Arrays in eine HTML-Tabelle
    function jsonToTable(jsonArray) {
        if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Keine Daten oder ungültiges JSON-Array gefunden.';
            return p;
        }

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 14px;
        `;

        // Tabellenkopf erstellen
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        // Annahme: Alle Objekte im Array haben die gleichen Schlüssel für die Spaltenüberschriften
        const keys = Object.keys(jsonArray[0]);
        keys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            th.style.cssText = `
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
                background-color: #f8f8f8;
                font-weight: bold;
                color: #555;
            `;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Tabellenkörper erstellen
        const tbody = document.createElement('tbody');
        jsonArray.forEach(item => {
            const row = document.createElement('tr');
            keys.forEach(key => {
                const td = document.createElement('td');
                if (key === "Details") {
                    var a = document.createElement('a');
                    a.appendChild(document.createTextNode('Öffnen 🔗'));
                    a.href = `https://www2.buecherhallen.de/manifestations/${item[key]}`;
                    a.target = '_blank';
                    td.appendChild(a);
                } else {
                    td.textContent = item[key] !== null && item[key] !== undefined ? item[key].toString() : '';
                }
                td.style.cssText = `
                    border: 1px solid #ddd;
                    padding: 8px;
                    vertical-align: top;
                `;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        return table;
    }

    // Hauptfunktion zum Abrufen und Anzeigen der Daten
    async function fetchDataAndDisplay() {
        const overlay = createOverlay();
        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = 'Lade Daten... Bitte warten.';
        loadingMessage.style.cssText = 'color: #555; font-style: italic;';
        overlay.appendChild(loadingMessage);
        document.body.appendChild(overlay);

        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "solus-app-id": "28d4dc2f-692b-472b-870d-5e6c35c4ad26",
                },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error(`HTTP Fehler! Status: ${response.status}`);
            }

            const data = await response.json();
            const merkliste = data.find(entry => entry.listName === LIST_NAME);
            if (!merkliste) {
                throw new Error(`Keine Liste mit Namen "${LIST_NAME}" gefunden!`);
            }

            const availableItems = [];
            const numEntries = merkliste.itemCount;
            for (var currentEntry = 0; currentEntry < numEntries; currentEntry++) {
                loadingMessage.textContent = `Lade Daten... Bitte warten. ${currentEntry + 1} / ${numEntries}`;

                const recordId = merkliste.items[currentEntry].id;
                const details = await fetchDetails(recordId);

                if (details) {
                    availableItems.push(details)
                }
            }

            loadingMessage.remove(); // Lade-Nachricht entfernen

            const table = jsonToTable(availableItems.sort((a, b) => a.Titel.localeCompare(b.Titel)));
            overlay.appendChild(table);
        } catch (error) {
            loadingMessage.remove(); // Lade-Nachricht entfernen
            const errorMessage = document.createElement('p');
            errorMessage.style.color = '#c0392b';
            errorMessage.textContent = `Fehler beim Abrufen der Daten: ${error.message}`;
            overlay.appendChild(errorMessage);
            console.error('Greasemonkey Fehler:', error);
        }
    }

    async function fetchDetails(recordId) {
        try {
            const response = await fetch(API_URL_DETAILS + recordId, {
                method: "GET",
                headers: {
                    "solus-app-id": "28d4dc2f-692b-472b-870d-5e6c35c4ad26",
                },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error(`HTTP Fehler! Status: ${response.status}`);
            }

            const data = await response.json();

            var available = data.copies.find(entry => entry.location.locationName === LOCATION && entry.available);

            if (!available) {
                return null;
            }

            return {
                "Details": data.recordID,
                "Titel": data.title,
                "Author": data.author,
                "Format": data.format,
                "Abteilung": available.classification.replace('<br />', ' → '),
                "Signatur": data.mainMetadata.find(entry => entry.key === 'Signatur')?.usableValue || 'unbekannt',
                "Anzahl": available.count,
            };
        } catch (error) {
            console.error('Greasemonkey Fehler:', error);
        }
    }

    // Die Funktion ausführen, sobald das Dokument geladen ist
    fetchDataAndDisplay();

})();
