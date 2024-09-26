// const escpos2 = require('node-escpos-win');
const escpos2 = require('../node-escpos-win.node');
const { base64ToBuffer } = require('./base64-to-buffer.js');

function ipcTsplBitmap (usbDevicePath, base64Data) {
    base64ToBuffer(base64Data, (data, imgWidth, imgHeight) => {
        const widthInBytes = data[0].length;
        const heightInDots = data.length;
        let height = imgHeight + 50;
        const buffer = Buffer.concat([
            Buffer.from(`SIZE ${imgWidth} mm,${height} mm\r\n`),
            Buffer.from('CLS\r\n'),
            Buffer.from(`BITMAP 0,20,${widthInBytes},${heightInDots},0,`),
            Buffer.from(data.flat()),
            Buffer.from('PRINT 1\r\n'),
            Buffer.from('END\r\n')
        ]);
        try {
            escpos2.Print(usbDevicePath, buffer);
            escpos2.Disconnect(usbDevicePath);
        } catch (error) { }
    });
}

/**
 * 发送指令
 * @param {*} usbDevicePath usb设备路径
 * @param {*} commands tspl指令，类型为tspl指令字符串
 */
function ipcTsplCommand(usbDevicePath, commands) {
    const commandBuffer = Buffer.concat([
        Buffer.from(commands),
    ]);
    try {
        escpos2.Print(usbDevicePath, commandBuffer);
        escpos2.Disconnect(usbDevicePath);
    } catch (error) { }
}

module.exports = {
    ipcTsplCommand,
    ipcTsplBitmap
}
