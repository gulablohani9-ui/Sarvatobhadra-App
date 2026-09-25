import { initEphemeris, getPlanetaryData, buildGrid } from './sbc-logic.js';

// अगर कोई एरर आए तो स्क्रीन पर दिखाएं
window.onerror = function(message, source, lineno, colno, error) {
    document.getElementById('vedhaOutput').innerHTML = `❌ Error: ${message} <br> at ${source}:${lineno}`;
};

document.addEventListener('DOMContentLoaded', async () => {
    buildGrid();
    const outputDiv = document.getElementById('vedhaOutput');
    
    try {
        outputDiv.innerHTML = "⏳ Swiss Ephemeris लोड हो रहा है...";
        await initEphemeris();
        outputDiv.innerHTML = "✅ Swiss Ephemeris लोड हो गया! गणना की जा रही है...";
        
        const today = new Date();
        const data = getPlanetaryData(today);
        
        let html = `<h4>आज की ग्रह स्थिति (${today.toLocaleDateString()})</h4>`;
        data.forEach(p => {
            html += `<p><b>${p.name}:</b> राशि ${p.rasi}, नक्षत्र ${p.nakshatra}, ${p.isRetrograde ? 'वक्री' : 'मार्गी'}</p>`;
        });
        outputDiv.innerHTML = html;
        
    } catch (e) {
        console.error(e);
        outputDiv.innerHTML = `❌ फाइलें लोड नहीं हो पाईं। <br>एरर: ${e.message} <br>कृपया जांचें कि .se1 फाइलें 'www' फोल्डर में हैं।`;
    }

    document.getElementById('refreshBtn').addEventListener('click', () => {
        alert('Refreshing planetary positions...');
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
        alert('Settings: True Lunar Node, North Direction Up etc.');
    });
});
