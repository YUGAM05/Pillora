import type { Metadata } from 'next';

/**
 * Central SEO configuration for www.pillora.in (patient site).
 * Every public route builds its <head> through pageMetadata() so titles,
 * descriptions, canonicals and social cards stay consistent.
 */
export const SITE = {
    name: 'Pillora',
    url: 'https://www.pillora.in',
    hospitalSiteUrl: 'https://www.pillorahospital.in',
    locale: 'en_IN',
    phone: '+91-9429167856',
    logo: '/logo-sm.png',
    // 1200×630 share image generated from the existing logo files
    ogImage: '/og/pillora-share.png',
    // Taken from the links already in the site footer
    sameAs: [
        'https://www.facebook.com/share/1LPeKutMEw/',
        'https://www.instagram.com/pillora_official?igsh=MnBpemU0MW40bW5m',
    ],
} as const;

export const absoluteUrl = (path = '/'): string => {
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path === '/' ? '' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
    return `${SITE.url}${clean}`;
};

/** Trim to a length on a word boundary (titles ≤60, descriptions ≈155). */
export const clamp = (text: string, max: number): string => {
    const t = (text || '').replace(/\s+/g, ' ').trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max - 1);
    return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).replace(/[,;:.\-–|]+$/, '')}…`;
};

interface PageMetaInput {
    /** Full title as it should appear in the browser tab (≤60 chars). */
    title: string;
    description: string;
    /** Path on www.pillora.in, e.g. "/blood-bank". Used for canonical + og:url. */
    path: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
}

/** Metadata for an indexable public page: self-canonical + OG + Twitter. */
export function pageMetadata({ title, description, path, image, type = 'website', publishedTime, modifiedTime }: PageMetaInput): Metadata {
    const fullTitle = clamp(title, 60);
    const desc = clamp(description, 158);
    const url = absoluteUrl(path);
    const img = absoluteUrl(image || SITE.ogImage);
    return {
        title: { absolute: fullTitle },
        description: desc,
        alternates: { canonical: url },
        openGraph: {
            title: fullTitle,
            description: desc,
            url,
            siteName: SITE.name,
            locale: SITE.locale,
            type,
            images: [{ url: img, width: 1200, height: 630, alt: fullTitle }],
            ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: desc,
            images: [img],
        },
    };
}

/** Metadata for private / utility pages: never indexed, never in the sitemap. */
export const noIndexMetadata = (title: string): Metadata => ({
    title: { absolute: `${title} | ${SITE.name}` },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
});

/** Routes that must stay out of search results and the sitemap. */
export const PRIVATE_ROUTE_PATTERNS = [
    '/login', '/register', '/forgot-password', '/reset-password', '/auth/*',
    '/dashboard', '/cart', '/checkout', '/checkout/*', '/my-orders', '/my-orders/*',
    '/my-blood-requests', '/my-donor-profile', '/order/*', '/order-success/*',
    '/upload-prescription', '/hospital/*', '/products/*', '/lab-tests', '/safety-checker', '/api/*',
];
