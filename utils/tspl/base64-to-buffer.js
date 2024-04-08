const Jimp = require('jimp')
function base64ToBuffer (imgData, cb) {
    const buffer = Buffer.from(imgData.slice(imgData.indexOf('base64') + 7), 'base64');
    Jimp.read(buffer, (err, img) => {
        if (err) {
            console.error(err);
            return;
        }
        const widthInBytes = Math.ceil(img.getWidth() / 8);
        const data = new Array(img.getHeight());
        for (let y = 0; y < img.getHeight(); y++) {
            const row = new Array(widthInBytes);
            for (let b = 0; b < widthInBytes; b++) {
                let byte = 0;
                let mask = 128;
                for (let x = b * 8; x < (b + 1) * 8; x++) {
                    const color = Jimp.intToRGBA(img.getPixelColor(x, y));
                    // Determine if the pixel is transparent
                    if (color.a < 65) {
                        // Treat as "empty"
                        byte = byte | mask;
                    } else {
                        // Determine if the pixel is white
                        if (color.r > 240 && color.g > 240 && color.b > 240) {
                            // Treat as "empty" or however white should be represented
                            byte = byte | mask;
                        } else {
                            // Else, treat as a black pixel or colored pixel
                            // If the current logic treats non-transparent and non-white as black, no additional code is needed here
                        }
                    }
                    mask = mask >> 1;
                }
                row[b] = byte;
            }
            data[y] = row;
        }
        cb(data, img.getWidth() / 8, img.getHeight() / 8);
    });
}

module.exports = {
    base64ToBuffer
}