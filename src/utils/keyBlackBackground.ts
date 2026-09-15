const BLACK_KEY_THRESHOLD = 28

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image for keying.'))
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous'
    }
    img.src = src
  })
}

/** Knock out near-black studio plates so the cream hero oval shows through. */
export async function keyBlackBackground(
  imageSrc: string,
  threshold = BLACK_KEY_THRESHOLD,
): Promise<string> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth || image.width
  canvas.height = image.naturalHeight || image.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable.')

  ctx.drawImage(image, 0, 0)
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = frame
  for (let i = 0; i < data.length; i += 4) {
    if (
      data[i] <= threshold &&
      data[i + 1] <= threshold &&
      data[i + 2] <= threshold
    ) {
      data[i + 3] = 0
    }
  }
  ctx.putImageData(frame, 0, 0)
  return canvas.toDataURL('image/png')
}
