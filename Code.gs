// ============================================================
// Kantong Yen — database bersama (Google Apps Script)
// Terikat ke Sheet "Kantong Yen - Data Keuangan", tab Transaksi.
// Kolom: A Tanggal (nilai tanggal asli), B Jenis (Pemasukan/Pengeluaran),
//        C Kategori, D Catatan, E Jumlah (¥), F ID, G Diubah
//
// PENYIAPAN (sekali saja):
// 1. Tempel kode ini di Extensions > Apps Script pada Sheet tersebut.
// 2. Project Settings (ikon gerigi) > Script Properties > Add property:
//    Name: SYNC_KEY   Value: (kode sinkron keluarga)
// 3. Deploy > New deployment > type: Web app
//    Execute as: Me — Who has access: Anyone
// 4. Salin URL Web app (berakhiran /exec) ke SYNC_URL di index.html.
// ============================================================

var SHEET_NAME = 'Transaksi';

function keyOk_(k) {
  var want = PropertiesService.getScriptProperties().getProperty('SYNC_KEY');
  return !!want && !!k && String(k) === String(want);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (String(sh.getRange(1, 6).getValue()) !== 'ID') {
    sh.getRange(1, 6, 1, 2).setValues([['ID', 'Diubah']]);
  }
  return sh;
}

var MON_ = {jan:1, feb:2, mar:3, apr:4, mei:5, may:5, jun:6, jul:7, agu:8, aug:8, agt:8, sep:9, okt:10, oct:10, nov:11, des:12, dec:12};

function normDate_(v, tz) {
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  }
  var s = String(v || '').trim(), m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  if ((m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})/))) { var mo = MON_[m[2].slice(0, 3).toLowerCase()]; if (mo) return m[3] + '-' + ('0' + mo).slice(-2) + '-' + ('0' + m[1]).slice(-2); }
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return m[3] + '-' + ('0' + m[1]).slice(-2) + '-' + ('0' + m[2]).slice(-2);
  return '';
}

function readAll_() {
  var sh = sheet_();
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  var last = sh.getLastRow();
  var out = [];
  if (last < 2) return out;
  var vals = sh.getRange(2, 1, last - 1, 7).getValues();
  for (var i = 0; i < vals.length; i++) {
    var r = vals[i];
    var date = normDate_(r[0], tz);
    var jenis = String(r[1] || '').trim().toLowerCase();
    var type = jenis === 'pemasukan' ? 'in' : (jenis === 'pengeluaran' ? 'out' : '');
    var amt = Math.round(Math.abs(Number(r[4]) || 0));
    if (!date || !type || !amt) continue;
    var id = String(r[5] || '').trim();
    if (!id) {
      id = 's' + (i + 2) + '-' + new Date().getTime().toString(36);
      sh.getRange(i + 2, 6).setValue(id);
      sh.getRange(i + 2, 7).setValue(new Date());
    }
    out.push({ id: id, date: date, type: type, cat: String(r[2] || '').trim() || 'Lainnya', note: String(r[3] || '').trim(), amt: amt });
  }
  return out;
}

function findRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, 6, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

function doGet(e) {
  if (!keyOk_(e.parameter.key)) return json_({ ok: false, error: 'unauthorized' });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return json_({ ok: true, tx: readAll_() }); }
  finally { lock.releaseLock(); }
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad json' }); }
  if (!keyOk_(body.key)) return json_({ ok: false, error: 'unauthorized' });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet_();
    if (body.action === 'upsert' && body.tx) {
      var t = body.tx;
      // Parse tanggal di zona waktu spreadsheet agar tanggalnya persis
      // (menghindari geser satu hari bila zona waktu script berbeda).
      var d = Utilities.parseDate(String(t.date), SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'yyyy-MM-dd');
      var row = [d, t.type === 'in' ? 'Pemasukan' : 'Pengeluaran', t.cat || 'Lainnya', t.note || '', Math.round(Math.abs(Number(t.amt) || 0)), String(t.id), new Date()];
      var r = findRow_(sh, t.id);
      if (r > 0) sh.getRange(r, 1, 1, 7).setValues([row]);
      else sh.appendRow(row);
      return json_({ ok: true });
    }
    if (body.action === 'delete') {
      var r2 = findRow_(sh, body.id);
      if (r2 > 0) sh.deleteRow(r2);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: 'unknown action' });
  } finally { lock.releaseLock(); }
}
