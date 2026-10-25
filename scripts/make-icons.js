import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function generatePng(size, isMaskable = false) {
  const width = size;
  const height = size;

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Scanlines: width * 4 bytes + 1 filter byte per line
  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const maxR = width / 2;

  for (let y = 0; y < height; y++) {
    rawData.writeUInt8(0, offset++); // filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Warm Amber-Orange gradient
      const t = y / height;
      let r = Math.floor(245 * (1 - t) + 194 * t);
      let g = Math.floor(158 * (1 - t) + 65 * t);
      let b = Math.floor(11 * (1 - t) + 12 * t);
      let a = 255;

      // Golden center halo
      if (dist < maxR * 0.7) {
        const halo = 1 - dist / (maxR * 0.7);
        r = Math.min(255, Math.floor(r + 40 * halo));
        g = Math.min(255, Math.floor(g + 50 * halo));
      }

      // Rounded corners for non-maskable icons
      if (!isMaskable) {
        const cornerRadius = width * 0.22;
        const cornerX = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
        const cornerY = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
        if (cornerX > 0 && cornerY > 0) {
          const cornerDist = Math.sqrt(cornerX * cornerX + cornerY * cornerY);
          if (cornerDist > cornerRadius) {
            a = 0; // Transparent outside rounded squircle
          }
        }
      }

      rawData.writeUInt8(r, offset++);
      rawData.writeUInt8(g, offset++);
      rawData.writeUInt8(b, offset++);
      rawData.writeUInt8(a, offset++);
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', generatePng(192, false));
fs.writeFileSync('public/pwa-512x512.png', generatePng(512, false));
fs.writeFileSync('public/apple-touch-icon.png', generatePng(180, false));
fs.writeFileSync('public/pwa-maskable-512x512.png', generatePng(512, true));
console.log('Successfully generated all PWA PNG icons!');
