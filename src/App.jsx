import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react";

// ============================================================
// API CONFIG — Your live backend URL
// ============================================================
const API_URL = "https://devroots-backend.onrender.com";

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
// LANGUAGE SYSTEM — Arabic + English
// ============================================================
const translations = {
  en: {
    dir: "ltr",
    brand: "DevRoots", tagline: "The Rappelz Developer Community",
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
  },
  ar: {
    dir: "rtl",
    brand: "DevRoots", tagline: "مجتمع مطوري رابلز",
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
  .nav-logo { width: 38px; height: 38px; background: linear-gradient(135deg, var(--accent), #4a8c2a); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; box-shadow: 0 2px 12px var(--accent-glow); }
  .nav-brand-text { font-family: var(--font-display); font-size: 1.35rem; }
  .nav-links { display: flex; align-items: center; gap: 4px; }
  .nav-link { padding: 8px 18px; border-radius: var(--radius-xs); color: var(--text-secondary); font-weight: 600; font-size: 0.88rem; cursor: pointer; transition: all 0.2s; border: none; background: none; font-family: var(--font-body); }
  .nav-link:hover { color: var(--text-primary); background: var(--bg-surface-2); }
  .nav-link.active { color: var(--accent); background: var(--accent-dim); }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .lang-toggle { padding: 6px 14px; border-radius: 20px; background: var(--bg-surface-2); border: 1px solid var(--border); color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: var(--font-body); transition: all 0.2s; }
  .lang-toggle:hover { border-color: var(--accent); color: var(--accent); }

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
  .role-badge { font-size: 0.66rem; font-weight: 700; padding: 2px 9px; border-radius: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
  .role-admin { background: var(--amber-dim); color: var(--amber); }
  .role-moderator { background: var(--cyan-dim); color: var(--cyan); }
  .role-developer { background: var(--accent-dim); color: var(--accent); }
  .role-member { background: var(--bg-surface-3); color: var(--text-muted); }
  .post-date { color: var(--text-muted); font-size: 0.78rem; }
  .post-body { padding: 1.25rem; line-height: 1.85; font-size: 0.92rem; color: var(--text-secondary); white-space: pre-wrap; }
  .post-foot { display: flex; gap: 1rem; padding: 0.75rem 1.25rem; border-top: 1px solid var(--border); }
  .post-act { display: flex; align-items: center; gap: 5px; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; border: none; background: none; font-family: var(--font-body); transition: color 0.2s; }
  .post-act:hover { color: var(--accent); }

  .reply-box { background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; margin-top: 1.5rem; }
  .reply-box h3 { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
  .reply-area { width: 100%; min-height: 120px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; resize: vertical; outline: none; direction: ${dir}; }
  .reply-area:focus { border-color: var(--accent); }
  .reply-bar { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1rem; }

  .modal-bg { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.75); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeUp 0.2s ease; }
  @keyframes fadeUp { from { opacity:0; } to { opacity:1; } }
  .modal-box { background: var(--bg-surface); border: 1px solid var(--border-hover); border-radius: var(--radius); padding: 2.25rem; width: 100%; max-width: 420px; box-shadow: 0 0 60px var(--accent-glow); animation: modalSlide 0.3s ease; }
  @keyframes modalSlide { from { transform:translateY(16px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .modal-box h2 { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.4rem; text-align: center; }
  .modal-sub { color: var(--text-muted); font-size: 0.85rem; text-align: center; margin-bottom: 1.5rem; }
  .fg { margin-bottom: 1rem; } .fg-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 5px; }
  .fg-input { width: 100%; padding: 10px 14px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-xs); color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; outline: none; direction: ${dir}; }
  .fg-input:focus { border-color: var(--accent); }
  .modal-foot { text-align: center; margin-top: 1.25rem; color: var(--text-muted); font-size: 0.8rem; }
  .modal-foot button { background: none; border: none; color: var(--accent); cursor: pointer; font-family: var(--font-body); font-weight: 700; }
  .auth-error { color: var(--red); font-size: 0.8rem; text-align: center; margin-top: 0.75rem; padding: 8px; background: var(--red-dim); border-radius: var(--radius-xs); }

  .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .shop-card { cursor: pointer; overflow: hidden; }
  .shop-img { height: 130px; background: linear-gradient(135deg, var(--bg-surface-3), var(--accent-dim)); display: flex; align-items: center; justify-content: center; font-size: 3rem; border-bottom: 1px solid var(--border); }
  .shop-body { padding: 1.25rem; }
  .shop-cat { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--cyan); margin-bottom: 6px; }
  .shop-item-title { font-weight: 700; font-size: 0.98rem; margin-bottom: 5px; }
  .shop-desc { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.75rem; }
  .shop-seller { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.78rem; margin-bottom: 0.75rem; }
  .shop-footer { display: flex; align-items: center; justify-content: space-between; }
  .shop-price { font-family: var(--font-display); font-size: 1.25rem; color: var(--amber); }
  .shop-stars { color: var(--text-secondary); font-size: 0.8rem; }

  .tabs { display: flex; gap: 2px; background: var(--bg-surface-2); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 1.5rem; width: fit-content; }
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
  }
`;

// ============================================================
// LOADING COMPONENT
// ============================================================
function Loading() {
  const t = useLang();
  return <div className="loading"><div className="spinner"></div><p>{t.loading}</p></div>;
}

function ErrorMsg({ message, onRetry }) {
  const t = useLang();
  return (
    <div className="empty">
      <div className="empty-icon">⚠️</div>
      <p style={{ marginBottom: "1rem" }}>{message || t.error}</p>
      {onRetry && <button className="btn btn-accent btn-sm" onClick={onRetry}>{t.tryAgain}</button>}
    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================
function Navbar({ page, setPage, user, setShowAuth, lang, toggleLang }) {
  const t = useLang();
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("home")}>
        <div className="nav-logo">🌿</div><span className="nav-brand-text">{t.brand}</span>
      </div>
      <div className="nav-links">
        {["home", "forums", "shop"].map(p => (
          <button key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{t[p]}</button>
        ))}
        {user && <button className={`nav-link ${page === "profile" ? "active" : ""}`} onClick={() => setPage("profile")}>{t.profile}</button>}
        {user && user.role === "admin" && <button className={`nav-link ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")} style={{ color: page === "admin" ? "var(--amber)" : undefined }}>🛡️ Admin</button>}
      </div>
      <div className="nav-actions">
        <button className="lang-toggle" onClick={toggleLang}>{lang === "en" ? "العربية" : "English"}</button>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.avatar} {user.username}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAuth("logout")}>{t.logout}</button>
          </div>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowAuth("login")}>{t.signIn}</button>
            <button className="btn btn-accent btn-sm" onClick={() => setShowAuth("register")}>{t.join}</button>
          </>
        )}
      </div>
    </nav>
  );
}

