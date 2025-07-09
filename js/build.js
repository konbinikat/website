const fs = require('fs');
const path = require('path');
const marked = require('marked');

const template = fs.readFileSync('template.html', 'utf-8');
const entriesDir = path.join(__dirname, '../entries');
const outputDir = path.join(__dirname, '../wiki');

fs.readdirSync(entriesDir).forEach(file => {
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(path.join(entriesDir, file), 'utf-8');
    const htmlContent = marked.parse(content);
    const finalHtml = template.replace('<!-- {{content}} -->', htmlContent);

    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(outputDir, `${baseName}.html`);
    fs.writeFileSync(outputPath, finalHtml);

    console.log(`Built ${baseName}.html`);
});
