import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Privacy Policy | Pillora",
    description: "How Pillora collects, uses and protects your personal information when you use our blood donor, hospital information and booking services.",
    path: "/privacy",
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
