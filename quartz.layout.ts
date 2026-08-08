import { PageLayout, SharedLayout } from "./quartz/cfg";
import * as Component from "./quartz/components";

// Home page only: auto-listed recent notes after article body.
// Replaces the manually-curated "開始閱讀" list — scales without maintenance.
// Declared before sharedPageComponents because it is referenced there (const
// is not hoisted).
const homeAfterBody = [
  Component.ConditionalRender({
    component: Component.RecentNotes({
      title: "最近更新",
      limit: 8,
      showTags: false,
      // Skip the home page itself and any folder index file
      // (slug pattern: "index" or ".../index")
      filter: (f) => {
        const slug = f.slug ?? "";
        return slug !== "index" && !slug.endsWith("/index");
      },
    }),
    condition: (page) => (page.fileData.slug ?? "") === "index",
  }),
];

// Components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  // `afterBody` belongs to SharedLayout, not PageLayout — declaring it on
  // defaultContentPageLayout type-errors (it still rendered at runtime via the
  // spread in the emitters, which is why it went unnoticed). The component is
  // ConditionalRender'd on slug === "index", so living here is still
  // home-page-only.
  afterBody: homeAfterBody,
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/cowton0627",
      Threads: "https://www.threads.net/@Cowton0627",
      "本站原始碼": "https://github.com/cowton0627/cowton0627.github.io",
    },
  }),
};

// Left rail: identity + search bar + tools + explorer
const leftSidebar = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Flex({
    components: [
      { Component: Component.Search(), grow: true },
      { Component: Component.Darkmode() },
      { Component: Component.ReaderMode() },
    ],
  }),
  Component.Explorer(),
];

const isHome = (page: { fileData: { slug?: string } }) =>
  page.fileData.slug === "index";

// Single-note pages
//
// We render the table of contents in TWO places, then control visibility
// with CSS:
//   - in beforeBody  → shown ONLY on tablet / mobile (article-top TOC card)
//   - in right rail  → shown ONLY on desktop (sticky sidebar)
// This way readers always see the TOC near the top of the article on small
// screens, and on desktop it lives in its proper sidebar.
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => !isHome(page),
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isHome(page),
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !isHome(page),
    }),
    Component.TagList(),
    Component.ConditionalRender({
      component: Component.TableOfContents(),
      condition: (page) => !isHome(page),
    }),
  ],
  left: leftSidebar,
  right: [
    Component.ConditionalRender({
      component: Component.TableOfContents(),
      condition: (page) => !isHome(page),
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => !isHome(page),
    }),
    Component.ConditionalRender({
      component: Component.Graph(),
      condition: (page) => !isHome(page),
    }),
  ],
};

// List pages (tags, folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: leftSidebar,
  right: [],
};
