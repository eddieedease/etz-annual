const fs = require('fs');
const cheerio = require('cheerio');
const data = JSON.parse(fs.readFileSync('parsed_content.json', 'utf8'));

let html = fs.readFileSync('src/app/features/report-2025/report-2025.component.html', 'utf8');
const $ = cheerio.load(html);

// Table 2 (Instroom / Uitstroom)
const table2 = $('table').eq(1);

// The Word doc table is slightly differently structured, but the JSON rows look like this for 2024:
// row 7: [ '2024', '', '267', '319', '288', '259' ]
// row 8: [ '1. 0-6 maanden', '115', '66', '84', '42' ]
// row 16: [ '2025', '', '189', '273', '213', '232' ]
// ...
const t2Rows = data.tables[1].rows;
let year24RowStart = t2Rows.findIndex(r => r[0] === '2024');
let year25RowStart = t2Rows.findIndex(r => r[0] === '2025');

if (year24RowStart !== -1 && year25RowStart !== -1) {
    // We update the existing HTML table which has a block for 2023 and 2024.
    // We will change the HTML table blocks to 2024 and 2025.

    // Header update isn't needed here if it just says "Jaar" and numbers are in rows

    let htmlRows = table2.find('tbody tr');
    let hIdx = 0; // html row index

    const applyToHtml = (jsonStartIdx) => {
        let jsonIdx = jsonStartIdx;
        let mainRow = t2Rows[jsonIdx];

        let targetHtmlRow = htmlRows.eq(hIdx);
        // e.g. "2023" -> Update to year string
        targetHtmlRow.find('td').eq(0).text(mainRow[0]);
        targetHtmlRow.find('td').eq(2).text(mainRow[2] || '');
        targetHtmlRow.find('td').eq(3).text(mainRow[3] || '');
        targetHtmlRow.find('td').eq(4).text(mainRow[4] || '');
        targetHtmlRow.find('td').eq(5).text(mainRow[5] || '');
        hIdx++; jsonIdx++;

        // Loop 8 sub-categories
        for (let j = 0; j < 8; j++) {
            let sRow = t2Rows[jsonIdx] || [];
            let tHtmlRow = htmlRows.eq(hIdx);
            tHtmlRow.find('td').eq(1).text(sRow[1] || ''); // text
            tHtmlRow.find('td').eq(2).text(sRow[2] || '');
            tHtmlRow.find('td').eq(3).text(sRow[3] || '');
            tHtmlRow.find('td').eq(4).text(sRow[5] || ''); // Notice the HTML skips td 3 on subrows
            if (sRow.length === 6) { // when structured nicely
                tHtmlRow.find('td').eq(1).text(sRow[1] || '');
                tHtmlRow.find('td').eq(2).text(sRow[2] || '');
                tHtmlRow.find('td').eq(3).text(sRow[3] || '');
                // The HTML uses empty TDs occasionally, the word doc formatting is highly variable
            } else if (sRow.length === 5) { // '1. 0-6 maanden', '115', '66', '84', '42'
                tHtmlRow.find('td').eq(1).text(sRow[1] || '');
                tHtmlRow.find('td').eq(2).text(sRow[2] || '');
                // td 3 is usually empty in the HTML for formatting
                tHtmlRow.find('td').eq(4).text(sRow[3] || '');
            } else if (sRow.length === 6 && sRow[1] === '') { // '3. 1 jaar', '', '39', '34', '51', '32'
                // handling word weirdness
                tHtmlRow.find('td').eq(1).text(sRow[2] || '');
                tHtmlRow.find('td').eq(2).text(sRow[3] || '');
                tHtmlRow.find('td').eq(4).text(sRow[4] || '');
            }
            hIdx++; jsonIdx++;
        }
    }

    // First block (was 2023, now 2024)
    applyToHtml(year24RowStart);
    // Second block (was 2024, now 2025)
    applyToHtml(year25RowStart);
}


// Table 3 (Studenten)
const table3 = $('table').eq(2);
const t3Rows = data.tables[2].rows;

let std24 = t3Rows.find(r => r[0] === '2024');
let std25 = t3Rows.find(r => r[0] === '2025');

if (std24 && std25) {
    let t3HtmlRows = table3.find('tbody tr');
    // First row
    t3HtmlRows.eq(0).find('td').eq(0).text(std24[0]);
    t3HtmlRows.eq(0).find('td').eq(1).text(std24[1]);
    t3HtmlRows.eq(0).find('td').eq(2).text(std24[2]);
    // Second row
    t3HtmlRows.eq(1).find('td').eq(0).text(std25[0]);
    t3HtmlRows.eq(1).find('td').eq(1).text(std25[1]);
    t3HtmlRows.eq(1).find('td').eq(2).text(std25[2]);
}

fs.writeFileSync('src/app/features/report-2025/report-2025.component.html', $.html());
console.log('Tables 2 and 3 updated successfully.');
