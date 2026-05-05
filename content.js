/**
 * Core content matrix. 
 * Raw, EV-driven logic. Eradicated sentimental vocabulary. 
 * Added advanced Jargon Tooltips and restored static footprint structures.
 */

const AcademyContent = {
    home: `
        <div class="bento-grid content-fade">
            <div class="folder-card span-4" data-id="mech" onclick="App.navigate('mech')">
                <div class="folder-num">1</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>Mechanika Rynku</h3>
                    <p>Płynność, Makro, Opcje</p>
                </div>
            </div>
            <div class="folder-card span-5" data-id="amt" onclick="App.navigate('amt')">
                <div class="folder-num">2</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>AMT</h3>
                    <p>Balance, Imbalance, Cykl</p>
                </div>
            </div>
            <div class="folder-card span-3" data-id="vp" onclick="App.navigate('vp')">
                <div class="folder-num">3</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>Volume Profile</h3>
                    <p>S&R, POC, LVN</p>
                </div>
            </div>
            <div class="folder-card span-7" data-id="vwap" onclick="App.navigate('vwap')">
                <div class="folder-num">4</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>AVWAP</h3>
                    <p>Instytucjonalne Bands, Pullbacki</p>
                </div>
            </div>
            <div class="folder-card span-5" data-id="vsa" onclick="App.navigate('vsa')">
                <div class="folder-num">5</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>VSA</h3>
                    <p>Effort/Result, Climax</p>
                </div>
            </div>
            <div class="folder-card span-5" data-id="of" onclick="App.navigate('of')">
                <div class="folder-num">6</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>Orderflow</h3>
                    <p>Absorpcja, Exhaustion, CVD</p>
                </div>
            </div>
            <div class="folder-card span-7" data-id="fund" onclick="App.navigate('fund')">
                <div class="folder-num">7</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>Fundamenty Intraday</h3>
                    <p>Makro, Rekalibracja</p>
                </div>
            </div>
            <div class="folder-card span-8" data-id="risk" onclick="App.navigate('risk')">
                <div class="folder-num">8</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>Zarządzanie Ryzykiem</h3>
                    <p>Invalidation, Live Cut</p>
                </div>
            </div>
            <div class="folder-card span-4" data-id="checklist" onclick="App.navigate('checklist')">
                <div class="folder-num">9</div>
                <div class="progress-badge">✓ PRZEROBIONE</div>
                <div class="folder-info">
                    <h3>Pre-trade Checklist</h3>
                    <p>Walidacja setupu</p>
                </div>
            </div>
        </div>

        <div class="community-wrapper content-fade">
            <div class="community-footer">
                <h4>Infrastruktura Zewnętrzna</h4>
                <div class="links-group">
                    <a href="https://portfolio-rei.pages.dev/" target="_blank" class="rei-link idle-float">
                        <span style="font-size: 1.1rem;">✨</span> Portfolio
                    </a>
                    <a href="https://rei-pnl-front.pages.dev/" target="_blank" class="rei-link idle-float" style="animation-delay: 0.2s;">
                        <span style="font-size: 1.1rem;">📊</span> Live PNL
                    </a>
                    <a href="https://rei-recaps-front.pages.dev/" target="_blank" class="rei-link idle-float" style="animation-delay: 0.4s;">
                        <span style="font-size: 1.1rem;">📚</span> Premium Recaps
                    </a>
                </div>
            </div>

            <div class="kofi-card">
                <h4><span style="-webkit-text-fill-color: initial;">☕</span> Wsparcie Projektu</h4>
                <p>jesli darmowa wiedza wam pomogla i macie ochote wesprzec rozwoj tego projektu to wrzucam link do ko-fi</p>
                
                <p>dla wspierajacych dostep do priv kanalow i <a href="https://rei-recaps-front.pages.dev/" target="_blank" class="text-link">recapow/backtestow</a> ale powiem wam wprost to nie sam dostep do nich jest tu najwazniejszy</p>
                
                <div style="text-align: center; margin: 24px 0; color: var(--accent-secondary); font-size: 1.3rem;">
                    <span style="display: inline-block; animation: pulse 2s infinite;">❤</span>
                </div>
                
                <p>liczy sie dla mnie wasz gest i chec docenienia mojej pracy za co z gory serdecznie dziekuje</p>
                <p>z osobami ktore dorzucaja swoja cegielke do projektu jestem tez naturalnie o wiele bardziej zaangazowany w bezposredni kontakt i poswiecam im po prostu wiecej czasu ;3</p>
                
                <a href="http://ko-fi.com/reiseiv" target="_blank" class="kofi-btn">Wesprzyj na Ko-fi</a>
            </div>
        </div>
    `,
    mech: `
        <div class="content-fade">
            <h2 class="section-title">1. MECHANIKA RYNKU</h2>
            <div class="course-text">
                <span class="segment-tag tag-must-know">MUST KNOW</span>
                <h4>Mechanizm płynności i orderflow pressure</h4>
                <p>Zanim odpalicie footprinty, wywalcie z głowy mit, że "cena rośnie, bo jest więcej kupujących". W każdej transakcji uczestniczy kupujący i sprzedający. Cena rośnie z jednego powodu: agresywne zlecenia market zjadają całą pasywną <span class="jargon-tip" onmousemove="window.tt(event, 'Liquidity (Płynność)', 'Pasywne zlecenia Limit oczekujące w Orderbooku. To fizyczne bariery dla ceny.')" onmouseleave="window.htt()">LIQUIDITY</span> na danym poziomie. Brak limitów? <span class="jargon-tip" onmousemove="window.tt(event, 'Poszukiwanie Płynności', 'Mechanizm dopasowywania zleceń (Matching Engine). Jeśli na danym poziomie brakuje ofert sprzedaży, system automatycznie przesuwa wycenę wyżej, aż napotka wystarczającą ilość limitów do realizacji twojego zlecenia Market.')" onmouseleave="window.htt()">Algorytm musi podbić cenę by znaleźć płynność.</span> Ty albo wiesz, gdzie jest płynność, albo sam się nią stajesz.</p>
                
                <h4>Vacuum Effect</h4>
                <p>Kiedy wjeżdża grube makro (CPI, NFP), smart money wycofuje swoje limity. Powstaje tzw. <span class="jargon-tip" onmousemove="window.tt(event, 'Vacuum Effect', 'Próżnia w orderbooku. Brak zleceń pasywnych sprawia, że jedno agresywne uderzenie rzuca ceną na duże odległości.')" onmouseleave="window.htt()">Vacuum Effect</span>. Agresywne zlecenia trafiają na pustkę, co wywołuje skokowy repricing. Cena się dosłownie teleportuje, bo nie ma kto wchłonąć uderzeń.</p>
                
                <div class="premium-tip">
                    <div class="tip-icon">💡</div>
                    <div class="tip-content">
                        <strong>Tip ode mnie ;p</strong>
                        Zawsze uciekaj przed danymi. Granie w minucie publikacji makro to ładowanie się w próżnię. Spread cię zniszczy, a slippage wyczyści konto. Czekasz aż algorytmy zrobią swoje, rzucą ceną, ułożą nowy profil i dopiero wtedy podpinasz się pod ułożony orderflow.
                    </div>
                </div>

                <h4>Presja Opcji (Market Makers)</h4>
                <p>Jest jeszcze jedna siła: wystawcy opcji. Oni mają w poważaniu kierunek, ich zadaniem jest być <span class="jargon-tip" onmousemove="window.tt(event, 'Delta Neutral', 'Stan, w którym zyski i straty z opcji i aktywa bazowego zerują się. Wymusza to na Market Makerze ciągłe kupowanie/sprzedawanie futuresów.')" onmouseleave="window.htt()">Delta Neutral</span>. Jak retail masowo pakuje się w Calle (longi), Market Maker MUSI natychmiast kupić aktywo bazowe na zabezpieczenie. To chłodny, algorytmiczny przymus, który potrafi sztucznie wybić wykres w kosmos, zostawiając grających pod prąd na offside'dzie.</p>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('home')">← Powrót</button>
                <button class="nav-btn" onclick="App.navigate('amt')">Następny Moduł →</button>
            </div>
        </div>
    `,
    amt: `
        <div class="content-fade">
            <h2 class="section-title">2. AMT (Auction Market Theory)</h2>
            <div class="course-text">
                <p>Rynek to nie kreski i wskaźniki, to ciągła, brutalna aukcja. <span class="jargon-tip" onmousemove="window.tt(event, 'Popyt (Demand)', 'Strona kupująca na rynku. Aktywny popyt to ci uderzający zleceniami rynkowymi (Market Buy).')" onmouseleave="window.htt()">Popyt</span> i <span class="jargon-tip" onmousemove="window.tt(event, 'Podaż (Supply)', 'Strona sprzedająca na rynku. Aktywna podaż zrzuca zlecenia rynkowe (Market Sell) na oferty kupna.')" onmouseleave="window.htt()">podaż</span> non stop testują się nawzajem szukając <span class="jargon-tip" onmousemove="window.tt(event, 'Fair Value', 'Cena akceptowana przez obie strony. Miejsce, gdzie wolumen buduje się najszybciej, bo obie strony chcą robić tam biznes.')" onmouseleave="window.htt()">FAIR VALUE</span>. Jak wycena spada za nisko? Smart money widzi promocję i podbija. Jak jest za wysoko? Podaż spycha cenę w dół. </p>
                
                <h4>Value Area - Twoja Mapa</h4>
                <p>Value Area (VA) to strefa, w której przeszło ~70% wolumenu. To twardy dowód, że rynek tam właśnie zaakceptował cenę. Wyjście powyżej (VAH) to sygnał przewartościowania – algorytmy zrzucą cenę z powrotem, CHYBA ŻE zaczną budować tam nowy wolumen. To odróżnia kasyno od czytania rynku.</p>
                
                <h4>Cykl Aukcji i Łapanie Noży</h4>
                <p>Przez większość czasu rynek wisi w równowadze (Balance). Ale jak pęka struktura, zaczyna się szukanie nowej ceny (<span class="jargon-tip" onmousemove="window.tt(event, 'Imbalance', 'Moment kierunkowego poszukiwania nowej wartości. Rynek ignoruje stare opory.')" onmouseleave="window.htt()">Imbalance</span>). Błąd amatorów? Gra przeciwko trendowi, wmawiając sobie, że "cena musi wrócić". W silnym imbalansie nie łapiemy <span class="jargon-tip" onmousemove="window.tt(event, 'Spadające noże', 'Próba kupowania w trakcie agresywnych spadków licząc na szybkie odbicie. Zazwyczaj kończy się wyzerowaniem konta.')" onmouseleave="window.htt()">"spadających noży"</span>. Płyniesz z prądem aż zbuduje się nowy Balance.</p>

                <div id="sim-amt-container"></div>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('mech')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('vp')">Następny Moduł →</button>
            </div>
        </div>
    `,
    vp: `
        <div class="content-fade">
            <h2 class="section-title">3. VOLUME PROFILE</h2>
            <div class="course-text">
                <p>Zmienna czasu jest rynkową iluzją, fizyczny wolumen to jedyna obiektywna prawda. Volume Profile wyrzuca zwykłe świece do kosza i pokazuje ci rentgen. Widzisz kropka w kropkę gdzie siedzi zaparkowany duży kapitał i gdzie są strefy balansu.</p>
                
                <span class="segment-tag tag-must-know">ARCHITEKTURA PŁYNNOŚCI</span>
                <h4>HVN vs LVN</h4>
                <p><strong>HVN (High Volume Node):</strong> Gęste strefy. Cena zwalnia, mieli i mieli. Dużo zleceń, duży obrót, duża akceptacja.</p>
                <p><strong>LVN (Low Volume Node):</strong> Próżnia. Miejsca odrzucone w przeszłości. Jak cena wyrywa się z jednego bloku HVN, to przez LVN przelatuje błyskawicznie, bo nikt tam nie trzyma zleceń pasywnych.</p>
                
                <div class="premium-tip">
                    <div class="tip-icon">⚡</div>
                    <div class="tip-content">
                        <strong>Abuse tego mechanizmu</strong>
                        Bardzo często z tego korzystam, wręcz abuse'uję ^^ (odbicie od LVN w trendzie). W mocno trendującym rynku wpadamy w pustą strefę LVN i rynek przeprowadza test. Z racji pustki w orderbooku, cena jest automatycznie i gwałtownie odrzucana.
                    </div>
                </div>

                <div id="sim-vp-container"></div>
                
                <h4>Magnes POC</h4>
                <p>Point of Control (POC) to serce profilu, poziom o najwyższym obrocie. Jak rynkowi kończy się paliwo i zaczyna się szum boczny, POC działa jak odkurzacz. Bezwzględnie wciąga błądzącą cenę z powrotem do strefy maksymalnej akceptacji.</p>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('amt')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('vwap')">Następny Moduł →</button>
            </div>
        </div>
    `,
    vwap: `
        <div class="content-fade">
            <h2 class="section-title">4. AVWAP (Anchored VWAP)</h2>
            <div class="course-text">
                <p>Zwykłe średnie SMA to zabawki dla retailu. Generują opóźnienie. Instytucje grają tylko na VWAP (średnia cena ważona wolumenem). To dla nich benchmark, by wiedzieć czy pozycja jest zyskowna.</p>
                
                <h4>Anchored VWAP (AVWAP)</h4>
                <p>Zakotwiczenie VWAP (Anchored) na grubym szczycie albo dołku po publikacji danych obnaża całą prawdę: kto aktualnie ma kontrolę nad rynkiem. Dopóki cena trzyma się powyżej – <span class="jargon-tip" onmousemove="window.tt(event, 'Byki (Bulls)', 'Strona popytowa. Agresorzy kupujący po cenach rynkowych (Market Buy).')" onmouseleave="window.htt()">byki</span> kontrolują <span class="jargon-tip" onmousemove="window.tt(event, 'Taśma (Tape/DOM)', 'Wizualizacja napływających zleceń Market uderzających w Limit. Najczystszy obraz rynkowej agresji.')" onmouseleave="window.htt()">taśmę</span>. Wyłamanie na potężnym wolumenie oznacza, że smart money właśnie zmieniło stronę.</p>
                
                <div class="premium-tip">
                    <div class="tip-icon">⚖️</div>
                    <div class="tip-content">
                        <strong>Złota zasada w silnym trendzie</strong>
                        Bandy VWAP to dynamiczne VAH i VAL. Zwykle cena lubi wracać do głównej osi (Mean Reversion). Ale UWAGA: przy potężnym imbalansie cena odkleja się od VWAP i przez całą sesję tam nie wraca. Granie pod prąd licząc na "powrót do średniej" to likwidacja. W trendzie VWAP to trampolina do longów i shortów z pullbacku, a nie cel dla spadających noży.
                    </div>
                </div>

                <div id="sim-vwap-container"></div>

            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('vp')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('vsa')">Następny Moduł →</button>
            </div>
        </div>
    `,
    vsa: `
        <div class="content-fade">
            <h2 class="section-title">5. VSA (Volume Spread Analysis)</h2>
            <div class="course-text">
                <p>Wyrzuć japońskie nazwy świeczek. VSA uczy chłodnej analizy wysiłku i rezultatu. Wolumen to włożony wysiłek (Effort). Rozmiar świecy to uzyskany rezultat (Result). Patrzymy, gdzie te dwie rzeczy przestają się zgadzać.</p>
                
                <h4>Zdrowy Ruch vs Anomalie (Hidden Selling)</h4>
                <p>Zdrowy trend to duży wolumen i długa świeca pchająca cenę. Proste. Anomalia pojawia się, gdy wolumen wystrzeliwuje w kosmos, a świeczka stoi w miejscu lub robi nędzny <span class="jargon-tip" onmousemove="window.tt(event, 'Knot (Wick)', 'Cień świecy, pokazujący skrajne ceny osiągnięte w danym czasie, ale nieutrzymane na zamknięciu.')" onmouseleave="window.htt()">"knot"</span>. To <span class="jargon-tip" onmousemove="window.tt(event, 'Hidden Selling', 'Wielkie zlecenia kupna wchłaniane przez gigantyczny, ukryty pasywny mur sprzedających. Brak rezultatu w postaci wyższej ceny.')" onmouseleave="window.htt()">Hidden Selling</span>. Podaż zaparkowała z limitami i chłodno ubiera uderzający w nią detal w pozycje.</p>
                
                <div id="sim-vsa-container"></div>

                <h4>Climax & Ubieranie Retailu</h4>
                <p>Dlaczego detal traci hajs na górce? Widzą olbrzymią zieloną świecę na szczycie (Buying Climax). Wjeżdża <span class="jargon-tip" onmousemove="window.tt(event, 'FOMO', 'Strach przed uciekającym zyskiem. Powoduje emocjonalne uderzanie w przycisk MKT na samych szczytach.')" onmouseleave="window.htt()">FOMO</span>, ładują się w pozycje. Instytucje potrzebują dokładnie tej płynności detalicznej, żeby móc zrzucić na nich swoje monstrualne bloki longów i gładko przejść w pozycje short. Jesteś po prostu ich wyjściem.</p>
                
                <h4>Wysuszenie Popytu/Podaży</h4>
                <p>Obserwujesz korektę, świeczki robią się wąskie, a wolumen spada drastycznie. To zjawisko No Supply/No Demand. Oznacza to odpuszczenie agresji. Wymagana jest tylko mikroskopijna iskra żeby wrócić do głównego kierunku.</p>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('vwap')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('of')">Następny Moduł →</button>
            </div>
        </div>
    `,
    of: `
        <div class="content-fade">
            <h2 class="section-title">6. ORDERFLOW & DELTA</h2>
            <div class="course-text">
                <p>Zejście do mikroskopu. Footprint nie ma opóźnień. Widzisz brutalnie czyste intencje w środku rotacji ceny. Czytamy to ZAWSZE "po skosie" (Diagonal Reading) – market buy uderza w ask poziom wyżej, market sell w bid poziom niżej.</p>
                
                <span class="segment-tag tag-must-know">ARCHITEKTURA NA TAŚMIE</span>
                <p>Przeanalizuj statyczne przykłady poniżej, a następnie sprawdź swój refleks w symulatorze.</p>

                <div class="fp-wrapper">
                    <!-- Absorpcja -->
                    <div class="fp-box">
                        <div style="text-align:center; font-weight:700; margin-bottom:12px; color:var(--text-primary); letter-spacing: 1px;">ABSORPCJA LIMITAMI 🛡️</div>
                        <div style="width:2px; height:15px; background:var(--glass-border); margin:0 auto 10px;"></div>
                        
                        <div class="fp-row"><div class="fp-val bid">12</div><div class="fp-val ask">25</div></div>
                        <div class="fp-row"><div class="fp-val bid">45</div><div class="fp-val ask">32</div></div>
                        <div class="fp-row" style="border: 1px solid rgba(52, 211, 153, 0.4); background: rgba(52, 211, 153, 0.05);" onmousemove="window.tt(event, 'Zatrzymana agresja', '840 kontraktów bije MKT Sell, celując w zbicie ceny. Gruby mur pasywnych Limit Buy pochłania ten atak. Cena nie spada ani o tick. To wchłonięcie podaży – przygotowanie do wywózki shortów w górę.')" onmouseleave="window.htt()">
                            <div class="fp-val bid fp-hi-d">840</div><div class="fp-val ask">40</div>
                        </div>
                    </div>

                    <!-- Exhaustion -->
                    <div class="fp-box">
                        <div style="text-align:center; font-weight:700; margin-bottom:12px; color:var(--text-primary); letter-spacing: 1px;">EXHAUSTION (WYCZERPANIE) ⚡</div>
                        <div style="width:2px; height:15px; background:var(--glass-border); margin:0 auto 10px;"></div>
                        
                        <div class="fp-row" style="border: 1px dashed rgba(248, 113, 113, 0.5);" onmousemove="window.tt(event, 'Paliwo wyparowało', 'Cena dobija szczytu. Na Asku dokładnie 0 kontraktów. Agresorzy uciekli z taśmy. Brak chęci do dalszego uderzania to natychmiastowy sygnał, że zaraz wjeżdża rewers i shorty.')" onmouseleave="window.htt()">
                            <div class="fp-val bid">12</div><div class="fp-val ask fp-z">0</div>
                        </div>
                        <div class="fp-row"><div class="fp-val bid">45</div><div class="fp-val ask">18</div></div>
                        <div class="fp-row"><div class="fp-val bid">80</div><div class="fp-val ask">320</div></div>
                    </div>
                </div>

                <div id="sim-of-container"></div>

                <h4>Delta i Dywergencja CVD</h4>
                <p>Delta to różnica (agresywne kupno minus sprzedaż). Jeżeli cena wybija lokalny szczyt, a <span class="jargon-tip" onmousemove="window.tt(event, 'CVD (Cumulative Volume Delta)', 'Skumulowana różnica między agresywnym kupnem a sprzedażą przez daną sesję.')" onmouseleave="window.htt()">CVD</span> w tym samym czasie dramatycznie opada pod swoim ciężarem, mamy książkową dywergencję. Ruch wyczerpuje swoje strukturalne rezerwy płynności, to zwykła zmyłka instytucji by złapać cię na górce przed dystrybucją.</p>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('vsa')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('fund')">Następny Moduł →</button>
            </div>
        </div>
    `,
    fund: `
        <div class="content-fade">
            <h2 class="section-title">7. FUNDAMENTY INTRADAY</h2>
            <div class="course-text">
                <p>My nie zgadujemy. Jako trader orderflow masz w głębokim poważaniu czy inflacja spadła o promil czy dwa. Instytucje mają armię analityków, żeby to obliczyć przed tobą. Raporty nie niosą dla nas znaczenia informacyjnego – mają wyłącznie znaczenie płynnościowe.</p>
                
                <div class="premium-tip">
                    <div class="tip-icon">🛡️</div>
                    <div class="tip-content">
                        <strong>Zasada Przetrwania: Nie stój pod prąd</strong>
                        Rozgrywanie pozycji w samej minucie publikacji raportu to hazard, stajesz się <span class="jargon-tip" onmousemove="window.tt(event, 'Exit Liquidity (Dawca Kapitału)', 'Moment, w którym twoje zlecenie staje się darmową płynnością dla zamykających pozycje instytucji. Charytatywnie wspierasz Wall Street na Nasdaq.')" onmouseleave="window.htt()">dawcą kapitału</span>. Płynność wyparowuje z Orderbooka, a slippage dokona bezlitosnej egzekucji twojego rachunku.<br><br>
                        <strong>Protokół operacyjny:</strong> Przed makro uciekasz z rynku. Obserwujesz z bezpiecznej odległości chaos, szpile i algorytmiczną rzeź. Czekasz, aż kurz opadnie i uformuje się nowy, twardy profil akceptacji (Fair Value). Dopiero wtedy szukasz okazji.
                    </div>
                </div>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('of')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('risk')">Następny Moduł →</button>
            </div>
        </div>
    `,
    risk: `
        <div class="content-fade">
            <h2 class="section-title">8. ZARZĄDZANIE RYZYKIEM</h2>
            <div class="course-text">
                <p>Ustawianie sztywnego Stop Lossa na wymyślone "2% konta" w oderwaniu od wykresu to wystawianie się na tacy dla <span class="jargon-tip" onmousemove="window.tt(event, 'Liquidity Hunting', 'Algorytmy HFT celowo skanujące i wybijające klastry sztywnych stop lossów detalistów, aby pozyskać darmową płynność do własnych operacji.')" onmouseleave="window.htt()">algorytmów huntujących płynność detaliczną</span>.</p>
                
                <h4>SL za strukturą rynkową</h4>
                <p>Twój <span class="jargon-tip" onmousemove="window.tt(event, 'Invalidation Point', 'Miejsce na wykresie, w którym struktura twojego trejdu ostatecznie i bezdyskusyjnie pęka.')" onmouseleave="window.htt()">Invalidation Point</span> jest tam, gdzie logika wejścia upada. Chowasz zlecenie obronne głęboko za ścianą HVN, albo bezpośrednio pod zidentyfikowaną absorpcją limitów. Jeśli ten potężny bastion upadnie, twoja pozycja i tak traci sens. Uciekasz.</p>
                
                <h4>Live Cut (Sterylne ucięcie strat)</h4>
                <p>Mając footprint, widzisz co się dzieje zanim cena uderzy twój twardy Stop Loss. Widzisz wejście na longa poparte absorpcją? Super. Ale jak dwie świece później wlewa się na taśmę potężna ujemna Delta od oponenta, a ściana obronna zostaje wchłonięta – nie czekasz jak głupiec. Odpalasz Live Cut, tniesz stratę ręcznie. Ratujesz kapitał dla lepszego Expected Value.</p>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('fund')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('checklist')">Następny Moduł →</button>
            </div>
        </div>
    `,
    checklist: `
        <div class="content-fade">
            <h2 class="section-title">9. PRE-TRADE CHECKLIST</h2>
            <div class="course-text">
                <span class="segment-tag tag-must-know">DYSCYPLINA</span>
                <p>Ten system to zero emocji. Przed uderzeniem przycisku sprawdzasz sterylną macierz:</p>
                
                <ul>
                    <li><strong>1. Kontekst:</strong> W jakiej jesteś fazie? Balance czy Imbalance? Gdzie aktualnie znajduje się rdzeń profilu (POC)?</li>
                    <li><strong>2. Lokacja (Struktura):</strong> Żadnych zagrań w powietrzu. Masz za sobą pancerz obronny? Odbicie następuje od potwierdzonej strefy HVN, czystego LVN czy opiera się na Anchored VWAP?</li>
                    <li><strong>3. Taśma (VSA/OF):</strong> Widzisz wyraźne Exhaustion przeciwnika u podłoża korekty? Agresywna Delta potwierdza twój kierunek? CVD nie rysuje dywergencji (pułapki)?</li>
                    <li><strong>4. Ewakuacja (Invalidation):</strong> Gdzie obiektywnie pęka twoja teza? Twardy SL ustawiony <em>zanim</em> otworzysz pozycję?</li>
                </ul>
            </div>
            <div class="nav-actions">
                <button class="nav-btn" onclick="App.navigate('risk')">← Poprzedni Moduł</button>
                <button class="nav-btn" onclick="App.navigate('home')">Katalog Główny</button>
            </div>
        </div>
    `
};

const ViewTitles = {
    home: 'Katalog Główny', mech: 'Mechanika Rynku', amt: 'AMT', vp: 'Volume Profile',
    vwap: 'AVWAP', vsa: 'VSA', of: 'Orderflow', fund: 'Fundamenty', risk: 'Zarządzanie Ryzykiem', checklist: 'Pre-trade Checklist'
};