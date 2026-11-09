export const LANGUAGE_STORAGE_KEY = "italian-corner-language";

export function readLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "en" || saved === "ar") return saved;
  } catch {
    // Storage is optional; signing in must still work without it.
  }
  return navigator.language?.startsWith("ar") ? "ar" : "en";
}

export function applyLanguage(language) {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.title =
    language === "ar"
      ? "إيتاليان كورنر | مساحة الموظفين"
      : "Italian Corner | Employee workspace";
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // A blocked browser preference must not block the interface.
  }
}

export const translations = {
  en: {
    workspace: "Employee workspace",
    language: "Interface language",
    skip: "Skip to sign-in and account",
    hero: "Every order.\nIn good hands.",
    intro:
      "A little coordination. A lot of care. One place for the team behind every Italian Corner delivery.",
    workflow: "From our corner to their door",
    warehouse: "Prepare",
    shipping: "Ship",
    completion: "Complete",
    footer: "The details make the difference.",
    teamOnly: "For the Italian Corner team",
    welcome: "Welcome to your corner.",
    signInDescription: "Sign in with your employee account to get started.",
    help: "Need access? Contact your team administrator.",
    private: "A private workspace for our team.",
    loading: "Getting your workspace ready…",
    takingLonger:
      "Sign-in is taking longer than usual. Check your connection and try again.",
    reload: "Reload page",
    unavailable: "Sign-in is temporarily unavailable",
    unavailableDescription:
      "Please contact your team administrator to restore access.",
    account: "Your account",
    welcomeBack: "Welcome back",
    colleague: "team member",
    signedInDescription: "You're signed in to Italian Corner.",
    checking: "Confirming your access…",
    checkingDescription: "Please wait while we check your session.",
    connected: "Account connected",
    connectedDescription:
      "Your session has been verified by the Italian Corner service.",
    failed: "We couldn't confirm your access",
    signedOut: "Your session has expired. Sign out and sign in again.",
    forbidden:
      "Your account doesn't have access. Please contact your team administrator.",
    offline:
      "We couldn't reach the Italian Corner service. Please try again in a moment.",
    invalidResponse:
      "The service returned an unexpected response. Please try again.",
    retry: "Try again",
    checkAgain: "Check connection",
    email: "Email address",
    noEmail: "No email address available",
    profile: "Manage your account or sign out",
  },
  ar: {
    workspace: "مساحة الموظفين",
    language: "لغة الواجهة",
    skip: "الانتقال إلى تسجيل الدخول والحساب",
    hero: "كل طلب.\nفي أيدٍ أمينة.",
    intro:
      "تنسيق يجمعنا، واهتمام بكل التفاصيل. مساحة واحدة لفريق إيتاليان كورنر في كل خطوة من رحلة الطلب.",
    workflow: "من عندنا إلى باب العميل",
    warehouse: "تجهيز",
    shipping: "شحن",
    completion: "إتمام",
    footer: "التفاصيل هي ما يصنع الفارق.",
    teamOnly: "لفريق إيتاليان كورنر",
    welcome: "أهلاً بك في مساحتك.",
    signInDescription: "سجّل الدخول بحساب الموظف للبدء.",
    help: "تحتاج إلى حساب؟ تواصل مع مسؤول الفريق.",
    private: "مساحة خاصة بفريقنا.",
    loading: "نجهّز مساحتك…",
    takingLonger:
      "يستغرق تسجيل الدخول وقتاً أطول من المعتاد. تحقق من اتصالك وحاول مجدداً.",
    reload: "إعادة تحميل الصفحة",
    unavailable: "تسجيل الدخول غير متاح مؤقتاً",
    unavailableDescription:
      "يرجى التواصل مع مسؤول الفريق لاستعادة إمكانية الدخول.",
    account: "حسابك",
    welcomeBack: "أهلاً بعودتك",
    colleague: "زميلنا",
    signedInDescription: "أنت الآن مسجّل الدخول إلى إيتاليان كورنر.",
    checking: "نتحقق من إمكانية الدخول…",
    checkingDescription: "يرجى الانتظار بينما نتحقق من جلستك.",
    connected: "تم ربط حسابك",
    connectedDescription: "تم التحقق من جلستك لدى خدمة إيتاليان كورنر.",
    failed: "تعذّر تأكيد إمكانية الدخول",
    signedOut: "انتهت جلستك. سجّل الخروج ثم سجّل الدخول من جديد.",
    forbidden: "حسابك لا يملك صلاحية الدخول. يرجى التواصل مع مسؤول الفريق.",
    offline: "تعذّر الاتصال بخدمة إيتاليان كورنر. يرجى المحاولة بعد قليل.",
    invalidResponse: "وصل رد غير متوقع من الخدمة. يرجى المحاولة مجدداً.",
    retry: "حاول مجدداً",
    checkAgain: "التحقق من الاتصال",
    email: "البريد الإلكتروني",
    noEmail: "لا يوجد بريد إلكتروني",
    profile: "إدارة الحساب أو تسجيل الخروج",
  },
};
