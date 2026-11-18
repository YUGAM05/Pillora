import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

// Applies to /hospitals. /hospitals/[slug] sets its own metadata (generateMetadata).
export const metadata: Metadata = pageMetadata({
    title: "Hospitals, Doctors & Consultation Fees | Pillora",
    description:
        "Find hospitals and clinics, see doctors, timings and consultation fees, check government scheme acceptance, and book appointments online with Pillora.",
    path: "/hospitals",
});

export default function HospitalsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
