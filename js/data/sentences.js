/**
 * sentences.js
 * Pure data module. Holds the sentence pools per language.
 *
 * Rules followed for the sentences:
 *  - No trailing dot at the end of a sentence.
 *  - For Arabic, only base letters are used: hamza forms (alef-with-hamza,
 *    waw-with-hamza, etc.) are written as their plain base letters.
 *  - Pools are large (30+ each) so picking 10 random ones every trial gives
 *    a different set most of the time.
 */
(function (global) {
  "use strict";

  global.App = global.App || {};

  global.App.SENTENCE_POOL = {
    en: [
      "The quick brown fox jumps over the lazy dog",
      "Practice makes progress, not perfection",
      "Code is read more often than it is written",
      "A smooth sea never made a skilled sailor",
      "Curiosity is the engine of every achievement",
      "Small steps every day lead to big results",
      "Stay hungry, stay foolish, and keep learning",
      "Good design is as little design as possible",
      "Fast typing comes from a steady, calm rhythm",
      "Believe you can and you are halfway there",
      "Simplicity is the ultimate sophistication",
      "Focus on progress and not on being perfect",
      "Your only limit is the one you set yourself",
      "Great things never come from comfort zones",
      "Type with your fingers, not with your eyes",
      "A journey of a thousand miles begins with one step",
      "Discipline is the bridge between goals and success",
      "The best way to predict the future is to build it",
      "Mistakes are proof that you are trying something new",
      "Strong minds discuss ideas, not other people",
      "Reading is to the mind what exercise is to the body",
      "Small daily improvements lead to amazing results",
      "Hard work beats talent when talent does not work hard",
      "Dream big, start small, but most of all just start",
      "The future belongs to those who learn more skills",
      "Knowledge is power, but action is what changes lives",
      "Every expert was once a complete beginner like you",
      "Patience and persistence will always beat raw talent",
      "Push yourself because no one else is going to do it",
      "Be the kind of person you would want to work with",
      "Quality is not an act, it is a habit you build daily",
      "Learning never exhausts the mind that loves it",
      "Done is better than perfect, ship it and improve later"
    ],

    ar: [
      "العلم في الصغر كالنقش على الحجر",
      "من جد وجد ومن زرع حصد",
      "اللغة العربية بحر واسع من الجمال",
      "الكتاب خير جليس في الزمان",
      "الوقت كالسيف ان لم تقطعه قطعك",
      "السرعة في الكتابة تحتاج الى تدريب يومي",
      "الصبر مفتاح الفرج في كل امر",
      "خير الكلام ما قل ودل واصاب المعنى",
      "التكنولوجيا تجعل حياتنا اسهل واسرع",
      "ابدا بخطوة صغيرة تصل الى هدفك الكبير",
      "اقرا كل يوم لتزداد علما ومعرفة",
      "الامل نور القلب وزاد المسافر",
      "العمل الجاد طريق النجاح الحقيقي",
      "الاصرار يحول المستحيل الى ممكن",
      "تعلم الكتابة بسرعة ودقة وثقة",
      "العقل السليم في الجسم السليم",
      "من سار على الدرب وصل الى مبتغاه",
      "النجاح يبدا من اللحظة التي تقرر فيها المحاولة",
      "كل يوم جديد فرصة لتصبح افضل من الامس",
      "الحلم الكبير يحتاج الى عمل اكبر",
      "العمل بصمت يصنع نتيجة تتحدث بصوت عال",
      "تعلم لغة جديدة كانك تفتح نافذة على عالم اخر",
      "الكتابة بسرعة مهارة يكتسبها كل من يتدرب",
      "الفشل ليس نهاية الطريق بل بدايته الحقيقية",
      "اجعل من خطاك دروسا ومن دروسك خبرات",
      "الثقة بالنفس اول خطوة نحو التميز",
      "العقول العظيمة تناقش الافكار لا الاشخاص",
      "كن دوما افضل نسخة ممكنة من نفسك",
      "البرمجة فن وعلم في الوقت نفسه",
      "تعلم اليوم لتصبح اقوى في الغد",
      "الصدق راحة والكذب ندامة",
      "خطوة صغيرة كل يوم خير من قفزة في السنة",
      "ابتسم للحياة تبتسم لك الحياة"
    ]
  };
})(window);
