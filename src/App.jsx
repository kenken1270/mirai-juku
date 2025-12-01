import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, MessageCircle, Star, Brain, Settings, Volume2, ChevronRight, RefreshCw, Trophy, Globe, GraduationCap, School, List, PlayCircle, CheckCircle, Clock, Filter, PenTool, Book, Gamepad2, Smile, Sparkles, XCircle, Timer, User, LogOut, BarChart3, AlertCircle, ArrowLeft, Calendar, TrendingUp, Award, Flame, Zap, Languages, Eye, EyeOff, Download, PieChart, Loader } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyDBCgtGbrXuppihRnAa0OxNMLveYlBJTxs",
  authDomain: "miraijuku-app.firebaseapp.com",
  projectId: "miraijuku-app",
  storageBucket: "miraijuku-app.firebasestorage.app",
  messagingSenderId: "1040724068428",
  appId: "1:1040724068428:web:2c0607c12cf7e43e8ccce9",
  measurementId: "G-02DC0R5VD4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// データの保存場所を区別するためのID
const appId = "mirai-juku-live"; 

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  zh: {
    app_name: "未来塾 (Mirai Juku)",
    login_title: "登录",
    login_label: "学生 ID / 教师 ID",
    login_button: "开始 / 登录",
    login_hint: "提示: 输入 'admin' 进入教师模式，其他 ID 进入学生模式。",
    login_error: "ID不能为空",
    logout: "退出",
    back: "返回",
    tab_mypage: "我的主页",
    tab_game: "游戏",
    tab_review: "复习",
    tab_vocab: "单词",
    tab_chat: "会话",
    tab_kanji: "汉字",
    teacher_dashboard: "未来塾 管理后台",
    total_students: "学生总数",
    avg_level: "平均等级",
    attention_needed: "需关注 (3天未登录)",
    student_list: "学生列表",
    click_detail: "※点击查看详情",
    col_id_name: "ID / 姓名",
    col_progress: "进度 (Level / XP)",
    col_last_login: "最后登录",
    col_status: "状态",
    status_good: "良好",
    status_worry: "需关注",
    status_normal: "正常",
    weak_points: "薄弱环节",
    recent_activity: "最近活动",
    no_weakness: "暂无薄弱单词。",
    back_to_list: "返回列表",
    learning_stats: "学习数据",
    export_all: "导出列表 (Excel)",
    export_detail: "导出详细报告 (Excel)",
    srs_mastered: "已掌握 (Mastered)",
    srs_learning: "学习中 (Learning)",
    srs_new: "未学习 (New)",
    retention_stats: "记忆定着度",
    view_scope: "显示范围",
    scope_all: "全部 (All)",
    scope_lesson: "第 {n} 课",
    progress_breakdown: "学习进度详情",
    level: "等级",
    next_xp: "下一级",
    total_xp: "总经验值",
    my_badges: "我的成就",
    no_badges: "还没有徽章，加油！",
    learning_record: "学习记录",
    game_header: "游戏时间",
    play_learn: "边玩边学！",
    card_match: "配对游戏",
    card_match_desc: "找出日语和中文的配对！\n练习单词的好机会。",
    start_game: "开始游戏",
    congrats: "恭喜！",
    completed_msg: "你完成了所有配对！获得额外 XP。",
    play_again: "再玩一次",
    time: "时间",
    mistakes: "错误",
    review_focus: "⚠️ 重点复习",
    quit_game: "退出",
    daily_review: "每日复习",
    review_desc: "选择复习项目，\n高效学习。",
    filter_all: "全部",
    filter_vocab: "单词",
    filter_kanji: "汉字",
    filter_chat: "会话",
    start_all: "开始全部",
    start: "开始",
    review_session: "复习时段",
    flip: "点击翻转",
    hard: "很难",
    good: "还行",
    easy: "简单",
    done_title: "太棒了！",
    done_msg: "今天的复习完成了。",
    back_home: "返回主页",
    no_items: "没有找到复习项目。",
    textbook: "教科书",
    select_lesson: "选择课程",
    lesson_prefix: "第",
    lesson_suffix: "课",
    list_mode: "列表",
    card_mode: "卡片",
    role_play: "角色扮演",
    play_all: "全部播放 (自动)",
    display_mode: "显示模式",
    mode_both: "双语",
    mode_jp: "仅日语",
    mode_cn: "仅中文",
    mext_std: "符合文部科学省标准",
    select_grade: "选择年级",
    mode_char: "字形",
    mode_read: "读音",
    mode_use: "用法",
    strokes: "画",
    meaning: "意思",
    example: "例子",
    compounds: "的单词",
  },
  ja: {
    app_name: "未来塾 (Mirai Juku)",
    login_title: "ログイン",
    login_label: "好きなIDを入力 (生徒/教師)",
    login_button: "はじめる / ログイン",
    login_hint: "ヒント: 'admin' で教師モード。それ以外は生徒モードになります。",
    login_error: "IDを入力してください",
    logout: "ログアウト",
    back: "戻る",
    tab_mypage: "マイページ",
    tab_game: "ゲーム",
    tab_review: "復習",
    tab_vocab: "単語",
    tab_chat: "会話",
    tab_kanji: "漢字",
    teacher_dashboard: "未来塾 管理画面",
    total_students: "総生徒数",
    avg_level: "平均レベル",
    attention_needed: "要注意 (3日未ログイン)",
    student_list: "生徒一覧",
    click_detail: "※クリックで詳細を表示",
    col_id_name: "ID / 名前",
    col_progress: "進捗 (Level / XP)",
    col_last_login: "最終ログイン",
    col_status: "状態",
    status_good: "順調",
    status_worry: "心配",
    status_normal: "普通",
    weak_points: "苦手な単語",
    recent_activity: "最近の活動",
    no_weakness: "苦手な単語はまだありません。",
    back_to_list: "一覧に戻る",
    learning_stats: "学習データ詳細",
    export_all: "一覧出力 (Excel)",
    export_detail: "詳細レポート出力 (Excel)",
    srs_mastered: "覚えた (Mastered)",
    srs_learning: "覚え中 (Learning)",
    srs_new: "未学習 (New)",
    retention_stats: "学習定着度",
    view_scope: "表示範囲",
    scope_all: "全範囲 (All)",
    scope_lesson: "第 {n} 課",
    progress_breakdown: "学習進捗内訳",
    level: "Lv",
    next_xp: "あと",
    total_xp: "総経験値",
    my_badges: "獲得バッジ",
    no_badges: "まだバッジがありません。頑張ろう！",
    learning_record: "学習記録",
    game_header: "ゲームの時間",
    play_learn: "遊びながら学ぼう！",
    card_match: "神経衰弱",
    card_match_desc: "日本語と意味のペアを見つけよう！\n単語練習のチャンス。",
    start_game: "ゲーム開始",
    congrats: "おめでとう！",
    completed_msg: "全てのペアを見つけました！ボーナスXP獲得。",
    play_again: "もう一度遊ぶ",
    time: "タイム",
    mistakes: "ミス",
    review_focus: "⚠️ 重点復習",
    quit_game: "中断",
    daily_review: "今日の復習",
    review_desc: "復習したい項目を選んで、\n効率よく学習しましょう。",
    filter_all: "すべて",
    filter_vocab: "単語",
    filter_kanji: "漢字",
    filter_chat: "会話",
    start_all: "すべて開始",
    start: "スタート",
    review_session: "復習セッション",
    flip: "タップで裏返す",
    hard: "難しい",
    good: "普通",
    easy: "簡単",
    done_title: "素晴らしい！",
    done_msg: "今日の復習は完了です。",
    back_home: "ホームへ戻る",
    no_items: "復習する項目がありません。",
    textbook: "教科書",
    select_lesson: "レッスン選択",
    lesson_prefix: "第",
    lesson_suffix: "課",
    list_mode: "リスト",
    card_mode: "カード",
    role_play: "ロールプレイ",
    play_all: "全再生 (自動)",
    display_mode: "表示モード",
    mode_both: "日中",
    mode_jp: "日のみ",
    mode_cn: "中のみ",
    mext_std: "文科省学習指導要領準拠",
    select_grade: "学年選択",
    mode_char: "文字",
    mode_read: "読み",
    mode_use: "使い方",
    strokes: "画",
    meaning: "意味",
    example: "例",
    compounds: "を使った単語",
  }
};

