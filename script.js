// Basic devtools/context menu block
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function(e) {
    if (e.keyCode === 123) return false; // F12
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) return false; // DevTools shortcuts
    if (e.ctrlKey && e.keyCode === 85) return false; // View source
};

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
    charts.forEach(c => c.render()); // Re-render charts to apply new color vars
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

// ChartEngine - Custom Canvas renderer for footprint/VP data.
class ChartEngine {
    constructor(canvasId, ohlcvData, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.data = ohlcvData;
        this.options = Object.assign({ vpVisible: true, showVWAP: false, highlights: {}, annotations: [] }, options);
        this.candles = []; this.vp = {}; this.vwapLine = []; this.maxVP = 0; this.maxVol = 0; this.minP = Infinity; this.maxP = -Infinity;
        this.processTicks();
        this.resizeObserver = new ResizeObserver(() => this.render());
        this.resizeObserver.observe(this.canvas.parentElement);
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        this.canvas.addEventListener('mouseleave', () => { htt(); this.hoverIndex = -1; this.render(); });
        this.hoverIndex = -1;
    }
    
    // Build volume profile from OHLCV ticks
    processTicks() {
        let cumPV = 0, cumV = 0;
        this.data.forEach((d) => {
            const [o, h, l, c, v] = d;
            if(h > this.maxP) this.maxP = h; if(l < this.minP) this.minP = l; if(v > this.maxVol) this.maxVol = v;
            const path = c >= o ? [o, l, h, c] : [o, h, l, c];
            const steps = 10; const volPerStep = v / steps;
            for(let p = 0; p < path.length - 1; p++) {
                let p1 = path[p], p2 = path[p+1];
                let pSteps = Math.ceil(steps / 3);
                for(let s = 1; s <= pSteps; s++) {
                    let tickP = p1 + (p2 - p1) * (s/pSteps);
                    cumPV += tickP * volPerStep; cumV += volPerStep;
                    let priceBucket = Math.round(tickP);
                    this.vp[priceBucket] = (this.vp[priceBucket] || 0) + volPerStep;
                    if(this.vp[priceBucket] > this.maxVP) this.maxVP = this.vp[priceBucket];
                }
            }
            this.candles.push({ o, h, l, c, v });
            this.vwapLine.push(cumV > 0 ? cumPV / cumV : c);
        });
    }
    render() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        if(rect.width === 0 || rect.height === 0) return;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr; this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        const w = rect.width, h = rect.height, ctx = this.ctx;
        ctx.clearRect(0, 0, w, h);
        const vpWidth = this.options.vpVisible ? Math.min(200, w * 0.25) : 10;
        const volHeight = 60, padTop = 30, padBottom = 20 + volHeight;
        const drawW = w - vpWidth - 20, drawH = h - padTop - padBottom;
        const rangeP = this.maxP - this.minP || 1;
        
        // Coordinate mapping
        const mapY = (price) => h - padBottom - ((price - this.minP) / rangeP) * drawH;
        const stepX = drawW / Math.max(this.candles.length, 10);
        const mapX = (index) => vpWidth + 10 + (index * stepX) + (stepX/2);
        
        const cUp = cssVar('--up-color'), cDown = cssVar('--down-color'), cGrid = cssVar('--border-color'), cVP = cssVar('--vp-color'), cPOC = cssVar('--vp-poc');
        ctx.strokeStyle = cGrid; ctx.lineWidth = 1;
        for(let i=0; i<=5; i++) { let py = padTop + (drawH/5)*i; ctx.beginPath(); ctx.moveTo(vpWidth, py); ctx.lineTo(w, py); ctx.stroke(); }
        const cW = Math.max(stepX * 0.6, 2);
        
        if (this.options.annotations) {
            this.options.annotations.forEach(ann => {
                if (ann.type === 'zone') {
                    let y1 = mapY(ann.p1), y2 = mapY(ann.p2), zoneY = Math.min(y1, y2), zoneH = Math.abs(y1 - y2);
                    let x1 = ann.startIdx !== undefined ? mapX(ann.startIdx) - cW : vpWidth, x2 = ann.endIdx !== undefined ? mapX(ann.endIdx) + cW : w;
                    ctx.fillStyle = cssVar(ann.bgVar); ctx.fillRect(x1, zoneY, x2-x1, zoneH);
                    if(ann.text) { ctx.fillStyle = cssVar(ann.textVar); ctx.font = '600 12px -apple-system, sans-serif'; ctx.fillText(ann.text, x1 + 10, zoneY + 16); }
                    ctx.strokeStyle = cssVar(ann.textVar); ctx.strokeRect(x1, zoneY, x2-x1, zoneH);
                }
                if (ann.type === 'text') {
                    ctx.fillStyle = ann.color || cUp; ctx.font = ann.font || 'bold 12px -apple-system, sans-serif';
                    ctx.save(); ctx.translate(mapX(ann.i) + (ann.offsetX || 0), mapY(ann.p) + (ann.offsetY || 0));
                    if (ann.angle) ctx.rotate(ann.angle * Math.PI / 180); ctx.fillText(ann.text, 0, 0); ctx.restore();
                }
                if (ann.type === 'arrow') {
                    const ax1 = mapX(ann.i1), ay1 = mapY(ann.p1), ax2 = mapX(ann.i2), ay2 = mapY(ann.p2);
                    ctx.beginPath(); ctx.moveTo(ax1, ay1); ctx.quadraticCurveTo(ax1 + (ax2 - ax1) / 2, Math.min(ay1, ay2) - 30, ax2, ay2);
                    ctx.strokeStyle = ann.color || '#00aaff'; ctx.lineWidth = 3; ctx.stroke();
                }
            });
        }
        
