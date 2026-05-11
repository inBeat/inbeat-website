const GhostContentAPI = require("@tryghost/content-api");
const yaml = require("js-yaml");
const fs = require("fs-extra");
const path = require("path");

/**
 * Sanitize raw HTML embed blocks from Ghost.
 * Ghost sometimes truncates long embeds (e.g. Instagram/TikTok with inline SVGs),
 * leaving unclosed tags that break the rest of the page.
 * This function removes any kg-card HTML block whose tags are not properly balanced.
 */
function sanitizeHtmlEmbeds(html) {
  return html.replace(
    /<!--kg-card-begin: html-->([\s\S]*?)<!--kg-card-end: html-->/g,
    (match, inner) => {
      // Count key container tags that must be balanced
      const tags = ["blockquote", "iframe", "div", "script", "section"];
      for (const tag of tags) {
        const openCount = (inner.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []).length;
        const closeCount = (inner.match(new RegExp(`</${tag}>`, "gi")) || []).length;
        if (openCount !== closeCount) {
          console.warn(`  ⚠ Removed broken HTML embed (unclosed <${tag}>: ${openCount} open, ${closeCount} close)`);
          return "";
        }
      }
      return match;
    }
  );
}

/**
 * Force external links to open in a new tab.
 *
 * Ghost (v3 API) does not expose a per-link "open in new tab" toggle to editors,
 * so we apply the standard convention site-wide: any link pointing to a host
 * that is NOT inbeat.co / www.inbeat.co opens in a new tab with a safe `rel`.
 *
 * Rules:
 *  - Internal hosts (untouched): inbeat.co, www.inbeat.co, relative paths, anchors, mailto:, tel:.
 *  - External: add target="_blank" + rel="noopener noreferrer".
 *  - If the <a> already has an explicit `target` attribute, we respect it and skip.
 *  - If the <a> already has a `rel`, we merge (no duplicates) instead of overwriting.
 */
