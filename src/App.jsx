import { useState, useEffect, createContext, useContext } from "react";

// ============================================================
// API CONFIG
// ============================================================
const API_URL = "https://devroots-backend.onrender.com";

// ============================================================
// FIREBASE CONFIG — Replace these with your Firebase project values
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC9HZg332YKLorHHoanLrweUgUu3NkU8bs",
  authDomain: "devroots-108db.firebaseapp.com",
  projectId: "devroots-108db",
  storageBucket: "devroots-108db.firebasestorage.app",
  messagingSenderId: "71450953253",
  appId: "1:71450953253:web:87de206ca4dd6f294721cc"
};

// Firebase SDK (loaded from CDN)
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;

async function initFirebase() {
  if (firebaseApp) return;
  if (FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") return;
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getAuth, GoogleAuthProvider } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    firebaseApp = initializeApp(FIREBASE_CONFIG);
    firebaseAuth = getAuth(firebaseApp);
    googleProvider = new GoogleAuthProvider();
  } catch (e) { console.error("Firebase init failed:", e); }
}
initFirebase();

// ============================================================
// ROLE DEFINITIONS
// ============================================================
const ROLES = {
  "admin":              { label: "Admin",              labelAr: "مدير",              color: "#FFBF00", rank: 0 },
  "arch-developer":     { label: "Arch-Developer",     labelAr: "مهندس رئيسي",      color: "#FFBF00", rank: 1 },
  "core-architect":     { label: "Core Architect",     labelAr: "مهندس النواة",      color: "#50C878", rank: 2 },
  "systems-engineer":   { label: "Systems Engineer",   labelAr: "مهندس أنظمة",       color: "#4682B4", rank: 3 },
  "script-master":      { label: "Script Master",      labelAr: "خبير البرمجة",      color: "#98FF98", rank: 4 },
  "creative-director":  { label: "Creative Director",  labelAr: "المدير الإبداعي",   color: "#B76E79", rank: 5 },
  "ui-ux-specialist":   { label: "UI/UX Specialist",   labelAr: "متخصص واجهات",      color: "#8F00FF", rank: 6 },
  "visual-artist":      { label: "Visual Artist",      labelAr: "فنان بصري",         color: "#87CEEB", rank: 7 },
  "3d-modeler":         { label: "3D Modeler",         labelAr: "مصمم ثلاثي الأبعاد", color: "#CD7F32", rank: 8 },
  "content-creator":    { label: "Content Creator",    labelAr: "منشئ محتوى",        color: "#FF7F50", rank: 9 },
  "tech-moderator":     { label: "Tech Moderator",     labelAr: "مشرف تقني",         color: "#C0C0C0", rank: 10 },
  "junior-dev":         { label: "Junior Dev",         labelAr: "مطور مبتدئ",        color: "#8A9A5B", rank: 11 },
  "member":             { label: "Member",             labelAr: "عضو",               color: "#6b7d5e", rank: 12 },
};

const CATEGORY_GROUPS = [
  { title: "Administration & News", titleAr: "الإدارة والأخبار", slugs: ["announcements", "rules-welcome"] },
  { title: "Rappelz Development Hub", titleAr: "مركز تطوير رابلز", slugs: ["core-dev", "rendering", "scripting", "ui-ux"] },
  { title: "Creative & 3D Design", titleAr: "التصميم الإبداعي وثلاثي الأبعاد", slugs: ["3d-modeling", "2d-design"] },
  { title: "Tutorials & Support", titleAr: "الدروس والدعم", slugs: ["knowledge-base", "troubleshooting"] },
];

function getRoleLabel(role, lang) {
  const r = ROLES[role] || ROLES["member"];
  return lang === "ar" ? r.labelAr : r.label;
}
function getRoleColor(role) {
  return (ROLES[role] || ROLES["member"]).color;
}

async function api(endpoint, options = {}) {
  const token = localStorage.getItem("devroots_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err) {
    if (err.message === "Failed to fetch") throw new Error("Server is waking up... please wait 30 seconds and try again");
    throw err;
  }
}

// ============================================================
// LANGUAGE SYSTEM
// ============================================================
const translations = {
  en: {
    dir: "ltr", brand: "DevRoots", tagline: "The Rappelz Developer Community",
    heroTitle: "Where Rappelz Developers Grow",
    heroDesc: "Build, share, and evolve. The home for Rappelz server developers — from custom servers to client mods, tools, and beyond.",
    home: "Home", forums: "Forums", shop: "Shop", profile: "Profile",
    signIn: "Sign In", join: "Join", logout: "Logout",
    developers: "Developers", discussions: "Discussions", projectsShared: "Projects Shared", posts: "Posts",
    communityForums: "Community Forums", browseCategories: "Browse categories or search for topics",
    newThread: "+ New Thread", searchForums: "Search forums...", threads: "threads",
    recentActivity: "Recent Activity", replies: "replies", views: "views", lastPost: "last post",
    pinned: "Pinned", postReply: "Post a Reply", writeReply: "Write your reply...",
    signInToReply: "Sign in to reply...", preview: "Preview", postReplyBtn: "Post Reply",
    signInToReplyBtn: "Sign In to Reply", createNewThread: "Create New Thread",
    category: "Category", selectCategory: "Select a category", title: "Title",
    threadTitlePlaceholder: "Descriptive title for your thread",
    tags: "Tags (comma separated)", tagsPlaceholder: "e.g. guide, ep9.5, server",
    content: "Content", contentPlaceholder: "Write your post content here...",
    createThread: "Create Thread", cancel: "Cancel",
    noThreads: "No threads in this category yet. Be the first!",
    developerShop: "Developer Shop", shopDesc: "Buy and sell Rappelz development resources",
    sellProject: "Sell a Project", all: "All", viewDetails: "View Details",
    reputation: "Reputation", myPosts: "My Posts", myThreads: "My Threads",
    myShop: "My Shop", settings: "Settings", accountSettings: "Account Settings",
    username: "Username", email: "Email", bio: "Bio", saveChanges: "Save Changes",
    signInToView: "Sign in to view your profile",
    welcomeBack: "Welcome Back", joinCommunity: "Join the Community",
    signInAccount: "Sign in to your account", createAccount: "Create your developer account",
    chooseUsername: "Choose a username", password: "Password", confirmPassword: "Confirm Password",
    signInBtn: "Sign In", createAccountBtn: "Create Account",
    noAccount: "Don't have an account?", signUp: "Sign up",
    haveAccount: "Already have an account?",
    about: "About", rules: "Rules", apiDocs: "API Docs", contact: "Contact",
    discord: "Discord", github: "GitHub",
    copyright: "© 2024 DevRoots Community. Not affiliated with Gala Lab or Webzen.",
    browseForums: "Browse Forums", postedIn: "Posted in",
    reply: "Reply", share: "Share", report: "Report", by: "By",
    loading: "Loading...", error: "Something went wrong", tryAgain: "Try Again",
    serverWaking: "Server is waking up... please wait and try again",
    purchasing: "Purchase", bought: "Purchased!", price: "Price",
    rating: "Rating", reviews: "Reviews", seller: "Seller",
    submitReview: "Submit Review", writeReview: "Write a review...",
    yourRating: "Your Rating", noProducts: "No products available yet.",
    searchResults: "Search Results", search: "Search",
    notifications: "Notifications", noNotifications: "No notifications",
    markAllRead: "Mark All Read", productDetails: "Product Details",
    buy: "Buy Now", free: "Free", addProduct: "Add Product",
    description: "Description", productTitle: "Product Title",
    productDesc: "Product Description", productPrice: "Price (USD, 0 for free)",
    productCategory: "Category", productImage: "Emoji Icon",
    submitProduct: "Submit for Review", pendingApproval: "Pending Approval",
    approve: "Approve", reject: "Reject", products: "Products",
    copiedLink: "Link copied!", reportSent: "Report submitted!",
    profileUpdated: "Profile updated!", sold: "sold",
  },
  ar: {
    dir: "rtl", brand: "DevRoots", tagline: "مجتمع مطوري رابلز",
    heroTitle: "حيث ينمو مطورو رابلز",
    heroDesc: "ابنِ وشارك وتطور. الوجهة الرئيسية لمطوري سيرفرات رابلز — من السيرفرات المخصصة إلى تعديلات العميل والأدوات وأكثر.",
    home: "الرئيسية", forums: "المنتديات", shop: "المتجر", profile: "الملف الشخصي",
    signIn: "تسجيل الدخول", join: "انضم", logout: "تسجيل الخروج",
    developers: "مطورون", discussions: "نقاشات", projectsShared: "مشاريع مشتركة", posts: "منشورات",
    communityForums: "منتديات المجتمع", browseCategories: "تصفح الأقسام أو ابحث في المواضيع",
    newThread: "+ موضوع جديد", searchForums: "ابحث في المنتديات...", threads: "مواضيع",
    recentActivity: "النشاط الأخير", replies: "ردود", views: "مشاهدات", lastPost: "آخر رد",
    pinned: "مثبّت", postReply: "أضف رداً", writeReply: "اكتب ردك هنا...",
    signInToReply: "سجّل دخولك للرد...", preview: "معاينة", postReplyBtn: "نشر الرد",
    signInToReplyBtn: "سجّل دخولك للرد", createNewThread: "إنشاء موضوع جديد",
    category: "القسم", selectCategory: "اختر قسماً", title: "العنوان",
    threadTitlePlaceholder: "عنوان وصفي لموضوعك",
    tags: "الوسوم (مفصولة بفاصلة)", tagsPlaceholder: "مثال: دليل، ep9.5، سيرفر",
    content: "المحتوى", contentPlaceholder: "اكتب محتوى منشورك هنا...",
    createThread: "إنشاء الموضوع", cancel: "إلغاء",
    noThreads: "لا توجد مواضيع في هذا القسم بعد. كن أول من يبدأ!",
    developerShop: "متجر المطورين", shopDesc: "اشترِ وبِع موارد تطوير رابلز",
    sellProject: "بيع مشروع", all: "الكل", viewDetails: "عرض التفاصيل",
    reputation: "السمعة", myPosts: "منشوراتي", myThreads: "مواضيعي",
    myShop: "متجري", settings: "الإعدادات", accountSettings: "إعدادات الحساب",
    username: "اسم المستخدم", email: "البريد الإلكتروني", bio: "نبذة",
    saveChanges: "حفظ التغييرات", signInToView: "سجّل دخولك لعرض ملفك الشخصي",
    welcomeBack: "مرحباً بعودتك", joinCommunity: "انضم للمجتمع",
    signInAccount: "سجّل الدخول إلى حسابك", createAccount: "أنشئ حساب مطور",
    chooseUsername: "اختر اسم مستخدم", password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    signInBtn: "تسجيل الدخول", createAccountBtn: "إنشاء حساب",
    noAccount: "ليس لديك حساب؟", signUp: "سجّل الآن",
    haveAccount: "لديك حساب بالفعل؟",
    about: "عن الموقع", rules: "القوانين", apiDocs: "مستندات API", contact: "تواصل معنا",
    discord: "ديسكورد", github: "غيتهب",
    copyright: "© 2024 مجتمع DevRoots. غير تابع لـ Gala Lab أو Webzen.",
    browseForums: "تصفح المنتديات", postedIn: "نُشر في",
    reply: "رد", share: "مشاركة", report: "إبلاغ", by: "بواسطة",
    loading: "جارٍ التحميل...", error: "حدث خطأ ما", tryAgain: "حاول مرة أخرى",
    serverWaking: "السيرفر يستيقظ... انتظر وحاول مرة أخرى",
    purchasing: "شراء", bought: "تم الشراء!", price: "السعر",
    rating: "التقييم", reviews: "المراجعات", seller: "البائع",
    submitReview: "إرسال المراجعة", writeReview: "اكتب مراجعة...",
    yourRating: "تقييمك", noProducts: "لا توجد منتجات متاحة حالياً.",
    searchResults: "نتائج البحث", search: "بحث",
    notifications: "الإشعارات", noNotifications: "لا توجد إشعارات",
    markAllRead: "تعيين الكل كمقروء", productDetails: "تفاصيل المنتج",
    buy: "اشتري الآن", free: "مجاني", addProduct: "إضافة منتج",
    description: "الوصف", productTitle: "عنوان المنتج",
    productDesc: "وصف المنتج", productPrice: "السعر (دولار، 0 للمجاني)",
    productCategory: "التصنيف", productImage: "أيقونة إيموجي",
    submitProduct: "إرسال للمراجعة", pendingApproval: "بانتظار الموافقة",
    approve: "موافقة", reject: "رفض", products: "منتجات",
    copiedLink: "تم نسخ الرابط!", reportSent: "تم إرسال البلاغ!",
    profileUpdated: "تم تحديث الملف الشخصي!", sold: "مُباع",
  },
};

