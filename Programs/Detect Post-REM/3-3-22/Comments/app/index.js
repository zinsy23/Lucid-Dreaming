import document from "document";
import { sleep } from "sleep";
import { vibration } from "haptics";
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";

me.appTimeoutEnabled = false;

let startDelay = setInterval(delayStart, 900000); 
let timeUpdate = setInterval(updateTime, 60000);
let heartRateUpdate = setInterval(updateHeartRate, 10000);
let addDataInt;
let dataPoint = 0;
// let movement = -1;
// let minutesLeft = 25; //////////////////////
// let hoursLeft = 3;
// let timesVibrated = 0;
// let timesIntervated = 0;
// let totalTimes = 4;
// let intervalId;
// let postSleep = 0;
// let times = -1;
// let timesAsleep = 0; //////////////////
// let secondCheck; ///////////////

const hrm = new HeartRateSensor();
const timeClock = document.getElementById("timeClock");
const heartRate = document.getElementById("heartRate");
const batteryPercent = document.getElementById("batteryPercent");
const theLog = document.getElementById("scroll");
const theLog2 = document.getElementById("scroll2");
const theLog3 = document.getElementById("scroll3");
const theLog4 = document.getElementById("scroll4");
const theLog5 = document.getElementById("scroll5");
const theLog6 = document.getElementById("scroll6");
let numbers = ["","","","","",""];
let j;
// const theTimer = document.getElementById("theTimer");
// const button1 = document.getElementById("button-1");
// const button2 = document.getElementById("button-2");

function buttonMove(){
  document.getElementById("scroll").y = Y
  document.getElementById("scroll2").y = Y + 6700
  document.getElementById("scroll3").y = Y + 13400
  document.getElementById("scroll4").y = Y + 20100
  document.getElementById("scroll5").y = Y + 26800
  document.getElementById("scroll6").y = Y + 33500
  timeClock.text = (Y >= 100) ? getTime() : "";
  // if(Y >= 100){
  //   timeClock.text = getTime();
  // } else {
  //   timeClock.text = "";
  // }
}

// button1.addEventListener("click", (evt) => {
//   Y -= 50;
//   buttonMove();
// });

// button2.addEventListener("click", (evt) => {
//   Y += 50;
//   buttonMove();
// });

updateTime();
hrm.start();

function delayStart(){  
  clearInterval(startDelay);
  addDataInt = setInterval(addData, 30000);
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
  timeClock.text = (Y >= 100) ? getTime() : "";
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

function addData(){
  if(sleep.state == "awake"){
    let now = new Date();
    j = Math.floor(dataPoint / 231);
    numbers[j] += "    " + getTime() + "; " + sleep.state + "\n";
    updateData();
    if(dataPoint >= 1300) clearInterval(addDataInt);
    dataPoint++;
  }
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

function updateHeartRate(){
  heartRate.text = hrm.heartRate;
  batteryPercent.text = battery.chargeLevel;
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


function updateTime(){
  timeClock.text = getTime();
}

function intervalOff(){
  me.exit();
}
*/