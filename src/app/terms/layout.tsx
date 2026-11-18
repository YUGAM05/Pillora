import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Terms & Conditions | Pillora",
    description: "The terms and conditions that apply when you use Pillora to find blood donors, request blood, view hospital information or book appointments.",
    path: "/terms",
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
