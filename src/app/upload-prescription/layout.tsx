import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/seo";

// Private / utility page: kept out of search results and the sitemap.
export const metadata: Metadata = noIndexMetadata("Upload prescription");

export default function UploadPrescriptionLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
