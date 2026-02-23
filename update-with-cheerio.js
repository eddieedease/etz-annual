const fs = require('fs');

const data = JSON.parse(fs.readFileSync('parsed_content.json', 'utf8'));
let html = fs.readFileSync('src/app/features/report-2025/report-2025.component.html', 'utf8');

// For Chapter 2: "2.1 Algemeen" -> We need to update Table 1: "Geslacht / Leeftijd"
// The structure of the 2025 table in HTML has 2023 and 2024 columns. 
// We should update the column headers to 2024 and 2025.
html = html.replace('<th class="py-2 px-3 text-center" colspan="2">2023</th>', '<th class="py-2 px-3 text-center" colspan="2">2024</th>');
html = html.replace('<th class="py-2 px-3 text-center" colspan="2">2024</th>', '<th class="py-2 px-3 text-center" colspan="2">2025</th>');

// The new data from Word is in data.tables[0].rows
// Row mapping:
// 0: [ '', '', '2024', '2025', '' ]
// 1: [ 'Geslacht', 'Leeftijd categorie', 'Aantal', 'FTE', 'Aantal', 'FTE' ]
// 2: [ 'Man', '', '910', '825', '905', '818' ]
// 3: [ 'Leeftijd 16 - 25', '105', '72', '111', '80' ]
// 4: [ 'Leeftijd 26 - 35', '229', '217', '219', '203' ]
// 5: [ 'Leeftijd 36 - 45', '171', '159', '183', '171' ]
// ... this is very brittle to do via string replacement of every single number.

// Let's use cheerio to parse the HTML and manipulate it robustly
const cheerio = require('cheerio');
const $ = cheerio.load(html);

// Table 1 Update (Geslacht)
const table1 = $('table').eq(0);
// headers:
table1.find('thead tr').eq(0).find('th').eq(2).text('2024');
table1.find('thead tr').eq(0).find('th').eq(3).text('2025');

const t1Rows = data.tables[0].rows;
let rIdx = 2; // Start at Man

table1.find('tbody tr').each((i, el) => {
    if (rIdx >= t1Rows.length) return;

    // Skip empty separator rows in HTML or JSON
    let wordRow = t1Rows[rIdx];
    if (wordRow.length < 4) {
        if (wordRow[0] && (wordRow[0].includes('Ratio') || wordRow[0].includes('FTE ETZ'))) return;
        rIdx++;
        wordRow = t1Rows[rIdx];
    }
    if (!wordRow) return;

    const tds = $(el).find('td');

    // Man/Vrouw/X/Totaal rows have different column counts due to rowspan/colspans
    if (wordRow.length === 6) {
        // Example: ['Man', '', '910', '825', '905', '818']
        tds.eq(2).text(wordRow[2]);
        tds.eq(3).text(wordRow[3]);
        tds.eq(4).text(wordRow[4]);
        tds.eq(5).text(wordRow[5]);
        rIdx++;
    } else if (wordRow.length === 5) {
        // Example: ['Leeftijd 16 - 25', '105', '72', '111', '80']
        // Totaal: [ 'Totaal', '5182', '4127', '5163', '4141' ]
        tds.eq(1).text(wordRow[1]);
        tds.eq(2).text(wordRow[2]);
        tds.eq(3).text(wordRow[3]);
        tds.eq(4).text(wordRow[4]);
        rIdx++;
    }
});

// Update the two metric cards below Table 1
// Ratio bepaalde / onbepaalde tijd 
let ratioBox = $('div:contains("Ratio bepaalde / onbepaalde tijd contract")').last();
ratioBox.find('p:contains("2023")').text('2024');
ratioBox.find('p:contains("28,70%")').text('28,79%');
ratioBox.find('p:contains("2024")').text('2025');
ratioBox.find('p:contains("28,79%")').text('24,92%');

// Gemiddelde deeltijdfactor
let fteBox = $('div:contains("Gemiddelde deeltijdfactor ETZ")').last();
fteBox.find('p:contains("2023")').text('2024');
fteBox.find('p:contains("0,7931")').text('0,7062');
fteBox.find('p:contains("2024")').text('2025');
fteBox.find('p:contains("0,7964")').text('0,7254');

// Table 2 Update (Instroom / Uitstroom)
const table2 = $('table').eq(1);
// Table 3 Update (Studenten)
const table3 = $('table').eq(2);

// Write back
fs.writeFileSync('src/app/features/report-2025/report-2025.component.html', $.html());
console.log('Tables 1 updated successfully via cheerio.');
