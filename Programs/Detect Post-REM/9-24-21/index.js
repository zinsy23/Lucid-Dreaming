import { display } from "display";
import document from "document";
import { sleep } from "sleep";
import { vibration } from "haptics";
import { me } from "appbit";
import { Gyroscope } from "gyroscope";

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
//let sleepCheck = setInterval(checkSleep, 60000); ///////////////
//let hoursTimer = setInterval(updateHour, 3000000);
//let timeUpdate = setInterval(updateTime, 60000);
let vibrateOff;
let addDataInt;
let dataPoint = 0;

console.log("App started");

const accel = new Gyroscope({ frequency: 5 });
const accPos = document.getElementById("accPos");
const accPosX = document.getElementById("accPosX");
const accPosY = document.getElementById("accPosY");
const accPosZ = document.getElementById("accPosZ");
const timeClock = document.getElementById("timeClock");
const theTimer = document.getElementById("theTimer");
const theLog = document.getElementById("scroll");
const theLog2 = document.getElementById("scroll2");
let numbers = "";
let numbers2 = "";
let scrolled = false;

var Y=125,mdY
document.getElementById('scroll').onmousedown = evt => {
  if(!scrolled){
    mdY=evt.screenY
    scrolled = true;
  }
}

document.getElementById('scroll').onmousemove = evt => {
  Y += evt.screenY - mdY
  if(!scrolled) mdY = evt.screenY
  document.getElementById("scroll").y = Y
  document.getElementById("scroll2").y = Y + 225
}

for(let i = 0; i < 5; i++){
  numbers += i + "\n";
}
for(let i = 5; i < 10; i++){
  numbers2 += i + "\n";
}

//console.log(numbers);
theLog.text = numbers;
theLog2.text = numbers2;

function getTotalAcc(values){
  let sum = 0;
  for(let i = 0; i < values.length; i++){
    sum += values[i];
  }
  return sum;
}

for(let i = 0; i < 1; i++){ //Change to 1200!
  data[i] = [];
}

accel.addEventListener("reading", () => {
  totalAccY[accIndex % samples] = Math.abs(parseInt(accel.y));
  totalAccZ[accIndex % samples] = Math.abs(parseInt(accel.z));
  if(accIndex % samples == 0 && accIndex >= samples && !para){
    times++;
    totalAcc = getTotalAcc(totalAccY) + getTotalAcc(totalAccZ);
    if(!early) accPos.text = totalAcc;
    lastTwo[times % 2] = totalAcc;
    if(totalAcc > 5){
      if((getTotalAcc(lastTwo) >= 50 && side != curSide)) wakeUp(); ////////////////////////////////////////////////// || (getTotalAcc(lastTwo) >= 35 && sleep.state == "awake"))
      curSide = side;
    }
  }
  accIndex++;
  side *= -1;
});

timeClock.text = getTime();

//addDataInt = setInterval(addData, 30000);
addData();

function addData(){
  //data[dataPoint][0] = getTime();
  data[0][0] = "Testing if data works";
}

function getTime(){
  let date = new Date();
  let exp = /[0-9]+:[0-9]+:[0-9]+/;
  return exp.exec(date);
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
