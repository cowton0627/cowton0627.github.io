import { PageLayout, SharedLayout } from "./quartz/cfg";
import * as Component from "./quartz/components";

// Components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      Obsidian: "https://obsidian.md",
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
