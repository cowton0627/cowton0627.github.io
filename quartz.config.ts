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
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        // Apple-clean neutrals + Linear-style indigo accent
        lightMode: {
          light: "#ffffff",
          lightgray: "#e8e8ec",
          gray: "#86868b",
          darkgray: "#3a3a3c",
          dark: "#1d1d1f",
          secondary: "#5e6ad2",
          tertiary: "#8b95e8",
          highlight: "rgba(94, 106, 210, 0.08)",
          textHighlight: "rgba(255, 220, 100, 0.40)",
        },
        darkMode: {
          light: "#0a0a0b",
          lightgray: "#26262a",
          gray: "#6e6e76",
          darkgray: "#c8c8cc",
          dark: "#f5f5f7",
          secondary: "#a5b4fc",
          tertiary: "#818cf8",
          highlight: "rgba(165, 180, 252, 0.10)",
          textHighlight: "rgba(165, 180, 252, 0.20)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
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
