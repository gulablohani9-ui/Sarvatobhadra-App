// CDN से Swiss Ephemeris लोड करें (ताकि node_modules की जरूरत न पड़े)
import { SwissEphemeris, Planet, CalculationFlag } from 'https://cdn.jsdelivr.net/npm/@swisseph/browser@1.0.0/dist/swisseph.js';

let swe;
export let gridData = [];

export async function initEphemeris() {
    try {
        swe = new SwissEphemeris();
        await swe.init();
        
        // .se1 फाइलें लोड करें
        await swe.loadEphemerisFiles([
            { name: 'sepl_18.se1', url: 'sepl_18.se1' },
            { name: 'semo_18.se1', url: 'semo_18.se1' },
            { name: 'seas_18.se1', url: 'seas_18.se1' }
        ]);
        console.log("✅ Swiss Ephemeris लोड हो गया!");
        return true;
    } catch (error) {
        console.error("❌ Ephemeris लोड करने में एरर:", error);
        throw error;
    }
}

export function getPlanetaryData(date) {
    const jd = swe.dateToJulianDay(date);
    const planets = [
        { name: 'Sun', id: Planet.Sun }, { name: 'Moon', id: Planet.Moon },
        { name: 'Mars', id: Planet.Mars }, { name: 'Mercury', id: Planet.Mercury },
        { name: 'Jupiter', id: Planet.Jupiter }, { name: 'Venus', id: Planet.Venus },
        { name: 'Saturn', id: Planet.Saturn }, { name: 'Rahu', id: Planet.MeanNode },
        { name: 'Ketu', id: Planet.MeanNode }
    ];

    let results = [];
    planets.forEach(p => {
        let pos = swe.calculatePosition(jd, p.id, CalculationFlag.SwissEphemeris);
        let longitude = pos.longitude;
        if (p.name === 'Ketu') longitude = (longitude + 180) % 360;

        let posNext = swe.calculatePosition(jd + 1, p.id, CalculationFlag.SwissEphemeris);
        let speed = posNext.longitude - longitude;
        if (speed < -180) speed += 360;

        results.push({
            name: p.name,
            longitude: longitude,
            isRetrograde: speed < 0,
            rasi: Math.floor(longitude / 30),
            nakshatra: Math.floor(longitude / 13.3333)
        });
    });
    return results;
}

export function buildGrid() {
    const gridEl = document.getElementById('chakraGrid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (i < 9) cell.classList.add('header');
        cell.textContent = i + 1;
        gridEl.appendChild(cell);
    }
}
