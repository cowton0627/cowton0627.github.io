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
        // Sunset Boulevard theme (theme-factory) — warm cream canvas,
        // deep purple ink, burnt orange + coral accents. Editorial,
        // golden-hour energy. Pairs with Source Serif 4 headers.
        lightMode: {
          light: "#fdf6e9", // warm cream canvas
          lightgray: "#f0e3c2", // sand-tinted border
          gray: "#6a7a82", // muted purple-gray secondary text
          darkgray: "#264653", // deep purple body text
          dark: "#264653", // deep purple titles
          secondary: "#e76f51", // burnt orange — primary accent (links, focus rings, hover)
          tertiary: "#f4a261", // coral — secondary accent
          highlight: "rgba(231, 111, 81, 0.10)",
          textHighlight: "rgba(244, 162, 97, 0.40)",
        },
        darkMode: {
          light: "#1a2326", // dark purple-navy canvas
          lightgray: "#264653", // deep purple elevated
          gray: "#6a7a82", // muted secondary
          darkgray: "#f4a261", // coral on dark for body legibility
          dark: "#fef5e7", // cream titles
          secondary: "#e76f51", // burnt orange
          tertiary: "#f4a261", // coral
          highlight: "rgba(244, 162, 97, 0.10)",
          textHighlight: "rgba(244, 162, 97, 0.20)",
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
