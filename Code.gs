function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Tutorial Analysis')
  .addItem('Analyze Tutorials', 'start')
  .addToUi();
}
var sDate = 0;// do if these are blank
var eDate = 0;
var grade = 0;
function start(){
  
  var sheetData = SpreadsheetApp.getActive().getSheetByName("tutorials");
  var url = sheetData.getRange(2, 1).getDisplayValue(); //change this to be read by sheet
  var sheetName = sheetData.getRange(5,1).getDisplayValue();
  var ss = SpreadsheetApp.openByUrl(url);
  var data = SpreadsheetApp.getActive().getSheetByName('data');
  data.getRange(1, 4, 1128, 13).clearContent();
  
  var studentName = (data.getRange(2,1).isBlank() ? "0" : standardName(data.getRange(2, 1).getDisplayValue()));
  var subject = (data.getRange(5,1).isBlank() ? "0" : data.getRange(5,1).getValue());
  
  grade = (data.getRange(14,1).isBlank() ? "0" : data.getRange(14,1).getValue());
  sDate = (data.getRange(8,1).isBlank() ? "0" : data.getRange(8,1).getValue());
  eDate = (data.getRange(11,1).isBlank() ? "0" : data.getRange(11,1).getValue());
  
  if(sDate != "" && sDate != 0){
    
    
    sDate = new Date(sDate);
    sDate.setHours(0,0,0,0);
  }
  
  if(eDate != "0" && eDate != 0){
    eDate = new Date(eDate); 
    eDate.setHours(24,0,0,0);
  }
  
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
    if(studentName == "0"){  
      parsedData = findSubjectData(subject, responses); 
    }
    else{
      parsedData = findData(studentName, subject, responses); 
      
    }
  }
  parsedData = findGradeData(parsedData);
  
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
//this compares time too........
function checkDateRange(curDate){
  var check = false;
  if(curDate >= sDate && curDate <= eDate){
    check = true;
  }
  return check;
}
function checkNoStart(curDate){
  var check = false;
  if(curDate <= eDate && sDate == "0"){
    check = true;
  }
  return check;
}
function checkNoEnd(curDate){
  var check = false;
  if(curDate >= sDate && eDate == "0"){
    check = true;
  }
  return check;
}

function findData(name, subject, responses){
  var finalData = 0;
  if(subject == "0"){
    
    finalData = findNameData(name, responses);
  }
  else{
    var nameData = findNameData(name, responses); 
    
    finalData = findSubjectData(subject, nameData);
    
    
  }
  return finalData;
}

function findGradeData(responses){
  if(grade == "0" || grade == 0){
    return responses;
  }else{
    
    var gradeData = [];
    for(var i = 0; i< responses.length; i++){  
      if(grade == responses[i][2] ){
        gradeData.push(responses[i]);
      }
    }
    return gradeData;
  }
}

//GO THROUGH LOGIC OF DATE RANGES, YOU BROKE IT SOMEHOW

function findNameData(name, responses){
  var nameData = [];
  for(var i = 0; i< responses.length; i++){
    var holderName = standardName(responses[i][1]);
    
    // if name matches
    if((holderName.indexOf(name) > -1 || name.indexOf(holderName) > -1) && sDate == "0" && checkNoStart(new Date(responses[i][0]))){
      
      nameData.push(responses[i]);
    }
    else if((holderName.indexOf(name) > -1 || name.indexOf(holderName) > -1) && eDate == "0" && checkNoEnd(new Date(responses[i][0]))){
      nameData.push(responses[i]);
    }
    else if((holderName.indexOf(name) > -1 || name.indexOf(holderName) > -1) && checkDateRange(new Date(responses[i][0]))){
      nameData.push(responses[i]);
    }
    else if((holderName.indexOf(name) > -1 || name.indexOf(holderName) > -1)){
      if(eDate == "0" && sDate =="0"){
        nameData.push(responses[i]); 
      }
    }
  }
  
  return nameData;
}

function findSubjectData(subject, data){
  var subjectData = [];
  if(subject == "0"){
    
    for(var i = 0; i<data.length; i++){
      if(checkDateRange(new Date(data[i][0]))){
        
        subjectData.push(data[i].concat());
      }
      else if(checkNoEnd(new Date(data[i][0]))){
        //console.log("test1");
        subjectData.push(data[i].concat()); 
      }
      else if(checkNoStart(new Date(data[i][0]))){
        //console.log(data[i][0]);
        subjectData.push(data[i].concat());
      }
    }
    
  }else{
    for(var i = 0; i<data.length; i++){
      for(var j = 0; j<data[i].length; j++){
        //if subject found, in proper spot
        if(data[i][j].toString().indexOf(subject) >(-1) && j != 1 && j != 4 && j != 5){
          //if there is no start date, there is an end date, and the date is before the end
          if(sDate == "0" && eDate !="0" && checkNoStart(new Date(data[i][0]))){
            subjectData.push(data[i].concat()); 
          }else if(eDate == "0" && sDate != "0" && checkNoEnd(new Date(data[i][0]))){
            subjectData.push(data[i].concat()); 
          }else if( sDate != "0" && eDate != "0" && checkDateRange(new Date(data[i][0]))){
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


