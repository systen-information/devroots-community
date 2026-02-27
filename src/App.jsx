import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ============================================================
// LANGUAGE SYSTEM — Arabic + English
// ============================================================
const translations = {
  en: {
    dir: "ltr",
    // Brand
    brand: "DevRoots",
    tagline: "The Rappelz Developer Community",
    heroTitle: "Where Rappelz Developers Grow",
    heroDesc: "Build, share, and evolve. The home for Rappelz server developers — from custom servers to client mods, tools, and beyond.",
    // Nav
    home: "Home",
    forums: "Forums",
    shop: "Shop",
    profile: "Profile",
    signIn: "Sign In",
    join: "Join",
    logout: "Logout",
    // Hero stats
    developers: "Developers",
    discussions: "Discussions",
    projectsShared: "Projects Shared",
    posts: "Posts",
    // Forums
    communityForums: "Community Forums",
    browseCategories: "Browse categories or search for topics",
    newThread: "+ New Thread",
    searchForums: "Search forums...",
    threads: "threads",
    recentActivity: "Recent Activity",
    replies: "replies",
    views: "views",
    lastPost: "last post",
    pinned: "Pinned",
    postReply: "Post a Reply",
    writeReply: "Write your reply...",
    signInToReply: "Sign in to reply...",
    preview: "Preview",
    postReplyBtn: "Post Reply",
    signInToReplyBtn: "Sign In to Reply",
    createNewThread: "Create New Thread",
    category: "Category",
    selectCategory: "Select a category",
    title: "Title",
    threadTitlePlaceholder: "Descriptive title for your thread",
    tags: "Tags (comma separated)",
    tagsPlaceholder: "e.g. guide, ep9.5, server",
    content: "Content",
    contentPlaceholder: "Write your post content here...",
    createThread: "Create Thread",
    cancel: "Cancel",
    noThreads: "No threads in this category yet. Be the first!",
    // Shop
    developerShop: "Developer Shop",
    shopDesc: "Buy and sell Rappelz development resources",
    sellProject: "Sell a Project",
    all: "All",
    viewDetails: "View Details",
    // Profile
    reputation: "Reputation",
    myPosts: "My Posts",
    myThreads: "My Threads",
    myShop: "My Shop",
    settings: "Settings",
    accountSettings: "Account Settings",
    username: "Username",
    email: "Email",
    bio: "Bio",
    saveChanges: "Save Changes",
    signInToView: "Sign in to view your profile",
    // Auth
    welcomeBack: "Welcome Back",
    joinCommunity: "Join the Community",
    signInAccount: "Sign in to your account",
    createAccount: "Create your developer account",
    chooseUsername: "Choose a username",
    password: "Password",
    confirmPassword: "Confirm Password",
    signInBtn: "Sign In",
    createAccountBtn: "Create Account",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    haveAccount: "Already have an account?",
    // Footer
    about: "About",
    rules: "Rules",
    apiDocs: "API Docs",
    contact: "Contact",
    discord: "Discord",
    github: "GitHub",
    copyright: "© 2024 DevRoots Community. Not affiliated with Gala Lab or Webzen.",
    browseForums: "Browse Forums",
    // Categories
    catServerDev: "Server Development",
    catServerDevDesc: "Game server setup, configuration, and optimization",
    catClientMod: "Client Modding",
    catClientModDesc: "Client-side modifications, UI changes, and visual mods",
    catDbTools: "Database & Tools",
    catDbToolsDesc: "Database management, custom tools, and utilities",
    catScripting: "Scripting & NPCs",
    catScriptingDesc: "NPC scripting, quest creation, and game logic",
    catReleases: "Releases & Downloads",
    catReleasesDesc: "Share your completed projects and releases",
    catHelp: "Help & Support",
    catHelpDesc: "Get help with development issues and bugs",
    postedIn: "Posted in",
    reply: "Reply",
    share: "Share",
    report: "Report",
    by: "By",
  },
  ar: {
    dir: "rtl",
    brand: "DevRoots",
    tagline: "مجتمع مطوري رابلز",
    heroTitle: "حيث ينمو مطورو رابلز",
    heroDesc: "ابنِ وشارك وتطور. الوجهة الرئيسية لمطوري سيرفرات رابلز — من السيرفرات المخصصة إلى تعديلات العميل والأدوات وأكثر.",
    home: "الرئيسية",
    forums: "المنتديات",
    shop: "المتجر",
    profile: "الملف الشخصي",
    signIn: "تسجيل الدخول",
    join: "انضم",
    logout: "تسجيل الخروج",
    developers: "مطورون",
    discussions: "نقاشات",
    projectsShared: "مشاريع مشتركة",
    posts: "منشورات",
    communityForums: "منتديات المجتمع",
    browseCategories: "تصفح الأقسام أو ابحث في المواضيع",
    newThread: "+ موضوع جديد",
    searchForums: "ابحث في المنتديات...",
    threads: "مواضيع",
    recentActivity: "النشاط الأخير",
    replies: "ردود",
    views: "مشاهدات",
    lastPost: "آخر رد",
    pinned: "مثبّت",
    postReply: "أضف رداً",
    writeReply: "اكتب ردك هنا...",
    signInToReply: "سجّل دخولك للرد...",
    preview: "معاينة",
    postReplyBtn: "نشر الرد",
    signInToReplyBtn: "سجّل دخولك للرد",
    createNewThread: "إنشاء موضوع جديد",
    category: "القسم",
    selectCategory: "اختر قسماً",
    title: "العنوان",
    threadTitlePlaceholder: "عنوان وصفي لموضوعك",
    tags: "الوسوم (مفصولة بفاصلة)",
    tagsPlaceholder: "مثال: دليل، ep9.5، سيرفر",
    content: "المحتوى",
    contentPlaceholder: "اكتب محتوى منشورك هنا...",
    createThread: "إنشاء الموضوع",
    cancel: "إلغاء",
    noThreads: "لا توجد مواضيع في هذا القسم بعد. كن أول من يبدأ!",
    developerShop: "متجر المطورين",
    shopDesc: "اشترِ وبِع موارد تطوير رابلز",
    sellProject: "بيع مشروع",
    all: "الكل",
    viewDetails: "عرض التفاصيل",
    reputation: "السمعة",
    myPosts: "منشوراتي",
    myThreads: "مواضيعي",
    myShop: "متجري",
    settings: "الإعدادات",
    accountSettings: "إعدادات الحساب",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    bio: "نبذة",
    saveChanges: "حفظ التغييرات",
    signInToView: "سجّل دخولك لعرض ملفك الشخصي",
    welcomeBack: "مرحباً بعودتك",
    joinCommunity: "انضم للمجتمع",
    signInAccount: "سجّل الدخول إلى حسابك",
    createAccount: "أنشئ حساب مطور",
    chooseUsername: "اختر اسم مستخدم",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    signInBtn: "تسجيل الدخول",
    createAccountBtn: "إنشاء حساب",
    noAccount: "ليس لديك حساب؟",
    signUp: "سجّل الآن",
    haveAccount: "لديك حساب بالفعل؟",
    about: "عن الموقع",
    rules: "القوانين",
    apiDocs: "مستندات API",
    contact: "تواصل معنا",
    discord: "ديسكورد",
    github: "غيتهب",
    copyright: "© 2024 مجتمع DevRoots. غير تابع لـ Gala Lab أو Webzen.",
    browseForums: "تصفح المنتديات",
    catServerDev: "تطوير السيرفرات",
    catServerDevDesc: "إعداد وتكوين وتحسين سيرفرات اللعبة",
    catClientMod: "تعديل العميل",
    catClientModDesc: "تعديلات جانب العميل وتغييرات الواجهة والتعديلات البصرية",
    catDbTools: "قواعد البيانات والأدوات",
    catDbToolsDesc: "إدارة قواعد البيانات والأدوات المخصصة والمرافق",
    catScripting: "البرمجة و NPCs",
    catScriptingDesc: "برمجة NPCs وإنشاء المهام ومنطق اللعبة",
    catReleases: "الإصدارات والتنزيلات",
    catReleasesDesc: "شارك مشاريعك المكتملة وإصداراتك",
    catHelp: "المساعدة والدعم",
    catHelpDesc: "احصل على مساعدة في مشاكل التطوير والأخطاء",
    postedIn: "نُشر في",
    reply: "رد",
    share: "مشاركة",
    report: "إبلاغ",
    by: "بواسطة",
  },
};

