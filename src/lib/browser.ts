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

export function isIOSSafari(userAgent: string): boolean {
  const ios =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && /Mobile\//i.test(userAgent))
  const safari =
    /Safari/i.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(userAgent)
  return ios && safari && !isInAppBrowser(userAgent)
}
