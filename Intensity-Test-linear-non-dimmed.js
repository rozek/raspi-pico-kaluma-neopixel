const {SPI} = require('spi');

function SPIDisplay (Pin, Width, Height) {
  if (Pin    == null) { Pin    = 3; }                  // GP19 will work as well
  if (Width  == null) { Width  = 1; }
  if (Height == null) { Height = 1; }

/**** lookup table with SPI bit sequence for every possible byte ****/

  let SPIBitsForByte = [];
  for (let i = 0; i < 256; i++) {
    let MaskForByte = (
      ((i & 0b00000001) === 0 ? 0b100 : 0b110) << 0*3 |
      ((i & 0b00000010) === 0 ? 0b100 : 0b110) << 1*3 |
      ((i & 0b00000100) === 0 ? 0b100 : 0b110) << 2*3 |
      ((i & 0b00001000) === 0 ? 0b100 : 0b110) << 3*3 |
      ((i & 0b00010000) === 0 ? 0b100 : 0b110) << 4*3 |
      ((i & 0b00100000) === 0 ? 0b100 : 0b110) << 5*3 |
      ((i & 0b01000000) === 0 ? 0b100 : 0b110) << 6*3 |
      ((i & 0b10000000) === 0 ? 0b100 : 0b110) << 7*3
    );
    SPIBitsForByte.push(new Uint8Array([
      (MaskForByte >> 16) & 0xFF, (MaskForByte >> 8) & 0xFF, MaskForByte & 0xFF
    ]));
  }

/**** "Buffer" is the internal buffer for all bits sent through the SPI ****/

  const LineLength = Width*3*3;
  const Buffer     = new Uint8Array(Width*Height*3*3);

/**** clears display buffer ****/

  function clear () {
    const SPIBitsForNull = SPIBitsForByte[0];
    for (let i = 0, l = Width*Height*3; i < l; i++) {
      Buffer.set(SPIBitsForNull,i*3);
    }
  }

/**** setPixelRGB - sets pixel at coordinate (x,y) to the given RGB value ****/

  function setPixelRGB (x,y, R,G,B) {
    let PixelOffset = (
      y % 2 === 0
      ?     y*LineLength + x*3*3
      : (y+1)*LineLength - (x+1)*3*3
    );

    Buffer.set(SPIBitsForByte[G],PixelOffset);
    Buffer.set(SPIBitsForByte[R],PixelOffset + 3);
    Buffer.set(SPIBitsForByte[B],PixelOffset + 6);
  }

/**** setPixelHSL - sets pixel at coordinate (x,y) to the given HSL value ****/
// see https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

  function setPixelHSL (x,y, H,S,L) {
    let PixelOffset = (
      y % 2 === 0
      ?     y*LineLength + x*3*3
      : (y+1)*LineLength - (x+1)*3*3
    );

    let R,G,B;
    if (S === 0) {
      R = G = B = L;
    } else {
      let q = L < 0.5 ? L * (1 + S) : L + S - L * S;
      let p = 2 * L - q;

      R = HueToRGB(p, q, H + 1/3);
      G = HueToRGB(p, q, H);
      B = HueToRGB(p, q, H - 1/3);
    }

    Buffer.set(SPIBitsForByte[Math.round(G * 255)],PixelOffset);
    Buffer.set(SPIBitsForByte[Math.round(R * 255)],PixelOffset + 3);
    Buffer.set(SPIBitsForByte[Math.round(B * 255)],PixelOffset + 6);
  }

  function HueToRGB (p, q, t) {
    if (t < 0) { t += 1; }
    if (t > 1) { t -= 1; }

    if (t < 1/6) { return p + (q - p) * 6 * t; }
    if (t < 1/2) { return q; }
    if (t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
    return p;
  }

/**** HSLtoRGB - converts HSL to RGB values ****/

  function HSLtoRGB (H,S,L) {
    let R,G,B;
    if (S === 0) {
      R = G = B = L;
    } else {
      let q = L < 0.5 ? L * (1 + S) : L + S - L * S;
      let p = 2 * L - q;

      R = HueToRGB(p, q, H + 1/3);
      G = HueToRGB(p, q, H);
      B = HueToRGB(p, q, H - 1/3);
    }

    return [Math.round(R * 255),Math.round(G * 255),Math.round(B * 255)];
  }

/**** show - sends buffer contents to display ****/

  function show () {
    let Display = new SPI(0, {
      mode:     SPI.MODE_1,                                // CPOL = 0, CPHA = 1
      baudrate: 3000000,
      bitorder: SPI.MSB,
      mosi:     Pin
    });
      Display.send(Buffer);
    Display.close();
  }

/**** that's it! ****/

  return { clear, setPixelRGB, setPixelHSL, HSLtoRGB, show };
}


let Display = SPIDisplay(null, 16,16);
  Display.clear();

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      Display.setPixelHSL(x,y, x/16,1,y/16);
    }
  }
Display.show();
