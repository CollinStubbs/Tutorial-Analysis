function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tutorial Analysis')
  .addItem('Analyze Tutorials', 'start')
  .addToUi();
}

function start(){
  var url = "https://docs.google.com/spreadsheets/d/18LfUbCKU0HTdzJ4i4iv5r8hnNy-wvg0jMKLsabzWrbo/edit#gid=1612432561";
  var ss = SpreadsheetApp.openByUrl(url); 
  var data = SpreadsheetApp.getActive().getSheetByName('data');
  var sheetName = data.getRange(2,1).getValue();
  var studentName = data.getRange(5, 1).getValue();
  var subject = data.getRange(8,1).getValue();//ACCEPT MULTIPLE INPUTS AND PLAN FOR LOOPING OUTPUT
  
  
  var responses = ss.getSheetByName(sheetName).getDataRange().getValues();
  
  
}

function standardName(name){
  name = name.toLowerCase();
  name = name.split(' ').join('');
  return name;
}