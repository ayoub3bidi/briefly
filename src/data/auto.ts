import type { Question } from './types'

export const autoQuestions: Question[] = [
  {
    id: 'auto.tools',
    type: 'list',
    label: { en: 'Which tools or systems should be connected? (what goes in, what comes out)', fr: 'Quels outils ou systèmes faut-il connecter ? (quelles données entrent et lesquelles en sortent)', ar: 'ما الأدوات أو الأنظمة التي تريد ربطها؟ (ما الذي يدخل إليها وما الذي يخرج منها)' },
    help: { en: 'List the tools that should exchange information and what data should move between them.', fr: 'Indiquez les outils à relier et les données qui doivent circuler entre eux.', ar: 'اذكر الأدوات التي تريد ربطها والبيانات التي ينبغي أن تنتقل بينها.' },
    example: { en: 'When an order arrives in my shop system, add the customer and order to a spreadsheet.', fr: 'À chaque nouvelle commande dans mon système, ajouter le client et la commande à un tableur.', ar: 'عند وصول طلب إلى نظام المتجر، أضف بيانات العميل والطلب إلى جدول بيانات.' },
  },
  {
    id: 'auto.trigger',
    type: 'longText',
    label: { en: 'What should start it? (a new order, every morning, someone fills a form...)', fr: 'Qu’est-ce qui doit le déclencher ? (une nouvelle commande, chaque matin, une personne qui remplit un formulaire...)', ar: 'ما الذي ينبغي أن يبدأ تشغيله؟ (طلب جديد، كل صباح، أو عندما يملأ شخص ما نموذجًا...)' },
    help: { en: 'Describe the event or time that should start the automatic steps.', fr: 'Décrivez l’événement ou l’heure qui doit déclencher les étapes automatiques.', ar: 'اشرح الحدث أو الوقت الذي ينبغي أن يبدأ الخطوات التلقائية.' },
    example: { en: 'Whenever a customer submits the booking form.', fr: 'Chaque fois qu’un client envoie le formulaire de réservation.', ar: 'كلما أرسل عميل نموذج الحجز.' },
  },
  {
    id: 'auto.volume',
    type: 'single',
    label: { en: 'Roughly how much happens per day?', fr: 'Environ combien de fois cela se produit-il par jour ?', ar: 'تقريبًا، كم مرة يحدث ذلك في اليوم؟' },
    help: { en: 'Estimate how many times the process runs on a typical day.', fr: 'Estimez le nombre d’exécutions du processus lors d’une journée habituelle.', ar: 'قدّر عدد مرات تنفيذ العملية في يوم عادي.' },
    example: { en: 'Usually around 20 orders each day.', fr: 'Environ 20 commandes par jour en temps normal.', ar: 'عادةً نحو 20 طلبًا يوميًا.' },
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
    help: { en: 'Say who should know when an automatic step fails and how to reach them.', fr: 'Indiquez qui prévenir en cas d’échec et comment le contacter.', ar: 'اذكر من ينبغي إبلاغه عند فشل خطوة تلقائية وكيفية التواصل معه.' },
    example: { en: 'Email me if an order cannot be added to the delivery system.', fr: 'M’envoyer un e-mail si une commande ne peut pas être ajoutée au système de livraison.', ar: 'أرسل إليّ بريدًا إلكترونيًا إذا تعذرت إضافة طلب إلى نظام التوصيل.' },
  },
]
