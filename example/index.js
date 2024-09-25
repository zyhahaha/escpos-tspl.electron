const {
    queryUsbDevicePathFn,
    ipcTsplBitmap,
    ipcEscPosBitmap
} = require('../index.js')

const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAF1JREFUKFNjZCASMDIwMIAwJwMDw3eoHhj7P7IZIEUgEMDAwHAPyhZkYGA4iG4RTCHIlCwGBoaXDAwMKxgYGP7gUggSN4RafwObs2EmguQMoApvElKI1//IJtJZIQDzWQwLlBenDAAAAABJRU5ErkJggg=='

/**
 * ESC/POS指令打印机
 */
const escposPrinterName = 'XP-80C'
queryUsbDevicePathFn(escposPrinterName, usbDevicePath => {
    ipcEscPosBitmap(usbDevicePath, base64Data)
})

/**
 * TSPL指令打印机
 */
const tsplPrinterName = 'HPRT N41'
queryUsbDevicePathFn(tsplPrinterName, usbDevicePath => {
    ipcTsplBitmap(usbDevicePath, base64Data)
})
