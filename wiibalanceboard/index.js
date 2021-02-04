import WIIBalanceBoard from "/src/wiibalanceboard.js";

let requestButton = document.getElementById("request-hid-device");

var wiibalanceboard = undefined;

function setButton(elementId, action) {
  document.getElementById(elementId).addEventListener("click", async () => {
    action();
  });
}

requestButton.addEventListener("click", async () => {
  let device;
  try {
    const devices = await navigator.hid.requestDevice({
      filters: [{ vendorId: 0x057e }]
    });

    device = devices[0];
    wiibalanceboard = new WIIBalanceBoard(device);
  } catch (error) {
    console.log("An error occurred.", error);
  }

  if (!device) {
    console.log("No device was selected.");
  } else {
    console.log(`HID: ${device.productName}`);

    enableControls();
    initCanvas();
  }
});

function initButtons() {
  // LED buttons
  document
    .getElementById("led1")
    .addEventListener("click", () => wiibalanceboard.toggleLed(0));
}

function initCanvas() {
  wiibalanceboard.BtnListener = buttons => {
    var buttonJSON = JSON.stringify(buttons, null, 2);

    if (document.getElementById("buttons").innerHTML != buttonJSON) {
      document.getElementById("buttons").innerHTML = buttonJSON;
    }
  };

  wiibalanceboard.WeightListener = weights => {
    var weightsJSON = JSON.stringify(
      weights,
      (key, value) => {
        return value.toFixed ? Number(value.toFixed(3)) : value;
      },
      2
    );

    if (document.getElementById("weights").innerHTML != weightsJSON) {
      document.getElementById("weights").innerHTML = weightsJSON;
    }
    
    for (let position in weights) {
      const weight = weights[position];
      document.getElementById(position).style.opacity = weight / 40;
    }
  };
}

function enableControls() {
  document.getElementById("Controls").classList.remove("hidden");
  document.getElementById("WeightsViz").classList.remove("hidden");
  document.getElementById("instructions").classList.add("hidden");
}

initButtons();
