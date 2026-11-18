import { SITE, absoluteUrl } from './seo';

/**
 * JSON-LD helpers. Only verified facts are used: no ratings, reviews,
 * prices, customer counts or awards.
 */

/** Renders a JSON-LD <script>. `<` is escaped so content can never break out of the tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}

export const organizationJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    description:
        'Pillora is a healthcare technology platform in India that helps patients and families find registered blood donors, request blood, and look up hospital information, doctor availability, consultation fees and government health schemes.',
    sameAs: [...SITE.sameAs, SITE.hospitalSiteUrl],
    contactPoint: [
        {
            '@type': 'ContactPoint',
            telephone: SITE.phone,
            contactType: 'customer support',
            areaServed: 'IN',
            availableLanguage: ['en'],
        },
    ],
    areaServed: { '@type': 'Country', name: 'India' },
});

export const websiteJsonLd = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE.url}/#organization` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: absoluteUrl(item.path),
    })),
});

interface ArticleInput {
    headline: string;
    description: string;
    path: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    authorName?: string;
}

/** BlogPosting for blog posts and Health Hub articles. Reviewer data is a TODO until supplied. */
export const articleJsonLd = ({ headline, description, path, image, datePublished, dateModified, authorName }: ArticleInput) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: headline.slice(0, 110),
    description,
    mainEntityOfPage: absoluteUrl(path),
    url: absoluteUrl(path),
    image: [absoluteUrl(image || SITE.ogImage)],
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified || datePublished ? { dateModified: dateModified || datePublished } : {}),
    // TODO(seo-reviewer): add `reviewedBy` (name, credentials) once a medical reviewer is confirmed.
    author: authorName
        ? { '@type': 'Person', name: authorName }
        : { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: {
        '@type': 'Organization',
        name: SITE.name,
        logo: { '@type': 'ImageObject', url: absoluteUrl(SITE.logo) },
    },
    inLanguage: 'en-IN',
});

export const faqJsonLd = (faqs: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
});