        if (this.options.vpVisible) {
            let pocPrice = null, maxVPVal = 0;
            for(const [pS, v] of Object.entries(this.vp)) { if (v > maxVPVal) { maxVPVal = v; pocPrice = parseFloat(pS); } }
            for(const [pS, v] of Object.entries(this.vp)) {
                const y = mapY(parseFloat(pS)), barW = (v / this.maxVP) * vpWidth * 0.9;
                ctx.fillStyle = cVP; ctx.fillRect(0, y - 1.5, barW, 3);
            }
            if (pocPrice !== null) {
                const y = mapY(pocPrice); ctx.fillStyle = cPOC; ctx.fillRect(0, y - 2, vpWidth, 4);
                ctx.strokeStyle = cPOC; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(vpWidth, y); ctx.lineTo(w, y); ctx.stroke(); ctx.setLineDash([]);
            }
        }
        
        if (this.options.showVWAP) {
            ctx.beginPath(); this.vwapLine.forEach((val, i) => { const cx = mapX(i), cy = mapY(val); if(i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy); });
            ctx.strokeStyle = cssVar('--vwap-line'); ctx.lineWidth = 3; ctx.stroke();
        }
        
        this.candles.forEach((c, i) => {
            const cx = mapX(i), isUp = c.c >= c.o, color = isUp ? cUp : cDown;
            const vH = (c.v / this.maxVol) * volHeight; ctx.fillStyle = color; ctx.globalAlpha = 0.5;
            ctx.fillRect(cx - cW/2, h - padBottom + 5 + (volHeight - vH), cW, vH); ctx.globalAlpha = 1.0;
            const hl = this.options.highlights[i];
            if (hl || this.hoverIndex === i) {
                ctx.shadowColor = color; ctx.shadowBlur = 10;
                if (hl && hl.border) { ctx.strokeStyle = color; ctx.setLineDash([4, 4]); ctx.strokeRect(cx - cW/2 - 4, mapY(c.h) - 4, cW + 8, Math.abs(mapY(c.l) - mapY(c.h)) + 8); ctx.setLineDash([]); }
            }
            ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, mapY(c.h)); ctx.lineTo(cx, mapY(c.l)); ctx.stroke();
            const bT = mapY(Math.max(c.o, c.c)), bB = mapY(Math.min(c.o, c.c));
            ctx.fillStyle = color; ctx.fillRect(cx - cW/2, bT, cW, Math.max(bB - bT, 2)); ctx.shadowBlur = 0;
        });
    }
    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect(); const x = e.clientX - rect.left;
        const vpWidth = this.options.vpVisible ? Math.min(200, rect.width * 0.25) : 10;
        const drawW = rect.width - vpWidth - 20, stepX = drawW / Math.max(this.candles.length, 10);
        const idx = Math.round((x - vpWidth - 10 - (stepX/2)) / stepX);
        if (idx >= 0 && idx < this.candles.length) {
            if (this.hoverIndex !== idx) { 
                this.hoverIndex = idx; this.render(); 
                const hl = this.options.highlights[idx]; 
                if (hl) tt(e, currentLang === 'pl' ? hl.t_pl || hl.t : hl.t_en || hl.t, currentLang === 'pl' ? hl.d_pl || hl.d : hl.d_en || hl.d); 
                else htt(); 
            }
        } else { this.hoverIndex = -1; this.render(); htt(); }
    }
}

