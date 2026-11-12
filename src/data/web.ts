import type { Question } from './types'

export const webQuestions: Question[] = [
  {
    id: 'web.domain',
    type: 'single',
    label: { en: 'Do you already have a website or a domain name?', fr: 'Avez-vous déjà un site web ou un nom de domaine ?', ar: 'هل لديك بالفعل موقع إلكتروني أو اسم نطاق؟' },
    help: { en: 'A domain name is the address people type to find a website.' },
    example: { en: 'I already own myshop.tn, but I do not have a website yet.' },
    allowNote: true,
    options: [
      { id: 'website', label: { en: 'A website', fr: 'Un site web', ar: 'موقع إلكتروني' } },
      { id: 'domain-only', label: { en: 'A domain name only', fr: 'Un nom de domaine uniquement', ar: 'اسم نطاق فقط' } },
      { id: 'neither', label: { en: 'Neither', fr: 'Ni l’un ni l’autre', ar: 'لا هذا ولا ذاك' } },
    ],
  },
  {
    id: 'web.device',
    type: 'single',
    label: { en: 'Will people mostly use it on their phone, on a computer, or both?', fr: 'Les utilisateurs s’en serviront-ils surtout sur téléphone, sur ordinateur ou sur les deux ?', ar: 'هل سيستخدمه الناس غالبًا على الهاتف أم الحاسوب أم كليهما؟' },
    help: { en: 'Think about where your customers or team will usually be when they use it.' },
    example: { en: 'Mostly on phones, while customers are out.' },
    options: [
      { id: 'phone', label: { en: 'Phone', fr: 'Téléphone', ar: 'الهاتف' } },
      { id: 'computer', label: { en: 'Computer', fr: 'Ordinateur', ar: 'الحاسوب' } },
      { id: 'both', label: { en: 'Both', fr: 'Les deux', ar: 'كلاهما' } },
    ],
  },
  {
    id: 'web.brand',
    type: 'single',
    label: { en: 'Do you have your logo, colors, texts and photos ready?', fr: 'Votre logo, vos couleurs, vos textes et vos photos sont-ils prêts ?', ar: 'هل شعارك وألوانك ونصوصك وصورك جاهزة؟' },
    help: { en: 'Choose the answer that best describes what you can provide now.' },
    example: { en: 'I have a logo and colors, but I still need photos.' },
    options: [
      { id: 'all', label: { en: 'All of them', fr: 'Tout est prêt', ar: 'كلها جاهزة' } },
      { id: 'some', label: { en: 'Some of them', fr: 'Certains éléments sont prêts', ar: 'بعضها جاهز' } },
      { id: 'none', label: { en: 'None yet', fr: 'Rien pour le moment', ar: 'لا شيء منها حتى الآن' } },
    ],
  },
  {
    id: 'web.updates',
    type: 'single',
    label: { en: 'Who will update the content after launch?', fr: 'Qui mettra le contenu à jour après le lancement ?', ar: 'من سيحدّث المحتوى بعد الإطلاق؟' },
    help: { en: 'Think about who will change things like prices, opening hours, or news.' },
    example: { en: 'I will update prices and opening hours myself.' },
    options: [
      { id: 'client', label: { en: 'Me', fr: 'Moi', ar: 'أنا' } },
      { id: 'developer', label: { en: 'You', fr: 'Vous', ar: 'أنت' } },
      { id: 'never', label: { en: "Nobody: it doesn't change", fr: 'Personne : le contenu ne change pas', ar: 'لا أحد، فالمحتوى لا يتغيّر' } },
    ],
  },
]
