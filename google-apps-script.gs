/**
 * Google Apps Script for Coach Smith Bucket Hat Invitational.
 *
 * Handles both Team Registration and Sponsorship submissions,
 * writing to separate tabs in a single Google Sheet.
 *
 * Setup:
 * 1. Create a new Google Sheet
 * 2. Rename the first tab to "Registrations" and add these column headers to Row 1:
 *    Timestamp | Captain Name | Captain Phone | Captain Email | Player 2 | Player 3 | Player 4
 * 3. Create a second tab named "Sponsorships" and add these column headers to Row 1:
 *    Timestamp | Business Name | Contact Person | Email | Phone | Sponsorship Level | Amount
 * 4. Click Extensions > Apps Script
 * 5. Delete any code in the editor and paste this entire file
 * 6. Click Deploy > New deployment
 * 7. Set "Execute as" to your account
 * 8. Set "Who has access" to "Anyone"
 * 9. Click Deploy and authorize when prompted
 * 10. Copy the Web App URL — paste it into index.html replacing REPLACE_WITH_YOUR_SCRIPT_URL
 */

function doPost(request) {
  var data = JSON.parse(request.parameter.formData);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (data.type === "registration") {
    var sheet = spreadsheet.getSheetByName("Registrations");
    sheet.appendRow([
      new Date(),
      data.captainName,
      data.captainPhone,
      data.captainEmail,
      data.player2,
      data.player3,
      data.player4
    ]);
    sendRegistrationEmail(data);
  } else if (data.type === "sponsorship") {
    var sheet = spreadsheet.getSheetByName("Sponsorships");
    sheet.appendRow([
      new Date(),
      data.businessName,
      data.contactPerson,
      data.sponsorEmail,
      data.sponsorPhone,
      data.sponsorLevelName,
      "$" + Number(data.sponsorLevel).toLocaleString()
    ]);
    sendSponsorshipEmail(data);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendRegistrationEmail(registration) {
  var html =
    '<div style="background-color:#f8f6f1;padding:32px 16px;font-family:Arial,sans-serif;">' +
      '<div style="max-width:520px;margin:0 auto;">' +

        '<div style="background:linear-gradient(180deg,#151f2b 0%,#1e2a3a 100%);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;">' +
          '<p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">Greer Middle College Athletics</p>' +
          '<h1 style="color:#78b0e0;font-size:24px;font-weight:900;margin:0 0 8px;">The Coach Smith Bucket Hat Invitational</h1>' +
          '<p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Team Registration Confirmation</p>' +
        '</div>' +

        '<div style="background:#ffffff;padding:28px 24px;border:1px solid #e5e7eb;border-top:none;">' +
          '<p style="color:#1f2937;font-size:16px;margin:0 0 20px;">Hi ' + registration.captainName + ',</p>' +
          '<p style="color:#4b5563;font-size:14px;margin:0 0 24px;">Your team has been registered for the Coach Smith Bucket Hat Invitational!</p>' +

          '<div style="background:#f8f6f1;border-radius:12px;padding:4px 0;margin-bottom:24px;">' +
            '<table style="width:100%;border-collapse:collapse;">' +
              '<tr>' +
                '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Captain</td>' +
                '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + registration.captainName + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Player 2</td>' +
                '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + registration.player2 + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Player 3</td>' +
                '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + registration.player3 + '</td>' +
              '</tr>' +
              '<tr>' +
                '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Player 4</td>' +
                '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + registration.player4 + '</td>' +
              '</tr>' +
            '</table>' +
          '</div>' +

          '<div style="text-align:center;margin-bottom:24px;">' +
            '<p style="color:#4b5563;font-size:13px;margin:0 0 4px;">Entry Fee</p>' +
            '<p style="color:#1e2a3a;font-size:32px;font-weight:900;margin:0;">$1,000</p>' +
          '</div>' +

          '<div style="background:#f8f6f1;border-radius:12px;padding:16px 20px;text-align:left;">' +
            '<p style="color:#1e2a3a;font-weight:700;font-size:14px;margin:0 0 8px;text-align:center;">Event Details</p>' +
            '<ul style="color:#4b5563;font-size:13px;margin:0;padding-left:20px;list-style:disc;">' +
              '<li style="margin-bottom:6px;">Friday, May 8th — 9:00 AM Shotgun Start</li>' +
              '<li style="margin-bottom:6px;">Cherokee Valley Course and Club, 450 Cherokee Way, Travelers Rest, SC 29690</li>' +
              '<li>Make checks payable to Greer Middle College Charter High, Attn: Bill Owens, 138 W. McElhaney Rd, Taylors, SC 29687</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div style="background:#151f2b;border-radius:0 0 16px 16px;padding:20px 24px;text-align:center;">' +
          '<p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;">' +
            '<span style="color:#78b0e0;font-weight:700;">GMC Athletics</span> · Greer Middle College Charter High School · 864-237-0860' +
          '</p>' +
        '</div>' +

      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: registration.captainEmail,
    subject: "Coach Smith Bucket Hat Invitational — Team Registration Confirmation",
    body: "Your team has been registered for the Coach Smith Bucket Hat Invitational on May 8th. Captain: " + registration.captainName + ". Entry fee: $1,000.",
    htmlBody: html,
    name: "GMC Athletics",
    replyTo: "wowens@greermiddlecollege.org"
  });
}