// Mock OHLCV data for visual examples
const dataAMT = [[350,355,345,352,50],[352,360,350,355,40],[355,358,348,350,60],[350,362,345,358,55],[358,365,350,352,45],[352,355,342,348,70],[348,352,345,350,50],[350,358,348,355,40],[355,380,355,378,150],[378,395,375,392,180],[392,405,390,402,160],[402,408,398,405,60],[405,410,400,402,50],[402,405,395,398,70],[398,402,395,400,55],[400,408,398,405,40],[405,412,402,408,65],[408,410,395,398,80],[398,405,395,402,50],[402,405,385,388,170],[388,390,370,372,190],[372,375,362,365,160],[365,370,360,368,50],[368,372,362,365,40],[365,368,358,362,60],[362,365,360,364,45],[364,370,362,368,55],[368,375,365,366,50]];
const dataVA = [[150,155,145,152,100],[152,158,150,155,110],[155,165,152,160,80],[160,168,158,165,60],[165,168,155,158,70],[158,160,148,150,120],[150,152,142,145,80],[145,148,135,140,60],[140,145,138,142,50],[142,155,140,152,100],[152,155,128,135,90],[135,148,132,145,70],[145,160,142,155,80],[155,175,152,165,85],[165,168,150,155,75]];
const dataPOC = [[240,245,230,235,40],[235,240,220,225,45],[225,230,210,215,50],[215,220,190,195,60],[195,200,180,185,65],[185,190,160,165,70],[165,175,155,160,80],[160,165,150,158,85],[158,160,145,150,90],[150,155,148,152,95],[152,160,148,158,85],[158,162,145,150,90],[150,155,145,152,80],[152,165,150,160,70],[160,170,155,165,60]];
const dataLVN = [[100,110,95,105,40],[105,115,100,112,50],[112,120,110,118,60],[118,140,115,135,70],[135,160,130,155,80],[155,185,150,180,90],[180,210,175,205,85],[205,230,200,225,80],[225,228,215,220,50],[220,225,210,215,45],[215,220,205,210,40],[210,215,195,200,50],[200,205,185,190,55],[190,195,175,180,60],[180,185,165,170,65],[170,175,155,160,70],[160,165,145,150,75],[150,170,140,165,95],[165,180,160,175,80],[175,190,170,185,75]];
const dataVWAP = [[100,105,98,102,100],[102,110,100,108,150],[108,115,105,112,120],[112,120,110,118,180],[118,125,115,122,140],[122,118,112,115,90],[115,118,110,112,110],[112,125,110,123,200],[123,130,120,128,160],[128,135,125,132,140],[132,125,120,122,100],[122,125,118,120,90],[120,135,118,132,220],[132,140,130,138,150],[138,145,135,142,130]];
const dataVSA1 = [[200,205,190,195,50],[195,200,180,185,60],[185,190,160,165,70],[165,170,140,145,90],[145,155,140,150,40],[150,160,145,155,45],[155,160,145,150,85],[150,155,140,145,90],[145,165,140,160,60],[160,180,155,175,70],[175,200,170,195,80],[195,230,190,225,95],[225,260,220,255,100],[255,260,230,235,90],[235,240,210,215,85]];
const dataVSA2 = [[100,115,95,110,50],[110,125,105,120,60],[120,135,115,130,55],[130,135,120,125,45],[125,140,120,135,50],[135,145,130,140,40],[140,145,135,142,20],[142,145,138,140,15],[140,142,135,138,10],[138,140,120,125,70],[125,130,100,105,80],[105,110,80,85,90],[85,90,60,65,95],[65,70,30,45,100],[45,60,40,55,50],[55,70,50,65,60],[65,70,55,60,20],[60,75,55,70,50],[70,90,65,85,60]];
const dataMap1 = [[200, 210, 195, 205, 80], [205, 215, 200, 210, 90], [210, 220, 205, 215, 110], [215, 225, 210, 218, 130], [218, 222, 205, 212, 100], [212, 218, 200, 205, 120], [205, 215, 195, 208, 90], [208, 212, 190, 195, 70]];
const dataMap2 = [[150, 155, 145, 152, 60], [152, 158, 150, 155, 80], [155, 160, 152, 158, 70], [158, 162, 155, 160, 75], [160, 185, 158, 180, 150], [180, 195, 175, 190, 140]];

