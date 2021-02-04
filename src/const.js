export const ReportMode = {
    RUMBLE: 0x10,
    PLAYER_LED: 0x11,
    DATA_REPORTING: 0x12,
    IR_CAMERA_ENABLE: 0x13,
    SPEAKER_ENABLE: 0x14,
    STATUS_INFO_REQ: 0x15,
    MEM_REG_WRITE: 0x16,
    MEM_REG_READ: 0x17,
    SPEAKER_DATA: 0x18,
    SPEAKER_MUTE: 0x19,
    IR_CAMERA2_ENABLE: 0x1a
}

export const DataReportMode = {
    CORE_BUTTONS: 0x30,
    CORE_BUTTONS_AND_ACCEL: 0x31,
    EXTENSION_8BYTES: 0x32,
    CORE_BUTTONS_ACCEL_IR: 0x33
}

export const InputReport = {
    STATUS: 0x20,
    READ_MEM_DATA: 0x21,
    ACK: 0x22
}

export const Rumble = {
    ON: 0x01,
    OFF: 0x00
}

export const LEDS = {
    ONE: 0x10,
    TWO: 0x20,
    THREE: 0x40,
    FOUR: 0x80,
}

export const BUTTON_BYTE1 = [
    "DPAD_LEFT",
    "DPAD_RIGHT",
    "DPAD_DOWN",
    "DPAD_UP",
    "PLUS",
    "",
    "",
    ""
]

export const BUTTON_BYTE2 = [
    "TWO",
    "ONE",
    "B",
    "A",
    "MINUS",
    "",
    "",
    "HOME"
]

export const IRDataType = {
    BASIC: 0x1,
    EXTENDED: 0x3,
    FULL: 0x5
}
  
export const RegisterType = {
    EEPROM: 0x00,
    CONTROL: 0x04
}

export const IRSensitivity = {
    LEVEL_1: [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0x64, 0x00, 0xfe],
    LEVEL_2: [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0x96, 0x00, 0xb4],
    LEVEL_3: [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0xaa, 0x00, 0x64],
    LEVEL_4: [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0xc8, 0x00, 0x36],
    LEVEL_5: [0x07, 0x00, 0x00, 0x71, 0x01, 0x00, 0x72, 0x00, 0x20],
    BLOCK_1: [0xfd, 0x05],
    BLOCK_2: [0xb3, 0x04],
    BLOCK_3: [0x63, 0x03],
    BLOCK_4: [0x35, 0x03],
    BLOCK_5: [0x1f, 0x03],
}

export const WiiBalanceBoardPositions = {
  TOP_RIGHT: 0,
  BOTTOM_RIGHT: 1,
  TOP_LEFT: 2,
  BOTTOM_LEFT: 3,
}