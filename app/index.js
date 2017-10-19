// import libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib"

// whether to skip time animation and switch to new time fast
const ANIMATION_DISABLE_ALWAYS = 0;
const ANIMATION_DISABLE_ON_SCREEN_WAKEUP = 1;
const ANIMATION_ENABLE_ALWAYS = 2;
let userSettings;
let screenJustAwoke = true;



// change time animations
function changeTime(position, oldTime, newTime) {
 
    let permimg = document.getElementById(`${position}permimg`);
    let animimg = document.getElementById(`${position}animimg`);

    // if animation is disabled - assign new time to both images
    if (userSettings.timeAnimation == ANIMATION_DISABLE_ALWAYS || 
        (userSettings.timeAnimation == ANIMATION_DISABLE_ON_SCREEN_WAKEUP && screenJustAwoke)) {
        
        permimg.href = `digits/${newTime}.png`; // new
        animimg.href = `digits/${newTime}.png`; // new
      
    } else { //   If animation enabled:
        
        //   1. assign current time digit to permanent image
        //   2. assign new time digit to moving image
        //   3. animate image
        permimg.href = `digits/${oldTime}.png`; // old
        animimg.href = `digits/${newTime}.png`; // new
        document.getElementById(`${position}anim`).animate = true;
      
    }
    
}


// trying to get user settings if saved before
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
} catch (e) {
  userSettings = {timeAnimation: ANIMATION_DISABLE_ON_SCREEN_WAKEUP}
}


// get handle on textboxes for date, DoW, AM/PM
let monthlbl = document.getElementById("month");
let daylbl = document.getElementById("day");
let dowlbl = document.getElementById("dow");
let ampmlbl = document.getElementById("ampm");

// intially time is not set
let timeh1 = 0;
let timeh2 = 0;
let timem1 = 0;
let timem2 = 0;

// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// clock ticks every minute
clock.granularity = "minutes";

// clock tick
function updateClock() {
  if (!display.on) return; // if display is off - don't do anything
  
  let today = new Date(); // get current date/time
  
  // obtaining hours in user-preferred format and split them into 2 digits
  let hours = dtlib.format1224hour(today.getHours());
  let h1 = Math.floor(hours/10);
  let h2 = hours % 10;
  
  // obtaining minutes and split them into 2 digits
  let mins = today.getMinutes();
  let m1 = Math.floor(mins/10);
  let m2 = mins % 10;
  
   console.log("Animation settings: " + userSettings.timeAnimation);
   console.log("Screen just awoke: " + screenJustAwoke);
  

  if (timeh1 != h1) {
    changeTime('h1', timeh1, h1)
    timeh1 = h1;
  }
  
  // same as H1 for second hour digit
  if (timeh2 != h2) {
    changeTime('h2', timeh2, h2)
    timeh2 = h2;
  }
  
  
  // same as h1 for first minute digit
  if (timem1 != m1) {
    changeTime('m1', timem1, m1)
    timem1 = m1;
  }
  
  
  // same as h1 for second minute digit
  if (timem2 != m2) {
    changeTime('m2', timem2, m2)
    timem2 = m2;
  }
  
  // displaying short month name in English
  monthlbl.innerText = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());
  
  // displaying 0-prepended day of the month
  daylbl.innerText = dtlib.zeroPad(today.getDate());
  
  // displaying shot day of the week in English
  dowlbl.innerText = dtlib.getDowNameShort(dtlib.LANGUAGES.ENGLISH, today.getDay());
  
  // displaying AM/PM or 24H
  ampmlbl.innerText = dtlib.getAmApm(today.getHours());
  
  // resetting screen awoke flag
  screenJustAwoke = false;
} 
 
// assigning clock tick event handler
clock.ontick = () => updateClock();

// and cicking off first time change
updateClock();

// Message is received
messaging.peerSocket.onmessage = evt => {
  
  switch (evt.data.key) {
      case "timeDigitanimation": // if this is animation setting
          userSettings.timeAnimation = JSON.parse(evt.data.newValue).values[0].value;
          console.log("settings received: " + userSettings.timeAnimation);
          break;
  };
      
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};

// on app exit collect settings 
me.onunload = () => {
    fs.writeFileSync("user_settings.json", userSettings, "json");
}

// on display on/off set the flag
display.onchange = () => {
  screenJustAwoke = display.on;
}

