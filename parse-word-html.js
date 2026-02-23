const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('wordtohtml/hoofstuk 2 en 3.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function extractText(node) {
    if (!node) return '';
    return node.textContent.trim().replace(/\s+/g, ' ');
}

// 1. Extract headings and paragraphs
const elements = document.querySelectorAll('h2, h3, p');
let content = [];
elements.forEach(el => {
    let tag = el.tagName.toLowerCase();
    let text = extractText(el);
    if (text) {
        content.push({ type: tag, text: text });
    }
});

// 2. Extract specific tables
// There are 3 tables in the doc: 
// - Table 1: Geslacht/Leeftijd
// - Table 2: Instroom/Uitstroom
// - Table 3: Leerlingen
// - Table 4: Verlof
const tables = document.querySelectorAll('table');
let parsedTables = [];

tables.forEach((table, index) => {
    let rows = [];
    table.querySelectorAll('tr').forEach(tr => {
        let row = [];
        tr.querySelectorAll('td, th').forEach(td => {
            row.push(extractText(td));
        });
        if (row.length > 0 && row.some(cell => cell !== '')) {
            rows.push(row);
        }
    });
    parsedTables.push({ index, rows });
});

fs.writeFileSync('parsed_content.json', JSON.stringify({ content, tables: parsedTables }, null, 2));
console.log('Parsed content saved to parsed_content.json');