const LangContext = createContext();
function useLang() { return useContext(LangContext); }

// ============================================================
// STYLES
// ============================================================
const getStyles = (dir) => `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap');
  :root {
    --bg-root: #0c0f0a; --bg-surface: #141a12; --bg-surface-2: #1a2117; --bg-surface-3: #1f2a1b;
    --bg-hover: #243020; --bg-input: #111610; --border: #2a3525; --border-hover: #3a4a33;
    --border-accent: #4a6b3a; --text-primary: #e4e8df; --text-secondary: #9ca895; --text-muted: #5e6e55;
    --accent: #7cb342; --accent-hover: #9ccc65; --accent-dim: rgba(124,179,66,0.12);
    --accent-glow: rgba(124,179,66,0.2); --amber: #f9a825; --amber-dim: rgba(249,168,37,0.12);
    --copper: #e67e22; --cyan: #26a69a; --cyan-dim: rgba(38,166,154,0.12);
    --red: #ef5350; --red-dim: rgba(239,83,80,0.1); --green: #66bb6a; --green-dim: rgba(102,187,106,0.12);
    --radius: 14px; --radius-sm: 10px; --radius-xs: 7px;
    --font-display: 'DM Serif Display', serif; --font-body: 'Manrope', 'Noto Kufi Arabic', sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body, #root { background: var(--bg-root); color: var(--text-primary); font-family: var(--font-body); min-height: 100vh; direction: ${dir}; }
  #root { display: flex; flex-direction: column; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  .navbar { position: sticky; top: 0; z-index: 100; background: rgba(12,15,10,0.9); backdrop-filter: blur(24px) saturate(1.2); border-bottom: 1px solid var(--border); padding: 0 2rem; height: 66px; display: flex; align-items: center; justify-content: space-between; }
  .nav-brand { display: flex; align-items: center; gap: 12px; cursor: pointer; }
  .nav-logo { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .nav-brand-text { font-family: var(--font-display); font-size: 1.35rem; }
  .nav-links { display: flex; align-items: center; gap: 4px; }
  .nav-link { padding: 8px 18px; border-radius: var(--radius-xs); color: var(--text-secondary); font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; border: none; background: none; font-family: var(--font-body); position: relative; }
  .nav-link:hover { color: var(--text-primary); background: var(--bg-surface-2); }
  .nav-link.active { color: var(--accent); background: var(--accent-dim); }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .lang-toggle { padding: 6px 14px; border-radius: 20px; background: var(--bg-surface-2); border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: var(--font-body); transition: all 0.2s; }
  .lang-toggle:hover { border-color: var(--accent); color: var(--accent); }
  .notif-badge { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; background: var(--red); border-radius: 50%; }

  .btn { padding: 10px 22px; border-radius: var(--radius-xs); font-family: var(--font-body); font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; border: none; display: inline-flex; align-items: center; gap: 8px; }
  .btn-accent { background: var(--accent); color: #0c0f0a; }
  .btn-accent:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 24px var(--accent-glow); }
  .btn-accent:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-surface { background: var(--bg-surface-2); color: var(--text-primary); border: 1px solid var(--border); }
  .btn-surface:hover { border-color: var(--accent); }
  .btn-ghost { background: transparent; color: var(--text-secondary); }
  .btn-ghost:hover { color: var(--text-primary); background: var(--bg-surface-2); }
  .btn-sm { padding: 6px 14px; font-size: 0.78rem; }
  .btn-amber { background: var(--amber); color: #1a1200; font-weight: 700; }
  .btn-amber:hover { background: #fbc02d; }
  .btn-red { background: var(--red-dim); color: var(--red); border: 1px solid transparent; }
  .btn-red:hover { border-color: var(--red); }
  .btn-green { background: var(--green-dim); color: var(--green); border: 1px solid transparent; }
  .btn-green:hover { border-color: var(--green); }

  .hero { position: relative; overflow: hidden; padding: 6rem 2rem 5rem; text-align: center; background: linear-gradient(170deg, #0c0f0a 0%, #15200f 35%, #1a2a14 55%, #0f1a0b 100%); }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 600px 400px at 25% 60%, rgba(124,179,66,0.06) 0%, transparent 70%), radial-gradient(ellipse 500px 350px at 75% 40%, rgba(38,166,154,0.05) 0%, transparent 70%); pointer-events: none; }
  .hero-pattern { position: absolute; inset: 0; opacity: 0.025; background-image: radial-gradient(circle 2px, var(--accent) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; }
  .hero-content { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 18px; border-radius: 20px; background: var(--accent-dim); border: 1px solid rgba(124,179,66,0.2); color: var(--accent); font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
  .hero h1 { font-family: var(--font-display); font-size: 3.5rem; line-height: 1.15; margin-bottom: 1.25rem; }
  .hero h1 .highlight { background: linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero p { color: var(--text-secondary); font-size: 1.1rem; max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.75; }
  .hero-stats { display: flex; justify-content: center; gap: 3.5rem; margin-top: 3.5rem; flex-wrap: wrap; }
  .hero-stat-val { font-family: var(--font-display); font-size: 2.2rem; color: var(--accent); }
  .hero-stat-label { color: var(--text-muted); font-size: 0.82rem; margin-top: 2px; }

  .page-wrap { max-width: 1180px; margin: 0 auto; padding: 2rem; flex: 1; width: 100%; }
  .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
  .section-title { font-family: var(--font-display); font-size: 1.6rem; }
  .section-sub { color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; }

  .card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; transition: all 0.25s; }
  .card:hover { border-color: var(--border-hover); background: var(--bg-surface-2); }
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
  .cat-card { display: flex; gap: 14px; cursor: pointer; align-items: flex-start; }
  .cat-icon { width: 50px; height: 50px; flex-shrink: 0; background: var(--accent-dim); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(124,179,66,0.1); }
  .cat-name { font-weight: 700; font-size: 0.98rem; margin-bottom: 4px; }
  .cat-desc { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 8px; line-height: 1.5; }
  .cat-stats { display: flex; gap: 1.25rem; color: var(--text-secondary); font-size: 0.78rem; }

  .thread-list { display: flex; flex-direction: column; gap: 6px; }
  .thread-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 1.5rem; align-items: center; padding: 1rem 1.25rem; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; }
  .thread-row:hover { border-color: var(--accent); background: var(--bg-hover); }
  .thread-title { font-weight: 700; font-size: 0.94rem; display: flex; align-items: center; gap: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pin-badge { background: var(--amber-dim); color: var(--amber); font-size: 0.62rem; font-weight: 800; padding: 3px 9px; border-radius: 5px; flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.6px; }
  .thread-meta { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: 0.78rem; color: var(--text-muted); flex-wrap: wrap; }
  .thread-author-name { color: var(--accent); font-weight: 600; }
  .tag-chip { background: var(--bg-surface-3); color: var(--text-secondary); padding: 2px 8px; border-radius: 5px; font-size: 0.68rem; }
  .thread-num { text-align: center; min-width: 55px; color: var(--text-secondary); font-size: 0.85rem; }
  .thread-num-label { font-size: 0.68rem; color: var(--text-muted); }

  .tv-header { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.75rem; margin-bottom: 1.5rem; }
  .tv-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.75rem; }
  .tv-info { display: flex; gap: 1.5rem; flex-wrap: wrap; color: var(--text-muted); font-size: 0.85rem; }
  .post-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1rem; overflow: hidden; }
  .post-card.op-post { border-color: var(--accent); }
  .post-head { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.25rem; background: var(--bg-surface-2); border-bottom: 1px solid var(--border); }
  .post-avatar-wrap { display: flex; align-items: center; gap: 10px; }
  .post-avatar { width: 40px; height: 40px; background: var(--accent-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
  .post-uname { font-weight: 700; font-size: 0.9rem; }
  .role-badge { font-size: 0.66rem; font-weight: 700; padding: 2px 9px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
  .role-admin { background: rgba(255,191,0,0.15); color: #FFBF00; }
  .role-arch-developer { background: rgba(255,191,0,0.15); color: #FFBF00; }
  .role-core-architect { background: rgba(80,200,120,0.15); color: #50C878; }
  .role-systems-engineer { background: rgba(70,130,180,0.15); color: #4682B4; }
  .role-script-master { background: rgba(152,255,152,0.15); color: #98FF98; }
  .role-junior-dev { background: rgba(138,154,91,0.15); color: #8A9A5B; }
  .role-creative-director { background: rgba(183,110,121,0.15); color: #B76E79; }
  .role-ui-ux-specialist { background: rgba(143,0,255,0.15); color: #8F00FF; }
  .role-visual-artist { background: rgba(135,206,235,0.15); color: #87CEEB; }
  .role-3d-modeler { background: rgba(205,127,50,0.15); color: #CD7F32; }
  .role-content-creator { background: rgba(255,127,80,0.15); color: #FF7F50; }
  .role-tech-moderator { background: rgba(192,192,192,0.15); color: #C0C0C0; }
  .role-member { background: var(--bg-surface-3); color: var(--text-muted); }
  .cat-group-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: var(--amber); margin: 2rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
  .cat-group-title:first-child { margin-top: 0; }
  .post-date { color: var(--text-muted); font-size: 0.78rem; }
  .post-body { padding: 1.25rem; line-height: 1.85; font-size: 0.92rem; color: var(--text-secondary); white-space: pre-wrap; }
  .post-foot { display: flex; gap: 1rem; padding: 0.75rem 1.25rem; border-top: 1px solid var(--border); }
  .post-act { display: flex; align-items: center; gap: 5px; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; border: none; background: none; font-family: var(--font-body); transition: color 0.2s; }
  .post-act:hover { color: var(--accent); }
  .post-act.liked { color: var(--accent); }

  .reply-box { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; margin-top: 1.5rem; }
  .reply-box h3 { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
  .reply-area { width: 100%; min-height: 120px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; resize: vertical; outline: none; direction: ${dir}; }
  .reply-area:focus { border-color: var(--accent); }
  .reply-bar { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1rem; }

  .modal-bg { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.75); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeUp 0.2s ease; }
  @keyframes fadeUp { from { opacity:0; } to { opacity:1; } }
  .modal-box { background: var(--bg-surface); border: 1px solid var(--border-hover); border-radius: var(--radius); padding: 2.25rem; width: 100%; max-width: 480px; box-shadow: 0 0 60px var(--accent-glow); animation: modalSlide 0.3s ease; max-height: 90vh; overflow-y: auto; }
  @keyframes modalSlide { from { transform:translateY(16px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .modal-box h2 { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.4rem; text-align: center; }
  .modal-sub { color: var(--text-muted); font-size: 0.85rem; text-align: center; margin-bottom: 1.5rem; }
  .fg { margin-bottom: 1rem; } .fg-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 5px; }
  .fg-input { width: 100%; padding: 10px 14px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-xs); color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; outline: none; direction: ${dir}; }
  .fg-input:focus { border-color: var(--accent); }
  .modal-foot { text-align: center; margin-top: 1.25rem; color: var(--text-muted); font-size: 0.8rem; }
  .modal-foot button { background: none; border: none; color: var(--accent); cursor: pointer; font-family: var(--font-body); font-weight: 700; }
  .auth-error { color: var(--red); font-size: 0.8rem; text-align: center; margin-top: 0.75rem; padding: 8px; background: var(--red-dim); border-radius: var(--radius-xs); }
  .success-msg { color: var(--green); font-size: 0.8rem; text-align: center; margin-top: 0.75rem; padding: 8px; background: var(--green-dim); border-radius: var(--radius-xs); }
  .google-btn { width: 100%; padding: 12px 20px; border-radius: var(--radius-xs); background: #fff; border: 1px solid #dadce0; color: #3c4043; font-family: 'Roboto', var(--font-body); font-size: 0.9rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; transition: all 0.2s; }
  .google-btn:hover { background: #f7f8f8; border-color: #c6c6c6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .shop-card { cursor: pointer; overflow: hidden; }
  .shop-img { height: 130px; background: linear-gradient(135deg, var(--bg-surface-3), var(--accent-dim)); display: flex; align-items: center; justify-content: center; font-size: 3rem; border-bottom: 1px solid var(--border); }
  .shop-body { padding: 1.25rem; }
  .shop-cat { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--cyan); margin-bottom: 6px; }
  .shop-item-title { font-weight: 700; font-size: 0.98rem; margin-bottom: 5px; }
  .shop-desc { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.75rem; line-height: 1.5; }
  .shop-seller { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.78rem; margin-bottom: 0.75rem; }
  .shop-footer { display: flex; align-items: center; justify-content: space-between; }
  .shop-price { font-family: var(--font-display); font-size: 1.25rem; color: var(--amber); }
  .shop-stars { color: var(--text-secondary); font-size: 0.8rem; }

  .tabs { display: flex; gap: 2px; background: var(--bg-surface-2); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 1.5rem; width: fit-content; flex-wrap: wrap; }
  .tab { padding: 8px 18px; border-radius: var(--radius-xs); font-size: 0.84rem; font-weight: 600; color: var(--text-muted); cursor: pointer; border: none; background: none; font-family: var(--font-body); transition: all 0.2s; }
  .tab:hover { color: var(--text-secondary); } .tab.active { background: var(--accent); color: var(--bg-root); }

  .prof-header { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; display: flex; gap: 2rem; align-items: center; margin-bottom: 2rem; }
  .prof-avatar { width: 80px; height: 80px; background: var(--accent-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; flex-shrink: 0; border: 2px solid var(--accent); }
  .prof-stats { display: flex; gap: 2rem; margin-top: 0.75rem; }
  .prof-stat-v { font-weight: 800; font-size: 1.1rem; } .prof-stat-l { color: var(--text-muted); font-size: 0.73rem; }

  .search-input { flex: 1; padding: 10px 16px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-primary); font-family: var(--font-body); font-size: 0.88rem; outline: none; direction: ${dir}; }
  .search-input:focus { border-color: var(--accent); } .search-input::placeholder { color: var(--text-muted); }
  .search-bar { display: flex; gap: 8px; margin-bottom: 1.5rem; }
  .bread { display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted); }
  .bread button { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-family: var(--font-body); font-size: inherit; }
  .bread button:hover { color: var(--accent); }
  .select-field { width: 100%; padding: 10px 14px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-xs); color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; outline: none; appearance: none; }
  .select-field option { background: var(--bg-surface); }

  .notif-panel { position: absolute; top: 100%; right: 0; width: 360px; max-height: 400px; overflow-y: auto; background: var(--bg-surface); border: 1px solid var(--border-hover); border-radius: var(--radius); box-shadow: 0 8px 40px rgba(0,0,0,0.5); z-index: 200; }
  .notif-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); }
  .notif-item { padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--border); font-size: 0.85rem; cursor: pointer; transition: background 0.2s; }
  .notif-item:hover { background: var(--bg-hover); }
  .notif-item.unread { background: var(--accent-dim); }
  .notif-time { color: var(--text-muted); font-size: 0.72rem; margin-top: 4px; }

  .product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
  .product-img-lg { height: 280px; background: linear-gradient(135deg, var(--bg-surface-3), var(--accent-dim)); display: flex; align-items: center; justify-content: center; font-size: 5rem; border-radius: var(--radius); border: 1px solid var(--border); }
  .review-card { background: var(--bg-surface-2); border-radius: var(--radius-sm); padding: 1rem; margin-top: 0.75rem; }
  .stars-select { display: flex; gap: 4px; margin-bottom: 0.75rem; }
  .star-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }

  .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--bg-surface-2); border: 1px solid var(--accent); color: var(--accent); padding: 12px 24px; border-radius: var(--radius); font-size: 0.88rem; font-weight: 600; z-index: 2000; animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards; box-shadow: 0 4px 24px var(--accent-glow); }
  @keyframes toastIn { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%); opacity: 1; } }
  @keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }

  .footer { background: var(--bg-surface); border-top: 1px solid var(--border); padding: 2rem; text-align: center; margin-top: auto; }
  .footer-links { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .footer-link { color: var(--text-muted); font-size: 0.8rem; cursor: pointer; border: none; background: none; font-family: var(--font-body); }
  .footer-link:hover { color: var(--accent); }
  .footer-copy { color: var(--text-muted); font-size: 0.72rem; }

  .empty { text-align: center; padding: 3rem; color: var(--text-muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }
  .loading { text-align: center; padding: 3rem; color: var(--text-muted); }
  .spinner { display: inline-block; width: 24px; height: 24px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 0.75rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade { animation: fadeUp 0.4s ease; }
  .stagger > * { animation: modalSlide 0.35s ease both; }
  .stagger > *:nth-child(1) { animation-delay: 0ms; } .stagger > *:nth-child(2) { animation-delay: 40ms; }
  .stagger > *:nth-child(3) { animation-delay: 80ms; } .stagger > *:nth-child(4) { animation-delay: 120ms; }
  .stagger > *:nth-child(5) { animation-delay: 160ms; } .stagger > *:nth-child(6) { animation-delay: 200ms; }

  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; } .cat-grid { grid-template-columns: 1fr; }
    .thread-row { grid-template-columns: 1fr; gap: 0.5rem; } .thread-num { display: none; }
    .shop-grid { grid-template-columns: 1fr; } .prof-header { flex-direction: column; text-align: center; }
    .nav-links { display: none; } .hero-stats { gap: 1.5rem; }
    .product-detail { grid-template-columns: 1fr; } .notif-panel { width: 300px; right: -50px; }
  }
`;

