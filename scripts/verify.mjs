import { readFile, readdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'yaml';

const root = process.cwd();
const html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const profile = parse(await readFile(resolve(root, 'src/content/profile.yaml'), 'utf8'));
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
for (const value of [profile.name, profile.headline, profile.introduction, profile.email, profile.education.school]) {
  assert(html.includes(escape(value)), `Missing profile content: ${value}`);
}
const projects = [];
if (profile.blog) {
  const navigation = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert(navigation.includes(`href="${escape(profile.blog)}"`), 'Blog link is missing from the header');
}
for (const file of await readdir(resolve(root, 'src/content/projects'), { recursive: true })) {
  if (!file.endsWith('.md')) continue;
  const source = await readFile(resolve(root, 'src/content/projects', file), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(frontmatter, `Missing frontmatter: ${file}`);
  const project = parse(frontmatter[1]);
  if (project.featured !== false) projects.push(project);
}
for (const project of projects) {
  assert(html.includes(escape(project.title)), `Missing project: ${project.title}`);
  assert(html.includes(escape(project.summary)), `Missing summary: ${project.title}`);
  for (const technology of project.technologies) assert(html.includes(escape(technology)), `Missing technology: ${technology}`);
  if (project.image) assert(html.includes(escape(project.image.alt)), `Missing image alt: ${project.title}`);
  for (const url of [project.repository, project.demo].filter(Boolean)) {
    assert(html.includes(`href="${escape(url)}"`), `Missing project link: ${url}`);
  }
}
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Expected one main heading');
assert.equal((html.match(/<article class="project"/g) ?? []).length, projects.length, 'Featured project count differs');
for (const [, fragment] of html.matchAll(/href="#([^"\s]+)"/g)) {
  assert(html.includes(`id="${fragment}"`), `Broken section link: ${fragment}`);
}
for (const [, path] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)"/g)) {
  await access(resolve(root, 'dist', path.slice(1)));
}
const pdf = await readFile(resolve(root, 'dist', profile.resume.slice(1)));
assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', 'Resume download is not a PDF');
assert(!/<script\b/.test(html), 'This static portfolio should not ship JavaScript');
console.log(`Verified profile content, ${projects.length} projects, section links, local assets, resume PDF, and zero client scripts.`);
