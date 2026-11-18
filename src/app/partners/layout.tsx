import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Partner with Pillora | Hospitals, Clinics & Doctors",
    description: "List your hospital or clinic on Pillora. Offer online and walk-in appointments, doctor schedules and advance consultation fee payment.",
    path: "/partners",
});

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
