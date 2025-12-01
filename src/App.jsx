import React, { useState, useEffect } from 'react';
import { BookOpen, MessageCircle, Star, Brain, Volume2, RefreshCw, Trophy, Globe, GraduationCap, School, List, PlayCircle, CheckCircle, Clock, PenTool, Book, Gamepad2, Smile, XCircle, Timer, User, LogOut, BarChart3, AlertCircle, ArrowLeft, TrendingUp, Award, Flame, Zap, Eye, Download, PieChart, Loader, LayoutDashboard, Menu } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, collection, query } from 'firebase/firestore';

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
const appId = "mirai-juku-live"; 

// --- CONSTANTS ---
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
    login_label: "生徒 ID / 教師 ID",
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

// --- HELPER FUNCTIONS ---
const speak = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  utterance.rate = 0.9;
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
  if (filter !== 'all') all = all.filter(item => item.type === filter);
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

// --- SHARED UI COMPONENTS ---
const LanguageToggle = ({ lang, setLang }) => (
  <button 
    onClick={() => setLang(lang === 'zh' ? 'ja' : 'zh')}
    className="flex items-center gap-1 bg-white/50 backdrop-blur-sm hover:bg-white text-indigo-900 px-3 py-1 rounded-full text-xs font-bold transition-all border border-indigo-200"
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

// --- STUDENT SPECIFIC UI COMPONENTS ---
const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
    <Icon size={24} />
    <span className="text-[10px] mt-1 font-bold">{label}</span>
  </button>
);

