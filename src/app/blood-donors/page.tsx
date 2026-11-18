import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MIN_DONORS_FOR_CITY_PAGE, getCityDonorStats, qualifies } from "@/lib/donorStats";
import { noIndexMetadata, pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structuredData";
import { EmergencyNote } from "@/components/blood/BloodConnectGuide";

export const revalidate = 3600;

const TITLE = "Blood Donors by City in India | Pillora";
const DESCRIPTION =
    "See how many registered voluntary blood donors Pillora has in each city, then request blood or register as a donor near you.";

// Indexable only when at least one city meets the threshold.
export async function generateMetadata(): Promise<Metadata> {
    const cities = (await getCityDonorStats()).filter(qualifies);
    return cities.length ? pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/blood-donors" }) : noIndexMetadata("Blood donors by city");
}

export default async function BloodDonorsIndexPage() {
    // Only cities that meet the threshold are listed (aggregate counts only).
    const cities = (await getCityDonorStats()).filter(qualifies);
    return (
        <main className="bg-white">
            <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blood donors by city", path: "/blood-donors" }])} />
            <EmergencyNote />
            <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-6">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Blood donors by city</h1>
                <p className="text-gray-600 mt-4 max-w-2xl text-lg">
                    Registered voluntary donors on Pillora, by city. To find a donor, submit a blood request on{" "}
                    <Link href="/blood-bank" className="text-blue-700 hover:underline">Blood Connect</Link>; we match you with registered donors of the
                    same blood group in your area.
                </p>
            </header>
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
                {cities.length === 0 ? (
                    <p className="text-gray-600">City pages appear here once a city has at least {MIN_DONORS_FOR_CITY_PAGE} registered donors.</p>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cities.map((c) => (
                            <li key={c.slug}>
                                <Link href={`/blood-donors/${c.slug}`} className="flex items-center justify-between rounded-2xl border border-red-100 p-5 hover:border-red-300 hover:bg-red-50/40">
                                    <span>
                                        <span className="block font-bold text-gray-900">Blood donors in {c.city}</span>
                                        <span className="text-sm text-gray-600">{c.donors} registered donors</span>
                                    </span>
                                    <ArrowRight className="w-5 h-5 text-red-600" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
