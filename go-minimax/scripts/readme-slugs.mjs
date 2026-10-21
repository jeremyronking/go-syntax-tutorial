/**
 * Regenerates the lesson index in README.md from the manifest.
 *
 *   pnpm readme:slugs
 *
 * The table is written between the `<!-- BEGIN SLUG TABLE -->` and
 * `<!-- END SLUG TABLE -->` markers. Everything outside them is left
 * alone, so the rest of the README can be edited by hand.
 *
 * The manifest and the section list are imported rather than parsed, so
 * the README can never drift from the source of truth. Node strips the
 * TypeScript types itself; the manifest has no runtime dependencies.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readmePath = resolve(root, 'README.md');

const { lessonManifest } = await import(
  pathToFileURL(resolve(root, 'src/content/manifest.ts')).href
);
const { sections } = await import(
  pathToFileURL(resolve(root, 'src/content/sections.ts')).href
);

if (!Array.isArray(lessonManifest) || lessonManifest.length === 0) {
  throw new Error('the manifest is empty — has its shape changed?');
}

const lines = [];
for (const section of sections) {
  const mine = lessonManifest.filter((l) => l.sectionId === section.id);
  if (mine.length === 0) continue;
  lines.push(`### ${section.letter} · ${section.title} (${mine.length})`, '');
  lines.push('| # | Slug | Title |', '|---|---|---|');
  for (const lesson of mine) {
    lines.push(
      `| ${lesson.order} | \`${lesson.slug}\` | ${lesson.title.replace(/\|/g, '\\|')} |`
    );
  }
  lines.push('');
}

const table = lines.join('\n').trimEnd();

const readme = readFileSync(readmePath, 'utf8');
const begin = '<!-- BEGIN SLUG TABLE -->';
const end = '<!-- END SLUG TABLE -->';
const start = readme.indexOf(begin);
const stop = readme.indexOf(end);
if (start < 0 || stop < 0) {
  throw new Error('README.md is missing the slug-table markers');
}

const next =
  readme.slice(0, start + begin.length) + '\n\n' + table + '\n\n' + readme.slice(stop);
writeFileSync(readmePath, next);

console.log(
  `wrote ${lessonManifest.length} lessons across ${sections.length} sections into README.md`
);
