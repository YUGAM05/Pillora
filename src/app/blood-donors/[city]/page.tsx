import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Droplet, HeartHandshake, Users } from "lucide-react";
import { BLOOD_GROUP_ORDER, CITY_COUNTS_CONFIRMED, MIN_DONORS_FOR_CITY_PAGE, getCityDonorStats, meetsThreshold, qualifies } from "@/lib/donorStats";
import { REQUEST_STEPS, SOURCES } from "@/content/bloodConnect";
import { noIndexMetadata, pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";
import { EmergencyNote, SourceList } from "@/components/blood/BloodConnectGuide";

/**
 * "Blood donors in [city]" pages.
 * - Built only for cities that have registered donors; anything else is a real 404.
 * - Indexable (and in the sitemap) only with >= 10 registered donors; smaller
 *   cities get a noindex page with the total count only.
 * - Aggregate counts only. Never names, phone numbers or addresses.
 */
export const revalidate = 3600;
export const dynamicParams = false;

type Params = { params: { city: string } };

export async function generateStaticParams() {
    const cities = await getCityDonorStats();
    return cities.map((c) => ({ city: c.slug }));
}

const getCity = async (slug: string) => (await getCityDonorStats()).find((c) => c.slug === slug);

const cityFaqs = (city: string) => [
    {
        question: `How do I find a blood donor in ${city}?`,
        answer: `Sign in to Pillora, open Blood Connect and submit a blood request with the patient's blood group, hospital and area in ${city}. After our team checks your ID, Pillora looks for registered donors with the same blood group in your city and area who agreed to be contacted, and sends you the contact details of up to 5 of them.`,
    },
    {
        question: "Is Pillora a blood bank?",
        answer: "No. Pillora helps you reach registered voluntary donors. Blood is collected, tested and issued by hospitals and licensed blood banks. In an emergency, also contact the nearest hospital or licensed blood bank, or call 108.",
    },
    {
        question: `How can I donate blood in ${city}?`,
        answer: "Register as a donor on Pillora's Blood Connect page with your blood group, city and area. People who need your blood group nearby may contact you; you donate at a hospital or licensed blood bank, which checks your eligibility first.",
    },
];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const c = await getCity(params.city);
    if (!c) return noIndexMetadata("Blood donors");
    if (!qualifies(c)) return noIndexMetadata(`Blood donors in ${c.city}`);
    return pageMetadata({
        title: `Blood Donors in ${c.city}: Request Blood | Pillora`,
        description: `${c.donors} registered voluntary blood donors in ${c.city} on Pillora. Request blood by blood group and area, or register as a donor.`,
        path: `/blood-donors/${c.slug}`,
    });
}

