import {
    toBigEndian,
    numbersToBuffer,
    debug,
    getBitInByte
} from "./helpers.js"

import {
    ReportMode,
    DataReportMode,
    Rumble,
    LEDS,
    BUTTON_BYTE1,
    BUTTON_BYTE2,
    RegisterType,
    IRDataType,
    IRSensitivity,
    InputReport
} from "./const.js"

export default class WIIMote{
    constructor(device){
        this.device = device;
        this.buttonStatus = {
            "DPAD_LEFT" : false,
            "DPAD_RIGHT": false,
            "DPAD_DOWN": false,
            "DPAD_UP": false,
            "PLUS": false,
            "TWO": false,
            "ONE": false,
            "B": false,
            "A": false,
            "MINUS": false,
            "HOME": false
        };
        this.ledStatus = [
            false,  //led 1
            false,  //led 2
            false,  //led 3
            false   //led 4 
        ];

        this.rumblingStatus = false

        this.IrListener = null
        this.AccListener = null
        this.BtnListener = null

       
        setTimeout( this.initiateDevice(), 200);
    }

    // Initiliase the Wiimote
    initiateDevice(){
        this.device.open().then(() => {
            this.sendReport(ReportMode.STATUS_INFO_REQ, [0x00])
            this.setDataTracking(DataReportMode.CORE_BUTTONS)

            this.device.oninputreport = (e) => this.listener(e);
        })
    }

    initiateIR(dataType = IRDataType.EXTENDED, sensitivity = IRSensitivity.LEVEL_3, sensitivityBlock = IRSensitivity.BLOCK_3 ){
        // Fire up the first camera pin
        this.sendReport(ReportMode.IR_CAMERA_ENABLE, [0x04])

        // Fire up the second camera pin
        this.sendReport(ReportMode.IR_CAMERA2_ENABLE, [0x04])

        //Get register write permission
        this.writeRegister(RegisterType.CONTROL, 0xb00030, [0x08])

        //set sensitivity block part 1
        this.writeRegister(RegisterType.CONTROL, 0xb00000, sensitivity)
    
        //Set sensitivity block part 2
        this.writeRegister(RegisterType.CONTROL, 0xb0001a, sensitivityBlock)

        //Set data mode number 
        this.writeRegister(RegisterType.CONTROL, 0xb00033, [dataType])

        this.writeRegister(RegisterType.CONTROL, 0xb00030, [0x08])

        /// update data tracking mode
        this.setDataTracking(DataReportMode.CORE_BUTTONS_ACCEL_IR)
    }

    // Send a data report
    sendReport(mode, data){
        return this.device.sendReport(
            mode,
            numbersToBuffer(data)
        ).catch(console.log)
    }

    // Toggle rumbling on the Wiimote
    toggleRumble(){
        var state = Rumble.ON;

        if(this.rumblingStatus){
            state = Rumble.OFF;
            this.rumblingStatus = false
        }else{
            this.rumblingStatus = true
        }

        this.sendReport(ReportMode.RUMBLE, [state])
    }

    // Encode LED Status
    LedEncoder( one, two, three, four ) {
        return (
          +Boolean(one) * LEDS.ONE +
          +Boolean(two) * LEDS.TWO +
          +Boolean(three) * LEDS.THREE +
          +Boolean(four) * LEDS.FOUR
        );
    }

    // Toggle an LED
    toggleLed(id){
        this.ledStatus[id] = !this.ledStatus[id]
        return this.sendReport(ReportMode.PLAYER_LED, [this.LedEncoder(...this.ledStatus)])
    }

    // Write the the Wiimote register
    writeRegister(type, offset, data){
        let offsetArr = toBigEndian(offset, 3);
        let dataLength = data.length
        
        
        for (let index = 0; index < 16-dataLength; index++) {
            data.push(0x00)
        }
        
        var total = [type, ...offsetArr, dataLength, ...data]
        //console.log(ReportMode.MEM_REG_WRITE.toString(16), debug( total, false) )

        this.sendReport(ReportMode.MEM_REG_WRITE, total)
    }

    // Set the Data output type 
    setDataTracking(dataMode = DataReportMode.CORE_BUTTONS_ACCEL_IR){
        return this.sendReport( ReportMode.DATA_REPORTING, [0x00, dataMode]);
    }

    // Decode the Accelerometer data
    ACCDecoder(data){
        if(this.AccListener != null){
            this.AccListener(...data)
        }
    }

    // Decode the IR Camera data
    IRDecoder(data){
        var tracked_objects = []

        for (let index = 0; index < 12; index+=3) {
            if(data[index] != 255 && data[index+1] != 255 && data[index+2] != 255){
                var x = data[index]
                var y = data[index+1]
                var size = data[index+2]

                x |= (size & 0x30) << 4
                y |= (size & 0xc0) << 2

                tracked_objects.push({
                    x: x,
                    y: y,
                    s: size
                })
            }
        }

        if(this.IrListener != null){
            this.IrListener(tracked_objects)
        }
    }

    // Toggle button status in 
    toggleButton(name, value){
        if(name == "" || name == undefined) return

        this.buttonStatus[name] = (value != 0)
    }

    // Decode the button data
    BTNDecoder(byte1, byte2){
        for (let i = 0; i < 8; i++) {
            let byte1Status = getBitInByte(byte1, i+1)
            let byte2Status = getBitInByte(byte2, i+1)

            this.toggleButton(BUTTON_BYTE1[i], byte1Status)
            this.toggleButton(BUTTON_BYTE2[i], byte2Status)

            if(this.BtnListener != null){
                this.BtnListener(this.buttonStatus)
            }
        }
    }

    // main listener received input from the Wiimote
    listener(event){
        var data = new Uint8Array(event.data.buffer);
        const [byte1, byte2,    // buttons
            accX, accY, accZ,   // ACC
            ir1, ir2, ir3, ir4, ir5, ir6, ir7, ir8, ir9, ir10, ir11, ir12   // IR Camera
        ] = data;

        if(event.reportId == InputReport.STATUS){
            console.log(data)
            this.setDataTracking(DataReportMode.CORE_BUTTONS_ACCEL_IR)
        }

        this.BTNDecoder(byte1, byte2);
        this.ACCDecoder([accX, accY, accZ])
        this.IRDecoder([ir1, ir2, ir3, ir4, ir5, ir6, ir7, ir8, ir9, ir10, ir11, ir12])

    }
}