// ============================================================
// UTILITIES
// ============================================================
function Loading() { const t = useLang(); return <div className="loading"><div className="spinner"></div><p>{t.loading}</p></div>; }
function ErrorMsg({ message, onRetry }) { const t = useLang(); return <div className="empty"><div className="empty-icon">⚠️</div><p style={{ marginBottom: "1rem" }}>{message || t.error}</p>{onRetry && <button className="btn btn-accent btn-sm" onClick={onRetry}>{t.tryAgain}</button>}</div>; }
function Toast({ msg }) { return msg ? <div className="toast">{msg}</div> : null; }

// ============================================================
// NAVBAR — with notifications
// ============================================================
function Navbar({ page, setPage, user, setShowAuth, lang, toggleLang, toast }) {
  const t = useLang();
  const [notifs, setNotifs] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (user) api("/api/notifications").then(n => { setNotifs(n); setUnread(n.filter(x => !x.is_read).length); }).catch(() => {});
  }, [user, page]);

  const markRead = async () => {
    try { await api("/api/notifications/read", { method: "PUT" }); setUnread(0); setNotifs(n => n.map(x => ({ ...x, is_read: true }))); } catch {}
  };

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("home")}>
        <div className="nav-logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="38" height="38">
            <defs>
              <linearGradient id="n1" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#9ccc65"/><stop offset="40%" stopColor="#7cb342"/><stop offset="100%" stopColor="#558b2f"/></linearGradient>
              <linearGradient id="n2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7cb342"/><stop offset="100%" stopColor="#4a6b2a"/></linearGradient>
              <linearGradient id="n3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f9a825"/><stop offset="100%" stopColor="#c88a10"/></linearGradient>
            </defs>
            <g transform="translate(100,90)">
              <path d="M0,-75 Q-44,-40 -44,-16 Q-44,4 -28,12 Q-14,18 0,18 Q14,18 28,12 Q44,4 44,-16 Q44,-40 0,-75 Z" fill="url(#n1)"/>
              <path d="M0,-70 L0,16" stroke="#558b2f" strokeWidth="1.5" fill="none" opacity="0.3"/>
              <rect x="-4" y="16" width="8" height="20" rx="2" fill="url(#n2)"/>
              <line x1="0" y1="36" x2="0" y2="58" stroke="url(#n3)" strokeWidth="2.5"/>
              <polyline points="0,44 -20,44 -20,56 -38,56" stroke="url(#n3)" strokeWidth="2" fill="none"/>
              <polyline points="0,44 20,44 20,56 38,56" stroke="url(#n3)" strokeWidth="2" fill="none"/>
              <circle cx="-20" cy="44" r="3" fill="#0c0f0a" stroke="#f9a825" strokeWidth="1.5"/><circle cx="-20" cy="44" r="1.2" fill="#f9a825"/>
              <circle cx="20" cy="44" r="3" fill="#0c0f0a" stroke="#f9a825" strokeWidth="1.5"/><circle cx="20" cy="44" r="1.2" fill="#f9a825"/>
              <circle cx="0" cy="58" r="3" fill="#0c0f0a" stroke="#f9a825" strokeWidth="1.5"/><circle cx="0" cy="58" r="1.2" fill="#f9a825"/>
              <circle cx="-38" cy="56" r="2" fill="#f9a825" opacity="0.85"/>
              <circle cx="38" cy="56" r="2" fill="#f9a825" opacity="0.85"/>
            </g>
          </svg>
        </div><span className="nav-brand-text">{t.brand}</span>
      </div>
      <div className="nav-links">
        {["home", "forums", "shop"].map(p => <button key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{t[p]}</button>)}
        {user && <button className={`nav-link ${page === "profile" ? "active" : ""}`} onClick={() => setPage("profile")}>{t.profile}</button>}
        {user && ["admin", "tech-moderator", "arch-developer"].includes(user.role) && <button className={`nav-link ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")} style={{ color: page === "admin" ? "var(--amber)" : undefined }}>🛡️ Admin</button>}
      </div>
      <div className="nav-actions">
        <button className="lang-toggle" onClick={toggleLang}>{lang === "en" ? "العربية" : "English"}</button>
        {user && (
          <div style={{ position: "relative" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowNotifs(!showNotifs)} style={{ fontSize: "1.1rem", padding: "6px 10px" }}>
              🔔{unread > 0 && <span className="notif-badge" />}
            </button>
            {showNotifs && (
              <div className="notif-panel">
                <div className="notif-header">
                  <strong style={{ fontSize: "0.9rem" }}>{t.notifications}</strong>
                  {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markRead}>{t.markAllRead}</button>}
                </div>
                {notifs.length > 0 ? notifs.slice(0, 10).map(n => (
                  <div key={n.id} className={`notif-item ${n.is_read ? "" : "unread"}`}>
                    <div>{n.message}</div>
                    <div className="notif-time">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                )) : <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>{t.noNotifications}</div>}
              </div>
            )}
          </div>
        )}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.avatar} {user.username}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAuth("logout")}>{t.logout}</button>
          </div>
        ) : (
          <><button className="btn btn-ghost btn-sm" onClick={() => setShowAuth("login")}>{t.signIn}</button><button className="btn btn-accent btn-sm" onClick={() => setShowAuth("register")}>{t.join}</button></>
        )}
      </div>
    </nav>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({ setPage }) {
  const t = useLang();
  const [stats, setStats] = useState({ developers: 0, discussions: 0, projectsShared: 0, posts: 0 });
  useEffect(() => { api("/api/stats/public").then(setStats).catch(() => {}); }, []);
  const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K+" : n.toLocaleString();
  return (
    <section className="hero">
      <div className="hero-pattern" />
      <div className="hero-content fade">
        <div style={{ marginBottom: "1.5rem" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 350" style={{ width: "min(600px, 90vw)", height: "auto" }}>
            <defs>
              <linearGradient id="d1" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#9ccc65"/><stop offset="40%" stopColor="#7cb342"/><stop offset="100%" stopColor="#558b2f"/></linearGradient>
              <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7cb342"/><stop offset="100%" stopColor="#4a6b2a"/></linearGradient>
              <linearGradient id="d3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f9a825"/><stop offset="100%" stopColor="#c88a10"/></linearGradient>
              <linearGradient id="d4" x1="0.5" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#7cb342" stopOpacity="0.15"/><stop offset="100%" stopColor="transparent"/></linearGradient>
              <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#7cb342" floodOpacity="0.3"/></filter>
            </defs>
            <g transform="translate(175,175)">
              <circle cx="0" cy="-15" r="80" fill="url(#d4)"/>
              <path d="M0,-95 Q-55,-50 -55,-20 Q-55,5 -35,15 Q-18,22 0,22 Q18,22 35,15 Q55,5 55,-20 Q55,-50 0,-95 Z" fill="url(#d1)" filter="url(#sh)"/>
              <path d="M-15,-70 Q-35,-45 -35,-25 Q-35,-10 -20,-3" fill="#8bc34a" opacity="0.3"/>
              <path d="M10,-65 Q25,-40 25,-22 Q25,-8 15,0" fill="#aed581" opacity="0.2"/>
              <path d="M0,-90 L0,20" stroke="#558b2f" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M0,-60 L-25,-30" stroke="#558b2f" strokeWidth="1" fill="none" opacity="0.2"/>
              <path d="M0,-60 L25,-30" stroke="#558b2f" strokeWidth="1" fill="none" opacity="0.2"/>
              <rect x="-5" y="20" width="10" height="25" rx="3" fill="url(#d2)"/>
              <line x1="0" y1="45" x2="0" y2="75" stroke="url(#d3)" strokeWidth="2.5"/>
              <polyline points="0,55 -25,55 -25,70 -50,70" stroke="url(#d3)" strokeWidth="2.5" fill="none"/>
              <polyline points="-25,55 -25,45 -40,45" stroke="url(#d3)" strokeWidth="1.8" fill="none"/>
              <polyline points="-50,70 -50,80 -40,80" stroke="url(#d3)" strokeWidth="1.5" fill="none"/>
              <polyline points="0,55 25,55 25,70 50,70" stroke="url(#d3)" strokeWidth="2.5" fill="none"/>
              <polyline points="25,55 25,45 40,45" stroke="url(#d3)" strokeWidth="1.8" fill="none"/>
              <polyline points="50,70 50,80 40,80" stroke="url(#d3)" strokeWidth="1.5" fill="none"/>
              <polyline points="0,75 -12,75 -12,85" stroke="url(#d3)" strokeWidth="1.5" fill="none"/>
              <polyline points="0,75 12,75 12,85" stroke="url(#d3)" strokeWidth="1.5" fill="none"/>
              <circle cx="-25" cy="55" r="3.5" fill="#0c0f0a" stroke="#f9a825" strokeWidth="2"/><circle cx="-25" cy="55" r="1.5" fill="#f9a825"/>
              <circle cx="25" cy="55" r="3.5" fill="#0c0f0a" stroke="#f9a825" strokeWidth="2"/><circle cx="25" cy="55" r="1.5" fill="#f9a825"/>
              <circle cx="0" cy="55" r="3" fill="#0c0f0a" stroke="#f9a825" strokeWidth="2"/><circle cx="0" cy="55" r="1.2" fill="#f9a825"/>
              <circle cx="-50" cy="70" r="3.5" fill="#0c0f0a" stroke="#f9a825" strokeWidth="2"/><circle cx="-50" cy="70" r="1.5" fill="#f9a825"/>
              <circle cx="50" cy="70" r="3.5" fill="#0c0f0a" stroke="#f9a825" strokeWidth="2"/><circle cx="50" cy="70" r="1.5" fill="#f9a825"/>
              <circle cx="0" cy="75" r="3" fill="#0c0f0a" stroke="#f9a825" strokeWidth="2"/><circle cx="0" cy="75" r="1.2" fill="#f9a825"/>
              <circle cx="-40" cy="45" r="2.5" fill="#f9a825"/><circle cx="40" cy="45" r="2.5" fill="#f9a825"/>
              <circle cx="-40" cy="80" r="2" fill="#f9a825" opacity="0.7"/><circle cx="40" cy="80" r="2" fill="#f9a825" opacity="0.7"/>
              <circle cx="-12" cy="85" r="2" fill="#f9a825" opacity="0.7"/><circle cx="12" cy="85" r="2" fill="#f9a825" opacity="0.7"/>
            </g>
            <g transform="translate(310,155)">
              <text x="0" y="20" fontFamily="Georgia,Palatino,serif" fontSize="68" fontWeight="bold" letterSpacing="-2"><tspan fill="#8bc34a">Dev</tspan><tspan fill="#f9a825">Roots</tspan></text>
              <line x1="2" y1="34" x2="300" y2="34" stroke="#f9a825" strokeWidth="1" opacity="0.3"/>
              <circle cx="2" cy="34" r="2" fill="#f9a825" opacity="0.5"/><circle cx="300" cy="34" r="2" fill="#f9a825" opacity="0.5"/>
              <text x="3" y="58" fontFamily="Helvetica Neue,Arial,sans-serif" fontSize="14.5" fill="#9ca895" letterSpacing="4.5" fontWeight="300">RAPPELZ DEVELOPER COMMUNITY</text>
            </g>
          </svg>
        </div>
        <h1>{t.heroTitle.split(" ").slice(0, -1).join(" ")} <span className="highlight">{t.heroTitle.split(" ").slice(-1)}</span></h1>
        <p>{t.heroDesc}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-accent" onClick={() => setPage("forums")}>{t.browseForums}</button>
          <button className="btn btn-surface" onClick={() => setPage("shop")}>{t.developerShop}</button>
        </div>
        <div className="hero-stats">
          {[[fmt(stats.developers), t.developers], [fmt(stats.discussions), t.discussions], [fmt(stats.projectsShared), t.projectsShared], [fmt(stats.posts), t.posts]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}><div className="hero-stat-val">{v}</div><div className="hero-stat-label">{l}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// AUTH MODAL
// ============================================================
function AuthModal({ mode, setMode, onClose, onLogin }) {
  const t = useLang();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";
  const firebaseReady = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";

  const handleGoogleSignIn = async () => {
    setError(""); setLoading(true);
    try {
      if (!firebaseAuth || !googleProvider) {
        await initFirebase();
        if (!firebaseAuth) { setError("Firebase not configured"); setLoading(false); return; }
      }
      const { signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      const data = await api("/api/auth/firebase", {
        method: "POST",
        body: JSON.stringify({
          idToken,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid
        })
      });
      localStorage.setItem("devroots_token", data.token);
      onLogin(data.user); onClose();
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") { setLoading(false); return; }
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (!isLogin && form.password !== form.confirm) { setError("Passwords don't match"); setLoading(false); return; }
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { email: form.email, password: form.password } : { username: form.username, email: form.email, password: form.password };
      const data = await api(endpoint, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("devroots_token", data.token);
      onLogin(data.user); onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>{isLogin ? t.welcomeBack : t.joinCommunity}</h2>
        <p className="modal-sub">{isLogin ? t.signInAccount : t.createAccount}</p>
        
        {/* Firebase Google Sign-In Button */}
        {firebaseReady && (
          <>
            <button className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
              <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }}></div>
            </div>
          </>
        )}

        {!isLogin && <div className="fg"><label className="fg-label">{t.username}</label><input className="fg-input" placeholder={t.chooseUsername} value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></div>}
        <div className="fg"><label className="fg-label">{t.email}</label><input className="fg-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.password}</label><input className="fg-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} onKeyDown={e => e.key === "Enter" && isLogin && handleSubmit()} /></div>
        {!isLogin && <div className="fg"><label className="fg-label">{t.confirmPassword}</label><input className="fg-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>}
        {error && <div className="auth-error">{error}</div>}
        <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={handleSubmit} disabled={loading}>{loading ? "..." : isLogin ? t.signInBtn : t.createAccountBtn}</button>
        <div className="modal-foot">{isLogin ? <>{t.noAccount} <button onClick={() => { setMode("register"); setError(""); }}>{t.signUp}</button></> : <>{t.haveAccount} <button onClick={() => { setMode("login"); setError(""); }}>{t.signIn}</button></>}</div>
      </div>
    </div>
  );
}

// ============================================================
// FORUMS
// ============================================================
function ForumsHome({ nav, user, setShowAuth, lang }) {
  const t = useLang();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const load = async () => { setLoading(true); setError(null); try { setCategories(await api("/api/forums/categories")); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleSearch = async () => {
    if (!search.trim()) { setSearchResults(null); return; }
    try { const r = await api(`/api/search?q=${encodeURIComponent(search)}`); setSearchResults(r); } catch {}
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">{t.communityForums}</h2><p className="section-sub">{t.browseCategories}</p></div>
        <button className="btn btn-accent" onClick={() => { if (!user) { setShowAuth("login"); return; } nav({ v: "new" }); }}>{t.newThread}</button>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder={t.searchForums} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()} />
        <button className="btn btn-surface" onClick={handleSearch}>🔍 {t.search}</button>
      </div>
      {searchResults ? (
        <div className="fade">
          <div className="section-head"><h3 className="section-title">{t.searchResults}</h3><button className="btn btn-ghost btn-sm" onClick={() => { setSearchResults(null); setSearch(""); }}>✕ {t.cancel}</button></div>
          {searchResults.threads?.length > 0 ? (
            <div className="thread-list stagger">
              {searchResults.threads.map(th => (
                <div key={th.id} className="thread-row" onClick={() => nav({ v: "thread", id: th.id })}>
                  <div><div className="thread-title">{lang === "ar" ? th.title_ar || th.title : th.title}</div>
                  <div className="thread-meta"><span className="thread-author-name">{th.author_avatar} {th.author_name}</span></div></div>
                  <div className="thread-num"><div>{th.reply_count || 0}</div><div className="thread-num-label">{t.replies}</div></div>
                  <div className="thread-num"><div>{th.view_count}</div><div className="thread-num-label">{t.views}</div></div>
                  <div className="thread-num"><div style={{ fontSize: "0.78rem" }}>{new Date(th.created_at).toLocaleDateString()}</div></div>
                </div>
              ))}
            </div>
          ) : <div className="empty"><div className="empty-icon">🔍</div><p>No results found</p></div>}
          {searchResults.products?.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "1rem", fontWeight: 700 }}>{t.products}</h3>
              {searchResults.products.map(p => <div key={p.id} className="card" style={{ marginBottom: 8, cursor: "pointer" }}><strong>{p.image} {p.title}</strong> — ${p.price}</div>)}
            </div>
          )}
        </div>
      ) : (
        <div className="stagger">
          {CATEGORY_GROUPS.map(g => {
            const groupCats = g.slugs.map(s => categories.find(c => c.slug === s)).filter(Boolean);
            if (groupCats.length === 0) return null;
            return (
              <div key={g.title}>
                <div className="cat-group-title">{lang === "ar" ? g.titleAr : g.title}</div>
                <div className="cat-grid">
                  {groupCats.map(c => (
                    <div key={c.id} className="card cat-card" onClick={() => nav({ v: "cat", slug: c.slug, name: lang === "ar" ? c.name_ar : c.name })}>
                      <div className="cat-icon">{c.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="cat-name">{lang === "ar" ? c.name_ar || c.name : c.name}</div>
                        <div className="cat-desc">{lang === "ar" ? c.description_ar || c.description : c.description}</div>
                        <div className="cat-stats"><span>📝 {c.thread_count} {t.threads}</span><span>💬 {c.post_count} {t.posts}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* Show uncategorized */}
          {categories.filter(c => !CATEGORY_GROUPS.some(g => g.slugs.includes(c.slug))).map(c => (
            <div key={c.id} className="card cat-card" onClick={() => nav({ v: "cat", slug: c.slug, name: lang === "ar" ? c.name_ar : c.name })}>
              <div className="cat-icon">{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="cat-name">{lang === "ar" ? c.name_ar || c.name : c.name}</div>
                <div className="cat-desc">{lang === "ar" ? c.description_ar || c.description : c.description}</div>
                <div className="cat-stats"><span>📝 {c.thread_count} {t.threads}</span><span>💬 {c.post_count} {t.posts}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryView({ slug, catName, nav, user, setShowAuth, lang }) {
  const t = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = async () => { setLoading(true); setError(null); try { setData(await api(`/api/forums/categories/${slug}/threads`)); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [slug]);
  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;
  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.forums}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{catName}</span></div>
      <div className="section-head"><div><h2 className="section-title">{catName}</h2></div>
        <button className="btn btn-accent" onClick={() => { if (!user) { setShowAuth("login"); return; } nav({ v: "new", catId: data?.category?.id }); }}>{t.newThread}</button></div>
      {data?.threads?.length > 0 ? (
        <div className="thread-list stagger">
          {data.threads.map(th => (
            <div key={th.id} className="thread-row" onClick={() => nav({ v: "thread", id: th.id })}>
              <div><div className="thread-title">{th.is_pinned && <span className="pin-badge">{t.pinned}</span>}{lang === "ar" ? th.title_ar || th.title : th.title}</div>
                <div className="thread-meta"><span className="thread-author-name">{th.author_avatar} {th.author_name}</span><span>·</span><span>{new Date(th.created_at).toLocaleDateString()}</span></div></div>
              <div className="thread-num"><div>{th.reply_count || 0}</div><div className="thread-num-label">{t.replies}</div></div>
              <div className="thread-num"><div>{th.view_count}</div><div className="thread-num-label">{t.views}</div></div>
              <div className="thread-num"><div style={{ fontSize: "0.78rem" }}>{new Date(th.last_post_at || th.created_at).toLocaleDateString()}</div><div className="thread-num-label">{t.lastPost}</div></div>
            </div>
          ))}
        </div>
      ) : <div className="empty"><div className="empty-icon">📭</div><p>{t.noThreads}</p></div>}
    </div>
  );
}

function ThreadView({ threadId, nav, user, setShowAuth, lang, showToast }) {
  const t = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const load = async () => { setLoading(true); setError(null); try { setData(await api(`/api/forums/threads/${threadId}`)); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [threadId]);

  const handleReply = async () => {
    if (!user) { setShowAuth("login"); return; }
    if (!reply.trim()) return;
    setPosting(true);
    try { await api(`/api/forums/threads/${threadId}/reply`, { method: "POST", body: JSON.stringify({ content: reply }) }); setReply(""); load(); } catch (err) { alert(err.message); } finally { setPosting(false); }
  };
  const handleLike = async (postId) => {
    if (!user) { setShowAuth("login"); return; }
    try { await api(`/api/forums/posts/${postId}/like`, { method: "POST" }); setLikedPosts(s => new Set([...s, postId])); load(); } catch {}
  };
  const handleShare = (threadId) => { navigator.clipboard.writeText(window.location.origin + "/#thread-" + threadId); showToast(t.copiedLink); };
  const handleReport = () => { showToast(t.reportSent); };

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;
  if (!data) return null;
  const { thread, posts, tags } = data;

  return (
    <div className="fade">
      <div className="bread">
        <button onClick={() => nav(null)}>{t.forums}</button><span>›</span>
        <button onClick={() => nav({ v: "cat", slug: thread.category_slug, name: lang === "ar" ? thread.category_name_ar : thread.category_name })}>{lang === "ar" ? thread.category_name_ar : thread.category_name}</button><span>›</span>
        <span style={{ color: "var(--text-primary)" }}>{lang === "ar" ? "الموضوع" : "Thread"}</span>
      </div>
      <div className="tv-header">
        <div className="tv-title">{lang === "ar" ? thread.title_ar || thread.title : thread.title}</div>
        <div className="tv-info"><span>{t.by} <strong style={{ color: "var(--accent)" }}>{thread.author_name}</strong></span><span>👁 {thread.view_count} {t.views}</span></div>
        {tags?.length > 0 && <div style={{ display: "flex", gap: 6, marginTop: "0.75rem", flexWrap: "wrap" }}>{tags.map(tg => <span key={tg} className="tag-chip">{tg}</span>)}</div>}
      </div>
      <div className="stagger">
        {posts.map((p, i) => (
          <div key={p.id} className={`post-card ${i === 0 ? "op-post" : ""}`}>
            <div className="post-head">
              <div className="post-avatar-wrap"><div className="post-avatar">{p.author_avatar}</div><div><div className="post-uname" style={{ color: getRoleColor(p.author_role) }}>{p.author_name}</div><span className={`role-badge role-${p.author_role}`}>{getRoleLabel(p.author_role, lang)}</span></div></div>
              <div className="post-date">{new Date(p.created_at).toLocaleDateString()}</div>
            </div>
            <div className="post-body">{lang === "ar" ? p.content_ar || p.content : p.content}</div>
            <div className="post-foot">
              <button className={`post-act ${likedPosts.has(p.id) ? "liked" : ""}`} onClick={() => handleLike(p.id)}>👍 {p.like_count || 0}</button>
              <button className="post-act" onClick={() => handleShare(threadId)}>🔗 {t.share}</button>
              <button className="post-act" onClick={handleReport}>🚩 {t.report}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="reply-box">
        <h3>{t.postReply}</h3>
        <textarea className="reply-area" placeholder={user ? t.writeReply : t.signInToReply} value={reply} onChange={e => setReply(e.target.value)} disabled={!user} />
        <div className="reply-bar"><button className="btn btn-accent btn-sm" onClick={handleReply} disabled={posting || !user}>{posting ? "..." : user ? t.postReplyBtn : t.signInToReplyBtn}</button></div>
      </div>
    </div>
  );
}

function NewThreadForm({ nav, catId, lang }) {
  const t = useLang();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", category: catId || "", content: "", tags: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => { api("/api/forums/categories").then(setCategories).catch(() => {}); }, []);
  const handleCreate = async () => {
    if (!form.category || !form.title || !form.content) return;
    setLoading(true);
    try {
      const body = { category_id: parseInt(form.category), title: form.title, content: form.content, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [] };
      const thread = await api("/api/forums/threads", { method: "POST", body: JSON.stringify(body) });
      nav({ v: "thread", id: thread.id });
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };
  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.forums}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{t.createNewThread}</span></div>
      <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>{t.createNewThread}</h2>
      <div style={{ maxWidth: 760 }}>
        <div className="fg"><label className="fg-label">{t.category}</label>
          <select className="select-field fg-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="">{t.selectCategory}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {lang === "ar" ? c.name_ar || c.name : c.name}</option>)}</select></div>
        <div className="fg"><label className="fg-label">{t.title}</label><input className="fg-input" placeholder={t.threadTitlePlaceholder} value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.tags}</label><input className="fg-input" placeholder={t.tagsPlaceholder} value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.content}</label><textarea className="reply-area" style={{ minHeight: 200 }} placeholder={t.contentPlaceholder} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
        <div style={{ display: "flex", gap: 10 }}><button className="btn btn-accent" onClick={handleCreate} disabled={loading}>{loading ? "..." : t.createThread}</button><button className="btn btn-surface" onClick={() => nav(null)}>{t.cancel}</button></div>
      </div>
    </div>
  );
}

function ForumsPage({ user, setShowAuth, lang, showToast }) {
  const [state, setState] = useState(null);
  if (state?.v === "cat") return <CategoryView slug={state.slug} catName={state.name} nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
  if (state?.v === "thread") return <ThreadView threadId={state.id} nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} showToast={showToast} />;
  if (state?.v === "new") return <NewThreadForm nav={setState} catId={state.catId} lang={lang} />;
  return <ForumsHome nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
}

// ============================================================
// SHOP — with product detail, sell form, reviews
// ============================================================
function ProductDetail({ product, nav, user, setShowAuth, lang, showToast }) {
  const t = useLang();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => { api(`/api/shop/products/${product.id}`).then(d => setDetail(d)).catch(() => {}).finally(() => setLoading(false)); }, [product.id]);

  const handlePurchase = async () => {
    if (!user) { setShowAuth("login"); return; }
    setPurchasing(true);
    try { await api(`/api/shop/products/${product.id}/purchase`, { method: "POST" }); showToast(t.bought); } catch (err) { alert(err.message); } finally { setPurchasing(false); }
  };
  const handleReview = async () => {
    if (!user) { setShowAuth("login"); return; }
    if (!reviewText.trim()) return;
    try { await api(`/api/shop/products/${product.id}/review`, { method: "POST", body: JSON.stringify({ rating, comment: reviewText }) }); setReviewText(""); showToast(t.submitReview + " ✅"); } catch (err) { alert(err.message); }
  };

  if (loading) return <Loading />;
  const p = detail || product;

  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.developerShop}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{lang === "ar" ? p.title_ar || p.title : p.title}</span></div>
      <div className="product-detail">
        <div>
          <div className="product-img-lg">{p.image || "📦"}</div>
          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginBottom: "0.75rem", fontWeight: 700 }}>{t.reviews}</h3>
            {detail?.reviews?.length > 0 ? detail.reviews.map((r, i) => (
              <div key={i} className="review-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <strong style={{ fontSize: "0.88rem" }}>{r.username}</strong>
                  <span style={{ color: "var(--amber)" }}>{"⭐".repeat(r.rating)}</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{r.comment}</p>
              </div>
            )) : <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No reviews yet</p>}
            {user && (
              <div style={{ marginTop: "1rem" }}>
                <div className="stars-select">{[1,2,3,4,5].map(s => <button key={s} className="star-btn" onClick={() => setRating(s)}>{s <= rating ? "⭐" : "☆"}</button>)}</div>
                <textarea className="reply-area" style={{ minHeight: 80 }} placeholder={t.writeReview} value={reviewText} onChange={e => setReviewText(e.target.value)} />
                <button className="btn btn-accent btn-sm" style={{ marginTop: 8 }} onClick={handleReview}>{t.submitReview}</button>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="shop-cat">{p.category}</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginBottom: "0.75rem" }}>{lang === "ar" ? p.title_ar || p.title : p.title}</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "1.5rem" }}>{lang === "ar" ? p.description_ar || p.description : p.description}</p>
          <div className="shop-seller" style={{ fontSize: "0.88rem", marginBottom: "1rem" }}>👤 {t.seller}: <strong style={{ color: "var(--accent)" }}>{p.seller_name}</strong></div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <span className="shop-stars">⭐ {p.average_rating || "N/A"}</span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{p.total_sales || 0} {t.sold}</span>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--amber)", marginBottom: "1.5rem" }}>{p.price > 0 ? `$${p.price}` : t.free}</div>
          <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", padding: "14px 24px" }} onClick={handlePurchase} disabled={purchasing}>{purchasing ? "..." : p.price > 0 ? `${t.buy} — $${p.price}` : `${t.buy} — ${t.free}`}</button>
        </div>
      </div>
    </div>
  );
}

function SellProductModal({ onClose, showToast, lang }) {
  const t = useLang();
  const [form, setForm] = useState({ title: "", description: "", price: "0", category: "Tools", image: "📦" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    setLoading(true); setError("");
    try {
      await api("/api/shop/products", { method: "POST", body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }) });
      showToast(t.submitProduct + " ✅");
      onClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <h2>{t.sellProject}</h2>
        <p className="modal-sub">{t.pendingApproval}</p>
        <div className="fg"><label className="fg-label">{t.productTitle}</label><input className="fg-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.productDesc}</label><textarea className="reply-area" style={{ minHeight: 100 }} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="fg"><label className="fg-label">{t.productPrice}</label><input className="fg-input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
          <div className="fg"><label className="fg-label">{t.productImage}</label><input className="fg-input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
        </div>
        <div className="fg"><label className="fg-label">{t.productCategory}</label>
          <select className="select-field fg-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {["Tools", "Server Files", "Scripts", "Mods", "Textures", "Guides", "Security", "Other"].map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        {error && <div className="auth-error">{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn btn-accent" style={{ flex: 1, justifyContent: "center" }} onClick={handleSubmit} disabled={loading}>{loading ? "..." : t.submitProduct}</button>
          <button className="btn btn-surface" onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

function ShopPage({ user, setShowAuth, lang, showToast }) {
  const t = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showSell, setShowSell] = useState(false);

  const load = async () => { setLoading(true); setError(null); try { setProducts(await api("/api/shop/products")); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  if (selected) return <ProductDetail product={selected} nav={(s) => { setSelected(null); if (s === null) load(); }} user={user} setShowAuth={setShowAuth} lang={lang} showToast={showToast} />;
  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;

  const categories = ["all", ...new Set(products.map(i => i.category).filter(Boolean))];
  const filtered = filter === "all" ? products : products.filter(i => i.category === filter);

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">{t.developerShop}</h2><p className="section-sub">{t.shopDesc}</p></div>
        <button className="btn btn-amber" onClick={() => { if (!user) { setShowAuth("login"); return; } setShowSell(true); }}>🏷️ {t.sellProject}</button>
      </div>
      {categories.length > 1 && <div className="tabs">{categories.map(c => <button key={c} className={`tab ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c === "all" ? t.all : c}</button>)}</div>}
      {filtered.length > 0 ? (
        <div className="shop-grid stagger">
          {filtered.map(item => (
            <div key={item.id} className="card shop-card" onClick={() => setSelected(item)}>
              <div className="shop-img">{item.image || "📦"}</div>
              <div className="shop-body">
                <div className="shop-cat">{item.category}</div>
                <div className="shop-item-title">{lang === "ar" ? item.title_ar || item.title : item.title}</div>
                <div className="shop-desc">{lang === "ar" ? item.description_ar || item.description : item.description}</div>
                <div className="shop-seller">{item.seller_avatar} {item.seller_name}</div>
                <div className="shop-footer">
                  <div className="shop-price">{item.price > 0 ? `$${item.price}` : t.free}</div>
                  <div className="shop-stars">⭐ {item.average_rating || "N/A"} ({item.total_sales || 0} {t.sold})</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="empty"><div className="empty-icon">🏪</div><p>{t.noProducts}</p></div>}
      {showSell && <SellProductModal onClose={() => { setShowSell(false); load(); }} showToast={showToast} lang={lang} />}
    </div>
  );
}

// ============================================================
// ADMIN — stats, users, products, logs
// ============================================================
function AdminPage({ user, lang, showToast }) {
  const t = useLang();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    if (tab === "stats") api("/api/admin/stats").then(setStats).catch(() => {}).finally(() => setLoading(false));
    if (tab === "users") api("/api/admin/users").then(setUsers).catch(() => {}).finally(() => setLoading(false));
    if (tab === "logs") api("/api/admin/logs").then(setLogs).catch(() => {}).finally(() => setLoading(false));
    if (tab === "products") {
      api("/api/admin/stats").then(s => {
        setStats(s);
        return api("/api/admin/users");
      }).then(() => setLoading(false)).catch(() => setLoading(false));
    }
    if (tab === "roles") setLoading(false);
  }, [tab]);

  const handleBan = async (userId, ban) => {
    const reason = ban ? prompt("Ban reason:") : null;
    if (ban && !reason) return;
    try { await api(`/api/admin/users/${userId}/ban`, { method: "PUT", body: JSON.stringify({ ban, reason }) }); showToast(ban ? "User banned" : "User unbanned"); api("/api/admin/users").then(setUsers); } catch (e) { alert(e.message); }
  };
  const handleRole = async (userId, role) => {
    try { await api(`/api/admin/users/${userId}/role`, { method: "PUT", body: JSON.stringify({ role }) }); showToast("Role updated to " + getRoleLabel(role, lang)); api("/api/admin/users").then(setUsers); } catch (e) { alert(e.message); }
  };
  const handleApprove = async (productId, approved) => {
    try { await api(`/api/admin/products/${productId}/approve`, { method: "PUT", body: JSON.stringify({ approved }) }); showToast(approved ? "Product approved ✅" : "Product rejected ❌"); } catch (e) { alert(e.message); }
  };
  const handleSeed = async () => {
    setSeeding(true); setSeedMsg("");
    try {
      const data = await api("/api/admin/seed", { method: "POST" });
      setSeedMsg(data.skipped ? "Already seeded!" : `✅ Created ${data.users} users, ${data.threads} threads, ${data.products} products!`);
      if (tab === "stats") api("/api/admin/stats").then(setStats);
    } catch (e) { setSeedMsg("❌ " + e.message); } setSeeding(false);
  };
  const handleResetCats = async () => {
    if (!confirm("This will DELETE all existing categories, threads, and posts, then create the new 10 categories. Are you sure?")) return;
    try { const data = await api("/api/admin/reset-categories", { method: "POST" }); showToast("✅ " + data.message); } catch (e) { alert(e.message); }
  };

  if (!user || !["admin", "tech-moderator", "arch-developer"].includes(user.role)) return <div className="empty"><div className="empty-icon">🔒</div><p>Admin access required</p></div>;

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">🛡️ Admin Dashboard</h2><p className="section-sub">Manage your DevRoots community</p></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-surface" onClick={handleResetCats}>🔄 Reset Categories</button>
          <button className="btn btn-accent" onClick={handleSeed} disabled={seeding}>{seeding ? "Seeding..." : "🌱 Seed Data"}</button>
        </div>
      </div>
      {seedMsg && <div style={{ padding: "12px 16px", background: seedMsg.startsWith("✅") ? "var(--green-dim)" : seedMsg.startsWith("Already") ? "var(--amber-dim)" : "var(--red-dim)", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.88rem" }}>{seedMsg}</div>}
      <div className="tabs">
        {[["stats", "📊 Stats"], ["users", "👥 Users"], ["roles", "🎖️ Roles"], ["products", "📦 Products"], ["logs", "📋 Logs"]].map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>
      {loading ? <Loading /> : <>
        {tab === "stats" && stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {[["👥", "Users", stats.users, "var(--accent)"], ["💬", "Threads", stats.threads, "var(--cyan)"], ["📝", "Posts", stats.posts, "var(--amber)"],
              ["📦", "Products", stats.products, "var(--green)"], ["⏳", "Pending", stats.pendingApprovals, "var(--copper)"], ["💰", "Revenue", "$" + (stats.totalRevenue || 0).toFixed(2), "var(--amber)"]
            ].map(([icon, label, value, color]) => (
              <div key={label} className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color }}>{value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                {["User", "Role", "Reputation", "Status", "Joined", "Actions"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "start", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: "1.3rem" }}>{u.avatar}</span><div><div style={{ fontWeight: 700, fontSize: "0.9rem", color: getRoleColor(u.role) }}>{u.username}</div><div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{u.email}</div></div></div></td>
                    <td style={{ padding: "12px 16px" }}>
                      <select className="select-field" value={u.role} onChange={e => handleRole(u.id, e.target.value)} style={{ width: "auto", padding: "4px 8px", fontSize: "0.78rem", background: "var(--bg-surface-2)", color: getRoleColor(u.role), fontWeight: 700, border: `1px solid ${getRoleColor(u.role)}30` }}>
                        {Object.entries(ROLES).map(([key, r]) => <option key={key} value={key} style={{ color: r.color }}>{r.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 700 }}>{u.reputation}</td>
                    <td style={{ padding: "12px 16px" }}>{u.is_banned ? <span style={{ color: "var(--red)", fontSize: "0.82rem", fontWeight: 700 }}>🚫 Banned</span> : <span style={{ color: "var(--green)", fontSize: "0.82rem" }}>✅ Active</span>}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "0.82rem" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: "12px 16px" }}>{u.role !== "admin" && <button className={`btn btn-sm ${u.is_banned ? "btn-green" : "btn-red"}`} onClick={() => handleBan(u.id, !u.is_banned)}>{u.is_banned ? "Unban" : "Ban"}</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "roles" && (
          <div>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.88rem" }}>All DevRoots roles ranked from highest to lowest authority. Assign roles from the Users tab.</p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {Object.entries(ROLES).map(([key, r]) => (
                <div key={key} className="card" style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", borderLeft: `4px solid ${r.color}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${r.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: r.color, flexShrink: 0 }}>#{r.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: r.color, fontSize: "1rem" }}>{r.label}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{r.labelAr}</div>
                  </div>
                  <span className={`role-badge role-${key}`}>{r.label}</span>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: r.color, flexShrink: 0 }}></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="empty"><div className="empty-icon">📦</div><p>Product management: approve/reject products from the API.</p><p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: "0.82rem" }}>Pending products: {stats?.pendingApprovals || 0}</p></div>
        )}

        {tab === "logs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {logs.length > 0 ? logs.map(log => (
              <div key={log.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem" }}>
                <div><span style={{ color: "var(--accent)", fontWeight: 700 }}>{log.admin_name}</span><span style={{ color: "var(--text-muted)", margin: "0 8px" }}>→</span><span style={{ fontWeight: 600 }}>{log.action.replace(/_/g, " ")}</span>{log.details && <span style={{ color: "var(--text-muted)", marginLeft: 8, fontSize: "0.85rem" }}>({log.details})</span>}</div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", flexShrink: 0 }}>{new Date(log.created_at).toLocaleString()}</span>
              </div>
            )) : <div className="empty"><div className="empty-icon">📋</div><p>No admin activity yet</p></div>}
          </div>
        )}
      </>}
    </div>
  );
}

