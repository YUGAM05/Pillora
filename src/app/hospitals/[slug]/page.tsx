import type { Metadata } from "next";
import HospitalDetailPage, { type Hospital } from "./HospitalDetailClient";
import { serverGet } from "@/lib/serverApi";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

// Server wrapper: hospital name, address, fees and doctor list are in the initial
// HTML. Booking, slots and payment stay entirely client-side (unchanged).
export const revalidate = 3600;

type Params = { params: { slug: string } };

const getHospital = (slug: string) =>
    serverGet<Hospital>(`/hospitals/${encodeURIComponent(slug)}`, { revalidate });

const httpImage = (h: Hospital): string | undefined => {
    const src = h.images?.[0] || h.image;
    return src && /^https:\/\//i.test(src) ? src : undefined;
};

const describe = (h: Hospital) => {
    const where = [h.name, h.city].filter(Boolean).join(", ");
    const doctors = h.doctors?.length ? `${h.doctors.length} doctor${h.doctors.length > 1 ? "s" : ""}, ` : "";
    const fee = h.consultationFee ? `consultation fee ₹${h.consultationFee}, ` : "";
    return `${where}: ${doctors}${fee}timings and address. Check doctor availability and book an appointment online on Pillora.`;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const h = await getHospital(params.slug);
    if (!h) {
        return pageMetadata({
            title: "Hospital Details | Pillora",
            description: "Hospital information, doctors, timings and consultation fees on Pillora.",
            path: `/hospitals/${params.slug}`,
        });
    }
    return pageMetadata({
        title: `${h.name}${h.city ? `, ${h.city}` : ""}: Doctors & Fees | Pillora`,
        description: describe(h),
        path: `/hospitals/${h.slug || params.slug}`,
        image: httpImage(h),
    });
}

export default async function HospitalPage({ params }: Params) {
    const h = await getHospital(params.slug);
    const path = `/hospitals/${h?.slug || params.slug}`;
    return (
        <>
            {h && (
                <JsonLd
                    data={[
                        {
                            "@context": "https://schema.org",
                            "@type": "MedicalOrganization",
                            name: h.name,
                            url: absoluteUrl(path),
                            ...(httpImage(h) ? { image: httpImage(h) } : {}),
                            address: {
                                "@type": "PostalAddress",
                                streetAddress: h.address,
                                addressLocality: h.city,
                                addressCountry: "IN",
                            },
                        },
                        breadcrumbJsonLd([
                            { name: "Home", path: "/" },
                            { name: "Hospitals", path: "/hospitals" },
                            { name: h.name, path },
                        ]),
                    ]}
                />
            )}
            <HospitalDetailPage initialHospital={h} />
        </>
    );
}
