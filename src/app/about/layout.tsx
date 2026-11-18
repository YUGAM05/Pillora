import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { UNVERIFIED_CLAIMS } from "@/content/claims";

export const metadata: Metadata = pageMetadata({
    title: "About Pillora | Healthcare Coordination in India",
    description: UNVERIFIED_CLAIMS.aboutMetaDescription,
    path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
