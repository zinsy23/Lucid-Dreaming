import { display } from "display";
import document from "document";
import { sleep } from "sleep";
import { vibration } from "haptics";
import { me } from "appbit";
import { Gyroscope } from "gyroscope";
import { HeartRateSensor } from "heart-rate";

me.appTimeoutEnabled = false;
let curAcc;
let prevAcc;
let totalAcc;
let accValues = [];
let totalAccX = [];
let totalAccY = [];
let totalAccZ = [];
let data = [];
let minutesLeft = 25; //////////////////////
let hoursLeft = 3;
let accIndex = 0;
let timesVibrated = 0;
let timesIntervated = 0;
let totalTimes = 4;
let intervalId;
let postSleep = 0;
const accStart;
let para = false;
let times = -1;
let lastTwo = [0,0];
let samples = 25;
let early = true;
let earlyInterval;
let earlyAwake = false;
let earlyAwakeStop;
let side = -1;
let curSide;
let timesAsleep = 0; //////////////////
let secondCheck; ///////////////
let startDelay = setInterval(delayStart, 900000); 
let secondFix;
let timeUpdate = setInterval(updateTime, 60000);
let intREM;
let vibrateOff;
let addDataInt;
let dataPoint = 0;
let total = 0;
let avgHr = 0;
let isREM = false;
let collected = false;
// let movement = -1;

const hrm = new HeartRateSensor();
const accel = new Gyroscope({ frequency: 2 });
const accPos = document.getElementById("accPos");
const accPosX = document.getElementById("accPosX");
const accPosY = document.getElementById("accPosY");
const accPosZ = document.getElementById("accPosZ");
const timeClock = document.getElementById("timeClock");
const theTimer = document.getElementById("theTimer");
const theLog = document.getElementById("scroll");
const theLog2 = document.getElementById("scroll2");
const theLog3 = document.getElementById("scroll3");
const theLog4 = document.getElementById("scroll4");
const theLog5 = document.getElementById("scroll5");
const theLog6 = document.getElementById("scroll6");
// const button1 = document.getElementById("button-1");
let numbers = ["","","","","",""];
let heartRates = [];
let hrIndex = 0;
let resting = 61;
let j;

function delayStart(){
  clearInterval(startDelay);
  secondCheck = setInterval(checkSecond, 1000);
}

function scrollMouseMove(evt){
  Y += evt.screenY - mdY
  mdY = evt.screenY
  document.getElementById("scroll").y = Y
  document.getElementById("scroll2").y = Y + 6700
  document.getElementById("scroll3").y = Y + 13400
  document.getElementById("scroll4").y = Y + 20100
  document.getElementById("scroll5").y = Y + 26800
  document.getElementById("scroll6").y = Y + 33500
}

var Y=125,mdY
document.getElementById('scroll').onmousedown = evt => {
  mdY=evt.screenY
}
document.getElementById('scroll2').onmousedown = evt => {
  mdY=evt.screenY
}
document.getElementById('scroll3').onmousedown = evt => {
  mdY=evt.screenY
}
document.getElementById('scroll4').onmousedown = evt => {
  mdY=evt.screenY
}
document.getElementById('scroll5').onmousedown = evt => {
  mdY=evt.screenY
}
document.getElementById('scroll6').onmousedown = evt => {
  mdY=evt.screenY
}

document.getElementById('scroll').onmousemove = evt => {
  scrollMouseMove(evt);
  if(Y >= 100){
    timeClock.text = getTime();
  } else {
    timeClock.text = "";
  }
}
document.getElementById('scroll2').onmousemove = evt => {
  scrollMouseMove(evt);
}
document.getElementById('scroll3').onmousemove = evt => {
  scrollMouseMove(evt);
}
document.getElementById('scroll4').onmousemove = evt => {
  scrollMouseMove(evt);
}
document.getElementById('scroll5').onmousemove = evt => {
  scrollMouseMove(evt);
}
document.getElementById('scroll6').onmousemove = evt => {
  scrollMouseMove(evt);
}
// button1.addEventListener("click", (evt) => {
//   movement *= -1;
//   total = (movement == 1) ? 350 : 0;
// });

updateTime();

function getTotalAcc(values){
  let sum = 0;
  for(let i = 0; i < values.length; i++){
    sum += values[i];
  }
  return sum;
}

accel.addEventListener("reading", () => {
  let moveX = Math.abs(parseInt(accel.x * 10));
  let moveY = Math.abs(parseInt(accel.y * 10));
  let moveZ = Math.abs(parseInt(accel.z * 10));
  total += moveX + moveY + moveZ;
});