function sendSponsorshipEmail(sponsor) {
  var amount = "$" + Number(sponsor.sponsorLevel).toLocaleString();
  var contactRow = "";
  if (sponsor.contactPerson) {
    contactRow =
      '<tr>' +
        '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Contact</td>' +
        '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + sponsor.contactPerson + '</td>' +
      '</tr>';
  }

  var html =
    '<div style="background-color:#f8f6f1;padding:32px 16px;font-family:Arial,sans-serif;">' +
      '<div style="max-width:520px;margin:0 auto;">' +

        '<div style="background:linear-gradient(180deg,#151f2b 0%,#1e2a3a 100%);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;">' +
          '<p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">Greer Middle College Athletics</p>' +
          '<h1 style="color:#78b0e0;font-size:24px;font-weight:900;margin:0 0 8px;">The Coach Smith Bucket Hat Invitational</h1>' +
          '<p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Sponsorship Confirmation</p>' +
        '</div>' +

        '<div style="background:#ffffff;padding:28px 24px;border:1px solid #e5e7eb;border-top:none;">' +
          '<p style="color:#1f2937;font-size:16px;margin:0 0 20px;">Thank you for sponsoring the tournament!</p>' +
          '<p style="color:#4b5563;font-size:14px;margin:0 0 24px;">Here are your sponsorship details:</p>' +

          '<div style="background:#f8f6f1;border-radius:12px;padding:4px 0;margin-bottom:24px;">' +
            '<table style="width:100%;border-collapse:collapse;">' +
              '<tr>' +
                '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Business</td>' +
                '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + sponsor.businessName + '</td>' +
              '</tr>' +
              contactRow +
              '<tr>' +
                '<td style="padding:8px 12px;color:#4b5563;font-weight:600;font-size:14px;">Level</td>' +
                '<td style="padding:8px 12px;color:#1f2937;font-weight:600;font-size:14px;">' + sponsor.sponsorLevelName + '</td>' +
              '</tr>' +
            '</table>' +
          '</div>' +

          '<div style="text-align:center;margin-bottom:24px;">' +
            '<p style="color:#4b5563;font-size:13px;margin:0 0 4px;">Sponsorship Amount</p>' +
            '<p style="color:#1e2a3a;font-size:32px;font-weight:900;margin:0;">' + amount + '</p>' +
          '</div>' +

          '<div style="background:#f8f6f1;border-radius:12px;padding:16px 20px;text-align:left;">' +
            '<p style="color:#1e2a3a;font-weight:700;font-size:14px;margin:0 0 8px;text-align:center;">Payment</p>' +
            '<ul style="color:#4b5563;font-size:13px;margin:0;padding-left:20px;list-style:disc;">' +
              '<li style="margin-bottom:6px;">Make checks payable to Greer Middle College Charter High, Attn: Bill Owens, 138 W. McElhaney Rd, Taylors, SC 29687</li>' +
              '<li>Greer Middle College Charter High School is a 501(c)(3). Your contribution may be tax-deductible.</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +

        '<div style="background:#151f2b;border-radius:0 0 16px 16px;padding:20px 24px;text-align:center;">' +
          '<p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;">' +
            '<span style="color:#78b0e0;font-weight:700;">GMC Athletics</span> · Greer Middle College Charter High School · 864-237-0860' +
          '</p>' +
        '</div>' +

      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to: sponsor.sponsorEmail,
    subject: "Coach Smith Bucket Hat Invitational — Sponsorship Confirmation",
    body: "Thank you for your " + sponsor.sponsorLevelName + " sponsorship (" + amount + ") for the Coach Smith Bucket Hat Invitational.",
    htmlBody: html,
    name: "GMC Athletics",
    replyTo: "wowens@greermiddlecollege.org"
  });
}
