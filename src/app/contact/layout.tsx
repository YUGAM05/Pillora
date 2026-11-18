import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Contact Pillora Support",
    description: "Questions about blood requests, donor registration, hospital information or an appointment? Contact the Pillora support team.",
    path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
