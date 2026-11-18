import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Help Center | Pillora",
    description: "Get help with finding a blood donor, requesting blood, hospital information and appointment booking on Pillora. Contact our support team.",
    path: "/help",
});

export default function HelpLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
