import Fuse from "fuse.js";
import type { Lesson } from "../content/types";
import { lessons } from "../content/lessons";

const fuse = new Fuse<Lesson>(lessons, {
  keys: [
    { name: "title", weight: 2 },
    { name: "section", weight: 1 },
    { name: "body", weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export function searchLessons(query: string): Lesson[] {
  if (!query.trim()) return lessons;
  return fuse.search(query).map((r) => r.item);
}