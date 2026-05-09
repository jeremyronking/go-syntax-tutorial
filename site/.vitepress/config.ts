import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'GoTour',
  description: 'One Go-tutorial spec, three AI implementations.',
  cleanUrls: true,
  appearance: 'dark',

  // Allow @include to reach files outside site/ (the spec lives in go-glm/specs/).
  vite: {
    server: {
      fs: { allow: ['..'] },
    },
  },

  themeConfig: {
    siteTitle: 'GoTour',

    nav: [
      { text: 'Prompt', link: '/prompt' },
      { text: 'Spec', link: '/spec' },
      { text: 'Issues', link: '/issues/epic' },
      { text: 'Source', link: 'https://github.com/jeremyronking/go-syntax-tutorial' },
    ],

    sidebar: [
      {
        text: 'The experiment',
        items: [
          { text: 'Home', link: '/' },
          { text: 'The prompt', link: '/prompt' },
          { text: 'The spec', link: '/spec' },
        ],
      },
      {
        text: 'Implementations',
        items: [
          { text: 'go-claude', link: 'https://go-claude.jking.ai' },
          { text: 'go-gemini', link: 'https://go-gemini.jking.ai' },
          { text: 'go-glm', link: 'https://go-glm.jking.ai' },
        ],
      },
      {
        text: 'Issues',
        collapsed: false,
        items: [
          { text: 'Epic', link: '/issues/epic' },
          { text: 'Phase 01 — Project scaffold', link: '/issues/phase-01-project-scaffold' },
          { text: 'Phase 02 — Playground proxy', link: '/issues/phase-02-playground-proxy' },
          { text: 'Phase 03 — Layout & routing', link: '/issues/phase-03-layout-routing' },
          { text: 'Phase 04 — Lesson framework', link: '/issues/phase-04-lesson-framework' },
          { text: 'Phase 05 — Code runner', link: '/issues/phase-05-code-runner' },
          { text: 'Phase 06 — Terminal pane', link: '/issues/phase-06-terminal-pane' },
          { text: 'Phase 07 — Persistence', link: '/issues/phase-07-persistence' },
          { text: 'Phase 08 — Sidebar', link: '/issues/phase-08-sidebar' },
          { text: 'Phase 09 — Search palette', link: '/issues/phase-09-search-palette' },
          { text: 'Phase 10 — Checkpoint framework', link: '/issues/phase-10-checkpoint-framework' },
          { text: 'Phase 11 — Content A/B', link: '/issues/phase-11-content-a-b' },
          { text: 'Phase 12 — Content C/D', link: '/issues/phase-12-content-c-d' },
          { text: 'Phase 13 — Content E/F/G', link: '/issues/phase-13-content-e-f-g' },
          { text: 'Phase 14 — Concurrency content', link: '/issues/phase-14-content-h-concurrency' },
          { text: 'Phase 15 — Content I/J', link: '/issues/phase-15-content-i-j' },
          { text: 'Phase 16 — Toolchain 1', link: '/issues/phase-16-toolchain-1' },
          { text: 'Phase 17 — Toolchain 2', link: '/issues/phase-17-toolchain-2' },
          { text: 'Phase 18 — Toolchain 3', link: '/issues/phase-18-toolchain-3' },
          { text: 'Phase 19 — Polish', link: '/issues/phase-19-polish' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jeremyronking/go-syntax-tutorial' },
    ],

    footer: {
      message: 'Built as an experiment in three-model parity.',
      copyright: 'Source on <a href="https://github.com/jeremyronking/go-syntax-tutorial">GitHub</a>.',
    },

    search: { provider: 'local' },
  },
})
