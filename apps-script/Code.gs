/**
 * Wedding invitation backend — Google Apps Script bound to a Google Sheet.
 *
 * Stores guest blessings + visit/interaction events in the sheet, and returns
 * them to admin.html only when the correct password is supplied.
 *
 * Setup (see README "Private dashboard"):
 *   1. Create a Google Sheet → Extensions → Apps Script → paste this file.
 *   2. Project Settings → Script properties → add ADMIN_PASSWORD = <your password>.
 *   3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *   4. Copy the Web app URL into `backendUrl` in index.html and admin.html.
 */

const SHEET_BLESSINGS = 'Blessings';
const SHEET_EVENTS = 'Events';
const ALLOWED_EVENTS = [
  'visit', 'invite-opened', 'date-scratched', 'maps-opened', 'calendar-added',
  'shared', 'akshata', 'couple-tapped', 'bell-rung', 'photo-opened'
];

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: 'bad-json' }); }

  if (body.action === 'admin') return admin(body);
  if (body.action === 'blessing') return saveBlessing(body);
  if (body.action === 'event') return saveEvent(body);
  return json({ ok: false, error: 'unknown-action' });
}

function doGet() {
  return json({ ok: true, service: 'wedding-invitation' });
}

/* ---------------- writes (public) ---------------- */

function saveBlessing(b) {
  const name = clean(b.name, 60);
  const message = clean(b.message, 500);
  if (!name || !message) return json({ ok: false, error: 'missing' });
  if (rateLimited('b:' + clean(b.visitor, 40), 5)) return json({ ok: false, error: 'slow-down' });
  append(SHEET_BLESSINGS, ['Time', 'Name', 'Message', 'Visitor', 'Device'],
    [new Date(), name, message, clean(b.visitor, 40), clean(b.device, 20)]);
  return json({ ok: true });
}

function saveEvent(b) {
  const event = clean(b.event, 40);
  if (ALLOWED_EVENTS.indexOf(event) === -1) return json({ ok: false, error: 'bad-event' });
  if (rateLimited('e:' + clean(b.visitor, 40), 60)) return json({ ok: false, error: 'slow-down' });
  append(SHEET_EVENTS, ['Time', 'Event', 'Visitor', 'Device', 'Referrer', 'Language'],
    [new Date(), event, clean(b.visitor, 40), clean(b.device, 20), clean(b.referrer, 200), clean(b.lang, 20)]);
  return json({ ok: true });
}

/* ---------------- admin (password protected) ---------------- */

function admin(b) {
  const expected = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!expected) return json({ ok: false, error: 'password-not-set' });
  if (String(b.password || '') !== expected) {
    Utilities.sleep(800); // slow down guessing
    return json({ ok: false, error: 'wrong-password' });
  }

  const blessings = rows(SHEET_BLESSINGS).map(r => ({
    time: iso(r[0]), name: r[1], message: r[2], visitor: r[3], device: r[4]
  })).reverse();

  const events = rows(SHEET_EVENTS);
  const counts = {}, visitors = {}, perDay = {}, referrers = {}, devices = {};
  events.forEach(r => {
    const ev = r[1], vis = r[2], dev = r[3] || 'unknown';
    counts[ev] = (counts[ev] || 0) + 1;
    if (vis) visitors[vis] = true;
    if (ev === 'visit') {
      const day = Utilities.formatDate(new Date(r[0]), 'Asia/Kolkata', 'yyyy-MM-dd');
      perDay[day] = perDay[day] || {};
      perDay[day][vis || Math.random()] = true;
      devices[dev] = (devices[dev] || 0) + 1;
      const ref = refName(r[4]);
      referrers[ref] = (referrers[ref] || 0) + 1;
    }
  });
  const daily = Object.keys(perDay).sort().map(d => ({ day: d, visitors: Object.keys(perDay[d]).length }));

  return json({
    ok: true,
    generated: iso(new Date()),
    uniqueVisitors: Object.keys(visitors).length,
    counts: counts,
    daily: daily,
    referrers: referrers,
    devices: devices,
    blessings: blessings
  });
}

/* ---------------- helpers ---------------- */

function append(name, header, row) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(name);
    if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
    sh.appendRow(row);
  } finally { lock.releaseLock(); }
}

function rows(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}

function rateLimited(key, maxPerMinute) {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get(key) || 0);
  if (n >= maxPerMinute) return true;
  cache.put(key, String(n + 1), 60);
  return false;
}

function clean(v, max) {
  // strip control chars; prefix formula-looking text so the sheet never evaluates it
  let s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function refName(r) {
  if (!r) return 'Direct / WhatsApp app';
  try {
    const host = String(r).replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
    if (/whatsapp/.test(host)) return 'WhatsApp';
    if (/instagram/.test(host)) return 'Instagram';
    if (/facebook|fb\./.test(host)) return 'Facebook';
    if (/google/.test(host)) return 'Google';
    if (/github\.io$/.test(host)) return 'Direct / WhatsApp app';
    return host;
  } catch (e) { return 'Other'; }
}

function iso(d) { return new Date(d).toISOString(); }

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
