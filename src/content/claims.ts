/**
 * ⚠️ UNVERIFIED MARKETING CLAIMS: single place to edit or remove them.
 *
 * Every statement below is shown on the site today but could not be verified
 * against real data during the SEO audit (18 Nov 2026). They are kept as-is
 * until the owner decides, so nothing on the site changes visually.
 *
 *   TODO(verify-claims): for each entry, confirm with real data, edit, or
 *   delete it (and remove its usage). Do NOT reuse these on new pages.
 */
export const UNVERIFIED_CLAIMS = {
    /** Home hero slide 1 — src/app/page.tsx */
    notificationTime: { value: '2 min', label: 'avg. notification time' },
    /** Home hero slide 2 — src/app/page.tsx */
    schemesListed: { value: '50+', label: 'schemes listed' },
    /** Home hero slide 3 — site data showed 2 doctors at audit time */
    specialistDoctors: { value: '200+', label: 'specialist doctors' },
    /** Home hero slide 4 — donor database had ~262 records at audit time */
    donorsRegistered: { value: '10+', label: 'donors registered' },
    /** Health Hub section badge — src/components/HealthHubSection.tsx (no reviewer on record) */
    doctorVerifiedBadge: 'Doctor-Verified Insights',
    /** About page meta description — superlative claim */
    aboutMetaDescription:
        "Learn about Pillora, India's leading health-tech platform dedicated to fast blood donor matching and transparent hospital information and charges.",
} as const;
