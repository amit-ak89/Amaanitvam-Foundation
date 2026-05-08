const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const { formatDate } = require('./certUtils');

/**
 * Generate QR code as base64 data URL
 */
const generateQRCode = async (certificateId) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
  return await QRCode.toDataURL(verifyUrl, {
    width: 120,
    margin: 1,
    color: { dark: '#1a472a', light: '#ffffff' },
  });
};

/**
 * Build the HTML template for the certificate
 */
const buildCertificateHTML = ({ internName, role, startDate, endDate, issueDate, certificateId, qrCodeDataUrl }) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 1122px; height: 794px; background: #fff; font-family: 'EB Garamond', serif; }
    .page {
      width: 1122px; height: 794px; position: relative;
      background: linear-gradient(145deg, #fefefe 0%, #f8f5ee 100%);
      overflow: hidden;
    }
    /* Watermark */
    .watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 62px; font-family: 'Cinzel', serif;
      color: rgba(26, 71, 42, 0.055); white-space: nowrap;
      pointer-events: none; z-index: 0; font-weight: 700;
      letter-spacing: 4px;
    }
    /* Outer gold border */
    .border-outer {
      position: absolute; top: 14px; left: 14px;
      right: 14px; bottom: 14px;
      border: 4px solid #c9a84c; border-radius: 4px;
    }
    .border-inner {
      position: absolute; top: 22px; left: 22px;
      right: 22px; bottom: 22px;
      border: 1.5px solid #e8c96a; border-radius: 2px;
    }
    /* Corner ornaments */
    .corner { position: absolute; width: 48px; height: 48px; }
    .corner svg { width: 100%; height: 100%; }
    .tl { top: 10px; left: 10px; }
    .tr { top: 10px; right: 10px; transform: scaleX(-1); }
    .bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
    .br { bottom: 10px; right: 10px; transform: scale(-1); }

    .content { position: relative; z-index: 1; padding: 38px 70px 28px; text-align: center; }

    /* Header */
    .org-name {
      font-family: 'Cinzel', serif; font-size: 28px;
      color: #1a472a; letter-spacing: 3px; font-weight: 700;
      text-transform: uppercase;
    }
    .org-tagline { font-size: 13px; color: #7a6a3a; letter-spacing: 2px; margin-top: 3px; }
    .divider {
      width: 420px; height: 2px; margin: 12px auto;
      background: linear-gradient(to right, transparent, #c9a84c, transparent);
    }
    .cert-title {
      font-family: 'Cinzel', serif; font-size: 38px;
      color: #1a472a; letter-spacing: 5px; margin: 6px 0 4px;
      font-weight: 700;
    }
    .cert-subtitle { font-size: 14px; color: #7a6a3a; letter-spacing: 3px; text-transform: uppercase; }

    /* Body */
    .body-text { font-size: 17px; color: #3a3a3a; margin: 18px 0 6px; line-height: 1.7; }
    .intern-name {
      font-family: 'Cinzel', serif; font-size: 42px;
      color: #1a472a; margin: 4px 0; font-weight: 700;
      border-bottom: 2px solid #c9a84c; display: inline-block;
      padding-bottom: 4px; min-width: 300px;
    }
    .role-text { font-size: 18px; color: #2d6a4f; font-style: italic; margin: 6px 0; font-weight: 600; }
    .duration-text { font-size: 15px; color: #555; margin: 4px 0; }

    /* Footer row */
    .footer-row {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-top: 22px; padding: 0 20px;
    }
    .sig-block { text-align: center; }
    .sig-line { width: 160px; border-top: 1.5px solid #1a472a; margin: 0 auto 4px; }
    .sig-label { font-size: 12px; color: #555; letter-spacing: 1px; }
    .sig-name { font-size: 13px; color: #1a472a; font-weight: 600; }

    .cert-id-block { text-align: center; }
    .cert-id-label { font-size: 10px; color: #888; letter-spacing: 1px; text-transform: uppercase; }
    .cert-id-value { font-size: 13px; color: #1a472a; font-weight: 600; font-family: 'Montserrat', sans-serif; }
    .issue-date { font-size: 11px; color: #888; margin-top: 2px; }

    .qr-block { text-align: center; }
    .qr-block img { width: 90px; height: 90px; border: 2px solid #c9a84c; padding: 3px; border-radius: 4px; }
    .qr-label { font-size: 9px; color: #888; margin-top: 3px; letter-spacing: 1px; }

    /* Top logo area */
    .logo-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 4px; }
    .logo-circle {
      width: 58px; height: 58px; border-radius: 50%;
      background: linear-gradient(135deg, #1a472a, #2d6a4f);
      display: flex; align-items: center; justify-content: center;
      border: 3px solid #c9a84c;
    }
    .logo-circle span { color: #f0c040; font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; }
  </style>
</head>
<body>
<div class="page">
  <div class="watermark">Official Internship Certificate</div>
  <div class="border-outer"></div>
  <div class="border-inner"></div>

  <!-- Corner ornaments -->
  <div class="corner tl"><svg viewBox="0 0 48 48"><path d="M4 4 L44 4 L44 10 L10 10 L10 44 L4 44 Z" fill="#c9a84c"/><circle cx="8" cy="8" r="4" fill="#c9a84c"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 48 48"><path d="M4 4 L44 4 L44 10 L10 10 L10 44 L4 44 Z" fill="#c9a84c"/><circle cx="8" cy="8" r="4" fill="#c9a84c"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 48 48"><path d="M4 4 L44 4 L44 10 L10 10 L10 44 L4 44 Z" fill="#c9a84c"/><circle cx="8" cy="8" r="4" fill="#c9a84c"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 48 48"><path d="M4 4 L44 4 L44 10 L10 10 L10 44 L4 44 Z" fill="#c9a84c"/><circle cx="8" cy="8" r="4" fill="#c9a84c"/></svg></div>

  <div class="content">
    <div class="logo-row">
      <div class="logo-circle"><span>A</span></div>
      <div>
        <div class="org-name">Amaanitvam Foundation</div>
        <div class="org-tagline">Empowering Youth · Building Futures · Serving Society</div>
      </div>
    </div>

    <div class="divider"></div>
    <div class="cert-title">Certificate</div>
    <div class="cert-subtitle">of Internship Completion</div>
    <div class="divider"></div>

    <p class="body-text">This is to certify that</p>
    <div class="intern-name">${internName}</div>
    <p class="role-text">has successfully completed the internship as</p>
    <p class="role-text"><strong>${role}</strong></p>
    <p class="duration-text">
      from <strong>${formatDate(startDate)}</strong> to <strong>${formatDate(endDate)}</strong>
      &nbsp;|&nbsp; Issued on: <strong>${formatDate(issueDate)}</strong>
    </p>
    <p class="body-text" style="font-size:14px; color:#666; margin-top:6px;">
      during which they demonstrated exceptional dedication, professionalism, and commitment to the mission of Amaanitvam Foundation.
    </p>

    <div class="footer-row">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-name">Dr. Amaani Sharma</div>
        <div class="sig-label">Founder & Director</div>
        <div class="sig-label">Amaanitvam Foundation</div>
      </div>

      <div class="cert-id-block">
        <div class="cert-id-label">Certificate ID</div>
        <div class="cert-id-value">${certificateId}</div>
        <div class="issue-date">Verify at: amaanitvam.org/verify</div>
      </div>

      <div class="qr-block">
        <img src="${qrCodeDataUrl}" alt="QR Code"/>
        <div class="qr-label">Scan to Verify</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
};

/**
 * Generate PDF buffer from certificate data using Puppeteer
 */
const generateCertificatePDF = async (certData) => {
  const qrCodeDataUrl = await generateQRCode(certData.certificateId);
  const html = buildCertificateHTML({ ...certData, qrCodeDataUrl });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1122, height: 794 });

    const pdfBuffer = await page.pdf({
      width: '1122px',
      height: '794px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

module.exports = { generateCertificatePDF, generateQRCode };