function Hero({ setPage }) {
  const t = useLang();
  return (
    <section className="hero">
      <div className="hero-pattern" />
      <div className="hero-content fade">
        <div className="hero-badge">🌿 {t.tagline}</div>
        <h1>{t.heroTitle.split(" ").slice(0, -1).join(" ")} <span className="highlight">{t.heroTitle.split(" ").slice(-1)}</span></h1>
        <p>{t.heroDesc}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn-accent" onClick={() => setPage("forums")}>{t.browseForums}</button>
          <button className="btn btn-surface" onClick={() => setPage("shop")}>{t.developerShop}</button>
        </div>
        <div className="hero-stats">
          {[["1,247", t.developers], ["3,892", t.discussions], ["856", t.projectsShared], ["12K+", t.posts]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}><div className="hero-stat-val">{v}</div><div className="hero-stat-label">{l}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// AUTH MODAL — Real login/register
// ============================================================
function AuthModal({ mode, setMode, onClose, onLogin }) {
  const t = useLang();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (!isLogin && form.password !== form.confirm) { setError("Passwords don't match"); setLoading(false); return; }
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { email: form.email, password: form.password } : { username: form.username, email: form.email, password: form.password };
      const data = await api(endpoint, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("devroots_token", data.token);
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>{isLogin ? t.welcomeBack : t.joinCommunity}</h2>
        <p className="modal-sub">{isLogin ? t.signInAccount : t.createAccount}</p>
        {!isLogin && <div className="fg"><label className="fg-label">{t.username}</label><input className="fg-input" placeholder={t.chooseUsername} value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></div>}
        <div className="fg"><label className="fg-label">{t.email}</label><input className="fg-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.password}</label><input className="fg-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} onKeyDown={e => e.key === "Enter" && isLogin && handleSubmit()} /></div>
        {!isLogin && <div className="fg"><label className="fg-label">{t.confirmPassword}</label><input className="fg-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} /></div>}
        {error && <div className="auth-error">{error}</div>}
        <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={handleSubmit} disabled={loading}>{loading ? "..." : isLogin ? t.signInBtn : t.createAccountBtn}</button>
        <div className="modal-foot">{isLogin ? <>{t.noAccount} <button onClick={() => { setMode("register"); setError(""); }}>{t.signUp}</button></> : <>{t.haveAccount} <button onClick={() => { setMode("login"); setError(""); }}>{t.signIn}</button></>}</div>
      </div>
    </div>
  );
}

// ============================================================
// FORUMS — Real API data
// ============================================================
function ForumsHome({ nav, user, setShowAuth, lang }) {
  const t = useLang();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { const data = await api("/api/forums/categories"); setCategories(data); } 
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">{t.communityForums}</h2><p className="section-sub">{t.browseCategories}</p></div>
        <button className="btn btn-accent" onClick={() => { if (!user) { setShowAuth("login"); return; } nav({ v: "new" }); }}>{t.newThread}</button>
      </div>
      <div className="cat-grid stagger">
        {categories.map(c => (
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
}

function CategoryView({ slug, catName, nav, user, setShowAuth, lang }) {
  const t = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await api(`/api/forums/categories/${slug}/threads`); setData(res); } 
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [slug]);

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;

  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.forums}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{catName}</span></div>
      <div className="section-head">
        <div><h2 className="section-title">{catName}</h2></div>
        <button className="btn btn-accent" onClick={() => { if (!user) { setShowAuth("login"); return; } nav({ v: "new", catId: data?.category?.id }); }}>{t.newThread}</button>
      </div>
      {data?.threads?.length > 0 ? (
        <div className="thread-list stagger">
          {data.threads.map(th => (
            <div key={th.id} className="thread-row" onClick={() => nav({ v: "thread", id: th.id })}>
              <div>
                <div className="thread-title">
                  {th.is_pinned && <span className="pin-badge">{t.pinned}</span>}
                  {lang === "ar" ? th.title_ar || th.title : th.title}
                </div>
                <div className="thread-meta">
                  <span className="thread-author-name">{th.author_avatar} {th.author_name}</span>
                  <span>·</span><span>{new Date(th.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="thread-num"><div>{th.reply_count || 0}</div><div className="thread-num-label">{t.replies}</div></div>
              <div className="thread-num"><div>{th.view_count}</div><div className="thread-num-label">{t.views}</div></div>
              <div className="thread-num"><div style={{ fontSize: "0.78rem" }}>{new Date(th.last_post_at || th.created_at).toLocaleDateString()}</div><div className="thread-num-label">{t.lastPost}</div></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty"><div className="empty-icon">📭</div><p>{t.noThreads}</p></div>
      )}
    </div>
  );
}

function ThreadView({ threadId, nav, user, setShowAuth, lang }) {
  const t = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState("");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await api(`/api/forums/threads/${threadId}`); setData(res); } 
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [threadId]);

  const handleReply = async () => {
    if (!user) { setShowAuth("login"); return; }
    if (!reply.trim()) return;
    setPosting(true);
    try {
      await api(`/api/forums/threads/${threadId}/reply`, { method: "POST", body: JSON.stringify({ content: reply }) });
      setReply("");
      load();
    } catch (err) { alert(err.message); }
    finally { setPosting(false); }
  };

  const handleLike = async (postId) => {
    if (!user) { setShowAuth("login"); return; }
    try { await api(`/api/forums/posts/${postId}/like`, { method: "POST" }); load(); } catch {}
  };

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
        <div className="tv-info">
          <span>{t.by} <strong style={{ color: "var(--accent)" }}>{thread.author_name}</strong></span>
          <span>👁 {thread.view_count} {t.views}</span>
        </div>
        {tags?.length > 0 && <div style={{ display: "flex", gap: 6, marginTop: "0.75rem" }}>{tags.map(tg => <span key={tg} className="tag-chip">{tg}</span>)}</div>}
      </div>
      <div className="stagger">
        {posts.map((p, i) => (
          <div key={p.id} className={`post-card ${i === 0 ? "op-post" : ""}`}>
            <div className="post-head">
              <div className="post-avatar-wrap">
                <div className="post-avatar">{p.author_avatar}</div>
                <div><div className="post-uname">{p.author_name}</div><span className={`role-badge role-${p.author_role}`}>{p.author_role}</span></div>
              </div>
              <div className="post-date">{new Date(p.created_at).toLocaleDateString()}</div>
            </div>
            <div className="post-body">{lang === "ar" ? p.content_ar || p.content : p.content}</div>
            <div className="post-foot">
              <button className="post-act" onClick={() => handleLike(p.id)}>👍 {p.like_count || 0}</button>
              <button className="post-act">💬 {t.reply}</button>
              <button className="post-act">🔗 {t.share}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="reply-box">
        <h3>{t.postReply}</h3>
        <textarea className="reply-area" placeholder={user ? t.writeReply : t.signInToReply} value={reply} onChange={e => setReply(e.target.value)} disabled={!user} />
        <div className="reply-bar">
          <button className="btn btn-accent btn-sm" onClick={handleReply} disabled={posting || !user}>{posting ? "..." : user ? t.postReplyBtn : t.signInToReplyBtn}</button>
        </div>
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
      const body = {
        category_id: parseInt(form.category),
        title: form.title,
        content: form.content,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : []
      };
      const thread = await api("/api/forums/threads", { method: "POST", body: JSON.stringify(body) });
      nav({ v: "thread", id: thread.id });
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.forums}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{t.createNewThread}</span></div>
      <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>{t.createNewThread}</h2>
      <div style={{ maxWidth: 760 }}>
        <div className="fg"><label className="fg-label">{t.category}</label>
          <select className="select-field fg-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="">{t.selectCategory}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {lang === "ar" ? c.name_ar || c.name : c.name}</option>)}
          </select>
        </div>
        <div className="fg"><label className="fg-label">{t.title}</label><input className="fg-input" placeholder={t.threadTitlePlaceholder} value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.tags}</label><input className="fg-input" placeholder={t.tagsPlaceholder} value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.content}</label><textarea className="reply-area" style={{ minHeight: 200 }} placeholder={t.contentPlaceholder} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-accent" onClick={handleCreate} disabled={loading}>{loading ? "..." : t.createThread}</button>
          <button className="btn btn-surface" onClick={() => nav(null)}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
}

function ForumsPage({ user, setShowAuth, lang }) {
  const [state, setState] = useState(null);
  if (state?.v === "cat") return <CategoryView slug={state.slug} catName={state.name} nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
  if (state?.v === "thread") return <ThreadView threadId={state.id} nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
  if (state?.v === "new") return <NewThreadForm nav={setState} catId={state.catId} lang={lang} />;
  return <ForumsHome nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
}

// ============================================================
// SHOP — Real API data
// ============================================================
function ShopPage({ user, setShowAuth, lang }) {
  const t = useLang();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true); setError(null);
    try { const data = await api("/api/shop/products"); setProducts(data); } 
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMsg message={error} onRetry={load} />;

  const categories = ["all", ...new Set(products.map(i => i.category).filter(Boolean))];
  const filtered = filter === "all" ? products : products.filter(i => i.category === filter);

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">{t.developerShop}</h2><p className="section-sub">{t.shopDesc}</p></div>
        <button className="btn btn-amber" onClick={() => { if (!user) setShowAuth("login"); }}>🏷️ {t.sellProject}</button>
      </div>
      {categories.length > 1 && <div className="tabs">{categories.map(c => <button key={c} className={`tab ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c === "all" ? t.all : c}</button>)}</div>}
      {filtered.length > 0 ? (
        <div className="shop-grid stagger">
          {filtered.map(item => (
            <div key={item.id} className="card shop-card">
              <div className="shop-img">{item.image || "📦"}</div>
              <div className="shop-body">
                <div className="shop-cat">{item.category}</div>
                <div className="shop-item-title">{lang === "ar" ? item.title_ar || item.title : item.title}</div>
                <div className="shop-desc">{lang === "ar" ? item.description_ar || item.description : item.description}</div>
                <div className="shop-seller">{item.seller_avatar} {item.seller_name} · ⭐ {item.seller_reputation}</div>
                <div className="shop-footer">
                  <div className="shop-price">${item.price}</div>
                  <div className="shop-stars">⭐ {item.average_rating || "N/A"} ({item.total_sales} sold)</div>
                </div>
                <button className="btn btn-accent btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>{t.viewDetails}</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty"><div className="empty-icon">🏪</div><p>{t.noProducts}</p></div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN DASHBOARD — Manage users, products, forums
// ============================================================
function AdminPage({ user, lang }) {
  const t = useLang();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    if (tab === "stats") loadStats();
    if (tab === "users") loadUsers();
    if (tab === "logs") loadLogs();
  }, [tab]);

  const loadStats = async () => { setLoading(true); try { setStats(await api("/api/admin/stats")); } catch {} setLoading(false); };
  const loadUsers = async () => { setLoading(true); try { setUsers(await api("/api/admin/users")); } catch {} setLoading(false); };
  const loadLogs = async () => { setLoading(true); try { setLogs(await api("/api/admin/logs")); } catch {} setLoading(false); };

  const handleBan = async (userId, ban) => {
    const reason = ban ? prompt("Ban reason:") : null;
    if (ban && !reason) return;
    try { await api(`/api/admin/users/${userId}/ban`, { method: "PUT", body: JSON.stringify({ ban, reason }) }); loadUsers(); } catch (e) { alert(e.message); }
  };

  const handleRole = async (userId, role) => {
    try { await api(`/api/admin/users/${userId}/role`, { method: "PUT", body: JSON.stringify({ role }) }); loadUsers(); } catch (e) { alert(e.message); }
  };

  const handleSeed = async () => {
    setSeeding(true); setSeedMsg("");
    try {
      const data = await api("/api/admin/seed", { method: "POST" });
      setSeedMsg(data.skipped ? "Already seeded!" : `✅ Created ${data.users} users, ${data.threads} threads, ${data.products} products!`);
      loadStats();
    } catch (e) { setSeedMsg("❌ " + e.message); }
    setSeeding(false);
  };

  if (!user || user.role !== "admin") {
    return <div className="empty"><div className="empty-icon">🔒</div><p>Admin access required</p></div>;
  }

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">🛡️ Admin Dashboard</h2><p className="section-sub">Manage your DevRoots community</p></div>
        <button className="btn btn-accent" onClick={handleSeed} disabled={seeding}>{seeding ? "Seeding..." : "🌱 Seed Sample Data"}</button>
      </div>
      {seedMsg && <div style={{ padding: "12px 16px", background: seedMsg.startsWith("✅") ? "var(--green-dim)" : seedMsg.startsWith("Already") ? "var(--amber-dim)" : "var(--red-dim)", borderRadius: "var(--radius-sm)", marginBottom: "1rem", fontSize: "0.88rem" }}>{seedMsg}</div>}

      <div className="tabs">
        {[["stats", "📊 Stats"], ["users", "👥 Users"], ["logs", "📋 Logs"]].map(([key, label]) => (
          <button key={key} className={`tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {loading ? <Loading /> : (
        <>
          {tab === "stats" && stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                ["👥", "Users", stats.users, "var(--accent)"],
                ["💬", "Threads", stats.threads, "var(--cyan)"],
                ["📝", "Posts", stats.posts, "var(--amber)"],
                ["📦", "Products", stats.products, "var(--green)"],
                ["⏳", "Pending Approval", stats.pendingApprovals, "var(--copper)"],
                ["💰", "Revenue", "$" + stats.totalRevenue.toFixed(2), "var(--amber)"],
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
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    {["User", "Role", "Reputation", "Status", "Joined", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "start", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "1.3rem" }}>{u.avatar}</span>
                          <div><div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{u.username}</div><div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{u.email}</div></div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <select className="select-field" value={u.role} onChange={e => handleRole(u.id, e.target.value)} style={{ width: "auto", padding: "4px 8px", fontSize: "0.78rem", background: "var(--bg-surface-2)" }}>
                          {["member", "developer", "moderator", "admin"].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 700 }}>{u.reputation}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {u.is_banned ? <span style={{ color: "var(--red)", fontSize: "0.82rem", fontWeight: 700 }}>🚫 Banned</span> : <span style={{ color: "var(--green)", fontSize: "0.82rem" }}>✅ Active</span>}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "0.82rem" }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {u.role !== "admin" && (
                          <button className="btn btn-sm" style={{ background: u.is_banned ? "var(--green-dim)" : "var(--red-dim)", color: u.is_banned ? "var(--green)" : "var(--red)", border: "none", fontSize: "0.75rem" }} onClick={() => handleBan(u.id, !u.is_banned)}>
                            {u.is_banned ? "Unban" : "Ban"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "logs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem" }}>
                  <div>
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>{log.admin_name}</span>
                    <span style={{ color: "var(--text-muted)", margin: "0 8px" }}>→</span>
                    <span style={{ fontWeight: 600 }}>{log.action.replace(/_/g, " ")}</span>
                    {log.details && <span style={{ color: "var(--text-muted)", marginLeft: 8, fontSize: "0.85rem" }}>({log.details})</span>}
                  </div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", flexShrink: 0 }}>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              )) : <div className="empty"><div className="empty-icon">📋</div><p>No admin activity yet</p></div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// PROFILE — Real user data
// ============================================================
function ProfilePage({ user, lang }) {
  const t = useLang();
  if (!user) return <div className="empty"><div className="empty-icon">🔒</div><p>{t.signInToView}</p></div>;

  return (
    <div className="fade">
      <div className="prof-header">
        <div className="prof-avatar">{user.avatar || "👤"}</div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>{user.username}</h2>
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
          <div className="prof-stats">
            <div style={{ textAlign: "center" }}><div className="prof-stat-v">{user.reputation || 0}</div><div className="prof-stat-l">{t.reputation}</div></div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: "1.25rem", fontWeight: 700 }}>{t.accountSettings}</h3>
        <div className="fg"><label className="fg-label">{t.username}</label><input className="fg-input" defaultValue={user.username} /></div>
        <div className="fg"><label className="fg-label">{t.email}</label><input className="fg-input" type="email" defaultValue={user.email} /></div>
        <div className="fg"><label className="fg-label">{t.bio}</label><textarea className="reply-area" style={{ minHeight: 80 }} defaultValue={user.bio || ""} /></div>
        <button className="btn btn-accent">{t.saveChanges}</button>
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
  const t = translations[lang];
  const toggleLang = () => setLang(l => l === "en" ? "ar" : "en");

  // Check for existing login on mount
  useEffect(() => {
    const token = localStorage.getItem("devroots_token");
    if (token) {
      api("/api/auth/me").then(u => setUser(u)).catch(() => localStorage.removeItem("devroots_token"));
    }
  }, []);

  const handleShowAuth = (mode) => {
    if (mode === "logout") { setUser(null); localStorage.removeItem("devroots_token"); return; }
    setShowAuth(mode);
  };

  return (
    <LangContext.Provider value={t}>
      <style>{getStyles(t.dir)}</style>
      <Navbar page={page} setPage={setPage} user={user} setShowAuth={handleShowAuth} lang={lang} toggleLang={toggleLang} />
      {page === "home" && <Hero setPage={setPage} />}
      <div className="page-wrap">
        {page === "home" && <ForumsHome nav={(s) => { if (s) setPage("forums"); }} user={user} setShowAuth={handleShowAuth} lang={lang} />}
        {page === "forums" && <ForumsPage user={user} setShowAuth={handleShowAuth} lang={lang} />}
        {page === "shop" && <ShopPage user={user} setShowAuth={handleShowAuth} lang={lang} />}
        {page === "admin" && <AdminPage user={user} lang={lang} />}
        {page === "profile" && <ProfilePage user={user} lang={lang} />}
      </div>
      <Footer />
      {showAuth && showAuth !== "logout" && <AuthModal mode={showAuth} setMode={setShowAuth} onClose={() => setShowAuth(null)} onLogin={u => setUser(u)} />}
    </LangContext.Provider>
  );
}
