function doGet() {
  return HtmlService.createHtmlOutputFromFile('scanner.html');
}

function runShow() {
  processTicketOrders("Regular Sales");
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Ngapain?')
    .addItem('Send e-ticket', 'runShow')
    .addItem('Tukar e-ticket', 'openScanner') 
    .addToUi();
}

function openScanner() {
  const html = HtmlService.createHtmlOutputFromFile('scanner.html')
    .setWidth(400)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Scan and Exchange Tickets');
}

function onScanSuccess(decodedText) {
    const exchangerName = document.getElementById('exchanger-name').value;
    
    if (!exchangerName) {
        document.getElementById('scan-result').innerHTML = "Mohon isi identitas penukar tiket terlebih dahulu.";
        return;
    }

    google.script.run
        .withSuccessHandler(function(response) {
            document.getElementById('scan-result').innerHTML = response;
            if (response.includes("Tiket sudah ditukarkan")) {
                document.getElementById('exchanger-name').value = '';  // Clear the textbox if ticket is already exchanged
            } else {
                document.getElementById('exchanger-name').value = '';  // Clear the textbox after a successful scan
            }
        })
        .withFailureHandler(function(error) {
            document.getElementById('scan-result').innerHTML = "Error: " + error.message;
        })
        .validateAndProcessTicket(decodedText, exchangerName);
}

function processTicketOrders(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const dataRange = sheet.getDataRange();
  const orderData = dataRange.getValues();

  for (let i = 1; i < orderData.length; i++) {
    const row = orderData[i];
    const paymentValidated = row[12];
    const emailSentStatus = row[9];

    if (paymentValidated && !emailSentStatus) {
      const name = row[1];
      const email = row[2];
      const ticketTypeString = row[5];
      const ticketCount = parseInt(row[6]);
      const { showTime, seatType } = parseTicketType(ticketTypeString);
      const ticketPrice = getTicketPrice(seatType);
      const subtotal = ticketPrice * ticketCount;
      const qrCodeText = `${sheetName}-${i}-${name}-${seatType}-${ticketCount}`;
      const qrCodeUrl = generateQRCode(qrCodeText);
      sheet.getRange(i + 1, 11).setValue(qrCodeText);

      const emailDetails = {
        name: name,
        showTime: showTime,
        seatType: seatType,
        ticketPrice: (ticketPrice / 1000) + "K",
        ticketCount: ticketCount,
        subtotal: formatCurrency(subtotal),
        qrCodeUrl: qrCodeUrl
      };
      sendConfirmationEmail(email, emailDetails, sheet, i + 1);
    }
  }
}

function parseTicketType(ticketTypeString) {
  const timeMatch = ticketTypeString.match(/(\d{2}:\d{2} WIB)/);
  const seatMatch = ticketTypeString.match(/(Bronze|Silver|Gold)$/);

  return {
    showTime: timeMatch ? timeMatch[1] : '',
    seatType: seatMatch ? seatMatch[1] : ''
  };
}

function generateQRCode(data) {
  return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + encodeURIComponent(data);
}

function getTicketPrice(seatType) {
  seatType = seatType.toLowerCase();
  if (seatType === "bronze") {
    return 77000;
  } else if (seatType === "silver") {
    return 122000;
  } else if (seatType === "gold") {
    return 135000;
  }

  return 0;
}

function formatCurrency(number) {
  const numStr = number.toString();
  let result = '';
  let count = 0;

  for (let i = numStr.length - 1; i >= 0; i--) {
    count++;
    result = numStr.charAt(i) + result;
    if (count % 3 === 0 && i !== 0) {
      result = '.' + result;
    }
  }

  return result + ',00';
}

function sendConfirmationEmail(email, details, sheet, rowIndex) {
  const emailSubject = `Ticket Order Confirmation for ${details.name}`;
  const emailBody = getConfirmationEmailBody(details);

  try {
    MailApp.sendEmail({
      to: email,
      subject: emailSubject,
      htmlBody: emailBody,
    });
    sheet.getRange(rowIndex, 10).setValue(true);
  } catch (e) {
    sheet.getRange(rowIndex, 10).setValue("Email failed to send: " + e.message);
  }
}

