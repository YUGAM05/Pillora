import { serverGet } from "@/lib/serverApi";

/** Aggregate donor counts per city from GET /api/blood-bank/stats/cities (counts only). */
export interface CityDonorStats {
    city: string;
    slug: string;
    donors: number;
    available: number;
    updatedAt?: string;
    /** Present only for cities at or above the threshold */
    byBloodGroup?: Record<string, number>;
}

/** A city page is listed (and may be indexed) only with at least this many registered donors. */
export const MIN_DONORS_FOR_CITY_PAGE = 10;

/**
 * TODO(confirm-donor-data): set to true only after the owner confirms the city
 * counts include ONLY active registered donors (no test, seed, deleted or
 * blocked records).
 *
 * Audit (19 Nov 2026): the count is every BloodDonor document grouped by
 * lower-cased, trimmed city. The model has no active/blocked/deleted state
 * (deletes are hard deletes; isAvailable defaults to true and is admin-only).
 * All 261 Surendranagar records came from one bulk Google Form import on
 * 2026-06-30, are not linked to a Pillora account and have not been updated
 * since, so "active" cannot be confirmed. Until confirmed, every city page is
 * noindex and out of the sitemap.
 */
export const CITY_COUNTS_CONFIRMED = false;

export const BLOOD_GROUP_ORDER = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export async function getCityDonorStats(): Promise<CityDonorStats[]> {
    const data = await serverGet<CityDonorStats[]>("/blood-bank/stats/cities", { revalidate: 3600, timeoutMs: 8000 });
    return Array.isArray(data) ? data.filter((c) => c && c.slug && c.donors > 0) : [];
}

/** Enough registered donors to list the city and show the blood-group breakdown. */
export const meetsThreshold = (c: CityDonorStats) => c.donors >= MIN_DONORS_FOR_CITY_PAGE;

/** Indexable only when the threshold is met AND the owner has confirmed the data. */
export const qualifies = (c: CityDonorStats) => CITY_COUNTS_CONFIRMED && meetsThreshold(c);