const LangContext = createContext();
function useLang() { return useContext(LangContext); }

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_USERS = [
  { id: 1, username: "DragonForge", avatar: "🐉", role: "admin", reputation: 2340 },
  { id: 2, username: "RuneMaster_X", avatar: "🔮", role: "moderator", reputation: 1820 },
  { id: 3, username: "ShadowDev", avatar: "🗡️", role: "developer", reputation: 956 },
  { id: 4, username: "PhoenixCoder", avatar: "🦅", role: "developer", reputation: 1450 },
  { id: 5, username: "CrystalScript", avatar: "💎", role: "developer", reputation: 720 },
];

const getCategoryData = (t) => [
  { id: 1, name: t.catServerDev, icon: "⚙️", description: t.catServerDevDesc, threads: 234, posts: 1892 },
  { id: 2, name: t.catClientMod, icon: "🎨", description: t.catClientModDesc, threads: 189, posts: 1456 },
  { id: 3, name: t.catDbTools, icon: "🗄️", description: t.catDbToolsDesc, threads: 156, posts: 987 },
  { id: 4, name: t.catScripting, icon: "📜", description: t.catScriptingDesc, threads: 198, posts: 1654 },
  { id: 5, name: t.catReleases, icon: "📦", description: t.catReleasesDesc, threads: 87, posts: 432 },
  { id: 6, name: t.catHelp, icon: "🆘", description: t.catHelpDesc, threads: 312, posts: 2876 },
];

const MOCK_THREADS = [
  { id: 1, categoryId: 1, title: "Complete Guide: Setting Up Rappelz EP9.5 Server", titleAr: "دليل شامل: إعداد سيرفر رابلز EP9.5", author: MOCK_USERS[0], replies: 47, views: 2340, lastActivity: "2h", pinned: true, tags: ["guide", "ep9.5"] },
  { id: 2, categoryId: 1, title: "Authentication bypass vulnerability fix", titleAr: "إصلاح ثغرة تجاوز المصادقة", author: MOCK_USERS[3], replies: 23, views: 890, lastActivity: "4h", pinned: true, tags: ["security", "fix"] },
  { id: 3, categoryId: 2, title: "Custom UI — Dark Crystal Theme Pack v2.1", titleAr: "واجهة مخصصة — حزمة سمة الكريستال الداكن v2.1", author: MOCK_USERS[4], replies: 56, views: 3100, lastActivity: "1h", pinned: false, tags: ["ui", "theme"] },
  { id: 4, categoryId: 3, title: "Python tool for bulk NPC stat editing", titleAr: "أداة بايثون لتحرير إحصائيات NPC بالجملة", author: MOCK_USERS[2], replies: 12, views: 567, lastActivity: "6h", pinned: false, tags: ["tool", "python"] },
  { id: 5, categoryId: 4, title: "Dynamic quest chain with branching dialogues", titleAr: "سلسلة مهام ديناميكية مع حوارات متفرعة", author: MOCK_USERS[1], replies: 34, views: 1230, lastActivity: "30m", pinned: false, tags: ["quest", "scripting"] },
  { id: 6, categoryId: 6, title: "Server crashes on pet evolution", titleAr: "السيرفر يتوقف عند تطور الحيوانات الأليفة", author: MOCK_USERS[4], replies: 8, views: 234, lastActivity: "15m", pinned: false, tags: ["bug", "help"] },
  { id: 7, categoryId: 5, title: "Rappelz Custom Launcher v3.0", titleAr: "مُشغّل رابلز المخصص v3.0", author: MOCK_USERS[0], replies: 89, views: 5600, lastActivity: "3h", pinned: true, tags: ["release", "launcher"] },
];

