document.addEventListener("DOMContentLoaded", () => {
    // 1. ZWIĘKSZONY RUCH TŁA (Ambient)
    const ambient = document.getElementById('ambient') || document.getElementById('ambient-wrapper');
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 180; 
        targetY = (e.clientY / window.innerHeight - 0.5) * 180;
    });

    function animateAmbient() {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        if (ambient) {
            ambient.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
        requestAnimationFrame(animateAmbient);
    }
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animateAmbient();
    }

    // 2. EFEKT SPOTLIGHT NA KARTACH (Glassmorphism 2.0 Hover)
    document.querySelectorAll('.folder-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    updateSessions(); 
    updateProgressUI();
});

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
    if(widget) widget.classList.toggle('collapsed');
}

// Theme management with system preference detection
let isLight = false;
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    isLight = true; 
    document.body.classList.add('light-theme'); 
}

function updateThemeBtn() {
    const btn = document.getElementById('theme-btn');
    if(btn) {
        btn.innerHTML = isLight ? 
            '<span class="pl">🌙 Ciemny Motyw</span><span class="en">🌙 Dark Mode</span>' : 
            '<span class="pl">☀️ Jasny Motyw</span><span class="en">☀️ Light Mode</span>';
    }
}
updateThemeBtn();

function toggleTheme() {
    isLight = !isLight; 
    document.body.classList.toggle('light-theme', isLight);
    updateThemeBtn();
    // Safely call chart render if ChartEngine script is loaded
    if (typeof charts !== 'undefined') charts.forEach(c => c.render()); 
}

// Language toggle state management
let currentLang = 'pl'; // Default to PL
function toggleLang() {
    currentLang = currentLang === 'pl' ? 'en' : 'pl';
    document.body.classList.remove('lang-pl', 'lang-en');
    document.body.classList.add('lang-' + currentLang);
    updateSessions();
    updateBreadcrumbs();
    
    // Odśwież tłumaczenie quizu jeśli jest otwarty
    if(currentQuiz && currentQuiz.active) renderQuizQuestion();
}

// CSS variables utility
const cssVar = (name) => getComputedStyle(document.body).getPropertyValue(name).trim();
const tooltip = document.getElementById('tooltip');

