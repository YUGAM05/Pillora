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
