function doPost(e) {
    try {
      var data = JSON.parse(e.postData.contents);
      var sheet = SpreadsheetApp.openById("17-XZMotYOiVIcJde2_Ppgxan7TFGBU6df-DI43Ygf8E").getActiveSheet();

      sheet.appendRow([
        data.student || "",
        data.date || "",
        data.author || "",
        data.type || "",
        data.note || "",
        data.depth || "",
        data.time || "",
        data.bolt || ""
      ]);

      return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({error:
  err.message})).setMimeType(ContentService.MimeType.JSON);
    }
  }

  function doGet(e) {
    try {
      var sheet = SpreadsheetApp.openById("17-XZMotYOiVIcJde2_Ppgxan7TFGBU6df-DI43Ygf8E").getActiveSheet();
      var data = sheet.getDataRange().getValues();
      var headers = data[0];
      var rows = [];

      var studentFilter = e.parameter.student || "";

      for (var i = 1; i < data.length; i++) {
        var row = {};
        for (var j = 0; j < headers.length; j++) {
          row[headers[j].toLowerCase()] = data[i][j];
        }
        if (!studentFilter || row.student.toLowerCase() === studentFilter.toLowerCase()) {
          rows.push(row);
        }
      }

      return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({error:
  err.message})).setMimeType(ContentService.MimeType.JSON);
    }
  }
