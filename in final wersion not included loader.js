// --- SMART LOADER LOGIC ---
let pageLoaded = false;
let dataLoaded = true; // Zmienna na true, żeby loader znikał (chyba że masz API)

// Pasek startuje
setTimeout(() => { 
    const fill = document.getElementById('loaderFill');
    if (fill && parseInt(fill.style.width || '0') < 50) fill.style.width = '40%'; 
}, 50);

window.addEventListener('load', () => {
    pageLoaded = true;
    checkAndDismissLoader();
});

function checkAndDismissLoader() {
    if (pageLoaded && dataLoaded) {
        const fill = document.getElementById('loaderFill');
        if (fill) fill.style.width = '100%'; 
        
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                
                // PIERWSZA KASKADA PRZY STARCIE STRONY
                // Zbieramy elementy nawigacji + aktywnego widoku
const allElements = document.querySelectorAll('.fade-up-element');
const initialElements = Array.from(allElements).filter(el => !el.closest('.view:not(.active)'));

initialElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.06}s`; 
    el.classList.add('animate');
});

                setTimeout(() => loader.remove(), 900);
            }
        }, 800);
    }
}
