import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Careers at Pillora | Join Our Health-Tech Team",
    description: "Explore career opportunities at Pillora. Join our mission to improve healthcare access, blood donor matching, and hospital information in India.",
    path: "/careers",
});

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
