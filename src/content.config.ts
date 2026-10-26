import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const text = z.string().min(1);
const webLink = z.string().url().refine((value) => value.startsWith('https://'), 'Use an https:// URL');
const asset = z.string().regex(/^\/(?!\/)[^?#]+$/, 'Use a path starting with one /');

const profile = defineCollection({
  loader: glob({ pattern: 'profile.yaml', base: './src/content' }),
  schema: z.object({
    name: text, initials: text, introduction: text,
    email: z.string().email(), github: webLink, linkedin: webLink, blog: webLink.optional(), resume: asset,
    about: text,
    education: z.object({ school: text, degree: text, dates: text, graduation: text, gpa: text }),
    certifications: z.array(z.object({ name: text, issuer: text, date: text })),
    experience: z.array(z.object({ role: text, company: text, location: text, dates: text, description: text, contributions: z.array(text) })),
    skills: z.array(z.object({ category: text, items: z.array(text) })),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: text, category: text, summary: text, dates: text.optional(),
    technologies: z.array(text).min(1),
    featured: z.boolean().default(true), order: z.number().int().default(100),
    image: z.object({ src: asset, alt: text }).optional(),
    repository: webLink.optional(), demo: webLink.optional(),
  }),
});

export const collections = { profile, projects };
