"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, 
  Flame, 
  Sparkles, 
  EyeOff, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX, 
  User, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Wine,
  Settings as SettingsIcon,
  Check,
  Home as HomeIcon
} from "lucide-react";
import { gameData, Card } from "./data";

// Synthesizer Manager for background music (offline-friendly, high-fidelity browser synthesizer)
class SynthManager {
  private ctx: AudioContext | null = null;
  private intervalId: any = null;
  private isPlaying = false;

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      const playChord = (freqs: number[], duration: number) => {
        if (!this.ctx || this.ctx.state === "suspended") return;
        const now = this.ctx.currentTime;
        freqs.forEach(freq => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const filter = this.ctx!.createBiquadFilter();
          
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);
          
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(320, now); // Warm, atmospheric tone
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.03 / freqs.length, now + 2.0); // Ambient backdrop volume
          gain.gain.setValueAtTime(0.03 / freqs.length, now + duration - 2.5);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx!.destination);
          
          osc.start(now);
          osc.stop(now + duration);
        });
      };

      // Emotional chord progressions: Cmaj9 -> Am9 -> Fmaj9 -> G6/9
      const chords = [
        [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9
        [110.00, 130.81, 164.81, 196.00, 246.94], // Am9
        [87.31, 130.81, 174.61, 220.00, 261.63],  // Fmaj9
        [98.00, 146.83, 196.00, 246.94, 293.66]   // G6/9
      ];
      
      let currentIdx = 0;
      const tick = () => {
        if (!this.isPlaying) return;
        playChord(chords[currentIdx], 8.5);
        currentIdx = (currentIdx + 1) % chords.length;
      };
      
      tick();
      this.intervalId = setInterval(tick, 9000);
    } catch (e) {
      console.warn("Failed to initialize background synth:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Game screens
  const [screen, setScreen] = useState<"setup" | "playing" | "settings" | "how-to-play">("setup");
  const [p1Name, setP1Name] = useState("Anh");
  const [p2Name, setP2Name] = useState("Em");
  const [turn, setTurn] = useState(true); // true = P1, false = P2
  const [mood, setMood] = useState<"cozy" | "tipsy" | "spicy">("cozy");
  
  // Points & Stats tracking
  const [heart, setHeart] = useState(0);
  const [desire, setDesire] = useState(0);
  const [drinkCount, setDrinkCount] = useState({ p1: 0, p2: 0 });

  // Custom private wishes
  const [p1Wishes, setP1Wishes] = useState<string[]>(["", "", ""]);
  const [p2Wishes, setP2Wishes] = useState<string[]>(["", "", ""]);
  const [showP1Wishes, setShowP1Wishes] = useState(false);
  const [showP2Wishes, setShowP2Wishes] = useState(false);
  
  // Active playing card state
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [usedWishes, setUsedWishes] = useState<{ p1: number[]; p2: number[] }>({ p1: [], p2: [] });

  // Custom database cards
  const [customCards, setCustomCards] = useState<Card[]>([]);
  const [newCardText, setNewCardText] = useState("");
  const [newCardCategory, setNewCardCategory] = useState<"drink_if" | "confession" | "dare" | "connection" | "intimacy" | "tease" | "passion">("connection");

  // Auxiliary overlays & audio toggle
  const [privacyActive, setPrivacyActive] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const synthRef = useRef<SynthManager | null>(null);

  // Load name values on start
  useEffect(() => {
    setMounted(true);
    synthRef.current = new SynthManager();
    
    const savedP1 = localStorage.getItem("lovegame_p1");
    const savedP2 = localStorage.getItem("lovegame_p2");
    if (savedP1) setP1Name(savedP1);
    if (savedP2) setP2Name(savedP2);

    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Soft micro-interaction auditory click feedback
  const playClickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio autoplay restrictions bypass
    }
  };

  const toggleMusic = () => {
    playClickSound();
    if (audioPlaying) {
      synthRef.current?.stop();
      setAudioPlaying(false);
    } else {
      synthRef.current?.start();
      setAudioPlaying(true);
    }
  };

  const activePlayerName = turn ? p1Name : p2Name;
  const inactivePlayerName = turn ? p2Name : p1Name;

  // Draws next card based on active parameters
  const drawCard = () => {
    playClickSound();
    setIsFlipped(false);
    
    // Check if opponent has wishes and desire >= 8 (25% chance to unlock wish)
    const opponentWishes = turn ? p2Wishes : p1Wishes;
    const opponentUsed = turn ? usedWishes.p2 : usedWishes.p1;
    const hasValidWish = opponentWishes.some(w => w.trim() !== "");
    const canDrawWish = desire >= 8 && hasValidWish;
    const shouldDrawWish = canDrawWish && Math.random() < 0.25;

    if (shouldDrawWish) {
      const availableIndices = opponentWishes
        .map((w, idx) => w.trim() !== "" && !opponentUsed.includes(idx) ? idx : -1)
        .filter(idx => idx !== -1);

      if (availableIndices.length > 0) {
        const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        
        // Track wish as used
        if (turn) {
          setUsedWishes(prev => ({ ...prev, p2: [...prev.p2, randomIdx] }));
        } else {
          setUsedWishes(prev => ({ ...prev, p1: [...prev.p1, randomIdx] }));
        }

        setCurrentCard({
          id: `WISH_${turn ? "P2" : "P1"}_${randomIdx}`,
          text: `Ước nguyện thầm kín của ${inactivePlayerName}:\n\n"${opponentWishes[randomIdx]}"\n\n👉 ${activePlayerName} hãy thực hiện điều này ngay để mang lại niềm vui cho cả hai!`,
          level: "passion",
          desire_reward: 4,
          heart_reward: 2
        });
        return;
      }
    }

    let availableCards: Card[] = [];
    const drinkDeck = gameData.decks.drink;
    const loveDeck = gameData.decks.love;

    if (mood === "cozy") {
      if (heart < 10) {
        availableCards = [...loveDeck.connection, ...loveDeck.intimacy.slice(0, 2)];
      } else if (heart < 20) {
        availableCards = [...loveDeck.intimacy, ...loveDeck.tease];
      } else {
        availableCards = [...loveDeck.tease, ...loveDeck.passion];
      }
    } else if (mood === "tipsy") {
      availableCards = [
        ...drinkDeck.drink_if,
        ...drinkDeck.most_likely,
        ...drinkDeck.confession,
        ...drinkDeck.dare,
        ...loveDeck.connection
      ];
    } else {
      // Spicy & Passionate
      if (heart < 10) {
        availableCards = [
          ...drinkDeck.dare,
          ...drinkDeck.confession,
          ...loveDeck.intimacy,
          ...loveDeck.tease
        ];
      } else {
        availableCards = [
          ...loveDeck.tease,
          ...loveDeck.passion,
          ...drinkDeck.confession,
          ...drinkDeck.dare
        ];
      }
    }

    // Include custom user-defined cards
    if (customCards.length > 0) {
      availableCards = [...availableCards, ...customCards];
    }

    // Avoid duplicate cards
    let filtered = availableCards.filter(c => !history.includes(c.id));
    if (filtered.length === 0) {
      setHistory([]);
      filtered = availableCards;
    }

    if (filtered.length > 0) {
      const drawn = filtered[Math.floor(Math.random() * filtered.length)];
      setHistory(prev => [...prev, drawn.id]);
      setCurrentCard(drawn);
    } else {
      setCurrentCard({
        id: "FALLBACK",
        text: "Nhìn sâu vào mắt nhau trong 30 giây rồi cùng nhấp 1 ngụm rượu ấm áp!",
        level: "intimacy",
        heart_reward: 1
      });
    }
  };

  const handleAction = (type: "complete" | "drink") => {
    playClickSound();
    if (!currentCard) return;

    if (type === "complete") {
      // Award Heart Level
      if (currentCard.heart_reward) {
        setHeart(prev => Math.min(prev + currentCard.heart_reward!, 30));
      } else if (currentCard.level) {
        const rewards: Record<string, number> = { connection: 2, intimacy: 3, tease: 1, passion: 2 };
        setHeart(prev => Math.min(prev + (rewards[currentCard.level!] || 1), 30));
      }
      
      // Award Desire Level
      if (currentCard.desire_reward) {
        setDesire(prev => Math.min(prev + currentCard.desire_reward!, 20));
      } else if (currentCard.level === "tease" || currentCard.level === "passion" || currentCard.type === "dare") {
        setDesire(prev => Math.min(prev + 2, 20));
      }
    } else {
      // Action is "drink"
      if (turn) {
        setDrinkCount(prev => ({ ...prev, p1: prev.p1 + 1 }));
      } else {
        setDrinkCount(prev => ({ ...prev, p2: prev.p2 + 1 }));
      }
    }

    // Swap active turn
    setTurn(!turn);
    setCurrentCard(null);
    setIsFlipped(false);
  };

  const handleStartGame = () => {
    playClickSound();
    const name1 = p1Name.trim() || "Anh";
    const name2 = p2Name.trim() || "Em";
    setP1Name(name1);
    setP2Name(name2);
    localStorage.setItem("lovegame_p1", name1);
    localStorage.setItem("lovegame_p2", name2);

    setScreen("playing");
  };

  const addCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (!newCardText.trim()) return;

    const newCard: Card = {
      id: `CUSTOM_${Date.now()}`,
      text: newCardText.trim(),
      level: ["connection", "intimacy", "tease", "passion"].includes(newCardCategory) 
        ? (newCardCategory as any) 
        : undefined,
      type: ["drink_if", "most_likely", "confession", "dare"].includes(newCardCategory)
        ? (newCardCategory as any)
        : undefined,
      heart_reward: 2,
      desire_reward: 2
    };

    setCustomCards(prev => [...prev, newCard]);
    setNewCardText("");
  };

  const deleteCustomCard = (id: string) => {
    playClickSound();
    setCustomCards(prev => prev.filter(c => c.id !== id));
  };

  const getCardCategoryName = (card: Card) => {
    if (card.id.startsWith("WISH")) return "🔥 ƯỚC NGUYỆN THẦM KÍN";
    if (card.type) {
      const types: Record<string, string> = {
        drink_if: "🍷 UỐNG NẾU BẠN...",
        most_likely: "👥 AI CÓ KHẢ NĂNG CAO",
        confession: "💬 THÚ LỘ HOẶC UỐNG",
        dare: "🃏 THỬ THÁCH HOẶC UỐNG"
      };
      return types[card.type] || "🍷 BỘ BÀI UỐNG";
    }
    if (card.level) {
      const levels: Record<string, string> = {
        connection: "🌸 KẾT NỐI TÂM HỒN",
        intimacy: "💖 THÂN MẬT THỂ XÁC",
        tease: "⚡ KHƠI GỢI & TRÊU GHẸO",
        passion: "🔥 NÓNG BỎNG & HÒA QUYỆN"
      };
      return levels[card.level] || "❤️ BỘ BÀI TÌNH YÊU";
    }
    return "🃏 THẺ BÀI";
  };

  const getCardGlowColor = (card: Card) => {
    if (card.id.startsWith("WISH")) return "var(--accent-gold)";
    if (card.type) return "var(--accent-gold)";
    if (card.level === "tease" || card.level === "passion") return "var(--accent-pink)";
    return "rgba(255, 255, 255, 0.4)";
  };

  if (!mounted) return null;

  return (
    <div className="app-container">
      
      {/* Glow backgrounds */}
      <div className="bg-glow-pink" />
      <div className="bg-glow-gold" />

      {/* HEADER SECTION */}
      <header className="app-header">
        <div className="header-logo">
          <Heart className="turn-dot pink" style={{ width: "16px", height: "16px" }} />
          <span className="header-logo-text">LOVE & DRINK</span>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => { playClickSound(); setScreen(screen === "how-to-play" ? "setup" : "how-to-play"); }} 
            className="icon-btn"
            aria-label="Cách chơi"
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>?</span>
          </button>
          <button 
            onClick={toggleMusic} 
            className="icon-btn"
            aria-label="Bật/Tắt nhạc nền"
          >
            {audioPlaying ? <Volume2 size={16} className="score-value gold" /> : <VolumeX size={16} style={{ opacity: 0.5 }} />}
          </button>
          {screen === "playing" && (
            <>
              <button 
                onClick={() => { playClickSound(); setScreen("setup"); }} 
                className="icon-btn"
                aria-label="Về màn hình chính"
              >
                <HomeIcon size={16} />
              </button>
              <button 
                onClick={() => { playClickSound(); setScreen("settings"); }} 
                className="icon-btn"
                aria-label="Cài đặt"
              >
                <SettingsIcon size={16} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* MAIN VIEW ELEMENT */}
      <main className="app-main">
        
        {/* SETUP PANEL SCREEN */}
        {screen === "setup" && (
          <div className="glass-panel setup-panel">
            <div className="setup-header-text">
              <h1 className="setup-title">Đêm Hẹn Hò Của Chúng Ta</h1>
              <p className="setup-subtitle">Dành riêng cho hai người kết nối và khơi gợi xúc cảm</p>
            </div>

            {/* Input fields */}
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">
                  <User size={12} className="score-value pink" /> Tên Của Bạn
                </label>
                <input 
                  type="text" 
                  value={p1Name} 
                  onChange={(e) => setP1Name(e.target.value)} 
                  placeholder="Anh" 
                  className="input-field"
                />
              </div>
              <div className="input-group">
                <label className="input-label">
                  <User size={12} className="score-value gold" /> Tên Người Yêu
                </label>
                <input 
                  type="text" 
                  value={p2Name} 
                  onChange={(e) => setP2Name(e.target.value)} 
                  placeholder="Em" 
                  className="input-field"
                />
              </div>
            </div>

            {/* Bầu không khí (Mood selection) */}
            <div className="mood-section">
              <label className="input-label">Chọn bầu không khí tối nay</label>
              <div className="mood-grid">
                <button 
                  onClick={() => { playClickSound(); setMood("cozy"); }} 
                  className={`mood-btn ${mood === "cozy" ? "active-cozy" : ""}`}
                >
                  <Sparkles size={16} />
                  <span className="mood-btn-label">Chữa lành</span>
                </button>
                <button 
                  onClick={() => { playClickSound(); setMood("tipsy"); }} 
                  className={`mood-btn ${mood === "tipsy" ? "active-tipsy" : ""}`}
                >
                  <Wine size={16} />
                  <span className="mood-btn-label">Tipsy nhậu</span>
                </button>
                <button 
                  onClick={() => { playClickSound(); setMood("spicy"); }} 
                  className={`mood-btn ${mood === "spicy" ? "active-spicy" : ""}`}
                >
                  <Flame size={16} />
                  <span className="mood-btn-label">Nóng bỏng</span>
                </button>
              </div>
            </div>

            {/* Secret Wishlists Accordions */}
            <div className="wish-accordion-list">
              
              <div className="accordion">
                <button 
                  onClick={() => { playClickSound(); setShowP1Wishes(!showP1Wishes); }} 
                  className="accordion-header"
                >
                  <span>🔒 Ước nguyện thầm kín của {p1Name}</span>
                  <ChevronRight size={14} style={{ transform: showP1Wishes ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {showP1Wishes && (
                  <div className="accordion-content">
                    <p className="accordion-desc">
                      * Nhập 3 ước nguyện/khao khát của bạn. Trò chơi sẽ che chúng lại và chỉ mở khóa ngẫu nhiên khi nhiệt độ cuộc chơi tăng cao.
                    </p>
                    {p1Wishes.map((w, idx) => (
                      <input 
                        key={idx}
                        type="password"
                        value={w}
                        onChange={(e) => {
                          const updated = [...p1Wishes];
                          updated[idx] = e.target.value;
                          setP1Wishes(updated);
                        }}
                        placeholder={`Điều nguyện ước ${idx + 1}`}
                        className="input-field"
                        style={{ padding: "8px 12px", fontSize: "12px" }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="accordion">
                <button 
                  onClick={() => { playClickSound(); setShowP2Wishes(!showP2Wishes); }} 
                  className="accordion-header"
                >
                  <span>🔒 Ước nguyện thầm kín của {p2Name}</span>
                  <ChevronRight size={14} style={{ transform: showP2Wishes ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {showP2Wishes && (
                  <div className="accordion-content">
                    <p className="accordion-desc">
                      * Nhập 3 ước nguyện/khao khát của bạn. Trò chơi sẽ che chúng lại và chỉ mở khóa ngẫu nhiên khi nhiệt độ cuộc chơi tăng cao.
                    </p>
                    {p2Wishes.map((w, idx) => (
                      <input 
                        key={idx}
                        type="password"
                        value={w}
                        onChange={(e) => {
                          const updated = [...p2Wishes];
                          updated[idx] = e.target.value;
                          setP2Wishes(updated);
                        }}
                        placeholder={`Điều nguyện ước ${idx + 1}`}
                        className="input-field"
                        style={{ padding: "8px 12px", fontSize: "12px" }}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>

            <button onClick={handleStartGame} className="btn-core primary" style={{ marginTop: "8px" }}>
              {history.length > 0 ? "Tiếp Tục Cuộc Chơi" : "Bắt Đầu Cuộc Chơi"} <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ACTIVE GAME INTERFACE */}
        {screen === "playing" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* SCORE TRACKERS */}
            <div className="score-row">
              {/* Heart progress bar */}
              <div className="score-card glass-card">
                <div className="score-header">
                  <span className="score-label">
                    <Heart size={12} className="score-value pink" style={{ fill: "var(--accent-pink)" }} />
                    CẢM XÚC
                  </span>
                  <span className="score-value pink">{heart}/30</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar pink" style={{ width: `${(heart / 30) * 100}%` }} />
                </div>
                {heart >= 20 && <span className="unlocked-label score-value pink">Passion Mở!</span>}
              </div>

              {/* Desire progress bar */}
              <div className="score-card glass-card">
                <div className="score-header">
                  <span className="score-label">
                    <Flame size={12} className="score-value gold" style={{ fill: "var(--accent-gold)" }} />
                    NHIỆT ĐỘ
                  </span>
                  <span className="score-value gold">{desire}/20</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar gold" style={{ width: `${(desire / 20) * 100}%` }} />
                </div>
                {desire >= 8 && <span className="unlocked-label score-value gold">Ước Nguyện Mở!</span>}
              </div>
            </div>

            {/* DRINK SIPS TOTAL */}
            <div className="drink-counter-bar">
              <span>Đã uống: <strong>{p1Name}</strong> {drinkCount.p1} ngụm</span>
              <span>•</span>
              <span><strong>{p2Name}</strong> {drinkCount.p2} ngụm</span>
            </div>

            {/* PLAYER TURN ANNOUNCEMENT */}
            <div className="turn-indicator">
              <span className="turn-subtitle">LƯỢT CỦA</span>
              <h2 className="turn-name">
                <span className={`turn-dot ${turn ? "pink" : "gold"}`} />
                {activePlayerName}
              </h2>
            </div>

            {/* 3D PLAYING CARD STACK */}
            {currentCard ? (
              <div className="card-slot">
                <div className="card-container">
                  <div 
                    onClick={() => { playClickSound(); setIsFlipped(!isFlipped); }} 
                    className={`card-inner ${isFlipped ? "flipped" : ""}`}
                  >
                    
                    {/* Front Face (Hidden content) */}
                    <div className="card-face card-front" style={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.45)" }}>
                      <div 
                        className="absolute"
                        style={{
                          width: "180px",
                          height: "180px",
                          borderRadius: "50%",
                          filter: "blur(45px)",
                          opacity: 0.2,
                          backgroundColor: getCardGlowColor(currentCard),
                          pointerEvents: "none"
                        }}
                      />
                      <span className="turn-subtitle" style={{ marginBottom: "16px" }}>
                        {getCardCategoryName(currentCard)}
                      </span>
                      
                      <div className="card-front-icon-container">
                        {currentCard.id.startsWith("WISH") ? (
                          <Flame size={28} className="score-value gold" style={{ fill: "var(--accent-gold)" }} />
                        ) : currentCard.type ? (
                          <Wine size={28} className="score-value gold" />
                        ) : (
                          <Heart size={28} className="score-value pink" style={{ fill: "var(--accent-pink)" }} />
                        )}
                      </div>
                      
                      <span className="card-front-hint-badge">Lật để xem thử thách</span>
                    </div>

                    {/* Back Face (Action description) */}
                    <div 
                      className="card-face card-back" 
                      onClick={(e) => e.stopPropagation()} // Prevent accidental re-flips
                    >
                      <div className="card-back-header">
                        <span className={`card-category-text ${currentCard.type || currentCard.id.startsWith("WISH") ? "gold" : ""}`}>
                          {getCardCategoryName(currentCard)}
                        </span>
                        <button onClick={() => { playClickSound(); setIsFlipped(false); }} className="card-btn-revert">
                          Che đi
                        </button>
                      </div>

                      <p className="card-body-text">
                        {currentCard.text
                          .replace(/\{player\}/g, activePlayerName)
                          .replace(/\{partner\}/g, inactivePlayerName)}
                      </p>

                      <div className="card-rewards-badge">
                        {currentCard.heart_reward ? <span>❤️ +{currentCard.heart_reward} Cảm xúc</span> : null}
                        {currentCard.desire_reward ? <span>🔥 +{currentCard.desire_reward} Nhiệt độ</span> : null}
                      </div>

                      {/* Complete controls */}
                      <div className="card-actions-row">
                        {currentCard.type ? (
                          <>
                            <button 
                              onClick={() => handleAction("drink")} 
                              className="btn-core secondary"
                              style={{ flex: 1 }}
                            >
                              <Wine size={14} /> Uống Rượu
                            </button>
                            <button 
                              onClick={() => handleAction("complete")} 
                              className="btn-core primary"
                              style={{ flex: 1 }}
                            >
                              <Check size={14} /> Đã Làm
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleAction("complete")} 
                            className="btn-core primary"
                          >
                            <Check size={14} /> Đã Thực Hiện
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* Drawn CTA trigger */
              <div className="draw-zone">
                <button onClick={drawCard} className="draw-btn-circle">
                  <div className="draw-btn-icon-container">
                    <Heart size={24} style={{ fill: "rgba(255, 77, 109, 0.4)" }} />
                  </div>
                  <div>
                    <span className="draw-btn-text-main">RÚT THẺ BÀI</span>
                    <span className="draw-btn-text-sub">Lượt rút của {activePlayerName}</span>
                  </div>
                </button>
              </div>
            )}

          </div>
        )}

        {/* SETTINGS POPUP MODAL */}
        {screen === "settings" && (
          <div className="glass-panel settings-panel">
            
            <div className="settings-header">
              <h2 className="settings-title">
                <SettingsIcon size={18} className="score-value gold" /> Tùy Chỉnh Game
              </h2>
              <button onClick={() => { playClickSound(); setScreen("playing"); }} className="settings-close-btn">
                Quay lại
              </button>
            </div>

            {/* Names configuration */}
            <div className="mood-section">
              <span className="settings-section-title">Thay đổi tên hai người</span>
              <div className="input-row">
                <input 
                  type="text" 
                  value={p1Name} 
                  onChange={(e) => setP1Name(e.target.value)}
                  className="input-field"
                  style={{ padding: "8px 12px", fontSize: "12px" }}
                />
                <input 
                  type="text" 
                  value={p2Name} 
                  onChange={(e) => setP2Name(e.target.value)}
                  className="input-field"
                  style={{ padding: "8px 12px", fontSize: "12px" }}
                />
              </div>
            </div>

            {/* Custom card builder */}
            <form onSubmit={addCustomCard} className="custom-card-form">
              <span className="settings-section-title">Thêm Thẻ Bài Riêng Tư</span>
              <textarea 
                value={newCardText}
                onChange={(e) => setNewCardText(e.target.value)}
                placeholder="Ví dụ: Kể lại kỉ niệm ngày đầu tiên nắm tay nhau tại quán cà phê cũ..."
                className="custom-textarea"
              />
              <div className="custom-form-controls">
                <select 
                  value={newCardCategory} 
                  onChange={(e: any) => setNewCardCategory(e.target.value)}
                  className="custom-select"
                >
                  <option value="drink_if">Uống Nếu Bạn (Drink If)</option>
                  <option value="confession">Thú lộ (Confession)</option>
                  <option value="dare">Thử thách (Dare)</option>
                  <option value="connection">Kết nối (Connection)</option>
                  <option value="intimacy">Thân mật (Intimacy)</option>
                  <option value="tease">Khơi gợi (Tease)</option>
                  <option value="passion">Nóng bỏng (Passion)</option>
                </select>
                <button type="submit" className="btn-core primary" style={{ padding: "8px 16px" }}>
                  <Plus size={16} /> Thêm
                </button>
              </div>
            </form>

            {/* List custom cards */}
            <div className="custom-cards-list" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {customCards.map(c => (
                <div key={c.id} className="glass-card" style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, paddingRight: "12px" }}>
                    <span style={{ fontSize: "10px", color: "var(--accent-gold)", display: "block", marginBottom: "4px" }}>
                      {getCardCategoryName(c)}
                    </span>
                    <p style={{ fontSize: "12px", margin: 0, opacity: 0.9 }}>{c.text}</p>
                  </div>
                  <button onClick={() => deleteCustomCard(c.id)} className="icon-btn" style={{ color: "var(--accent-pink)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* SYSTEM RESET */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px", marginTop: "4px" }}>
              <button 
                type="button"
                onClick={() => {
                  playClickSound();
                  if (confirm("Hai bạn thực sự muốn đặt lại trò chơi và bắt đầu lại?")) {
                    setHeart(0);
                    setDesire(0);
                    setDrinkCount({ p1: 0, p2: 0 });
                    setHistory([]);
                    setUsedWishes({ p1: [], p2: [] });
                    setCurrentCard(null);
                    setScreen("setup");
                  }
                }}
                className="reset-btn"
              >
                <RotateCcw size={14} /> Đặt Lại Trò Chơi
              </button>
            </div>

          </div>
        )}

        {/* HOW TO PLAY MODAL */}
        {screen === "how-to-play" && (
          <div className="glass-panel settings-panel">
            <div className="settings-header">
              <h2 className="settings-title">
                <Sparkles size={18} className="score-value pink" /> Cách Chơi Game
              </h2>
              <button onClick={() => { playClickSound(); setScreen(heart > 0 ? "playing" : "setup"); }} className="settings-close-btn">
                Đóng
              </button>
            </div>
            <div style={{ padding: "10px 0", fontSize: "14px", lineHeight: "1.6", color: "rgba(255,255,255,0.9)" }}>
              <p style={{ marginBottom: "12px" }}><strong>Chào mừng hai bạn đến với thế giới của riêng mình!</strong></p>
              
              <h3 style={{ fontSize: "14px", color: "var(--accent-gold)", marginTop: "16px", marginBottom: "8px" }}>1. Chuẩn Bị</h3>
              <p style={{ marginBottom: "12px" }}>Nhập tên hai bạn, chọn không khí buổi tối (Chữa lành, Nhậu nhẹt, hoặc Nóng bỏng) và mỗi người bí mật nhập 3 <strong>Ước Nguyện Thầm Kín</strong> vào Hộp Ước Nguyện.</p>

              <h3 style={{ fontSize: "14px", color: "var(--accent-gold)", marginTop: "16px", marginBottom: "8px" }}>2. Vòng Lặp Trò Chơi (Core Loop)</h3>
              <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
                <li>Hai bạn luân phiên rút bài. Lượt của ai thì người đó sẽ đọc to thẻ bài lên.</li>
                <li>Hệ thống tự động thay tên của bạn và người ấy vào câu hỏi để thêm phần nhập vai.</li>
                <li>Nếu hoàn thành thử thách/câu hỏi, chọn <strong>Đã Làm</strong> để ghi điểm.</li>
                <li>Nếu không muốn làm/trả lời, chọn <strong>Uống Rượu</strong> và tự phạt mình nhé!</li>
              </ul>

              <h3 style={{ fontSize: "14px", color: "var(--accent-gold)", marginTop: "16px", marginBottom: "8px" }}>3. Phần Thưởng Cảm Xúc & Nhiệt Độ</h3>
              <p style={{ marginBottom: "8px" }}>Càng chia sẻ thật lòng và chạm vào nhau, điểm số càng tăng:</p>
              <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
                <li>❤️ <strong>Cảm Xúc (Heart):</strong> Tăng qua các câu hỏi Kết nối. Khi đầy, sẽ mở khóa các thẻ bài Nóng bỏng (Passion).</li>
                <li>🔥 <strong>Nhiệt Độ (Desire):</strong> Tăng qua các đụng chạm thể xác. Khi đạt mức cao, hệ thống có tỷ lệ kích hoạt ngẫu nhiên 1 trong những Ước Nguyện Thầm Kín mà đối phương đã nhập!</li>
              </ul>
              
              <p style={{ fontStyle: "italic", textAlign: "center", marginTop: "24px", color: "var(--accent-pink)" }}>
                "Hãy thư giãn, thành thật và tận hưởng đêm nay nhé!"
              </p>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER ACTIONS */}
      <footer className="app-footer">
        
        {/* Blurs display */}
        <button 
          onClick={() => { playClickSound(); setPrivacyActive(true); }}
          className="footer-btn"
          disabled={screen === "setup"}
        >
          <Lock size={14} /> Che màn hình
        </button>

        {/* Wishlist status indicator */}
        <button 
          onClick={() => { 
            playClickSound(); 
            if (screen !== "setup") {
              alert(
                `Ước nguyện thầm kín:\n\n- Ước nguyện của ${p1Name}: Còn lại ${3 - usedWishes.p1.length}/3 điều ẩn giấu.\n- Ước nguyện của ${p2Name}: Còn lại ${3 - usedWishes.p2.length}/3 điều ẩn giấu.\n\n* Điều ước sẽ tự động mở khóa ngẫu nhiên khi Desire (Nhiệt độ) >= 8.`
              );
            } else {
              alert("Bạn hãy khởi đầu game trước khi kiểm tra hộp ước nguyện!");
            }
          }}
          className="footer-btn"
        >
          <Flame size={14} className="score-value gold" /> Hộp ước nguyện
        </button>

      </footer>

      {/* PRIVACY OVERLAY IN BED */}
      {privacyActive && (
        <div 
          onClick={() => { playClickSound(); setPrivacyActive(false); }}
          className="privacy-overlay"
        >
          <div className="privacy-modal-box">
            <div className="privacy-icon-container">
              <EyeOff size={24} />
            </div>
            <h3 className="privacy-title">Màn hình đang che</h3>
            <p className="privacy-desc">
              Nhấn vào bất cứ đâu để mở khóa khi điện thoại đã nằm an toàn trong tay bạn.
            </p>
            <div className="privacy-unlock-hint">
              <Unlock size={12} /> Mở khóa an toàn
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
