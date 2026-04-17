// Basic devtools/context menu block
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode === 123) return false; // F12
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) return false; // DevTools shortcuts
    if (e.ctrlKey && e.keyCode === 85) return false; // View source
};

// Toggle Feedback Widget animation
function toggleFeedback() {
    const widget = document.getElementById('feedback-widget');
    widget.classList.toggle('collapsed');
}

// Theme management with system preference detection
let isLight = false;
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    isLight = true; 
    document.body.classList.add('light-theme'); 
}

function updateThemeBtn() {
    document.getElementById('theme-btn').innerHTML = isLight ? 
        '<span class="pl">🌙 Ciemny Motyw</span><span class="en">🌙 Dark Mode</span>' : 
        '<span class="pl">☀️ Jasny Motyw</span><span class="en">☀️ Light Mode</span>';
}
updateThemeBtn();

function toggleTheme() {
    isLight = !isLight; 
    document.body.classList.toggle('light-theme', isLight);
    updateThemeBtn();
    // Safely call chart render if ChartEngine script is loaded
    if (typeof charts !== 'undefined') charts.forEach(c => c.render()); 
}

// Ambient Background Parallax (Awwwards vibe tracking)
const ambient = document.getElementById('ambient');
let currentX = 0, currentY = 0, targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 60; 
    targetY = (e.clientY / window.innerHeight - 0.5) * 60;
});

function animateAmbient() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    if (ambient) {
        ambient.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }
    requestAnimationFrame(animateAmbient);
}

// Only run animation if user doesn't prefer reduced motion
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateAmbient();
}

// Language toggle state management
let currentLang = 'pl'; // Default to PL
function toggleLang() {
    currentLang = currentLang === 'pl' ? 'en' : 'pl';
    document.body.classList.remove('lang-pl', 'lang-en');
    document.body.classList.add('lang-' + currentLang);
    updateSessions();
    updateBreadcrumbs();
}

// CSS variables utility
const cssVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();
const tooltip = document.getElementById('tooltip');

// Tooltip positioning logic
function tt(e, title, text, accent) {
    tooltip.style.display = 'block';
    tooltip.style.setProperty('--tip-accent', accent || 'var(--up-color)');
    tooltip.innerHTML = `<strong>${title}</strong>${text}`;
    tooltip.style.left = (e.clientX + 15) + 'px'; 
    tooltip.style.top = (e.clientY + 15) + 'px';
}
function htt() { 
    tooltip.style.display = 'none'; 
}

// Session countdown logic (London/NY)
function updateSessions() {
    const now = new Date();
    const localH = now.getHours();
    const localM = now.getMinutes();
    const sessions = [
        { openH: 9, openM: 0, closeH: 17, closeM: 30, el: document.getElementById('london-session') },
        { openH: 15, openM: 30, closeH: 22, closeM: 0, el: document.getElementById('ny-session') }
    ];
    sessions.forEach(s => {
        if(!s.el) return;
        const currentTime = localH * 60 + localM;
        const openTime = s.openH * 60 + s.openM;
        const closeTime = s.closeH * 60 + s.closeM;
        const isOpen = currentTime >= openTime && currentTime < closeTime;
        
        const dot = s.el.querySelector('.dot');
        const timeSpan = s.el.querySelector('.session-time');
        dot.classList.toggle('active', isOpen);
        
        let targetTime = isOpen ? closeTime : openTime;
        if (!isOpen && currentTime > closeTime) targetTime += 24 * 60;
        
        // Time diff calculation
        let diffMins = targetTime - currentTime;
        let h = Math.floor(diffMins / 60);
        let m = diffMins % 60;
        
        if(isOpen) {
            timeSpan.innerText = currentLang === 'pl' ? `Zamyka za ${h}h ${m}m` : `Closes in ${h}h ${m}m`;
        } else {
            timeSpan.innerText = currentLang === 'pl' ? `Otwiera za ${h}h ${m}m` : `Opens in ${h}h ${m}m`;
        }
    });
}
setInterval(updateSessions, 60000);

function updateProgressUI() {
    const progress = JSON.parse(localStorage.getItem('rei_academy_progress') || '[]');
    document.querySelectorAll('.folder-card').forEach(card => {
        if (card.dataset.cat && progress.includes(card.dataset.cat)) {
            card.classList.add('completed');
        }
    });
}