// ============================================================
// PROFILE — with working save
// ============================================================
function ProfilePage({ user, setUser, lang, showToast }) {
  const t = useLang();
  const [form, setForm] = useState({ username: "", bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) setForm({ username: user.username || "", bio: user.bio || "" }); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update locally (backend profile update would need a new endpoint, so we save locally for now)
      setUser({ ...user, username: form.username, bio: form.bio });
      showToast(t.profileUpdated);
    } catch (err) { alert(err.message); } finally { setSaving(false); }
  };

  if (!user) return <div className="empty"><div className="empty-icon">🔒</div><p>{t.signInToView}</p></div>;
  return (
    <div className="fade">
      <div className="prof-header">
        <div className="prof-avatar">{user.avatar || "👤"}</div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>{user.username}</h2>
          <span className={`role-badge role-${user.role}`}>{getRoleLabel(user.role, lang)}</span>
          <div className="prof-stats"><div style={{ textAlign: "center" }}><div className="prof-stat-v">{user.reputation || 0}</div><div className="prof-stat-l">{t.reputation}</div></div></div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: "1.25rem", fontWeight: 700 }}>{t.accountSettings}</h3>
        <div className="fg"><label className="fg-label">{t.username}</label><input className="fg-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.email}</label><input className="fg-input" type="email" defaultValue={user.email} disabled style={{ opacity: 0.5 }} /></div>
        <div className="fg"><label className="fg-label">{t.bio}</label><textarea className="reply-area" style={{ minHeight: 80 }} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} /></div>
        <button className="btn btn-accent" onClick={handleSave} disabled={saving}>{saving ? "..." : t.saveChanges}</button>
      </div>
    </div>
  );
}

