import HospitalsPage, { type Hospital } from "./HospitalsClient";
import { serverGet } from "@/lib/serverApi";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

// Server wrapper: the hospital cards (names, cities, fees, links to detail pages)
// are in the initial HTML so they can be crawled. Metadata lives in layout.tsx.
export const revalidate = 600;

export default async function HospitalsIndexPage() {
    const hospitals = await serverGet<Hospital[]>("/hospitals", { revalidate });
    return (
        <>
            <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Hospitals", path: "/hospitals" }])} />
            <HospitalsPage initialHospitals={Array.isArray(hospitals) ? hospitals : null} />
        </>
    );
}
