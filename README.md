# Nodejs-Escpos-Tspl-Print
It currently supports versions of nodejs >= 12.x.x and windows system.

# 简介
支持Escpos/Tspl指令打印的Nodejs打印库，可用于Nodejs、Electron等环境。
只支持windows系统。

### Installation
```bash
$ npm install escpos-tspl.nodejs
$ yarn add escpos-tspl.nodejs
```

### Example code
```typescript
import { queryUsbDevicePathFn, ipcTsplBitmap, ipcEscPosBitmap } from '../index.js'

const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAF1JREFUKFNjZCASMDIwMIAwJwMDw3eoHhj7P7IZIEUgEMDAwHAPyhZkYGA4iG4RTCHIlCwGBoaXDAwMKxgYGP7gUggSN4RafwObs2EmguQMoApvElKI1//IJtJZIQDzWQwLlBenDAAAAABJRU5ErkJggg=='


/**
 * ESC/POS指令打印机
 */
const escposPrinterName = 'XP-80C'
queryUsbDevicePathFn(escposPrinterName, usbDevicePath => {
    if (!usbDevicePath) {
        cosnosole.log('没有找到打印机')
        return
    }
    // 获取到打印机usb设备路径后，调用ipcEscPosBitmap方法
    ipcEscPosBitmap(usbDevicePath, base64Data)
})

/**
 * TSPL指令打印机
 */
const tsplPrinterName = 'HPRT N41'
queryUsbDevicePathFn(tsplPrinterName, usbDevicePath => {
    if (!usbDevicePath) {
        cosnosole.log('没有找到打印机')
        return
    }
    // 获取到打印机usb设备路径后，调用ipcTsplBitmap方法
    ipcTsplBitmap(usbDevicePath, base64Data)
})
```
