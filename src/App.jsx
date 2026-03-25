import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';

// ─── CSS ────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;background:#000;color:#fff;font-family:'Inter',sans-serif;font-size:14px;-webkit-tap-highlight-color:transparent;}
body{overflow:hidden}
button{cursor:pointer;border:none;background:none;color:inherit;font-family:inherit}
input,textarea,select{background:transparent;color:#fff;font-family:'Inter',sans-serif;outline:none;border:none}
textarea{resize:none}
select option{background:#111;color:#fff}
::-webkit-scrollbar{width:0;height:0}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes cogSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes pop{0%{transform:scale(.96)}100%{transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes blockDone{0%,100%{background:#0a0a0a}40%{background:#00cc66}}
@keyframes checkFlash{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes nowPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,50,50,.5)}50%{box-shadow:0 0 0 8px rgba(255,50,50,0)}}
@keyframes slideInUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes glowBorder{0%,100%{box-shadow:0 0 0 1px #fff3}50%{box-shadow:0 0 12px 2px #fff6}}
@keyframes greenFlash{0%,100%{background:#111}50%{background:#00cc6644}}

.fade-up{animation:fadeUp .3s ease forwards}
.slide-in-up{animation:slideInUp .3s ease forwards}
.now-pulse{animation:nowPulse 2s ease-in-out infinite}
.glow-border{animation:glowBorder 2s ease-in-out infinite}
.pulse-anim{animation:pulse 1.8s ease-in-out infinite}

.page{position:absolute;inset:0;bottom:60px;overflow-y:auto;overflow-x:hidden;padding:16px 14px 24px}
.bottom-nav{position:fixed;bottom:0;left:0;right:0;height:60px;background:#000;border-top:1px solid #1a1a1a;display:flex;align-items:center;justify-content:space-around;z-index:100}
.nav-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;min-width:48px;position:relative}
.nav-dot{width:4px;height:4px;border-radius:50%;background:#fff;position:absolute;bottom:4px}
.card{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:16px}
.card-dark{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:12px;padding:16px}
.section-label{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#555;margin-bottom:8px}
.field-label{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#666;margin-bottom:4px}
.underline-input{border-bottom:1px solid #333;width:100%;padding:8px 0;font-size:15px;font-family:'Inter',sans-serif;color:#fff;background:transparent}
.underline-input:focus{border-bottom-color:#fff}
.btn-white{background:#fff;color:#000;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:.08em;text-transform:uppercase;width:100%;padding:14px;border-radius:0;border:none;cursor:pointer}
.btn-white:active{opacity:.85}
.btn-outline{background:transparent;color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase;padding:10px 16px;border:1px solid #333;border-radius:8px;cursor:pointer}
.btn-outline:active{border-color:#fff}
.chip{display:inline-flex;align-items:center;padding:6px 12px;border-radius:20px;border:1px solid #2a2a2a;font-size:12px;font-family:'Inter',sans-serif;cursor:pointer;background:#0a0a0a;color:#999;white-space:nowrap}
.chip.active{background:#fff;color:#000;border-color:#fff}
.chip-sm{padding:4px 10px;font-size:11px;border-radius:16px}
.time-block{border-radius:10px;padding:10px 12px;position:relative;overflow:hidden;cursor:pointer}
.accent-bar{position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px}
.do-this-now{background:#0d0d0d;border:1px solid #fff;border-radius:14px;padding:20px}
.up-next-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #0f0f0f}
.up-next-row:last-child{border-bottom:none}
.identity-quote{font-style:italic;font-size:14px;color:#ccc;line-height:1.5}
.priority-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;color:#7a1a1a}
.ring-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center}
.trend-up{color:#00cc66}
.trend-down{color:#ff4444}
.timeline-wrap{position:relative;overflow-y:auto;overflow-x:hidden}
.time-spine{position:absolute;left:0;top:0;bottom:0;width:48px;border-right:1px solid #111}
.hour-line{position:absolute;left:48px;right:0;border-top:1px solid #111;pointer-events:none}
.hour-label{position:absolute;left:0;width:44px;text-align:right;font-size:10px;color:#444;transform:translateY(-50%)}
.tl-block{position:absolute;left:56px;right:8px;border-radius:10px;padding:8px 10px;cursor:pointer;transition:opacity .2s}
.tl-block.past{opacity:.45}
.tl-block.current{border:1px solid #fff4;animation:glowBorder 2s ease-in-out infinite}
.now-line{position:absolute;left:44px;right:0;border-top:2px solid #ff3232;pointer-events:none;z-index:10}
.now-dot{position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:#ff3232;animation:nowPulse 2s ease-in-out infinite}
.sheet-overlay{position:fixed;inset:0;background:#000a;z-index:200;display:flex;align-items:flex-end}
.sheet{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px 16px 0 0;width:100%;max-height:85vh;overflow-y:auto;padding:20px;animation:slideInUp .25s ease}
.habit-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
.morning-checklist{position:fixed;inset:0;background:#000;z-index:150;overflow-y:auto;padding:24px 16px 100px}
.mc-item{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;cursor:pointer;margin-bottom:10px;transition:border-color .2s}
.mc-item.done{border-color:#00cc66;background:#001a0a}
.mc-check{width:28px;height:28px;border-radius:50%;border:2px solid #333;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.mc-item.done .mc-check{background:#00cc66;border-color:#00cc66}
.progress-bar{height:4px;background:#111;border-radius:2px;margin-bottom:24px;overflow:hidden}
.progress-fill{height:100%;background:#00cc66;border-radius:2px;transition:width .4s ease}
.onboard-wrap{position:fixed;inset:0;background:#000;overflow-y:auto;padding:24px 16px 40px;animation:fadeUp .3s ease}
.onboard-step{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#444;margin-bottom:8px}
.onboard-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:28px;line-height:1.1;margin-bottom:6px}
.onboard-sub{font-size:13px;color:#666;margin-bottom:24px}
.energy-row{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border:1px solid #1a1a1a;border-radius:10px;margin-bottom:8px;cursor:pointer;transition:background .2s,border-color .2s}
.energy-row.selected{background:#fff;color:#000;border-color:#fff}
.energy-row.selected .er-sub{color:#555}
.er-label{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px}
.er-sub{font-size:11px;color:#555}
.time-picker-large{display:flex;align-items:center;justify-content:center;gap:8px;margin:20px 0}
.tpl-col{display:flex;flex-direction:column;align-items:center;gap:4px}
.tpl-val{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:48px;line-height:1;min-width:64px;text-align:center;cursor:ns-resize;user-select:none;touch-action:none}
.tpl-sep{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:48px;opacity:.4}
.tpl-btn{width:32px;height:32px;border-radius:50%;border:1px solid #333;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;color:#fff;background:none}
.tpl-btn:active{background:#1a1a1a}
.ampm-toggle{display:flex;border:1px solid #333;border-radius:8px;overflow:hidden}
.ampm-btn{padding:8px 14px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px;cursor:pointer;background:none;color:#666;border:none}
.ampm-btn.active{background:#fff;color:#000}
.pr-row{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #111}
.pr-row:last-child{border-bottom:none}
.pr-label{flex:1;font-size:13px}
.pr-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;min-width:48px;text-align:center}
.pr-goal{font-size:11px;color:#555}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.cal-day{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;font-size:12px;cursor:pointer;position:relative;background:#0a0a0a;border:1px solid #111}
.cal-day.today{border-color:#fff}
.cal-day.has-data::after{content:'';position:absolute;bottom:3px;width:4px;height:4px;border-radius:50%;background:#555}
.cal-day.header{background:none;border:none;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10px;letter-spacing:.08em;color:#444;cursor:default;aspect-ratio:auto;padding:4px 0}
.inbox-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #0f0f0f}
.inbox-item:last-child{border-bottom:none}
.transitions-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #0f0f0f}
.transitions-row:last-child{border-bottom:none}
.trans-bar{width:3px;align-self:stretch;border-radius:2px;flex-shrink:0}
.std-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #0f0f0f;cursor:pointer}
.std-row:last-child{border-bottom:none}
.std-check{width:22px;height:22px;border-radius:6px;border:1px solid #333;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.std-check.checked{background:#fff;border-color:#fff}
.wk-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px}
.wk-cell{border-radius:8px;padding:8px 4px;text-align:center;background:#0a0a0a;border:1px solid #111;cursor:pointer}
.wk-cell.active{background:#fff;color:#000;border-color:#fff}
.wk-day{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10px;letter-spacing:.06em;color:#555;margin-bottom:4px}
.wk-cell.active .wk-day{color:#666}
.session-type-pill{padding:4px 10px;border-radius:12px;font-size:11px;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.drag-row{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid #0f0f0f;cursor:grab}
.drag-row:last-child{border-bottom:none}
.drag-handle{color:#333;font-size:16px;flex-shrink:0}
.floating-add{position:fixed;bottom:76px;right:16px;width:48px;height:48px;border-radius:50%;background:#fff;color:#000;font-size:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px #0008;z-index:90;cursor:pointer}
.inline-add-panel{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:12px;padding:14px;margin-bottom:12px;animation:fadeUp .2s ease}
.tag-pill{display:inline-flex;align-items:center;padding:3px 8px;border-radius:10px;font-size:11px;background:#1a1a1a;color:#888;margin:2px}
.score-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:36px;line-height:1}
.h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:24px;letter-spacing:.02em}
.h2{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:18px;letter-spacing:.02em}
.h3{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;letter-spacing:.02em}
.green-badge{background:#001f0d;color:#00cc66;border:1px solid #00441a;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:4px}
.amber-badge{background:#1a1200;color:#ffaa00;border:1px solid #443300;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700}
.red-badge{background:#1a0000;color:#ff4444;border:1px solid #440000;border-radius:6px;padding:3px 8px;font-size:12px;font-weight:700}
.mark-done-btn{width:100%;padding:14px;background:#111;border:1px solid #2a2a2a;border-radius:10px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#fff;cursor:pointer;transition:background .15s,border-color .15s;margin-top:14px}
.mark-done-btn:active{background:#00cc6633;border-color:#00cc66}
.mark-done-btn.flash{animation:greenFlash .5s ease}
`;

// ─── DB ──────────────────────────────────────────────────────────────────────
const _timers = {};
const DB = {
  get(key, def) {
    try {
      const v = localStorage.getItem('gd_' + key);
      return v !== null ? JSON.parse(v) : def;
    } catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('gd_' + key, JSON.stringify(val)); } catch {}
  },
  del(key) {
    try { localStorage.removeItem('gd_' + key); } catch {}
  },
  setDebounced(key, val, delay = 600) {
    clearTimeout(_timers[key]);
    _timers[key] = setTimeout(() => DB.set(key, val), delay);
  },
  exportAll() {
    try {
      const out = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('gd_')) out[k] = localStorage.getItem(k);
      }
      return out;
    } catch { return {}; }
  },
  importAll(raw) {
    try {
      Object.entries(raw).forEach(([k, v]) => {
        if (k.startsWith('gd_')) localStorage.setItem(k, v);
      });
    } catch {}
  },
  pruneOld(days = 60) {
    try {
      const cutoff = Date.now() - days * 86400000;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.match(/^gd_day_(\d{4}-\d{2}-\d{2})$/)) {
          const d = new Date(RegExp.$1);
          if (d.getTime() < cutoff) localStorage.removeItem(k);
        }
      }
    } catch {}
  }
};

// ─── UTILS ───────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2, '0');
const toMin = (h, m) => h * 60 + m;
const fromMin = t => ({ h: Math.floor(t / 60) % 24, m: t % 60 });
const fmt12 = (h, m) => {
  const ampm = h < 12 ? 'am' : 'pm';
  const hh = h % 12 || 12;
  return `${hh}:${pad(m)}${ampm}`;
};
const todayKey = () => new Date().toISOString().slice(0, 10);
const nowMin = () => {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
};

const BLOCK_COLORS = {
  work: '#4a9eff', workout: '#ff6b35', sleep: '#7c5cbf',
  wind_down: '#5c7cbf', habit: '#00cc66', meal: '#ffaa00',
  commute: '#888', recovery: '#00ccaa', productive: '#4a9eff',
  default: '#555'
};
const blockColor = type => BLOCK_COLORS[type] || BLOCK_COLORS.default;

// ─── COG ─────────────────────────────────────────────────────────────────────
const Cog = ({ size = 48, spin = false, color = '#fff', speed = '2s' }) => {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.38, r = size * 0.22, teeth = 12;
  const toothH = size * 0.1, toothW = size * 0.09;
  const points = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const a1 = a0 + (0.5 / teeth) * Math.PI * 2;
    const a2 = a1 + (0.3 / teeth) * Math.PI * 2;
    const a3 = a2 + (0.5 / teeth) * Math.PI * 2;
    [[R, a0], [R + toothH, a1], [R + toothH, a2], [R, a3]].forEach(([rad, a]) => {
      points.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
    });
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={spin ? { animation: `cogSpin ${speed} linear infinite` } : {}}>
      <polygon points={points.join(' ')} fill={color} />
      <circle cx={cx} cy={cy} r={r} fill="#000" />
      <circle cx={cx} cy={cy} r={r * 0.45} fill={color} />
    </svg>
  );
};

// ─── REBUILD SCHEDULE ────────────────────────────────────────────────────────
const MICRO_TASKS = [
  { id: 'mt1', name: 'Box Breathing', duration: 5, energy: 'low', category: 'recovery' },
  { id: 'mt2', name: 'Quick Walk', duration: 10, energy: 'low', category: 'recovery' },
  { id: 'mt3', name: 'Inbox Zero', duration: 15, energy: 'medium', category: 'productive' },
  { id: 'mt4', name: 'Read Articles', duration: 20, energy: 'low', category: 'productive' },
  { id: 'mt5', name: 'Journal', duration: 10, energy: 'low', category: 'recovery' },
  { id: 'mt6', name: 'Foam Roll / Stretch', duration: 10, energy: 'low', category: 'recovery' },
  { id: 'mt7', name: 'Review Goals', duration: 10, energy: 'low', category: 'productive' },
  { id: 'mt8', name: 'Plan Tomorrow', duration: 15, energy: 'medium', category: 'productive' },
  { id: 'mt9', name: 'Cold Exposure', duration: 5, energy: 'medium', category: 'recovery' },
  { id: 'mt10', name: 'Gratitude List', duration: 5, energy: 'low', category: 'recovery' },
  { id: 'mt11', name: 'Text a Friend', duration: 5, energy: 'low', category: 'productive' },
  { id: 'mt12', name: 'Declutter Desk', duration: 10, energy: 'low', category: 'productive' },
];

const rebuildSchedule = (opts = {}) => {
  const {
    wakeTime = { h: 5, m: 30 },
    sleepTime = { h: 22, m: 30 },
    fixedBlocks = [],
    flexBlocks = [],
    energyPattern = 'morning_peak',
    gapFillers = [],
    windDownDur = 30,
  } = opts;

  const wakeMin = toMin(wakeTime.h, wakeTime.m);
  const sleepMin = toMin(sleepTime.h, sleepTime.m) + (sleepTime.h < wakeTime.h ? 1440 : 0);
  const windStart = sleepMin - windDownDur;

  const blocks = [];
  const used = id => blocks.some(b => b.sourceId === id);

  // Morning routine always first
  blocks.push({
    id: 'auto_wake', name: 'Morning Routine', type: 'habit',
    start: wakeMin, end: wakeMin + 45, locked: true, isAuto: true,
    color: blockColor('habit')
  });

  // Place fixed blocks
  fixedBlocks.forEach((fb, i) => {
    const days = fb.days || [0,1,2,3,4,5,6];
    const dow = new Date().getDay();
    if (!days.includes(dow)) return;
    blocks.push({
      id: 'fixed_' + i, name: fb.name, type: fb.type || 'work',
      start: toMin(fb.startH || 9, fb.startM || 0),
      end: toMin(fb.endH || 10, fb.endM || 0),
      locked: true, isAuto: false,
      color: blockColor(fb.type || 'work')
    });
  });

  // Score + sort flex blocks
  const energyBoost = h => {
    if (energyPattern === 'morning_peak') return h < 12 ? 20 : h < 15 ? 5 : -10;
    if (energyPattern === 'afternoon_peak') return h >= 13 && h <= 17 ? 20 : 0;
    if (energyPattern === 'evening_peak') return h >= 18 ? 20 : -5;
    return 0; // steady
  };
  const scored = [...flexBlocks].map(b => ({
    ...b,
    score: (b.importance || 5) * 10 + (b.energy === 'high' ? 5 : 0)
  })).sort((a, b) => b.score - a.score);

  // First-fit placement for flex blocks
  scored.forEach((fb, i) => {
    const dur = fb.duration || 30;
    const prefStart = fb.prefTime ? toMin(fb.prefTime.h, fb.prefTime.m) : wakeMin + 90;
    // find first gap >= dur starting near prefStart
    const sorted = [...blocks].sort((a, b) => a.start - b.start);
    let placed = false;
    for (let attempt = 0; attempt < 2; attempt++) {
      const searchStart = attempt === 0 ? prefStart : wakeMin;
      for (let t = searchStart; t + dur <= windStart; t += 5) {
        const conflicts = sorted.some(b =>
          !(t >= b.end || t + dur <= b.start)
        );
        if (!conflicts) {
          blocks.push({
            id: 'flex_' + i, name: fb.name, type: fb.type || 'work',
            start: t, end: t + dur, locked: false, isAuto: true,
            color: blockColor(fb.type || 'work')
          });
          placed = true;
          break;
        }
      }
      if (placed) break;
    }
  });

  // Fill gaps with micro tasks
  const sortedFinal = [...blocks].sort((a, b) => a.start - b.start);
  const gaps = [];
  for (let i = 0; i < sortedFinal.length - 1; i++) {
    const gapStart = sortedFinal[i].end;
    const gapEnd = sortedFinal[i + 1].start;
    if (gapEnd - gapStart >= 5 && gapStart < windStart) {
      gaps.push({ start: gapStart, end: Math.min(gapEnd, windStart) });
    }
  }
  // check gap before first block
  if (sortedFinal.length && sortedFinal[0].start > wakeMin + 5) {
    gaps.unshift({ start: wakeMin + 45, end: sortedFinal[0].start });
  }

  const microLib = gapFillers.length ? gapFillers : MICRO_TASKS;
  gaps.forEach(gap => {
    let t = gap.start;
    const prevBlock = blocks.find(b => b.end <= t);
    const isPostHigh = prevBlock?.type === 'workout' || prevBlock?.energy === 'high';
    const candidates = microLib.filter(mt =>
      isPostHigh ? mt.category === 'recovery' : true
    );
    let ci = 0;
    while (t + 5 <= gap.end && ci < candidates.length) {
      const mt = candidates[ci % candidates.length];
      const dur = Math.min(mt.duration, gap.end - t);
      if (dur >= 5) {
        blocks.push({
          id: 'micro_' + t, name: mt.name, type: mt.category,
          start: t, end: t + dur, locked: false, isAuto: true,
          color: blockColor(mt.category)
        });
        t += dur;
      }
      ci++;
    }
  });

  // Wind down + sleep
  blocks.push({
    id: 'auto_wind', name: 'Wind Down', type: 'wind_down',
    start: windStart, end: sleepMin, locked: true, isAuto: true, flexible: false,
    color: blockColor('wind_down')
  });
  blocks.push({
    id: 'auto_sleep', name: 'Sleep', type: 'sleep',
    start: sleepMin, end: wakeMin + 1440, locked: true, isAuto: true,
    color: blockColor('sleep')
  });

  return blocks.sort((a, b) => a.start - b.start);
};

// ─── TIME PICKER ─────────────────────────────────────────────────────────────
const TimePicker = ({ value = { h: 6, m: 0 }, onChange, label }) => {
  const { h, m } = value;
  const isAm = h < 12;
  const disp12 = h % 12 || 12;
  const adj = (field, delta) => {
    if (field === 'h') {
      const newH = (h + delta + 24) % 24;
      onChange({ h: newH, m });
    } else {
      const newM = (m + delta + 60) % 60;
      onChange({ h, m: newM });
    }
  };
  const toggleAmPm = () => onChange({ h: (h + 12) % 24, m });
  return (
    <div>
      {label && <div className="field-label" style={{ textAlign: 'center' }}>{label}</div>}
      <div className="time-picker-large">
        <div className="tpl-col">
          <button className="tpl-btn" onClick={() => adj('h', 1)}>▲</button>
          <div className="tpl-val">{pad(disp12)}</div>
          <button className="tpl-btn" onClick={() => adj('h', -1)}>▼</button>
        </div>
        <div className="tpl-sep">:</div>
        <div className="tpl-col">
          <button className="tpl-btn" onClick={() => adj('m', 5)}>▲</button>
          <div className="tpl-val">{pad(m)}</div>
          <button className="tpl-btn" onClick={() => adj('m', -5)}>▼</button>
        </div>
        <div className="ampm-toggle" style={{ marginLeft: 8 }}>
          <button className={`ampm-btn${isAm ? ' active' : ''}`} onClick={() => !isAm && toggleAmPm()}>AM</button>
          <button className={`ampm-btn${!isAm ? ' active' : ''}`} onClick={() => isAm && toggleAmPm()}>PM</button>
        </div>
      </div>
    </div>
  );
};

// ─── AUTH ────────────────────────────────────────────────────────────────────
const AuthScreen = ({ onAuth }) => {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setErr('');
    if (!email.trim()) { setErr('Email required'); return; }
    if (!pass.trim()) { setErr('Password required'); return; }
    if (mode === 'signup' && !name.trim()) { setErr('Name required'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'signup') {
        DB.set('user', { name: name.trim(), email: email.trim() });
        DB.set('authed', true);
        onAuth(true); // new user → onboarding
      } else {
        const u = DB.get('user', null);
        if (!u) { setErr('No account found. Sign up first.'); return; }
        DB.set('authed', true);
        onAuth(false); // existing user → main
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '32px 24px', background: '#000'
    }}>
      <div style={{ marginBottom: 32 }}>
        <Cog size={56} spin color="#fff" speed="3s" />
      </div>
      <div style={{ width: '100%', maxWidth: 360 }} className="fade-up">
        <div className="h1" style={{ textAlign: 'center', marginBottom: 4 }}>
          {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </div>
        <div style={{ textAlign: 'center', color: '#555', fontSize: 13, marginBottom: 32 }}>
          {mode === 'signin' ? 'Welcome back.' : 'Start building your discipline.'}
        </div>

        {mode === 'signup' && (
          <div style={{ marginBottom: 24 }}>
            <div className="field-label">Name</div>
            <input className="underline-input" placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div style={{ marginBottom: 24 }}>
          <div className="field-label">Email</div>
          <input className="underline-input" type="email" placeholder="you@example.com"
            value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 32 }}>
          <div className="field-label">Password</div>
          <input className="underline-input" type="password" placeholder="••••••••"
            value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        {err && <div style={{ color: '#ff4444', fontSize: 12, marginBottom: 16, textAlign: 'center' }}>{err}</div>}

        <button className="btn-white" onClick={submit} disabled={loading}>
          {loading ? '...' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErr(''); }}
            style={{ color: '#666', fontSize: 13, textDecoration: 'underline', background: 'none', cursor: 'pointer' }}>
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
const GOAL_CATEGORIES = ['Fitness', 'Career', 'Mental Health', 'Relationships', 'Finance', 'Creative', 'Spiritual', 'Other'];
const ENERGY_OPTIONS = [
  { id: 'morning_peak', label: 'Morning Peak', sub: 'Best energy 5am–12pm' },
  { id: 'afternoon_peak', label: 'Afternoon Peak', sub: 'Best energy 1pm–5pm' },
  { id: 'evening_peak', label: 'Evening Peak', sub: 'Best energy 6pm–10pm' },
  { id: 'steady', label: 'Steady All Day', sub: 'Consistent energy throughout' },
];
const ACTIVITY_PRESETS = [
  { name: 'Upper Body Lift', type: 'workout', duration: 60, energy: 'high' },
  { name: 'Lower Body Lift', type: 'workout', duration: 60, energy: 'high' },
  { name: 'Full Body Lift', type: 'workout', duration: 75, energy: 'high' },
  { name: 'BJJ Practice', type: 'workout', duration: 90, energy: 'high' },
  { name: 'Run', type: 'workout', duration: 45, energy: 'high' },
  { name: 'Yoga / Mobility', type: 'recovery', duration: 30, energy: 'low' },
  { name: 'Deep Work Block', type: 'work', duration: 90, energy: 'high' },
  { name: 'Reading', type: 'productive', duration: 30, energy: 'low' },
  { name: 'Meditation', type: 'habit', duration: 15, energy: 'low' },
  { name: 'Meal Prep', type: 'meal', duration: 45, energy: 'medium' },
];
const SCHEDULE_STRUCTURES = [
  { id: 'time_blocked', label: 'Time Blocked', sub: 'Every hour planned' },
  { id: 'anchor', label: 'Anchor Points', sub: 'Key blocks, flexible gaps' },
  { id: 'loose', label: 'Loose Framework', sub: 'Morning + evening fixed only' },
];
const GAP_FILLERS = [
  { id: 'mt1', name: 'Box Breathing', category: 'recovery' },
  { id: 'mt2', name: 'Quick Walk', category: 'recovery' },
  { id: 'mt3', name: 'Inbox Zero', category: 'productive' },
  { id: 'mt4', name: 'Read Articles', category: 'productive' },
  { id: 'mt5', name: 'Journal', category: 'recovery' },
  { id: 'mt6', name: 'Foam Roll', category: 'recovery' },
  { id: 'mt7', name: 'Review Goals', category: 'productive' },
  { id: 'mt8', name: 'Plan Tomorrow', category: 'productive' },
];
const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [goalCats, setGoalCats] = useState([]);
  const [wakeTime, setWakeTime] = useState({ h: 5, m: 30 });
  const [sleepTime, setSleepTime] = useState({ h: 22, m: 30 });
  const [fixedCommits, setFixedCommits] = useState([]);
  const [newFC, setNewFC] = useState({ name: '', startH: 9, startM: 0, endH: 10, endM: 0, days: [] });
  const [energyPattern, setEnergyPattern] = useState('morning_peak');
  const [activities, setActivities] = useState([]);
  const [newAct, setNewAct] = useState({ name: '', type: 'work', duration: 60, energy: 'medium', prefTime: { h: 7, m: 0 }, days: [], daysPerWeek: 3 });
  const [habitsGain, setHabitsGain] = useState([]);
  const [habitsElim, setHabitsElim] = useState([]);
  const [newHabitG, setNewHabitG] = useState('');
  const [newHabitE, setNewHabitE] = useState('');
  const [standards, setStandards] = useState([
    'Sleep 7+ hours', 'Exercise or move', 'No social media before 9am', 'Log food / water intake', 'Read 20 minutes'
  ]);
  const [scheduleStructure, setScheduleStructure] = useState('anchor');
  const [gapFillers, setGapFillers] = useState(['mt1', 'mt3', 'mt7', 'mt8']);
  const TOTAL = 9;

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const addActivity = (preset = null) => {
    const act = preset ? { ...preset, prefTime: { h: 7, m: 0 }, days: [], daysPerWeek: 3 } : { ...newAct };
    if (!act.name.trim()) return;
    setActivities(prev => [...prev, { ...act, id: Date.now() }]);
    if (!preset) setNewAct({ name: '', type: 'work', duration: 60, energy: 'medium', prefTime: { h: 7, m: 0 }, days: [], daysPerWeek: 3 });
  };

  const finish = () => {
    const onboardData = {
      goal, goalCats, wakeTime, sleepTime,
      fixedBlocks: fixedCommits, energyPattern, activities,
      habitsGain, habitsElim, standards, scheduleStructure, gapFillers
    };
    DB.set('onboard', onboardData);
    const schedule = rebuildSchedule({
      wakeTime, sleepTime,
      fixedBlocks: fixedCommits,
      flexBlocks: activities.map(a => ({
        name: a.name, type: a.type, duration: a.duration,
        energy: a.energy, prefTime: a.prefTime, importance: 7
      })),
      energyPattern,
      gapFillers: GAP_FILLERS.filter(g => gapFillers.includes(g.id)),
    });
    DB.set('schedule_' + todayKey(), schedule.filter(b => !b.isAuto || b.locked));
    DB.set('schedule_template', { wakeTime, sleepTime, fixedBlocks: fixedCommits, flexBlocks: activities, energyPattern, gapFillers });
    DB.set('onboarded', true);
    onComplete(onboardData);
  };

  const steps = [
    // Step 0 — Goal
    <div key="s0" className="fade-up">
      <div className="onboard-step">Step 1 of {TOTAL}</div>
      <div className="onboard-title">WHAT'S YOUR MAIN GOAL?</div>
      <div className="onboard-sub">Be specific. This drives your entire schedule.</div>
      <textarea className="underline-input" rows={3}
        placeholder="e.g. Compete in my first BJJ tournament by July and hit 185 lbs..."
        value={goal} onChange={e => setGoal(e.target.value)}
        style={{ borderBottom: '1px solid #333', width: '100%', padding: '8px 0', lineHeight: 1.5 }} />
      <div style={{ marginTop: 20 }}>
        <div className="field-label">Category (optional)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {GOAL_CATEGORIES.map(c => (
            <button key={c} className={`chip chip-sm${goalCats.includes(c) ? ' active' : ''}`}
              onClick={() => toggleArr(goalCats, setGoalCats, c)}>{c}</button>
          ))}
        </div>
      </div>
    </div>,

    // Step 1 — Wake/Sleep
    <div key="s1" className="fade-up">
      <div className="onboard-step">Step 2 of {TOTAL}</div>
      <div className="onboard-title">SLEEP SCHEDULE</div>
      <div className="onboard-sub">When do you wake up and go to sleep?</div>
      <TimePicker label="Wake Time" value={wakeTime} onChange={setWakeTime} />
      <div style={{ height: 24 }} />
      <TimePicker label="Sleep Time" value={sleepTime} onChange={setSleepTime} />
    </div>,

    // Step 2 — Fixed commitments
    <div key="s2" className="fade-up">
      <div className="onboard-step">Step 3 of {TOTAL}</div>
      <div className="onboard-title">FIXED COMMITMENTS</div>
      <div className="onboard-sub">Work, school, or anything that can't move.</div>
      {fixedCommits.map((fc, i) => (
        <div key={i} className="card" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{fc.name}</div>
            <div style={{ fontSize: 11, color: '#555' }}>
              {fmt12(fc.startH, fc.startM)} – {fmt12(fc.endH, fc.endM)} · {fc.days.map(d => DAYS_SHORT[d]).join(', ')}
            </div>
          </div>
          <button onClick={() => setFixedCommits(prev => prev.filter((_, j) => j !== i))}
            style={{ color: '#555', fontSize: 18 }}>×</button>
        </div>
      ))}
      <div className="card-dark" style={{ marginTop: 8 }}>
        <div className="field-label" style={{ marginBottom: 8 }}>Add Commitment</div>
        <input className="underline-input" placeholder="Name (e.g. Work, Class)"
          value={newFC.name} onChange={e => setNewFC(p => ({ ...p, name: e.target.value }))}
          style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label">Start</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
              <input type="number" min={0} max={23} value={newFC.startH}
                onChange={e => setNewFC(p => ({ ...p, startH: +e.target.value }))}
                style={{ width: 40, borderBottom: '1px solid #333', textAlign: 'center', padding: '4px 0' }} />
              <span>:</span>
              <input type="number" min={0} max={59} step={5} value={newFC.startM}
                onChange={e => setNewFC(p => ({ ...p, startM: +e.target.value }))}
                style={{ width: 40, borderBottom: '1px solid #333', textAlign: 'center', padding: '4px 0' }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">End</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
              <input type="number" min={0} max={23} value={newFC.endH}
                onChange={e => setNewFC(p => ({ ...p, endH: +e.target.value }))}
                style={{ width: 40, borderBottom: '1px solid #333', textAlign: 'center', padding: '4px 0' }} />
              <span>:</span>
              <input type="number" min={0} max={59} step={5} value={newFC.endM}
                onChange={e => setNewFC(p => ({ ...p, endM: +e.target.value }))}
                style={{ width: 40, borderBottom: '1px solid #333', textAlign: 'center', padding: '4px 0' }} />
            </div>
          </div>
        </div>
        <div className="field-label" style={{ marginBottom: 6 }}>Days</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {DAYS_SHORT.map((d, i) => (
            <button key={i} className={`chip chip-sm${newFC.days.includes(i) ? ' active' : ''}`}
              onClick={() => setNewFC(p => ({ ...p, days: p.days.includes(i) ? p.days.filter(x => x !== i) : [...p.days, i] }))}>
              {d}
            </button>
          ))}
        </div>
        <button className="btn-white" onClick={() => {
          if (!newFC.name.trim()) return;
          setFixedCommits(prev => [...prev, newFC]);
          setNewFC({ name: '', startH: 9, startM: 0, endH: 10, endM: 0, days: [] });
        }}>+ ADD</button>
      </div>
    </div>,

    // Step 3 — Energy pattern
    <div key="s3" className="fade-up">
      <div className="onboard-step">Step 4 of {TOTAL}</div>
      <div className="onboard-title">YOUR ENERGY PATTERN</div>
      <div className="onboard-sub">When are you at peak performance?</div>
      {ENERGY_OPTIONS.map(opt => (
        <div key={opt.id} className={`energy-row${energyPattern === opt.id ? ' selected' : ''}`}
          onClick={() => setEnergyPattern(opt.id)}>
          <div className="er-label">{opt.label}</div>
          <div className="er-sub">{opt.sub}</div>
        </div>
      ))}
    </div>,

    // Step 4 — Activities
    <div key="s4" className="fade-up">
      <div className="onboard-step">Step 5 of {TOTAL}</div>
      <div className="onboard-title">YOUR ACTIVITIES</div>
      <div className="onboard-sub">What do you want to schedule regularly?</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {ACTIVITY_PRESETS.map(p => (
          <button key={p.name} className="chip chip-sm"
            onClick={() => addActivity(p)}
            style={{ borderColor: activities.find(a => a.name === p.name) ? '#00cc66' : '#2a2a2a',
                     color: activities.find(a => a.name === p.name) ? '#00cc66' : '#999' }}>
            + {p.name}
          </button>
        ))}
      </div>
      {activities.map((a, i) => (
        <div key={a.id} className="card" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: '#555' }}>{a.duration}min · {a.energy} energy · {a.daysPerWeek}×/wk</div>
          </div>
          <button onClick={() => setActivities(prev => prev.filter((_, j) => j !== i))}
            style={{ color: '#555', fontSize: 18 }}>×</button>
        </div>
      ))}
      <div className="card-dark" style={{ marginTop: 8 }}>
        <div className="field-label" style={{ marginBottom: 8 }}>Custom Activity</div>
        <input className="underline-input" placeholder="Activity name"
          value={newAct.name} onChange={e => setNewAct(p => ({ ...p, name: e.target.value }))}
          style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label">Duration</div>
            <select value={newAct.duration} onChange={e => setNewAct(p => ({ ...p, duration: +e.target.value }))}
              style={{ width: '100%', borderBottom: '1px solid #333', padding: '6px 0', marginTop: 4 }}>
              {[15,20,30,45,60,75,90,120].map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">Energy</div>
            <select value={newAct.energy} onChange={e => setNewAct(p => ({ ...p, energy: e.target.value }))}
              style={{ width: '100%', borderBottom: '1px solid #333', padding: '6px 0', marginTop: 4 }}>
              {['low','medium','high'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="field-label" style={{ marginBottom: 6 }}>Days/Week</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {[1,2,3,4,5,6,7].map(n => (
            <button key={n} className={`chip chip-sm${newAct.daysPerWeek === n ? ' active' : ''}`}
              onClick={() => setNewAct(p => ({ ...p, daysPerWeek: n }))}>{n}</button>
          ))}
        </div>
        <button className="btn-white" onClick={() => addActivity()}>+ ADD</button>
      </div>
    </div>,

    // Step 5 — Habits
    <div key="s5" className="fade-up">
      <div className="onboard-step">Step 6 of {TOTAL}</div>
      <div className="onboard-title">HABITS</div>
      <div className="onboard-sub">What are you building and eliminating?</div>
      <div className="field-label" style={{ marginBottom: 8, color: '#00cc66' }}>BUILD</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {habitsGain.map((h, i) => (
          <button key={i} className="chip chip-sm active"
            onClick={() => setHabitsGain(prev => prev.filter((_, j) => j !== i))}
            style={{ background: '#001a0a', color: '#00cc66', borderColor: '#00441a' }}>
            {h} ×
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input className="underline-input" placeholder="Add habit to build"
          value={newHabitG} onChange={e => setNewHabitG(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newHabitG.trim()) { setHabitsGain(p => [...p, newHabitG.trim()]); setNewHabitG(''); }}}
          style={{ flex: 1 }} />
        <button onClick={() => { if (newHabitG.trim()) { setHabitsGain(p => [...p, newHabitG.trim()]); setNewHabitG(''); }}}
          style={{ color: '#00cc66', fontSize: 20, paddingBottom: 4 }}>+</button>
      </div>
      <div className="field-label" style={{ marginBottom: 8, color: '#ff4444' }}>ELIMINATE</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {habitsElim.map((h, i) => (
          <button key={i} className="chip chip-sm"
            onClick={() => setHabitsElim(prev => prev.filter((_, j) => j !== i))}
            style={{ background: '#1a0000', color: '#ff4444', borderColor: '#440000' }}>
            {h} ×
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="underline-input" placeholder="Add habit to eliminate"
          value={newHabitE} onChange={e => setNewHabitE(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newHabitE.trim()) { setHabitsElim(p => [...p, newHabitE.trim()]); setNewHabitE(''); }}}
          style={{ flex: 1 }} />
        <button onClick={() => { if (newHabitE.trim()) { setHabitsElim(p => [...p, newHabitE.trim()]); setNewHabitE(''); }}}
          style={{ color: '#ff4444', fontSize: 20, paddingBottom: 4 }}>+</button>
      </div>
    </div>,

    // Step 6 — Daily Standards
    <div key="s6" className="fade-up">
      <div className="onboard-step">Step 7 of {TOTAL}</div>
      <div className="onboard-title">DAILY STANDARDS</div>
      <div className="onboard-sub">The five non-negotiables you hold yourself to every day.</div>
      {standards.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 13, color: '#555' }}>{i + 1}</div>
          <input className="underline-input" value={s}
            onChange={e => setStandards(prev => prev.map((x, j) => j === i ? e.target.value : x))}
            style={{ flex: 1 }} />
        </div>
      ))}
    </div>,

    // Step 7 — Schedule structure + gap fillers
    <div key="s7" className="fade-up">
      <div className="onboard-step">Step 8 of {TOTAL}</div>
      <div className="onboard-title">SCHEDULE STYLE</div>
      <div className="onboard-sub">How tightly structured do you want your day?</div>
      {SCHEDULE_STRUCTURES.map(opt => (
        <div key={opt.id} className={`energy-row${scheduleStructure === opt.id ? ' selected' : ''}`}
          onClick={() => setScheduleStructure(opt.id)}>
          <div className="er-label">{opt.label}</div>
          <div className="er-sub">{opt.sub}</div>
        </div>
      ))}
      <div style={{ height: 24 }} />
      <div className="field-label" style={{ marginBottom: 8 }}>Gap-Filler Micro-Tasks</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {GAP_FILLERS.map(g => (
          <button key={g.id} className={`chip chip-sm${gapFillers.includes(g.id) ? ' active' : ''}`}
            onClick={() => toggleArr(gapFillers, setGapFillers, g.id)}>
            {g.name}
          </button>
        ))}
      </div>
    </div>,

    // Step 8 — Review + BUILD
    <div key="s8" className="fade-up">
      <div className="onboard-step">Step 9 of {TOTAL}</div>
      <div className="onboard-title">REVIEW & BUILD</div>
      <div className="onboard-sub">Here's your setup. Hit BUILD to generate your 7-day schedule.</div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-label">GOAL</div>
        <div style={{ fontSize: 14 }}>{goal || '(not set)'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {goalCats.map(c => <span key={c} className="tag-pill">{c}</span>)}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-label">SLEEP</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div><div className="field-label">WAKE</div><div className="h3">{fmt12(wakeTime.h, wakeTime.m)}</div></div>
          <div><div className="field-label">SLEEP</div><div className="h3">{fmt12(sleepTime.h, sleepTime.m)}</div></div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-label">ACTIVITIES ({activities.length})</div>
        {activities.map((a, i) => (
          <div key={i} style={{ fontSize: 13, color: '#ccc', marginBottom: 4 }}>• {a.name} — {a.duration}min</div>
        ))}
        {activities.length === 0 && <div style={{ color: '#555', fontSize: 13 }}>None added</div>}
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-label">STANDARDS</div>
        {standards.map((s, i) => (
          <div key={i} style={{ fontSize: 13, color: '#ccc', marginBottom: 4 }}>{i+1}. {s}</div>
        ))}
      </div>
      <button className="btn-white" onClick={finish}>BUILD MY SCHEDULE →</button>
    </div>,
  ];

  return (
    <div className="onboard-wrap">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Cog size={28} spin color="#fff" speed="4s" />
        <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 16, letterSpacing: '.1em' }}>GRIND DESIGNED</div>
      </div>
      <div className="progress-bar" style={{ marginBottom: 28 }}>
        <div className="progress-fill" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} />
      </div>
      <div style={{ minHeight: '60vh' }}>{steps[step]}</div>
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        {step > 0 && (
          <button className="btn-outline" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>← BACK</button>
        )}
        {step < TOTAL - 1 && (
          <button className="btn-white" style={{ flex: 2 }} onClick={() => setStep(s => s + 1)}>NEXT →</button>
        )}
      </div>
    </div>
  );
};

// ─── RING ────────────────────────────────────────────────────────────────────
const Ring = ({ score = 0, size = 72 }) => {
  const r = (size - 10) / 2, circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const color = score >= 80 ? '#ff4444' : score >= 60 ? '#ffaa00' : '#fff';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a1a" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset .6s ease, stroke .4s' }} />
    </svg>
  );
};

// ─── MORNING CHECKLIST ───────────────────────────────────────────────────────
const MorningChecklist = ({ standards, completedIds, onToggle, onDismiss }) => {
  const done = standards.filter((_, i) => completedIds.includes('mc_' + i)).length;
  const pct = standards.length ? (done / standards.length) * 100 : 0;
  return (
    <div className="morning-checklist">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Cog size={24} spin color="#fff" speed="4s" />
        <div className="h2">MORNING ROUTINE</div>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
      <div style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>{done} / {standards.length} complete</div>
      {standards.map((s, i) => {
        const id = 'mc_' + i;
        const checked = completedIds.includes(id);
        return (
          <div key={id} className={`mc-item${checked ? ' done' : ''}`} onClick={() => onToggle(id)}>
            <div className="mc-check">
              {checked && <span style={{ color: '#000', fontSize: 14, fontWeight: 800 }}>✓</span>}
            </div>
            <div style={{ fontSize: 15, fontWeight: checked ? 600 : 400, color: checked ? '#ccc' : '#fff',
              textDecoration: checked ? 'line-through' : 'none' }}>{s}</div>
          </div>
        );
      })}
      {pct >= 100 && (
        <button className="btn-white" style={{ marginTop: 24 }} onClick={onDismiss}>
          MORNING COMPLETE →
        </button>
      )}
    </div>
  );
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
const Dashboard = ({ appData, setAppData }) => {
  const now = nowMin();
  const h = Math.floor(now / 60);
  const isMorning = h >= 6 && h < 7 && h * 60 + (now % 60) < 7 * 60 + 10;
  const isEvening = h >= 20 && h < 24;

  const schedule = appData.todaySchedule || [];
  const completedIds = appData.completedIds || [];
  const mcCompleted = appData.mcCompleted || [];
  const onboard = appData.onboard || {};
  const standards = onboard.standards || ['Sleep 7+ hours','Exercise or move','No social media before 9am','Log food/water','Read 20 min'];
  const affirmations = appData.affirmations || [
    '"Discipline is the bridge between goals and accomplishment."',
    '"You do not rise to the level of your goals, you fall to the level of your systems."',
    '"Every rep, every set, every day — this is who you are becoming."',
  ];
  const todayAffirmIdx = new Date().getDate() % affirmations.length;

  const morningBlock = schedule.find(b => b.name === 'Morning Routine' || b.type === 'habit');
  const morningDone = morningBlock && completedIds.includes(morningBlock.id);
  const showMorning = isMorning && !morningDone && !appData.mcDismissed;

  const currentBlock = schedule.find(b => now >= b.start && now < b.end);
  const nextBlocks = schedule.filter(b => b.start > now).slice(0, 3);
  const remainMin = currentBlock ? currentBlock.end - now : 0;

  const [doneFash, setDoneFlash] = useState(false);
  const [focusText, setFocusText] = useState(() => DB.get('focus_text', ''));
  const [inbox, setInbox] = useState(() => DB.get('inbox', []));
  const [newInbox, setNewInbox] = useState('');
  const [showInboxAdd, setShowInboxAdd] = useState(false);

  const priorityItems = [
    onboard.goal || 'Define your main goal',
    ...(onboard.activities || []).slice(0, 2).map(a => a.name),
  ].slice(0, 3);

  const disciplineScore = useMemo(() => {
    const total = standards.length;
    if (!total) return 0;
    const done = (appData.todayStandards || []).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }, [appData.todayStandards, standards]);

  const markDone = () => {
    if (!currentBlock) return;
    setDoneFlash(true);
    setTimeout(() => setDoneFlash(false), 600);
    const updated = [...completedIds, currentBlock.id];
    setAppData(p => ({ ...p, completedIds: updated }));
    DB.set('completed_' + todayKey(), updated);
  };

  const toggleMcItem = id => {
    const updated = mcCompleted.includes(id)
      ? mcCompleted.filter(x => x !== id)
      : [...mcCompleted, id];
    setAppData(p => ({ ...p, mcCompleted: updated }));
    DB.set('mc_' + todayKey(), updated);
  };

  const addInboxTask = () => {
    if (!newInbox.trim()) return;
    const item = { id: Date.now(), text: newInbox.trim(), done: false };
    const updated = [...inbox, item];
    setInbox(updated);
    DB.set('inbox', updated);
    setNewInbox('');
    setShowInboxAdd(false);
  };

  const toggleInbox = id => {
    const updated = inbox.map(it => it.id === id ? { ...it, done: !it.done } : it);
    setInbox(updated);
    DB.set('inbox', updated);
  };

  if (showMorning) {
    return (
      <MorningChecklist
        standards={standards}
        completedIds={mcCompleted}
        onToggle={toggleMcItem}
        onDismiss={() => setAppData(p => ({ ...p, mcDismissed: true }))}
      />
    );
  }

  return (
    <div className="page" style={{ paddingTop: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Cog size={20} spin color="#fff" speed="5s" />
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 15, letterSpacing: '.1em' }}>GRIND DESIGNED</div>
        </div>
        <div style={{ fontSize: 11, color: '#444' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
        </div>
      </div>

      {/* DO THIS NOW */}
      <div className="do-this-now" style={{ marginBottom: 14, animation: doneFash ? 'greenFlash .5s ease' : undefined }}>
        <div className="section-label" style={{ marginBottom: 10 }}>DO THIS NOW</div>
        {currentBlock ? (
          <>
            <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
              {currentBlock.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className="green-badge">
                <span className="pulse-anim" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#00cc66' }} />
                {remainMin}m left
              </span>
              <span style={{ fontSize: 11, color: '#555' }}>
                {fmt12(fromMin(currentBlock.start).h, fromMin(currentBlock.start).m)} – {fmt12(fromMin(currentBlock.end).h, fromMin(currentBlock.end).m)}
              </span>
            </div>
            <button className={`mark-done-btn${doneFash ? ' flash' : ''}`} onClick={markDone}>
              {completedIds.includes(currentBlock.id) ? '✓ MARKED DONE' : 'MARK DONE'}
            </button>
          </>
        ) : (
          <div style={{ color: '#555', fontSize: 14 }}>No block scheduled right now.</div>
        )}
      </div>

      {/* UP NEXT */}
      {nextBlocks.length > 0 && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-label">UP NEXT</div>
          {nextBlocks.map(b => (
            <div key={b.id} className="up-next-row">
              <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: b.color || '#555', flexShrink: 0 }} />
              <div style={{ fontSize: 11, color: '#555', minWidth: 52 }}>
                {fmt12(fromMin(b.start).h, fromMin(b.start).m)}
              </div>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{b.name}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{b.end - b.start}m</div>
            </div>
          ))}
        </div>
      )}

      {/* Score + Focus */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div className="card ring-wrap" style={{ flex: 1, padding: 16 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>DISCIPLINE</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ring score={disciplineScore} size={72} />
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div className="score-num" style={{
                color: disciplineScore >= 80 ? '#ff4444' : disciplineScore >= 60 ? '#ffaa00' : '#fff',
                fontSize: 22, lineHeight: 1
              }}>{disciplineScore}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: disciplineScore > (appData.prevScore || 50) ? '#00cc66' : '#ff4444', marginTop: 6 }}>
            {disciplineScore > (appData.prevScore || 50) ? '▲' : '▼'} vs yesterday
          </div>
        </div>
        <div className="card" style={{ flex: 2, padding: 16 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>MAIN FOCUS</div>
          <textarea
            value={focusText}
            onChange={e => { setFocusText(e.target.value); DB.setDebounced('focus_text', e.target.value); }}
            placeholder="What is the one thing that matters most today?"
            style={{ width: '100%', fontSize: 13, color: '#ccc', lineHeight: 1.5, minHeight: 72 }}
          />
        </div>
      </div>

      {/* Identity */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>IDENTITY</div>
        <div className="identity-quote">{affirmations[todayAffirmIdx]}</div>
      </div>

      {/* Why I'm Doing This */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>WHY I'M DOING THIS</div>
        {priorityItems.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 2 ? 10 : 0 }}>
            <div className="priority-num">{i + 1}</div>
            <div style={{ fontSize: 13, paddingTop: 6, color: '#ccc', lineHeight: 1.4 }}>{p}</div>
          </div>
        ))}
      </div>

      {/* Training block if exists today */}
      {(() => {
        const trainBlock = schedule.find(b => b.type === 'workout');
        if (!trainBlock) return null;
        const done = completedIds.includes(trainBlock.id);
        return (
          <div className="card" style={{ marginBottom: 14, borderColor: done ? '#00441a' : '#1a1a1a' }}>
            <div className="section-label" style={{ marginBottom: 6 }}>TODAY'S TRAINING</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{trainBlock.name}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                  {fmt12(fromMin(trainBlock.start).h, fromMin(trainBlock.start).m)} · {trainBlock.end - trainBlock.start}min
                </div>
              </div>
              <span style={{ fontSize: 11, color: done ? '#00cc66' : '#555' }}>{done ? '✓ Done' : 'Upcoming'}</span>
            </div>
          </div>
        );
      })()}

      {/* Inbox */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="section-label" style={{ margin: 0 }}>INBOX</div>
          <button onClick={() => setShowInboxAdd(p => !p)}
            style={{ fontSize: 11, color: '#555', textDecoration: 'underline' }}>
            {showInboxAdd ? 'Cancel' : '+ Add'}
          </button>
        </div>
        {showInboxAdd && (
          <div className="inline-add-panel" style={{ marginBottom: 10 }}>
            <input className="underline-input" placeholder="Quick task..."
              value={newInbox} onChange={e => setNewInbox(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addInboxTask()}
              style={{ marginBottom: 8 }} autoFocus />
            <button className="btn-white" style={{ fontSize: 13 }} onClick={addInboxTask}>ADD TASK</button>
          </div>
        )}
        {inbox.filter(it => !it.done).slice(0, 5).map(it => (
          <div key={it.id} className="inbox-item">
            <button onClick={() => toggleInbox(it.id)}
              style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            </button>
            <div style={{ fontSize: 13, flex: 1 }}>{it.text}</div>
          </div>
        ))}
        {inbox.filter(it => !it.done).length === 0 && (
          <div style={{ color: '#444', fontSize: 12 }}>Inbox clear.</div>
        )}
      </div>

      {/* Evening Check-In Prompt */}
      {isEvening && (
        <div className="card" style={{ borderColor: '#ffaa0033', background: '#0d0d00', marginBottom: 14 }}>
          <div className="section-label" style={{ color: '#ffaa00' }}>EVENING CHECK-IN</div>
          <div style={{ fontSize: 13, color: '#ccc', marginBottom: 12 }}>
            How did today go? Log your check-in to track discipline.
          </div>
          <button className="btn-outline" style={{ width: '100%' }}
            onClick={() => setAppData(p => ({ ...p, promptPage: 'checkin' }))}>
            GO TO CHECK-IN →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── BLOCK EDITOR SHEET ──────────────────────────────────────────────────────
const BlockEditor = ({ block, onSave, onClose, onDelete }) => {
  const [b, setB] = useState({ ...block });
  const TYPES = ['work','workout','habit','meal','commute','recovery','productive','sleep','wind_down'];
  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="h2">EDIT BLOCK</div>
          <button onClick={onClose} style={{ color: '#555', fontSize: 22 }}>×</button>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="field-label">Name</div>
          <input className="underline-input" value={b.name} onChange={e => setB(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="field-label">Type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {TYPES.map(t => (
              <button key={t} className={`chip chip-sm${b.type === t ? ' active' : ''}`}
                onClick={() => setB(p => ({ ...p, type: t, color: blockColor(t) }))}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label">Start (min from midnight)</div>
            <input type="number" className="underline-input" value={b.start}
              onChange={e => setB(p => ({ ...p, start: +e.target.value }))} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">End</div>
            <input type="number" className="underline-input" value={b.end}
              onChange={e => setB(p => ({ ...p, end: +e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div className="field-label">Energy</div>
            <select value={b.energy || 'medium'} onChange={e => setB(p => ({ ...p, energy: e.target.value }))}
              style={{ width: '100%', borderBottom: '1px solid #333', padding: '6px 0' }}>
              {['low','medium','high'].map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div className="field-label">Importance</div>
            <select value={b.importance || 5} onChange={e => setB(p => ({ ...p, importance: +e.target.value }))}
              style={{ width: '100%', borderBottom: '1px solid #333', padding: '6px 0' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setB(p => ({ ...p, locked: !p.locked }))}
            className={`chip chip-sm${b.locked ? ' active' : ''}`}>
            {b.locked ? '🔒 Locked' : '🔓 Flexible'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-white" style={{ flex: 2 }} onClick={() => onSave(b)}>SAVE</button>
          {!block.locked && (
            <button className="btn-outline" style={{ flex: 1, borderColor: '#440000', color: '#ff4444' }}
              onClick={() => onDelete(block.id)}>DELETE</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── SCHEDULE PAGE ───────────────────────────────────────────────────────────
const SchedulePage = ({ appData, setAppData }) => {
  const schedule = appData.todaySchedule || [];
  const completedIds = appData.completedIds || [];
  const onboard = appData.onboard || {};
  const now = nowMin();
  const [editBlock, setEditBlock] = useState(null);
  const [showAddInbox, setShowAddInbox] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [showTransitions, setShowTransitions] = useState(false);
  const [weekMode, setWeekMode] = useState(false);
  const scrollRef = useRef(null);

  const PX_PER_MIN = 1.2;
  const HOURS_START = 4;
  const HOURS_END = 26;
  const totalHeight = (HOURS_END - HOURS_START) * 60 * PX_PER_MIN;

  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = Math.max(0, (now - HOURS_START * 60 - 60) * PX_PER_MIN);
      scrollRef.current.scrollTop = scrollTo;
    }
  }, []);

  const saveBlock = updated => {
    const newSched = schedule.map(b => b.id === updated.id ? updated : b);
    setAppData(p => ({ ...p, todaySchedule: newSched }));
    DB.setDebounced('schedule_' + todayKey(), newSched.filter(b => !b.isAuto || b.locked));
    setEditBlock(null);
  };

  const deleteBlock = id => {
    const newSched = schedule.filter(b => b.id !== id);
    setAppData(p => ({ ...p, todaySchedule: newSched }));
    DB.setDebounced('schedule_' + todayKey(), newSched.filter(b => !b.isAuto || b.locked));
    setEditBlock(null);
  };

  const addInboxBlock = () => {
    if (!newBlockName.trim()) return;
    const newB = {
      id: 'inbox_' + Date.now(), name: newBlockName.trim(), type: 'productive',
      start: now, end: now + 30, locked: false, isAuto: false,
      color: blockColor('productive')
    };
    const newSched = [...schedule, newB].sort((a, b) => a.start - b.start);
    setAppData(p => ({ ...p, todaySchedule: newSched }));
    DB.setDebounced('schedule_' + todayKey(), newSched.filter(b => !b.isAuto || b.locked));
    setNewBlockName('');
    setShowAddInbox(false);
  };

  const rebuild = () => {
    const tmpl = DB.get('schedule_template', {});
    const newSched = rebuildSchedule({
      wakeTime: tmpl.wakeTime || onboard.wakeTime || { h: 5, m: 30 },
      sleepTime: tmpl.sleepTime || onboard.sleepTime || { h: 22, m: 30 },
      fixedBlocks: tmpl.fixedBlocks || onboard.fixedBlocks || [],
      flexBlocks: (tmpl.flexBlocks || onboard.activities || []).map(a => ({
        name: a.name, type: a.type, duration: a.duration,
        energy: a.energy, prefTime: a.prefTime, importance: 7
      })),
      energyPattern: tmpl.energyPattern || onboard.energyPattern || 'morning_peak',
      gapFillers: MICRO_TASKS.filter(m => (tmpl.gapFillers || []).includes(m.id)),
    });
    setAppData(p => ({ ...p, todaySchedule: newSched }));
    DB.set('schedule_' + todayKey(), newSched.filter(b => !b.isAuto || b.locked));
  };

  const microLib = MICRO_TASKS;

  return (
    <div className="page" style={{ padding: 0 }}>
      <div style={{ padding: '16px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="h2">SCHEDULE</div>
        <div style={{ fontSize: 11, color: '#555' }}>
          {new Date().toLocaleDateString('en-US',{ weekday:'long', month:'short', day:'numeric' }).toUpperCase()}
        </div>
      </div>

      {/* Timeline */}
      <div ref={scrollRef} className="timeline-wrap" style={{ height: 'calc(100vh - 220px)', overflow: 'auto', position: 'relative' }}>
        <div style={{ position: 'relative', height: totalHeight + 'px', marginLeft: 0 }}>
          {/* Hour lines */}
          {Array.from({ length: HOURS_END - HOURS_START + 1 }, (_, i) => {
            const hr = HOURS_START + i;
            const top = i * 60 * PX_PER_MIN;
            return (
              <React.Fragment key={hr}>
                <div className="hour-line" style={{ top }} />
                <div className="hour-label" style={{ top, fontSize: 10, color: '#333', position: 'absolute', left: 4, width: 40, textAlign: 'right' }}>
                  {fmt12(hr % 24, 0)}
                </div>
              </React.Fragment>
            );
          })}

          {/* Now line */}
          {now >= HOURS_START * 60 && now <= HOURS_END * 60 && (
            <div className="now-line" style={{ top: (now - HOURS_START * 60) * PX_PER_MIN, left: 48 }}>
              <div className="now-dot" />
            </div>
          )}

          {/* Blocks */}
          {schedule.filter(b => b.end > HOURS_START * 60 && b.start < HOURS_END * 60).map(b => {
            const top = (Math.max(b.start, HOURS_START * 60) - HOURS_START * 60) * PX_PER_MIN;
            const height = Math.max((b.end - b.start) * PX_PER_MIN, 22);
            const isCurrent = now >= b.start && now < b.end;
            const isPast = b.end <= now;
            const isDone = completedIds.includes(b.id);
            return (
              <div key={b.id} className={`tl-block${isPast || isDone ? ' past' : ''}${isCurrent ? ' current' : ''}`}
                style={{
                  top, height, background: isPast ? '#080808' : '#0d0d0d',
                  border: isCurrent ? '1px solid #ffffff44' : '1px solid #1a1a1a',
                  left: 56, right: 8, position: 'absolute',
                }}
                onClick={() => setEditBlock(b)}>
                <div className="accent-bar" style={{ background: b.color || '#555' }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isPast ? '#555' : '#fff',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                  {height > 30 && (
                    <div style={{ fontSize: 10, color: '#444' }}>
                      {fmt12(fromMin(b.start).h, fromMin(b.start).m)} – {fmt12(fromMin(b.end).h, fromMin(b.end).m)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '8px 14px' }}>
        {showAddInbox && (
          <div className="inline-add-panel">
            <input className="underline-input" placeholder="Block name..."
              value={newBlockName} onChange={e => setNewBlockName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addInboxBlock()}
              style={{ marginBottom: 8 }} autoFocus />
            <button className="btn-white" style={{ fontSize: 13 }} onClick={addInboxBlock}>ADD BLOCK</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button className="btn-outline" style={{ flex: 1, fontSize: 11 }} onClick={rebuild}>↺ REBUILD</button>
          <button className="btn-outline" style={{ flex: 1, fontSize: 11 }}
            onClick={() => alert('Running late mode: blocks shifted 15min')}>⏱ RUNNING LATE</button>
          <button className={`btn-outline${weekMode ? ' active' : ''}`} style={{ flex: 1, fontSize: 11 }}
            onClick={() => setWeekMode(p => !p)}>WEEK</button>
          <button className="btn-outline" style={{ flex: 1, fontSize: 11 }}
            onClick={() => setShowAddInbox(p => !p)}>+ BLOCK</button>
        </div>

        {/* Transitions */}
        <button onClick={() => setShowTransitions(p => !p)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 14px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10, color: '#fff' }}>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: 13, letterSpacing: '.08em' }}>
            TRANSITIONS
          </span>
          <span style={{ color: '#555' }}>{showTransitions ? '▲' : '▼'}</span>
        </button>
        {showTransitions && (
          <div className="card" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none', marginTop: 0 }}>
            {microLib.map(mt => (
              <div key={mt.id} className="transitions-row">
                <div className="trans-bar" style={{ background: mt.category === 'recovery' ? '#00cc66' : '#4a9eff', height: '100%' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{mt.name}</div>
                  <div style={{ fontSize: 11, color: '#555' }}>{mt.duration}min · {mt.energy} energy</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6,
                  background: mt.category === 'recovery' ? '#001a0a' : '#00101a',
                  color: mt.category === 'recovery' ? '#00cc66' : '#4a9eff' }}>
                  {mt.category === 'recovery' ? 'Reset' : 'Recharge'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editBlock && (
        <BlockEditor block={editBlock} onSave={saveBlock} onDelete={deleteBlock} onClose={() => setEditBlock(null)} />
      )}
    </div>
  );
};

// ─── CHECK-IN PAGE ───────────────────────────────────────────────────────────
const CheckInPage = ({ appData, setAppData }) => {
  const onboard = appData.onboard || {};
  const standards = onboard.standards || ['Sleep 7+ hours','Exercise or move','No social media before 9am','Log food/water','Read 20 min'];
  const [checked, setChecked] = useState(() => appData.todayStandards || standards.map(() => false));
  const [energy, setEnergy] = useState(() => DB.get('energy_today', 2));
  const [reflection, setReflection] = useState(() => DB.get('reflection_' + todayKey(), ''));
  const habitsGain = onboard.habitsGain || [];
  const habitsElim = onboard.habitsElim || [];
  const [gainDone, setGainDone] = useState(() => DB.get('habits_gain_' + todayKey(), habitsGain.map(() => false)));
  const [elimDone, setElimDone] = useState(() => DB.get('habits_elim_' + todayKey(), habitsElim.map(() => false)));

  // 28-day history dots for each habit
  const getHistory = (type, idx) => {
    const result = [];
    for (let d = 27; d >= 0; d--) {
      const date = new Date(); date.setDate(date.getDate() - d);
      const key = date.toISOString().slice(0, 10);
      const arr = DB.get(`habits_${type}_${key}`, []);
      result.push(arr[idx] === true);
    }
    return result;
  };

  const toggleStandard = i => {
    const updated = checked.map((v, j) => j === i ? !v : v);
    setChecked(updated);
    setAppData(p => ({ ...p, todayStandards: updated }));
    DB.set('standards_' + todayKey(), updated);
  };

  const score = Math.round((checked.filter(Boolean).length / Math.max(standards.length, 1)) * 100);

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div className="h2">CHECK-IN</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Ring score={score} size={44} />
          <div style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: 28,
            color: score >= 80 ? '#ff4444' : score >= 60 ? '#ffaa00' : '#fff' }}>{score}</div>
        </div>
      </div>

      {/* Daily Standards */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label">DAILY STANDARDS</div>
        {standards.map((s, i) => (
          <div key={i} className="std-row" onClick={() => toggleStandard(i)}>
            <div className={`std-check${checked[i] ? ' checked' : ''}`}
              style={{ animation: checked[i] ? 'checkFlash .3s ease' : undefined }}>
              {checked[i] && <span style={{ fontSize: 13, color: '#000', fontWeight: 800 }}>✓</span>}
            </div>
            <div style={{ fontSize: 14, color: checked[i] ? '#888' : '#fff',
              textDecoration: checked[i] ? 'line-through' : 'none' }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Energy */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>TODAY'S ENERGY</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {[['😴', 1, 'Low'], ['⚡', 2, 'Medium'], ['🔥', 3, 'High']].map(([em, val, lbl]) => (
            <button key={val} onClick={() => { setEnergy(val); DB.set('energy_today', val); }}
              style={{ flex: 1, padding: '14px 8px', borderRadius: 10,
                background: energy === val ? '#fff' : '#0a0a0a',
                border: `1px solid ${energy === val ? '#fff' : '#1a1a1a'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 22 }}>{em}</span>
              <span style={{ fontSize: 11, fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: '.06em',
                color: energy === val ? '#000' : '#555' }}>{lbl}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Habit Tracker */}
      {(habitsGain.length > 0 || habitsElim.length > 0) && (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>HABIT TRACKER</div>
          {habitsGain.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: '#00cc66', fontWeight: 700, marginBottom: 8, letterSpacing: '.06em' }}>BUILD</div>
              {habitsGain.map((h, i) => {
                const hist = getHistory('gain', i);
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 13 }}>{h}</div>
                      <button onClick={() => {
                        const u = gainDone.map((v, j) => j === i ? !v : v);
                        setGainDone(u); DB.set('habits_gain_' + todayKey(), u);
                      }} className={`chip chip-sm${gainDone[i] ? ' active' : ''}`}
                        style={gainDone[i] ? { background: '#001a0a', color: '#00cc66', borderColor: '#00441a' } : {}}>
                        {gainDone[i] ? '✓ Done' : 'Mark'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {hist.map((did, d) => (
                        <div key={d} className="habit-dot"
                          style={{ background: did ? '#00cc66' : '#1a1a1a', opacity: d === 27 ? 1 : 0.7 + d * 0.01 }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {habitsElim.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: '#ff4444', fontWeight: 700, marginBottom: 8, letterSpacing: '.06em', marginTop: 8 }}>ELIMINATE</div>
              {habitsElim.map((h, i) => {
                const hist = getHistory('elim', i);
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 13 }}>{h}</div>
                      <button onClick={() => {
                        const u = elimDone.map((v, j) => j === i ? !v : v);
                        setElimDone(u); DB.set('habits_elim_' + todayKey(), u);
                      }} className={`chip chip-sm${elimDone[i] ? ' active' : ''}`}
                        style={elimDone[i] ? { background: '#1a0000', color: '#ff4444', borderColor: '#440000' } : {}}>
                        {elimDone[i] ? '✓ Avoided' : 'Mark'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {hist.map((did, d) => (
                        <div key={d} className="habit-dot"
                          style={{ background: did ? '#ff444444' : '#1a1a1a' }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Reflection */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>REFLECTION</div>
        <textarea value={reflection}
          onChange={e => { setReflection(e.target.value); DB.setDebounced('reflection_' + todayKey(), e.target.value); }}
          placeholder="What went well? What would you change?"
          rows={5}
          style={{ width: '100%', fontSize: 13, color: '#ccc', lineHeight: 1.6,
            borderBottom: '1px solid #1a1a1a', paddingBottom: 8 }} />
      </div>
    </div>
  );
};

// ─── TRAINING PAGE ───────────────────────────────────────────────────────────
const TrainingPage = ({ appData, setAppData }) => {
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const today = new Date().getDay();
  const [activeDay, setActiveDay] = useState(today);
  const [prs, setPrs] = useState(() => DB.get('prs', [
    { id: 1, name: 'Squat', current: 225, goal: 315, unit: 'lbs' },
    { id: 2, name: 'Bench Press', current: 185, goal: 225, unit: 'lbs' },
    { id: 3, name: 'Deadlift', current: 275, goal: 405, unit: 'lbs' },
    { id: 4, name: '1 Mile Run', current: 8.5, goal: 7.0, unit: 'min' },
    { id: 5, name: 'BJJ Rolls', current: 3, goal: 6, unit: '/session' },
  ]));
  const [sessions, setSessions] = useState(() => DB.get('sessions', []));
  const [sessionType, setSessionType] = useState('lift');
  const [sessionNotes, setSessionNotes] = useState('');
  const [priorities, setPriorities] = useState(() => DB.get('train_priorities', [
    'Hit all programmed lifts', 'Active recovery on off days', 'Track every training session'
  ]));
  const [editingPR, setEditingPR] = useState(null);
  const weekPlan = DB.get('week_plan', {});

  const SESSION_TYPES = ['lift','cardio','bjj','yoga','recovery','other'];
  const TYPE_COLORS = { lift:'#4a9eff', cardio:'#ff6b35', bjj:'#7c5cbf', yoga:'#00ccaa', recovery:'#00cc66', other:'#888' };

  const logSession = () => {
    if (!sessionNotes.trim() && sessionType === 'other') return;
    const s = { id: Date.now(), type: sessionType, notes: sessionNotes, date: todayKey(), day: activeDay };
    const updated = [s, ...sessions].slice(0, 50);
    setSessions(updated);
    DB.set('sessions', updated);
    setSessionNotes('');
  };

  const movePriority = (i, dir) => {
    const arr = [...priorities];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setPriorities(arr);
    DB.set('train_priorities', arr);
  };

  return (
    <div className="page">
      <div className="h2" style={{ marginBottom: 20 }}>TRAINING</div>

      {/* Weekly Plan Grid */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>WEEKLY PLAN</div>
        <div className="wk-grid">
          {days.map((d, i) => {
            const plan = weekPlan[i] || '';
            return (
              <div key={i} className={`wk-cell${i === activeDay ? ' active' : ''}`}
                onClick={() => setActiveDay(i)}>
                <div className="wk-day">{d}</div>
                <div style={{ fontSize: 10, color: i === activeDay ? '#555' : '#444',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {plan || (i === 0 || i === 3 ? 'Rest' : i === 1 || i === 4 ? 'Lift' : 'Cardio')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PR Table */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>PERSONAL RECORDS</div>
        {prs.map(pr => (
          <div key={pr.id} className="pr-row" onClick={() => setEditingPR(pr)}>
            <div className="pr-label">{pr.name}</div>
            <div>
              <div className="pr-val">{pr.current}<span style={{ fontSize: 11, color: '#555', fontFamily: 'Inter' }}> {pr.unit}</span></div>
              <div className="pr-goal">Goal: {pr.goal} {pr.unit}</div>
            </div>
            <div style={{ width: 40, height: 40, position: 'relative', flexShrink: 0 }}>
              <Ring score={Math.min(100, Math.round((pr.current / pr.goal) * 100))} size={40} />
            </div>
          </div>
        ))}
        {editingPR && (
          <div className="inline-add-panel" style={{ marginTop: 12 }}>
            <div className="field-label" style={{ marginBottom: 6 }}>{editingPR.name} — Update Current</div>
            <input type="number" className="underline-input"
              defaultValue={editingPR.current}
              onBlur={e => {
                const updated = prs.map(p => p.id === editingPR.id ? { ...p, current: +e.target.value } : p);
                setPrs(updated); DB.set('prs', updated); setEditingPR(null);
              }} autoFocus />
          </div>
        )}
      </div>

      {/* Session Log */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>LOG SESSION</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {SESSION_TYPES.map(t => (
            <button key={t} className={`session-type-pill${sessionType === t ? '' : ''}`}
              onClick={() => setSessionType(t)}
              style={{ background: sessionType === t ? TYPE_COLORS[t] : '#1a1a1a',
                color: sessionType === t ? '#fff' : '#555', border: 'none', cursor: 'pointer' }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <textarea value={sessionNotes} onChange={e => setSessionNotes(e.target.value)}
          placeholder="Notes: sets, reps, how you felt..."
          rows={3} style={{ width: '100%', fontSize: 13, color: '#ccc', lineHeight: 1.5,
            borderBottom: '1px solid #1a1a1a', paddingBottom: 8, marginBottom: 10 }} />
        <button className="btn-white" style={{ fontSize: 13 }} onClick={logSession}>LOG SESSION</button>
        {sessions.slice(0, 5).map(s => (
          <div key={s.id} style={{ padding: '10px 0', borderTop: '1px solid #0f0f0f', marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span className="session-type-pill" style={{ background: TYPE_COLORS[s.type] || '#555', fontSize: 10 }}>
                {s.type.toUpperCase()}
              </span>
              <span style={{ fontSize: 11, color: '#444' }}>{s.date}</span>
            </div>
            {s.notes && <div style={{ fontSize: 12, color: '#888' }}>{s.notes}</div>}
          </div>
        ))}
      </div>

      {/* Priorities */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>PRIORITIES</div>
        {priorities.map((p, i) => (
          <div key={i} className="drag-row">
            <div className="drag-handle">⠿</div>
            <div style={{ flex: 1, fontSize: 13 }}>{p}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => movePriority(i, -1)} style={{ color: '#444', padding: '2px 6px' }}>▲</button>
              <button onClick={() => movePriority(i, 1)} style={{ color: '#444', padding: '2px 6px' }}>▼</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── CALENDAR PAGE ───────────────────────────────────────────────────────────
const CalendarPage = ({ appData, setAppData }) => {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAY_HEADS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = d => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const dayKey = d => `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
  const hasData = d => !!DB.get('schedule_' + dayKey(d), null);

  const selectedSched = selectedDay
    ? DB.get('schedule_' + dayKey(selectedDay), appData.todaySchedule || [])
    : [];

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }}
          style={{ color: '#fff', fontSize: 20, padding: '4px 8px' }}>‹</button>
        <div className="h2">{MONTHS[viewMonth].toUpperCase()} {viewYear}</div>
        <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }}
          style={{ color: '#fff', fontSize: 20, padding: '4px 8px' }}>›</button>
      </div>

      <div className="cal-grid" style={{ marginBottom: 16 }}>
        {DAY_HEADS.map(d => <div key={d} className="cal-day header">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className={`cal-day${d && isToday(d) ? ' today' : ''}${d && hasData(d) ? ' has-data' : ''}`}
            style={{ color: !d ? 'transparent' : d && isToday(d) ? '#fff' : '#666',
              background: d && selectedDay === d ? '#1a1a1a' : undefined }}
            onClick={() => d && setSelectedDay(d === selectedDay ? null : d)}>
            {d || '·'}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="card fade-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-label" style={{ margin: 0 }}>
              {MONTHS[viewMonth].toUpperCase()} {selectedDay}
            </div>
            <button onClick={() => setSelectedDay(null)} style={{ color: '#555', fontSize: 18 }}>×</button>
          </div>
          {selectedSched.length === 0 ? (
            <div style={{ color: '#444', fontSize: 13 }}>No schedule data for this day.</div>
          ) : (
            selectedSched.map(b => (
              <div key={b.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #0f0f0f', alignItems: 'center' }}>
                <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: b.color || '#555', flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: '#555', minWidth: 52 }}>
                  {fmt12(fromMin(b.start).h, fromMin(b.start).m)}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{b.end - b.start}m</div>
              </div>
            ))
          )}
          {isToday(selectedDay) && (
            <button className="btn-outline" style={{ width: '100%', marginTop: 12, fontSize: 12 }}
              onClick={() => { setSelectedDay(null); setAppData(p => ({ ...p, promptPage: 'schedule' })); }}>
              EDIT TODAY'S SCHEDULE →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', label: 'HOME', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )},
  { id: 'schedule', label: 'SCHEDULE', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 2v3M14 2v3M2 8h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'checkin', label: 'CHECK-IN', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 10l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'training', label: 'TRAINING', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h2m10 0h2M5 10V7a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-3zm8 0V7a1 1 0 011-1h1a1 1 0 011 1v6a1 1 0 01-1 1h-1a1 1 0 01-1-1v-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 10h6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )},
  { id: 'calendar', label: 'CALENDAR', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 2v3M14 2v3M2 9h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="13" r="1" fill="currentColor"/>
      <circle cx="10" cy="13" r="1" fill="currentColor"/>
      <circle cx="13" cy="13" r="1" fill="currentColor"/>
    </svg>
  )},
];

const BottomNav = ({ page, setPage }) => (
  <div className="bottom-nav">
    {NAV_ITEMS.map(item => {
      const active = page === item.id;
      return (
        <button key={item.id} className="nav-item" onClick={() => setPage(item.id)}
          style={{ color: active ? '#fff' : '#444' }}>
          {item.icon}
          <span style={{ fontSize: 9, fontFamily: "'Barlow Condensed'", fontWeight: 700, letterSpacing: '.08em' }}>
            {item.label}
          </span>
          {active && <div className="nav-dot" />}
        </button>
      );
    })}
  </div>
);

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
const AFFIRMATIONS = [
  '"Discipline is the bridge between goals and accomplishment."',
  '"You do not rise to the level of your goals, you fall to the level of your systems."',
  '"Every rep, every set, every day — this is who you are becoming."',
  '"The pain of discipline is far less than the pain of regret."',
  '"Hard choices, easy life. Easy choices, hard life."',
  '"You are what you repeatedly do. Excellence is not an act but a habit."',
  '"Show up when you don\'t feel like it. That\'s where character is built."',
];

export default function App() {
  // inject CSS once
  useEffect(() => {
    if (!document.getElementById('gd-style')) {
      const el = document.createElement('style');
      el.id = 'gd-style';
      el.textContent = GLOBAL_CSS;
      document.head.appendChild(el);
    }
    DB.pruneOld();
  }, []);

  const [screen, setScreen] = useState(() => {
    if (!DB.get('authed', false)) return 'auth';
    if (!DB.get('onboarded', false)) return 'onboarding';
    return 'main';
  });

  const [page, setPage] = useState('dashboard');

  const [appData, setAppData] = useState(() => {
    const onboard = DB.get('onboard', {});
    const key = todayKey();
    let sched = DB.get('schedule_' + key, null);
    if (!sched) {
      sched = rebuildSchedule({
        wakeTime: onboard.wakeTime || { h: 5, m: 30 },
        sleepTime: onboard.sleepTime || { h: 22, m: 30 },
        fixedBlocks: onboard.fixedBlocks || [],
        flexBlocks: (onboard.activities || []).map(a => ({
          name: a.name, type: a.type, duration: a.duration,
          energy: a.energy, prefTime: a.prefTime, importance: 7
        })),
        energyPattern: onboard.energyPattern || 'morning_peak',
        gapFillers: [],
      });
    }
    return {
      onboard,
      todaySchedule: sched,
      completedIds: DB.get('completed_' + key, []),
      todayStandards: DB.get('standards_' + key, (onboard.standards || []).map(() => false)),
      mcCompleted: DB.get('mc_' + key, []),
      mcDismissed: DB.get('mc_dismissed_' + key, false),
      prevScore: DB.get('score_prev', 50),
      affirmations: AFFIRMATIONS,
    };
  });

  // Sync promptPage → page navigation
  useEffect(() => {
    if (appData.promptPage) {
      setPage(appData.promptPage);
      setAppData(p => ({ ...p, promptPage: null }));
    }
  }, [appData.promptPage]);

  const handleAuth = isNew => {
    if (isNew) { setScreen('onboarding'); }
    else { setScreen('main'); }
  };

  const handleOnboardComplete = onboardData => {
    const key = todayKey();
    const sched = rebuildSchedule({
      wakeTime: onboardData.wakeTime,
      sleepTime: onboardData.sleepTime,
      fixedBlocks: onboardData.fixedBlocks || [],
      flexBlocks: (onboardData.activities || []).map(a => ({
        name: a.name, type: a.type, duration: a.duration,
        energy: a.energy, prefTime: a.prefTime, importance: 7
      })),
      energyPattern: onboardData.energyPattern || 'morning_peak',
      gapFillers: [],
    });
    setAppData(p => ({
      ...p, onboard: onboardData, todaySchedule: sched,
      completedIds: [], todayStandards: onboardData.standards.map(() => false)
    }));
    DB.set('schedule_' + key, sched.filter(b => !b.isAuto || b.locked));
    setScreen('main');
    setPage('dashboard');
  };

  const handleSignOut = () => {
    DB.del('authed');
    DB.del('onboarded');
    setScreen('auth');
    setPage('dashboard');
  };

  // Export
  const exportData = () => {
    const all = DB.exportAll();
    const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), data: all }, null, 2)],
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grind-designed-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import
  const importData = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target.result);
        const raw = json.data || json;
        DB.importAll(raw);
        const onboard = DB.get('onboard', {});
        const key = todayKey();
        const sched = DB.get('schedule_' + key, []);
        setAppData(p => ({
          ...p, onboard,
          todaySchedule: sched,
          completedIds: DB.get('completed_' + key, []),
          todayStandards: DB.get('standards_' + key, []),
        }));
        alert('Import successful!');
      } catch { alert('Import failed — invalid file.'); }
    };
    reader.readAsText(file);
  };

  if (screen === 'auth') return <AuthScreen onAuth={handleAuth} />;
  if (screen === 'onboarding') return <Onboarding onComplete={handleOnboardComplete} />;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
      {page === 'dashboard' && (
        <Dashboard appData={appData} setAppData={setAppData} />
      )}
      {page === 'schedule' && (
        <SchedulePage appData={appData} setAppData={setAppData} />
      )}
      {page === 'checkin' && (
        <CheckInPage appData={appData} setAppData={setAppData} />
      )}
      {page === 'training' && (
        <TrainingPage appData={appData} setAppData={setAppData} />
      )}
      {page === 'calendar' && (
        <CalendarPage appData={appData} setAppData={setAppData} />
      )}

      <BottomNav page={page} setPage={setPage} />

      {/* Settings sheet */}
      <div style={{ position: 'fixed', bottom: 60, right: 0, zIndex: 80 }}>
        <details style={{ position: 'relative' }}>
          <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '8px 14px',
            fontSize: 10, color: '#333', letterSpacing: '.06em',
            fontFamily: "'Barlow Condensed'", fontWeight: 700 }}>
            ···
          </summary>
          <div style={{ position: 'absolute', bottom: '100%', right: 0,
            background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 10,
            padding: 12, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={exportData} style={{ fontSize: 12, color: '#ccc', textAlign: 'left', padding: '6px 0' }}>
              ↓ Export Data
            </button>
            <label style={{ fontSize: 12, color: '#ccc', cursor: 'pointer', padding: '6px 0' }}>
              ↑ Import Data
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
            <button onClick={handleSignOut} style={{ fontSize: 12, color: '#ff4444', textAlign: 'left', padding: '6px 0' }}>
              Sign Out
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
