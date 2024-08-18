const pako = require('pako')
const fs = require('fs')
const sharp = require('sharp')
const width=354
const height=234;
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
(async function() {
    // Extract raw, unsigned 8-bit RGB pixel data from JPEG input
    let data = await sharp('image.png')
    .resize(width,height)
    .removeAlpha()
    .raw()
    .toBuffer()
    let index = 0;
    let rgb_values = [];
    while(index < data.length){
        let point = {
            red : data[index],
            green : data[index + 1],
            blue : data[index + 2],
        };

        rgb_values.push(
            {
                red : point.red,
                green : point.green,
                blue : point.blue
            }
        );

        index = index +3;
    }
    let x = 0
    let y = 0
    let json = []
    let pixels = 0
    for (let pixel of rgb_values) {
        json.push({
            type:"start",
            x,y,
            color:rgbToHex(pixel.red,pixel.green,pixel.blue),
            size:2
        })
        pixels++
        x++
        if (x==width) {
            x = 0
            y++
        }
    }
    console.log(`drew ${pixels} pixels`)
    const buf = Buffer.from(JSON.stringify(json),'utf8')
    const b64 = Buffer.from(pako.deflate(buf)).toString('base64')
    fs.writeFileSync('output.txt',encodeURIComponent(b64))
})();