const CIRCUMFERENCE = 2 * Math.PI * 80;
const ARC_LENGTH    = (270 / 360) * CIRCUMFERENCE;

const session = {
    temp: { min: Infinity, max: -Infinity },
    hum:  { min: Infinity, max: -Infinity }
};

function tempColor(v) { return v < 15 ? '#38bdf8' : v < 30 ? '#4ade80' : '#f87171'; }
function humColor(v)  { return v < 30 ? '#fbbf24' : v < 70 ? '#4ade80' : '#38bdf8'; }

function updateGauge(fillId, valueId, value, min, max, colorFn) {
    const ratio  = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const filled = ratio * ARC_LENGTH;
    const fill   = document.getElementById(fillId);
    fill.style.strokeDasharray = `${filled} ${CIRCUMFERENCE - filled}`;
    fill.setAttribute('stroke', colorFn(value));
    document.getElementById(valueId).textContent = value.toFixed(1);
}

function updateStat(id, value) {
    document.getElementById(id).textContent = value.toFixed(1);
}

const wsDot       = document.getElementById('ws-dot');
const wsLabel     = document.getElementById('ws-label');
const lastUpdated = document.getElementById('last-updated');
const ws = new WebSocket(`ws://${location.host}`);

ws.addEventListener('open', () => {
    wsDot.className   = 'ws-connected';
    wsLabel.className = 'ws-connected';
    wsLabel.textContent = 'Connected';
});

ws.addEventListener('close', () => {
    wsDot.className   = 'ws-disconnected';
    wsLabel.className = 'ws-disconnected';
    wsLabel.textContent = 'Disconnected';
});

ws.addEventListener('message', (event) => {
    const payload = JSON.parse(event.data);
    if (payload.type === 'dht22' && payload.data) {
        const { temperature: t, humidity: h } = payload.data;
        updateGauge('temp-fill', 'temp-value', t, -40,  80, tempColor);
        updateGauge('hum-fill',  'hum-value',  h,   0, 100, humColor);
        if (t < session.temp.min) { session.temp.min = t; updateStat('temp-min', t); }
        if (t > session.temp.max) { session.temp.max = t; updateStat('temp-max', t); }
        if (h < session.hum.min)  { session.hum.min  = h; updateStat('hum-min',  h); }
        if (h > session.hum.max)  { session.hum.max  = h; updateStat('hum-max',  h); }
        lastUpdated.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    }
});