// --- DATA ---
const IRODORI_DATA = {
  1: {
    title: '第1課：はじめまして (初次见面)',
    topic: '自己紹介 (自我介绍)',
    vocab: [
      { id: 'v101', type: 'vocab', word: 'はじめまして', reading: 'はじめまして', meaning: '初次见面' },
      { id: 'v102', type: 'vocab', word: '〜から来ました', reading: '〜からきました', meaning: '我来自...' },
      { id: 'v103', type: 'vocab', word: 'お願いします', reading: 'おねがいします', meaning: '请多关照' },
      { id: 'v104', type: 'vocab', word: 'エンジニア', reading: 'えんじにあ', meaning: '工程师' },
    ],
    conversations: [
      {
        title: 'あいさつ (问候)',
        lines: [
          { id: 'c101', type: 'chat', speaker: 'A', text: 'はじめまして。田中です。', trans: '初次见面，我是田中。' },
          { id: 'c102', type: 'chat', speaker: 'B', text: 'はじめまして。ワンです。中国から来ました。', trans: '初次见面，我是王。我来自中国。' },
          { id: 'c103', type: 'chat', speaker: 'A', text: 'そうですか。よろしくお願いします。', trans: '是吗。请多关照。' },
        ]
      }
    ]
  },
  7: {
    title: '第7課：好きな食べ物 (喜欢的食物)',
    topic: '食事・料理 (饮食)',
    vocab: [
      { id: 'v701', type: 'vocab', word: '肉', reading: 'にく', meaning: '肉' },
      { id: 'v702', type: 'vocab', word: '魚', reading: 'さかな', meaning: '鱼' },
      { id: 'v703', type: 'vocab', word: '好きです', reading: 'すきです', meaning: '喜欢' },
      { id: 'v704', type: 'vocab', word: '一番', reading: 'いちばん', meaning: '最' },
      { id: 'v705', type: 'vocab', word: 'おいしい', reading: 'おいしい', meaning: '好吃' },
      { id: 'v706', type: 'vocab', word: 'メニュー', reading: 'めにゅー', meaning: '菜单' },
    ],
    conversations: [
      {
        title: '好きな料理 (喜欢的菜)',
        lines: [
          { id: 'c701', type: 'chat', speaker: 'A', text: '日本料理が好きですか？', trans: '你喜欢日本料理吗？' },
          { id: 'c702', type: 'chat', speaker: 'B', text: 'はい、好きです。特にラーメンが好きです。', trans: '是的，喜欢。特别是拉面。' },
        ]
      }
    ]
  },
  9: {
    title: '第9課：毎日のお買い物 (日常购物)',
    topic: '買い物 (购物)',
    vocab: [
      { id: 'v901', type: 'vocab', word: '安い', reading: 'やすい', meaning: '便宜' },
      { id: 'v902', type: 'vocab', word: '高い', reading: 'たかい', meaning: '贵' },
      { id: 'v903', type: 'vocab', word: '新鮮な', reading: 'しんせんな', meaning: '新鲜' },
      { id: 'v904', type: 'vocab', word: 'スーパー', reading: 'すーぱー', meaning: '超市' },
      { id: 'v905', type: 'vocab', word: 'これ', reading: 'これ', meaning: '这个' },
      { id: 'v906', type: 'vocab', word: 'いくら', reading: 'いくら', meaning: '多少钱' },
    ],
    conversations: [
      {
        title: 'スーパーで (在超市)',
        lines: [
          { id: 'c901', type: 'chat', speaker: 'A', text: 'このリンゴはいくらですか？', trans: '这个苹果多少钱？' },
          { id: 'c902', type: 'chat', speaker: 'B', text: '1個100円です。', trans: '一个100日元。' },
          { id: 'c903', type: 'chat', speaker: 'A', text: 'じゃあ、これを3つください。', trans: '那我要三个。' },
        ]
      }
    ]
  }
};

