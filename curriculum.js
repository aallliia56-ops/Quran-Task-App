/**
 * ملف: curriculum.js (نسخة خاصة بجزء النبأ فقط)
 * - منهج الحفظ: من سورة النبأ (78) إلى الناس (114)
 * - بعد آخر مقطع في كل سورة متعددة المقاطع: نضيف مهمة "السورة كاملة"
 * - جميع مقاطع الحفظ = 5 نقاط
 * - المراجعة: مستوى واحد فقط (BUILDING)
 *   والقائمة مدموج فيها:
 *   - التين + العلق
 *   - القدر + البينة
 */

// ======================================================================
// 1. مقاطع الحفظ لجزء النبأ فقط (من 78 إلى 114)
// ======================================================================

const SURAH_DETAILS = [
  // --- سورة الناس (114) ---
  { surah_number: 114, surah_name_ar: "الناس", start_ayah: 1, end_ayah: 6, page: 604 },

  // --- سورة الفلق (113) ---
  { surah_number: 113, surah_name_ar: "الفلق", start_ayah: 1, end_ayah: 5, page: 604 },

  // --- سورة الإخلاص (112) ---
  { surah_number: 112, surah_name_ar: "الإخلاص", start_ayah: 1, end_ayah: 4, page: 604 },

  // --- سورة المسد (111) ---
  { surah_number: 111, surah_name_ar: "المسد", start_ayah: 1, end_ayah: 5, page: 604 },

  // --- سورة النصر (110) ---
  { surah_number: 110, surah_name_ar: "النصر", start_ayah: 1, end_ayah: 3, page: 603 },

  // --- سورة الكافرون (109) ---
  { surah_number: 109, surah_name_ar: "الكافرون", start_ayah: 1, end_ayah: 6, page: 603 },

  // --- سورة الكوثر (108) ---
  { surah_number: 108, surah_name_ar: "الكوثر", start_ayah: 1, end_ayah: 3, page: 603 },

  // --- سورة الماعون (107) ---
  { surah_number: 107, surah_name_ar: "الماعون", start_ayah: 1, end_ayah: 7, page: 602 },

  // --- سورة قريش (106) ---
  { surah_number: 106, surah_name_ar: "قريش", start_ayah: 1, end_ayah: 4, page: 602 },

  // --- سورة الفيل (105) ---
  { surah_number: 105, surah_name_ar: "الفيل", start_ayah: 1, end_ayah: 5, page: 601 },

  // --- سورة الهمزة (104) ---
  { surah_number: 104, surah_name_ar: "الهمزة", start_ayah: 1, end_ayah: 9, page: 601 },

  // --- سورة العصر (103) ---
  { surah_number: 103, surah_name_ar: "العصر", start_ayah: 1, end_ayah: 3, page: 601 },

  // --- سورة التكاثر (102) ---
  { surah_number: 102, surah_name_ar: "التكاثر", start_ayah: 1, end_ayah: 8, page: 600 },

  // --- سورة القارعة (101) ---
  { surah_number: 101, surah_name_ar: "القارعة", start_ayah: 1, end_ayah: 11, page: 600 },

  // --- سورة العاديات (100) ---
  { surah_number: 100, surah_name_ar: "العاديات", start_ayah: 1, end_ayah: 11, page: 599 },

  // --- سورة الزلزلة (99) ---
  { surah_number: 99, surah_name_ar: "الزلزلة", start_ayah: 1, end_ayah: 8, page: 599 },

  // --- سورة البينة (98) (مقاطع) ---
  { surah_number: 98, surah_name_ar: "البينة", start_ayah: 1, end_ayah: 3, page: 598 },
  { surah_number: 98, surah_name_ar: "البينة", start_ayah: 4, end_ayah: 5, page: 598 },
  { surah_number: 98, surah_name_ar: "البينة", start_ayah: 6, end_ayah: 8, page: 598 },
  // مهمة السورة كاملة
  {
    surah_number: 98,
    surah_name_ar: "البينة",
    start_ayah: 1,
    end_ayah: 8,
    page: 598,
    is_full_surah: true,
  },

  // --- سورة القدر (97) ---
  { surah_number: 97, surah_name_ar: "القدر", start_ayah: 1, end_ayah: 5, page: 598 },

  // --- سورة العلق (96) (مقاطع) ---
  { surah_number: 96, surah_name_ar: "العلق", start_ayah: 1, end_ayah: 8, page: 597 },
  { surah_number: 96, surah_name_ar: "العلق", start_ayah: 9, end_ayah: 19, page: 597 },
  // السورة كاملة
  {
    surah_number: 96,
    surah_name_ar: "العلق",
    start_ayah: 1,
    end_ayah: 19,
    page: 597,
    is_full_surah: true,
  },

  // --- سورة التين (95) ---
  { surah_number: 95, surah_name_ar: "التين", start_ayah: 1, end_ayah: 8, page: 597 },

  // --- سورة الشرح (94) ---
  { surah_number: 94, surah_name_ar: "الشرح", start_ayah: 1, end_ayah: 8, page: 596 },

  // --- سورة الضحى (93) ---
  { surah_number: 93, surah_name_ar: "الضحى", start_ayah: 1, end_ayah: 11, page: 596 },

  // --- سورة الليل (92) (مقاطع) ---
  { surah_number: 92, surah_name_ar: "الليل", start_ayah: 1, end_ayah: 10, page: 595 },
  { surah_number: 92, surah_name_ar: "الليل", start_ayah: 11, end_ayah: 21, page: 595 },
  {
    surah_number: 92,
    surah_name_ar: "الليل",
    start_ayah: 1,
    end_ayah: 21,
    page: 595,
    is_full_surah: true,
  },

  // --- سورة الشمس (91) ---
  { surah_number: 91, surah_name_ar: "الشمس", start_ayah: 1, end_ayah: 15, page: 595 },

  // --- سورة البلد (90) (مقاطع) ---
  { surah_number: 90, surah_name_ar: "البلد", start_ayah: 1, end_ayah: 10, page: 594 },
  { surah_number: 90, surah_name_ar: "البلد", start_ayah: 11, end_ayah: 20, page: 594 },
  {
    surah_number: 90,
    surah_name_ar: "البلد",
    start_ayah: 1,
    end_ayah: 20,
    page: 594,
    is_full_surah: true,
  },

  // --- سورة الفجر (89) (مقاطع) ---
  { surah_number: 89, surah_name_ar: "الفجر", start_ayah: 1, end_ayah: 10, page: 593 },
  { surah_number: 89, surah_name_ar: "الفجر", start_ayah: 11, end_ayah: 16, page: 593 },
  { surah_number: 89, surah_name_ar: "الفجر", start_ayah: 17, end_ayah: 22, page: 593 },
  { surah_number: 89, surah_name_ar: "الفجر", start_ayah: 23, end_ayah: 30, page: 593 },
  {
    surah_number: 89,
    surah_name_ar: "الفجر",
    start_ayah: 1,
    end_ayah: 30,
    page: 593,
    is_full_surah: true,
  },

  // --- سورة الغاشية (88) (مقاطع) ---
  { surah_number: 88, surah_name_ar: "الغاشية", start_ayah: 1, end_ayah: 16, page: 592 },
  { surah_number: 88, surah_name_ar: "الغاشية", start_ayah: 17, end_ayah: 26, page: 592 },
  {
    surah_number: 88,
    surah_name_ar: "الغاشية",
    start_ayah: 1,
    end_ayah: 26,
    page: 592,
    is_full_surah: true,
  },

  // --- سورة الأعلى (87) (مقاطع) ---
  { surah_number: 87, surah_name_ar: "الأعلى", start_ayah: 1, end_ayah: 8, page: 591 },
  { surah_number: 87, surah_name_ar: "الأعلى", start_ayah: 9, end_ayah: 19, page: 591 },
  {
    surah_number: 87,
    surah_name_ar: "الأعلى",
    start_ayah: 1,
    end_ayah: 19,
    page: 591,
    is_full_surah: true,
  },

  // --- سورة الطارق (86) (مقاطع) ---
  { surah_number: 86, surah_name_ar: "الطارق", start_ayah: 1, end_ayah: 9, page: 590 },
  { surah_number: 86, surah_name_ar: "الطارق", start_ayah: 10, end_ayah: 17, page: 590 },
  {
    surah_number: 86,
    surah_name_ar: "الطارق",
    start_ayah: 1,
    end_ayah: 17,
    page: 590,
    is_full_surah: true,
  },

  // --- سورة البروج (85) (مقاطع) ---
  { surah_number: 85, surah_name_ar: "البروج", start_ayah: 1, end_ayah: 8, page: 589 },
  { surah_number: 85, surah_name_ar: "البروج", start_ayah: 9, end_ayah: 11, page: 589 },
  { surah_number: 85, surah_name_ar: "البروج", start_ayah: 12, end_ayah: 22, page: 589 },
  {
    surah_number: 85,
    surah_name_ar: "البروج",
    start_ayah: 1,
    end_ayah: 22,
    page: 589,
    is_full_surah: true,
  },

  // --- سورة الانشقاق (84) (مقاطع) ---
  { surah_number: 84, surah_name_ar: "الانشقاق", start_ayah: 1, end_ayah: 9, page: 588 },
  { surah_number: 84, surah_name_ar: "الانشقاق", start_ayah: 10, end_ayah: 18, page: 588 },
  { surah_number: 84, surah_name_ar: "الانشقاق", start_ayah: 19, end_ayah: 25, page: 588 },
  {
    surah_number: 84,
    surah_name_ar: "الانشقاق",
    start_ayah: 1,
    end_ayah: 25,
    page: 588,
    is_full_surah: true,
  },

  // --- سورة المطففين (83) (مقاطع) ---
  { surah_number: 83, surah_name_ar: "المطففين", start_ayah: 1, end_ayah: 9, page: 587 },
  { surah_number: 83, surah_name_ar: "المطففين", start_ayah: 10, end_ayah: 17, page: 587 },
  { surah_number: 83, surah_name_ar: "المطففين", start_ayah: 18, end_ayah: 28, page: 587 },
  { surah_number: 83, surah_name_ar: "المطففين", start_ayah: 29, end_ayah: 36, page: 587 },
  {
    surah_number: 83,
    surah_name_ar: "المطففين",
    start_ayah: 1,
    end_ayah: 36,
    page: 587,
    is_full_surah: true,
  },

  // --- سورة الانفطار (82) (مقاطع) ---
  { surah_number: 82, surah_name_ar: "الانفطار", start_ayah: 1, end_ayah: 8, page: 587 },
  { surah_number: 82, surah_name_ar: "الانفطار", start_ayah: 9, end_ayah: 19, page: 587 },
  {
    surah_number: 82,
    surah_name_ar: "الانفطار",
    start_ayah: 1,
    end_ayah: 19,
    page: 587,
    is_full_surah: true,
  },

  // --- سورة التكوير (81) (مقاطع) ---
  { surah_number: 81, surah_name_ar: "التكوير", start_ayah: 1, end_ayah: 9, page: 586 },
  { surah_number: 81, surah_name_ar: "التكوير", start_ayah: 10, end_ayah: 18, page: 586 },
  { surah_number: 81, surah_name_ar: "التكوير", start_ayah: 19, end_ayah: 29, page: 586 },
  {
    surah_number: 81,
    surah_name_ar: "التكوير",
    start_ayah: 1,
    end_ayah: 29,
    page: 586,
    is_full_surah: true,
  },

  // --- سورة عبس (80) (مقاطع) ---
  { surah_number: 80, surah_name_ar: "عبس", start_ayah: 1, end_ayah: 16, page: 585 },
  { surah_number: 80, surah_name_ar: "عبس", start_ayah: 17, end_ayah: 23, page: 585 },
  { surah_number: 80, surah_name_ar: "عبس", start_ayah: 24, end_ayah: 32, page: 585 },
  { surah_number: 80, surah_name_ar: "عبس", start_ayah: 33, end_ayah: 42, page: 585 },
  {
    surah_number: 80,
    surah_name_ar: "عبس",
    start_ayah: 1,
    end_ayah: 42,
    page: 585,
    is_full_surah: true,
  },

  // --- سورة النازعات (79) (مقاطع) ---
  { surah_number: 79, surah_name_ar: "النازعات", start_ayah: 1, end_ayah: 14, page: 583 },
  { surah_number: 79, surah_name_ar: "النازعات", start_ayah: 15, end_ayah: 25, page: 583 },
  { surah_number: 79, surah_name_ar: "النازعات", start_ayah: 26, end_ayah: 33, page: 583 },
  { surah_number: 79, surah_name_ar: "النازعات", start_ayah: 34, end_ayah: 46, page: 583 },
  {
    surah_number: 79,
    surah_name_ar: "النازعات",
    start_ayah: 1,
    end_ayah: 46,
    page: 583,
    is_full_surah: true,
  },

  // --- سورة النبأ (78) (مقاطع) ---
  { surah_number: 78, surah_name_ar: "النبأ", start_ayah: 1, end_ayah: 11, page: 582 },
  { surah_number: 78, surah_name_ar: "النبأ", start_ayah: 12, end_ayah: 20, page: 582 },
  { surah_number: 78, surah_name_ar: "النبأ", start_ayah: 21, end_ayah: 30, page: 582 },
  { surah_number: 78, surah_name_ar: "النبأ", start_ayah: 31, end_ayah: 37, page: 582 },
  { surah_number: 78, surah_name_ar: "النبأ", start_ayah: 38, end_ayah: 40, page: 582 },
  {
    surah_number: 78,
    surah_name_ar: "النبأ",
    start_ayah: 1,
    end_ayah: 40,
    page: 582,
    is_full_surah: true,
  },
];

