# Device verification checklist

Recorded 12 November 2026. Browser checks below use desktop Chrome with mobile viewport and user-agent emulation. They do not replace testing on physical phones.

## Verified in browser

- [x] Arabic mobile viewport: RTL question flow and feature editor render with localized labels and priority controls.
- [x] Mixed Arabic and Latin text: Arabic product text and an English URL remain in the print document.
- [x] Language switch mid-form: typed text, selected priority, and feature order remain saved after changing Arabic to English.
- [x] Empty answers: Review marks all 15 questions blank, Finish opens the Done screen, and the print document lists all 15 open questions.
- [x] iOS Safari user-agent: the Share → Print → pinch out → Share → Save to Files tip appears; Copy as text remains available.
- [x] Facebook in-app user-agent: the open-in-browser banner appears.
- [x] Share links: email subject/body, PDF attachment reminder, and WhatsApp `wa.me` message use the configured contact settings.
- [x] Private-storage fallback: a storage-denied runtime check verified in-memory draft behavior and the storage warning.
- [x] Print document content: Arabic and French headings, English context lines, open-question flags, and selectable DOM text are present.

## Physical-device checks still required

- [ ] Complete the Arabic flow on a real iPhone or Android phone, including the feature editor with the keyboard open.
- [ ] Save PDFs from iOS Safari and Android Chrome; inspect selectable text, RTL clipping, and page breaks in English, French, and Arabic.
- [ ] On iOS Safari, verify the print-to-Files steps and confirm progress resumes after closing and reopening the tab.
- [ ] On Android Chrome, verify print-to-PDF, the mail app handoff, and WhatsApp handoff.
- [ ] Open the live link from WhatsApp and Facebook on a phone and confirm the banner and external-browser handoff behave as expected.
- [ ] Test actual private/incognito browsing on iOS and Android.
- [ ] Theme: light, dark, and System (follows OS) render correctly on iOS Safari and Android; the toggle choice survives a reload with no flash; the header logo mirrors in Arabic (RTL).
