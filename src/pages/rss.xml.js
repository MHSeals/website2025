import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	var posts = await getCollection('blog');

	posts = posts.filter((post) => !post.slug.startsWith('-'));

	const postsBySlug = new Map();
	for (const post of posts) {
		const existing = postsBySlug.get(post.slug);
		if (!existing) {
			postsBySlug.set(post.slug, post);
			continue;
		}
		if (post.id.endsWith('.mdx') && !existing.id.endsWith('.mdx')) {
			postsBySlug.set(post.slug, post);
		}
	}

	posts = Array.from(postsBySlug.values());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}
