const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new Image()
  image.onload = () => resolve(image)
  image.onerror = reject
  image.src = src
})

const roundedRect = (context, x, y, width, height, radius) => {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
  context.closePath()
}

export async function createCatchShareImage(catchItem, fish, location, phaseLabel) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const context = canvas.getContext('2d')

  const backdrop = context.createLinearGradient(0, 0, 1200, 630)
  backdrop.addColorStop(0, '#153f3e')
  backdrop.addColorStop(1, '#315f55')
  context.fillStyle = backdrop
  context.fillRect(0, 0, 1200, 630)

  context.fillStyle = '#f5c966'
  context.beginPath()
  context.arc(1020, 90, 150, 0, Math.PI * 2)
  context.globalAlpha = 0.18
  context.fill()
  context.globalAlpha = 1

  roundedRect(context, 70, 62, 1060, 506, 38)
  context.fillStyle = '#fbf9f1'
  context.fill()

  const cardGradient = context.createLinearGradient(90, 112, 1110, 525)
  cardGradient.addColorStop(0, '#fff5d6')
  cardGradient.addColorStop(1, '#ead18b')
  roundedRect(context, 100, 118, 1000, 390, 30)
  context.fillStyle = cardGradient
  context.fill()
  context.strokeStyle = '#d4ad4d'
  context.lineWidth = 4
  context.stroke()

  context.fillStyle = '#49645d'
  context.font = '700 23px system-ui, sans-serif'
  context.letterSpacing = '3px'
  context.fillText('AMAZING CATCH', 140, 102)

  if (fish.image) {
    const fishImage = await loadImage(fish.image)
    const maxWidth = 475
    const maxHeight = 255
    const scale = Math.min(maxWidth / fishImage.width, maxHeight / fishImage.height)
    const width = fishImage.width * scale
    const height = fishImage.height * scale
    context.save()
    context.shadowColor = '#17373655'
    context.shadowBlur = 18
    context.shadowOffsetY = 10
    context.drawImage(fishImage, 150 + (430 - width) / 2, 185 + (230 - height) / 2, width, height)
    context.restore()
  }

  context.fillStyle = '#173736'
  context.font = '700 55px Georgia, serif'
  context.fillText(catchItem.name, 610, 225, 430)
  context.fillStyle = '#856019'
  context.font = '700 22px system-ui, sans-serif'
  context.fillText(`${catchItem.rarity.toUpperCase()} · ${catchItem.value} COINS`, 612, 268)
  context.fillStyle = '#173736'
  context.font = '700 68px system-ui, sans-serif'
  context.fillText(`${catchItem.weight} lb`, 608, 360)
  context.fillStyle = '#54706b'
  context.font = '500 25px system-ui, sans-serif'
  context.fillText(`${location.name} · ${phaseLabel}`, 612, 410)
  if (catchItem.isPersonalBest) {
    roundedRect(context, 610, 435, 210, 42, 21)
    context.fillStyle = '#245c45'
    context.fill()
    context.fillStyle = '#ffffff'
    context.font = '700 19px system-ui, sans-serif'
    context.fillText('PERSONAL BEST', 635, 463)
  }

  context.fillStyle = '#173736'
  context.font = '700 26px Georgia, serif'
  context.fillText('Fishing Adventure', 140, 548)
  context.fillStyle = '#61736e'
  context.font = '500 18px system-ui, sans-serif'
  context.fillText('A quiet story from the water', 850, 546)

  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create catch image.')), 'image/png'))
}
