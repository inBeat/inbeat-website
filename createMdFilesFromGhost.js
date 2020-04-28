const GhostContentAPI = require('@tryghost/content-api');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

const api = new GhostContentAPI({
    url: 'https://ghost.inbeat.co', // replace with your Ghost API URL
    key: 'ca9f5fd6fb342409d56eea20d4', // replace with your API key
    version: "v3"
});

const createMdFilesFromGhost = async () => {

    console.time('All posts converted to Markdown in');

    try {
        // fetch the posts from the Ghost Content API
        const posts = await api.posts.browse({
            limit: 'all',
            include: 'tags,authors',
            formats: ['html'],
        });

        await Promise.all(posts.map(async (post) => {
            let content = post.html;
            content = content.replace(
                /https:\/\/ghost.inbeat.co\/content\/images/gi,
                'https://ghost.inbeat.co/content/images/size/w1000'
            );
            // content = content.replace(/<p>{{% protip title=&quot;/gi, '{{% protip title="');
            // content = content.replace(/&quot; %}}<\/p>/gi, '" %}}');
            // content = content.replace('<p>{{% /protip %}}</p>', '{{% /protip %}}');

            const frontmatter = {
                title: post.meta_title || post.title,
                description: post.meta_description || post.excerpt,
                titre: post.title,
                slug: post.slug,
                feature_image: post.feature_image,
                lastmod: post.updated_at,
                date: post.published_at,
                summary: post.excerpt,
                i18nlanguage: 'en',
                weight: post.featured ? 1 : 0,
                draft: post.visibility !== 'public',
            };

            if (post.og_title) {
                frontmatter.og_title = post.og_title
            }

            if (post.og_description) {
                frontmatter.og_description = post.og_description
            }

            // There should be at least tag on the post.
            if (!post.tags || !post.tags.length) {
                return;
            }

            // We only use the first tag.
            frontmatter.categories = [post.tags[0].name];

            // There should be at least one author.
            if (!post.authors || !post.authors.length) {
                return;
            }

            // Rewrite the avatar url for a small one.
            frontmatter.authors = post.authors.map((author) => ({ 
                ...author,
                profile_image: author.profile_image.replace('content/images/', 'content/images/size/w100/'),
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
            await fs.writeFile(path.join('content/articles', `${post.slug}.md`), fileString, { flag: 'w' });
        }));

    console.timeEnd('All posts converted to Markdown in');

    } catch (error) {
        console.error(error);
    }
};

module.exports = createMdFilesFromGhost();