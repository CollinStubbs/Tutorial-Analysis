function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tutorial Analysis')
  .addItem('Analyze Tutorials', 'start')
  .addToUi();
}
var sDate = 0;// do if these are blank
var eDate = 0;
function start(){
  var url = "https://docs.google.com/spreadsheets/d/18LfUbCKU0HTdzJ4i4iv5r8hnNy-wvg0jMKLsabzWrbo/edit#gid=1612432561"; //change this to be read by sheet
  var ss = SpreadsheetApp.openByUrl(url); 
  var data = SpreadsheetApp.getActive().getSheetByName('data');
  data.getRange(1, 4, 1128, 13).clearContent();
  var sheetName = data.getRange(2,1).getDisplayValue();
  var studentName = standardName(data.getRange(5, 1).getDisplayValue());
  var subject = data.getRange(8,1).getDisplayValue();//ACCEPT MULTIPLE INPUTS AND PLAN FOR LOOPING OUTPUT
  sDate = new Date(data.getRange(11, 1).getDisplayValue());
  eDate = new Date(data.getRange(14, 1).getDisplayValue());
  var responses = ss.getSheetByName(sheetName).getDataRange().getDisplayValues().splice(1);
  var titles = ss.getSheetByName(sheetName).getRange(1, 1, 1, responses[0].length).getDisplayValues();
  var parsedData = 0;
  
  if(subject.indexOf(",") >-1){
    parsedData = [];
    var subjects = subject.split(",");
    for(var i = 0; i<subjects.length; i++){
      if(studentName == ""){  
        var sD = findSubjectData(subjects[i].trim(), responses); 
        for(var j = 0; j<sD.length; j++){
          parsedData.push(sD[j]);
        }
      }
      else{
        var sD = findData(studentName, subjects[i].trim(), responses); 
        for(var j = 0; j<sD.length; j++){
          parsedData.push(sD[j]);
        }
      }
    }
  }
  else{
    if(studentName == ""){  
      parsedData = findSubjectData(subject, responses); 
    }
    else{
      parsedData = findData(studentName, subject, responses); 
      
    }
  }
  
  
  if(parsedData == ""){
    data.getRange(2,4).setValue("No data matches those criteria.");
  }
  else{
    data.getRange(1, 4, 1, 7).setValues(titles);
    data.getRange(2, 4, parsedData.length, parsedData[0].length).setValues(parsedData);
  }
  
}

function standardName(name){
  name = name.toLowerCase();
  name = name.split(' ').join('');
  return name;
}

function checkDateRange(curDate){
  var check = false;
  if(curDate >= sDate && curDate <= eDate){
    check = true;
  }
  return check;
}
function checkNoStart(curDate){
  var check = false;
  if(curDate <= eDate && sDate == ""){
    check = true;
  }
  return check;
}
function checkNoEnd(curDate){
  var check = false;
  if(curDate >= sDate && eDate == ""){
    check = true;
  }
  return check;
}

function findData(name, subject, responses){
  var finalData = 0;
  if(subject == ""){
    finalData = findNameData(name, responses);
    
  }
  else{
    var nameData = findNameData(name, responses); 
    finalData = findSubjectData(subject, nameData);
    
  }
  return finalData;
}

//GO THROUGH LOGIC OF DATE RANGES, YOU BROKE IT SOMEHOW

function findNameData(name, responses){
  var nameData = [];
  for(var i = 0; i< responses.length; i++){
    var holderName = standardName(responses[i][1]);
    
    if(name == holderName && sDate == "" && checkNoStart(new Date(responses[i][0]))){
      nameData.push(responses[i]);
    }
    else if(name == holderName && eDate == "" && checkNoEnd(new Date(responses[i][0]))){
      nameData.push(responses[i]);
    }
    else if(name == holderName && checkDateRange(new Date(responses[i][0]))){
      nameData.push(responses[i]);
    }
    else if(name == holderName){
      nameData.push(responses[i]); 
    }
  }
  return nameData;
}

function findSubjectData(subject, data){
  var subjectData = [];
  if(subject == ""){
    subjectData = data;
  }else{
    for(var i = 0; i<data.length; i++){
      for(var j = 0; j<data[i].length; j++){
        if(data[i][j].toString().indexOf(subject) >(-1) && j != 1 && j != 4 && j != 5){
          if(sDate == "" && checkNoStart(new Date(data[i][0]))){
            subjectData.push(data[i].concat()); 
          }else if(eDate == "" && checkNoEnd(new Date(data[i][0]))){
            subjectData.push(data[i].concat()); 
          }else if(checkDateRange(new Date(data[i][0]))){
            subjectData.push(data[i].concat());       
          }
          else{
            subjectData.push(data[i].concat());        
          }
        }
      }
    }
  }
  return subjectData;
}


