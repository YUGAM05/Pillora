export const trackPageView = async (path: string) => {
    try {
        await fetch('https://apex-backend-theta.vercel.app/api/metrics/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'pageview',
                path,
                referrer: typeof document !== 'undefined' ? document.referrer : '',
                bandwidth: (typeof performance !== 'undefined' && performance?.getEntriesByType('navigation')?.[0]) 
                    ? (performance.getEntriesByType('navigation')[0] as any).transferSize || 0
                    : 0,
            })
        });
    } catch (e) {
        // Silently fail — never break the app for analytics
        console.warn('Analytics failed', e);
    }
};

/**
 * GA4 conversion events. Safe no-op when GA4 is not configured
 * (NEXT_PUBLIC_GA4_ID unset) or blocked by the browser.
 *
 * Events in use on www.pillora.in:
 *   blood_request  – a blood request was submitted successfully (blood-bank page)
 *   donor_signup   – a donor registration was submitted successfully (blood-bank page)
 *   partner_click  – a partner inquiry was submitted (/partners) or a "Partner with us" link was clicked
 */
export type ConversionEvent = 'blood_request' | 'donor_signup' | 'partner_click' | 'demo_request';

export const trackEvent = (name: ConversionEvent, params: Record<string, string | number | boolean> = {}) => {
    try {
        const w = window as unknown as { gtag?: (...args: unknown[]) => void };
        if (typeof w.gtag === 'function') w.gtag('event', name, params);
    } catch {
        /* never break the app for analytics */
    }
};
