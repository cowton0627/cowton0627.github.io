import { QuartzConfig } from "./quartz/cfg";
import * as Plugin from "./quartz/plugins";

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "春麗知識庫",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "goatcounter",
      websiteId: "cowton0517",
    },
    locale: "zh-TW",
    baseUrl: "cowton0627.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        // Editorial serif headers (Forest Canopy theme), humanist sans body
        header: "Source Serif 4",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        // Forest Canopy theme (theme-factory) — ivory canvas, forest green
        // ink, sage / olive accents. Long-read friendly editorial palette.
        lightMode: {
          light: "#faf9f6", // ivory canvas
          lightgray: "#dcded0", // soft olive border
          gray: "#7d8471", // sage muted text
          darkgray: "#3a3f33", // deep olive-black body text
          dark: "#2d4a2b", // forest green titles
          secondary: "#2d4a2b", // forest green links (editorial style: underline, not hue, distinguishes)
          tertiary: "#a4ac86", // olive accent
          highlight: "rgba(125, 132, 113, 0.10)",
          textHighlight: "rgba(164, 172, 134, 0.35)",
        },
        darkMode: {
          light: "#1a261a", // deep forest
          lightgray: "#2d4a2b", // forest green elevated
          gray: "#7d8471", // sage
          darkgray: "#c4c8b8", // light olive body
          dark: "#faf9f6", // ivory titles
          secondary: "#a4ac86", // olive — brighter for dark-mode legibility
          tertiary: "#7d8471", // sage
          highlight: "rgba(164, 172, 134, 0.10)",
          textHighlight: "rgba(164, 172, 134, 0.18)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        // git BEFORE frontmatter so `modified` always tracks the latest
        // commit. Quartz's frontmatter transformer auto-sets
        // data.modified := created when `modified:` is omitted; if
        // frontmatter ran first, that auto-set value would short-circuit
        // git's lookup, freezing `modified` to the publish date.
        // `created` still comes from frontmatter (git doesn't supply it).
        priority: ["git", "frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
};

export default config;
