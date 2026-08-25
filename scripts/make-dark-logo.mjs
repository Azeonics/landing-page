// Generates dark-mode (reversed) variants of the brand PNGs.
// Navy letterforms / satellite / tagline -> ice white; teal planet + orbit gradient preserved.
//
// Palette facts (sampled from the source PNGs):
//   - navy letterforms:  rgb(3, 29, 74)
//   - teal planet:       rgb(0, 167..184, 201..217)
//   - orbit swoosh:      a continuous navy->teal gradient (r stays 0..3,
//                        g sweeps ~29 -> ~184, b tracks g + ~35..45)
// A binary navy/teal split leaves a hard seam mid-gradient, so we blend:
// pixels at/below NAVY_G go fully ice, pixels at/above TEAL_G are preserved
// exactly, and the gradient zone smoothsteps between the two.
//
// Usage: node scripts/make-dark-logo.mjs
import sharp from 'sharp';

const ICE = { r: 234, g: 242, b: 255 };
const NAVY_G = 60; // g at/below this -> fully ice white
const TEAL_G = 120; // g at/above this -> preserved exactly

function smoothstep(edge0, edge1, x) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function iceFor(r, g, b) {
  // Map navy toward ice white; darker source pixels land closer to full ice,
  // which keeps anti-aliased edge gradation intact.
  const t = 1 - (Math.max(r, g, b) / 255) * 0.2;
  return [
    Math.round(ICE.r * t + r * (1 - t)),
    Math.round(ICE.g * t + g * (1 - t)),
    Math.round(ICE.b * t + b * (1 - t)),
  ];
}

async function reverse(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a === 0) continue;
    // Only touch blue-dominant brand pixels (navy + the navy->teal gradient).
    if (b <= r || r >= 150) continue;
    // 0 = navy end (goes ice), 1 = teal end (preserved exactly).
    const s = smoothstep(NAVY_G, TEAL_G, g);
    if (s >= 1) continue;
    const [ir, ig, ib] = iceFor(r, g, b);
    data[i] = Math.round(ir * (1 - s) + r * s);
    data[i + 1] = Math.round(ig * (1 - s) + g * s);
    data[i + 2] = Math.round(ib * (1 - s) + b * s);
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);
  console.log('wrote', output);
}

try {
  await reverse(
    'public/assets/azeonics-wordmark.png',
    'public/assets/azeonics-wordmark-dark.png'
  );
  await reverse(
    'public/assets/azeonics-logo.png',
    'public/assets/azeonics-logo-dark.png'
  );
} catch (err) {
  console.error('make-dark-logo failed:', err.message);
  process.exit(1);
}
