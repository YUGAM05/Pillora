import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("Donor profile");

export default function MyDonorProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
