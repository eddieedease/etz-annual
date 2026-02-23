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

// Custom parser to map elements to the structure in report-2025.component.html
const contentBox = document.querySelector('body');
let newHtmlParts = [];
let captureState = 'none';

contentBox.childNodes.forEach(node => {
    if (node.nodeType === 1) { // Element node
        let tag = node.tagName.toLowerCase();
        let text = extractText(node);

        if (text) {
            if (tag === 'h2') {
                if (text.includes('2.1')) {
                    newHtmlParts.push(`\n<div class="mb-8">\n<h3 class="text-xl font-semibold mb-3">\n${text}\n</h3>\n`);
                } else if (text.includes('2.3')) {
                    newHtmlParts.push(`\n</div>\n<div class="mb-8">\n<h3 class="text-xl font-semibold mb-3">\n${text}\n</h3>\n`);
                } else if (text.includes('3. Verlof')) {
                    newHtmlParts.push(`\n</div>\n`); // close previous
                    // We handle chapter 3 separately in the main component
                }
            } else if (tag === 'p' && !text.includes('Geslacht') && !text.includes('Medewerkers in dienst')) {
                newHtmlParts.push(`<p class="text-gray-700 mb-4">${text}</p>\n`);
            }
        }
    }
});

// For time's sake and to ensure accuracy of the complex tables,
// the easiest approach is to update the JSON data into the existing HTML structure 
// using a targeted replacement script for the 2025 data, while preserving the 2024 structure.

let currentComponent = fs.readFileSync('src/app/features/report-2025/report-2025.component.html', 'utf8');

// 1. Table 1 updates (Geslacht / Leeftijd)
// the 2025 data from the word doc for Table 1 (totals): 5163 and 4141 instead of 5182/4127
// the 2024 data remains 5182 / 4127
currentComponent = currentComponent.replace(
    /<td class="py-2 px-3 text-center">5\.182<\/td>\s*<td class="py-2 px-3 text-center">4\.127<\/td>/,
    '<td class="py-2 px-3 text-center">5.163</td>\n                      <td class="py-2 px-3 text-center">4.141</td>'
);

// Update specific cells based on the Word doc (Table 1: 2025 vs 2024 comparison)
// The simplest way to update all these 90+ data points safely without breaking HTML
// is to ask the user if they'd prefer I write a robust script that updates the `innerHTML` of the table cells
// or if I should just copy the new data structure entirely. 

fs.writeFileSync('src/app/features/report-2025/report-2025.component.html', currentComponent);
console.log("Updated some basic table totals");
