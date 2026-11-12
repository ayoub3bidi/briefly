import type { QuestionCopy } from './types'

type LocalizedGuidance = { help: QuestionCopy; example: QuestionCopy }

export const questionGuidance: Record<string, LocalizedGuidance> = {
  problem: {
    help: { en: 'Describe the problem in your own words and what you do about it today.', fr: 'Décrivez le problème avec vos mots et expliquez comment vous le gérez aujourd’hui.', ar: 'اشرح المشكلة بكلماتك، واذكر كيف تتعامل معها اليوم.' },
    example: { en: 'I take appointment requests by phone and write them in a notebook.', fr: 'Je prends les demandes de rendez-vous par téléphone et je les note dans un carnet.', ar: 'أتلقى طلبات المواعيد عبر الهاتف وأدوّنها في دفتر.' },
  },
  roles: {
    help: { en: 'List the people or groups who will use it. You can add a short note for each.', fr: 'Indiquez les personnes ou les groupes qui l’utiliseront. Vous pouvez ajouter une courte précision pour chacun.', ar: 'اذكر الأشخاص أو المجموعات الذين سيستخدمونه. يمكنك إضافة ملاحظة قصيرة لكل منهم.' },
    example: { en: 'Customers: place orders. Staff: prepare them. Me: manage products.', fr: 'Clients : passer commande. Équipe : la préparer. Moi : gérer les produits.', ar: 'العملاء: يرسلون الطلبات. الفريق: يجهّزها. أنا: أدير المنتجات.' },
  },
  walkthrough: {
    help: { en: 'Think of one real situation. What happens first, next, and last?', fr: 'Pensez à une situation réelle. Que se passe-t-il au début, ensuite et à la fin ?', ar: 'فكّر في موقف حقيقي. ما الذي يحدث أولًا، ثم بعد ذلك، وأخيرًا؟' },
    example: { en: 'A customer chooses a meal, pays online, and gets a message when it is ready.', fr: 'Un client choisit un repas, paie en ligne et reçoit un message quand sa commande est prête.', ar: 'يختار العميل وجبة ويدفع عبر الإنترنت، ثم تصله رسالة عندما تصبح جاهزة.' },
  },
  features: {
    help: { en: 'Add useful actions one at a time. You can decide later which matter most.', fr: 'Ajoutez les actions utiles une par une. Vous pourrez décider plus tard lesquelles sont prioritaires.', ar: 'أضف الوظائف المفيدة واحدة تلو الأخرى. يمكنك تحديد الأهم منها لاحقًا.' },
    example: { en: 'Track orders: see each order and whether it has been prepared.', fr: 'Suivi des commandes : consulter chaque commande et savoir si elle est prête.', ar: 'متابعة الطلبات: عرض كل طلب ومعرفة ما إذا كان قد جُهّز.' },
  },
  inspiration: {
    help: { en: 'Share links if you have them. Say what you like about each one.', fr: 'Partagez les liens si vous en avez. Précisez ce qui vous plaît sur chacun.', ar: 'أرسل الروابط إن توفرت، واذكر ما يعجبك في كل واحد منها.' },
    example: { en: 'I like the clear product pages on example.com because prices are easy to find.', fr: 'J’aime les pages produit claires sur example.com, car les prix sont faciles à trouver.', ar: 'تعجبني صفحات المنتجات الواضحة في example.com لأن العثور على الأسعار سهل.' },
  },
  services: {
    help: { en: 'Choose services you know you will need. It is okay if you are not sure yet.', fr: 'Choisissez les services dont vous aurez besoin. Vous pouvez aussi indiquer que vous hésitez encore.', ar: 'اختر الخدمات التي تعرف أنك ستحتاج إليها. لا بأس إن لم تكن متأكدًا بعد.' },
    example: { en: 'Payments and WhatsApp updates.', fr: 'Les paiements et les notifications par WhatsApp.', ar: 'الدفع وإشعارات واتساب.' },
  },
  languages: {
    help: { en: 'Choose each language that your users need to read or use.', fr: 'Choisissez toutes les langues que vos utilisateurs devront lire ou utiliser.', ar: 'اختر كل اللغات التي يحتاج المستخدمون إلى قراءتها أو استخدامها.' },
    example: { en: 'Arabic and French.', fr: 'Arabe et français.', ar: 'العربية والفرنسية.' },
  },
  deadline: {
    help: { en: 'Choose a time range, then explain any date that matters.', fr: 'Choisissez un délai, puis précisez toute date importante.', ar: 'اختر إطارًا زمنيًا، ثم اشرح أي موعد مهم.' },
    example: { en: 'Within 1 month, because the new shop opens in March.', fr: 'Dans un mois, car la nouvelle boutique ouvre en mars.', ar: 'خلال شهر، لأن المتجر الجديد سيفتتح في مارس.' },
  },
  budget: {
    help: { en: 'A rough estimate is enough. Include the currency.', fr: 'Une estimation approximative suffit. Indiquez la devise.', ar: 'يكفي تقدير تقريبي. اذكر العملة.' },
    example: { en: 'About 2,000 TND.', fr: 'Environ 2 000 TND.', ar: 'حوالي 2,000 دينار تونسي.' },
  },
  success: {
    help: { en: 'Think about what should improve for you or your customers.', fr: 'Pensez à ce qui devrait s’améliorer pour vous ou vos clients.', ar: 'فكّر فيما ينبغي أن يتحسن لك أو لعملائك.' },
    example: { en: 'Customers can book without calling, and I can see all bookings in one place.', fr: 'Les clients peuvent réserver sans appeler et je consulte toutes les réservations au même endroit.', ar: 'يستطيع العملاء الحجز دون اتصال، وأستطيع رؤية جميع الحجوزات في مكان واحد.' },
  },
  outOfScope: {
    help: { en: 'Mention anything that should stay out of the first version or never happen.', fr: 'Indiquez ce qui ne doit pas faire partie de la première version ou ne doit jamais arriver.', ar: 'اذكر ما لا ينبغي تضمينه في الإصدار الأول أو ما يجب ألّا يحدث مطلقًا.' },
    example: { en: 'It does not need online payments in the first version.', fr: 'Les paiements en ligne ne sont pas nécessaires dans la première version.', ar: 'لا حاجة إلى الدفع عبر الإنترنت في الإصدار الأول.' },
  },
  'web.domain': {
    help: { en: 'A domain name is the address people type to find a website.', fr: 'Un nom de domaine est l’adresse saisie pour trouver un site web.', ar: 'اسم النطاق هو العنوان الذي يكتبه الناس للوصول إلى موقع إلكتروني.' },
    example: { en: 'I already own myshop.tn, but I do not have a website yet.', fr: 'Je possède déjà myshop.tn, mais je n’ai pas encore de site web.', ar: 'أملك النطاق myshop.tn بالفعل، لكن ليس لدي موقع إلكتروني بعد.' },
  },
  'web.device': {
    help: { en: 'Think about where your customers or team will usually be when they use it.', fr: 'Pensez à l’endroit où vos clients ou votre équipe se trouveront généralement pour l’utiliser.', ar: 'فكّر أين سيكون عملاؤك أو فريقك عادةً عند استخدامه.' },
    example: { en: 'Mostly on phones, while customers are out.', fr: 'Surtout sur téléphone, quand les clients sont en déplacement.', ar: 'غالبًا على الهواتف، أثناء تنقّل العملاء.' },
  },
  'web.brand': {
    help: { en: 'Choose the answer that best describes what you can provide now.', fr: 'Choisissez la réponse qui décrit le mieux ce que vous pouvez fournir maintenant.', ar: 'اختر الإجابة التي تصف أفضل ما يمكنك تقديمه الآن.' },
    example: { en: 'I have a logo and colors, but I still need photos.', fr: 'J’ai un logo et des couleurs, mais il me manque encore les photos.', ar: 'لدي شعار وألوان، لكنني ما زلت بحاجة إلى صور.' },
  },
  'web.updates': {
    help: { en: 'Think about who will change things like prices, opening hours, or news.', fr: 'Pensez à la personne qui modifiera les prix, les horaires ou les actualités.', ar: 'فكّر في الشخص الذي سيحدّث الأسعار أو ساعات العمل أو الأخبار.' },
    example: { en: 'I will update prices and opening hours myself.', fr: 'Je mettrai moi-même à jour les prix et les horaires.', ar: 'سأحدّث الأسعار وساعات العمل بنفسي.' },
  },
  'gen.kind': {
    help: { en: 'Choose the closest idea. You can choose “Not sure yet” if you are still exploring.', fr: 'Choisissez l’idée la plus proche. Vous pouvez répondre que vous hésitez encore.', ar: 'اختر الفكرة الأقرب لما تتصوره. يمكنك اختيار «لست متأكدًا بعد» إن كنت ما زلت تستكشف الخيارات.' },
    example: { en: 'A simple tool my team can use to track incoming orders.', fr: 'Un outil simple permettant à mon équipe de suivre les commandes reçues.', ar: 'أداة بسيطة تساعد فريقي على متابعة الطلبات الواردة.' },
  },
  'gen.device': {
    help: { en: 'Think about where people will be when they need to use it.', fr: 'Pensez à l’endroit où les utilisateurs se trouveront lorsqu’ils en auront besoin.', ar: 'فكّر أين سيكون المستخدمون عندما يحتاجون إلى استخدامه.' },
    example: { en: 'Both: customers use phones and I use a computer at work.', fr: 'Les deux : les clients utilisent leur téléphone et j’utilise un ordinateur au travail.', ar: 'كلاهما: يستخدم العملاء هواتفهم، وأستخدم أنا الحاسوب في العمل.' },
  },
  'gen.connect': {
    help: { en: 'Name any tools that should share information with this project.', fr: 'Indiquez les outils qui devraient échanger des informations avec ce projet.', ar: 'اذكر أي أدوات ينبغي أن تتبادل المعلومات مع هذا المشروع.' },
    example: { en: 'Send new orders from my website to the spreadsheet I use for stock.', fr: 'Envoyer les nouvelles commandes du site vers mon tableau de suivi des stocks.', ar: 'إرسال الطلبات الجديدة من موقعي إلى جدول البيانات الذي أتابع فيه المخزون.' },
  },
  'gen.updates': {
    help: { en: 'Choose who will fix problems or make changes after it is ready.', fr: 'Choisissez qui corrigera les problèmes ou fera des changements après le lancement.', ar: 'اختر من سيصلح المشكلات أو يجري التعديلات بعد الإطلاق.' },
    example: { en: 'I will update it myself, and I will ask you if something breaks.', fr: 'Je ferai les mises à jour moi-même et je vous contacterai en cas de problème.', ar: 'سأتولى تحديثه بنفسي، وسأتواصل معك إذا حدث عطل.' },
  },
  'mob.platform': {
    help: { en: 'Choose the phone platforms your customers or team need to use.', fr: 'Choisissez les plateformes mobiles dont vos clients ou votre équipe auront besoin.', ar: 'اختر منصات الهواتف التي يحتاج عملاؤك أو فريقك إلى استخدامها.' },
    example: { en: 'Both: customers use iPhones and Android phones.', fr: 'Les deux : mes clients utilisent des iPhone et des téléphones Android.', ar: 'كلاهما: يستخدم العملاء هواتف آيفون وأندرويد.' },
  },
  'mob.offline': {
    help: { en: 'Consider whether users need to keep using it when their connection is unavailable.', fr: 'Demandez-vous si les utilisateurs doivent pouvoir continuer à l’utiliser sans connexion.', ar: 'فكّر فيما إذا كان المستخدمون بحاجة إلى مواصلة استخدامه عند انقطاع الاتصال.' },
    example: { en: 'Yes: staff should still see saved delivery details in areas with weak coverage.', fr: 'Oui : l’équipe doit pouvoir consulter les informations de livraison même dans les zones mal couvertes.', ar: 'نعم: ينبغي أن يتمكن الفريق من رؤية بيانات التوصيل المحفوظة في المناطق ضعيفة التغطية.' },
  },
  'mob.alerts': {
    help: { en: 'Think about whether a message should appear on the phone without opening the app.', fr: 'Indiquez si une notification doit apparaître sur le téléphone sans ouvrir l’application.', ar: 'حدّد ما إذا كان ينبغي أن يظهر تنبيه على الهاتف دون فتح التطبيق.' },
    example: { en: 'Yes: remind customers one hour before their appointment.', fr: 'Oui : rappeler leur rendez-vous aux clients une heure avant.', ar: 'نعم: تذكير العملاء بموعدهم قبل ساعة.' },
  },
  'mob.stores': {
    help: { en: 'These accounts are needed to publish an app under your business name.', fr: 'Ces comptes sont nécessaires pour publier une application au nom de votre entreprise.', ar: 'تحتاج إلى هذين الحسابين لنشر تطبيق باسم شركتك.' },
    example: { en: 'I have a Google Play account but still need an Apple account.', fr: 'J’ai un compte Google Play, mais je dois encore créer un compte Apple.', ar: 'لدي حساب Google Play، لكنني ما زلت بحاجة إلى حساب Apple.' },
  },
  'auto.tools': {
    help: { en: 'List the tools that should exchange information and what data should move between them.', fr: 'Indiquez les outils à relier et les données qui doivent circuler entre eux.', ar: 'اذكر الأدوات التي تريد ربطها والبيانات التي ينبغي أن تنتقل بينها.' },
    example: { en: 'When an order arrives in my shop system, add the customer and order to a spreadsheet.', fr: 'À chaque nouvelle commande dans mon système, ajouter le client et la commande à un tableur.', ar: 'عند وصول طلب إلى نظام المتجر، أضف بيانات العميل والطلب إلى جدول بيانات.' },
  },
  'auto.trigger': {
    help: { en: 'Describe the event or time that should start the automatic steps.', fr: 'Décrivez l’événement ou l’heure qui doit déclencher les étapes automatiques.', ar: 'اشرح الحدث أو الوقت الذي ينبغي أن يبدأ الخطوات التلقائية.' },
    example: { en: 'Whenever a customer submits the booking form.', fr: 'Chaque fois qu’un client envoie le formulaire de réservation.', ar: 'كلما أرسل عميل نموذج الحجز.' },
  },
  'auto.volume': {
    help: { en: 'Estimate how many times the process runs on a typical day.', fr: 'Estimez le nombre d’exécutions du processus lors d’une journée habituelle.', ar: 'قدّر عدد مرات تنفيذ العملية في يوم عادي.' },
    example: { en: 'Usually around 20 orders each day.', fr: 'Environ 20 commandes par jour en temps normal.', ar: 'عادةً نحو 20 طلبًا يوميًا.' },
  },
  'auto.failure': {
    help: { en: 'Say who should know when an automatic step fails and how to reach them.', fr: 'Indiquez qui prévenir en cas d’échec et comment le contacter.', ar: 'اذكر من ينبغي إبلاغه عند فشل خطوة تلقائية وكيفية التواصل معه.' },
    example: { en: 'Email me if an order cannot be added to the delivery system.', fr: 'M’envoyer un e-mail si une commande ne peut pas être ajoutée au système de livraison.', ar: 'أرسل إليّ بريدًا إلكترونيًا إذا تعذرت إضافة طلب إلى نظام التوصيل.' },
  },
}