function Footer() {
  const t = useLang();
  return (
    <footer className="footer">
      <div className="footer-links">{[t.about, t.rules, t.apiDocs, t.contact, t.discord, t.github].map(l => <button key={l} className="footer-link">{l}</button>)}</div>
      <div className="footer-copy">{t.copyright}</div>
    </footer>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function DevRoots() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === "en" ? "ar" : "en");

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3000); };

  useEffect(() => {
    const token = localStorage.getItem("devroots_token");
    if (token) api("/api/auth/me").then(u => setUser(u)).catch(() => localStorage.removeItem("devroots_token"));
  }, []);

  const handleShowAuth = (mode) => {
    if (mode === "logout") { setUser(null); localStorage.removeItem("devroots_token"); setPage("home"); return; }
    setShowAuth(mode);
  };

  // Handle home page forum navigation
  const handleHomeForumNav = (s) => {
    if (s) {
      setPage("forums");
      // Store the navigation state to pass to ForumsPage
      window.__forumNav = s;
    }
  };

  return (
    <LangContext.Provider value={t}>
      <style>{getStyles(t.dir)}</style>
      <Navbar page={page} setPage={setPage} user={user} setShowAuth={handleShowAuth} lang={lang} toggleLang={toggleLang} toast={showToast} />
      {page === "home" && <Hero setPage={setPage} />}
      <div className="page-wrap">
        {page === "home" && <ForumsHome nav={handleHomeForumNav} user={user} setShowAuth={handleShowAuth} lang={lang} />}
        {page === "forums" && <ForumsPage user={user} setShowAuth={handleShowAuth} lang={lang} showToast={showToast} />}
        {page === "shop" && <ShopPage user={user} setShowAuth={handleShowAuth} lang={lang} showToast={showToast} />}
        {page === "admin" && <AdminPage user={user} lang={lang} showToast={showToast} />}
        {page === "profile" && <ProfilePage user={user} setUser={setUser} lang={lang} showToast={showToast} />}
      </div>
      <Footer />
      {showAuth && showAuth !== "logout" && <AuthModal mode={showAuth} setMode={setShowAuth} onClose={() => setShowAuth(null)} onLogin={u => setUser(u)} />}
      <Toast msg={toastMsg} />
    </LangContext.Provider>
  );
}
