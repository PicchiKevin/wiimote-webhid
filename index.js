import { DataReportMode, IRDataType, IRSensitivity } from "./src/const.js";
import WIIMote from "./src/wiimote.js"

let requestButton = document.getElementById("request-hid-device");

var wiimote = undefined;

function setButton(elementId, action) {
  document.getElementById(elementId).addEventListener("click", async () => {
    action()
  })  
}


requestButton.addEventListener("click", async () => {
  let device;
  try {
    const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x057e }],
    });
    
    device = devices[0];
    wiimote = new WIIMote(device)

  } catch (error) {
    console.log("An error occurred.", error);
  }

  if (!device) {
    console.log("No device was selected.");
  } else {
    console.log(`HID: ${device.productName}`);

    enableControls()
    initCanvas()

  }
});

function initButtons() {
  setButton( "rumble",
    () => wiimote.toggleRumble()
  )

  setButton( "irextended",
    () => wiimote.initiateIR(IRDataType.EXTENDED)
  )

  setButton( "irbasic",
    () => wiimote.initiateIR(IRDataType.BASIC)
  )

  setButton( "irfull",
    () => wiimote.initiateIR(IRDataType.FULL)
  )

  setButton( "coreBtns",
    () => wiimote.setDataTracking(DataReportMode.CORE_BUTTONS)
  )

  setButton( "coreBtnsACC",
    () => wiimote.setDataTracking(DataReportMode.CORE_BUTTONS_AND_ACCEL)
  )

  setButton( "coreBtnsACCIR",
    () => wiimote.setDataTracking(DataReportMode.CORE_BUTTONS_ACCEL_IR)
  )

  // LED buttons
  document.getElementById("led1").addEventListener("click", () => wiimote.toggleLed(0))
  document.getElementById("led2").addEventListener("click", () => wiimote.toggleLed(1))
  document.getElementById("led3").addEventListener("click", () => wiimote.toggleLed(2))
  document.getElementById("led4").addEventListener("click", () => wiimote.toggleLed(3))
}

function initCanvas(){
  var canvas = document.getElementById("IRcanvas")
  let ctx = canvas.getContext("2d")

  wiimote.BtnListener = (buttons) => {
    var buttonJSON = JSON.stringify(buttons, null, 2);

    if(document.getElementById('buttons').innerHTML != buttonJSON){
      document.getElementById('buttons').innerHTML = buttonJSON
    }
  }

  wiimote.AccListener = (x,y,z) => {
    document.getElementById('accX').innerHTML = x
    document.getElementById('accY').innerHTML = y
    document.getElementById('accZ').innerHTML = z
  }


  wiimote.IrListener = (pos) => {
    if(pos.length < 1){
      return
    }

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = 'white'

    pos.forEach( cPos => {
      if(cPos != undefined){
        ctx.fillRect(cPos.x/(1024/ctx.canvas.width), ctx.canvas.height-(cPos.y/(760/ctx.canvas.height)), 5, 5)
      }
    })

    document.getElementById("IRdebug").innerHTML = JSON.stringify(pos, null, true)
    
  }

}

function enableControls(){
  document.getElementById("Controls").classList.remove("hidden")
  document.getElementById("instructions").classList.add("hidden")
}


initButtons()