function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tutorial Analysis')
  .addItem('Analyze Tutorials', 'start')
  .addToUi();
}

function start(){
  var url = "https://docs.google.com/spreadsheets/d/18LfUbCKU0HTdzJ4i4iv5r8hnNy-wvg0jMKLsabzWrbo/edit#gid=1612432561"; //change this to be read by sheet
  var ss = SpreadsheetApp.openByUrl(url); 
  var data = SpreadsheetApp.getActive().getSheetByName('data');
  data.getRange(1, 4, 100, 13).clearContent();
  var sheetName = data.getRange(2,1).getValue();
  var studentName = standardName(data.getRange(5, 1).getValue());
  var subject = data.getRange(8,1).getValue();//ACCEPT MULTIPLE INPUTS AND PLAN FOR LOOPING OUTPUT
  var responses = ss.getSheetByName(sheetName).getDataRange().getValues();
  var titles = ss.getSheetByName(sheetName).getRange(1, 1, 1, 7).getValues();
  var parsedData = [];
  
  if(subject.indexOf(",") >-1){
    var subjects = subject.split(",");
    for(var i = 0; i<subjects.length; i++){
      if(studentName == ""){  
        parsedData.concat(findSubjectData(subjects[i].trim(), responses)); 
      }
      else{
        parsedData.concat(findData(studentName, subjects[i].trim(), responses)); 
        
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
    for(var j = 0; j<data[i].length; j++){
      if(data[i][j].toString().indexOf(subject) >(-1) && j != 1 && j != 4 && j != 5){
        //console.log("1");
        subjectData.push(data[i].concat());       
    }
    }
  }
  return subjectData;
}


