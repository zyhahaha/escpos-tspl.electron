const { queryUsbDevicePathFn } = require('./utils/usb.js')
const { ipcTsplCommand, ipcTsplBitmap } = require('./utils/tspl/index.js')
const { ipcEscPosCommand, ipcEscPosBitmap } = require('./utils/escpos/index.js')

module.exports = {
    queryUsbDevicePathFn,
    ipcTsplCommand,
    ipcTsplBitmap,
    ipcEscPosCommand,
    ipcEscPosBitmap
}