export default async function CityDonorsPage({ params }: Params) {
    const c = await getCity(params.city);
    if (!c) notFound();
    const indexable = qualifies(c); // threshold met AND donor data confirmed by the owner
    const listed = meetsThreshold(c); // enough donors to show availability and the group breakdown
    const path = `/blood-donors/${c.slug}`;
    const updated = c.updatedAt
        ? new Date(c.updatedAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" })
        : null;

    return (
        <main className="bg-white">
            {indexable && (
                <JsonLd
                    data={[
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Blood donors by city", path: "/blood-donors" },
                            { name: `Blood donors in ${c.city}`, path },
                        ]),
                        faqJsonLd(cityFaqs(c.city)),
                    ]}
                />
            )}
            <EmergencyNote />

            <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-xs text-gray-500">
                <Link href="/" className="hover:text-red-600">Home</Link> <span aria-hidden="true">›</span>{" "}
                <Link href="/blood-donors" className="hover:text-red-600">Blood donors by city</Link> <span aria-hidden="true">›</span>{" "}
                <span className="text-gray-700">{c.city}</span>
            </nav>

            <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-800 text-white p-8 md:p-12 shadow-xl">
                    <p className="inline-flex px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-widest">Blood Connect</p>
                    <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tight">Blood donors in {c.city}</h1>
                    <p className="text-red-50 mt-4 max-w-2xl text-lg leading-relaxed">
                        {listed
                            ? `${c.donors} registered voluntary donors in ${c.city} are listed on Pillora. Request blood and we will match you with registered donors of the same blood group in your area.`
                            : `Pillora has only a few registered donors in ${c.city} so far. You can still request blood, and every new donor who registers here helps.`}
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Link href="/blood-bank?tab=request" className="px-6 py-3 rounded-xl bg-white text-red-700 font-bold text-center hover:bg-red-50 min-h-[44px]">
                            Request blood in {c.city}
                        </Link>
                        <Link href="/blood-bank" className="px-6 py-3 rounded-xl border border-white/40 font-bold text-center hover:bg-white/10 min-h-[44px]">
                            Register as a donor
                        </Link>
                    </div>
                </div>
            </header>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10" aria-labelledby="stats-heading">
                <h2 id="stats-heading" className="text-2xl font-black text-gray-900">Donors in {c.city} at a glance</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div className="rounded-2xl border border-red-100 p-5 bg-red-50/40">
                        <Users className="w-6 h-6 text-red-600" aria-hidden="true" />
                        <p className="text-3xl font-black text-gray-900 mt-2">{c.donors}</p>
                        <p className="text-sm text-gray-600">registered donors</p>
                    </div>
                    {listed && (
                        <div className="rounded-2xl border border-red-100 p-5 bg-red-50/40">
                            <HeartHandshake className="w-6 h-6 text-red-600" aria-hidden="true" />
                            <p className="text-3xl font-black text-gray-900 mt-2">{c.available}</p>
                            <p className="text-sm text-gray-600">listed as available to donate</p>
                        </div>
                    )}
                    {updated && (
                        <div className="rounded-2xl border border-red-100 p-5 bg-red-50/40">
                            <Droplet className="w-6 h-6 text-red-600" aria-hidden="true" />
                            <p className="text-lg font-black text-gray-900 mt-3">{updated}</p>
                            <p className="text-sm text-gray-600">last donor update</p>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    Donors register themselves; Pillora does not medically screen donors. The blood centre checks every donor before donation.
                </p>

                {listed && c.byBloodGroup && (
                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900">Registered donors by blood group</h3>
                        <div className="overflow-x-auto mt-3 rounded-2xl border border-red-100">
                            <table className="w-full text-sm">
                                <caption className="sr-only">Registered donors in {c.city} by blood group</caption>
                                <thead className="bg-red-50 text-red-900">
                                    <tr>
                                        {BLOOD_GROUP_ORDER.map((g) => (
                                            <th key={g} scope="col" className="px-3 py-2 font-bold">{g.replace("-", "−")}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {BLOOD_GROUP_ORDER.map((g) => (
                                            <td key={g} className="px-3 py-3 text-center font-bold text-gray-900">{c.byBloodGroup?.[g] ?? 0}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10" aria-labelledby="how-heading">
                <h2 id="how-heading" className="text-2xl font-black text-gray-900">How requesting blood works</h2>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    {REQUEST_STEPS.map((s, i) => (
                        <li key={s.title} className="rounded-2xl border border-red-100 p-5">
                            <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Step {i + 1}</p>
                            <h3 className="font-bold text-gray-900 mt-1">{s.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{s.text}</p>
                        </li>
                    ))}
                </ol>
                <p className="text-sm text-gray-600 mt-5">
                    Before donating, read <Link href="/blood-bank#eligibility" className="text-blue-700 hover:underline">who can donate blood in India</Link> and the{" "}
                    <Link href="/blood-bank#compatibility" className="text-blue-700 hover:underline">blood group compatibility chart</Link>. Looking for a hospital? See{" "}
                    <Link href="/hospitals" className="text-blue-700 hover:underline">hospitals, doctors and consultation fees</Link>.
                </p>
            </section>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-2xl font-black text-gray-900">Questions about blood donors in {c.city}</h2>
                <div className="space-y-4 mt-5">
                    {cityFaqs(c.city).map((f) => (
                        <div key={f.question}>
                            <h3 className="font-bold text-gray-900">{f.question}</h3>
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{f.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
                <h2 className="text-base font-bold text-gray-900 mb-2">Sources</h2>
                <SourceList sources={[SOURCES.eraktkosh, SOURCES.eraktkoshFaq, SOURCES.nbtcGuidelines]} />
                {!indexable && (
                    <p className="text-xs text-gray-400 mt-4">
                        {CITY_COUNTS_CONFIRMED
                            ? `City pages are listed in search once a city has at least ${MIN_DONORS_FOR_CITY_PAGE} registered donors.`
                            : "Donor counts are shown as recorded and are being reviewed."}
                    </p>
                )}
            </section>
        </main>
    );
}
