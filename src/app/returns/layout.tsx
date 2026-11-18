import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Refund & Cancellation Policy | Pillora",
    description: "Pillora refund and cancellation policy for appointment advance payments and other paid services, including how and when refunds are processed.",
    path: "/returns",
});

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
