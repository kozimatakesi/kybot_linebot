function doPost(e) {
  var replyToken= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    return;
  }

  var url = 'https://api.line.me/v2/bot/message/reply';
  var channelToken = 'aDvtjMNpbPj1iEUmv2lpLCBAZp1KeZ36s71fg4zGAxPIVYdOK1XSjMWWtmeRI/zZ91jEALqdyC0Jtf7TVK2eNuVgnD60YVaVurHvUgLMVmcYRlhzmNKzk+1DsFEiKhe703F+1D1cGBKAn1NeQzcAaQdB04t89/1O/w1cDnyilFU=';
  var input = JSON.parse(e.postData.contents).events[0].message;
  var message = '「機器」「データ」「安全」のいずれかを入力するとデータベースからランダムで一例を持ってきます';
  var message1 = `一行目「!項目」、二行目「どんな危険が潜んでいるか」三行目「私ならこうする」と入力すると投稿ができます\n\n例\n\n!機器\nGPSが取得できていないまま〜〜\n測定開始前に、GPSが〜〜`;
  const spreadsheet = SpreadsheetApp.openById('1L7OGY_H9wBNogR5XVie39e0Y-KVSoMXAqtILzqrJP2E');

  if(input.type == 'text') {
    //検索機能
    if(input.text.match('#')){
      var searchWord = input.text.slice(1);
      var searchCellsA = [];
      var searchCellsB = [];
      for(var j = 0; j < 3; j++){
        var sheet = spreadsheet.getSheets()[j];
        var lastRow = sheet.getLastRow();
        for(var i = 1; i < lastRow; i++){
          var searchCell = sheet.getRange(`A${i}`).getValue();
          if(searchCell.match(searchWord)){
            searchCellsA.push(searchCell);
            searchCellsB.push(sheet.getRange(`B${i}`).getValue());
          }
        }
      }
      var random = Math.floor( Math.random() * searchCellsA.length );
      const cellNumber = random;
      if(searchCellsA.length === 0){
        message = `「${searchWord}」を検索した結果`;
        message1 = 'データベースに見当たりませんでした'
      } else {
        message = `【どんな危険が潜んでいるか】\n${searchCellsA[cellNumber]}`;
        message1 = `【私ならこうする】\n${searchCellsB[cellNumber]}`;
      }
    }
    //投稿機能
    if(input.text.match('!')) {
      const firstNewLine = input.text.indexOf('\n');
      const selectSheet = input.text.slice(1, firstNewLine);
      const sheet = spreadsheet.getSheetByName(selectSheet);
      const mainSentenc = input.text.slice(firstNewLine + 1);
      var lastRow = sheet.getLastRow();
      const newLine = mainSentenc.indexOf('\n');
      sheet.getRange(`A${lastRow + 1}`).setValue(mainSentenc.slice(0, newLine));
      const subSentenc = mainSentenc.slice(newLine + 1);
      sheet.getRange(`B${lastRow + 1}`).setValue(subSentenc);
      const kyFactor = mainSentenc.slice(0, newLine);
      const kyCounter = subSentenc;
      message = `【どんな危険が潜んでいるか】\n${kyFactor}\n【私ならこうする】\n${kyCounter}`;
      message1 = "投稿完了しました";
    }

    if(input.text.slice(0,2).match('機器')) {
      const sheet = spreadsheet.getSheetByName('機器');
      var lastRow = sheet.getLastRow();
      var random = Math.floor( Math.random() * lastRow ) + 1;
      const kyFactor = sheet.getRange(`A${random}`).getValue();
      const kyCounter = sheet.getRange(`B${random}`).getValue();
      message = `【どんな危険が潜んでいるか】\n${kyFactor}`;
      message1 =`【私ならこうする】\n${kyCounter}`;
    }

    if(input.text.slice(0,3).match('データ')) {
      const sheet = spreadsheet.getSheetByName('データ');
      var lastRow = sheet.getLastRow();
      var random = Math.floor( Math.random() * lastRow ) + 1;
      const kyFactor = sheet.getRange(`A${random}`).getValue();
      const kyCounter = sheet.getRange(`B${random}`).getValue();
      message = `【どんな危険が潜んでいるか】\n${kyFactor}`;
      message1 =`【私ならこうする】\n${kyCounter}`;
    }

    if(input.text.slice(0,2).match('安全')) {
      const sheet = spreadsheet.getSheetByName('安全');
      var lastRow = sheet.getLastRow();
      var random = Math.floor( Math.random() * lastRow ) + 1;
      const kyFactor = sheet.getRange(`A${random}`).getValue();
      const kyCounter = sheet.getRange(`B${random}`).getValue();
      message = `【どんな危険が潜んでいるか】\n${kyFactor}`;
      message1 =`【私ならこうする】\n${kyCounter}`;
    }
  }

  var messages = [{
    'type': 'text',
    'text': message,
  },{
    'type': 'text',
    'text': message1,
  }];

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}