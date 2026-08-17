 function doPost(e) {
    try {
      var data = JSON.parse(e.postData.contents);

      // Log to sheet
  var sheet = SpreadsheetApp.openById("1B9-yB-kUS4qDrUFlyP_JrTvRxhFFDCVVx01RsV5GRyo").getActiveSheet();
      sheet.appendRow([
        data.name || "",
        data.email || "",
        data.phone || "",
        data.dateSigned || "",
        data.emergencyContact || "",
        data.medicalFlags || ""
      ]);

      // Save PDF to Drive if included
      if (data.pdfBase64) {
        var folder = getOrCreateFolder("LJFC Waivers");
        var fileName = (data.name || "Unknown").replace(/[^a-zA-Z0-9 ]/g, "") + " — " + (data.dateSigned ||
  "undated").split(",")[0] + ".pdf";
        var decoded = Utilities.base64Decode(data.pdfBase64);
        var blob = Utilities.newBlob(decoded, "application/pdf", fileName);
        var file = folder.createFile(blob);

        var lastRow = sheet.getLastRow();
        sheet.getRange(lastRow, 7).setValue(file.getUrl());
      }

      return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      // Log error to sheet so we can see it
  var sheet = SpreadsheetApp.openById("1B9-yB-kUS4qDrUFlyP_JrTvRxhFFDCVVx01RsV5GRyo").getActiveSheet();
      sheet.appendRow(["ERROR", err.message, err.stack, new Date().toString(), "", "", ""]);
      return ContentService.createTextOutput(JSON.stringify({error:
  err.message})).setMimeType(ContentService.MimeType.JSON);
    }
  }

  function getOrCreateFolder(name) {
    var folders = DriveApp.getFoldersByName(name);
    if (folders.hasNext()) {
      return folders.next();
    }
    return DriveApp.createFolder(name);
  }