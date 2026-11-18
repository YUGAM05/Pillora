import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("Order tracking");

export default function OrderLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
