const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = reject
  image.src = src
})

const drawContained = (context, image, x, y, width, height) => {
  const scale = Math.min(width / image.width, height / image.height)
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

const drawCovered = (context, image, x, y, width, height) => {
  const scale = Math.max(width / image.width, height / image.height)
  const sourceWidth = width / scale
  const sourceHeight = height / scale
  const sourceX = (image.width - sourceWidth) / 2
  const sourceY = (image.height - sourceHeight) / 2
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height)
}

const materialColors = {
  bronze: ['#e4b77f', '#8c552f'], silver: ['#eef3ef', '#879795'], enamel: ['#72a99b', '#214f4c'],
  copper: ['#db8b5b', '#813b29'], gold: ['#ffe89b', '#bd8b28'], legend: ['#56666b', '#121d23'],
  'legend-copper': ['#a76850', '#211c22'], 'legend-gold': ['#d8b84d', '#171d29'],
}

const drawMedallion = (context, x, y, radius, material) => {
  const colors = materialColors[material] || materialColors.bronze
  const gradient = context.createRadialGradient(x - radius * .3, y - radius * .3, 1, x, y, radius)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(1, colors[1])
  context.fillStyle = gradient
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
  context.strokeStyle = '#f3df9c'
  context.lineWidth = 1.5
  context.stroke()
}

export async function createCabinShareImage({ background, cabinName, fishDisplays, souvenir, keepsakes, isLodge, decor = [] }) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const context = canvas.getContext('2d')
  const backgroundImage = await loadImage(background)
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)

  for (const { hook, item } of decor) {
    const { x, y, width, height } = hook.bounds
    const left = x * 12
    const top = y * 8
    const drawWidth = width * 12
    const drawHeight = height * 8
    const gradient = context.createLinearGradient(left, top, left + drawWidth, top + drawHeight)
    gradient.addColorStop(0, item.colors?.[0] || '#496d67')
    gradient.addColorStop(1, item.colors?.[1] || '#d5bd79')
    context.save()
    context.globalAlpha = hook.type === 'finish' ? .22 : .92
    context.fillStyle = gradient
    if (hook.type === 'rug') {
      context.beginPath()
      context.ellipse(left + drawWidth / 2, top + drawHeight / 2, drawWidth / 2, drawHeight / 2, 0, 0, Math.PI * 2)
      context.fill()
    } else {
      context.fillRect(left, top, drawWidth, drawHeight)
      if (hook.type === 'frame') {
        context.strokeStyle = item.colors?.[1] || '#d5bd79'
        context.lineWidth = 8
        context.strokeRect(left, top, drawWidth, drawHeight)
      }
    }
    if (item.artwork) {
      const artwork = await loadImage(item.artwork)
      if (hook.type === 'frame' || hook.type === 'rug') context.drawImage(artwork, left, top, drawWidth, drawHeight)
      else drawCovered(context, artwork, left, top, drawWidth, drawHeight)
    }
    context.restore()
  }

  const fishSlots = isLodge
    ? [{ x: 314, y: 118, width: 122, height: 190 }, { x: 518, y: 82, width: 160, height: 228 }, { x: 770, y: 120, width: 110, height: 185 }]
    : [{ x: 540, y: 104, width: 184, height: 164 }]

  await Promise.all(fishDisplays.map(async (display, index) => {
    if (!display?.fish?.image || !fishSlots[index]) return
    const slot = fishSlots[index]
    const fishImage = await loadImage(display.fish.image)
    context.save()
    context.shadowColor = '#130b0777'
    context.shadowBlur = 12
    context.shadowOffsetY = 6
    drawContained(context, fishImage, slot.x, slot.y, slot.width, slot.height)
    context.restore()
    if (display.specimen?.sizeTier === 'trophy') {
      context.strokeStyle = '#dfbd62'
      context.lineWidth = 3
      context.strokeRect(slot.x + 6, slot.y + 6, slot.width - 12, slot.height - 12)
    }
  }))

  if (!isLodge && souvenir) {
    const souvenirImage = await loadImage(souvenir)
    drawContained(context, souvenirImage, 1025, 46, 90, 90)
  }

  if (isLodge) {
    keepsakes.slice(0, 20).forEach((keepsake, index) => {
      const column = index % 4
      const row = Math.floor(index / 4)
      drawMedallion(context, 935 + column * 42, 285 + row * 43, 12, keepsake.material)
    })
  }

  const shade = context.createLinearGradient(0, 590, 0, 800)
  shade.addColorStop(0, '#10201f00')
  shade.addColorStop(.42, '#10201fcf')
  shade.addColorStop(1, '#0d1c1bed')
  context.fillStyle = shade
  context.fillRect(0, 560, 1200, 240)
  context.fillStyle = '#f5c966'
  context.font = '700 20px system-ui, sans-serif'
  context.fillText('MY FISHING RETREAT', 55, 697)
  context.fillStyle = '#ffffff'
  context.font = '700 48px Georgia, serif'
  context.fillText(cabinName, 55, 752)
  context.textAlign = 'right'
  context.font = '700 25px Georgia, serif'
  context.fillText('Fishing Adventure', 1145, 724)
  context.fillStyle = '#d7e1dc'
  context.font = '500 17px system-ui, sans-serif'
  context.fillText(`${fishDisplays.filter((display) => display?.fish).length} preserved displays · ${keepsakes.length} keepsakes`, 1145, 752)

  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create cabin image.')), 'image/png'))
}