const MOCK_POSTS = [
  { id: 1, threadId: 1, author: MOCK_USERS[0], content: "Welcome to the complete guide for setting up your Rappelz EP9.5 server. This guide covers everything from initial database setup to configuring game mechanics.\n\n**Prerequisites:**\n- Windows Server 2019+ or Linux\n- MSSQL Server 2019\n- At least 8GB RAM\n\nLet's start with the database configuration...", contentAr: "مرحباً بكم في الدليل الشامل لإعداد سيرفر رابلز EP9.5. يغطي هذا الدليل كل شيء من إعداد قاعدة البيانات الأولية إلى تكوين ميكانيكا اللعبة.\n\n**المتطلبات:**\n- Windows Server 2019+ أو Linux\n- MSSQL Server 2019\n- 8 جيجابايت رام على الأقل\n\nلنبدأ بتكوين قاعدة البيانات...", createdAt: "2024-01-15", likes: 89, isOP: true },
  { id: 2, threadId: 1, author: MOCK_USERS[3], content: "Great guide! Set connection pool to 100+ for production. Default 25 bottlenecks at ~50 concurrent players.", contentAr: "دليل ممتاز! اضبط حجم مجموعة الاتصالات على 100+ للإنتاج. الافتراضي 25 يسبب اختناقاً عند ~50 لاعب متزامن.", createdAt: "2024-01-15", likes: 34, isOP: false },
  { id: 3, threadId: 1, author: MOCK_USERS[2], content: "Has anyone tested this on Linux with Wine? Trying to avoid Windows licensing costs.", contentAr: "هل جرّب أحد هذا على لينكس مع Wine؟ أحاول تجنب تكاليف ترخيص ويندوز.", createdAt: "2024-01-16", likes: 12, isOP: false },
];

const MOCK_SHOP = [
  { id: 1, title: "Complete Server Files EP9.5.2", titleAr: "ملفات سيرفر كاملة EP9.5.2", seller: MOCK_USERS[0], price: 49.99, rating: 4.8, reviews: 23, category: "Server Files", image: "🖥️", desc: "Fully configured server with custom content", descAr: "سيرفر مُعد بالكامل مع محتوى مخصص" },
  { id: 2, title: "Advanced Anti-Cheat System", titleAr: "نظام مكافحة غش متقدم", seller: MOCK_USERS[3], price: 29.99, rating: 4.6, reviews: 15, category: "Security", image: "🛡️", desc: "Real-time cheat detection and prevention", descAr: "كشف ومنع الغش في الوقت الفعلي" },
  { id: 3, title: "Custom Launcher + Auto Patcher", titleAr: "مُشغّل مخصص + تحديث تلقائي", seller: MOCK_USERS[1], price: 19.99, rating: 4.9, reviews: 41, category: "Tools", image: "🚀", desc: "Branded launcher with auto-update system", descAr: "مُشغّل مخصص مع نظام تحديث تلقائي" },
  { id: 4, title: "UI Redesign Kit — Modern Dark", titleAr: "حزمة إعادة تصميم الواجهة — داكن عصري", seller: MOCK_USERS[4], price: 14.99, rating: 4.7, reviews: 18, category: "Client Mods", image: "🎨", desc: "Complete UI overhaul with modern aesthetics", descAr: "إعادة تصميم كاملة للواجهة بجماليات عصرية" },
  { id: 5, title: "NPC & Quest Editor Suite", titleAr: "حزمة محرر NPC والمهام", seller: MOCK_USERS[2], price: 24.99, rating: 4.5, reviews: 9, category: "Tools", image: "📝", desc: "Visual editor for NPCs and quest chains", descAr: "محرر بصري لـ NPCs وسلاسل المهام" },
  { id: 6, title: "Premium Dungeon Pack", titleAr: "حزمة الأبراج المحصنة المميزة", seller: MOCK_USERS[0], price: 39.99, rating: 4.8, reviews: 12, category: "Content", image: "🏰", desc: "5 custom dungeons with unique bosses", descAr: "5 أبراج محصنة مخصصة مع زعماء فريدون" },
];

