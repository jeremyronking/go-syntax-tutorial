import Fuse from 'fuse.js';
import { lessons } from '../content/lessons';

export const fuse = new Fuse(lessons, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'section', weight: 0.2 },
    { name: 'body', weight: 0.3 },
  ],
  threshold: 0.4,
  includeMatches: true,
});
