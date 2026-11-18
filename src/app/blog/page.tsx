import type { Metadata } from "next";
import BlogPage, { type BlogSummary } from "./BlogIndexClient";
import { serverGet } from "@/lib/serverApi";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

// Server wrapper: post titles and links are in the initial HTML (crawlable).
// Falls back to the client-side fetch if the API is unavailable.
export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
    title: "Pillora Blog: Blood Donation & Hospital Guides",
    description:
        "Practical guides on blood donation, emergency blood requests, hospital charges, patient rights and government health schemes in India.",
    path: "/blog",
});

export default async function BlogIndexPage() {
    const blogs = await serverGet<BlogSummary[]>("/blogs", { revalidate });
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
            <BlogPage initialBlogs={Array.isArray(blogs) ? blogs : null} />
        </>
    );
}
