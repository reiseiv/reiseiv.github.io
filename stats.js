(function() {

    const WORKER_URL = 'https://stats.xxxkubes.workers.dev/track';
    
    let vid = localStorage.getItem('rei_vid');
    if (!vid) { 
        vid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2); 
        localStorage.setItem('rei_vid', vid); 
    }
    
    const sessionId = Math.random().toString(36).substring(2);
    const startTime = Date.now();

    function sendBeacon(type) {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000); // w sekundach
        const payload = JSON.stringify({
            vid,
            sessionId,
            type, // 'pageview' lub 'leave'
            url: window.location.pathname,
            ref: document.referrer,
            lang: navigator.language,
            screen: `${window.screen.width}x${window.screen.height}`,
            timeOnPage
        });

        if (navigator.sendBeacon) {
            navigator.sendBeacon(WORKER_URL, payload);
        } else {
            fetch(WORKER_URL, { method: 'POST', body: payload, keepalive: true }).catch(()=>console.log('Analytic ping failed'));
        }
    }

    window.addEventListener('load', () => sendEvent('pageview'));

    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') sendBeacon('leave');
    });
})();