const fs = require('fs');

const data = JSON.parse(fs.readFileSync('parsed_content.json', 'utf8'));

// we need to overwrite the 2025 component HTML sections 
// 1. Inzicht medewerkers (Chapter 2)
// 2. Verlof en generatieafspraken (Chapter 3)

let currentHtml = fs.readFileSync('src/app/features/report-2025/report-2025.component.html', 'utf8');

// For Chapter 1, the user said we don't have data yet and should use a placeholder.
// So for 'Algemeen', we'll replace the text with "Wordt nog aangeleverd."

const algemeenStart = currentHtml.indexOf('<h2 class="text-2xl font-bold mb-6 text-etz-blue flex items-center">');
const inzichtStart = currentHtml.indexOf('<div *ngSwitchCase="\'Inzicht medewerkers\'">');

if (algemeenStart > 0 && inzichtStart > algemeenStart) {
    let algemeenIntro = currentHtml.substring(0, algemeenStart);
    let newAlgemeen = `
            <h2 class="text-2xl font-bold mb-6 text-etz-blue flex items-center">
              <span class="w-2 h-8 bg-etz-light-blue mr-3 rounded-full"></span>
              1. Algemeen
            </h2>

            <div class="space-y-4">
              <p class="text-gray-700 font-bold text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Wordt nog aangeleverd
              </p>
            </div>
          </div>
          `;
    currentHtml = algemeenIntro + newAlgemeen + currentHtml.substring(inzichtStart);
}

fs.writeFileSync('src/app/features/report-2025/report-2025.component.html', currentHtml);
console.log("Updated chapter 1 placeholder.");
