const inAppBrowserPatterns = [
  /FBAN|FBAV|FB_IAB/i,
  /Instagram/i,
  /Line\//i,
  /Twitter/i,
  /TikTok/i,
  /Snapchat/i,
  /LinkedInApp/i,
  /WhatsApp/i,
  /; wv\)/i,
]

export function isInAppBrowser(userAgent: string): boolean {
  return inAppBrowserPatterns.some((pattern) => pattern.test(userAgent))
}
