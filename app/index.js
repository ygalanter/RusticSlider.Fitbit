// import libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib"

// get handle on stationary images for hours and minutes
let h1permimg = document.getElementById("h1permimg");
let h2permimg = document.getElementById("h2permimg");
let m1permimg = document.getElementById("m1permimg");
let m2permimg = document.getElementById("m2permimg");

// get handle on moving images for hours and minutes
let h1animimg = document.getElementById("h1animimg");
let h2animimg = document.getElementById("h2animimg");
let m1animimg = document.getElementById("m1animimg");
let m2animimg = document.getElementById("m2animimg");

// het handle on animated objects
let h1anim = document.getElementById("h1anim");
let h2anim = document.getElementById("h2anim");
let m1anim = document.getElementById("m1anim");
let m2anim = document.getElementById("m2anim");

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
  
  // if first digit of hour changed:
  //   1. assign current time digit to permanent image
  //   2. assign new time digit to moving image
  //   3. animate image
  if (timeh1 != h1) {
    h1permimg.href = `digits/${timeh1}.png`;
    h1animimg.href = `digits/${h1}.png`;
    h1anim.animate = true;
    timeh1 = h1;
  }
  
  // same as H1 for second hour digit
  if (timeh2 != h2) {
    h2permimg.href = `digits/${timeh2}.png`;
    h2animimg.href = `digits/${h2}.png`;
    h2anim.animate = true;
    timeh2 = h2;
  }
  
  
  // same as h1 for first minute digit
  if (timem1 != m1) {
    m1permimg.href = `digits/${timem1}.png`;
    m1animimg.href = `digits/${m1}.png`;
    m1anim.animate = true;
    timem1 = m1;
  }
  
  
  // same as h1 for second minute digit
  if (timem2 != m2) {
    m2permimg.href = `digits/${timem2}.png`;
    m2animimg.href = `digits/${m2}.png`;
    m2anim.animate = true;
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
} 
 
// assigning clock tick event handler
clock.ontick = () => updateClock();

// and cicking off first time change
updateClock();