// ============================================================
// STYLES — Organic-Tech / Earthy-Dark Theme
// ============================================================
const getStyles = (dir) => `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg-root: #0c0f0a;
    --bg-surface: #141a12;
    --bg-surface-2: #1a2117;
    --bg-surface-3: #1f2a1b;
    --bg-hover: #243020;
    --bg-input: #111610;
    --border: #2a3525;
    --border-hover: #3a4a33;
    --border-accent: #4a6b3a;
    --text-primary: #e4e8df;
    --text-secondary: #9ca895;
    --text-muted: #5e6e55;
    --accent: #7cb342;
    --accent-hover: #9ccc65;
    --accent-dim: rgba(124, 179, 66, 0.12);
    --accent-glow: rgba(124, 179, 66, 0.2);
    --amber: #f9a825;
    --amber-dim: rgba(249, 168, 37, 0.12);
    --copper: #e67e22;
    --copper-dim: rgba(230, 126, 34, 0.1);
    --cyan: #26a69a;
    --cyan-dim: rgba(38, 166, 154, 0.12);
    --red: #ef5350;
    --red-dim: rgba(239, 83, 80, 0.1);
    --green: #66bb6a;
    --green-dim: rgba(102, 187, 106, 0.12);
    --radius: 14px;
    --radius-sm: 10px;
    --radius-xs: 7px;
    --font-display: 'DM Serif Display', serif;
    --font-body: 'Manrope', 'Noto Kufi Arabic', sans-serif;
    --font-arabic: 'Noto Kufi Arabic', sans-serif;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body, #root {
    background: var(--bg-root);
    color: var(--text-primary);
    font-family: var(--font-body);
    min-height: 100vh;
    direction: ${dir};
  }

  #root { display: flex; flex-direction: column; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

  /* ===== NAVBAR ===== */
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(12, 15, 10, 0.9);
    backdrop-filter: blur(24px) saturate(1.2);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    height: 66px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-brand {
    display: flex; align-items: center; gap: 12px;
    cursor: pointer;
  }
  .nav-logo {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--accent), #4a8c2a);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 2px 12px var(--accent-glow);
  }
  .nav-brand-text {
    font-family: var(--font-display);
    font-size: 1.35rem; letter-spacing: 0.5px;
  }
  .nav-links { display: flex; align-items: center; gap: 4px; }
  .nav-link {
    padding: 8px 18px; border-radius: var(--radius-xs);
    color: var(--text-secondary); font-weight: 600; font-size: 0.88rem;
    cursor: pointer; transition: all 0.2s;
    border: none; background: none; font-family: var(--font-body);
  }
  .nav-link:hover { color: var(--text-primary); background: var(--bg-surface-2); }
  .nav-link.active { color: var(--accent); background: var(--accent-dim); }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .lang-toggle {
    padding: 6px 14px; border-radius: 20px;
    background: var(--bg-surface-2); border: 1px solid var(--border);
    color: var(--text-secondary); font-size: 0.82rem; font-weight: 600;
    cursor: pointer; font-family: var(--font-body);
    transition: all 0.2s;
  }
  .lang-toggle:hover { border-color: var(--accent); color: var(--accent); }

  /* ===== BUTTONS ===== */
  .btn {
    padding: 10px 22px; border-radius: var(--radius-xs);
    font-family: var(--font-body); font-weight: 700; font-size: 0.85rem;
    cursor: pointer; transition: all 0.2s; border: none;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-accent { background: var(--accent); color: #0c0f0a; }
  .btn-accent:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 4px 24px var(--accent-glow); }
  .btn-surface {
    background: var(--bg-surface-2); color: var(--text-primary);
    border: 1px solid var(--border);
  }
  .btn-surface:hover { border-color: var(--accent); }
  .btn-ghost { background: transparent; color: var(--text-secondary); }
  .btn-ghost:hover { color: var(--text-primary); background: var(--bg-surface-2); }
  .btn-sm { padding: 6px 14px; font-size: 0.78rem; }
  .btn-amber { background: var(--amber); color: #1a1200; font-weight: 700; }
  .btn-amber:hover { background: #fbc02d; }

  /* ===== HERO ===== */
  .hero {
    position: relative; overflow: hidden;
    padding: 6rem 2rem 5rem;
    text-align: center;
    background: linear-gradient(170deg, #0c0f0a 0%, #15200f 35%, #1a2a14 55%, #0f1a0b 100%);
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 600px 400px at 25% 60%, rgba(124,179,66,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 500px 350px at 75% 40%, rgba(38,166,154,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-pattern {
    position: absolute; inset: 0; opacity: 0.025;
    background-image:
      radial-gradient(circle 2px, var(--accent) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 1; max-width: 780px; margin: 0 auto; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 18px; border-radius: 20px;
    background: var(--accent-dim); border: 1px solid rgba(124,179,66,0.2);
    color: var(--accent); font-size: 0.8rem; font-weight: 600;
    margin-bottom: 1.5rem;
  }
  .hero h1 {
    font-family: var(--font-display);
    font-size: 3.5rem; line-height: 1.15;
    margin-bottom: 1.25rem; font-weight: 400;
    color: var(--text-primary);
  }
  .hero h1 .highlight {
    background: linear-gradient(135deg, var(--accent) 0%, var(--cyan) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero p {
    color: var(--text-secondary); font-size: 1.1rem;
    max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.75;
  }
  .hero-stats {
    display: flex; justify-content: center; gap: 3.5rem; margin-top: 3.5rem;
    flex-wrap: wrap;
  }
  .hero-stat { text-align: center; }
  .hero-stat-val {
    font-family: var(--font-display);
    font-size: 2.2rem;
    color: var(--accent);
  }
  .hero-stat-label { color: var(--text-muted); font-size: 0.82rem; margin-top: 2px; }

  /* ===== LAYOUT ===== */
  .page-wrap { max-width: 1180px; margin: 0 auto; padding: 2rem; flex: 1; }
  .section-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
  }
  .section-title { font-family: var(--font-display); font-size: 1.6rem; }
  .section-sub { color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; }

  /* ===== CARDS ===== */
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem;
    transition: all 0.25s;
  }
  .card:hover { border-color: var(--border-hover); background: var(--bg-surface-2); }

  /* ===== CATEGORIES ===== */
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1rem;
  }
  .cat-card { display: flex; gap: 14px; cursor: pointer; align-items: flex-start; }
  .cat-icon {
    width: 50px; height: 50px; flex-shrink: 0;
    background: var(--accent-dim);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    border: 1px solid rgba(124,179,66,0.1);
  }
  .cat-name { font-weight: 700; font-size: 0.98rem; margin-bottom: 4px; }
  .cat-desc { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 8px; line-height: 1.5; }
  .cat-stats { display: flex; gap: 1.25rem; color: var(--text-secondary); font-size: 0.78rem; }

  /* ===== THREADS ===== */
  .thread-list { display: flex; flex-direction: column; gap: 6px; }
  .thread-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 1.5rem; align-items: center;
    padding: 1rem 1.25rem;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.2s;
  }
  .thread-row:hover { border-color: var(--accent); background: var(--bg-hover); }
  .thread-title-wrap { min-width: 0; }
  .thread-title {
    font-weight: 700; font-size: 0.94rem;
    display: flex; align-items: center; gap: 8px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pin-badge {
    background: var(--amber-dim); color: var(--amber);
    font-size: 0.62rem; font-weight: 800; padding: 3px 9px;
    border-radius: 5px; flex-shrink: 0; text-transform: uppercase;
    letter-spacing: 0.6px;
  }
  .thread-meta {
    display: flex; align-items: center; gap: 8px;
    margin-top: 6px; font-size: 0.78rem; color: var(--text-muted);
    flex-wrap: wrap;
  }
  .thread-author-name { color: var(--accent); font-weight: 600; }
  .tag-chip {
    background: var(--bg-surface-3); color: var(--text-secondary);
    padding: 2px 8px; border-radius: 5px; font-size: 0.68rem;
  }
  .thread-num { text-align: center; min-width: 55px; color: var(--text-secondary); font-size: 0.85rem; }
  .thread-num-label { font-size: 0.68rem; color: var(--text-muted); }

  /* ===== THREAD VIEW ===== */
  .tv-header {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.75rem;
    margin-bottom: 1.5rem;
  }
  .tv-title { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.75rem; }
  .tv-info { display: flex; gap: 1.5rem; flex-wrap: wrap; color: var(--text-muted); font-size: 0.85rem; }
  .post-card {
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: var(--radius); margin-bottom: 1rem; overflow: hidden;
  }
  .post-card.op-post { border-color: var(--accent); }
  .post-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem; background: var(--bg-surface-2);
    border-bottom: 1px solid var(--border);
  }
  .post-avatar-wrap { display: flex; align-items: center; gap: 10px; }
  .post-avatar {
    width: 40px; height: 40px; background: var(--accent-dim);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .post-uname { font-weight: 700; font-size: 0.9rem; }
  .role-badge {
    font-size: 0.66rem; font-weight: 700; padding: 2px 9px;
    border-radius: 5px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .role-admin { background: var(--amber-dim); color: var(--amber); }
  .role-moderator { background: var(--cyan-dim); color: var(--cyan); }
  .role-developer { background: var(--accent-dim); color: var(--accent); }
  .role-member { background: var(--bg-surface-3); color: var(--text-muted); }
  .post-date { color: var(--text-muted); font-size: 0.78rem; }
  .post-body {
    padding: 1.25rem; line-height: 1.85; font-size: 0.92rem;
    color: var(--text-secondary); white-space: pre-wrap;
  }
  .post-body strong { color: var(--text-primary); }
  .post-foot {
    display: flex; gap: 1rem; padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--border);
  }
  .post-act {
    display: flex; align-items: center; gap: 5px;
    color: var(--text-muted); font-size: 0.8rem;
    cursor: pointer; border: none; background: none; font-family: var(--font-body);
    transition: color 0.2s;
  }
  .post-act:hover { color: var(--accent); }

  /* ===== REPLY EDITOR ===== */
  .reply-box {
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.25rem; margin-top: 1.5rem;
  }
  .reply-box h3 { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
  .reply-area {
    width: 100%; min-height: 120px;
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 1rem;
    color: var(--text-primary); font-family: var(--font-body);
    font-size: 0.9rem; resize: vertical; outline: none;
    direction: ${dir};
  }
  .reply-area:focus { border-color: var(--accent); }
  .reply-bar { display: flex; justify-content: flex-end; gap: 10px; margin-top: 1rem; }

  /* ===== MODAL ===== */
  .modal-bg {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem; animation: fadeUp 0.2s ease;
  }
  @keyframes fadeUp { from { opacity:0; } to { opacity:1; } }
  .modal-box {
    background: var(--bg-surface); border: 1px solid var(--border-hover);
    border-radius: var(--radius); padding: 2.25rem;
    width: 100%; max-width: 420px;
    box-shadow: 0 0 60px var(--accent-glow);
    animation: modalSlide 0.3s ease;
  }
  @keyframes modalSlide { from { transform:translateY(16px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .modal-box h2 { font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.4rem; text-align: center; }
  .modal-sub { color: var(--text-muted); font-size: 0.85rem; text-align: center; margin-bottom: 1.5rem; }
  .fg { margin-bottom: 1rem; }
  .fg-label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 5px; }
  .fg-input {
    width: 100%; padding: 10px 14px;
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: var(--radius-xs); color: var(--text-primary);
    font-family: var(--font-body); font-size: 0.9rem; outline: none;
    direction: ${dir};
  }
  .fg-input:focus { border-color: var(--accent); }
  .modal-foot { text-align: center; margin-top: 1.25rem; color: var(--text-muted); font-size: 0.8rem; }
  .modal-foot button { background: none; border: none; color: var(--accent); cursor: pointer; font-family: var(--font-body); font-weight: 700; }

  /* ===== SHOP ===== */
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  .shop-card { cursor: pointer; overflow: hidden; }
  .shop-img {
    height: 130px;
    background: linear-gradient(135deg, var(--bg-surface-3), var(--accent-dim));
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem; border-bottom: 1px solid var(--border);
  }
  .shop-body { padding: 1.25rem; }
  .shop-cat {
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.8px; color: var(--cyan); margin-bottom: 6px;
  }
  .shop-item-title { font-weight: 700; font-size: 0.98rem; margin-bottom: 5px; }
  .shop-desc { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.75rem; }
  .shop-seller { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.78rem; margin-bottom: 0.75rem; }
  .shop-footer { display: flex; align-items: center; justify-content: space-between; }
  .shop-price { font-family: var(--font-display); font-size: 1.25rem; color: var(--amber); }
  .shop-stars { color: var(--text-secondary); font-size: 0.8rem; }

  /* ===== TABS ===== */
  .tabs {
    display: flex; gap: 2px;
    background: var(--bg-surface-2); border-radius: var(--radius-sm);
    padding: 3px; margin-bottom: 1.5rem; width: fit-content;
  }
  .tab {
    padding: 8px 18px; border-radius: var(--radius-xs);
    font-size: 0.84rem; font-weight: 600; color: var(--text-muted);
    cursor: pointer; border: none; background: none; font-family: var(--font-body);
    transition: all 0.2s;
  }
  .tab:hover { color: var(--text-secondary); }
  .tab.active { background: var(--accent); color: var(--bg-root); }

  /* ===== PROFILE ===== */
  .prof-header {
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 2rem;
    display: flex; gap: 2rem; align-items: center; margin-bottom: 2rem;
  }
  .prof-avatar {
    width: 80px; height: 80px; background: var(--accent-dim);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; flex-shrink: 0; border: 2px solid var(--accent);
  }
  .prof-stats { display: flex; gap: 2rem; margin-top: 0.75rem; }
  .prof-stat-v { font-weight: 800; font-size: 1.1rem; }
  .prof-stat-l { color: var(--text-muted); font-size: 0.73rem; }

  /* ===== SEARCH BAR ===== */
  .search-input {
    flex: 1; padding: 10px 16px;
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text-primary);
    font-family: var(--font-body); font-size: 0.88rem; outline: none;
    direction: ${dir};
  }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--text-muted); }
  .search-bar { display: flex; gap: 8px; margin-bottom: 1.5rem; }

  /* ===== BREADCRUMB ===== */
  .bread { display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted); }
  .bread button { background: none; border: none; color: var(--text-secondary); cursor: pointer; font-family: var(--font-body); font-size: inherit; }
  .bread button:hover { color: var(--accent); }

  /* ===== NEW THREAD ===== */
  .select-field {
    width: 100%; padding: 10px 14px;
    background: var(--bg-input); border: 1px solid var(--border);
    border-radius: var(--radius-xs); color: var(--text-primary);
    font-family: var(--font-body); font-size: 0.9rem; outline: none;
    appearance: none; cursor: pointer;
  }
  .select-field option { background: var(--bg-surface); }

  /* ===== FOOTER ===== */
  .footer {
    background: var(--bg-surface); border-top: 1px solid var(--border);
    padding: 2rem; text-align: center; margin-top: auto;
  }
  .footer-links { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .footer-link { color: var(--text-muted); font-size: 0.8rem; cursor: pointer; border: none; background: none; font-family: var(--font-body); }
  .footer-link:hover { color: var(--accent); }
  .footer-copy { color: var(--text-muted); font-size: 0.72rem; }

  /* ===== EMPTY ===== */
  .empty { text-align: center; padding: 3rem; color: var(--text-muted); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }

  /* ===== STAGGER ANIMATION ===== */
  .fade { animation: fadeUp 0.4s ease; }
  .stagger > * { animation: modalSlide 0.35s ease both; }
  .stagger > *:nth-child(1) { animation-delay: 0ms; }
  .stagger > *:nth-child(2) { animation-delay: 40ms; }
  .stagger > *:nth-child(3) { animation-delay: 80ms; }
  .stagger > *:nth-child(4) { animation-delay: 120ms; }
  .stagger > *:nth-child(5) { animation-delay: 160ms; }
  .stagger > *:nth-child(6) { animation-delay: 200ms; }
  .stagger > *:nth-child(7) { animation-delay: 240ms; }
  .stagger > *:nth-child(8) { animation-delay: 280ms; }

  @media (max-width: 768px) {
    .hero h1 { font-size: 2rem; }
    .cat-grid { grid-template-columns: 1fr; }
    .thread-row { grid-template-columns: 1fr; gap: 0.5rem; }
    .thread-num { display: none; }
    .shop-grid { grid-template-columns: 1fr; }
    .prof-header { flex-direction: column; text-align: center; }
    .nav-links { display: none; }
    .hero-stats { gap: 1.5rem; }
  }
`;

