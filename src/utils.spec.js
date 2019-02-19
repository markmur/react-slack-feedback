import { get, rgba } from './utils'

describe('utils', () => {
  describe('rgba', () => {
    it('should return the correct value', () => {
      expect(rgba('#ffffff')).toEqual('rgba(255, 255, 255, 1)')
    })

    it('should return the correct opacity', () => {
      expect(rgba('#000000', 0.4)).toEqual('rgba(0, 0, 0, 0.4)')
    })

    it('should default the opacity to 1 if isNaN', () => {
      expect(rgba('#000000', 'invalid')).toEqual('rgba(0, 0, 0, 1)')
    })

    it('should return inherit if no result', () => {
      expect(rgba('invalid')).toEqual('inherit')
    })
  })

  describe('get', () => {
    it('should get nest value', () => {
      const obj = { a: { b: { c: 3 } } }
      expect(get(obj, 'a.b.c')).toEqual(3)
    })

    it('should return fallback', () => {
      const obj = { a: { b: { c: 3 } } }
      expect(get(obj, 'a.b.c.d.e.f', 1)).toEqual(1)
    })

    it('should return undefined if not found', () => {
      const obj = { a: true }
      expect(get(obj, 'a.b.c.d')).toBeUndefined()
    })

    it('should undefined if no obj', () => {
      expect(get()).toBeUndefined()
    })

    it('should return the fallback if no obj', () => {
      expect(get(undefined, 'a.b.c.d', 1)).toEqual(1)
    })
  })
})
