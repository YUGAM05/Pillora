import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("My blood requests");

export default function MyBloodRequestsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
