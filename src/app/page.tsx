import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Droplet, MapPin, BookOpen } from "lucide-react";
import HomeClient from "./HomeClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Find Blood Donors Near You in India | Pillora",
    description:
        "Request blood, find registered donors near you, and check hospital information, doctor fees and government health schemes in India on Pillora.",
    path: "/",
});

// Verified capabilities only; no claims from src/content/claims.ts.
const SECTIONS = [
    {
        href: "/blood-bank",
        icon: <Droplet className="w-6 h-6 text-red-500" aria-hidden="true" />,
        title: "Request blood or become a donor",
        text: "Submit a blood request and we match you with registered donors of the same blood group in your area, or register to donate.",
        cta: "Go to Blood Connect",
    },
    {
        href: "/blood-donors",
        icon: <MapPin className="w-6 h-6 text-red-500" aria-hidden="true" />,
        title: "Blood donors by city",
        text: "See how many registered voluntary donors Pillora has in your city.",
        cta: "See blood donors by city",
    },
    {
        href: "/hospitals",
        icon: <Building2 className="w-6 h-6 text-blue-500" aria-hidden="true" />,
        title: "Hospitals, doctors and fees",
        text: "Compare hospitals, see doctors and consultation fees, check accepted government schemes such as PM-JAY, and book appointments.",
        cta: "Find hospitals and doctors",
    },
    {
        href: "/health-hub",
        icon: <BookOpen className="w-6 h-6 text-emerald-500" aria-hidden="true" />,
        title: "Health Hub",
        text: "Plain-language articles on preventive care, nutrition and blood donation.",
        cta: "Read health articles",
    },
];

export default function Home() {
    return (
        <HomeClient>
            <section className="max-w-7xl mx-auto px-6 pb-16" aria-labelledby="home-services-heading">
                <h2 id="home-services-heading" className="text-2xl md:text-3xl font-bold text-gray-900">What you can do on Pillora</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {SECTIONS.map((s) => (
                        <li key={s.href}>
                            <Link href={s.href} className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                <span className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">{s.icon}</span>
                                <span className="font-bold text-gray-900 mt-4">{s.title}</span>
                                <span className="text-sm text-gray-500 mt-2 flex-1">{s.text}</span>
                                <span className="text-sm font-semibold text-blue-600 mt-4 inline-flex items-center gap-1">
                                    {s.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-gray-500 mt-8">
                    Run a hospital or clinic?{" "}
                    <a href="https://www.pillorahospital.in" className="font-semibold text-blue-600 hover:underline">
                        See Pillora&apos;s appointment and doctor schedule software for hospitals
                    </a>
                    .
                </p>
            </section>
        </HomeClient>
    );
}
