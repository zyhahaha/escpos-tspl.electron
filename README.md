# Nodejs-Escpos-Tspl-Print
It currently supports versions of nodejs >= 12.x.x and windows system.

##### 此库打印时进程是阻塞的，所以如果在Electron中使用时为了防止页面卡死，建议打印前在渲染进程开启Lodding，或者使用child_process方法在子进程中打印。
##### 在打印机卡纸、缺纸时也是阻塞的，这时可以给使用者提示相应异常（如：缺纸请放入纸张），使用者解决打印机异常即可继续打印。
##### 当打印机关闭电源时，打印任务会自动结束。

# 简介
支持Escpos/Tspl指令打印的Nodejs打印库，可用于Nodejs、Electron等环境。只支持windows系统。

### Installation
```bash
$ npm install escpos-tspl.nodejs
$ yarn add escpos-tspl.nodejs
```

### Example code （Bitmap）
```typescript
import { queryUsbDevicePathFn, ipcTsplBitmap, ipcEscPosBitmap } from 'escpos-tspl.nodejs'

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

### 指令打印
```typescript
// 代码示例：/example/command.js
import { queryUsbDevicePathFn, ipcTsplCommand, ipcEscPosCommand } from 'escpos-tspl.nodejs'

/**
 * ESC/POS指令打印机
 */
const escposPrinterName = 'XP-80C'
queryUsbDevicePathFn(escposPrinterName, usbDevicePath => {
    if (!usbDevicePath) {
        cosnosole.log('没有找到打印机')
        return
    }
    const commands = [
        0x1B, 0x40, // 初始化打印机  
        0x1B, 0x56, 0x30, // 设置文本大小（这里假设是0，表示默认大小）  
        0x1B, 0x21, 0x30, // 选择标准字符集（美国ASCII）  
        0x1B, 0x61, 0x30, // 设置文本对齐（0表示左对齐）  
        0x68, 0x65, 0x6C, 0x6C, 0x6F, // hello 文本（ASCII编码）  
        0x0A, // LF换行符（在某些打印机上可能需要，但ESC/POS通常使用GS E进行换行）  
        0x1B, 0x45, 0x32  // GS E 2 回车换行（更常用的ESC/POS换行方式）  
    ]
    // 获取到打印机usb设备路径后，调用指令打印方法
    ipcEscPosCommand(usbDevicePath, commands)
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
    const command = `
        ! 0 200 200 210 1\r\n
        TEXT 4 0 30 40 hello\r\n
        PRINT\r\n
    `
    // 获取到打印机usb设备路径后，调用指令打印方法
    ipcTsplCommand(usbDevicePath, command)
})
```

# 提示
##### 推荐使用Bitmap打印，因为Bitmap打印支持的打印机型号更多，指令打印会有很多打印机不支持
##### 并且Bitmap的打印样式更丰富。如果不知道要如何生成base64格式的图片，可以参考这个：https://github.com/zyhahaha/PrintJson2CanvasBase64/blob/master/example/index.html
##### 通过canvans生成base64格式的图片，然后通过canvas.toDataURL('image/png')方法获取到图片的base64编码
##### 或者可以使用html转canvans的第三方库，比如html2canvas，把html转成canvas，然后通过canvas.toDataURL('image/png')方法获取到图片的base64编码
