import type { Metadata } from "next";
import HealthTipDetailPage from "./HealthArticleClient";
import {
    HEALTH_HUB_ARTICLES,
    getHealthArticleById,
    mapApiHealthTip,
    type HealthArticle,
} from "@/data/healthHubData";
import { serverGet } from "@/lib/serverApi";
import { noIndexMetadata, pageMetadata } from "@/lib/seo";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";

// Server wrapper: curated articles are pre-rendered at build time (bundled data);
// database tips are rendered on demand. The UI is the unchanged client component.
export const revalidate = 3600;

type Params = { params: { id: string } };

export function generateStaticParams() {
    return HEALTH_HUB_ARTICLES.map((a) => ({ id: a.slug }));
}

async function getArticle(id: string): Promise<HealthArticle | null> {
    const curated = getHealthArticleById(id);
    if (curated) return curated;
    const tip = await serverGet<any>(`/health-hub/${encodeURIComponent(id)}`, { revalidate });
    return tip && tip._id ? mapApiHealthTip(tip) : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const article = await getArticle(params.id);
    // Unknown id, unavailable API or a hidden draft: never indexable.
    if (!article) return noIndexMetadata("Health Hub article");
    // Drafts are never indexable, even in a draft-preview build.
    if (article.draft) return noIndexMetadata(`Draft: ${article.title}`);
    return pageMetadata({
        title: `${article.title} | Pillora`,
        description: article.description,
        // Aliases (e.g. /health-hub/tip1) canonicalise to the article's real slug
        path: `/health-hub/${article.slug}`,
        image: article.imageUrl,
        type: "article",
        publishedTime: article.date,
    });
}

export default async function HealthArticlePage({ params }: Params) {
    const article = await getArticle(params.id);
    const path = article ? `/health-hub/${article.slug}` : `/health-hub/${params.id}`;
    return (
        <>
            {article && (
                <JsonLd
                    data={[
                        articleJsonLd({
                            headline: article.title,
                            description: article.description,
                            path,
                            image: article.imageUrl,
                            datePublished: article.date,
                            authorName: article.author?.name,
                        }),
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Health Hub", path: "/health-hub" },
                            { name: article.title, path },
                        ]),
                        ...(article.faqs && article.faqs.length > 0 ? [faqJsonLd(article.faqs)] : []),
                    ]}
                />
            )}
            <HealthTipDetailPage initialArticle={article} />
        </>
    );
}
