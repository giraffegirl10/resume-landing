import { mkdir, writeFile } from 'node:fs/promises';

// Layout samples only. These are intentionally not mock application screenshots.
const projects = [
  { slug: 'floradora', title: 'Floradora', background: '#dce5cd', ink: '#294936' },
  { slug: 'vesta', title: 'VESTA', background: '#d8e2e4', ink: '#2c4850' },
  { slug: 'fastapi-blog', title: 'FastAPI Blog', background: '#e6dfcf', ink: '#554a32' },
];
const directory = new URL('../public/images/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const { slug, title, background, ink } of projects) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="625" viewBox="0 0 1000 625">
  <title>${title} image placeholder</title>
  <rect width="1000" height="625" fill="${background}"/>
  <rect x="38" y="38" width="924" height="549" rx="5" fill="none" stroke="${ink}" stroke-opacity=".25" stroke-dasharray="8 10"/>
  <g fill="${ink}" text-anchor="middle">
    <text x="500" y="245" font-family="Arial, sans-serif" font-size="20" letter-spacing="5">PROJECT PREVIEW</text>
    <text x="500" y="330" font-family="Georgia, serif" font-size="64">${title}</text>
    <text x="500" y="393" font-family="Arial, sans-serif" font-size="23">Screenshot placeholder</text>
    <text x="500" y="548" font-family="Arial, sans-serif" font-size="18" letter-spacing="2">16:10</text>
  </g>
</svg>\n`;
  await writeFile(new URL(`${slug}-placeholder.svg`, directory), svg);
}
console.log(`Generated ${projects.length} project placeholders.`);
