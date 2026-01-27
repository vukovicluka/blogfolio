import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog");

  return rss({
    title: "Luka Vuković",
    description: "Software Engineering Blog and Portfolio",
    site: context.site!,
    items: blog
      .sort(
        (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
      )
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: `/blog/${post.slug}/`,
      })),
  });
}
