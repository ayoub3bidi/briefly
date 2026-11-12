import type { Question } from './types'

export const coreQuestions: Question[] = [
  {
    id: 'problem',
    type: 'longText',
    label: {
      en: 'What problem are you trying to solve, and how do you deal with it today?',
      fr: "Quel problème cherchez-vous à résoudre et comment le gérez-vous aujourd'hui ?",
      ar: 'ما المشكلة التي تريد حلّها، وكيف تتعامل معها اليوم؟',
    },
    help: { en: 'Describe the problem in your own words and what you do about it today.' },
    example: { en: 'I take appointment requests by phone and write them in a notebook.' },
  },
  {
    id: 'roles',
    type: 'list',
    label: {
      en: 'Who will use this? (e.g. customers, my staff, me as admin)',
      fr: 'Qui utilisera cet outil ? (par exemple, vos clients, votre équipe ou vous comme administrateur)',
      ar: 'من سيستخدم هذا؟ (مثلًا: العملاء، فريق العمل، أو أنت بصفتك مديرًا)',
    },
    help: { en: 'List the people or groups who will use it. You can add a short note for each.' },
    example: { en: 'Customers: place orders. Staff: prepare them. Me: manage products.' },
  },
  {
    id: 'walkthrough',
    type: 'longText',
    label: {
      en: 'Walk me through one typical use, from start to finish.',
      fr: "Décrivez-moi une utilisation typique, du début jusqu'à la fin.",
      ar: 'صِف لي طريقة استخدامه في حالة عادية، من البداية إلى النهاية.',
    },
    help: { en: 'Think of one real situation. What happens first, next, and last?' },
    example: { en: 'A customer chooses a meal, pays online, and gets a message when it is ready.' },
  },
  {
    id: 'features',
    type: 'features',
    label: {
      en: 'What should it be able to do?',
      fr: 'Que devrait-il pouvoir faire ?',
      ar: 'ما الأمور التي ينبغي أن يكون قادرًا على فعلها؟',
    },
    help: { en: 'Add useful actions one at a time. You can decide later which matter most.' },
    example: { en: 'Track orders: see each order and whether it has been prepared.' },
  },
  {
    id: 'inspiration',
    type: 'links',
    label: {
      en: 'Any apps or websites you like or want to be similar to?',
      fr: 'Y a-t-il des applications ou des sites qui vous plaisent ou dont vous aimeriez vous inspirer ?',
      ar: 'هل هناك تطبيقات أو مواقع تعجبك أو تريد أن يكون مشروعك مشابهًا لها؟',
    },
    help: { en: 'Share links if you have them. Say what you like about each one.' },
    example: {
      en: 'I like the clear product pages on example.com because prices are easy to find.',
    },
  },
  {
    id: 'services',
    type: 'multi',
    label: {
      en: 'Will it need any of these?',
      fr: 'Aurez-vous besoin de certains de ces éléments ?',
      ar: 'هل سيحتاج إلى أيّ من هذه الخدمات؟',
    },
    help: { en: 'Choose services you know you will need. It is okay if you are not sure yet.' },
    example: { en: 'Payments and WhatsApp updates.' },
    allowNote: true,
    options: [
      { id: 'payments', label: { en: 'Payments', fr: 'Paiements', ar: 'الدفع' } },
      { id: 'emails', label: { en: 'Emails', fr: 'E-mails', ar: 'رسائل البريد الإلكتروني' } },
      {
        id: 'messages',
        label: {
          en: 'Texts or WhatsApp messages',
          fr: 'SMS ou messages WhatsApp',
          ar: 'رسائل نصية أو رسائل واتساب',
        },
      },
      {
        id: 'login',
        label: { en: 'User login', fr: 'Connexion des utilisateurs', ar: 'تسجيل دخول المستخدمين' },
      },
      { id: 'maps', label: { en: 'Maps', fr: 'Cartes', ar: 'الخرائط' } },
      { id: 'other', label: { en: 'Other', fr: 'Autre', ar: 'غير ذلك' } },
    ],
  },
  {
    id: 'languages',
    type: 'multi',
    label: {
      en: 'Which languages will the people using it need?',
      fr: 'Quelles langues les utilisateurs devront-ils pouvoir utiliser ?',
      ar: 'ما اللغات التي سيحتاج مستخدمو المشروع إلى استخدامها؟',
    },
    help: { en: 'Choose each language that your users need to read or use.' },
    example: { en: 'Arabic and French.' },
    allowNote: true,
    options: [
      { id: 'ar', label: { en: 'Arabic', fr: 'Arabe', ar: 'العربية' } },
      { id: 'fr', label: { en: 'French', fr: 'Français', ar: 'الفرنسية' } },
      { id: 'en', label: { en: 'English', fr: 'Anglais', ar: 'الإنجليزية' } },
      { id: 'other', label: { en: 'Other', fr: 'Autre', ar: 'لغة أخرى' } },
    ],
  },
  {
    id: 'deadline',
    type: 'single',
    label: {
      en: 'When do you need it, and why then?',
      fr: 'Pour quand en avez-vous besoin, et pourquoi à cette date ?',
      ar: 'متى تحتاج إليه، ولماذا في ذلك الوقت؟',
    },
    help: { en: 'Choose a time range, then explain any date that matters.' },
    example: { en: 'Within 1 month, because the new shop opens in March.' },
    allowNote: true,
    options: [
      {
        id: 'asap',
        label: { en: 'As soon as possible', fr: 'Dès que possible', ar: 'في أقرب وقت ممكن' },
      },
      {
        id: 'within-month',
        label: { en: 'Within 1 month', fr: "D'ici un mois", ar: 'خلال شهر واحد' },
      },
      {
        id: 'one-to-three-months',
        label: { en: '1 to 3 months', fr: 'Dans 1 à 3 mois', ar: 'خلال شهر إلى ثلاثة أشهر' },
      },
      {
        id: 'three-to-six-months',
        label: { en: '3 to 6 months', fr: 'Dans 3 à 6 mois', ar: 'خلال ثلاثة إلى ستة أشهر' },
      },
      { id: 'flexible', label: { en: 'Flexible', fr: 'Sans échéance précise', ar: 'الموعد مرن' } },
    ],
  },
  {
    id: 'budget',
    type: 'shortText',
    label: {
      en: 'Roughly what budget do you have in mind? (write the currency)',
      fr: 'Quel budget envisagez-vous, à peu près ? (indiquez la devise)',
      ar: 'ما الميزانية التقريبية التي تفكر فيها؟ (اكتب العملة)',
    },
    help: { en: 'A rough estimate is enough. Include the currency.' },
    example: { en: 'About 2,000 TND.' },
  },
  {
    id: 'success',
    type: 'longText',
    label: {
      en: 'How will you know it worked, six months after launch?',
      fr: 'Comment saurez-vous que le projet fonctionne, six mois après son lancement ?',
      ar: 'كيف ستعرف أن المشروع حقق المطلوب بعد ستة أشهر من إطلاقه؟',
    },
    help: { en: 'Think about what should improve for you or your customers.' },
    example: { en: 'Customers can book without calling, and I can see all bookings in one place.' },
  },
  {
    id: 'outOfScope',
    type: 'longText',
    label: {
      en: 'What should it definitely NOT do, or what can wait?',
      fr: "Que ne doit-il surtout pas faire, ou qu'est-ce qui peut attendre ?",
      ar: 'ما الأمور التي يجب ألّا يفعلها المشروع، أو التي يمكن تأجيلها؟',
    },
    help: { en: 'Mention anything that should stay out of the first version or never happen.' },
    example: { en: 'It does not need online payments in the first version.' },
  },
]
