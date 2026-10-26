import { mkdir, writeFile } from 'node:fs/promises';

// Layout samples only. These are intentionally not mock application screenshots.
// Backgrounds are lighter versions of each project's tile color in theme.css.
const projects = [
  { slug: 'floradora', title: 'Floradora', background: '#ffedf1' },
  { slug: 'fastapi-blog', title: 'FastAPI Blog', background: '#fff8d6' },
  { slug: 'car-parts', title: 'Car Parts Ordering Site', background: '#e7f7ee' },
  { slug: 'vesta', title: 'VESTA', background: '#ebf3ff' },
];
const ink = '#55556e';
const directory = new URL('../public/images/', import.meta.url);
await mkdir(directory, { recursive: true });
for (const { slug, title, background } of projects) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="625" viewBox="0 0 1000 625">
  <title>${title} image placeholder</title>
  <rect width="1000" height="625" fill="${background}"/>
  <rect x="38" y="38" width="924" height="549" rx="14" fill="none" stroke="${ink}" stroke-opacity=".25" stroke-dasharray="8 10"/>
  <g fill="${ink}" text-anchor="middle" font-family="Consolas, 'Courier New', monospace">
    <text x="500" y="250" font-size="20" letter-spacing="4">[ PROJECT PREVIEW ]</text>
    <text x="500" y="330" font-size="52" font-weight="bold">${title}</text>
    <text x="500" y="390" font-size="22">// screenshot placeholder</text>
    <text x="500" y="548" font-size="18" letter-spacing="2">16:10</text>
  </g>
</svg>\n`;
  await writeFile(new URL(`${slug}-placeholder.svg`, directory), svg);
}
console.log(`Generated ${projects.length} project placeholders.`);
