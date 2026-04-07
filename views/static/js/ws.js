const CIRCUMFERENCE = 2 * Math.PI * 80;
const ARC_LENGTH    = (270 / 360) * CIRCUMFERENCE;

const session = {
    temp: { min: Infinity, max: -Infinity },
    hum:  { min: Infinity, max: -Infinity },
    probes: Array.from({ length: 4 }, () => ({ min: Infinity, max: -Infinity }))
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

function updateDHT22(t, h) {
    updateGauge('temp-fill', 'temp-value', t, -40,  80, tempColor);
    updateGauge('hum-fill',  'hum-value',  h,   0, 100, humColor);
    if (t < session.temp.min) { session.temp.min = t; updateStat('temp-min', t); }
    if (t > session.temp.max) { session.temp.max = t; updateStat('temp-max', t); }
    if (h < session.hum.min)  { session.hum.min  = h; updateStat('hum-min',  h); }
    if (h > session.hum.max)  { session.hum.max  = h; updateStat('hum-max',  h); }
}

function updateProbe(idx, temp) {
    const color = tempColor(temp);
    const valEl = document.getElementById(`probe-${idx}-value`);
    const barEl = document.getElementById(`probe-${idx}-bar`);
    const minEl = document.getElementById(`probe-${idx}-min`);
    const maxEl = document.getElementById(`probe-${idx}-max`);
    if (!valEl) return;
    valEl.textContent = temp.toFixed(1);
    valEl.style.color = color;
    const pct = Math.max(0, Math.min(100, ((temp - (-55)) / (125 - (-55))) * 100));
    barEl.style.width = pct + '%';
    barEl.style.background = color;
    const s = session.probes[idx];
    if (temp < s.min) { s.min = temp; minEl.textContent = temp.toFixed(1); }
    if (temp > s.max) { s.max = temp; maxEl.textContent = temp.toFixed(1); }
}

const wsDot       = document.getElementById('ws-dot');
const wsLabel     = document.getElementById('ws-label');
const lastUpdated = document.getElementById('last-updated');
const ws = new WebSocket(`ws://${location.host}`);

ws.addEventListener('open', () => {
    wsDot.className   = 'ws-connected';
    wsLabel.className = 'ws-connected';
});

ws.addEventListener('close', () => {
    wsDot.className   = 'ws-disconnected';
    wsLabel.className = 'ws-disconnected';
});

ws.addEventListener('message', (event) => {
    const payload = JSON.parse(event.data);
    if (payload.type === 'dht22' && payload.data) {
        const { temperature: t, humidity: h } = payload.data;
        updateDHT22(t, h);
        lastUpdated.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    }
    if (payload.type === 'sensor_data' && payload.data) {
        const { dht22_temp: t, dht22_humidity: h, ds18b20 } = payload.data;
        updateDHT22(t, h);
        ds18b20.forEach((temp, idx) => updateProbe(idx, temp));
        lastUpdated.textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    }
    if (payload.type === 'server_status' && payload.data) {
        const isOnline = payload.data.online;
        const dot   = document.getElementById('server-dot');
        const badge = document.getElementById('server-badge');
        const label = document.getElementById('server-status-label');
        if (!dot) return;
        dot.className     = 'server-dot ' + (isOnline ? 'server-dot-online' : 'server-dot-offline');
        badge.textContent = isOnline ? 'Online' : 'Offline';
        badge.className   = 'server-badge ' + (isOnline ? 'server-badge-online' : 'server-badge-offline');
        label.textContent = isOnline ? 'Active' : 'Inactive';
        label.style.color = isOnline ? 'var(--success)' : 'var(--error)';
    }
});