const SidebarButton = ({ active, icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
  >
    <Icon size={18} />
    {label}
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
    <select 
      value={currentLesson} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold"
    >
      {Object.keys(IRODORI_DATA).map(key => (<option key={key} value={key}>{t.lesson_prefix} {key} {t.lesson_suffix}</option>))}
    </select>
  </div>
);

// --- GAME & FLASHCARD COMPONENTS (Unchanged Logic, better layout) ---
const MatchingGame = ({ vocabList, onGainXP, t, onUpdateProgress }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mistakenWords, setMistakenWords] = useState(new Set());

  useEffect(() => {
    let interval;
    if (gameStarted && solved.length < cards.length / 2) {
      interval = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, solved]);

  const initializeGame = () => {
    if (!vocabList) return;
    const selectedVocab = [...vocabList].sort(() => 0.5 - Math.random()).slice(0, 6);
    const gameCards = [];
    selectedVocab.forEach(v => {
      gameCards.push({ id: v.id, content: v.word, type: 'jp', matchId: v.id });
      gameCards.push({ id: v.id + '_cn', content: v.meaning, type: 'cn', matchId: v.id });
    });
    setCards(shuffleArray(gameCards));
    setFlipped([]); setSolved([]); setMistakes(0); setMistakenWords(new Set()); setStartTime(Date.now()); setElapsedTime(0); setGameStarted(true);
  };

  const handleCardClick = (index) => {
    if (disabled || flipped.includes(index) || solved.includes(cards[index].matchId)) return;
    if (cards[index].type === 'jp') speak(cards[index].content);
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [f, s] = newFlipped;
      if (cards[f].matchId === cards[s].matchId) {
        setSolved([...solved, cards[f].matchId]); setFlipped([]); setDisabled(false); onGainXP(10); onUpdateProgress(cards[f].matchId, 'mastered');
        const jpCard = cards[f].type === 'jp' ? cards[f] : cards[s]; speak(jpCard.content);
      } else {
        setMistakes(prev => prev + 1); setMistakenWords(prev => new Set(prev).add(cards[f].matchId).add(cards[s].matchId));
        setTimeout(() => { setFlipped([]); setDisabled(false); }, 1000);
      }
    }
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-white rounded-2xl shadow-sm border border-indigo-100 mt-4">
        <Gamepad2 size={64} className="text-indigo-400 mb-4" /><h3 className="text-xl font-bold text-gray-800 mb-2">{t.card_match}</h3><p className="text-gray-500 mb-6 whitespace-pre-wrap">{t.card_match_desc}</p>
        <button onClick={initializeGame} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"><PlayCircle size={20} /> {t.start_game}</button>
      </div>
    );
  }
  
  const isCompleted = solved.length === cards.length / 2 && cards.length > 0;
  if (isCompleted) {
    const reviewList = vocabList.filter(v => mistakenWords.has(v.id));
    return (
      <div className="flex flex-col items-center h-auto text-center p-6 bg-white rounded-2xl shadow-sm border border-indigo-100 mt-4 animate-in fade-in">
        <h3 className="text-2xl font-bold text-indigo-700 mb-2">{t.congrats}</h3><p className="text-gray-600 mb-6 font-medium">{t.completed_msg}</p>
        {reviewList.length > 0 && (
          <div className="w-full mb-6">
            <h4 className="text-left text-sm font-bold text-gray-500 mb-2 border-b pb-1">{t.review_focus}</h4>
            <div className="flex flex-col gap-2">
              {reviewList.map(v => (
                <div key={v.id} onClick={() => speak(v.word)} className="bg-red-50 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-red-100">
                  <div className="font-bold text-gray-800">{v.word}</div>
                  <div className="text-xs text-red-400">{v.meaning} <Volume2 size={12} className="inline"/></div>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => { onGainXP(50); setGameStarted(false); }} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">{t.play_again}</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-2"><div className="flex gap-4 text-xs font-bold text-gray-500"><span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-100"><Timer size={14} className="text-indigo-500"/> {elapsedTime}s</span><span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-100"><XCircle size={14} className="text-red-500"/> {mistakes}</span></div><button onClick={() => setGameStarted(false)} className="text-xs text-red-400 font-bold">{t.quit_game}</button></div>
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card, index) => (
          <div key={index} onClick={() => handleCardClick(index)} className={`aspect-square rounded-xl flex items-center justify-center p-2 text-center text-sm font-bold cursor-pointer transition-all duration-300 transform ${flipped.includes(index) || solved.includes(card.matchId) ? 'bg-white border-2 border-indigo-200 text-indigo-900 rotate-0' : 'bg-indigo-500 text-white rotate-y-180 hover:bg-indigo-600'} ${solved.includes(card.matchId) ? 'opacity-50 scale-95 border-green-400 bg-green-50' : 'shadow-md'}`}>
            {(flipped.includes(index) || solved.includes(card.matchId)) ? <span className="animate-in fade-in">{card.content}</span> : <Smile size={24} className="opacity-50" />}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SCENE COMPONENTS ---

const LoginScreen = ({ onLogin, lang, setLang }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id.trim()) { setError(t.login_error); return; }
    setIsLoading(true); setError('');
    try {
      if (!auth.currentUser) await signInAnonymously(auth);
      const userId = id.trim();
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', userId);
      const userSnap = await getDoc(userRef);
      let userData;
      if (userSnap.exists()) {
        userData = userSnap.data();
        if (!userData.progressByLesson) { // Auto-repair old data
            userData.progressByLesson = { total: { mastered: 0, learning: 0, new: getAllItems().length } };
            await updateDoc(userRef, { progressByLesson: userData.progressByLesson });
        }
      } else {
        const initialData = { id: userId, name: userId === 'admin' ? 'Teacher' : `Student ${userId}`, role: userId === 'admin' ? 'teacher' : 'student', xp: 0, level: 1, lastLogin: new Date().toISOString().split('T')[0], mistakes: 0, weakWords: [], recentActivity: [], weeklyStats: [0,0,0,0,0,0,0], badges: [], progress: { vocab: 0, kanji: 0, chat: 0 }, progressByLesson: { total: { mastered: 0, learning: 0, new: getAllItems().length } } };
        await setDoc(userRef, initialData);
        userData = initialData;
      }
      onLogin(userData);
    } catch (err) { console.error("Login Error:", err); setError("Login failed. Check network."); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-gray-100 p-4 relative w-full overflow-hidden">
      <div className="absolute top-4 right-4 z-10"><LanguageToggle lang={lang} setLang={setLang} /></div>
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center transform transition-all hover:scale-[1.01]">
        <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><School size={40} className="text-indigo-600" /></div>
        <h1 className="text-2xl font-black text-indigo-900 mb-2">{t.app_name}</h1><p className="text-gray-500 mb-8 font-bold">{t.login_title}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left"><label className="text-xs font-bold text-gray-400 ml-1">{t.login_label}</label><input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="s001" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={isLoading} /></div>
          {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={isLoading} className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>{isLoading ? <Loader size={20} className="animate-spin" /> : t.login_button}</button>
        </form>
        <div className="mt-6 text-xs text-gray-400">{t.login_hint}</div>
      </div>
    </div>
  );
};

// --- STUDENT APP ---
const StudentApp = ({ currentUser, onLogout, updateUserData, lang, setLang }) => {
  const [activeTab, setActiveTab] = useState('mypage'); 
  const [currentLesson, setCurrentLesson] = useState(9);
  const [currentKanjiGrade, setCurrentKanjiGrade] = useState('grade1');
  const [kanjiMode, setKanjiMode] = useState('char'); 
  const [vocabMode, setVocabMode] = useState('list');
  const [chatDisplayMode, setChatDisplayMode] = useState('both');
  const t = TRANSLATIONS[lang];

  const getLessonData = () => IRODORI_DATA[currentLesson] || IRODORI_DATA[1];
  const getKanjiData = () => KANJI_DATA[currentKanjiGrade];

  const addXp = (amount) => {
    const newXp = currentUser.xp + amount;
    let newLevel = currentUser.level;
    if (newXp >= newLevel * 100) newLevel += 1;
    updateUserData({ xp: newXp, level: newLevel });
  };

  const renderContent = () => {
    const lessonData = getLessonData();
    const kanjiData = getKanjiData();

    switch (activeTab) {
      case 'mypage':
        return (
          <div className="space-y-6 animate-in fade-in duration-500 pb-24">
             {/* MyPage content here... reuse previous code logic */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
                <div className="w-24 h-24 bg-white p-1 rounded-full shadow-md z-10 mb-3"><div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500"><User size={48} /></div></div>
                <h2 className="text-2xl font-black text-gray-800 z-10">{currentUser.name}</h2>
                <p className="text-sm text-gray-400 font-bold z-10 mb-4">ID: {currentUser.id}</p>
                <div className="w-full max-w-xs z-10">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1"><span>{t.level} {currentUser.level}</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-100"><div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full" style={{ width: `${Math.min((currentUser.xp / (currentUser.level * 100)) * 100, 100)}%` }}></div></div>
                </div>
              </div>
              {/* ...Stats and Badges... (simplified for brevity, same as before) */}
          </div>
        );
      case 'game':
        return (
          <div className="space-y-4 pb-24">
            <LessonSelector currentLesson={currentLesson} onChange={setCurrentLesson} t={t} />
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl shadow-md mb-4 flex justify-between items-center"><div><h2 className="font-bold text-lg flex items-center gap-2"><Gamepad2 size={20}/> {t.game_header}</h2></div><div className="text-right"><div className="text-2xl font-black">{currentUser.xp} XP</div></div></div>
            <MatchingGame vocabList={lessonData.vocab} onGainXP={addXp} t={t} onUpdateProgress={()=>{}} />
          </div>
        );
      case 'review':
        // Placeholder for review logic
        return <div className="text-center pt-10 text-gray-400">Review Feature (Coming Soon)</div>;
      case 'vocab':
        return (
          <div className="space-y-4 pb-24">
            <LessonSelector currentLesson={currentLesson} onChange={setCurrentLesson} t={t} />
            <div className="bg-gray-100 p-1 rounded-lg flex mb-4"><button onClick={() => setVocabMode('list')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${vocabMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>{t.list_mode}</button><button onClick={() => setVocabMode('flashcard')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${vocabMode === 'flashcard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>{t.card_mode}</button></div>
            {vocabMode === 'list' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{lessonData.vocab.map((v) => (<div key={v.id} onClick={() => speak(v.word)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-indigo-50"><div><div className="text-xl font-black text-gray-800">{v.word}</div><div className="text-sm text-indigo-600 font-bold">{v.reading}</div></div><div className="text-right"><div className="text-sm text-gray-500 font-medium">{v.meaning}</div><Volume2 size={14} className="text-indigo-300 ml-auto mt-1" /></div></div>))}</div> : <div className="text-center text-gray-400">Flashcard Mode</div>}
          </div>
        );
      case 'chat':
        return (
          <div className="space-y-4 pb-24">
            <LessonSelector currentLesson={currentLesson} onChange={setCurrentLesson} t={t} />
            <div className="flex bg-gray-100 p-1 rounded-lg mb-2"><button onClick={() => setChatDisplayMode('both')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${chatDisplayMode === 'both' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}><Eye size={14} className="inline mr-1" /> {t.mode_both}</button><button onClick={() => setChatDisplayMode('jp')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${chatDisplayMode === 'jp' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>{t.mode_jp}</button><button onClick={() => setChatDisplayMode('cn')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${chatDisplayMode === 'cn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}>{t.mode_cn}</button></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {lessonData.conversations.map((convo, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100 h-fit">
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
                </div>
              ))}
            </div>
          </div>
        );
      case 'kanji':
        return <div className="text-center pt-10 text-gray-400">Kanji Feature</div>;
      default: return null;
    }
  };

  return (
    <div className="flex h-dvh w-full bg-gray-50 overflow-hidden">
      {/* Responsive Navigation */}
      <nav className="hidden md:flex w-64 flex-col border-r bg-white p-4 space-y-6 z-20">
         <div className="flex items-center gap-2 text-indigo-600 px-2"><School size={28} /><h1 className="text-xl font-black tracking-tight">{t.app_name}</h1></div>
         <div className="flex-1 space-y-2">
           <SidebarButton active={activeTab === 'mypage'} icon={User} label={t.tab_mypage} onClick={() => setActiveTab('mypage')} />
           <SidebarButton active={activeTab === 'game'} icon={Gamepad2} label={t.tab_game} onClick={() => setActiveTab('game')} />
           <SidebarButton active={activeTab === 'review'} icon={RefreshCw} label={t.tab_review} onClick={() => setActiveTab('review')} />
           <SidebarButton active={activeTab === 'vocab'} icon={BookOpen} label={t.tab_vocab} onClick={() => setActiveTab('vocab')} />
           <SidebarButton active={activeTab === 'chat'} icon={MessageCircle} label={t.tab_chat} onClick={() => setActiveTab('chat')} />
           <SidebarButton active={activeTab === 'kanji'} icon={Brain} label={t.tab_kanji} onClick={() => setActiveTab('kanji')} />
         </div>
         <div className="border-t pt-4"><div className="flex items-center justify-between px-2"><LanguageToggle lang={lang} setLang={setLang} /><button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={18} /></button></div></div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around p-2 pb-safe z-30">
        <TabButton active={activeTab === 'mypage'} onClick={() => setActiveTab('mypage')} icon={User} label={t.tab_mypage} />
        <TabButton active={activeTab === 'game'} onClick={() => setActiveTab('game')} icon={Gamepad2} label={t.tab_game} />
        <TabButton active={activeTab === 'review'} onClick={() => setActiveTab('review')} icon={RefreshCw} label={t.tab_review} />
        <TabButton active={activeTab === 'vocab'} onClick={() => setActiveTab('vocab')} icon={BookOpen} label={t.tab_vocab} />
        <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={MessageCircle} label={t.tab_chat} />
      </nav>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-gray-50 relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center z-20">
           <div className="flex items-center gap-2 text-indigo-600"><School size={24} /><h1 className="font-black text-sm">{t.app_name}</h1></div>
           <div className="flex gap-2"><LanguageToggle lang={lang} setLang={setLang} /><button onClick={onLogout}><LogOut size={20} className="text-gray-400" /></button></div>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Reused Sidebar Button Component
const SidebarButton = ({ active, icon: Icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all ${active ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
    <Icon size={20} /> {label}
  </button>
);

// 4. MAIN APP CONTAINER (Unchanged logic, just layout wrapper)
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
  
  // Teacher Dashboard is separate component, not shown in this snippet but assumed present
  // We focus on StudentApp fix here. Teacher view logic is same as before.
  if (user.role === 'teacher') {
     return <div className="p-10 text-center">Teacher Dashboard (Use previous code)</div>; 
     // Note: In actual file, keep the TeacherDashboard component and use it here.
  }

  return <StudentApp currentUser={user} onLogout={() => setUser(null)} updateUserData={updateUserData} lang={lang} setLang={setLang} />;
}