let charts = [];
document.addEventListener("DOMContentLoaded", () => {
    updateSessions(); updateProgressUI();
    charts.push(new ChartEngine('canvas-amt', dataAMT, { vpVisible: false, annotations: [
        {type: 'zone', p1: 342, p2: 365, startIdx: 0, endIdx: 7, text: 'Fair Value ($35,000)', bgVar: '--amt-box', textVar: '--heading-color'},
        {type: 'zone', p1: 395, p2: 412, startIdx: 11, endIdx: 18, text: 'Fair Value ($40,000)', bgVar: '--amt-box', textVar: '--heading-color'},
        {type: 'zone', p1: 358, p2: 375, startIdx: 22, endIdx: 27, text: 'Fair Value ($36,500)', bgVar: '--amt-box', textVar: '--heading-color'},
        {type: 'arrow', i1: 6, p1: 385, i2: 8, p2: 365, color: '#007aff'}, {type: 'text', text: 'Market Event', i: 5, p: 395, color: '#007aff', font: '800 16px -apple-system, sans-serif'},
        {type: 'text', text: 'Buy Imbalance', i: 8, p: 380, color: '#32d74b', font: '800 13px -apple-system, sans-serif', angle: -65}
    ]}));
    charts.push(new ChartEngine('canvas-vaval', dataVA, { highlights: { 10: {t_pl:'Odbicie od VAL', d_pl:'Wsparcie zadziałało (Volume w brzuchu).', t_en:'Bounce from VAL', d_en:'Support worked (Volume in the belly).', border:true}, 13: {t_pl:'Odrzucenie VAH', d_pl:'knot(wick) uderza w krawędź i wraca.', t_en:'VAH Rejection', d_en:'Wick hits the edge and returns.', border:true} }, annotations: [ {type: 'zone', p1: 165, p2: 168, text: 'VAH', bgVar: '--up-bg', textVar: '--up-color'}, {type: 'zone', p1: 135, p2: 132, text: 'VAL', bgVar: '--up-bg', textVar: '--up-color'} ] }));
    charts.push(new ChartEngine('canvas-poc', dataPOC, { highlights: { 9: {t_pl:'Magnes POC', d_pl:'Wyhamowanie na High Volume Node (HVN).', t_en:'POC Magnet', d_en:'Slowdown on High Volume Node (HVN).', border:true} } }));
    charts.push(new ChartEngine('canvas-lvn', dataLVN, { highlights: { 17: {t_pl:'Test LVN', d_pl:'knot(wick) wchodzi w pustkę i gwałtownie odbija.', t_en:'LVN Test', d_en:'Wick enters the void and bounces violently.', border:true} }, annotations: [ {type: 'zone', p1: 140, p2: 150, text: 'LVN', bgVar: '--down-bg', textVar: '--red-accent'} ] }));
    charts.push(new ChartEngine('canvas-vwap', dataVWAP, { vpVisible: false, showVWAP: true, highlights: { 5: {t_pl:'Pullback do VWAP', d_pl:'Cena odnajduje fair value wg VWAP.', t_en:'Pullback to VWAP', d_en:'Price finds fair value according to VWAP.', border:true}, 11: {t_pl:'Pullback do VWAP', d_pl:'Kolejny udany retest instytucjonalnej linii.', t_en:'Pullback to VWAP', d_en:'Another successful retest of the institutional line.', border:true} } }));
    charts.push(new ChartEngine('canvas-vsa1', dataVSA1, { vpVisible: false, highlights: { 3: {t_pl:'Zdrowy Ruch', d_pl:'Effort = Result. Duży knot, duży vol.', t_en:'Healthy Move', d_en:'Effort = Result. Large wick, large vol.', border:true}, 6: {t_pl:'Hidden Selling', d_pl:'Wąski spread, potężny wolumen.', t_en:'Hidden Selling', d_en:'Narrow spread, massive volume.', border:true}, 12: {t_pl:'Buying Climax', d_pl:'Wystrzał przed zjazdem.', t_en:'Buying Climax', d_en:'Spike before the drop.', border:true} } }));
    charts.push(new ChartEngine('canvas-vsa2', dataVSA2, { vpVisible: false, highlights: { 8: {t_pl:'No Demand', d_pl:'Wąski spread, znikomy wol.', t_en:'No Demand', d_en:'Narrow spread, minimal vol.', border:true}, 13: {t_pl:'Stopping Volume', d_pl:'Długi knot zaabsorbował sprzedaż.', t_en:'Stopping Volume', d_en:'Long wick absorbed the selling.', border:true}, 16: {t_pl:'No Supply', d_pl:'Korekta w dół, podaż wyschła.', t_en:'No Supply', d_en:'Downward correction, supply dried up.', border:true} } }));
    charts.push(new ChartEngine('canvas-map1', dataMap1, { highlights: { 3: {t_pl:'Session Profile', d_pl:'Profil zaplanowany na całą sesję.', t_en:'Session Profile', d_en:'Profile mapped for the entire session.', border:true} }, annotations: [{type: 'zone', p1: 225, p2: 190, startIdx: 0, endIdx: 7, text: 'Session Map', bgVar: '--amt-box', textVar: '--heading-color'}] }));
    charts.push(new ChartEngine('canvas-map2', dataMap2, { highlights: { 4: {t_pl:'Micro Balance', d_pl:'Bieżące mapowanie lokalnego balansu.', t_en:'Micro Balance', d_en:'Current mapping of local balance.', border:true} }, annotations: [{type: 'zone', p1: 162, p2: 150, startIdx: 0, endIdx: 3, text: 'Local Map', bgVar: '--up-bg', textVar: '--up-color'}] }));
    charts.forEach(c => c.render());
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
    setTimeout(() => { charts.forEach(c => c.render()); }, 50);
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