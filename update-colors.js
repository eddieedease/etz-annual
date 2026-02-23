const fs = require('fs');

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // charts
    content = content.replace(/#3b82f6/g, '#01273E'); // etz-blue
    content = content.replace(/#f97316/g, '#41B8EE'); // etz-light-blue
    content = content.replace(/#d1d5db/g, '#95C11F'); // etz-green

    // tailwind bg classes for charts/legends
    content = content.replace(/bg-blue-500/g, 'bg-etz-blue');
    content = content.replace(/bg-orange-500/g, 'bg-etz-light-blue');
    content = content.replace(/bg-gray-300 mr-2/g, 'bg-etz-green mr-2');

    // tailwind classes for tables and UI
    content = content.replace(/bg-blue-400/g, 'bg-etz-light-blue');
    content = content.replace(/border-blue-200/g, 'border-etz-light-blue');

    // Some small specific fixes, bg-blue-50 -> bg-slate-50 could be done, 
    // but the light blue tint is probably fine as is, or we can leave it.

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
}

updateFile('src/app/features/report-2025/report-2025.component.html');
updateFile('src/app/features/report-2024/report-2024.component.html');
