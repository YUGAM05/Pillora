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

/** A city page is indexable and listed only with at least this many registered donors. */
export const MIN_DONORS_FOR_CITY_PAGE = 10;

export const BLOOD_GROUP_ORDER = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export async function getCityDonorStats(): Promise<CityDonorStats[]> {
    const data = await serverGet<CityDonorStats[]>("/blood-bank/stats/cities", { revalidate: 3600, timeoutMs: 8000 });
    return Array.isArray(data) ? data.filter((c) => c && c.slug && c.donors > 0) : [];
}

export const qualifies = (c: CityDonorStats) => c.donors >= MIN_DONORS_FOR_CITY_PAGE;
