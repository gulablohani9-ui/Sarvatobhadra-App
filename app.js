import { initEphemeris, getPlanetaryData, buildGrid } from './sbc-logic.js';

document.addEventListener('DOMContentLoaded', async () => {
    buildGrid();
    try {
        await initEphemeris();
        document.getElementById('vedhaOutput').innerHTML = "✅ Swiss Ephemeris लोड हो गया!<br>तारीख के अनुसार गणना की जा रही है...";
        
        const today = new Date();
        const data = getPlanetaryData(today);
        
        let html = `<h4>आज की ग्रह स्थिति (${today.toLocaleDateString()})</h4>`;
        data.forEach(p => {
            html += `<p><b>${p.name}:</b> राशि ${p.rasi}, नक्षत्र ${p.nakshatra}, ${p.isRetrograde ? 'वक्री' : 'मार्गी'}</p>`;
        });
        document.getElementById('vedhaOutput').innerHTML = html;
    } catch (e) {
        console.error(e);
        document.getElementById('vedhaOutput').innerHTML = "❌ फाइलें लोड नहीं हो पाईं। कृपया .se1 फाइलें चेक करें।";
    }
});
