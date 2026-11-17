import { describe, expect, it } from 'vitest'
import { isInAppBrowser } from './browser'

describe('browser identification', () => {
  it.each([
    'FBAN/FBIOS',
    'FB_IAB/FB4A',
    'Instagram 320.0',
    'WhatsApp/2.24',
    'TikTok/34.0',
    '; wv)',
  ])('detects in-app browser marker %s', (userAgent) => {
    expect(isInAppBrowser(userAgent)).toBe(true)
  })
})
