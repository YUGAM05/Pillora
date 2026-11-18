import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("My orders");

export default function MyOrdersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