// ============================================================
// COMPONENTS
// ============================================================

function Navbar({ page, setPage, user, setShowAuth, lang, toggleLang }) {
  const t = useLang();
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage("home")}>
        <div className="nav-logo">🌿</div>
        <span className="nav-brand-text">{t.brand}</span>
      </div>
      <div className="nav-links">
        {["home", "forums", "shop"].map(p => (
          <button key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
            {t[p]}
          </button>
        ))}
        {user && <button className={`nav-link ${page === "profile" ? "active" : ""}`} onClick={() => setPage("profile")}>{t.profile}</button>}
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
            <div className="hero-stat" key={l}><div className="hero-stat-val">{v}</div><div className="hero-stat-label">{l}</div></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthModal({ mode, setMode, onClose, onLogin }) {
  const t = useLang();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const isLogin = mode === "login";
  const handleSubmit = () => { onLogin(MOCK_USERS[0]); onClose(); };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>{isLogin ? t.welcomeBack : t.joinCommunity}</h2>
        <p className="modal-sub">{isLogin ? t.signInAccount : t.createAccount}</p>
        {!isLogin && <div className="fg"><label className="fg-label">{t.username}</label><input className="fg-input" placeholder={t.chooseUsername} value={form.username} onChange={e => setForm({...form, username: e.target.value})} /></div>}
        <div className="fg"><label className="fg-label">{t.email}</label><input className="fg-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.password}</label><input className="fg-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
        {!isLogin && <div className="fg"><label className="fg-label">{t.confirmPassword}</label><input className="fg-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} /></div>}
        <button className="btn btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={handleSubmit}>{isLogin ? t.signInBtn : t.createAccountBtn}</button>
        <div className="modal-foot">{isLogin ? <>{t.noAccount} <button onClick={() => setMode("register")}>{t.signUp}</button></> : <>{t.haveAccount} <button onClick={() => setMode("login")}>{t.signIn}</button></>}</div>
      </div>
    </div>
  );
}

