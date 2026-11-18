// Deployment Trigger: 2026-05-15 13:51
import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { SITE } from "@/lib/seo";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";

const inter = Inter({ subsets: ["latin"] });

// GA4 + Search Console come from env vars (set per site in Vercel), never hard-coded.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    // Default for pages without their own metadata. NOTE: no canonical here on
    // purpose — a canonical set in the root layout is inherited by every page
    // and pointed them all at the homepage. Each page sets its own instead.
    title: {
        default: "Find Blood Donors Near You in India | Pillora",
        template: "%s | Pillora"
    },
    description: "Request blood, find registered donors near you, and check hospital information, doctor fees and government health schemes in India on Pillora.",
    openGraph: {
        siteName: SITE.name,
        locale: SITE.locale,
        type: "website",
        images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "Pillora" }],
    },
    twitter: {
        card: "summary_large_image",
        images: [SITE.ogImage],
    },
    ...(GSC_TOKEN ? { verification: { google: GSC_TOKEN } } : {}),
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [
            { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
        title: "Pillora",
        statusBarStyle: "default",
        capable: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AnalyticsTracker />
                    <Navbar />
                    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                        {children}
                    </div>
                    <Footer />
                </ThemeProvider>
                <Analytics />
                <SpeedInsights />
                {GA4_ID && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA4_ID}');
                            `}
                        </Script>
                    </>
                )}
            </body>
        </html>
    );
}
