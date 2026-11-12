import type { Question } from './types'

export const genericQuestions: Question[] = [
  {
    id: 'gen.kind',
    type: 'single',
    label: { en: 'What do you imagine it to be? (a website, an app, a tool for your team, not sure)', fr: 'À quoi pensez-vous ? (un site web, une application, un outil pour votre équipe, ou vous ne savez pas encore)', ar: 'ما الشكل الذي تتخيله للمشروع؟ (موقع إلكتروني، تطبيق، أداة لفريقك، أو لست متأكدًا بعد)' },
    help: { en: 'Choose the closest idea. You can choose “Not sure yet” if you are still exploring.' },
    example: { en: 'A simple tool my team can use to track incoming orders.' },
    options: [
      { id: 'website', label: { en: 'A website', fr: 'Un site web', ar: 'موقع إلكتروني' } },
      { id: 'app', label: { en: 'An app', fr: 'Une application', ar: 'تطبيق' } },
      { id: 'team-tool', label: { en: 'A tool for my team', fr: 'Un outil pour mon équipe', ar: 'أداة لفريقي' } },
      { id: 'unsure', label: { en: 'Not sure yet', fr: 'Je ne sais pas encore', ar: 'لست متأكدًا بعد' } },
    ],
  },
  {
    id: 'gen.device',
    type: 'single',
    label: { en: 'Where will it be used: phone, computer, both?', fr: 'Où sera-t-il utilisé : sur téléphone, sur ordinateur ou sur les deux ?', ar: 'أين سيُستخدم: على الهاتف أم الحاسوب أم كليهما؟' },
    help: { en: 'Think about where people will be when they need to use it.' },
    example: { en: 'Both: customers use phones and I use a computer at work.' },
    options: [
      { id: 'phone', label: { en: 'Phone', fr: 'Téléphone', ar: 'الهاتف' } },
      { id: 'computer', label: { en: 'Computer', fr: 'Ordinateur', ar: 'الحاسوب' } },
      { id: 'both', label: { en: 'Both', fr: 'Les deux', ar: 'كلاهما' } },
    ],
  },
  {
    id: 'gen.connect',
    type: 'longText',
    label: { en: 'Does it need to connect to tools you already use? Which ones?', fr: 'Doit-il être relié à des outils que vous utilisez déjà ? Lesquels ?', ar: 'هل يجب أن يكون مرتبطًا بأدوات تستخدمها بالفعل؟ ما هي؟' },
    help: { en: 'Name any tools that should share information with this project.' },
    example: { en: 'Send new orders from my website to the spreadsheet I use for stock.' },
  },
  {
    id: 'gen.updates',
    type: 'single',
    label: { en: 'Who will look after it after launch?', fr: 'Qui s’en occupera après son lancement ?', ar: 'من سيتولى العناية به بعد إطلاقه؟' },
    help: { en: 'Choose who will fix problems or make changes after it is ready.' },
    example: { en: 'I will update it myself, and I will ask you if something breaks.' },
    options: [
      { id: 'client', label: { en: 'Me', fr: 'Moi', ar: 'أنا' } },
      { id: 'developer', label: { en: 'You', fr: 'Vous', ar: 'أنت' } },
      { id: 'nobody', label: { en: 'Nobody', fr: 'Personne', ar: 'لا أحد' } },
    ],
  },
]
