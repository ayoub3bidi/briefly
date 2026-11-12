import type { Question } from './types'

export const autoQuestions: Question[] = [
  {
    id: 'auto.tools',
    type: 'list',
    label: { en: 'Which tools or systems should be connected? (what goes in, what comes out)', fr: 'Quels outils ou systèmes faut-il connecter ? (quelles données entrent et lesquelles en sortent)', ar: 'ما الأدوات أو الأنظمة التي تريد ربطها؟ (ما الذي يدخل إليها وما الذي يخرج منها)' },
  },
  {
    id: 'auto.trigger',
    type: 'longText',
    label: { en: 'What should start it? (a new order, every morning, someone fills a form...)', fr: 'Qu’est-ce qui doit le déclencher ? (une nouvelle commande, chaque matin, une personne qui remplit un formulaire...)', ar: 'ما الذي ينبغي أن يبدأ تشغيله؟ (طلب جديد، كل صباح، أو عندما يملأ شخص ما نموذجًا...)' },
  },
  {
    id: 'auto.volume',
    type: 'single',
    label: { en: 'Roughly how much happens per day?', fr: 'Environ combien de fois cela se produit-il par jour ?', ar: 'تقريبًا، كم مرة يحدث ذلك في اليوم؟' },
    options: [
      { id: 'few', label: { en: 'A few', fr: 'Quelques fois', ar: 'بضع مرات' } },
      { id: 'dozens', label: { en: 'Dozens', fr: 'Des dizaines de fois', ar: 'عشرات المرات' } },
      { id: 'hundreds-or-more', label: { en: 'Hundreds or more', fr: 'Des centaines de fois ou plus', ar: 'مئات المرات أو أكثر' } },
    ],
  },
  {
    id: 'auto.failure',
    type: 'shortText',
    label: { en: 'If something goes wrong, who should be told, and how?', fr: 'En cas de problème, qui faut-il prévenir et comment ?', ar: 'إذا حدثت مشكلة، فمن ينبغي إبلاغه وكيف؟' },
  },
]
