/**
 * Global Tooltip Logic (Bound to UI Elements within Orderflow section)
 */
window.tt = function(e, title, text) {
    const tooltip = document.getElementById('tooltip');
    if(!tooltip) return;
    tooltip.style.display = 'block';
    tooltip.innerHTML = `<strong style="color: var(--accent-glow); display:block; margin-bottom:4px; font-size:1.05rem;">${title}</strong>${text}`;
    tooltip.style.left = (e.clientX + 15) + 'px'; 
    tooltip.style.top = (e.clientY + 15) + 'px';
};

window.htt = function() { 
    const tooltip = document.getElementById('tooltip');
    if(tooltip) tooltip.style.display = 'none'; 
};

/**
 * Application execution core.
 * Orchestrates DOM injection, session telemetry, routing, and simulator mounting.
 */
const App = (() => {
    const STATE = {
        hasEntered: false,
        currentPath: 'home',
        progress: JSON.parse(localStorage.getItem('rei_progress') || '[]')
    };

    const ui = {
        cover: document.querySelector('.cover-page'),
        main: document.querySelector('.portfolio-main'),
        enterBtn: document.querySelector('.enter-btn'),
        rootContainer: document.getElementById('app-root'),
        breadcrumbs: document.getElementById('breadcrumbs-content'),
        ambientWrapper: document.getElementById('ambient-wrapper'),
        loaderFill: document.getElementById('loaderFill')
    };

    const executeEntry = () => {
        if (STATE.hasEntered) return;
        STATE.hasEntered = true;

        if (ui.loaderFill) ui.loaderFill.style.width = '100%';

        setTimeout(() => {
            ui.cover.classList.add('cover-exit');
            
            setTimeout(() => {
                ui.cover.style.display = 'none';
                ui.main.style.display = 'block';
                
                requestAnimationFrame(() => {
                    ui.main.classList.add('fade-in');
                    navigate('home');
                });
            }, 800);
        }, 300);
    };

    const markAsRead = (id) => {
        if (id !== 'home' && !STATE.progress.includes(id)) {
            STATE.progress.push(id);
            localStorage.setItem('rei_progress', JSON.stringify(STATE.progress));
        }
    };

    const updateBreadcrumbs = (id) => {
        if (id === 'home') {
            ui.breadcrumbs.innerHTML = `<span class="bc-active">📍 Katalog Główny</span>`;
            return;
        }
        ui.breadcrumbs.innerHTML = `
            <span class="bc-link" onclick="App.navigate('home')">📍 Katalog Główny</span> 
            <span class="bc-separator">/</span> 
            <span class="bc-active">${ViewTitles[id]}</span>
        `;
    };

    const navigate = (viewId) => {
        if (!AcademyContent[viewId]) return;
        
        markAsRead(viewId);
        updateBreadcrumbs(viewId);
        
        ui.rootContainer.innerHTML = AcademyContent[viewId];
        STATE.currentPath = viewId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (viewId === 'home') {
            document.querySelectorAll('.folder-card').forEach(card => {
                if (STATE.progress.includes(card.dataset.id)) {
                    card.classList.add('completed');
                }
            });
        }

        bindAmbientGlow();
        
        // Mount specific simulators if present
        if (typeof Simulators !== 'undefined') {
            setTimeout(() => {
                Simulators.mount(viewId);
            }, 100);
        }
    };

    const bindAmbientGlow = () => {
        const components = document.querySelectorAll('.folder-card, .kofi-card, .sim-board');
        components.forEach(comp => {
            comp.addEventListener('mousemove', (e) => {
                const rect = comp.getBoundingClientRect();
                comp.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                comp.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });
    };

    const initAmbientEngine = () => {
        let currentX = 0, currentY = 0, targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 100; 
            targetY = (e.clientY / window.innerHeight - 0.5) * 100;
        });

        const animate = () => {
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;
            if (ui.ambientWrapper) {
                ui.ambientWrapper.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
            requestAnimationFrame(animate);
        };
        animate();
    };

    const initSessionTracker = () => {
        const calculateDiff = () => {
            const now = new Date();
            const localH = now.getHours();
            const localM = now.getMinutes();
            const currentTime = localH * 60 + localM;

            const sessions = [
                { id: 'london-session', openH: 9, openM: 0, closeH: 17, closeM: 30 },
                { id: 'ny-session', openH: 15, openM: 30, closeH: 22, closeM: 0 }
            ];

            sessions.forEach(s => {
                const el = document.getElementById(s.id);
                if (!el) return;

                const openTime = s.openH * 60 + s.openM;
                const closeTime = s.closeH * 60 + s.closeM;
                const isOpen = currentTime >= openTime && currentTime < closeTime;
                
                const dot = el.querySelector('.dot');
                const timeSpan = el.querySelector('.session-time');
                
                if (dot) dot.classList.toggle('active', isOpen);
                
                let targetTime = isOpen ? closeTime : openTime;
                if (!isOpen && currentTime > closeTime) targetTime += 24 * 60;
                
                let diffMins = targetTime - currentTime;
                let h = Math.floor(diffMins / 60);
                let m = diffMins % 60;
                
                if (timeSpan) {
                    timeSpan.innerText = isOpen ? `ZAMYKA ZA ${h}H ${m}M` : `OTWIERA ZA ${h}H ${m}M`;
                }
            });
        };

        calculateDiff();
        setInterval(calculateDiff, 60000);
    };

    const init = () => {
        ui.enterBtn?.addEventListener('click', executeEntry);
        
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Enter' || e.code === 'Space') && !STATE.hasEntered) {
                e.preventDefault();
                executeEntry();
            }
        });

        setTimeout(() => {
            if (ui.loaderFill && parseInt(ui.loaderFill.style.width || '0') < 50) {
                ui.loaderFill.style.width = '45%';
            }
        }, 150);

        initAmbientEngine();
        initSessionTracker();
    };

    return { init, navigate };
})();

document.addEventListener('DOMContentLoaded', App.init);