function checkSecond(){
  if(getSecond() == 0 || getSecond() == 30){
    addDataInt = setInterval(addData, 30000);
    hrm.start();
    accel.start();
    clearInterval(secondCheck);
  }
}

function addData(){
  if(sleep.state == "awake"){
    let now = new Date();
    let startTime = now.getMilliseconds();
    j = Math.floor(dataPoint / 231);
    numbers[j] += "    " + getTime() + "; " + sleep.state + "\n";
    updateData();
    total = 0;
    if(dataPoint >= 1300) clearInterval(addDataInt);
    dataPoint++;
    let now = new Date();
    let endTime = now.getMilliseconds();
    clearInterval(addDataInt); 
    let newInt = 30000 - ((endTime + startTime) / 2); 
    addDataInt = setInterval(addData, newInt);  
  }
}

function avgHeartRate(){
  heartRates[hrIndex] = hrm.heartRate;
  hrIndex++;
  if(total > 150 && !isREM){
    avgHr = getAvgHr();
    heartRates = [];
    hrIndex = 0;
    if(avgHr > resting){
      isREM = true;
      intREM = setInterval(getREM, 300000);
    }
    return avgHr;
  } else if(isREM && collected){
    collected = false;
    return avgHr;
  } else return 0;
}

function getREM(){
  collected = true;
  avgHr = getAvgHr();
  heartRates = [];
  hrIndex = 0;
  if(avgHr < resting){
    isREM = false;
    clearInterval(intREM);
  }
}

function getAvgHr(){
  let tempHr = sortArray(heartRates);
  let sum = 0;
  let totalHr = Math.ceil(tempHr.length / 2);
  for(let i = 0; i < totalHr; i++){
    sum += tempHr[i];
  }
  sum = Math.floor(sum / totalHr);
  return sum;
}

function sortArray(array) {
  var temp = 0;
  for (var i = 0; i < array.length; i++) {
    for (var j = i; j < array.length; j++) {
      if (array[i] < array[j]) {
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }
  return array;
}


function updateData(){
  theLog.text = numbers[0];
  theLog2.text = numbers[1];
  theLog3.text = numbers[2];
  theLog4.text = numbers[3];
  theLog5.text = numbers[4];
  theLog6.text = numbers[5];
}

function updateTime(){
  if(Y >= 100) timeClock.text = getTime();
}

function getTime(){
  let date = new Date();
  let exp = /[0-9]+:[0-9]+:[0-9]+/;
  return exp.exec(date);
}

function getSecond(){
  let date = new Date();
  let exp = /[0-9]+:[0-9]+:[0-9]+/;
  let time = exp.exec(date);
  let exp = /[0-9]+$/;
  return exp.exec(time);
}

/*
function checkSleep(){
  postSleep++;
  if(sleep.state == "asleep" && postSleep > 5){ ///////////////////////
    timesAsleep++;
    if(timesAsleep > 8){
      clearInterval(sleepCheck);
      intervalId = setInterval(updateMinute, 60000); ////////////////////
      theTimer.text = minutesLeft;
      accel.start();
    }
  } else timesAsleep = 0;
}

function updateMinute(){
  if(!earlyAwake){
    minutesLeft -= 1;
    theTimer.text = minutesLeft;
    if(minutesLeft <= 0){
      totalTimes++;
      if(totalTimes % 5 == 0){
        // everySoOften();
        //startVibrating = setInterval(startVibration, 4000);
        theTimer.text = "";
        clearInterval(intervalId);
        early = false;
      }
    }
  }
}

function updateHour(){
  hoursLeft -= 1;
  if(hoursLeft <= 0){
    me.exit();
  }
}

function bringBack(){
  clearInterval(earlyInterval);
  accel.start();
  accPosY.text = "";
  accPosZ.text = "";
  earlyAwake = false;
}

function stopEarlyAwake(){
  clearInterval(earlyAwakeStop);
  vibration.stop();
  earlyInterval = setInterval(bringBack, 60000)
}

function wakeUp(){
  if(early){
    vibration.start("ring");
    earlyAwake = true;
    accel.stop();
    earlyAwakeStop = setInterval(stopEarlyAwake, 1500);
    accPos.text = "";
    theTimer.text = "";
    accPosY.text = "Already?";
    accPosZ.text = "Go back to sleep!";
    lastTwo = [0,0];
  } else {
    vibration.start("alert");
    accel.stop();
    para = true;
    accPos.text = "";
    accPosY.text = "It's not real";
    accPosZ.text = "Go back to sleep!";
    vibrateOff = setInterval(intervalOff, 120000);
  }
}



function updateTime(){
  timeClock.text = getTime();
}

function intervalOff(){
  me.exit();
}
*/