// ============================================================
// HELPERS
// ============================================================

function generateUniqueCode(existingCodes) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // ambiguous chars removed: 0,O,1,I
  let code, attempts = 0;
  do {
    code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    attempts++;
  } while (existingCodes.has(code) && attempts < 1000);
  return code;
}

function getTicketImageBlob(tier) {
  const urls = {
    'GOLD':   'https://drive.google.com/uc?export=view&id=1fMIsw6tT6oPX9946AcN7OWz3tJbsz-7w',
    'SILVER': 'https://drive.google.com/uc?export=view&id=10MLsrAeCnAhFWfmNJ514GiwS7lnytk5q',
    'BRONZE': 'https://drive.google.com/uc?export=view&id=1wGA35mtbN-W2DmbVXQumJtSBLFPqomIL'
  };
  const url = urls[tier.toUpperCase()];
  if (!url) return null;
  try {
    return UrlFetchApp.fetch(url).getBlob().setName('ticket-banner.jpg');
  } catch(e) {
    Logger.log('Failed to fetch image for tier ' + tier + ': ' + e);
    return null;
  }
}

function buildEmailHtml(nama, show, jumlah, total, tier, kode, hasImage) {
  const cfg = {
    GOLD:   { bg: '#070605', accent: '#ECC976', label: 'Exclusive Gold Access' },
    SILVER: { bg: '#2E3137', accent: '#72B0B6', label: 'Standard Silver Access' },
    BRONZE: { bg: '#413539', accent: '#D66E40', label: 'Bronze Access' }
  }[tier.toUpperCase()] || { bg: '#413539', accent: '#D66E40', label: 'Access' };

  const imgHtml = hasImage
    ? `<img src="cid:ticketBanner" width="400" style="display:block;width:100%;height:180px;object-fit:cover;" alt="${tier} Ticket">`
    : '';

  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;background:#f0f0f0;padding:30px;">

  <div style="max-width:400px;margin:0 auto;background:${cfg.bg};border-radius:15px;overflow:hidden;border-left:8px solid ${cfg.accent};box-shadow:0 10px 30px rgba(0,0,0,0.3);">
    ${imgHtml}
    <div style="padding:20px;color:white;">
      <span style="color:${cfg.accent};text-transform:uppercase;font-size:11px;letter-spacing:3px;display:block;margin-bottom:5px;">${cfg.label}</span>
      <h2 style="margin:0 0 4px;font-size:28px;font-weight:300;color:white;">NUEVALA</h2>
      <p style="font-size:13px;opacity:0.7;margin:0 0 16px;">Voices Beyond The Walls</p>
      <p style="font-size:13px;opacity:0.9;margin:0 0 14px;">Dear <strong>${nama}</strong>, pembayaran Anda telah dikonfirmasi.</p>
      <table style="width:100%;font-size:13px;color:white;border-collapse:collapse;">
        <tr><td style="opacity:0.6;padding:3px 12px 3px 0;white-space:nowrap;">Tanggal</td><td>Sabtu, 16 Mei 2026</td></tr>
        <tr><td style="opacity:0.6;padding:3px 12px 3px 0;white-space:nowrap;">Tempat</td><td>Aula Barat ITB, Jl. Ganesha No. 10</td></tr>
        <tr><td style="opacity:0.6;padding:3px 12px 3px 0;white-space:nowrap;">Show</td><td><strong>${show}</strong></td></tr>
        <tr><td style="opacity:0.6;padding:3px 12px 3px 0;white-space:nowrap;">Jumlah</td><td><strong>${jumlah} tiket</strong></td></tr>
        <tr><td style="opacity:0.6;padding:3px 12px 3px 0;white-space:nowrap;">Total</td><td><strong>${formatRupiah(total)}</strong></td></tr>
      </table>
    </div>
    <div style="border-top:1px dashed rgba(255,255,255,0.2);padding:12px 20px;">
      <table style="width:100%;"><tr>
      <td style="color:white;font-size:11px;">Pertanyaan? WhatsApp <strong>081263153382</strong> (Indah)</td>
      </tr></table>
    </div>
  </div>

  <div style="max-width:400px;margin:20px auto;background:white;border-radius:10px;padding:20px;text-align:center;">
    <p style="color:#555;font-size:13px;margin:0 0 12px;">Tunjukkan QR Code ini saat penukaran tiket:</p>
    <img src="cid:qrcode" alt="QR Code" width="180" height="180" style="display:block;margin:0 auto;">
    <p style="color:#555;font-size:13px;margin:18px 0 8px;">Jika QR Code tidak terbaca, gunakan <strong>kode verifikasi</strong> ini:</p>
    <div style="font-size:34px;font-weight:bold;letter-spacing:10px;color:#111;margin:8px 0;font-family:monospace;">${kode}</div>
    <p style="color:#bbb;font-size:11px;margin:6px 0 0;">Simpan kode ini sebagai cadangan.</p>
  </div>

  <div style="max-width:400px;margin:0 auto;text-align:center;color:#888;font-size:12px;line-height:2;">
    <p>Info lebih lanjut: <strong>@psmitbconcert</strong></p>
    <p style="margin-top:6px;">Sampai jumpa di Nuevala! ^^</p>
  </div>

</div>

</div>`;
}

function formatRupiah(value) {
  const num = parseFloat(String(value).replace(/[^0-9]/g, ''));
  if (isNaN(num)) return value;
  return 'Rp' + num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ============================================================
// SEND EMAILS
// ============================================================

function sendEmailsFromSheet() {
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const header = values[0];

  const col = {
    email:       header.indexOf('Email untuk pengiriman tiket'),
    nama:        header.indexOf('Nama Lengkap'),
    show:        header.indexOf('Pilih Show'),
    jenis:       header.indexOf('Jenis Tiket'),
    jumlah:      header.indexOf('Jumlah Tiket yang Dipesan'),
    total:       header.indexOf('Total Pembayaran'),
    bukti:       header.indexOf('Validasi Bukti Pembayaran'),
    statusKirim: header.indexOf('Status Pengiriman'),
    kodeAlfa:    header.indexOf('Kode Alfanumerik')
  };

  const missing = Object.entries(col).filter(([_, v]) => v === -1).map(([k]) => k);
  if (missing.length) {
    SpreadsheetApp.getUi().alert('Kolom tidak ditemukan:\n' + missing.join('\n'));
    return;
  }

  // Collect existing codes to avoid collisions
  const existingCodes = new Set(
    values.slice(1)
      .map(r => String(r[col.kodeAlfa]).trim().toUpperCase())
      .filter(c => c.length === 4)
  );

  let sentCount = 0, failCount = 0;

  for (let i = 1; i < values.length; i++) {
    const row         = values[i];
    const email       = String(row[col.email]).trim();
    const nama        = String(row[col.nama]).trim();
    const show        = String(row[col.show]).trim();
    const jenis       = String(row[col.jenis]).trim().toUpperCase();
    const jumlah      = String(row[col.jumlah]).trim();
    const total       = String(row[col.total]).trim();
    const bukti       = row[col.bukti];
    const statusKirim = String(row[col.statusKirim]).trim();

    if (!email || bukti !== true || statusKirim === 'Terkirim') continue;

    try {
      // Retrieve existing code or generate a new one
      let kode = String(row[col.kodeAlfa]).trim().toUpperCase();
      if (kode.length !== 4) {
        kode = generateUniqueCode(existingCodes);
        existingCodes.add(kode);
        sheet.getRange(i + 1, col.kodeAlfa + 1).setValue(kode);
        SpreadsheetApp.flush();
      }

      // Fetch tier banner image
      const tierBlob = getTicketImageBlob(jenis);

      // Generate QR code blob
      const qrData = `NAMA=${nama}|EMAIL=${email}|SHOW=${show}|TIKET=${jumlah}|TOTAL=${total}|KODE=${kode}`;
      const qrBlob = UrlFetchApp.fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
      ).getBlob().setName('qrcode.png');

      const inlineImages = { qrcode: qrBlob };
      if (tierBlob) inlineImages.ticketBanner = tierBlob;

      MailApp.sendEmail({
        to: email,
        subject: 'Konfirmasi Pembelian Tiket NUEVALA 2026',
        htmlBody: buildEmailHtml(nama, show, jumlah, total, jenis, kode, !!tierBlob),
        inlineImages
      });

      sheet.getRange(i + 1, col.statusKirim + 1).setValue('Terkirim');
      SpreadsheetApp.flush();
      sentCount++;
      Logger.log(`Sent to ${email} | tier: ${jenis} | kode: ${kode}`);

    } catch(e) {
      sheet.getRange(i + 1, col.statusKirim + 1).setValue('Gagal');
      SpreadsheetApp.flush();
      failCount++;
      Logger.log(`Failed for ${email}: ${e}`);
    }
  }

  SpreadsheetApp.getUi().alert(`Selesai.\nTerkirim: ${sentCount}\nGagal: ${failCount}`);
}

// ============================================================
// SHARED VALIDATION LOGIC
// ============================================================

function getSheetData() {
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const header = values[0];
  const col = {
    email:       header.indexOf('Email untuk pengiriman tiket'),
    nama:        header.indexOf('Nama Lengkap'),
    show:        header.indexOf('Pilih Show'),
    jumlah:      header.indexOf('Jumlah Tiket yang Dipesan'),
    total:       header.indexOf('Total Pembayaran'),
    statusValid: header.indexOf('Status Validasi'),
    waktuValid:  header.indexOf('Waktu Validasi'),
    kodeAlfa:    header.indexOf('Kode Alfanumerik')
  };
  return { sheet, values, col };
}

function validateRow(sheet, values, col, i, namaPenukar) {
  const row    = values[i];
  const nama   = String(row[col.nama]).trim();
  const show   = String(row[col.show]).trim();
  const jumlah = String(row[col.jumlah]).trim();
  const currentStatus = sheet.getRange(i + 1, col.statusValid + 1).getValue();

  if (currentStatus === 'Valid') {
    const existingTime = sheet.getRange(i + 1, col.waktuValid + 1).getValue();
    const formatted = existingTime instanceof Date
      ? Utilities.formatDate(existingTime, Session.getScriptTimeZone(), 'dd-MM-yyyy HH:mm:ss')
      : String(existingTime);
    return {
      status: 'already_valid',
      message: `Tiket ${nama} (${show}, ${jumlah} tiket) sudah divalidasi pada ${formatted}.`
    };
  }

  const now = new Date();
  const keteranganCol = sheet.getLastRow() > 0
    ? values[0].indexOf('Keterangan')
    : -1;

  sheet.getRange(i + 1, col.statusValid + 1).setValue('Valid');
  sheet.getRange(i + 1, col.waktuValid + 1).setValue(now);
  if (keteranganCol !== -1) {
    sheet.getRange(i + 1, keteranganCol + 1).setValue('Ditukar oleh: ' + namaPenukar);
  }
  sheet.getRange(i + 1, 1, 1, sheet.getLastColumn()).setBackground('#d4edda');
  SpreadsheetApp.flush();

  return {
    status: 'success',
    message: `✓ ${jumlah} tiket ${show} untuk ${nama} berhasil divalidasi.\nDitukar oleh: ${namaPenukar}`
  };
}

// ============================================================
// QR CODE VALIDATION
// ============================================================

function processQrCodeData(qrData, namaPenukar) {
  if (!qrData || typeof qrData !== 'string' || !qrData.trim()) {
    return { status: 'error', message: 'Data QR kosong atau tidak valid.' };
  }
  if (!namaPenukar || !namaPenukar.trim()) {
    return { status: 'error', message: 'Nama penukar harus diisi.' };
  }

  const { sheet, values, col } = getSheetData();
  const missing = Object.entries(col).filter(([_, v]) => v === -1).map(([k]) => k);
  if (missing.length) return { status: 'error', message: 'Kolom tidak ditemukan: ' + missing.join(', ') };

  const parsed = {};
  qrData.split('|').forEach(item => {
    const eq = item.indexOf('=');
    if (eq !== -1) parsed[item.substring(0, eq).trim()] = item.substring(eq + 1).trim();
  });

  const { NAMA, EMAIL, SHOW, TIKET, TOTAL } = parsed;
  if (!NAMA || !EMAIL || !SHOW || !TIKET || !TOTAL) {
    return { status: 'error', message: 'Format QR tidak sesuai atau data tidak lengkap.' };
  }

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (
      String(row[col.email]).trim()  === EMAIL &&
      String(row[col.nama]).trim()   === NAMA  &&
      String(row[col.show]).trim()   === SHOW  &&
      String(row[col.jumlah]).trim() === TIKET &&
      String(row[col.total]).trim()  === TOTAL
    ) {
      return validateRow(sheet, values, col, i, namaPenukar.trim());
    }
  }

  return { status: 'not_found', message: `Data tidak ditemukan: ${NAMA} | ${EMAIL} | ${SHOW}` };
}

function processAlphanumericCode(code, namaPenukar) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return { status: 'error', message: 'Kode kosong atau tidak valid.' };
  }
  if (!namaPenukar || !namaPenukar.trim()) {
    return { status: 'error', message: 'Nama penukar harus diisi.' };
  }

  const upperCode = code.trim().toUpperCase();
  if (upperCode.length !== 4) {
    return { status: 'error', message: 'Kode harus tepat 4 karakter.' };
  }

  const { sheet, values, col } = getSheetData();
  const missing = Object.entries(col).filter(([_, v]) => v === -1).map(([k]) => k);
  if (missing.length) return { status: 'error', message: 'Kolom tidak ditemukan: ' + missing.join(', ') };

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][col.kodeAlfa]).trim().toUpperCase() === upperCode) {
      return validateRow(sheet, values, col, i, namaPenukar.trim());
    }
  }

  return { status: 'not_found', message: `Kode "${upperCode}" tidak ditemukan.` };
}

// ============================================================
// BOILERPLATE
// ============================================================

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('NUEVALA – Ticket Scanner')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Pengiriman Email')
    .addItem('Kirim Email Tiket', 'sendEmailsFromSheet')
    .addToUi();
}