function openExternalLinksInNewTab(html) {
  const INTERNAL_HOSTS = new Set(["inbeat.co", "www.inbeat.co"]);

  function isExternalHref(href) {
    if (!href) return false;
    const trimmed = href.trim();
    // Skip relative paths, anchors, and non-http(s) schemes (mailto:, tel:, etc.)
    if (!/^https?:\/\//i.test(trimmed)) return false;
    try {
      const url = new URL(trimmed);
      return !INTERNAL_HOSTS.has(url.host.toLowerCase());
    } catch (e) {
      return false;
    }
  }

  function mergeRel(existingRel) {
    const required = ["noopener", "noreferrer"];
    const tokens = (existingRel || "")
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    for (const r of required) {
      if (!tokens.includes(r)) tokens.push(r);
    }
    return tokens.join(" ");
  }

  // Match opening <a ...> tags. Capture the inner attributes string.
  return html.replace(/<a\b([^>]*)>/gi, (fullMatch, attrs) => {
    const hrefMatch = attrs.match(/\shref\s*=\s*("([^"]*)"|'([^']*)')/i);
    if (!hrefMatch) return fullMatch;
    const href = hrefMatch[2] !== undefined ? hrefMatch[2] : hrefMatch[3];

    if (!isExternalHref(href)) return fullMatch;

    // Respect explicit target — don't override editor/author intent.
    if (/\starget\s*=\s*("[^"]*"|'[^']*')/i.test(attrs)) return fullMatch;

    let newAttrs = attrs + ` target="_blank"`;

    // Merge or add rel
    const relMatch = newAttrs.match(/\srel\s*=\s*("([^"]*)"|'([^']*)')/i);
    if (relMatch) {
      const existing = relMatch[2] !== undefined ? relMatch[2] : relMatch[3];
      const merged = mergeRel(existing);
      newAttrs = newAttrs.replace(relMatch[0], ` rel="${merged}"`);
    } else {
      newAttrs += ` rel="noopener noreferrer"`;
    }

    return `<a${newAttrs}>`;
  });
}


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const ghostURL = process.env.GHOST_URL;
const ghostKey = process.env.GHOST_KEY;
const api = new GhostContentAPI({
  url: ghostURL, // replace with your Ghost API URL
  key: ghostKey, // replace with your API key
  version: "v3",
});

const createMdFilesFromGhost = async () => {
  console.time("All posts converted to Markdown in");

  try {
    // fetch the posts from the Ghost Content API
    const posts = await api.posts.browse({
      limit: "all",
      include: "tags,authors",
      formats: ["html"],
      filter: [
        "tag:ambassador-marketing",
        "tag:cpg",
        "tag:influencer-marketing",
        "tag:instagram",
        "tag:micro-influencer-marketing",
        "tag:podcasts",
        "tag:social-media",
        "tag:tiktok",
        "tag:ugc",
      ],
    });

    await Promise.all(
      posts.map(async (post) => {
        let content = post.html;
        content = content.replace(
          /https:\/\/ghost.inbeat.co\/content\/images/gi,
          "https://ghost.inbeat.co/content/images/size/w1000"
        );

        // Remove broken/truncated HTML embeds (e.g. Instagram/TikTok with cut-off SVGs)
        content = sanitizeHtmlEmbeds(content);

        // Force external links to open in a new tab (Ghost v3 has no per-link toggle)
        content = openExternalLinksInNewTab(content);

        const frontmatter = {
          title: post.meta_title || post.title,
          description: post.meta_description || post.excerpt,
          titre: post.title,
          slug: post.slug,
          feature_image: post.feature_image,
          og_image: post.og_image || post.feature_image,
          lastmod: post.updated_at,
          date: post.published_at,
          summary: post.excerpt,
          i18nlanguage: "en",
          weight: post.featured ? 1 : 0,
          draft: post.visibility !== "public",
        };

        if (post.og_title) {
          frontmatter.og_title = post.og_title;
        }

        if (post.og_description) {
          frontmatter.og_description = post.og_description;
        }

        // The format of og_image is /content/images/2020/04/easily-scale-your-influencer-marketing-campaigns-social.png
        // without the root of the URL. Prepend if necessary.
        let ogImage = post.og_image || post.feature_image;
        if (!ogImage.includes("https://ghost.inbeat.co")) {
          ogImage = "https://ghost.inbeat.co" + ogImage;
        }
        frontmatter.og_image = ogImage;

        // There should be at least tag on the post.
        if (!post.tags || !post.tags.length) {
          return;
        }

        // There should be at least one author.
        if (!post.authors || !post.authors.length) {
          return;
        }

        // We only use the first tag.
        frontmatter.categories = [post.tags[0].name];

        if (post.tags[0].name == "Wikis" || post.tags[0].name == "Podcasts") {
          frontmatter.unlisted = true;
        }

        if (post.tags[0].name == "Podcasts") {
          frontmatter.unlisted = true;
          sections = content.split("<!--kg-card-end: markdown-->");
          // The markdown section should be there and at the beginning.
          if (sections.length < 2) {
            return;
          }

          // The content is after the markdown
          content = sections[1];

          // Get extrainfos from the Markdown block
          const jsonString = sections[0]
            .split("<p>")[1]
            .replace("</p>", "")
            .replace(/&quot;/g, '"');
          const extraInfos = JSON.parse(jsonString);
          frontmatter.listentime = extraInfos.time;
          post.authors[0] = {
            name: extraInfos.invitee,
            profile_image: "https://ghost.inbeat.co" + extraInfos.avatar,
          };
        }

        // Rewrite the avatar url for a small one.
        frontmatter.authors = post.authors.map((author) => ({
          ...author,
          profile_image: author.profile_image.replace(
            "content/images/",
            "content/images/size/w100/"
          ),
        }));

        // If there's a canonical url, please add it.
        if (post.canonical_url) {
          frontmatter.canonical = post.canonical_url;
        }

        // Create frontmatter properties from all keys in our post object
        const yamlPost = await yaml.dump(frontmatter);

        // Super simple concatenating of the frontmatter and our content
        const fileString = `---\n${yamlPost}\n---\n${content}\n`;

        // Save the final string of our file as a Markdown file
        await fs.writeFile(
          path.join("content/articles", `${post.slug}.md`),
          fileString,
          { flag: "w" }
        );
      })
    );

    console.timeEnd("All posts converted to Markdown in");
  } catch (error) {
    console.error(error);
  }
};

module.exports = createMdFilesFromGhost();
