import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
    title: "Find Verified Blood Donors in India | Pillora",
    description:
        "Request blood, find verified donors near you, and check hospital information, doctor fees and government health schemes in India on Pillora.",
    path: "/",
});

export default function Home() {
    return <HomeClient />;
}
