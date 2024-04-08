const escpos2 = require('node-escpos-win');
const getPixel = require('get-pixels');

const rgba2hexFn = (data, shape) => {
    const bitArr = [];
    for (let i = 0; i < data.length; i += 4) {
        // 检查透明度，完全透明的像素视为白色（不打印）
        if (data[i + 3] === 0) {
            bitArr.push(0); // 视为白色
            continue;
        }
        // 计算RGB平均值以确定亮度，亮度小于阈值视为黑色（打印），否则视为白色（不打印）
        const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const bit = average < 128 ? 1 : 0; // 阈值设为128
        bitArr.push(bit);
    }

    // 对bitArr做补0的动作以满足每行为8的倍数
    const width = shape[0];
    const height = shape[1];
    const widthInBytes = Math.ceil(width / 8);
    const padding = widthInBytes * 8 - width; // 计算每行需要补充的0数量
    let newBitArr = [];

    for (let i = 0; i < height; i++) {
        const rowStart = i * width;
        const rowEnd = rowStart + width;
        newBitArr.push(...bitArr.slice(rowStart, rowEnd));

        // 行尾补0
        for (let j = 0; j < padding; j++) {
            newBitArr.push(0);
        }
    }

    // 将比特数组转换为字节
    const byteArr = [];
    for (let i = 0; i < newBitArr.length; i += 8) {
        let byte = 0;
        for (let bit = 0; bit < 8; bit++) {
            byte |= (newBitArr[i + bit] << (7 - bit));
        }
        byteArr.push(byte);
    }

    return new Uint8Array(byteArr);
};

function ipcEscPosCommand (usbDevicePath, base64Data) {
    // 假设你的Base64数据是一个PNG图片
    // 移除数据URL前缀（如果存在）
    // console.log('usbDevicePath', usbDevicePath, ipcID)
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");
    // 将Base64字符串转换为Buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');
    getPixel(imageBuffer, "image/png", async (err, pixels) => {
        if (err) {
            console.error("Error loading image:", err);
            return;
        }
        // console.log(`Image dimensions: ${pixels.shape.slice(0, 2).join('x')}`);
        let { data, shape } = pixels;
        const width = shape[0];
        const height = shape[1];
        const segmentHeight = 2000; // 根据需要调整
        const segments = Math.ceil(height / segmentHeight);
        // console.log('segments', segments)
        for (let i = 0; i < segments; i++) {
            const segmentStart = i * segmentHeight * width * 4;
            const segmentEnd = Math.min(segmentStart + segmentHeight * width * 4, data.length);
            const segmentData = data.slice(segmentStart, segmentEnd);
            const imgSegmentData = rgba2hexFn(segmentData, [width, Math.min(segmentHeight, height - i * segmentHeight)]);

            // 计算并发送打印指令和数据
            const ySegmentHeight = Math.min(segmentHeight, height - i * segmentHeight);
            const xL = Math.ceil((width / 8) % 256);
            const xH = Math.floor((width / 8) / 256);
            const yL = ySegmentHeight % 256;
            const yH = Math.floor(ySegmentHeight / 256);
            const buffer = Buffer.from([0x1d, 0x76, 0x30, 0, xL, xH, yL, yH, ...imgSegmentData]);
            try {
                escpos2.Print(usbDevicePath, buffer);
                escpos2.Disconnect(usbDevicePath);
            } catch (error) { }
        }
    });
}

module.exports = {
    ipcEscPosCommand
}