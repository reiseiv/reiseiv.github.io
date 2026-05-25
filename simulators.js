/**
 * Interactive DOM-based market simulators and minigames.
 * ADHD-friendly visual engagement, fully rewritten for logic accuracy.
 */

const Simulators = (() => {
    
    let activeIntervals = [];

    const purge = () => {
        activeIntervals.forEach(clearInterval);
        activeIntervals = [];
    };

    const mount = (viewId) => {
        purge();
        if (viewId === 'amt') initAMTSim();
        if (viewId === 'vp') initVPSim();
        if (viewId === 'vwap') initVWAPSim();
        if (viewId === 'vsa') initVSASim();
        if (viewId === 'of') initOFSim();
    };

    // ===============================================
    // 1. AMT (Auction Market Theory) Simulator
    // ===============================================
    const initAMTSim = () => {
        const container = document.getElementById('sim-amt-container');
        if (!container) return;

        container.innerHTML = `
            <div class="sim-board">
                <div class="sim-title" id="amt-sim-title">Faza: BALANCE (Uczciwa Wycena)</div>
                <div style="position: relative; height: 120px; margin: 30px 0; background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; border: 1px solid var(--glass-border);">
                    <div id="amt-old-va" style="position: absolute; top: 10px; left: 10%; width: 25%; height: 100px; background: rgba(147, 51, 234, 0.1); border: 1px solid rgba(147, 51, 234, 0.4); border-radius: 8px; transition: opacity 0.5s;">
                        <span style="font-size: 0.7rem; color: var(--accent-glow); position: absolute; top: 5px; left: 5px;">Old VA</span>
                        <div style="width:60%; height:8px; background:var(--accent-glow); margin: 20px 5px 4px; opacity:0.6;"></div>
                        <div style="width:90%; height:8px; background:var(--accent-glow); margin: 4px 5px; opacity:0.8;"></div>
                        <div style="width:70%; height:8px; background:var(--accent-glow); margin: 4px 5px; opacity:0.6;"></div>
                    </div>
                    <div id="amt-price-tracker" style="position: absolute; top: 40px; left: 20%; width: 15px; height: 15px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff; z-index: 5; transition: left 1.5s cubic-bezier(0.25, 1, 0.5, 1), top 0.3s;"></div>
                    <div id="amt-new-va" style="position: absolute; top: 10px; left: 65%; width: 25%; height: 100px; background: rgba(52, 211, 153, 0.1); border: 1px dashed rgba(52, 211, 153, 0.6); border-radius: 8px; opacity: 0; transition: opacity 1s;">
                        <span style="font-size: 0.7rem; color: #34d399; position: absolute; top: 5px; left: 5px;">New VA (Akceptacja)</span>
                        <div style="width:50%; height:8px; background:#34d399; margin: 20px 5px 4px; opacity:0.6;"></div>
                        <div style="width:100%; height:8px; background:#34d399; margin: 4px 5px; opacity:0.8;"></div>
                        <div style="width:60%; height:8px; background:#34d399; margin: 4px 5px; opacity:0.6;"></div>
                    </div>
                </div>
                <button class="nav-btn sim-trigger-btn">Aplikuj Szok Płynnościowy (Imbalance)</button>
            </div>
        `;

        const btn = container.querySelector('.sim-trigger-btn');
        const price = document.getElementById('amt-price-tracker');
        const title = document.getElementById('amt-sim-title');
        const oldVA = document.getElementById('amt-old-va');
        const newVA = document.getElementById('amt-new-va');

        let isBalance = true;

        btn.addEventListener('click', () => {
            if (!isBalance) return;
            isBalance = false;
            
            btn.style.opacity = "0.5";
            btn.style.pointerEvents = "none";
            
            title.innerHTML = `Faza: <span style="color:#f87171;">IMBALANCE</span> (Szukanie Wartości)`;
            price.style.left = "45%";
            price.style.background = "#f87171";
            price.style.boxShadow = "0 0 15px #f87171";
            oldVA.style.opacity = "0.3";

            setTimeout(() => {
                price.style.left = "75%";
                price.style.background = "#34d399";
                price.style.boxShadow = "0 0 15px #34d399";
                
                setTimeout(() => {
                    title.innerHTML = `Faza: <span style="color:#34d399;">NEW BALANCE</span> (Nowa Akceptacja)`;
                    newVA.style.opacity = "1";

                    setTimeout(() => {
                        isBalance = true;
                        btn.style.opacity = "1";
                        btn.style.pointerEvents = "auto";
                        title.textContent = "Faza: BALANCE (Uczciwa Wycena)";
                        price.style.left = "20%";
                        price.style.background = "#fff";
                        price.style.boxShadow = "0 0 10px #fff";
                        oldVA.style.opacity = "1";
                        newVA.style.opacity = "0";
                    }, 4000);
                }, 1000);
            }, 800);
        });
    };

    // ===============================================
    // 2. Volume Profile (LVN Rejection)
    // ===============================================
    const initVPSim = () => {
        const container = document.getElementById('sim-vp-container');
        if (!container) return;

        container.innerHTML = `
            <div class="sim-board sim-vp-board">
                <div class="sim-title">Zarządzanie LVN (Próżnia Płynnościowa)</div>
                <div class="sim-vp-grid">
                    <div class="sim-vp-profile">
                        <div class="vp-bar hvn" style="width: 80%;"></div>
                        <div class="vp-bar hvn" style="width: 100%;">POC</div>
                        <div class="vp-bar hvn" style="width: 70%;"></div>
                        <div class="vp-bar lvn" style="width: 15%;">LVN</div>
                        <div class="vp-bar lvn" style="width: 10%;">LVN</div>
                        <div class="vp-bar hvn" style="width: 60%;"></div>
                        <div class="vp-bar hvn" style="width: 85%;"></div>
                    </div>
                    <div class="sim-vp-action">
                        <div class="sim-vp-price-ball"></div>
                        <button class="nav-btn sim-vp-btn">Inicjuj Test Płynności (Pullback)</button>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('.sim-vp-btn');
        const ball = container.querySelector('.sim-vp-price-ball');
        const title = container.querySelector('.sim-title');

        btn.addEventListener('click', () => {
            btn.style.pointerEvents = "none";
            btn.style.opacity = "0.5";
            title.textContent = "Cena uderza w pustkę (LVN)...";
            
            ball.style.transition = "transform 0.4s ease-in";
            ball.style.transform = "translateY(90px)";
            
            setTimeout(() => {
                title.textContent = "Brak Akceptacji! (Mechaniczne Rejection)";
                title.style.color = "#34d399";
                
                ball.style.transition = "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                ball.style.transform = "translateY(0px)";
                ball.style.backgroundColor = "#34d399";
                ball.style.boxShadow = "0 0 20px #34d399";

                setTimeout(() => {
                    title.textContent = "Zarządzanie LVN (Próżnia Płynnościowa)";
                    title.style.color = "var(--text-primary)";
                    ball.style.backgroundColor = "var(--text-primary)";
                    ball.style.boxShadow = "0 0 10px rgba(255,255,255,0.2)";
                    btn.style.pointerEvents = "auto";
                    btn.style.opacity = "1";
                }, 2000);
            }, 450);
        });
    };

    // ===============================================
    // 3. VWAP Minigame (Redesigned: Trend vs Knife)
    // ===============================================
    const initVWAPSim = () => {
        const container = document.getElementById('sim-vwap-container');
        if (!container) return;

        container.innerHTML = `
            <div class="sim-board">
                <div class="sim-title" id="vwap-title">VWAP w silnym Imbalansie (Trend Wzrostowy)</div>
                <div style="position:relative; height: 180px; border: 1px solid var(--glass-border); border-radius: 8px; overflow:hidden; background: rgba(0,0,0,0.2);">
                    <div style="position:absolute; top:70%; left:0; right:0; height:3px; background:var(--accent-glow); box-shadow: 0 0 8px var(--accent-glow);"></div>
                    <span style="position:absolute; right: 10px; top: 75%; font-size: 0.75rem; color: var(--accent-glow); font-weight: bold;">VWAP</span>
                    <div id="vwap-price-path" style="position:absolute; bottom:30%; left:45%; width:18px; height:18px; background:#fff; border-radius:50%; box-shadow: 0 0 10px #fff; transition: all 0.5s ease;"></div>
                </div>
                <div style="margin-top: 20px;">
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px;">Cena w silnym trendzie cofa się do linii VWAP. Twoja egzekucja:</p>
                    <div style="display:flex; gap:10px; justify-content:center;">
                        <button class="nav-btn" id="vwap-btn-long" style="border-color:#34d399; color:#34d399;">LONG (Odbicie z trendem)</button>
                        <button class="nav-btn" id="vwap-btn-short" style="border-color:#f87171; color:#f87171;">SHORT (Łapię nóż pod prąd)</button>
                    </div>
                </div>
            </div>
        `;

        const title = document.getElementById('vwap-title');
        const price = document.getElementById('vwap-price-path');
        const btnLong = document.getElementById('vwap-btn-long');
        const btnShort = document.getElementById('vwap-btn-short');

        const execute = (choice) => {
            btnLong.style.pointerEvents = "none";
            btnShort.style.pointerEvents = "none";
            
            // Animation: Price drops to VWAP
            price.style.bottom = "28%";

            setTimeout(() => {
                if (choice === 'long') {
                    price.style.bottom = "85%";
                    price.style.background = "#34d399";
                    price.style.boxShadow = "0 0 15px #34d399";
                    title.textContent = "Perfekcyjnie. Instytucje bronią VWAP. W trendzie to trampolina.";
                    title.style.color = "#34d399";
                } else {
                    price.style.bottom = "85%"; // Shoots up anyway, destroying the shorter
                    price.style.background = "#f87171";
                    price.style.boxShadow = "0 0 15px #f87171";
                    title.textContent = "Likwidacja! Złapałeś spadający nóż pod prąd. Jesteś płynnością.";
                    title.style.color = "#f87171";
                }

                setTimeout(() => {
                    price.style.bottom = "30%";
                    price.style.background = "#fff";
                    price.style.boxShadow = "0 0 10px #fff";
                    title.textContent = "VWAP w silnym Imbalansie (Trend Wzrostowy)";
                    title.style.color = "var(--text-primary)";
                    btnLong.style.pointerEvents = "auto";
                    btnShort.style.pointerEvents = "auto";
                }, 3500);
            }, 500);
        };

        btnLong.addEventListener('click', () => execute('long'));
        btnShort.addEventListener('click', () => execute('short'));
    };

    // ===============================================
    // 4. VSA Minigame (Spot the Anomaly)
    // ===============================================
    const initVSASim = () => {
        const container = document.getElementById('sim-vsa-container');
        if (!container) return;

        container.innerHTML = `
            <div class="sim-board">
                <div class="sim-title" id="vsa-title">VSA: Zidentyfikuj Anomalie</div>
                <div style="display:flex; justify-content:center; gap: 40px; margin: 20px 0; height: 160px; border-bottom: 1px solid var(--glass-border);">
                    <!-- Candle Structure -->
                    <div style="position:relative; width: 40px; height: 100%; display:flex; flex-direction:column; justify-content:flex-end;">
                        <div id="vsa-wick" style="width:2px; height:120px; background:#fff; margin:0 auto; position:absolute; left:19px; bottom: 0;"></div>
                        <div id="vsa-candle" style="width:40px; height: 100px; background:#34d399; position:absolute; bottom: 0; transition: height 0.3s;"></div>
                    </div>
                    <!-- Volume Structure -->
                    <div style="display:flex; align-items:flex-end; height:100%;">
                        <div id="vsa-vol" style="width:40px; height: 120px; background:rgba(52, 211, 153, 0.5); transition: height 0.3s;"></div>
                    </div>
                </div>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button class="nav-btn" id="vsa-btn-zdrowy">Zdrowy Ruch</button>
                    <button class="nav-btn" id="vsa-btn-anomalia">Anomalia (Hidden Selling)</button>
                </div>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-top:15px;">Po lewej Świeca (Rezultat), po prawej Wolumen (Wysiłek).</p>
            </div>
        `;

        const title = document.getElementById('vsa-title');
        const candle = document.getElementById('vsa-candle');
        const vol = document.getElementById('vsa-vol');
        const btnZdrowy = document.getElementById('vsa-btn-zdrowy');
        const btnAnomalia = document.getElementById('vsa-btn-anomalia');

        let isAnomaly = false;

        const generateSetup = () => {
            isAnomaly = Math.random() > 0.5;

            if (isAnomaly) {
                // High Volume, Small Candle (Hidden Selling)
                vol.style.height = '140px';
                candle.style.height = '20px'; 
            } else {
                // High Volume, Big Candle
                vol.style.height = '140px';
                candle.style.height = '120px';
            }
        };

        const verify = (guessAnomaly) => {
            if (guessAnomaly === isAnomaly) {
                title.textContent = "Prawidłowo! Świetnie czytasz Effort vs Result.";
                title.style.color = "#34d399";
            } else {
                title.textContent = "Błąd. Dałeś się wciągnąć w pułapkę instytucji.";
                title.style.color = "#f87171";
            }

            btnZdrowy.style.pointerEvents = "none";
            btnAnomalia.style.pointerEvents = "none";

            setTimeout(() => {
                title.textContent = "VSA: Zidentyfikuj Anomalie";
                title.style.color = "var(--text-primary)";
                generateSetup();
                btnZdrowy.style.pointerEvents = "auto";
                btnAnomalia.style.pointerEvents = "auto";
            }, 2000);
        };

        btnZdrowy.addEventListener('click', () => verify(false));
        btnAnomalia.addEventListener('click', () => verify(true));

        generateSetup(); 
    };

    // ===============================================
    // 5. Orderflow Tape (Click reaction minigame)
    // ===============================================
    const initOFSim = () => {
        const container = document.getElementById('sim-of-container');
        if (!container) return;

        container.innerHTML = `
            <div class="sim-board">
                <div class="sim-title" id="of-title">Zarządzanie Taśmą: Uderz, gdy Limit wchłonie MKT (Absorpcja)</div>
                <div class="sim-of-tape">
                    <div class="tape-header"><span>BID (Mkt Sell)</span><span>ASK (Mkt Buy)</span></div>
                    <div class="tape-row" id="tape-live">
                        <span class="tape-bid" id="tape-bid">0</span>
                        <span class="tape-ask" id="tape-ask">0</span>
                    </div>
                </div>
                <button class="nav-btn sim-of-btn">Reaguj!</button>
            </div>
        `;

        const bidEl = document.getElementById('tape-bid');
        const askEl = document.getElementById('tape-ask');
        const btn = container.querySelector('.sim-of-btn');
        const title = document.getElementById('of-title');

        let isAbsorbing = false;

        const tapeInterval = setInterval(() => {
            const bidVol = Math.floor(Math.random() * 50);
            const askVol = Math.floor(Math.random() * 50);
            
            if (Math.random() > 0.80) {
                isAbsorbing = true;
                bidEl.textContent = Math.floor(Math.random() * 800) + 400; // Gigantic red hit
                bidEl.style.background = "rgba(248, 113, 113, 0.2)";
                askEl.textContent = askVol;
                
                setTimeout(() => { 
                    isAbsorbing = false; 
                    bidEl.style.background = "rgba(255,255,255,0.02)";
                }, 700);
            } else {
                bidEl.textContent = bidVol;
                askEl.textContent = askVol;
                bidEl.style.background = "rgba(255,255,255,0.02)";
            }
        }, 500);

        activeIntervals.push(tapeInterval);

        btn.addEventListener('click', () => {
            if (isAbsorbing) {
                title.textContent = "Precyzyjna Egzekucja! Limit wchłonął agresję.";
                title.style.color = "#34d399";
                container.style.borderColor = "#34d399";
            } else {
                title.textContent = "Błąd! Wszedłeś w losowym szumie.";
                title.style.color = "#f87171";
                container.style.borderColor = "#f87171";
            }
            
            setTimeout(() => {
                title.textContent = "Zarządzanie Taśmą: Uderz, gdy Limit wchłonie MKT (Absorpcja)";
                title.style.color = "var(--text-primary)";
                container.style.borderColor = "var(--glass-border)";
            }, 1500);
        });
    };

    return { mount };
})();