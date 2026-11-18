import type { Metadata } from "next";
import HealthHubPage, { type DynamicTip } from "./HealthHubClient";
import { serverGet } from "@/lib/serverApi";
import { pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

// Server wrapper: curated + database articles are in the initial HTML.
export const revalidate = 600;

export const metadata: Metadata = pageMetadata({
    title: "Health Hub: Health Articles & Preventive Care | Pillora",
    description:
        "Plain-language health articles on blood donation, nutrition, heart health and preventive care, with sources, from the Pillora Health Hub.",
    path: "/health-hub",
});

export default async function HealthHubIndexPage() {
    const tips = await serverGet<DynamicTip[]>("/health-hub", { revalidate, timeoutMs: 3500 });
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Health Hub", path: "/health-hub" }])} />
            <HealthHubPage initialTips={Array.isArray(tips) ? tips : null} />
        </>
    );
}