// Init UI on load
document.addEventListener("DOMContentLoaded", () => {
    updateSessions(); 
    updateProgressUI();
});

// Navigation state mapping
const viewsData = {
    'home': { title_pl: 'Katalog Główny', title_en: 'Main Catalog', parent: null },
    'cat-mech': { title_pl: 'Mechanika Rynku', title_en: 'Market Mechanics', parent: 'home' },
    'cat-amt': { title_pl: 'AMT', title_en: 'AMT', parent: 'home' },
    'cat-vp': { title_pl: 'Volume Profile', title_en: 'Volume Profile', parent: 'home' },
    'cat-vwap': { title_pl: 'AVWAP', title_en: 'AVWAP', parent: 'home' },
    'cat-vsa': { title_pl: 'VSA', title_en: 'VSA', parent: 'home' },
    'cat-of': { title_pl: 'Orderflow', title_en: 'Orderflow', parent: 'home' },
    'cat-fund': { title_pl: 'Fundamenty', title_en: 'Fundamentals', parent: 'home' },
    'cat-risk': { title_pl: 'Ryzyko', title_en: 'Risk', parent: 'home' }
};

function updateBreadcrumbs() {
    const activeView = document.querySelector('.view.active');
    if(!activeView) return;
    const viewId = activeView.id.replace('view-', '');
    let path = []; let current = viewId;
    while(current) { 
        let t = currentLang === 'pl' ? viewsData[current].title_pl : viewsData[current].title_en;
        path.unshift(`<span onclick="nav('${current}')">${t}</span>`); 
        current = viewsData[current].parent; 
    }
    document.getElementById('breadcrumbs').innerHTML = `📍 ${path.join(" > ")}`;
}

// Simple SPA routing logic
function nav(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    const viewEl = document.getElementById('view-' + viewId);
    if(viewEl) viewEl.classList.add('active');
    if(viewId !== 'home') {
        const prog = JSON.parse(localStorage.getItem('rei_academy_progress') || '[]');
        if(!prog.includes(viewId)) { prog.push(viewId); localStorage.setItem('rei_academy_progress', JSON.stringify(prog)); updateProgressUI(); }
    }
    updateBreadcrumbs();
    window.scrollTo(0,0);
    // Safely call chart render if ChartEngine script is loaded
    setTimeout(() => { if (typeof charts !== 'undefined') charts.forEach(c => c.render()); }, 50);
}

// Feedback submission via Cloudflare Workers (CORS handled on edge)
async function submitFeedback() {
    const textarea = document.getElementById('feedback-text');
    const text = textarea.value;
    if(!text.trim()) return;
    
    const btn = document.getElementById('feedback-btn');
    const origHtml = btn.innerHTML;
    
    btn.innerHTML = '<span class="pl">Wysyłanie...</span><span class="en">Sending...</span>';
    btn.style.pointerEvents = 'none'; // Prevent double-clicks / rate limit abuse on client side
    
    try {
        const response = await fetch('https://cool-leaf-ade2.xxxkubes.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: text,
                page: document.querySelector('.view.active').id,
                language: currentLang
            })
        });
        
        // Validate worker response status
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Worker Error:", errorText);
            throw new Error(errorText || 'Server rejected request');
        }
        
        textarea.value = '';
        btn.style.background = 'var(--up-color)';
        btn.innerHTML = '<span class="pl" style="color:#000;">✓ Wysłano</span><span class="en" style="color:#000;">✓ Sent</span>';
        
        setTimeout(() => {
            btn.style.background = '';
            btn.innerHTML = origHtml;
            btn.style.pointerEvents = 'auto';
        }, 3000);
    } catch (e) {
        console.error("Feedback failed:", e);
        btn.style.background = 'var(--red-accent)';
        btn.innerHTML = '<span class="pl" style="color:#000; font-size:0.85rem;">❌ Błąd (Sprawdź F12)</span><span class="en" style="color:#000; font-size:0.85rem;">❌ Error (Check F12)</span>';
        
        setTimeout(() => {
            btn.style.background = '';
            btn.innerHTML = origHtml;
            btn.style.pointerEvents = 'auto';
        }, 3000);
    }
}