const KANJI_DATA = {
  grade1: {
    label: '小学1年生 (一年级)',
    chars: [
      { 
        id: 'k1-1', type: 'kanji', char: '一', on: 'ICHI', kun: 'hito', cn: '一', strokes: 1,
        example: '一つ (ひとつ)', 
        compounds: [
          { w: '一つ', r: 'ひとつ', m: '一个' },
          { w: '一月', r: 'いちがつ', m: '一月' },
          { w: '一人', r: 'ひとり', m: '一个人' }
        ]
      },
      { 
        id: 'k1-2', type: 'kanji', char: '山', on: 'SAN', kun: 'yama', cn: '山', strokes: 3,
        example: '富士山 (ふじさん)',
        compounds: [
          { w: '山道', r: 'やまみち', m: '山路' },
          { w: '火山', r: 'かざん', m: '火山' },
          { w: '富士山', r: 'ふじさん', m: '富士山' }
        ]
      },
    ]
  }
};

// --- Helper Functions ---
const speak = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.includes('ja'));
  if (jpVoice) utterance.voice = jpVoice;
  window.speechSynthesis.speak(utterance);
};

const getAllItems = () => {
  let items = [];
  Object.values(IRODORI_DATA).forEach(lesson => {
    items = [...items, ...lesson.vocab];
    lesson.conversations.forEach(convo => {
      items = [...items, ...convo.lines];
    });
  });
  Object.values(KANJI_DATA).forEach(grade => {
    items = [...items, ...grade.chars];
  });
  return items;
};

const getDailyReviewItems = (filter = 'all') => {
  let all = getAllItems();
  if (filter !== 'all') {
    all = all.filter(item => item.type === filter);
  }
  return all.sort(() => 0.5 - Math.random()).slice(0, 10);
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const downloadCSV = (filename, content) => {
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- COMPONENTS ---

const LanguageToggle = ({ lang, setLang }) => (
  <button 
    onClick={() => setLang(lang === 'zh' ? 'ja' : 'zh')}
    className="flex items-center gap-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold transition-all border border-indigo-100/50"
  >
    <Globe size={14} />
    {lang === 'zh' ? 'ZH' : 'JP'}
  </button>
);

const ProgressBreakdown = ({ stats, label, t }) => {
  const data = stats || { mastered: 0, learning: 0, new: 0 };
  const total = data.mastered + data.learning + data.new;
  const displayTotal = total === 0 ? 1 : total; 
  const pMastered = (data.mastered / displayTotal) * 100;
  const pLearning = (data.learning / displayTotal) * 100;
  const pNew = total === 0 ? 100 : (data.new / displayTotal) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <h4 className="text-sm font-bold text-gray-700">{label}</h4>
        <span className="text-xs text-gray-400">Total: {total}</span>
      </div>
      <div className="h-4 w-full bg-gray-100 rounded-full flex overflow-hidden">
        <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${pMastered}%` }} title={t.srs_mastered}></div>
        <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${pLearning}%` }} title={t.srs_learning}></div>
        <div className="bg-gray-300 h-full transition-all duration-500" style={{ width: `${pNew}%` }} title={t.srs_new}></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-center font-bold">
        <div className="text-green-600">{t.srs_mastered}<br/>{data.mastered}</div>
        <div className="text-yellow-600">{t.srs_learning}<br/>{data.learning}</div>
        <div className="text-gray-400">{t.srs_new}<br/>{data.new}</div>
      </div>
    </div>
  );
};

// 1. LOGIN SCREEN
const LoginScreen = ({ onLogin, lang, setLang }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id.trim()) {
      setError(t.login_error);
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      
      const userId = id.trim();
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', userId);
      const userSnap = await getDoc(userRef);

      let userData;

      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // Create new user if not exists
        const initialData = {
          id: userId,
          name: userId === 'admin' ? 'Teacher' : `Student ${userId}`,
          role: userId === 'admin' ? 'teacher' : 'student',
          xp: 0,
          level: 1,
          lastLogin: new Date().toISOString().split('T')[0],
          mistakes: 0,
          weakWords: [],
          recentActivity: [],
          weeklyStats: [0,0,0,0,0,0,0],
          badges: [],
          progress: { vocab: 0, kanji: 0, chat: 0 },
          progressByLesson: {
            total: { mastered: 0, learning: 0, new: getAllItems().length }
          }
        };
        await setDoc(userRef, initialData);
        userData = initialData;
      }

      onLogin(userData);

    } catch (err) {
      console.error("Login Error:", err);
      setError("Login failed. Please check your network or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-50 p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageToggle lang={lang} setLang={setLang} />
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <School size={40} className="text-indigo-600" />
        </div>
        <h1 className="text-2xl font-black text-indigo-900 mb-2">{t.app_name}</h1>
        <p className="text-gray-500 mb-8 font-bold">{t.login_title}</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-xs font-bold text-gray-400 ml-1">{t.login_label}</label>
            <input 
              type="text" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="s001"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? <Loader size={20} className="animate-spin" /> : t.login_button}
          </button>
        </form>
        <div className="mt-6 text-xs text-gray-400">
           {t.login_hint}
        </div>
      </div>
    </div>
  );
};