function ForumsHome({ nav, user, setShowAuth, lang }) {
  const t = useLang();
  const cats = getCategoryData(t);
  const [search, setSearch] = useState("");
  const filtered = cats.filter(c => c.name.includes(search) || c.description.includes(search));

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">{t.communityForums}</h2><p className="section-sub">{t.browseCategories}</p></div>
        <button className="btn btn-accent" onClick={() => { if (!user) { setShowAuth("login"); return; } nav({ v: "new" }); }}>{t.newThread}</button>
      </div>
      <div className="search-bar"><input className="search-input" placeholder={t.searchForums} value={search} onChange={e => setSearch(e.target.value)} /><button className="btn btn-surface">{lang === "ar" ? "بحث" : "Search"}</button></div>
      <div className="cat-grid stagger">
        {filtered.map(c => (
          <div key={c.id} className="card cat-card" onClick={() => nav({ v: "cat", id: c.id })}>
            <div className="cat-icon">{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="cat-name">{c.name}</div>
              <div className="cat-desc">{c.description}</div>
              <div className="cat-stats"><span>📝 {c.threads} {t.threads}</span><span>💬 {c.posts} {t.posts}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2.5rem" }}>
        <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>{t.recentActivity}</h3>
        <ThreadList threads={MOCK_THREADS.slice(0, 5)} nav={nav} lang={lang} />
      </div>
    </div>
  );
}

function ThreadList({ threads, nav, lang }) {
  const t = useLang();
  return (
    <div className="thread-list stagger">
      {threads.map(th => (
        <div key={th.id} className="thread-row" onClick={() => nav({ v: "thread", id: th.id })}>
          <div className="thread-title-wrap">
            <div className="thread-title">
              {th.pinned && <span className="pin-badge">{t.pinned}</span>}
              {lang === "ar" ? th.titleAr : th.title}
            </div>
            <div className="thread-meta">
              <span className="thread-author-name">{th.author.avatar} {th.author.username}</span>
              <span>·</span><span>{th.lastActivity}</span>
              <span style={{ display: "flex", gap: 4 }}>{th.tags.map(tg => <span key={tg} className="tag-chip">{tg}</span>)}</span>
            </div>
          </div>
          <div className="thread-num"><div>{th.replies}</div><div className="thread-num-label">{t.replies}</div></div>
          <div className="thread-num"><div>{th.views.toLocaleString()}</div><div className="thread-num-label">{t.views}</div></div>
          <div className="thread-num"><div style={{ fontSize: "0.78rem" }}>{th.lastActivity}</div><div className="thread-num-label">{t.lastPost}</div></div>
        </div>
      ))}
    </div>
  );
}

function CategoryView({ catId, nav, user, setShowAuth, lang }) {
  const t = useLang();
  const cats = getCategoryData(t);
  const cat = cats.find(c => c.id === catId);
  const threads = MOCK_THREADS.filter(th => th.categoryId === catId);
  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.forums}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{cat?.name}</span></div>
      <div className="section-head">
        <div><h2 className="section-title">{cat?.icon} {cat?.name}</h2><p className="section-sub">{cat?.description}</p></div>
        <button className="btn btn-accent" onClick={() => { if (!user) { setShowAuth("login"); return; } nav({ v: "new", catId }); }}>{t.newThread}</button>
      </div>
      {threads.length > 0 ? <ThreadList threads={threads} nav={nav} lang={lang} /> : <div className="empty"><div className="empty-icon">📭</div><p>{t.noThreads}</p></div>}
    </div>
  );
}

function ThreadView({ threadId, nav, user, setShowAuth, lang }) {
  const t = useLang();
  const cats = getCategoryData(t);
  const th = MOCK_THREADS.find(x => x.id === threadId);
  const posts = MOCK_POSTS.filter(p => p.threadId === threadId);
  const cat = cats.find(c => c.id === th?.categoryId);
  const [reply, setReply] = useState("");
  const [localPosts, setLocalPosts] = useState(posts);

  const handleReply = () => {
    if (!user) { setShowAuth("login"); return; }
    if (!reply.trim()) return;
    setLocalPosts([...localPosts, { id: Date.now(), threadId, author: user, content: reply, contentAr: reply, createdAt: "Just now", likes: 0, isOP: false }]);
    setReply("");
  };

  if (!th) return <div className="empty"><p>Thread not found</p></div>;
  return (
    <div className="fade">
      <div className="bread">
        <button onClick={() => nav(null)}>{t.forums}</button><span>›</span>
        <button onClick={() => nav({ v: "cat", id: th.categoryId })}>{cat?.name}</button><span>›</span>
        <span style={{ color: "var(--text-primary)" }}>{lang === "ar" ? "الموضوع" : "Thread"}</span>
      </div>
      <div className="tv-header">
        <div className="tv-title">{lang === "ar" ? th.titleAr : th.title}</div>
        <div className="tv-info">
          <span>{t.by} <strong style={{ color: "var(--accent)" }}>{th.author.username}</strong></span>
          <span>💬 {th.replies} {t.replies}</span><span>👁 {th.views.toLocaleString()} {t.views}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: "0.75rem" }}>{th.tags.map(tg => <span key={tg} className="tag-chip">{tg}</span>)}</div>
      </div>
      <div className="stagger">
        {localPosts.map(p => (
          <div key={p.id} className={`post-card ${p.isOP ? "op-post" : ""}`}>
            <div className="post-head">
              <div className="post-avatar-wrap">
                <div className="post-avatar">{p.author.avatar}</div>
                <div><div className="post-uname">{p.author.username}</div><span className={`role-badge role-${p.author.role}`}>{p.author.role}</span></div>
              </div>
              <div className="post-date">{p.createdAt}</div>
            </div>
            <div className="post-body">{lang === "ar" ? p.contentAr : p.content}</div>
            <div className="post-foot">
              <button className="post-act">👍 {p.likes}</button>
              <button className="post-act">💬 {t.reply}</button>
              <button className="post-act">🔗 {t.share}</button>
              <button className="post-act">⚑ {t.report}</button>
            </div>
          </div>
        ))}
      </div>
      <div className="reply-box">
        <h3>{t.postReply}</h3>
        <textarea className="reply-area" placeholder={user ? t.writeReply : t.signInToReply} value={reply} onChange={e => setReply(e.target.value)} disabled={!user} />
        <div className="reply-bar">
          <button className="btn btn-surface btn-sm">{t.preview}</button>
          <button className="btn btn-accent btn-sm" onClick={handleReply}>{user ? t.postReplyBtn : t.signInToReplyBtn}</button>
        </div>
      </div>
    </div>
  );
}

