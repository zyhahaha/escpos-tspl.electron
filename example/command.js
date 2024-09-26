const {
    queryUsbDevicePathFn,
    ipcTsplCommand,
    ipcEscPosCommand
} = require('../index.js')

/**
 * ESC/POS指令打印机
 */
const escposPrinterName = 'XP-80C'
queryUsbDevicePathFn(escposPrinterName, usbDevicePath => {
    const commands = [
        0x1B, 0x40, // 初始化打印机  
        0x1B, 0x56, 0x30, // 设置文本大小（这里假设是0，表示默认大小）  
        0x1B, 0x21, 0x30, // 选择标准字符集（美国ASCII）  
        0x1B, 0x61, 0x30, // 设置文本对齐（0表示左对齐）  
        0x68, 0x65, 0x6C, 0x6C, 0x6F, // hello 文本（ASCII编码）  
        0x0A, // LF换行符（在某些打印机上可能需要，但ESC/POS通常使用GS E进行换行）  
        0x1B, 0x45, 0x32  // GS E 2 回车换行（更常用的ESC/POS换行方式）  
    ]
    ipcEscPosCommand(usbDevicePath, commands)
})

/**
 * TSPL指令打印机
 */
const tsplPrinterName = 'HPRT N41'
queryUsbDevicePathFn(tsplPrinterName, usbDevicePath => {
    const command = `
        ! 0 200 200 210 1\r\n
        TEXT 4 0 30 40 hello\r\n
        PRINT\r\n
    `
    ipcTsplCommand(usbDevicePath, command)
})
