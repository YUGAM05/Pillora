import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Find Blood Donors & Request Blood in India | Pillora",
    description: "Register as a blood donor or request blood in an emergency. Pillora matches requests with registered donors by blood group and area in India.",
    path: "/blood-bank",
});

export default function BloodBankLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
