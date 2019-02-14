export const rgba = (hex, opacity = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(
    result[2],
    16
  )}, ${parseInt(result[3], 16)}, ${opacity})`
}

/**
 * Lookup an object property by dot notation
 * @param  {Object} obj - object to perform lookup
 * @param  {String} key - property location
 * @param  {Any} fallback - fallback if not found
 * @return {Any} returns value of lookup if found, otherwise undefined
 */
export const get = (obj, key, fallback) =>
  key
    .split('.')
    .reduce((state, x) => (state && state[x] ? state[x] : null), obj) ||
  fallback
