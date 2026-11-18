import Link from "next/link";
import HospitalsPage, { type Hospital } from "./HospitalsClient";
import { serverGet } from "@/lib/serverApi";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/structuredData";

// Server wrapper: the hospital cards (names, cities, fees, links to detail pages)
// are in the initial HTML so they can be crawled. Metadata lives in layout.tsx.
export const revalidate = 600;

// Verified capabilities only (hospital listing, doctors, fees, schemes filter,
// online booking with advance payment). No claims from src/content/claims.ts.
const HOSPITAL_FAQS = [
    {
        question: "What information does a hospital page on Pillora show?",
        answer: "Each hospital page lists the hospital's doctors with their specialisation and consultation fee, the hospital's address and timings, and whether online booking and online payment are available.",
    },
    {
        question: "Can I find hospitals that accept Ayushman Bharat PM-JAY?",
        answer: "Yes. Use the PM-JAY and government scheme filters on this page to see hospitals that have listed those schemes as accepted. Confirm your eligibility and coverage with the hospital before treatment.",
    },
    {
        question: "How do I book an appointment?",
        answer: "Open a hospital, choose a doctor, pick a date and an open slot, and confirm. Some hospitals ask for part of the consultation fee online in advance; the rest is paid at the hospital.",
    },
];

export default async function HospitalsIndexPage() {
    const hospitals = await serverGet<Hospital[]>("/hospitals", { revalidate });
    return (
        <>
            <JsonLd
                data={[
                    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Hospitals", path: "/hospitals" }]),
                    faqJsonLd(HOSPITAL_FAQS),
                ]}
            />
            <HospitalsPage initialHospitals={Array.isArray(hospitals) ? hospitals : null} />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 border-t border-gray-100" aria-labelledby="hospital-info-heading">
                <h2 id="hospital-info-heading" className="text-2xl md:text-3xl font-black text-slate-900">About hospital information on Pillora</h2>
                <p className="text-slate-600 mt-3 max-w-3xl leading-relaxed">
                    Hospitals and clinics on Pillora publish their doctors, consultation fees, timings and accepted government schemes, so you can compare
                    before you visit. Fees and scheme details are provided by each hospital; confirm them with the hospital before treatment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {HOSPITAL_FAQS.map((f) => (
                        <div key={f.question} className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="font-bold text-slate-900">{f.question}</h3>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{f.answer}</p>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-slate-500 mt-8">
                    Need blood for a patient? Use <Link href="/blood-bank" className="font-semibold text-blue-600 hover:underline">Blood Connect</Link> to
                    reach registered donors. Run a hospital or clinic?{" "}
                    <a href="https://www.pillorahospital.in" className="font-semibold text-blue-600 hover:underline">
                        List your doctors and take online appointments with Pillora for Hospitals
                    </a>
                    .
                </p>
            </section>
        </>
    );
}
