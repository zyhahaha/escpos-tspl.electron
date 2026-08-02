# Nodejs-Escpos-Tspl-Print

Biblioteca de impresión para Node.js que soporta comandos Escpos/Tspl, puede usarse en Node.js, Electron, etc. Solo soporta sistemas Windows.

### Instalación
```bash
$ npm install escpos-tspl.nodejs
$ yarn add escpos-tspl.nodejs
```

### Código de ejemplo (Bitmap)
```typescript
import { queryUsbDevicePathFn, ipcTsplBitmap, ipcEscPosBitmap } from 'escpos-tspl.nodejs'

const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAF1JREFUKFNjZCASMDIwMIAwJwMDw3eoHhj7P7IZIEUgEMDAwHAPyhZkYGA4iG4RTCHIlCwGBoaXDAwMKxgYGP7gUggSN4RafwObs2EmguQMoApvElKI1//IJtJZIQDzWQwLlBenDAAAAABJRU5ErkJggg=='

/**
 * Impresora de comandos ESC/POS
 */
const escposPrinterName = 'XP-80C'
queryUsbDevicePathFn(escposPrinterName, usbDevicePath => {
    if (!usbDevicePath) {
        cosnosole.log('没有找到打印机')
        return
    }
    // Después de obtener la ruta del dispositivo USB de la impresora, llame al método ipcEscPosBitmap
    ipcEscPosBitmap(usbDevicePath, base64Data)
})

/**
 * Impresora de comandos TSPL
 */
const tsplPrinterName = 'HPRT N41'
queryUsbDevicePathFn(tsplPrinterName, usbDevicePath => {
    if (!usbDevicePath) {
        cosnosole.log('没有找到打印机')
        return
    }
    // Después de obtener la ruta del dispositivo USB de la impresora, llame al método ipcTsplBitmap
    ipcTsplBitmap(usbDevicePath, base64Data)
})
```

### Impresión con comandos
```typescript
// Ejemplo de código: /example/command.js
import { queryUsbDevicePathFn, ipcTsplCommand, ipcEscPosCommand } from 'escpos-tspl.nodejs'

/**
 * Impresora de comandos ESC/POS
 */
const escposPrinterName = 'XP-80C'
queryUsbDevicePathFn(escposPrinterName, usbDevicePath => {
    if (!usbDevicePath) {
        cosnosole.log('没有找到打印机')
        return
    }
    const commands = [
        0x1B, 0x40, // Inicializar la impresora  
        0x1B, 0x56, 0x30, // Establecer el tamaño del texto (aquí se supone que es 0, tamaño predeterminado)  
        0x1B, 0x21, 0x30, // Seleccionar el conjunto de caracteres estándar (ASCII estadounidense)  
        0x1B, 0x61, 0x30, // Establecer la alineación del texto (0 indica alineación a la izquierda)  
        0x68, 0x65, 0x6C, 0x6C, 0x6F, // Texto "hello" (codificación ASCII)  
        0x0A, // Carácter de salto de línea LF (en algunas impresoras podría ser necesario, pero ESC/POS normalmente usa GS E para saltos de línea)  
        0x1B, 0x45, 0x32  // GS E 2 Salto de línea (método más común de salto de línea en ESC/POS)  
    ]
    // Después de obtener la ruta del dispositivo USB de la impresora, llame al método de impresión con comandos
    ipcEscPosCommand(usbDevicePath, commands)
})

/**
 * Impresora de comandos TSPL
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
    // Después de obtener la ruta del dispositivo USB de la impresora, llame al método de impresión con comandos
    ipcTsplCommand(usbDevicePath, command)
})
```

### Consejos
##### Se recomienda usar impresión Bitmap, ya que admite más modelos de impresoras y la impresión con comandos tiene muchas impresoras que no son compatibles
##### Además, los estilos de impresión Bitmap son más ricos. Si no sabe cómo generar imágenes en formato base64, puede consultar este enlace: https://github.com/zyhahaha/PrintJson2CanvasBase64/blob/master/example/index.html
##### Generar imágenes en formato base64 mediante canvas, y luego obtener la codificación base64 de la imagen mediante el método canvas.toDataURL('image/png')
##### O también puede usar bibliotecas de terceros para convertir HTML a canvas, como html2canvas, convirta HTML a canvas, y luego obtenga la codificación base64 de la imagen mediante el método canvas.toDataURL('image/png')

### Sobre estados de excepción

##### Este biblioteca imprime de forma bloqueante el proceso, por lo que si se usa en Electron, se recomienda mostrar un estado de carga (Loading) en el proceso de renderizado antes de imprimir, o usar métodos de child_process para imprimir en un proceso secundario.
##### Cuando la impresora tiene papel atascado o falta de papel, también es bloqueante. En este caso, puede informar al usuario de la excepción correspondiente (por ejemplo: "Falta de papel, por favor coloque papel"), y el usuario puede resolver el problema de la impresora para continuar imprimiendo.
##### Cuando la impresora se apaga, la tarea de impresión se finalizará automáticamente.