// Tooltip positioning logic
function tt(e, title, text, accent) {
    if(!tooltip) return;
    tooltip.style.display = 'block';
    tooltip.style.setProperty('--tip-accent', accent || 'var(--up-color)');
    tooltip.innerHTML = `<strong>${title}</strong>${text}`;
    tooltip.style.left = (e.clientX + 15) + 'px'; 
    tooltip.style.top = (e.clientY + 15) + 'px';
}
function htt() { 
    if(tooltip) tooltip.style.display = 'none'; 
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
        if(dot) dot.classList.toggle('active', isOpen);
        
        let targetTime = isOpen ? closeTime : openTime;
        if (!isOpen && currentTime > closeTime) targetTime += 24 * 60;
        
        // Time diff calculation
        let diffMins = targetTime - currentTime;
        let h = Math.floor(diffMins / 60);
        let m = diffMins % 60;
        
        if(timeSpan) {
            if(isOpen) {
                timeSpan.innerText = currentLang === 'pl' ? `Zamyka za ${h}h ${m}m` : `Closes in ${h}h ${m}m`;
            } else {
                timeSpan.innerText = currentLang === 'pl' ? `Otwiera za ${h}h ${m}m` : `Opens in ${h}h ${m}m`;
            }
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
    const bc = document.getElementById('breadcrumbs');
    if(bc) bc.innerHTML = `📍 ${path.join(" > ")}`;
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
    
    // 2. Wymuszenie "Reflow" (zmuszamy przeglądarkę do zauważenia, że usunęliśmy klasy, bez tego animacja nie wystartuje na nowo)
    void document.body.offsetWidth;

    // 3. Odpalamy kaskadę premium dla nowego widoku i nawigacji
    // Szukamy elementów tylko w navbarze, breadcrumbsach i NOWO otwartej karcie
    const elementsToAnimate = document.querySelectorAll(`nav.fade-up-element, #breadcrumbs.fade-up-element, #view-${viewId} .fade-up-element`);

    elementsToAnimate.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.06}s`; // Odstęp kaskady (0.06s jest mega płynne)
        el.classList.add('animate');
    });
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
        const response = await fetch('https://cool-leaf-ade2.reiseiv.workers.dev/', {
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

// ==========================================
// QUIZ SYSTEM - TRUDNE PYTANIA WIEDZOWE
// ==========================================
const quizBank = {
    'cat-mech': [
        { 
            q_pl: "Co tak naprawdę jest fundamentalną przyczyną każdego ruchu ceny w górę na rynku (zjawisko orderflow pressure)?", 
            q_en: "What is truly the fundamental cause of any upward price movement (orderflow pressure) in the market?", 
            opts_pl: ["Większa ogólna liczba kupujących niż sprzedających zlecających na rynku.", "Agresywne zlecenia Market pochłaniające pasywną płynność Limitów na Ask.", "Przecięcie kluczowych średnich kroczących, które aktywuje algorytmy.", "Wzrost ogólnego wolumenu pod świecą."], 
            opts_en: ["A greater total number of buyers than sellers placing orders.", "Aggressive Market orders consuming passive Limit liquidity on the Ask.", "Large institutions crossing key moving averages.", "An increase in total volume beneath the candle."], 
            correct: 1 
        },
        { 
            q_pl: "Jak zjawisko 'Vacuum Effect' wpływa na cenę w momentach uderzenia twardych danych makroekonomicznych?", 
            q_en: "How does the 'Vacuum Effect' influence price during the release of hard macroeconomic data?", 
            opts_pl: ["Zasysa cenę w stronę największych stref Volume Profile (HVN) z powodu grawitacji.", "Cena gwałtownie 'skacze', ze względu na brak płynności pasywnej mogącej wchłonąć zlecenia uciekającego kapitału.", "Zmniejsza drastycznie spread świec z powodu braku detalistów na rynku.", "Powoduje zawsze odwrócenie trendu w stronę przeciwną do danych."], 
            opts_en: ["It sucks the price towards the largest Volume Profile zones (HVN) due to gravity.", "The price rapidly 'jumps' due to a lack of passive liquidity capable of absorbing fleeing capital orders.", "It drastically reduces candle spread due to a lack of retail traders.", "It always causes a trend reversal opposite to the data."], 
            correct: 1 
        },
        { 
            q_pl: "Jaki jest główny cel działań Market Makerów przy Options Pressure, który sztucznie rozpędza trend?", 
            q_en: "What is the main goal of Market Makers during Options Pressure, which artificially accelerates a trend?", 
            opts_pl: ["Zabezpieczenie Delta Neutral, wymuszające przymusowe kupno/sprzedaż aktywa bazowego jako hedge przeciwko opcjom detalu.", "Wyrzucenie detalistów z rynku na ich Stop Lossach dla zysku.", "Tworzenie fałszywych wybić (fakeouts) poza Value Area.", "Handel kierunkowy oparty na danych banków centralnych."], 
            opts_en: ["Delta Neutral hedging, forcing mandatory buying/selling of the underlying asset as a hedge against retail options.", "Stopping out retail traders for profit.", "Creating false breakouts (fakeouts) outside the Value Area.", "Directional trading based on central bank data."], 
            correct: 0 
        },
        { 
            q_pl: "Auction Market Theory (AMT) udowadnia, że rynek cały czas oscyluje między dwiema fazami poszukując uczciwej wartości. Są to:", 
            q_en: "Auction Market Theory (AMT) proves that the market constantly oscillates between two phases in search of fair value. These are:", 
            opts_pl: ["Konsolidacja i Dystrybucja.", "Uptrend i Downtrend.", "Balance i Imbalance.", "Overbought i Oversold."], 
            opts_en: ["Consolidation and Distribution.", "Uptrend and Downtrend.", "Balance and Imbalance.", "Overbought and Oversold."], 
            correct: 2 
        }
    ],
    'cat-amt': [
        { 
            q_pl: "Jak poprawnie definiuje się w logice AMT wejście rynku w fazę 'Imbalance'?", 
            q_en: "How is entering the 'Imbalance' phase correctly defined in AMT logic?", 
            opts_pl: ["Akceptacja ceny poza poprzednim Value Area, poparta zbudowaniem się i przesunięciem tam nowego wolumenu.", "Każdy pojedynczy knot świecy, który minimalnie przebija Value Area High lub Low.", "Ruch boczny (konsolidacja) tuż po silnym odczycie danych.", "Przecięcie linii POC (Point of Control) z góry na dół."], 
            opts_en: ["Acceptance of the price outside the previous Value Area, supported by building and shifting new volume there.", "Any single candle wick that slightly pierces the Value Area High or Low.", "Lateral movement (consolidation) right after a strong data read.", "Crossing the POC (Point of Control) line from top to bottom."], 
            correct: 0 
        },
        { 
            q_pl: "Jaki jest największy, klasyczny błąd w rozgrywaniu cyklu 'Balance -> Imbalance -> New Balance' podczas silnego trendu?", 
            q_en: "What is the biggest, classic mistake in playing the 'Balance -> Imbalance -> New Balance' cycle during a strong trend?", 
            opts_pl: ["Kupowanie po przebiciu szczytu (breakout).", "Pływanie z momentum zamiast realizacji zysków.", "Ciągłe uśrednianie w dół (szukanie noży) wierząc, że rynek musi w końcu wrócić do starego 'Fair Value'.", "Ignorowanie dywergencji na RSI."], 
            opts_en: ["Buying after a peak breakout.", "Riding the momentum instead of taking profits.", "Constantly averaging down (catching knives) believing the market must eventually return to the old 'Fair Value'.", "Ignoring RSI divergences."], 
            correct: 2 
        },
        { 
            q_pl: "Jakie zachowanie ceny wokół zewnętrznej bandy Value Area (np. VAH) świadczy o pozostaniu w trybie równowagi (Balance)?", 
            q_en: "What price behavior around the outer Value Area band (e.g., VAH) indicates remaining in equilibrium mode (Balance)?", 
            opts_pl: ["Ostre przebicie strefy i powolne budowanie tam kolejnych, rosnących świec.", "Gwałtowne odrzucenie (rejection) knotem przy skrajnej bandzie i natychmiastowy powrót w głąb profilu D.", "Wypłaszczenie wskaźnika CVD na samej górze.", "Zanik zmienności zaraz po przebiciu VAH w górę."], 
            opts_en: ["A sharp zone break and slowly building consecutive rising candles there.", "Violent rejection via a wick at the extreme band and an immediate return deep into the D-profile.", "Flattening of the CVD indicator at the very top.", "A disappearance of volatility right after breaking VAH upwards."], 
            correct: 1 
        },
        { 
            q_pl: "Ile procent obrotu (wolumenu) obejmuje klasyczna strefa Value Area w obrębie danego profilu sesji?", 
            q_en: "What percentage of turnover (volume) does the classic Value Area encompass within a given session profile?", 
            opts_pl: ["Dokładnie 50%.", "Około 68-70%.", "Wszystko powyżej 80%.", "Około 33% (tylko środkowa tercja)."], 
            opts_en: ["Exactly 50%.", "Around 68-70%.", "Everything above 80%.", "Around 33% (only the middle third)."], 
            correct: 1 
        }
    ],
    'cat-vp': [
        { 
            q_pl: "Dlaczego strefy Low Volume Node (LVN) wywołują tak szybkie, skokowe ruchy cenowe na wykresie?", 
            q_en: "Why do Low Volume Node (LVN) zones cause such rapid, jumping price movements on the chart?", 
            opts_pl: ["Ponieważ w przeszłości rynek udowodnił brak akceptacji tych poziomów (brak tam fair value), więc leci przez nie jak przez próżnię do kolejnego HVN.", "Ponieważ jest to miejsce nagromadzenia największej ilości zleceń Stop Loss przez co algorytmy z premedytacją je wybijają.", "Bo w strefach LVN giełdy blokują dodawanie nowych limitów.", "Ze względu na sztucznie wygenerowane przerwy w logice wskaźnika Volume Profile."], 
            opts_en: ["Because historically the market proved a lack of acceptance for these levels (no fair value), so it flies through them like a vacuum to the next HVN.", "Because it is the accumulation point of the largest amount of Stop Loss orders, so algorithms deliberately hunt them.", "Because exchanges block adding new limits in LVN zones.", "Due to artificially generated gaps in the Volume Profile indicator logic."], 
            correct: 0 
        },
        { 
            q_pl: "Czego spodziewamy się, widząc dzienny Volume Profile układający się w klasyczny kształt litery 'P'?", 
            q_en: "What do we expect when seeing a daily Volume Profile forming a classic 'P' shape?", 
            opts_pl: ["Dalszej konsolidacji bez jasnego kierunku.", "Presji podażowej (Long Liquidation), która zepchnie rynek.", "Presji wzrostowej (Short Covering), po której brzuszek 'P' działa jako twarde wsparcie dla zagrań Long.", "Natychmiastowego cofnięcia do najniższego punktu wczorajszej sesji."], 
            opts_en: ["Further consolidation without a clear direction.", "Supply pressure (Long Liquidation) that will push the market down.", "Upward pressure (Short Covering), after which the belly of the 'P' acts as hard support for Long plays.", "An immediate pullback to the lowest point of yesterday's session."], 
            correct: 2 
        },
        { 
            q_pl: "Najsilniejszy mechanicznie orderflow setup na pullback przy użyciu strefy LVN w mocnym trendzie zakłada:", 
            q_en: "The mechanically strongest orderflow setup for a pullback using the LVN zone in a strong trend involves:", 
            opts_pl: ["Zajęcie pozycji na kontynuację natychmiast po tym, jak cena wchodząc w LVN zostanie z niego gwałtownie odrzucona (rejection).", "Skalpowanie przeciw trendowi w samym środku pustej strefy LVN.", "Ustawienie sztywnych Limit Orders pośrodku LVN.", "Czekanie aż strefa LVN wypełni się wolumenem i zmieni w HVN."], 
            opts_en: ["Entering a continuation position immediately after the price entering LVN gets violently rejected from it.", "Scalping against the trend in the very middle of the empty LVN zone.", "Setting rigid Limit Orders in the middle of LVN.", "Waiting for the LVN zone to fill with volume and turn into an HVN."], 
            correct: 0 
        },
        { 
            q_pl: "POC (Point of Control) na profilu działa w wielu sytuacjach jak 'magnes', co oznacza że:", 
            q_en: "POC (Point of Control) on the profile acts in many situations like a 'magnet', which means that:", 
            opts_pl: ["Cena nigdy go nie przebija w pierwszym uderzeniu.", "Gdy cena ucieka bez siły strukturalnej, ma tendencję do ściągania z powrotem do poziomu POC, gdzie znajduje się maksymalna akceptacja (Fair Value).", "Odrzuca cenę na setki ticków w dół, ilekroć się do niego zbliży.", "Zawsze wyznacza dokładne dno danego trendu."], 
            opts_en: ["Price never breaks it on the first hit.", "When price drifts without structural strength, it tends to be pulled back to the POC level, where maximum acceptance (Fair Value) is found.", "It rejects the price hundreds of ticks down whenever it gets close.", "It always marks the exact bottom of a given trend."], 
            correct: 1 
        }
    ],
    'cat-vwap': [
        { 
            q_pl: "W czym Anchored VWAP deklasuje klasyczne średnie kroczące (SMA) z punktu widzenia tradingu instytucjonalnego?", 
            q_en: "How does Anchored VWAP completely outclass classic moving averages (SMA) from an institutional trading perspective?", 
            opts_pl: ["SMA pozwala na szybszą reakcję algorytmów.", "VWAP jako jedyny waży średnią cenę obrotem wolumenowym, pokazując gdzie realnie został zablokowany 'gruby kapitał', a nie tylko upływ czasu.", "VWAP jest jedynym wskaźnikiem nie mającym tzw. 're-paintu'.", "Średnie kroczące działają tylko na wykresach liniowych, nie świecowych."], 
            opts_en: ["SMA allows for faster algorithm reaction.", "VWAP uniquely weights the average price with volume turnover, showing where 'heavy capital' was realistically locked in, not just the passage of time.", "VWAP is the only indicator that doesn't 'repaint'.", "Moving averages only work on line charts, not candlestick charts."], 
            correct: 1 
        },
        { 
            q_pl: "Czego boleśnie doświadczy amator namiętnie stosujący strategię Mean Reversion (Powrót do VWAP) w środowisku potężnego rynkowego Imbalansu?", 
            q_en: "What will an amateur passionately applying the Mean Reversion (Return to VWAP) strategy painfully experience in a massive market Imbalance environment?", 
            opts_pl: ["Spadku zysków z powodu zbyt częstych wejść.", "Tzw. łapania spadających noży – przy silnym Imbalansie cena potrafi oderwać się od VWAP i ani razu nie wrócić aż do końca sesji.", "Odbić technicznych tylko do pierwszej bandy VWAP zamiast do głównej osi.", "Problemów technicznych z ładowaniem wskaźnika."], 
            opts_en: ["A drop in profits due to overtrading.", "So-called catching falling knives – in a strong Imbalance, price can detach from VWAP and never return until the end of the session.", "Technical bounces only to the first VWAP band instead of the main axis.", "Technical issues with indicator loading."], 
            correct: 1 
        },
        { 
            q_pl: "Jak traktujemy zewnętrzne bandy VWAP (odchylenia standardowe) zgodnie z mechaniką rynkową?", 
            q_en: "How do we treat the outer VWAP bands (standard deviations) according to market mechanics?", 
            opts_pl: ["Jako sztywne strefy Overbought / Oversold niczym na RSI.", "Jako miejsca gdzie wolumen spada do całkowitego zera.", "Jako dynamiczne odpowiedniki stref VAH i VAL; kiedy cena je przebija i zaczyna budować wolumen, inicjowany jest kierunkowy Imbalance.", "Jako gwarantowane miejsca na Stop Loss."], 
            opts_en: ["As rigid Overbought / Oversold zones just like on RSI.", "As places where volume drops to absolute zero.", "As dynamic equivalents of VAH and VAL zones; when price breaks them and starts building volume, a directional Imbalance is initiated.", "As guaranteed Stop Loss placements."], 
            correct: 2 
        },
        { 
            q_pl: "Zaczepiłeś (Anchored) VWAP na absolutnym szczycie formacji (High), po czym rynek zanurkował. Czego oczekujesz przy ewentualnym powrocie pod tę linię VWAP?", 
            q_en: "You Anchored the VWAP at the absolute peak of a formation (High), after which the market dived. What do you expect upon a potential return under this VWAP line?", 
            opts_pl: ["Że zadziała jako potężny dynamiczny opór (S&R), weryfikujący czy sprzedający nadal bronią swoich pozycji i kontrolują rynek z tego szczytu.", "Że automatycznie unieważni całą strukturę spadkową.", "Że cena uderzy w niego pozostawiając dywergencję na oscylatorze MACD.", "Że wskaźnik ulegnie resetowi punktu zaczepienia."], 
            opts_en: ["That it will act as a massive dynamic resistance (S&R), verifying if sellers are still defending their positions and controlling the market from that peak.", "That it will automatically invalidate the entire downtrend structure.", "That price will hit it leaving a divergence on the MACD oscillator.", "That the indicator will reset its anchor point."], 
            correct: 0 
        }
    ],
    'cat-vsa': [
        { 
            q_pl: "Wyobraź sobie 'Hidden Selling' oparty na logice VSA. Jak dokładnie taka pułapka wygląda na wykresie?", 
            q_en: "Imagine 'Hidden Selling' based on VSA logic. What exactly does such a trap look like on the chart?", 
            opts_pl: ["Czerwona świeca z ogromnym spreadem i małym wolumenem ukrywająca spadki.", "Świeca rośnie na gigantycznym wolumenie (olbrzymi Effort kupujących), ale jej spread jest duszony, zawęża się i zamyka niżej (brak Result), bo na asce limitami cicho ładuje się podaż.", "Brak jakiejkolwiek świecy pomimo dużego obrotu na giełdzie.", "Ukryte rozszerzenie spreadu na małym obrocie."], 
            opts_en: ["A red candle with a huge spread and low volume hiding declines.", "The candle rises on gigantic volume (huge buyer Effort), but its spread is choked, narrows, and closes lower (lack of Result) because supply is quietly loading via limits on the ask.", "Absence of any candle despite high turnover on the exchange.", "Hidden spread expansion on low volume."], 
            correct: 1 
        },
        { 
            q_pl: "Widzisz 'Stopping Volume' w mocnym trendzie spadkowym. Jak rozpoznać, że kapitał instytucjonalny wszedł do gry by zatrzymać ten spadek?", 
            q_en: "You see 'Stopping Volume' in a strong downtrend. How do you recognize that institutional capital has stepped in to stop this decline?", 
            opts_pl: ["Pojawia się ogromna, pełna czerwona świeca bez żadnych knotów (tzw. Marubozu).", "Cena drastycznie zwalnia, a wolumen po prostu znika (No Supply).", "Powstaje olbrzymia świeca spadkowa z gigantycznym obrotem, ale pozostawia po sobie bardzo długi dolny knot i zamyka się zauważalnie wyżej – spadki zostały wyłapane przez ogromne limity kupujących.", "Wskaźnik RSI przecina linię 30 z dołu do góry."], 
            opts_en: ["A huge, full red candle appears without any wicks (so-called Marubozu).", "Price drastically slows down, and volume simply disappears (No Supply).", "A massive down candle is formed with gigantic volume, but it leaves behind a very long bottom wick and closes noticeably higher - the drops were absorbed by huge buyer limits.", "The RSI indicator crosses the 30 line from the bottom up."], 
            correct: 2 
        },
        { 
            q_pl: "Jak w praktyce prezentuje się korekta typu 'No Supply' podczas trwania zdrowego trendu wzrostowego?", 
            q_en: "How does a 'No Supply' correction practically present itself during a healthy uptrend?", 
            opts_pl: ["Wąskie świece korekcyjne w dół (mały spread), przy których wolumen dosłownie 'wysycha'. Oznacza to brak chęci sprzedaży i gotowość do wystrzału.", "Długie i agresywne świece spadkowe z mocno rosnącym wolumenem w trakcie zjazdu.", "Ruch boczny ze skokowo wzrastającymi słupkami wolumenu na zmianę zielonymi i czerwonymi.", "Cena rośnie dalej, ale na malejącym wolumenie bez korekt w dół."], 
            opts_en: ["Narrow downward correction candles (small spread), where the volume literally 'dries up'. This signifies a lack of selling desire and readiness to shoot up.", "Long and aggressive downward candles with sharply rising volume during the slide.", "Lateral movement with jumping volume bars alternating green and red.", "Price continues to rise, but on decreasing volume without downward corrections."], 
            correct: 0 
        },
        { 
            q_pl: "Dlaczego 'Buying Climax' tak brutalnie niszczy konta wchodzących w niego detalistów (tzw. FOMO Trap)?", 
            q_en: "Why does 'Buying Climax' so brutally destroy the accounts of retail traders entering it (so-called FOMO Trap)?", 
            opts_pl: ["Bo brokerzy specjalnie manipulują kwotowaniami cen w takich momentach.", "Bo występuje przed ogłoszeniem stóp procentowych.", "Gdyż instytucje używają tego euforycznego wystrzału i rynkowej płynności detalistów (gigantyczny wolumen i szeroki spread w górę) do bezlitosnego załadowania swoich Shortów zamykając w nich całe FOMO.", "Bo algorytmy giełdowe odłączają się od serwera widząc zbyt duży zysk detalistów."], 
            opts_en: ["Because brokers deliberately manipulate price quotes in such moments.", "Because it occurs before interest rate announcements.", "Because institutions use this euphoric spike and retail market liquidity (gigantic volume and wide upward spread) to mercilessly load their Shorts, trapping all the FOMO inside.", "Because exchange algorithms disconnect from the server seeing too much retail profit."], 
            correct: 2 
        }
    ],
    'cat-of': [
        { 
            q_pl: "Czym charakteryzuje się prawidłowa 'Absorpcja' wyłapana na taśmie (Footprint) tuż przed potencjalnym odwróceniem struktury?", 
            q_en: "What characterizes a proper 'Absorption' caught on the tape (Footprint) right before a potential structure reversal?", 
            opts_pl: ["Wyczerpanie się kapitału i same wartości '0' po jednej ze stron orderbooka.", "Dziesiątki agresywnych zleceń Market uderzających w jeden poziom (tworząc widocznie gruby klaster), lecz cena nie posuwa się ani ticka dalej, bo jest całkowicie 'zjadana' przez barierę zleceń Limit.", "Spadek całkowitej Delty do zera pomimo wzrostów.", "Brak transakcji ze strony obu uczestników rynku na przestrzeni dłuższego czasu."], 
            opts_en: ["Capital exhaustion and only '0' values on one side of the orderbook.", "Dozens of aggressive Market orders hitting one level (forming a visibly fat cluster), but the price doesn't move a single tick further because it's completely 'eaten' by a barrier of Limit orders.", "A drop of total Delta to zero despite uptrends.", "Lack of transactions from both market participants over a longer period of time."], 
            correct: 1 
        },
        { 
            q_pl: "W jakich warunkach wskaźnik CVD (Cumulative Volume Delta) tworzy książkową dywergencję, będącą czerwoną flagą dla dominującego trendu?", 
            q_en: "Under what conditions does the CVD (Cumulative Volume Delta) indicator create a textbook divergence, acting as a red flag for the dominant trend?", 
            opts_pl: ["Kiedy cena i CVD poruszają się w idealnej synergii w górę.", "Kiedy wykres ceny robi nowe, wyższe szczyty (Higher Highs), ale linia sumarycznej Delty (CVD) zaczyna dramatycznie opadać w dół, co obnaża brak realnego, ukrytego paliwa w ataku.", "Gdy Delta na każdej kolejnej świecy jest perfekcyjnie równa 0.", "Jeżeli CVD rośnie szybciej niż wskazuje na to MACD."], 
            opts_en: ["When price and CVD move in perfect upward synergy.", "When the price chart makes new, higher peaks (Higher Highs), but the total Delta line (CVD) starts to dramatically fall down, exposing a lack of real, hidden fuel in the attack.", "When the Delta on each consecutive candle is perfectly equal to 0.", "If CVD rises faster than indicated by MACD."], 
            correct: 1 
        },
        { 
            q_pl: "Czytanie danych z footprintu wymaga analizy 'Po Skosie' (Diagonal Reading). Z czego wynika ten mechaniczny fakt?", 
            q_en: "Reading footprint data requires 'Diagonal Reading'. What mechanical fact causes this?", 
            opts_pl: ["Zależy to od opóźnień między wejściem zlecenia a realizacją u dostawcy danych.", "Market Buyer uderzając z rynku zdejmuje płynność z ofert sprzedaży (Ask) szczebel wyżej w drabince DOM, a Market Seller uderza w zaparkowane wsparcie (Bid) poziom niżej.", "Footprint generuje ukryty błąd w mapowaniu ticków i trzeba to kompensować wzrokiem.", "Dlatego, że instytucje umyślnie kamuflują w ten sposób limity przed detalem."], 
            opts_en: ["It depends on the delays between order entry and execution at the data provider.", "A Market Buyer hitting from the market removes liquidity from sell offers (Ask) a tier higher in the DOM ladder, and a Market Seller hits parked support (Bid) a level lower.", "Footprint generates a hidden error in tick mapping and it must be visually compensated.", "Because institutions deliberately camouflage limits from retail this way."], 
            correct: 1 
        },
        { 
            q_pl: "Jeśli na krawędzi świecy trendowej (np. na samym dole knota przy spadkach) Footprint ukazuje wartości 0 lub 1 na uderzeniach Bid. Mamy tu do czynienia zjawiskiem:", 
            q_en: "If at the edge of a trend candle (e.g., at the very bottom of a wick during drops) the Footprint shows values of 0 or 1 on Bid hits. We are dealing with the phenomenon of:", 
            opts_pl: ["Masywnej Absorpcji przez niewidzialnego Market Makera.", "Zjawiskiem 'Exhaustion' – totalnego wyczerpania agresorów i wyschnięcia siły podaży tuż przed prawdopodobnym powrotem kupujących (Flip).", "Akumulacji wolumenu prowadzącej do kontynuacji spadków w dół.", "Błędu w odczycie wygenerowanym przez Flash Crash."], 
            opts_en: ["Massive Absorption by an invisible Market Maker.", "The 'Exhaustion' phenomenon - total depletion of aggressors and drying up of supply strength right before a probable return of buyers (Flip).", "Volume accumulation leading to a continuation of drops downwards.", "A reading error generated by a Flash Crash."], 
            correct: 1 
        }
    ],
    'cat-fund': [
        { 
            q_pl: "Najważniejsza zasada profesjonalnego podejścia do publikacji 'Grubego Makro' (np. CPI) z perspektywy Orderflow brzmi:", 
            q_en: "The most important rule of the professional approach to 'Heavy Macro' publications (e.g., CPI) from an Orderflow perspective is:", 
            opts_pl: ["Zawsze zgaduj kierunek grając ogromną dźwignią na 5 minut przed odczytem.", "Wstrzymaj się i schowaj. Płynność w Orderbooku paruje, poślizgi są ogromne. Poczekaj aż algorytmy opadną, uformuje się nowy profil wyceny, i dołącz z bezpiecznym trendem na własnych warunkach.", "Handluj agresywnie zjawisko 'Vacuum Effect' zaraz w 1 sekundzie po otwarciu.", "Zwracaj uwagę tylko na liczby w raporcie, jeśli są zielone - bez wahania naciskaj Buy."], 
            opts_en: ["Always guess the direction by trading with huge leverage 5 minutes before the read.", "Hold off and hide. Liquidity in the Orderbook evaporates, slippage is huge. Wait for algorithms to settle, a new valuation profile to form, and join the safe trend on your own terms.", "Aggressively trade the 'Vacuum Effect' phenomenon right in the 1st second after opening.", "Only pay attention to the numbers in the report, if they are green - hit Buy without hesitation."], 
            correct: 1 
        },
        { 
            q_pl: "Dla tradera stricte Intraday, czytającego taśmę, dogłębna analiza wskaźników makro (dlaczego inflacja bazowa spadła o 0.1%) jest:", 
            q_en: "For a strict Intraday trader reading the tape, an in-depth analysis of macro indicators (why core inflation dropped by 0.1%) is:", 
            opts_pl: ["Kluczem do sukcesu, wymaganym w budowaniu modeli wyprzedzających rynek.", "Całkowicie bezużyteczna. Wszystkie fundamentalne i makro informacje są już instant wycenione i fizycznie ułożone na taśmie w postaci agresywnego Orderflow (Repricing) przez duże instytucje.", "Wymagana tylko na rynkach walutowych Forex.", "Konieczna by ustawić prawidłowy SL na wypadek szpilek."], 
            opts_en: ["The key to success, required in building market-beating models.", "Completely useless. All fundamental and macro information is instantly priced in and physically laid out on the tape in the form of aggressive Orderflow (Repricing) by large institutions.", "Required only in Forex currency markets.", "Necessary to set a proper SL in case of spikes."], 
            correct: 1 
        },
        { 
            q_pl: "Kiedy duży kapitał uderza ogromnymi zleceniami podczas publikacji, by zre-kalibrować poziom na nowy Fair Value (Repricing), jak zachowuje się stara strefa POC?", 
            q_en: "When big capital hits with massive orders during a publication to recalibrate the level to a new Fair Value (Repricing), how does the old POC zone behave?", 
            opts_pl: ["Zawsze przyciąga cenę z powrotem by dokonać wyrównania rynkowego.", "Zostaje błyskawicznie złamana i zanegowana. Rynek wyłącza szacunek do starego 'Balance' dopóki nie zbuduje mocnych fundamentów nowej, aktualnej wyceny rynkowej na nowych pułapach.", "Służy jako ostateczna zapora oporu (Resistance) przed ucieczką.", "Zamienia się na LVN."], 
            opts_en: ["It always pulls the price back to perform market equalization.", "It is instantly broken and negated. The market turns off respect for the old 'Balance' until it builds strong foundations for a new, current market valuation at new levels.", "It serves as the ultimate resistance barrier before the escape.", "It turns into an LVN."], 
            correct: 1 
        },
        { 
            q_pl: "Jeżeli na danych widzisz 'Vacuum Effect' i potężny skok w górę. Gdzie w takiej sytuacji szukasz najbezpieczniejszego punktu na wejście w Long?", 
            q_en: "If during data you see a 'Vacuum Effect' and a massive spike upwards. Where do you look for the safest point to enter Long in such a situation?", 
            opts_pl: ["Uderzasz z rynku (Market Buy) dokładnie na czubku największej świecy (FOMO).", "Czekasz na uformowanie się nowej bazy/wsparcia po ustaniu algorytmicznego chaosu i podpinasz się pod bezpieczny pullback z kierunkiem nowo ukształtowanego flow.", "Szukasz pierwszego lepszego knota by zagrać Short (Powrót do średniej).", "Składasz zlecenie na pierwszym przebitym podczas wystrzału LVN."], 
            opts_en: ["You hit the market (Market Buy) exactly at the top of the largest candle (FOMO).", "You wait for the formation of a new base/support after algorithmic chaos subsides and hitch onto a safe pullback in the direction of the newly formed flow.", "You look for the first random wick to play Short (Return to mean).", "You place an order on the first LVN broken during the spike."], 
            correct: 1 
        }
    ],
    'cat-risk': [
        { 
            q_pl: "Na czym polega zasada ustawiania Stop Lossa 'za Strukturą' (zgodnie z koncepcją Orderflow)?", 
            q_en: "What is the principle of setting a Stop Loss 'behind Structure' (according to the Orderflow concept)?", 
            opts_pl: ["Sztywny algorytm wyliczający zawsze ucięcie straty po 10 punktach indeksowych.", "Chowanie SL pod obiektywnym rynkowym 'pancerzem' (np. gruba strefa HVN lub mur Limitów - absorpcja). Gdy ten bastion pada, twoja koncepcja na trade definitywnie traci logiczny sens i trzeba ewakuować kapitał.", "Używanie wskaźnika ATR z nałożonym mnożnikiem x2.", "Wykorzystywanie lokalnego dołka z sesji azjatyckiej."], 
            opts_en: ["A rigid algorithm always cutting losses after 10 index points.", "Hiding the SL under an objective market 'armor' (e.g., a thick HVN zone or a wall of Limits - absorption). When this bastion falls, your concept for the trade definitively loses logical sense and capital must be evacuated.", "Using the ATR indicator with an applied x2 multiplier.", "Utilizing the local low from the Asian session."], 
            correct: 1 
        },
        { 
            q_pl: "Co różni 'Live Cut' (Ucinanie strat z ręki) u profesjonalnego tradera z Orderflow od nadziei detalisty na utrzymanie twardego SL?", 
            q_en: "What differentiates a 'Live Cut' (Manual loss cutting) by a professional Orderflow trader from a retail trader's hope of holding a hard SL?", 
            opts_pl: ["Orderflow trader widząc na mikroskopie (Footprint, Delta) że broniąca go struktura i wolumen załamały się, a siła rynkowa (Imbalance) odwróciła przeciwko niemu – ewakuuje pozycję od razu z minimalnym kosztem, nie czekając z modlitwą na egzekucję pełnego twardego SL.", "Profesjonalista nigdy nie zamyka stratnej pozycji z palca.", "Live Cut powoduje mniejsze prowizje brokerskie na rynkach lewarowanych.", "Detalista wierzy w narzędzia, a pro-trader wierzy we wskaźnik RSI."], 
            opts_en: ["An Orderflow trader seeing on the microscope (Footprint, Delta) that the structure and volume defending them have collapsed, and market strength (Imbalance) has turned against them - evacuates the position immediately at minimal cost, not waiting with a prayer for the execution of the full hard SL.", "A professional never closes a losing position manually.", "A Live Cut results in lower brokerage commissions in leveraged markets.", "A retail trader believes in tools, and a pro trader believes in the RSI indicator."], 
            correct: 0 
        },
        { 
            q_pl: "Jakie ryzyko niesie za sobą bazowanie zarządzania ryzykiem WŁĄCZNIE i wyłącznie na magicznych parametrach 1% / stały R:R, z pominięciem głębi mapy rynkowej?", 
            q_en: "What is the risk of basing risk management SOLELY and exclusively on magical parameters 1% / fixed R:R, ignoring the depth of the market map?", 
            opts_pl: ["Broker nalicza za to dodatkowe spready.", "Prowadzi do nieuniknionego zjawiska zwanego Overtradingiem.", "Rynek (algorytmy) handluje od płynności do płynności, nie obchodzi go Twój portfel. Jeśli twój sztywny SL przypada wewnątrz brzuśca płynności (np. HVN), zostanie przypadkowo wyczyszczony w normalnym szumie przed docelowym strzałem rynkowym.", "Spowoduje to drastyczne problemy ze wskaźnikami typu średnie ruchome."], 
            opts_en: ["The broker charges additional spreads for this.", "It leads to the inevitable phenomenon called Overtrading.", "The market (algorithms) trades from liquidity to liquidity, it doesn't care about your wallet. If your rigid SL falls inside a liquidity belly (e.g., HVN), it will be randomly cleared in normal noise before the target market spike.", "It will cause drastic problems with indicators like moving averages."], 
            correct: 2 
        },
        { 
            q_pl: "Zagrałeś świetnego Longa od dołu, z SL poniżej mocnej absorpcji. Twoja pozycja wyjeżdża ostro na zielono, a następnie z ogromną Deltą Ujemną zaczyna gwałtownie zjeżdżać z powrotem. Jaka powinna być reakcja chroniąca zysk?", 
            q_en: "You played a great Long from the bottom, with an SL below strong absorption. Your position shoots deeply into the green, and then with a massive Negative Delta starts plunging rapidly back. What should be the reaction protecting the profit?", 
            opts_pl: ["Modlitwa i czekanie aż cena doleci znów do punktu wejścia z nadzieją na zjawisko 'Podwójnego Dna'.", "Szybki, pozbawiony emocji Take Profit z palca lub Trailing Stop, chroniący zysk, ucięcie po zauważeniu strukturalnego braku popytu i wyczerpania byków na szczycie.", "Przesunięcie twardego Stop Lossa niżej, by dać rynkowi 'oddech'.", "Zastosowanie strategii siatkowania zleceń (Martingale) by złagodzić uderzenie strat."], 
            opts_en: ["Praying and waiting until the price flies back to the entry point hoping for a 'Double Bottom' phenomenon.", "A quick, emotionless manual Take Profit or Trailing Stop, protecting profit, cutting after noticing a structural lack of demand and exhaustion of bulls at the top.", "Moving the hard Stop Loss lower to give the market 'breathing room'.", "Applying an order grid strategy (Martingale) to soften the blow of losses."], 
            correct: 1 
        }
    ]
};

let currentQuiz = { active: false, catId: null, qIndex: 0, score: 0, data: [] };

function startQuiz(catId) {
    if(!quizBank[catId]) return;
    currentQuiz = { active: true, catId: catId, qIndex: 0, score: 0, data: quizBank[catId] };
    document.getElementById('quiz-modal').classList.remove('collapsed');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const qData = currentQuiz.data[currentQuiz.qIndex];
    const content = document.getElementById('quiz-content');
    
    let qText = currentLang === 'pl' ? qData.q_pl : qData.q_en;
    let opts = currentLang === 'pl' ? qData.opts_pl : qData.opts_en;
    
    let html = `<div class="quiz-header"><span>${currentLang === 'pl' ? 'Pytanie' : 'Question'} ${currentQuiz.qIndex + 1} / ${currentQuiz.data.length}</span></div>`;
    html += `<div class="quiz-question">${qText}</div>`;
    
    opts.forEach((opt, idx) => {
        html += `<button class="quiz-option" onclick="checkAnswer(${idx}, this)">${opt}</button>`;
    });
    
    content.innerHTML = html;
}

function checkAnswer(selectedIdx, btnElement) {
    const qData = currentQuiz.data[currentQuiz.qIndex];
    const isCorrect = selectedIdx === qData.correct;
    const allBtns = document.querySelectorAll('.quiz-option');
    
    allBtns.forEach(b => b.style.pointerEvents = 'none');
    
    if(isCorrect) {
        btnElement.classList.add('correct');
        currentQuiz.score++;
    } else {
        btnElement.classList.add('wrong');
        allBtns[qData.correct].classList.add('correct');
    }
    
    setTimeout(nextQuizStep, 2500); // Wydłużony czas, by gracz mógł w spokoju doczytać poprawną długą odpowiedź
}

function nextQuizStep() {
    currentQuiz.qIndex++;
    if(currentQuiz.qIndex >= currentQuiz.data.length) {
        renderQuizResults();
    } else {
        renderQuizQuestion();
    }
}

function renderQuizResults() {
    const content = document.getElementById('quiz-content');
    const total = currentQuiz.data.length;
    const percent = Math.round((currentQuiz.score / total) * 100);
    
    let msgPl = percent === 100 ? "Perfekcyjnie! Opanowałeś ten materiał. 🚀" : percent >= 75 ? "Dobra robota, solidna podstawa! 👍" : percent >= 50 ? "Całkiem okej, ale przejrzyj materiał jeszcze raz. 📉" : "Totalny stop-out. Musisz bezwzględnie poćwiczyć i skupić się na tekście z tej sekcji. 📚";
    let msgEn = percent === 100 ? "Perfect! You've mastered this material. 🚀" : percent >= 75 ? "Good job, solid foundation! 👍" : percent >= 50 ? "Decent, but review the material again. 📉" : "Total stop-out. You must absolutely practice and focus on the text from this section. 📚";
    
    content.innerHTML = `
        <div style="text-align:center; padding: 20px 0;">
            <h2 style="font-size: 2.8rem; margin-bottom: 10px; color: ${percent >= 50 ? 'var(--up-color)' : 'var(--red-accent)'};">${percent}%</h2>
            <h3 style="margin-bottom: 20px; color: var(--heading-color);">${currentLang === 'pl' ? msgPl : msgEn}</h3>
            <p style="color: var(--secondary-text); margin-bottom: 30px;">
                ${currentLang === 'pl' ? `Twój wynik: ${currentQuiz.score} / ${total}` : `Your score: ${currentQuiz.score} / ${total}`}
            </p>
            <button class="glowing-btn" style="padding: 12px 30px; font-size: 1rem; border-color: var(--border-color); color: var(--text-color);" onclick="closeQuiz()">
                ${currentLang === 'pl' ? 'Zakończ Test' : 'Finish Test'}
            </button>
        </div>
    `;
}

function closeQuiz() {
    currentQuiz.active = false;
    document.getElementById('quiz-modal').classList.add('collapsed');
}