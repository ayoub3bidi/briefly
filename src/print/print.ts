import type { ClientProfile } from '../store/briefly-store'

function localDateStamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function printBrief(profile: ClientProfile) {
  const originalTitle = document.title
  await document.fonts.ready
  document.title = `Specs - ${profile.name.trim() || 'Client'} - ${localDateStamp(new Date())}`
  window.addEventListener(
    'afterprint',
    () => {
      document.title = originalTitle
    },
    { once: true },
  )
  window.print()
}
