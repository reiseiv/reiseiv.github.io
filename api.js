(function() {
    const WORKER_URL = 'https://stats.xxxkubes.workers.dev/api/ping';
    
    let vid = localStorage.getItem('rei_vid');
    if (!vid) { 
        vid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2); 
        localStorage.setItem('rei_vid', vid); 
    }
    
    const sessionId = Math.random().toString(36).substring(2);
    const startTime = Date.now();

    function sendEvent(data) {
        const payload = JSON.stringify({
            vid,
            sessionId,
            url: window.location.pathname,
            ...data
        });

        if (navigator.sendBeacon) {
            navigator.sendBeacon(WORKER_URL, payload);
        } else {
            fetch(WORKER_URL, { method: 'POST', body: payload, keepalive: true }).catch(() => {});
        }
    }
// 1. Pageview & Leave

    window.addEventListener('load', () => sendEvent({ type: 'pageview', ref: document.referrer }));
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            sendEvent({ type: 'leave', timeOnPage: Math.round((Date.now() - startTime) / 1000) });
        }
    });

    // 2. (Wykresy)
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.addEventListener('mouseenter', () => {
            sendEvent({ type: 'interaction', target: 'chart', id: canvas.id });
        });
    });

    // 3. Tooltipy
    const originalTT = window.tt;
    if (typeof originalTT === 'function') {
        window.tt = function(e, title, text, accent) {
            sendEvent({ type: 'interaction', target: 'tooltip', val: title });
            return originalTT.apply(this, arguments);
        };
    }

    // 4. Trackowanie sekcji
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                sendEvent({ type: 'view_section', id: entry.target.id });
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.view, .course-section').forEach(section => {
        if (section.id) sectionObserver.observe(section);
    });
})();