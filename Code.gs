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
  var studentName = standardName(data.getRange(5, 1).getValue());
  var subject = data.getRange(8,1).getValue();//ACCEPT MULTIPLE INPUTS AND PLAN FOR LOOPING OUTPUT
  var responses = ss.getSheetByName(sheetName).getDataRange().getValues();
  
  findData(studentName, subject, responses);
  
  
}

function standardName(name){
  name = name.toLowerCase();
  name = name.split(' ').join('');
  return name;
}

function findData(name, subject, responses){
  var nameData = findNameData(name, responses); 
  var subjectData = findSubjectData(subject, nameData);
}

function findNameData(name, responses){
  var nameData = [];
  for(var i = 0; i< responses.length; i++){
    var holderName = standardName(responses[i][1]);
    if(name == holderName){
      nameData.push(responses[i]);
    }
  }
  return nameData;
}

function findSubjectData(subject, data){
  var subjectData = [];
  for(var i = 0; i<data.length; i++){
    // if(data[i][
  }
}

function seperateSubjects(data){
  for(var i = 0; i<data.length; i++){
    if(data[i][3].indexOf(',') > -1){
      var holder = data[i][3].split(',');
      data[i][3] = holder[0];
      var row = data[i];
      row[3] = holder;
      data.push(row);
    }
  }
  return data;
}