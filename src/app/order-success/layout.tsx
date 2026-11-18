import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("Order confirmed");

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
