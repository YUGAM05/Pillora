import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("Create account");

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
