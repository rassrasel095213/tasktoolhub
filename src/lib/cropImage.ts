export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<string> => {
  const image = new Image()
  image.src = imageSrc
  
  await new Promise((resolve) => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return ''
  }

  // setting canvas width & height
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // drawing cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // returning as base64
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob))
      } else {
        resolve('')
      }
    }, 'image/jpeg')
  })
}