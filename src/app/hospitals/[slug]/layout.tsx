import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Same base URL rule as src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://apex-backend-theta.vercel.app/api' : 'http://localhost:5000/api');

type HospitalLookup =
    | { status: 'found'; hospital: { name?: string; city?: string; slug?: string; description?: string } }
    | { status: 'missing' }
    | { status: 'unknown' }; // network/server error: let the client page try again

// fetch() calls with the same URL and options are de-duplicated within one request,
// so generateMetadata and the layout share a single API call.
async function lookupHospital(slug: string): Promise<HospitalLookup> {
    try {
        const res = await fetch(`${API_BASE_URL}/hospitals/${encodeURIComponent(slug)}`, {
            next: { revalidate: 300 },
        });
        if (res.status === 404) return { status: 'missing' };
        if (!res.ok) return { status: 'unknown' };
        return { status: 'found', hospital: await res.json() };
    } catch {
        return { status: 'unknown' };
    }
}

const toPlainText = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const result = await lookupHospital(params.slug);
    if (result.status !== 'found' || !result.hospital?.name) {
        return { title: result.status === 'missing' ? 'Hospital not found' : 'Hospital Information & Charges' };
    }
    const { name, city, slug, description } = result.hospital;
    const plain = description ? toPlainText(description).slice(0, 155) : '';
    return {
        title: city ? `${name}, ${city}` : name,
        description: plain || `Doctors, consultation fees, timings and appointments at ${name}${city ? `, ${city}` : ''} on Pillora.`,
        alternates: { canonical: `https://www.pillora.in/hospitals/${slug || params.slug}` },
    };
}

export default async function HospitalProfileLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { slug: string };
}) {
    const result = await lookupHospital(params.slug);
    // Unknown slug: real 404 status instead of a 200 page that says "not found"
    if (result.status === 'missing') notFound();
    return <>{children}</>;
}
