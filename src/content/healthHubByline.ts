import type { AuthorInfo } from '@/data/healthHubData';

/**
 * Neutral byline for Health Hub articles that have no confirmed author.
 * Owner decision (19 Nov 2026): the earlier named doctor bylines, credentials
 * and stock-photo avatars could not be confirmed and were removed.
 *
 * TODO(real-authors): to credit a genuine author, replace `author` on that
 * article with { name, role, credentials?, avatar? } (a real photo, used with
 * the person's written consent). A medical review is recorded separately in
 * `reviewedBy`; never put review claims in the author fields.
 */
export const HEALTH_HUB_BYLINE: AuthorInfo = {
    name: 'Pillora Health Hub',
    role: 'Health information',
};
