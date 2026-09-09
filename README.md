# Heather's portfolio

A static Astro portfolio with content in YAML and Markdown. No database or CMS is required.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

Open the local URL printed by Astro. Saved content and style changes appear in the preview.

## Update the profile

Edit `src/content/profile.yaml` to change the name, headline, introduction, contact links, education, certifications, experience, and skills. Keep the field names and YAML indentation. Quote values containing a colon followed by a space.

Replace `public/Heather_Schoonmaker_Resume.pdf` to update the download. The PDF is separate from the website content. Updating either one does not update the other.

## Add or edit a project

Edit a file in `src/content/projects/`, or copy an existing file to add another project. Use a unique filename ending in `.md`.

The block between `---` markers controls the project heading. Write the contribution list below it in Markdown. Use `###` for headings inside a project.

- Set `featured: false` to hide a project.
- Change `order` to move it. Lower numbers appear first.
- Add `repository` or `demo` with an HTTPS URL to show a link. Omit the field when no link is available.
- Add a screenshot in `public/images/`, then add the following fields. Omit `image` when no screenshot is available.

```yaml
image:
  src: /images/floradora.webp
  alt: Describe what the real screenshot shows.
```

Screenshots keep their natural aspect ratio. Use a compressed image with readable interface text. The initial site contains no invented app screenshots or unverified project links.

## Change the design

Edit `src/styles/theme.css` to change colors, fonts, page width, spacing, and corner radius. Fonts use system families by default, so no external font request is needed.

Edit `src/styles/global.css` for section styling and responsive rules. Edit `src/pages/index.astro` to change section layout or interface labels. The project layout lives in `src/components/Project.astro`.

The homepage shows all featured projects. There are no individual project routes yet.

## Verify an update

```sh
npm run verify
```

Astro validates required content fields during the build. The verification script checks the generated page against the profile and featured projects, checks section links and local files, and verifies the PDF download. It also checks that the page contains no client scripts.

On September 9, 2026, the dependency audit reported four advisories: Astro was marked critical, and js-yaml, sharp, and svgo were marked high. Astro 7.2.0 is the newest stable release allowed by this environment's 30-day minimum package age. The patched Astro 7.2.8 and newer releases are still inside that waiting period. Recheck with `npm audit` and update dependencies when permitted. The deployed output contains only static HTML, CSS, and the resume PDF; it runs no Astro server or image optimization service.

For layout changes, inspect the page at desktop and mobile widths and navigate the links with a keyboard. Automated checks do not replace visual review.

## Deploy

```sh
npm run build
```

Deploy the `dist/` folder to a static host. No server adapter is needed. Set `site` in `astro.config.mjs` to the final origin when changing hosts or domains. The Sites project configuration is in `.openai/hosting.json`.
