import type { Question } from './types'

export const mobileQuestions: Question[] = [
  {
    id: 'mob.platform',
    type: 'single',
    label: { en: 'iPhone, Android, or both?', fr: 'iPhone, Android ou les deux ?', ar: 'آيفون أم أندرويد أم كلاهما؟' },
    options: [
      { id: 'iphone', label: { en: 'iPhone', fr: 'iPhone', ar: 'آيفون' } },
      { id: 'android', label: { en: 'Android', fr: 'Android', ar: 'أندرويد' } },
      { id: 'both', label: { en: 'Both', fr: 'Les deux', ar: 'كلاهما' } },
    ],
  },
  {
    id: 'mob.offline',
    type: 'single',
    label: { en: 'Does it need to work without internet?', fr: 'Doit-il fonctionner sans connexion Internet ?', ar: 'هل يجب أن يعمل من دون اتصال بالإنترنت؟' },
    options: [
      { id: 'yes', label: { en: 'Yes', fr: 'Oui', ar: 'نعم' } },
      { id: 'no', label: { en: 'No', fr: 'Non', ar: 'لا' } },
    ],
  },
  {
    id: 'mob.alerts',
    type: 'single',
    label: { en: "Should it send alerts or reminders to people's phones?", fr: 'Doit-il envoyer des alertes ou des rappels sur les téléphones ?', ar: 'هل ينبغي أن يرسل تنبيهات أو تذكيرات إلى هواتف المستخدمين؟' },
    options: [
      { id: 'yes', label: { en: 'Yes', fr: 'Oui', ar: 'نعم' } },
      { id: 'no', label: { en: 'No', fr: 'Non', ar: 'لا' } },
    ],
  },
  {
    id: 'mob.stores',
    type: 'single',
    label: { en: 'Do you already have App Store and Google Play accounts for your business?', fr: 'Votre entreprise a-t-elle déjà des comptes App Store et Google Play ?', ar: 'هل لدى شركتك حسابان على App Store وGoogle Play؟' },
    options: [
      { id: 'both', label: { en: 'Both', fr: 'Les deux', ar: 'كلاهما' } },
      { id: 'one', label: { en: 'One of them', fr: 'Un seul des deux', ar: 'أحدهما فقط' } },
      { id: 'none', label: { en: 'Neither', fr: 'Aucun des deux', ar: 'لا هذا ولا ذاك' } },
    ],
  },
]