function NewThreadForm({ nav, catId, lang }) {
  const t = useLang();
  const cats = getCategoryData(t);
  const [form, setForm] = useState({ title: "", category: catId || "", content: "", tags: "" });
  return (
    <div className="fade">
      <div className="bread"><button onClick={() => nav(null)}>{t.forums}</button><span>›</span><span style={{ color: "var(--text-primary)" }}>{t.createNewThread}</span></div>
      <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>{t.createNewThread}</h2>
      <div style={{ maxWidth: 760 }}>
        <div className="fg"><label className="fg-label">{t.category}</label><select className="select-field fg-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="">{t.selectCategory}</option>{cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
        <div className="fg"><label className="fg-label">{t.title}</label><input className="fg-input" placeholder={t.threadTitlePlaceholder} value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.tags}</label><input className="fg-input" placeholder={t.tagsPlaceholder} value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
        <div className="fg"><label className="fg-label">{t.content}</label><textarea className="reply-area" style={{ minHeight: 200 }} placeholder={t.contentPlaceholder} value={form.content} onChange={e => setForm({...form, content: e.target.value})} /></div>
        <div style={{ display: "flex", gap: 10 }}><button className="btn btn-accent">{t.createThread}</button><button className="btn btn-surface" onClick={() => nav(null)}>{t.cancel}</button></div>
      </div>
    </div>
  );
}

