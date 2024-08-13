const { exec } = require('child_process');

const extractDeviceID = (deviceInfo) => {
    if (!deviceInfo) return null;
    // console.log('deviceInfo', deviceInfo)
    const match = deviceInfo.match(/USB\\VID_[\w&]+\\[\w]+/i);
    return match ? match[0].replace(/\\+/g, '#').toLowerCase() : null;
};

const getPrinter = () => {
    const wmic = require('wmic-js');
    return new Promise((resolve, reject) => {
        wmic()
            .alias('printer')
            .get('Name', 'printerState', 'printerStatus', 'WorkOffline', 'PortName')
            .then((data) => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

const printPortMap = () => {
    return new Promise((resolve, reject) => {
        exec('wmic path Win32_USBControllerDevice get Dependent /format:list', (err, stdout) => {
            if (err) {
                reject(err);
                return;
            }
            const usbList = [];
            const map = {};
            const lines = stdout.split('\r\r\n');
            // console.log('lines', lines)
            lines.forEach((line) => {
                if (line.startsWith('Dependent=')) {
                    const usb = line.replace('Dependent=', '');
                    usbList.push(usb);
                }
            });
            // console.log('usbList', usbList)
            for (let i = 0; i < usbList.length; i++) {
                if (usbList[i].indexOf('USBPRINT') > -1) {
                    const line = usbList[i].replace(/"/g, '');
                    const portName = line.substr(line.length - 6);
                    const usbPath = usbList[i - 1].replace(/&amp;/g, '&');
                    if (portName.indexOf('USB') > -1) {
                        map[portName] = usbPath;
                    }
                }
            }
            resolve(map);
        });
    });
};

async function queryUsbDevicePathFn (printerName, callbackFn) {
    const printList = await getPrinter();
    // const escpos2 = require('node-escpos-win');
    const escpos2 = require('./node-escpos-win.node');

    const portMap = await printPortMap();
    // 这里获取到的usbList里就会有跟portMap中usbPath一样的设备
    const usb = escpos2.GetDeviceList('USB');
    const usbList = usb.list.filter(
        (item) => item.service === 'usbprint' || item.name === 'USB 打印支持'
    );
    printList.forEach(item => {
        if (item.Name === printerName) {
            const usbDevice = usbList.find(usbItem => {
                const deviceID = extractDeviceID(portMap[item.PortName]);
                const simplifiedPath = usbItem.path.replace(/\\+/g, '#').toLowerCase();
                return simplifiedPath.includes(deviceID);
            })
            callbackFn && callbackFn(usbDevice && usbDevice.path)
        }
    })
}

module.exports = {
    queryUsbDevicePathFn
}