function getConfirmationEmailBody(details) {
  var seatTypeLower = details.seatType.toLowerCase();
  var ticketHtml = "";

  if (seatTypeLower === "bronze") {
    ticketHtml = `
      <div class="ticket light">
        <div class="ticket-head" style="background-image: url('https://i.imgur.com/slo0dEI.jpeg')">
        </div>
        <div class="ticket-body">
          <div class="ticket-buyer">
            <p>seat</p>
            <h4>bronze</h4>
          </div>
          <div class="ticket-buyer">
            <p>recipient</p>
            <h4>${details.name}</h4>
          </div>
          <div class="ticket-buyer">
            <p>show</p>
            <h4>${details.showTime}</h4>
          </div>
          <div class="ticket-buyer">
            <p>quantity</p>
            <h4>${details.ticketCount}</h4>
          </div>
          <div class="qr-code" style="background-image: url('${details.qrCodeUrl}');"></div>
          <div class="event-date">12 MEI 2025 @ WEST HALL ITB</div>
        </div>
        <div class="footer">
          <div class="disclaimer">Stay tuned for ticket exchanges, promos, merchandise, and more details about Nuevala at <a href="https://instagram.com/psmitbconcert" target="_blank" class="instagram-link">@psmitbconcert</a>!</div>
        </div>
      </div>
    `;
  } else if (seatTypeLower === "silver") {
    ticketHtml = `
      <div class="ticket dark">
        <div class="ticket-head" style="background-image: url('https://i.imgur.com/82Gb3jA.jpeg')">
        </div>
        <div class="ticket-body">
          <div class="ticket-buyer">
            <p>seat</p>
            <h4>silver</h4>
          </div>
          <div class="ticket-buyer">
            <p>recipient</p>
            <h4>${details.name}</h4>
          </div>
          <div class="ticket-buyer">
            <p>show</p>
            <h4>${details.showTime}</h4>
          </div>
          <div class="ticket-buyer">
            <p>quantity</p>
            <h4>${details.ticketCount}</h4>
          </div>
          <div class="qr-code" style="background-image: url('${details.qrCodeUrl}');"></div>
          <div class="event-date">12 MEI 2025 @ WEST HALL ITB</div>
        </div>
        <div class="footer">
          <div class="disclaimer">Stay tuned for ticket exchanges, promos, merchandise, and more details about Nuevala at <a href="https://instagram.com/psmitbconcert" target="_blank" class="instagram-link">@psmitbconcert</a>!</div>
        </div>
      </div>
    `;
  } else if (seatTypeLower === "gold") {
    ticketHtml = `
      <div class="ticket premium">
        <div class="ticket-head" style="background-image: url('https://i.imgur.com/bCHIORt.jpeg')">
        </div>
        <div class="ticket-body">
          <div class="ticket-buyer">
            <p>seat</p>
            <h4>gold</h4>
          </div>
          <div class="ticket-buyer">
            <p>recipient</p>
            <h4>${details.name}</h4>
          </div>
          <div class="ticket-buyer">
            <p>show</p>
            <h4>${details.showTime}</h4>
          </div>
          <div class="ticket-buyer">
            <p>quantity</p>
            <h4>${details.ticketCount}</h4>
          </div>
          <div class="qr-code" style="background-image: url('${details.qrCodeUrl}');"></div>
          <div class="event-date">12 MEI 2025 @ WEST HALL ITB</div>
        </div>
        <div class="footer">
          <div class="disclaimer">Stay tuned for ticket exchanges, promos, merchandise, and more details about Nuevala at <a href="https://instagram.com/psmitbconcert" target="_blank" class="instagram-link">@psmitbconcert</a>!</div>
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Concert Ticket - ${details.seatType.toUpperCase()}</title>
      <style>
        body {
          background-color: #FFB563;
          font-family: Arial, sans-serif;
          font-weight: 300;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container-fluid {
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ticket {
          border-radius: 4px;
          max-width: 320px;
          text-align: left;
          text-transform: uppercase;
          width: 100%;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
        }

        .ticket.light {
          background-color: #FFF5E9;
          color: #8B4513;
        }

        .ticket.dark {
          background-color: #161616;
          color: white;
        }

        .ticket.premium {
          background-color: #552583;
          color: #FDB927;
        }

        .ticket-head {
          background-position: center;
          background-size: cover;
          border-radius: 4px 4px 0 0;
          height: 140px;
          position: relative;
        }

        .ticket-body {
          border-bottom: 1px dashed currentColor;
          padding: 25px 45px;
          position: relative;
        }

        .ticket-body p {
          margin: 0;
          font-size: 12px;
        }

        .light .ticket-body p {
          color: #A67B5B;
        }

        .dark .ticket-body p {
          color: #A2A2A2;
        }

        .premium .ticket-body p {
          color: rgba(253, 185, 39, 0.6);
        }

        .ticket-body h4 {
          margin: 0;
          padding: 0;
        }

        .light .ticket-body h4 {
          color: #8B4513;
        }

        .premium .ticket-body h4 {
          color: #FDB927;
        }

        .ticket-buyer {
          margin-bottom: 15px;
        }

        .event-date {
          font-size: 12px;
          text-align: center;
          margin-top: 15px;
        }

        .light .event-date {
          color: #8B4513;
        }

        .premium .event-date {
          color: rgba(253, 185, 39, 0.8);
        }

        .qr-code {
          width: 150px;
          height: 150px;
          margin: 20px auto;
          background-color: white;
          padding: 10px;
          border-radius: 4px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .footer {
          padding: 15px 25px;
        }

        .disclaimer {
          font-family: Times New Roman, serif;
          font-size: 14px;
          font-style: italic;
          line-height: 1.25;
          text-transform: none;
        }

        .light .disclaimer {
          color: #A67B5B;
        }

        .dark .disclaimer {
          color: #A2A2A2;
        }

        .premium .disclaimer {
          color: rgba(253, 185, 39, 0.5);
        }

        .instagram-link {
          color: inherit;
          text-decoration: none;
          border-bottom: 1px solid currentColor;
          transition: opacity 0.3s ease;
        }

        .instagram-link:hover {
          opacity: 0.8;
        }

        .ticket-body:before,
        .ticket-body:after {
          background-color: #FFB563;
          border-radius: 100%;
          content: "";
          height: 15px;
          position: absolute;
          top: 100%;
          width: 20px;
        }

        .ticket-body:before {
          left: 0;
          transform: translate(-70%, -45%);
        }

        .ticket-body:after {
          right: 0;
          transform: translate(70%, -45%);
        }

        @media (max-width: 768px) {
          .container-fluid {
            position: relative;
            transform: none;
            top: 0;
            left: 0;
            padding: 20px;
          }
          
          .ticket {
            margin-bottom: 30px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container-fluid">
        ${ticketHtml}
      </div>
    </body>
    </html>
  `;
}

function validateAndProcessTicket(qrCode, exchangerName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Regular Sales');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][10] === qrCode) { // Column K contains QR code
      const rowIndex = i + 1;
      const currentExchanger = data[i][13]; // Column N for exchanger name
      
      if (currentExchanger) {
        return "Tiket sudah ditukarkan oleh " + currentExchanger;
      }
      
      // Update exchanger name, mark as exchanged, and color the row
      const row = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
      row.setFontColor('#00FF00');
      row.setBackground('#00FF00');
      
      sheet.getRange(rowIndex, 14).setValue(exchangerName); // Column N
      sheet.getRange(rowIndex, 12).setValue(true); // Column L
      
      return "Tiket berhasil ditukarkan oleh " + exchangerName;
    }
  }
  
  return "QR Code tidak valid atau tidak ditemukan.";
}
