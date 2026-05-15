'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Use a more robust way to get the API URL
const getApiUrl = () => {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Fallback logic for production if env is missing or on local dev
    if (!baseUrl && typeof window !== 'undefined') {
        if (window.location.hostname === 'pillora.in' || window.location.hostname === 'www.pillora.in' || window.location.hostname.endsWith('.vercel.app')) {
            baseUrl = 'https://apex-backend-theta.vercel.app/api';
        } else {
            baseUrl = 'http://localhost:5000/api';
        }
    }

    if (!baseUrl) return null;

    // Ensure no trailing slash on baseUrl, then append /metrics/collect
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${normalizedBase}/metrics/collect`;
};

const ANALYTICS_ENDPOINT = getApiUrl();

/**
 * Global utility to track custom events from anywhere in the client code
 */
export const trackEvent = async (data: {
    type: 'pageview' | 'event';
    eventName?: string;
    path?: string;
    referrer?: string;
    metadata?: any;
}) => {
    if (typeof window === 'undefined') return;

    try {
        if (!ANALYTICS_ENDPOINT) {
            console.warn('[Analytics] Endpoint not configured');
            return;
        }

        const payload = {
            ...data,
            path: data.path || window.location.pathname + window.location.search,
            referrer: data.referrer || document.referrer,
            timestamp: new Date().toISOString(),
        };

        const body = JSON.stringify(payload);
        const bandwidth = new TextEncoder().encode(body).length;

        // Use fetch with keepalive as it's more reliable than sendBeacon for JSON in many environments
        const response = await fetch(ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ ...payload, bandwidth }),
            keepalive: true,
            mode: 'cors'
        });

        if (response.ok) {
            console.log(`[Analytics] Tracked ${data.type}: ${payload.path}`);
        } else {
            console.warn(`[Analytics] Server returned ${response.status} for ${payload.path}`);
        }
    } catch (e) {
        // Silently fail to not interrupt user experience
        console.warn('[Analytics] tracking failed', e);
    }
};

function AnalyticsHandler() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Use a small timeout to ensure we track after hydration and potential route cleanup
        const timer = setTimeout(() => {
            trackEvent({
                type: 'pageview',
                path: window.location.pathname + window.location.search,
            });
        }, 300);
        
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return null;
}

export default function PilloraAnalytics() {
    return (
        <Suspense fallback={null}>
            <AnalyticsHandler />
        </Suspense>
    );
}