// 2. TEACHER DASHBOARD
const TeacherDashboard = ({ currentUser, onLogout, lang, setLang }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'students'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentList = snapshot.docs
        .map(doc => doc.data())
        .filter(u => u.role === 'student');
      setStudents(studentList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleExportAllStudents = () => {
    const header = `ID,${t.col_id_name},${t.col_progress},${t.col_last_login},${t.col_status},${t.srs_mastered},${t.srs_learning},${t.srs_new}\n`;
    const rows = students.map(s => {
      let status = t.status_normal;
      if (s.xp > 300) status = t.status_good;
      else if (s.xp < 50) status = t.status_worry;
      
      const srs = s.progressByLesson?.total || { mastered: 0, learning: 0, new: 0 };
      
      return `${s.id},${s.name},Lv.${s.level} (${s.xp}XP),${s.lastLogin},${status},${srs.mastered},${srs.learning},${srs.new}`;
    }).join("\n");
    
    downloadCSV("mirai_juku_all_students.csv", header + rows);
  };

  const handleExportStudentDetail = (student) => {
    let content = "";
    const srs = student.progressByLesson?.total || { mastered: 0, learning: 0, new: 0 };
    
    content += "【基本情報 / Basic Info】\n";
    content += `ID,${student.id}\n`;
    content += `名前,${student.name}\n`;
    content += `レベル,${student.level}\n`;
    content += `総XP,${student.xp}\n`;
    content += `最終ログイン,${student.lastLogin}\n\n`;

    content += `【${t.retention_stats} (Total) / Memory Retention】\n`;
    content += `${t.srs_mastered},${srs.mastered}\n`;
    content += `${t.srs_learning},${srs.learning}\n`;
    content += `${t.srs_new},${srs.new}\n\n`;

    content += `【${t.weak_points} / Weak Words】\n`;
    if (student.weakWords && student.weakWords.length > 0) {
      student.weakWords.forEach(w => {
        content += `${w}\n`;
      });
    } else {
      content += `${t.no_weakness}\n`;
    }
    content += "\n";

    content += `【${t.recent_activity} / Recent Activity】\n`;
    content += "日付 (Date),活动内容 (Action),分数 (Score)\n";
    if (student.recentActivity && student.recentActivity.length > 0) {
      student.recentActivity.forEach(a => {
        content += `${a.date},${a.action},${a.score}\n`;
      });
    }
    
    downloadCSV(`report_${student.id}.csv`, content);
  };

  const StudentDetail = ({ student, onBack }) => {
    const [viewScope, setViewScope] = useState('total');
    const weeklyStats = student.weeklyStats || [0, 0, 0, 0, 0, 0, 0];
    const badges = student.badges || [];
    const srsStats = (student.progressByLesson && student.progressByLesson[viewScope]) 
      ? student.progressByLesson[viewScope] 
      : { mastered: 0, learning: 0, new: 0 };

    const badgeList = [
      { id: 'beginner', name: '入门 (Beginner)', icon: Zap, color: 'text-yellow-500 bg-yellow-100' },
      { id: 'streak3', name: '3天连续 (3 Day Streak)', icon: Flame, color: 'text-orange-500 bg-orange-100' },
      { id: 'streak7', name: '7天连续 (7 Day Streak)', icon: Flame, color: 'text-red-500 bg-red-100' },
      { id: 'vocab_master', name: '单词大师 (Vocab Master)', icon: BookOpen, color: 'text-blue-500 bg-blue-100' },
      { id: 'kanji_master', name: '汉字大师 (Kanji Master)', icon: PenTool, color: 'text-purple-500 bg-purple-100' },
    ];

    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"><ArrowLeft size={20} /> {t.back_to_list}</button>
          <button onClick={() => handleExportStudentDetail(student)} className="flex items-center gap-2 bg-green-600 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm">
            <Download size={16} /> {t.export_detail}
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><User size={40} /></div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">{student.name}</h2>
            <p className="text-gray-500 font-medium">ID: {student.id}</p>
            <div className="flex gap-3 mt-2">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Trophy size={12} /> Level {student.level}</span>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star size={12} /> {student.xp} XP</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><PieChart size={20} className="text-indigo-500" /> {t.progress_breakdown}</h3>
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">{t.view_scope}:</span>
                <select value={viewScope} onChange={(e) => setViewScope(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 font-bold">
                  <option value="total">{t.scope_all}</option>
                  {Object.keys(IRODORI_DATA).map(key => (
                    <option key={key} value={key}>{t.lesson_prefix} {key} {t.lesson_suffix}</option>
                  ))}
                </select>
             </div>
           </div>
           <ProgressBreakdown stats={srsStats} label={viewScope === 'total' ? t.scope_all : `${t.lesson_prefix} ${viewScope} ${t.lesson_suffix}`} t={t} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-green-500" /> {t.learning_stats} (Week)</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {weeklyStats.map((stat, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full bg-indigo-100 rounded-t-sm hover:bg-indigo-300 transition-colors relative" style={{ height: `${Math.max((stat / 100) * 100, 5)}%` }}></div>
                    <div className="text-[10px] text-gray-400 font-bold">{['M','T','W','T','F','S','S'][i]}</div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Award size={20} className="text-yellow-500" /> {t.my_badges}</h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.length > 0 ? badges.map(badgeId => {
                  const badge = badgeList.find(b => b.id === badgeId);
                  if (!badge) return null;
                  return (
                    <div key={badgeId} className={`flex flex-col items-center justify-center p-3 rounded-xl ${badge.color} bg-opacity-20 border border-gray-100`}>
                      <badge.icon size={24} className="mb-1" />
                      <span className="text-[10px] font-bold text-center leading-tight">{badge.name}</span>
                    </div>
                  );
                }) : (
                  <div className="col-span-3 text-gray-400 text-sm italic text-center py-4">{t.no_badges}</div>
                )}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><AlertCircle size={20} className="text-red-500" /> {t.weak_points}</h3>
            {student.weakWords && student.weakWords.length > 0 ? (
              <ul className="space-y-2">{student.weakWords.map((word, idx) => (<li key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg text-red-800 font-medium text-sm">{word}<button onClick={() => speak(word)} className="p-1 hover:bg-red-100 rounded-full"><Volume2 size={16} /></button></li>))}</ul>
            ) : ( <p className="text-gray-400 text-sm">{t.no_weakness}</p> )}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock size={20} className="text-indigo-500" /> {t.recent_activity}</h3>
            <div className="space-y-4">{student.recentActivity && student.recentActivity.map((activity, idx) => (<div key={idx} className="flex items-center gap-4 text-sm"><div className="w-12 text-gray-400 font-mono text-xs">{activity.date}</div><div className="flex-1 font-bold text-gray-700">{activity.action}</div><div className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">{activity.score}</div></div>))}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-4xl mx-auto border-x border-gray-200">
      <header className="bg-white px-6 py-4 shadow-sm z-10 border-b border-gray-100 flex justify-between items-center">
         <h1 className="text-xl font-black text-indigo-900 flex items-center gap-2"><School className="text-indigo-500" size={24} /> {t.teacher_dashboard}</h1>
         <div className="flex items-center gap-3">
            <LanguageToggle lang={lang} setLang={setLang} />
            <button onClick={onLogout} className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200"><LogOut size={14} /> {t.logout}</button>
         </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64"><div className="animate-spin text-indigo-500"><Loader size={40} /></div></div>
        ) : selectedStudent ? ( 
          <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} /> 
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="text-gray-400 text-xs font-bold mb-1">{t.total_students}</div><div className="text-3xl font-black text-gray-800">{students.length} <span className="text-sm font-normal text-gray-400"></span></div></div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="text-gray-400 text-xs font-bold mb-1">{t.avg_level}</div><div className="text-3xl font-black text-indigo-600">{(students.reduce((acc, s) => acc + s.level, 0) / (students.length || 1)).toFixed(1)}</div></div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"><div className="text-gray-400 text-xs font-bold mb-1">{t.attention_needed}</div><div className="text-3xl font-black text-red-500 flex items-center gap-2">0 <AlertCircle size={24} /></div></div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><List size={20} /> {t.student_list} <span className="text-xs font-normal text-gray-400 ml-2">{t.click_detail}</span></h2>
              <button onClick={handleExportAllStudents} className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all text-sm">
                <Download size={16} /> {t.export_all}
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500"><tr><th className="px-6 py-3">{t.col_id_name}</th><th className="px-6 py-3">{t.col_progress}</th><th className="px-6 py-3">{t.col_last_login}</th><th className="px-6 py-3">{t.col_status}</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student.id} onClick={() => setSelectedStudent(student)} className="hover:bg-indigo-50/50 cursor-pointer transition-colors">
                      <td className="px-6 py-4"><div className="font-bold text-gray-900">{student.name}</div><div className="text-xs text-indigo-400">ID: {student.id}</div></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-2"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">Lv.{student.level}</span><span className="text-gray-400 text-xs">{student.xp} XP</span></div></td>
                      <td className="px-6 py-4 font-mono text-xs">{student.lastLogin}</td>
                      <td className="px-6 py-4"><div className="flex items-center justify-between">{student.xp > 300 ? (<span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle size={14} /> {t.status_good}</span>) : student.xp < 50 ? (<span className="flex items-center gap-1 text-red-500 text-xs font-bold"><AlertCircle size={14} /> {t.status_worry}</span>) : (<span className="text-gray-400 text-xs">{t.status_normal}</span>)}<ChevronRight size={16} className="text-gray-300" /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// 3. STUDENT APP COMPONENTS
const StudentMyPage = ({ currentUser, t }) => {
  const [viewScope, setViewScope] = useState('total');
  const weeklyStats = currentUser.weeklyStats || [0, 0, 0, 0, 0, 0, 0];
  const badges = currentUser.badges || [];
  const srsStats = (currentUser.progressByLesson && currentUser.progressByLesson[viewScope])
    ? currentUser.progressByLesson[viewScope]
    : { mastered: 0, learning: 0, new: 0 };

  const badgeList = [
    { id: 'beginner', name: '入门 (Beginner)', icon: Zap, color: 'text-yellow-500 bg-yellow-100' },
    { id: 'streak3', name: '3天连续 (3 Day Streak)', icon: Flame, color: 'text-orange-500 bg-orange-100' },
    { id: 'streak7', name: '7天连续 (7 Day Streak)', icon: Flame, color: 'text-red-500 bg-red-100' },
    { id: 'vocab_master', name: '单词大师 (Vocab Master)', icon: BookOpen, color: 'text-blue-500 bg-blue-100' },
    { id: 'kanji_master', name: '汉字大师 (Kanji Master)', icon: PenTool, color: 'text-purple-500 bg-purple-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10"></div>
        <div className="w-24 h-24 bg-white p-1 rounded-full shadow-md z-10 mb-3">
          <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500"><User size={48} /></div>
        </div>
        <h2 className="text-2xl font-black text-gray-800 z-10">{currentUser.name}</h2>
        <p className="text-sm text-gray-400 font-bold z-10 mb-4">ID: {currentUser.id}</p>
        <div className="w-full max-w-xs z-10">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
            <span>{t.level} {currentUser.level}</span>
            <span>{t.next_xp}: {(currentUser.level + 1) * 100} XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min((currentUser.xp / (currentUser.level * 100)) * 100, 100)}%` }}></div>
          </div>
          <div className="text-center mt-2 text-indigo-600 font-black text-sm">{t.total_xp}: {currentUser.xp}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><PieChart size={20} className="text-indigo-500" /> {t.progress_breakdown}</h3>
           <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">{t.view_scope}:</span>
              <select value={viewScope} onChange={(e) => setViewScope(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 font-bold">
                <option value="total">{t.scope_all}</option>
                {Object.keys(IRODORI_DATA).map(key => (
                  <option key={key} value={key}>{t.lesson_prefix} {key} {t.lesson_suffix}</option>
                ))}
              </select>
           </div>
         </div>
         <ProgressBreakdown stats={srsStats} label={viewScope === 'total' ? t.scope_all : `${t.lesson_prefix} ${viewScope} ${t.lesson_suffix}`} t={t} />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Award size={20} className="text-yellow-500" /> {t.my_badges}</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {badges.length > 0 ? badges.map(badgeId => {
            const badge = badgeList.find(b => b.id === badgeId);
            if (!badge) return null;
            return (
              <div key={badgeId} className={`flex-shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-xl ${badge.color} bg-opacity-20 border-2 border-white shadow-sm`}>
                <badge.icon size={28} className="mb-1" />
                <span className="text-[10px] font-bold text-center leading-tight px-1">{badge.name}</span>
              </div>
            );
          }) : (
            <div className="text-gray-400 text-sm italic w-full text-center py-4">{t.no_badges}</div>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-green-500" /> {t.learning_record}</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {weeklyStats.map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">{stat}</div>
              <div className="w-full bg-indigo-100 rounded-t-lg hover:bg-indigo-300 transition-colors relative" style={{ height: `${Math.max((stat / 100) * 100, 5)}%` }}></div>
              <div className="text-[10px] text-gray-400 font-bold">{['M','T','W','T','F','S','S'][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
    <Icon size={24} />
    <span className="text-[10px] mt-1 font-bold">{label}</span>
  </button>
);

const LessonSelector = ({ currentLesson, onChange, t }) => (
  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><BookOpen size={18} /></div>
      <div>
        <span className="text-xs text-gray-500 font-bold block">{t.textbook}</span>
        <span className="text-sm font-bold text-indigo-900">{t.select_lesson}</span>
      </div>
    </div>
    <select value={currentLesson} onChange={(e) => onChange(Number(e.target.value))} className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold">
      {Object.keys(IRODORI_DATA).map(key => (
        <option key={key} value={key}>{t.lesson_prefix} {key} {t.lesson_suffix}</option>
      ))}
    </select>
  </div>
);

const KanjiGradeSelector = ({ currentGrade, onChange, t }) => (
  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><GraduationCap size={18} /></div>
      <div>
        <span className="text-xs text-gray-500 font-bold block">{t.mext_std}</span>
        <span className="text-sm font-bold text-orange-900">{t.select_grade}</span>
      </div>
    </div>
    <select value={currentGrade} onChange={(e) => onChange(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 font-bold w-36">
      {Object.keys(KANJI_DATA).map(key => (
        <option key={key} value={key}>{KANJI_DATA[key].label}</option>
      ))}
    </select>
  </div>
);

// --- Student App Shell ---
const StudentApp = ({ currentUser, onLogout, updateUserData, lang, setLang }) => {
  const [activeTab, setActiveTab] = useState('mypage'); 
  const [currentLesson, setCurrentLesson] = useState(9);
  const [currentKanjiGrade, setCurrentKanjiGrade] = useState('grade1');
  const [kanjiMode, setKanjiMode] = useState('char'); 
  const [vocabMode, setVocabMode] = useState('list');
  const [reviewFilter, setReviewFilter] = useState('all'); 
  const [reviewQueue, setReviewQueue] = useState([]);
  const [isReviewStarted, setIsReviewStarted] = useState(false);
  const [xp, setXp] = useState(currentUser.xp);
  const [level, setLevel] = useState(currentUser.level);
  const [chatDisplayMode, setChatDisplayMode] = useState('both');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const nextLevelXp = level * 100;
    if (xp >= nextLevelXp) setLevel(prev => prev + 1);
    updateUserData({ xp, level });
  }, [xp, level]);

  const addXp = (amount) => setXp(prev => prev + amount);

  const startReview = () => {
    const queue = getDailyReviewItems(reviewFilter);
    setReviewQueue(queue);
    setIsReviewStarted(true);
  };

  const handleSRSResult = (id, difficulty) => {
    console.log(`SRS Update: Item ${id} marked as ${difficulty}`);
    addXp(5);
  };

  const updateProgressStats = (wordId, status) => {
    const currentProgress = currentUser.progressByLesson?.total || { mastered: 0, learning: 0, new: 0 };
    const newProgress = { ...currentProgress, mastered: currentProgress.mastered + 1 };
    updateUserData({
      progressByLesson: {
        ...currentUser.progressByLesson,
        total: newProgress
      }
    });
  };

  const getLessonData = () => IRODORI_DATA[currentLesson] || IRODORI_DATA[1];
  const getKanjiData = () => KANJI_DATA[currentKanjiGrade];

  const renderContent = () => {
    const lessonData = getLessonData();
    const kanjiData = getKanjiData();

    switch (activeTab) {
      case 'mypage': return <StudentMyPage currentUser={currentUser} t={t} />;
      case 'game':
        return (
          <div className="space-y-4">
            <LessonSelector currentLesson={currentLesson} onChange={setCurrentLesson} t={t} />
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl shadow-md mb-4 flex justify-between items-center">
               <div><h2 className="font-bold text-lg flex items-center gap-2"><Gamepad2 size={20}/> {t.game_header}</h2><p className="text-xs opacity-80">{t.play_learn}</p></div>
               <div className="text-right"><div className="text-2xl font-black">{xp} XP</div><div className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">{t.level} {level}</div></div>
            </div>
            <MatchingGame vocabList={lessonData.vocab} onGainXP={addXp} t={t} onUpdateProgress={updateProgressStats} />
          </div>
        );
      case 'review':
        return (
          <div className="space-y-6 pt-2">
            {!isReviewStarted ? (
              <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-white p-6 rounded-full shadow-lg"><RefreshCw size={64} className="text-indigo-600" /></div>
                </div>
                <div className="text-center space-y-2"><h2 className="text-3xl font-black text-gray-800">{t.daily_review}</h2><p className="text-indigo-600 font-bold text-lg">Daily Review</p><p className="text-gray-400 text-sm max-w-xs mx-auto whitespace-pre-wrap">{t.review_desc}</p></div>
                <div className="w-full px-6">
                  <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1">
                    {[ { id: 'all', label: t.filter_all, icon: RefreshCw }, { id: 'vocab', label: t.filter_vocab, icon: BookOpen }, { id: 'kanji', label: t.filter_kanji, icon: Brain }, { id: 'chat', label: t.filter_chat, icon: MessageCircle } ].map(type => (
                      <button key={type.id} onClick={() => setReviewFilter(type.id)} className={`flex-1 py-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${reviewFilter === type.id ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-gray-400 hover:text-gray-600'}`}><type.icon size={18} /> <span className="text-[10px] font-bold">{type.label}</span></button>
                    ))}
                  </div>
                </div>
                <button onClick={startReview} className="w-full max-w-xs bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"><PlayCircle size={24} /> {reviewFilter === 'all' ? t.start_all : t.start}</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6 px-2"><h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">{reviewFilter === 'all' && <RefreshCw size={20} className="text-indigo-500" />} {t.review_session}</h2><button onClick={() => setIsReviewStarted(false)} className="text-xs text-gray-400 font-bold hover:text-gray-600">{t.quit_game}</button></div>
                <MixedFlashcard items={reviewQueue} onResult={handleSRSResult} onComplete={() => setIsReviewStarted(false)} t={t} />
              </div>
            )}
          </div>
        );
      case 'vocab':
        return (
          <div className="space-y-4">
            <LessonSelector currentLesson={currentLesson} onChange={setCurrentLesson} t={t} />
            <div className="bg-gray-100 p-1 rounded-lg flex mb-4">
              <button onClick={() => setVocabMode('list')} className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${vocabMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}><List size={16} /> {t.list_mode}</button>
              <button onClick={() => setVocabMode('flashcard')} className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${vocabMode === 'flashcard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}><RefreshCw size={16} /> {t.card_mode}</button>
            </div>
            {vocabMode === 'list' ? (
              <div className="grid gap-3">
                {lessonData.vocab.map((v) => (
                  <div key={v.id} onClick={() => speak(v.word)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-[0.99] transition-transform">
                    <div><div className="text-xl font-black text-gray-800">{v.word}</div><div className="text-sm text-indigo-600 font-bold">{v.reading}</div></div>
                    <div className="text-right"><div className="text-sm text-gray-500 font-medium">{v.meaning}</div><Volume2 size={14} className="text-indigo-300 ml-auto mt-1" /></div>
                  </div>
                ))}
              </div>
            ) : ( <MixedFlashcard items={lessonData.vocab} onResult={handleSRSResult} onComplete={() => setVocabMode('list')} t={t} /> )}
          </div>
        );
      case 'chat':
        return (
          <div className="space-y-4">
            <LessonSelector currentLesson={currentLesson} onChange={setCurrentLesson} t={t} />
            <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
              <button onClick={() => setChatDisplayMode('both')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${chatDisplayMode === 'both' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}><Eye size={14} className="inline mr-1" /> {t.mode_both}</button>
              <button onClick={() => setChatDisplayMode('jp')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${chatDisplayMode === 'jp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>{t.mode_jp}</button>
              <button onClick={() => setChatDisplayMode('cn')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${chatDisplayMode === 'cn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>{t.mode_cn}</button>
            </div>
            {lessonData.conversations.map((convo, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
                <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-gray-700">{convo.title}</h3><span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">{t.role_play}</span></div>
                <div className="p-4 space-y-4">
                  {convo.lines.map((line, i) => (
                    <div key={i} className={`flex ${line.speaker === 'A' ? 'justify-start' : 'justify-end'}`} onClick={() => speak(line.text)}>
                      <div className={`flex flex-col ${line.speaker === 'A' ? 'items-start' : 'items-end'} max-w-[85%]`}>
                        <span className="text-xs text-gray-400 mb-1 ml-1">{line.speaker}</span>
                        <div className={`rounded-2xl p-3 cursor-pointer hover:opacity-90 transition-opacity relative group text-left ${line.speaker === 'A' ? 'bg-gray-100 rounded-tl-none text-gray-800' : 'bg-indigo-500 text-white rounded-tr-none'}`}>
                          {chatDisplayMode !== 'cn' && <p className="text-sm font-bold leading-relaxed">{line.text}</p>}
                          {chatDisplayMode !== 'jp' && <p className={`text-xs ${chatDisplayMode === 'cn' ? 'text-base font-bold' : 'mt-2 pt-2 border-t'} ${line.speaker === 'A' ? 'text-gray-500 border-gray-200' : 'text-indigo-200 border-indigo-400'}`}>{line.trans}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-2 flex justify-center"><button className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-white border border-indigo-100 px-4 py-2 rounded-full shadow-sm active:scale-95 transition-transform"><PlayCircle size={14} /> {t.play_all}</button></div>
              </div>
            ))}
          </div>
        );
      case 'kanji':
        return (
          <div className="space-y-6">
            <KanjiGradeSelector currentGrade={currentKanjiGrade} onChange={setCurrentKanjiGrade} t={t} />
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex bg-gray-50 p-1 rounded-xl mb-4">
                <button onClick={() => setKanjiMode('char')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${kanjiMode === 'char' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}><PenTool size={14} /> {t.mode_char}</button>
                <button onClick={() => setKanjiMode('reading')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${kanjiMode === 'reading' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}><Volume2 size={14} /> {t.mode_read}</button>
                <button onClick={() => setKanjiMode('usage')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${kanjiMode === 'usage' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}><Book size={14} /> {t.mode_use}</button>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-xl min-h-[400px]">
                <h2 className="text-lg font-bold text-orange-800 mb-4 px-2">{kanjiData.label}</h2>
                {kanjiMode === 'char' && (
                  <div className="grid grid-cols-2 gap-4">
                    {kanjiData.chars.map((k) => (
                      <div key={k.id} className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-orange-200 flex flex-col items-center">
                        <div className="text-6xl font-black text-gray-800 mb-2 font-serif">{k.char}</div>
                        <div className="text-xs font-bold text-orange-400 bg-orange-50 px-2 py-1 rounded-full">{k.strokes} {t.strokes}</div>
                        <div className="mt-2 text-xs text-gray-400">{t.meaning}: {k.cn}</div>
                      </div>
                    ))}
                  </div>
                )}
                {kanjiMode === 'reading' && (
                  <div className="space-y-3">
                    {kanjiData.chars.map((k) => (
                      <div key={k.id} onClick={() => speak(k.on + ', ' + k.kun)} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform">
                        <div className="text-4xl font-black text-gray-800 font-serif w-16 text-center">{k.char}</div>
                        <div className="flex-1 pl-4 border-l border-gray-100">
                          <div className="flex items-center gap-2 mb-1"><span className="text-[10px] bg-gray-800 text-white px-1.5 rounded">ON</span><span className="font-bold text-gray-800">{k.on}</span></div>
                          <div className="flex items-center gap-2"><span className="text-[10px] bg-gray-400 text-white px-1.5 rounded">KUN</span><span className="font-bold text-gray-600">{k.kun}</span></div>
                        </div>
                        <Volume2 size={16} className="text-orange-300" />
                      </div>
                    ))}
                  </div>
                )}
                {kanjiMode === 'usage' && (
                  <div className="space-y-4">
                    {kanjiData.chars.map((k) => (
                      <div key={k.id} className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                         <div className="bg-orange-100 px-4 py-2 flex items-center gap-2"><span className="text-2xl font-black text-orange-800 font-serif">{k.char}</span><span className="text-xs text-orange-600 font-bold">{t.compounds}</span></div>
                         <div className="divide-y divide-gray-50">
                           {k.compounds && k.compounds.length > 0 ? (
                             k.compounds.map((c, i) => (
                               <div key={i} onClick={() => speak(c.w)} className="p-3 flex justify-between items-center hover:bg-orange-50 cursor-pointer">
                                 <div><div className="font-bold text-gray-800">{c.w}</div><div className="text-xs text-orange-500">{c.r}</div></div>
                                 <div className="text-xs text-gray-400">{c.m}</div>
                               </div>
                             ))
                           ) : (
                             <div onClick={() => speak(k.example)} className="p-3 flex justify-between items-center hover:bg-orange-50 cursor-pointer">
                               <div><div className="font-bold text-gray-800">{k.example.split(' ')[0]}</div><div className="text-xs text-orange-500">{k.example.split(' ')[1]}</div></div><div className="text-xs text-gray-400">{t.example}</div>
                             </div>
                           )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans max-w-lg mx-auto border-x border-gray-200">
      <header className="bg-white px-6 py-4 shadow-sm z-10 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-indigo-900 flex items-center gap-2"><School className="text-indigo-500" size={24} /> {t.app_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-white bg-indigo-500 px-2 py-0.5 rounded-full">{t.level} {level}</span>
              <div className="w-20 bg-gray-200 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${Math.min((xp / (level * 100)) * 100, 100)}%` }}></div></div>
              <span className="text-xs text-gray-400 ml-1">{currentUser.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle lang={lang} setLang={setLang} />
            <button onClick={onLogout} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">{renderContent()}</main>
      <nav className="fixed bottom-0 max-w-lg w-full bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around p-2 pb-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
        <TabButton active={activeTab === 'mypage'} onClick={() => setActiveTab('mypage')} icon={User} label={t.tab_mypage} />
        <TabButton active={activeTab === 'game'} onClick={() => setActiveTab('game')} icon={Gamepad2} label={t.tab_game} />
        <TabButton active={activeTab === 'review'} onClick={() => setActiveTab('review')} icon={RefreshCw} label={t.tab_review} />
        <TabButton active={activeTab === 'vocab'} onClick={() => setActiveTab('vocab')} icon={BookOpen} label={t.tab_vocab} />
        <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={MessageCircle} label={t.tab_chat} />
      </nav>
    </div>
  );
};

// 4. MAIN APP CONTAINER
export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('zh');

  const updateUserData = async (newData) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, ...newData }));
    try {
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', user.id);
      await updateDoc(userRef, newData);
    } catch (err) {
      console.error("Failed to update user data:", err);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} lang={lang} setLang={setLang} />;
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard currentUser={user} onLogout={() => setUser(null)} lang={lang} setLang={setLang} />;
  }

  return <StudentApp currentUser={user} onLogout={() => setUser(null)} updateUserData={updateUserData} lang={lang} setLang={setLang} />;
}
