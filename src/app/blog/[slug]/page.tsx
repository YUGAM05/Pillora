import type { Metadata } from "next";
import BlogPostDetail, { type Blog } from "./BlogPostClient";
import { serverGet } from "@/lib/serverApi";
import { clamp, pageMetadata } from "@/lib/seo";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

// Server wrapper: renders the post's title, H1 and body in the initial HTML so
// search engines can read it. The UI is the unchanged client component.
export const revalidate = 3600;

type Params = { params: { slug: string } };

const getBlog = (slug: string) => serverGet<Blog>(`/blogs/${encodeURIComponent(slug)}`, { revalidate });

const plainText = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const blog = await getBlog(params.slug);
    const path = `/blog/${params.slug}`;
    if (!blog) {
        // Fetch failed: still self-canonical, generic copy (never the homepage canonical).
        return pageMetadata({
            title: "Pillora Blog",
            description: "Guides on blood donation, hospital charges and government health schemes in India from Pillora.",
            path,
            type: "article",
        });
    }
    return pageMetadata({
        title: `${blog.title} | Pillora`,
        description: blog.description || clamp(plainText(blog.content), 155),
        path: `/blog/${blog.slug || params.slug}`,
        image: blog.imageUrl,
        type: "article",
        publishedTime: blog.date,
    });
}

export default async function BlogPostPage({ params }: Params) {
    const blog = await getBlog(params.slug);
    const path = `/blog/${blog?.slug || params.slug}`;
    return (
        <>
            {blog && (
                <JsonLd
                    data={[
                        articleJsonLd({
                            headline: blog.title,
                            description: blog.description || clamp(plainText(blog.content), 155),
                            path,
                            image: blog.imageUrl,
                            datePublished: blog.date,
                            authorName: blog.author,
                        }),
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Blog", path: "/blog" },
                            { name: blog.title, path },
                        ]),
                    ]}
                />
            )}
            <BlogPostDetail initialBlog={blog} />
        </>
    );
}
