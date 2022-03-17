export default function imageChecker({filename, url}) {
  if (filename.includes('.tif')) {
    return url
  }
  if (filename.includes('.tiff')) {
    return url
  }
  if (filename.includes('.bmp')) {
    return url
  }
  if (filename.includes('.jpg')) {
    return url
  }
  if (filename.includes('.jpeg')) {
    return url
  }
  if (filename.includes('.gif')) {
    return url
  }
  if (filename.includes('.png')) {
    return url
  }
  return "ef3-placeholder-image.jpg"
}