function ForumsPage({ user, setShowAuth, lang }) {
  const [state, setState] = useState(null);
  if (state?.v === "cat") return <CategoryView catId={state.id} nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
  if (state?.v === "thread") return <ThreadView threadId={state.id} nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
  if (state?.v === "new") return <NewThreadForm nav={setState} catId={state.catId} lang={lang} />;
  return <ForumsHome nav={setState} user={user} setShowAuth={setShowAuth} lang={lang} />;
}

function ShopPage({ user, setShowAuth, lang }) {
  const t = useLang();
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...new Set(MOCK_SHOP.map(i => i.category))];
  const filtered = filter === "all" ? MOCK_SHOP : MOCK_SHOP.filter(i => i.category === filter);

  return (
    <div className="fade">
      <div className="section-head">
        <div><h2 className="section-title">{t.developerShop}</h2><p className="section-sub">{t.shopDesc}</p></div>
        <button className="btn btn-amber" onClick={() => { if (!user) setShowAuth("login"); }}>🏷️ {t.sellProject}</button>
      </div>
      <div className="tabs">{categories.map(c => <button key={c} className={`tab ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c === "all" ? t.all : c}</button>)}</div>
      <div className="shop-grid stagger">
        {filtered.map(item => (
          <div key={item.id} className="card shop-card">
            <div className="shop-img">{item.image}</div>
            <div className="shop-body">
              <div className="shop-cat">{item.category}</div>
              <div className="shop-item-title">{lang === "ar" ? item.titleAr : item.title}</div>
              <div className="shop-desc">{lang === "ar" ? item.descAr : item.desc}</div>
              <div className="shop-seller">{item.seller.avatar} {item.seller.username} · ⭐ {item.seller.reputation}</div>
              <div className="shop-footer">
                <div className="shop-price">${item.price}</div>
                <div className="shop-stars">⭐ {item.rating} ({item.reviews})</div>
              </div>
              <button className="btn btn-accent btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>{t.viewDetails}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ user, lang }) {
  const t = useLang();
  const [tab, setTab] = useState("posts");
  if (!user) return <div className="empty"><div className="empty-icon">🔒</div><p>{t.signInToView}</p></div>;

  return (
    <div className="fade">
      <div className="prof-header">
        <div className="prof-avatar">{user.avatar}</div>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>{user.username}</h2>
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
          <div className="prof-stats">
            {[[user.reputation, t.reputation], ["47", t.posts], ["12", t.threads]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}><div className="prof-stat-v">{v}</div><div className="prof-stat-l">{l}</div></div>
            ))}
          </div>
        </div>
      </div>
      <div className="tabs">
        {[["posts", t.myPosts], ["threads", t.myThreads], ["shop", t.myShop], ["settings", t.settings]].map(([k, v]) => (
          <button key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>
      {tab === "settings" && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h3 style={{ marginBottom: "1.25rem", fontWeight: 700 }}>{t.accountSettings}</h3>
          <div className="fg"><label className="fg-label">{t.username}</label><input className="fg-input" defaultValue={user.username} /></div>
          <div className="fg"><label className="fg-label">{t.email}</label><input className="fg-input" type="email" defaultValue="user@example.com" /></div>
          <div className="fg"><label className="fg-label">{t.bio}</label><textarea className="reply-area" style={{ minHeight: 80 }} defaultValue="Rappelz developer" /></div>
          <button className="btn btn-accent">{t.saveChanges}</button>
        </div>
      )}
      {tab === "posts" && <div className="stagger">{MOCK_POSTS.filter(p => p.author.id === user.id).map(p => <div key={p.id} className="card" style={{ marginBottom: "0.75rem" }}><div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>{t.postedIn}: {MOCK_THREADS.find(th => th.id === p.threadId)?.[lang === "ar" ? "titleAr" : "title"]}</div><div style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>{(lang === "ar" ? p.contentAr : p.content).substring(0, 150)}...</div></div>)}</div>}
      {tab === "threads" && <ThreadList threads={MOCK_THREADS.filter(th => th.author.id === user.id)} nav={() => {}} lang={lang} />}
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

  const handleShowAuth = (mode) => {
    if (mode === "logout") { setUser(null); return; }
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
        {page === "profile" && <ProfilePage user={user} lang={lang} />}
      </div>
      <Footer />
      {showAuth && showAuth !== "logout" && <AuthModal mode={showAuth} setMode={setShowAuth} onClose={() => setShowAuth(null)} onLogin={u => setUser(u)} />}
    </LangContext.Provider>
  );
}
