// src/features/website/export.ts
//
// Renders a generated website down to a single, self-contained HTML file
// that can be uploaded to any static host. Runs entirely in the browser
// (react-dom/server's static-markup renderer works client-side too), so
// "Download Website" needs no server round-trip.

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { WebsiteContent, WebsiteThemeSpec } from "@/features/generation/types";
import { themeCssVars } from "./theme";
import WebsiteExportDocument from "./components/export/WebsiteExportDocument";

const GOOGLE_FONT_FAMILIES: Record<WebsiteThemeSpec["headingFont"] | WebsiteThemeSpec["bodyFont"], string | null> = {
  serif: "Playfair Display:wght@600;700;800",
  display: "Oswald:wght@500;600;700",
  friendly: "Poppins:wght@500;600;700",
  sans: null, // system font stack, no download needed
};

const FONT_FAMILY_CSS: Record<WebsiteThemeSpec["headingFont"] | WebsiteThemeSpec["bodyFont"], string> = {
  serif: "'Playfair Display', Georgia, serif",
  display: "'Oswald', 'Arial Narrow', sans-serif",
  friendly: "'Poppins', 'Segoe UI', sans-serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

// bodyFont only has "serif" | "sans", but "serif" body should read as Lora
// (more readable body text than a display serif), not Playfair.
const BODY_SERIF_OVERRIDE = "'Lora', Georgia, serif";
const BODY_SERIF_GOOGLE_FONT = "Lora:wght@400;500;600";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildStaticHtmlDocument(website: WebsiteContent): string {
  const theme = website.theme;

  const headingFontCss = FONT_FAMILY_CSS[theme.headingFont];
  const bodyFontCss = theme.bodyFont === "serif" ? BODY_SERIF_OVERRIDE : FONT_FAMILY_CSS[theme.bodyFont];

  const googleFontQueries = new Set<string>();
  const headingGoogleFont = GOOGLE_FONT_FAMILIES[theme.headingFont];
  if (headingGoogleFont) googleFontQueries.add(headingGoogleFont);
  if (theme.bodyFont === "serif") {
    googleFontQueries.add(BODY_SERIF_GOOGLE_FONT);
  } else {
    const bodyGoogleFont = GOOGLE_FONT_FAMILIES[theme.bodyFont];
    if (bodyGoogleFont) googleFontQueries.add(bodyGoogleFont);
  }

  const fontsHref =
    googleFontQueries.size > 0
      ? `https://fonts.googleapis.com/css2?${Array.from(googleFontQueries)
          .map((q) => `family=${q}`)
          .join("&")}&display=swap`
      : null;

  const bodyMarkup = renderToStaticMarkup(createElement(WebsiteExportDocument, { website }));

  // Reuse the app's own var mapping for colors/radius so the two stay in
  // sync; only heading/body font vars need overriding since next/font's
  // local CSS variables don't exist outside the app.
  const baseVars = themeCssVars(theme) as Record<string, string>;
  const rootVars: Record<string, string> = {
    ...baseVars,
    "--w-heading-font": headingFontCss,
    "--w-body-font": bodyFontCss,
  };
  delete rootVars.backgroundColor;
  delete rootVars.color;
  delete rootVars.fontFamily;

  const rootVarsCss = Object.entries(rootVars)
    .map(([key, value]) => `    ${key}: ${value};`)
    .join("\n");

  const title = website.seo?.title || website.title;
  const description = website.seo?.metaDescription || website.description;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:title" content="${escapeHtml(website.seo?.ogTitle || title)}" />
<meta property="og:description" content="${escapeHtml(website.seo?.ogDescription || description)}" />
${fontsHref ? `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="${fontsHref}" rel="stylesheet">` : ""}
<script src="https://cdn.tailwindcss.com"></script>
<style>
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { margin: 0; font-family: ${bodyFontCss}; overflow-wrap: break-word; }
  button:not(:disabled) { cursor: pointer; }
  section[id] { scroll-margin-top: 5rem; }
  details > summary::-webkit-details-marker { display: none; }
  :root {
${rootVarsCss}
  }
</style>
</head>
<body>
${bodyMarkup}
<p style="text-align:center;font-size:12px;color:#9ca3af;padding:16px;">
  Built with AI Business Launcher
</p>
</body>
</html>`;
}
