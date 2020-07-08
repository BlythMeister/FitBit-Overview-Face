import { display } from "display";
import { battery as powerBattery } from "power";
import { charger as powerCharger } from "power";
import { BodyPresenceSensor } from "body-presence";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";

import * as bm from "./bm.js";
import * as date from "./date.js"
import * as battery from "./battery.js"
import * as time from "./time.js"
import * as hr from "./hr.js"
import * as activity from "./activity.js"

const hrm = new HeartRateSensor();
const body = new BodyPresenceSensor();

clock.granularity = "seconds";

if (display.on) {
  body.start();
}

if (body.present) {
    hrm.start(); 
}

display.onchange = (evt) => {
  startStopHrm();
  reApplyState();
}

body.onreading = (evt) => {
  startStopHrm();
  reApplyState();
}

clock.ontick = (evt) => {  
  time.drawTime(evt.date);
  date.drawDate(evt.date);
  activity.drawAllProgress();
}

powerBattery.onchange = (evt) => {
  reApplyState();
}

powerCharger.onchange = (evt) => {
  reApplyState();
}

hrm.onreading = (evt) => {
  hr.newHrm(hrm.heartRate);
};

export function startStopHrm() {
  let startHrm = false;
  let startBody = false;
  
  if(powerBattery.chargeLevel >= 20) {
    if (display.on) {
      startBody = true;
      if (body.present) {
        startHrm = true;
      }
    } 
  }  
  
  if(startBody) {
    body.start();
  } else {
    body.stop();
  }
  
  if(startHrm)
  {
    hrm.start();
    hr.newHrm(0); 
  } else {
    hrm.stop();
  }
  
  reApplyState();
}

export function reApplyState() {
  battery.drawBat();
  battery.isCharging();
  hr.batteryCharger();
  hr.drawHrm();
  activity.drawAllProgress();  
  bm.drawBMR();
  bm.drawBMI();
}
