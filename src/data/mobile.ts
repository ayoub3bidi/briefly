import type { Question } from './types'

export const mobileQuestions: Question[] = [
  {
    id: 'mob.platform',
    type: 'single',
    label: {
      en: 'iPhone, Android, or both?',
      fr: 'iPhone, Android ou les deux ?',
      ar: 'آيفون أم أندرويد أم كلاهما؟',
    },
    help: {
      en: 'Choose the phone platforms your customers or team need to use.',
      fr: 'Choisissez les plateformes mobiles dont vos clients ou votre équipe auront besoin.',
      ar: 'اختر منصات الهواتف التي يحتاج عملاؤك أو فريقك إلى استخدامها.',
    },
    example: {
      en: 'Both: customers use iPhones and Android phones.',
      fr: 'Les deux : mes clients utilisent des iPhone et des téléphones Android.',
      ar: 'كلاهما: يستخدم العملاء هواتف آيفون وأندرويد.',
    },
    options: [
      { id: 'iphone', label: { en: 'iPhone', fr: 'iPhone', ar: 'آيفون' } },
      { id: 'android', label: { en: 'Android', fr: 'Android', ar: 'أندرويد' } },
      { id: 'both', label: { en: 'Both', fr: 'Les deux', ar: 'كلاهما' } },
    ],
  },
  {
    id: 'mob.offline',
    type: 'single',
    label: {
      en: 'Does it need to work without internet?',
      fr: 'Doit-il fonctionner sans connexion Internet ?',
      ar: 'هل يجب أن يعمل من دون اتصال بالإنترنت؟',
    },
    help: {
      en: 'Consider whether users need to keep using it when their connection is unavailable.',
      fr: 'Demandez-vous si les utilisateurs doivent pouvoir continuer à l’utiliser sans connexion.',
      ar: 'فكّر فيما إذا كان المستخدمون بحاجة إلى مواصلة استخدامه عند انقطاع الاتصال.',
    },
    example: {
      en: 'Yes: staff should still see saved delivery details in areas with weak coverage.',
      fr: 'Oui : l’équipe doit pouvoir consulter les informations de livraison même dans les zones mal couvertes.',
      ar: 'نعم: ينبغي أن يتمكن الفريق من رؤية بيانات التوصيل المحفوظة في المناطق ضعيفة التغطية.',
    },
    options: [
      { id: 'yes', label: { en: 'Yes', fr: 'Oui', ar: 'نعم' } },
      { id: 'no', label: { en: 'No', fr: 'Non', ar: 'لا' } },
    ],
  },
  {
    id: 'mob.alerts',
    type: 'single',
    label: {
      en: "Should it send alerts or reminders to people's phones?",
      fr: 'Doit-il envoyer des alertes ou des rappels sur les téléphones ?',
      ar: 'هل ينبغي أن يرسل تنبيهات أو تذكيرات إلى هواتف المستخدمين؟',
    },
    help: {
      en: 'Think about whether a message should appear on the phone without opening the app.',
      fr: 'Indiquez si une notification doit apparaître sur le téléphone sans ouvrir l’application.',
      ar: 'حدّد ما إذا كان ينبغي أن يظهر تنبيه على الهاتف دون فتح التطبيق.',
    },
    example: {
      en: 'Yes: remind customers one hour before their appointment.',
      fr: 'Oui : rappeler leur rendez-vous aux clients une heure avant.',
      ar: 'نعم: تذكير العملاء بموعدهم قبل ساعة.',
    },
    options: [
      { id: 'yes', label: { en: 'Yes', fr: 'Oui', ar: 'نعم' } },
      { id: 'no', label: { en: 'No', fr: 'Non', ar: 'لا' } },
    ],
  },
  {
    id: 'mob.stores',
    type: 'single',
    label: {
      en: 'Do you already have App Store and Google Play accounts for your business?',
      fr: 'Votre entreprise a-t-elle déjà des comptes App Store et Google Play ?',
      ar: 'هل لدى شركتك حسابان على App Store وGoogle Play؟',
    },
    help: {
      en: 'These accounts are needed to publish an app under your business name.',
      fr: 'Ces comptes sont nécessaires pour publier une application au nom de votre entreprise.',
      ar: 'تحتاج إلى هذين الحسابين لنشر تطبيق باسم شركتك.',
    },
    example: {
      en: 'I have a Google Play account but still need an Apple account.',
      fr: 'J’ai un compte Google Play, mais je dois encore créer un compte Apple.',
      ar: 'لدي حساب Google Play، لكنني ما زلت بحاجة إلى حساب Apple.',
    },
    options: [
      { id: 'both', label: { en: 'Both', fr: 'Les deux', ar: 'كلاهما' } },
      { id: 'one', label: { en: 'One of them', fr: 'Un seul des deux', ar: 'أحدهما فقط' } },
      { id: 'none', label: { en: 'Neither', fr: 'Aucun des deux', ar: 'لا هذا ولا ذاك' } },
    ],
  },
]
