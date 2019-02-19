/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export const merge = (target, source) => {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return target
}

/**
 * Convert a hex value to an rgba value
 * @param {String} hex - 6 char hex string (#000000)
 * @param {Float} opacity - rgba opacity
 */
export const rgba = (hex, opacity = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) return 'inherit'

  return `rgba(${parseInt(result[1], 16)}, ${parseInt(
    result[2],
    16
  )}, ${parseInt(result[3], 16)}, ${
    isNaN(parseInt(opacity, 10)) ? 1 : opacity
  })`
}

/**
 * Lookup an object property by dot notation
 * @param  {Object} obj - object to perform lookup
 * @param  {String} key - property location
 * @param  {Any} fallback - fallback if not found
 * @return {Any} returns value of lookup if found, otherwise undefined
 */
export const get = (obj, key, fallback) => {
  if (!obj && typeof obj !== 'object') return fallback
  return (
    key
      .split('.')
      .reduce((state, x) => (state && state[x] ? state[x] : null), obj) ||
    fallback
  )
}
