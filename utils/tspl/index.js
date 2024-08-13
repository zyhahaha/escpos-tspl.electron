// const escpos2 = require('node-escpos-win');
const escpos2 = require('../node-escpos-win.node');
const { base64ToBuffer } = require('./base64-to-buffer.js');

function ipcTsplCommand (usbDevicePath, base64Data) {
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

module.exports = {
    ipcTsplCommand
}
