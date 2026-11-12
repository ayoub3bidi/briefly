import { describe, expect, it } from 'vitest'
import { isIOSSafari, isInAppBrowser } from './browser'

describe('browser identification', () => {
  it.each([
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 Mobile/15E148',
  ])('recognizes iOS Safari user agents', (userAgent) => {
    expect(isIOSSafari(userAgent)).toBe(true)
  })

  it.each([
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Instagram 320.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 WhatsApp/24.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36',
  ])('does not misidentify unsupported or in-app browsers', (userAgent) => {
    expect(isIOSSafari(userAgent)).toBe(false)
  })

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
