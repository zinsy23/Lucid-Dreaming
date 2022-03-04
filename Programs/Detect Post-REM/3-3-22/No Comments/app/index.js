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

timeClock.text = getTime();
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
    j = Math.floor(dataPoint / 231);
    numbers[j] += "    " + getTime() + "; " + sleep.state + "\n";
    updateData();
    if(dataPoint >= 1300) clearInterval(addDataInt);
    dataPoint++;
    console.log(dataPoint);
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