// ======================================================================
// 2. منهج الحفظ: تحويل المقاطع إلى HIFZ_CURRICULUM (كلها 5 نقاط)
// ======================================================================

const HIFZ_CURRICULUM = SURAH_DETAILS.map((seg) => ({
  ...seg,
  points: 5,
}));
// 👇 منهج المراجعة (بدون مستويات – مستوى واحد فقط "البناء")
export const REVIEW_CURRICULUM = {
  BUILDING: HIFZ_CURRICULUM.map((seg, i) => ({
    // اسم المهمة في المراجعة
    name: `مراجعة ${seg.surah_name_ar} (${seg.start_ayah}-${seg.end_ayah})`,
    // نقاط المراجعة (غيّر الرقم لو حاب)
    points: seg.points || 3,
  })),
};

// ======================================================================
// 3. منهج المراجعة: مستوى واحد فقط (BUILDING)
//    مع دمج التين+العلق ، القدر+البينة
// ======================================================================

const REVIEW_BUILDING_NAMES = [
  "النبأ (21-40)",
  "النازعات (1-26)",
  "النازعات (27-46)",
  "عبس (1-23)",
  "عبس (24-42)",
  "التكوير (1-14)",
  "التكوير (15-29)",
  "الانفطار",
  "المطففين (1-21)",
  "المطففين (22-36)",
  "الانشقاق",
  "البروج والطارق",
  "الأعلى",
  "الغاشية",
  "الفجر (1-16)",
  "الفجر (17-30)",
  "البلد",
  "الشمس",
  "الليل",
  "الضحى والشرح",
  "التين والعلق",
  "القدر والبينة",
  "الزلزلة والعاديات",
  "القارعة والتكاثر",
  "العصر والهمزة والفيل",
  "قريش والماعون والكوثر",
  "الكافرون والنصر والمسد",
  "الإخلاص والفلق والناس",
];

const REVIEW_CURRICULUM = {
  BUILDING: REVIEW_BUILDING_NAMES.map((name) => ({
    name,
    points: 3,
  })),

  // لو بالخطأ تم تعيين مستوى آخر للطالب، نخليها نفس القائمة
  DEVELOPMENT: REVIEW_BUILDING_NAMES.map((name) => ({
    name,
    points: 3,
  })),
  ADVANCED: REVIEW_BUILDING_NAMES.map((name) => ({
    name,
    points: 3,
  })),
};

// ======================================================================
// 4. Exports
// ======================================================================

export { HIFZ_CURRICULUM, REVIEW_CURRICULUM };
