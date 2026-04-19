window.addEventListener('load', () => {
    const fill = document.getElementById('loaderFill');
    if(fill) fill.style.width = '100%'; 
    
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if(loader) loader.classList.add('fade-out');
        document.body.classList.add('ready'); 
        setTimeout(() => loader?.remove(), 900); 
    }, 800); 
});