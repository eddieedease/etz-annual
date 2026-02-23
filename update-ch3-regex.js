const fs = require('fs');

let html = fs.readFileSync('src/app/features/report-2025/report-2025.component.html', 'utf8');

// 1. Fix Angular Directives broken by Cheerio
html = html.replace(/\[ngclass\]/g, '[ngClass]');
html = html.replace(/\*ngfor/g, '*ngFor');
html = html.replace(/\[ngswitch\]/g, '[ngSwitch]');
html = html.replace(/\*ngswitchcase/g, '*ngSwitchCase');
html = html.replace(/routerlink=/g, 'routerLink=');
html = html.replace(/routerlinkactive/g, 'routerLinkActive');
html = html.replace(/#maincontent=""/g, '#mainContent=""');


// 2. Update Chapter 3 'Verlof' Table
// The data for 2025 comes from the word doc (parsed_content.json Table 3)
// Since we have the raw numbers from the doc:
// Soort verlof | 2025 | 2024 | 2023
// Onbetaald ouderschapsverlof | 327 | 310 | 314
// Betaald ouderschapsverlof | 300 | 270 | 269
// Zorgverlof | 100 | 91 | 78

// Update the headers:
html = html.replace(
    '<th class="py-2 px-4 text-center border-b">2024</th>\n                      <th class="py-2 px-4 text-center border-b">2023</th>\n                      <th class="py-2 px-4 text-center border-b">2022</th>',
    '<th class="py-2 px-4 text-center border-b">2025</th>\n                      <th class="py-2 px-4 text-center border-b">2024</th>\n                      <th class="py-2 px-4 text-center border-b">2023</th>'
);

// Update Onbetaald row:
html = html.replace(
    '<td class="py-2 px-4 border-b">\n                        Onbetaald ouderschapsverlof\n                      </td>\n                      <td class="py-2 px-4 text-center border-b">310</td>\n                      <td class="py-2 px-4 text-center border-b">314</td>\n                      <td class="py-2 px-4 text-center border-b">306</td>',
    '<td class="py-2 px-4 border-b">\n                        Onbetaald ouderschapsverlof\n                      </td>\n                      <td class="py-2 px-4 text-center border-b">327</td>\n                      <td class="py-2 px-4 text-center border-b">310</td>\n                      <td class="py-2 px-4 text-center border-b">314</td>'
);

// Update Betaald row:
html = html.replace(
    '<td class="py-2 px-4 border-b font-medium">\n                        Betaald ouderschapsverlof\n                      </td>\n                      <td class="py-2 px-4 text-center border-b">270</td>\n                      <td class="py-2 px-4 text-center border-b">269</td>\n                      <td class="py-2 px-4 text-center border-b">81</td>',
    '<td class="py-2 px-4 border-b font-medium">\n                        Betaald ouderschapsverlof\n                      </td>\n                      <td class="py-2 px-4 text-center border-b">300</td>\n                      <td class="py-2 px-4 text-center border-b">270</td>\n                      <td class="py-2 px-4 text-center border-b">269</td>'
);

// Update Zorgverlof row:
html = html.replace(
    '<td class="py-2 px-4 border-b">Zorgverlof</td>\n                      <td class="py-2 px-4 text-center border-b">91</td>\n                      <td class="py-2 px-4 text-center border-b">78</td>\n                      <td class="py-2 px-4 text-center border-b">60</td>',
    '<td class="py-2 px-4 border-b">Zorgverlof</td>\n                      <td class="py-2 px-4 text-center border-b">100</td>\n                      <td class="py-2 px-4 text-center border-b">91</td>\n                      <td class="py-2 px-4 text-center border-b">78</td>'
);

fs.writeFileSync('src/app/features/report-2025/report-2025.component.html', html);
console.log("Fixed directives and updated verlof table.");
