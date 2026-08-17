import sharp from "sharp"
import fs from "fs"
import path from "path"

const svgSquare = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0d17"/>
      <stop offset="100%" stop-color="#16192b"/>
    </linearGradient>
    <linearGradient id="layer1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="layer2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="512" height="512" rx="110" fill="url(#bgGrad)"/>

  <g transform="translate(106, 106) scale(12.5)" filter="url(#glow)">
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(99,102,241,0.35)" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 12l10 5 10-5" fill="none" stroke="url(#layer2)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 17l10 5 10-5" fill="none" stroke="url(#layer1)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`

const svgCircle = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0d17"/>
      <stop offset="100%" stop-color="#16192b"/>
    </linearGradient>
    <linearGradient id="layer1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="layer2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>

  <circle cx="256" cy="256" r="256" fill="url(#bgGrad)"/>

  <g transform="translate(106, 106) scale(12.5)">
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(99,102,241,0.35)" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 12l10 5 10-5" fill="none" stroke="url(#layer2)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2 17l10 5 10-5" fill="none" stroke="url(#layer1)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`

const densities = [
  { folder: "mipmap-mdpi", size: 48 },
  { folder: "mipmap-hdpi", size: 72 },
  { folder: "mipmap-xhdpi", size: 96 },
  { folder: "mipmap-xxhdpi", size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
]

const baseResDir = path.resolve("android/app/src/main/res")

async function generate() {
  for (const { folder, size } of densities) {
    const dir = path.join(baseResDir, folder)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    await sharp(Buffer.from(svgSquare))
      .resize(size, size)
      .png()
      .toFile(path.join(dir, "ic_launcher.png"))

    await sharp(Buffer.from(svgCircle))
      .resize(size, size)
      .png()
      .toFile(path.join(dir, "ic_launcher_round.png"))

    console.log(`Generated ${folder} (${size}x${size})`)
  }
  console.log("All Android Launcher PNG icons generated successfully!")
}

generate().catch(console.error)
