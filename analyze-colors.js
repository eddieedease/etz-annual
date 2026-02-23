const fs = require('fs');
const content = fs.readFileSync('src/app/features/report-2025/report-2025.component.html', 'utf8');

const regexes = [
    /bg-[a-z]+-[0-9]+/g,
    /text-[a-z]+-[0-9]+/g,
    /border-[a-z]+-[0-9]+/g,
    /#[0-9a-fA-F]{6}/g
];

let counts = {};
regexes.forEach(re => {
    let match;
    while ((match = re.exec(content)) !== null) {
        counts[match[0]] = (counts[match[0]] || 0) + 1;
    }
});
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log("Colors used in report-2025.component.html:");
sorted.forEach(([color, count]) => console.log(`${color}: ${count}`));
