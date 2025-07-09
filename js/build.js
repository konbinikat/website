const fs = require('fs');
const path = require('path');
const marked = require('marked');

const entriesDir = path.join(__dirname, '../entries');
const pagesDir = path.join(__dirname, '../pages');
const outputWikiDir = path.join(__dirname, '../wiki');
const outputPagesDir = path.join(__dirname, '../');

const nav = fs.readFileSync(path.join(__dirname, '../partials/nav.html'), 'utf-8');
const footer = fs.readFileSync(path.join(__dirname, '../partials/footer.html'), 'utf-8');

if (!fs.existsSync(outputWikiDir)) fs.mkdirSync(outputWikiDir, { recursive: true });
if (!fs.existsSync(outputPagesDir)) fs.mkdirSync(outputPagesDir, { recursive: true });

const renderer = new marked.Renderer();
renderer.image = (token) => {
    return `<img src="${token.href}" alt="${token.text}" class="my-resize-class">`;
};

fs.readdirSync(entriesDir).forEach(file => {
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(path.join(entriesDir, file), 'utf-8');
    const htmlContent = marked.parse(content, { renderer });

    const template = fs.readFileSync(path.join(__dirname, '../pages/template.html'), 'utf-8');

    const finalHtml = template
        .replace('<!-- {{nav}} -->', nav)
        .replace('<!-- {{footer}} -->', footer)
        .replace('<!-- {{content}} -->', htmlContent);

    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(outputWikiDir, `${baseName}.html`);
    fs.writeFileSync(outputPath, finalHtml);

    console.log(`DONE // built entry: wiki/${baseName}.html`);
});

fs.readdirSync(pagesDir).forEach(file => {
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
    const htmlContent = marked.parse(content, { renderer });

    const template = fs.readFileSync(path.join(__dirname, '../pages/template.html'), 'utf-8');

    const finalHtml = template
        .replace('<!-- {{nav}} -->', nav)
        .replace('<!-- {{footer}} -->', footer)
        .replace('<!-- {{content}} -->', htmlContent);

    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(outputPagesDir, `${baseName}.html`);
    fs.writeFileSync(outputPath, finalHtml);

    console.log(`DONE // built page: pages/${baseName}.html`);
});
