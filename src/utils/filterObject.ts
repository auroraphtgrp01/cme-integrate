export const filterObject = (obj: any, keysToRemove: string[]) => {
  if (Array.isArray(obj)) {
    obj.forEach((item) => filterObject(item, keysToRemove))
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (keysToRemove.includes(key)) {
        delete obj[key]
      } else {
        filterObject(obj[key], keysToRemove)
      }
    }
  }
  return obj
}
