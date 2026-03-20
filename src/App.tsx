import { useState, useEffect, useRef } from "react";

/* ─── 타이핑 효과 컴포넌트 ─── */
function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [started, text]);

  return <span>{displayed}<span className="cursor">|</span></span>;
}

/* ─── 글자 하나씩 fade 컴포넌트 ─── */
function SplitText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="split-char"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

/* ─── 스크롤 페이드 섹션 ─── */
function FadeSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-section ${className}`}>
      {children}
    </div>
  );
}

/* ─── 채팅 버블 순차 애니메이션 ─── */
const CHAT_MESSAGES = [
  { side: "client", text: "홈페이지를 만들고 싶은데 어디서부터 시작해야 할지 모르겠어요. 😥" },
  { side: "me",     text: "목적이 가장 중요합니다. 회사 소개용인지, 서비스 판매용인지에 따라 구조가 달라집니다. 사용 목적과 필요한 기능을 알려주시면 구조 설계부터 함께 도와드립니다." },
  { side: "client", text: "모바일에서도 잘 보이게 만들 수 있나요?" },
  { side: "me",     text: "네. 모든 웹사이트는 모바일과 PC에서 모두 잘 보이도록 반응형으로 제작합니다." },
  { side: "client", text: "디자인도 같이 진행 가능한가요?" },
  { side: "me",     text: "디자이너 출신이라 웹·앱 디자인과 프론트엔드 개발을 함께 진행할 수 있습니다." },
];

function AnimatedChat() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(CHAT_MESSAGES.length).fill(false));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        CHAT_MESSAGES.forEach((_, i) => {
          setTimeout(() => {
            setVisible(prev => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, i * 600);
        });
        observer.disconnect();
      },
      { threshold: 0.15 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="chat" ref={containerRef} style={{ marginTop: 48 }}>
      {CHAT_MESSAGES.map((msg, i) => (
        <div
          key={i}
          ref={el => { rowRefs.current[i] = el; }}
          className={`chat-row ${msg.side}${visible[i] ? (msg.side === "client" ? " animate-left" : " animate-right") : ""}`}
        >
          <div className="bubble">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── 마퀴 태그 ─── */
const SKILLS = ["React", "Vue.js", "Next.js", "Node.js", "Firebase", "AWS", "MySQL", "PostgreSQL", "HTML", "CSS", "JavaScript", "TypeScript", "Python", "Docker", "Figma", "Tailwind"];

/* ─── 배너 카운터 애니메이션 ─── */
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let start = 0;
        const duration = 1800;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 16);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function App() {
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --cream: #f8f7f4;
          --ink: #111111;
          --ink2: #333;
          --muted: #999;
          --border: #e8e4de;
          --accent: #c8a96e;
          --accent2: #e8d5b0;
        }

        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          transition: background .4s, backdrop-filter .4s, box-shadow .4s;
        }
        .nav.scrolled {
          background: rgba(248,247,244,0.88);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.07);
        }
        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 22px;
          letter-spacing: -0.5px;
          cursor: pointer;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-links li {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0.45;
          transition: opacity .2s;
        }
        .nav-links li:hover { opacity: 1; }
        .nav-cta {
          padding: 9px 20px;
          background: var(--ink);
          color: var(--cream);
          border: none;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: transform .2s, background .2s;
        }
        .nav-cta:hover { background: #333; transform: translateY(-1px); }

        /* ══════════════════════════════
           ── NEW HERO BANNER ──
        ══════════════════════════════ */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 1fr auto;
          position: relative;
          overflow: hidden;
          background: var(--ink);
        }

        /* 배경 노이즈 텍스처 */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(200,169,110,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 80% at 20% 80%, rgba(200,169,110,0.07) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        /* 그리드 라인 배경 */
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 0;
        }

        /* 우상단 원형 장식 */
        .hero-circle {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          border: 1px solid rgba(200,169,110,0.15);
          pointer-events: none;
          z-index: 0;
        }
        .hero-circle::after {
          content: '';
          position: absolute;
          inset: 40px;
          border-radius: 50%;
          border: 1px solid rgba(200,169,110,0.1);
        }

        /* 좌하단 사선 텍스트 */
        .hero-watermark {
          position: absolute;
          bottom: 80px;
          right: 40px;
          font-family: 'Instrument Serif', serif;
          font-size: 180px;
          font-style: italic;
          color: rgba(255,255,255,0.025);
          line-height: 1;
          pointer-events: none;
          z-index: 0;
          letter-spacing: -4px;
          user-select: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 140px 40px 0;
        }

        /* 상단 상태 배지 */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 10px;
          border: 1px solid rgba(200,169,110,0.35);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: var(--accent);
          letter-spacing: 0.06em;
          margin-bottom: 36px;
          width: fit-content;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .hero-badge.loaded { opacity: 1; transform: translateY(0); }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 3px rgba(200,169,110,0.25);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(200,169,110,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(200,169,110,0.1); }
        }

        /* 메인 타이틀 */
        .hero-eyebrow {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .7s .1s ease, transform .7s .1s ease;
        }
        .hero-eyebrow.loaded { opacity: 1; transform: translateY(0); }

        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(64px, 11vw, 128px);
          line-height: 0.92;
          letter-spacing: -3px;
          margin: 0 0 0;
          color: #fff;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .8s .2s ease, transform .8s .2s ease;
        }
        .hero-title.loaded { opacity: 1; transform: translateY(0); }

        /* 타이틀 강조 (골드 이탤릭) */
        .hero-title em {
          font-style: italic;
          color: var(--accent);
        }

        /* 구분선 + 서브카피 행 */
        .hero-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-top: 48px;
          padding-bottom: 64px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s .5s ease, transform .8s .5s ease;
        }
        .hero-row.loaded { opacity: 1; transform: translateY(0); }

        .hero-divider {
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
          flex-shrink: 0;
        }

        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.5);
          max-width: 360px;
          line-height: 1.75;
          font-weight: 300;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          flex-shrink: 0;
        }

        /* 배너 하단 스탯 바 */
        .hero-stats {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid rgba(255,255,255,0.08);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity .8s .7s ease, transform .8s .7s ease;
        }
        .hero-stats.loaded { opacity: 1; transform: translateY(0); }

        .stat-item {
          padding: 32px 40px;
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .stat-item:last-child { border-right: none; }

        .stat-number {
          font-family: 'Instrument Serif', serif;
          font-size: 40px;
          color: #fff;
          line-height: 1;
          letter-spacing: -1px;
        }
        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* 버튼 */
        .btn-primary {
          padding: 14px 28px;
          background: var(--cream);
          color: var(--ink);
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .2s, background .2s, box-shadow .2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .btn-ghost {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: color .2s;
          letter-spacing: 0.02em;
        }
        .btn-ghost:hover { color: rgba(255,255,255,0.9); }

        /* 스크롤 인디케이터 */
        .scroll-hint {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 2;
          opacity: 0;
          animation: fadeInUp 1s 1.4s forwards;
        }
        .scroll-hint span {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.25), transparent);
          animation: scrollDown 2s 1.4s infinite;
        }
        @keyframes scrollDown {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes fadeInUp {
          to { opacity: 1; }
        }

        /* ── SECTION COMMONS ── */
        section {
          padding: 120px 40px;
          max-width: 1200px;
          margin: 0 auto;
          scroll-margin-top: 72px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 0 0 20px;
        }
        section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin: 0 0 48px;
        }
        .desc {
          font-size: 16px;
          color: #555;
          line-height: 1.75;
          max-width: 540px;
          margin: 0;
        }

        /* ── SERVICES ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 2px solid var(--ink);
          margin-top: 48px;
        }
        .service-card {
          padding: 40px 32px;
          border-right: 2px solid var(--ink);
          transition: background .25s;
        }
        .service-card:last-child { border-right: none; }
        .service-card:hover { background: rgba(0,0,0,0.03); }
        .service-num {
          font-family: 'Instrument Serif', serif;
          font-size: 13px;
          color: var(--muted);
          margin: 0 0 24px;
        }
        .service-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px;
          letter-spacing: -0.3px;
        }
        .service-desc {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin: 0;
        }

        /* ── ABOUT ── */
        .about-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-visual {
          aspect-ratio: 3/4;
          background: #e8e4de;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .about-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── MARQUEE ── */
        .marquee-section {
          overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 24px 0;
          margin-top: 48px;
        }
        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          padding: 0 28px;
          white-space: nowrap;
          color: #444;
          letter-spacing: 0.02em;
        }
        .marquee-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--accent);
          margin-left: 28px;
        }

        /* ── SPLIT TEXT ── */
        .split-char {
          display: inline-block;
          animation: charIn .6s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes charIn {
          from { opacity: 0; transform: translateY(40%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
          color: var(--accent);
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* ── CHAT ── */
        .chat { display: flex; flex-direction: column; gap: 20px; }
        .chat-row { display: flex; opacity: 0; }
        .chat-row.client { justify-content: flex-start; }
        .chat-row.me { justify-content: flex-end; }

        @keyframes bubbleInLeft {
          from { opacity: 0; transform: translateX(-24px) scale(0.94); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes bubbleInRight {
          from { opacity: 0; transform: translateX(24px) scale(0.94); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        .chat-row.animate-left  { animation: bubbleInLeft  0.55s cubic-bezier(.22,1,.36,1) forwards; }
        .chat-row.animate-right { animation: bubbleInRight 0.55s cubic-bezier(.22,1,.36,1) forwards; }

        .bubble {
          max-width: 72%;
          padding: 16px 20px;
          border-radius: 20px;
          font-size: 15px;
          line-height: 1.65;
          transition: transform .2s;
        }
        .bubble:hover { transform: scale(1.01); }
        .client .bubble { background: #fff; border: 1px solid var(--border); box-shadow: 0 2px 12px rgba(0,0,0,0.05); text-align: start; }
        .me .bubble     { background: var(--ink); color: var(--cream); text-align: start; }

        /* ── CONTACT ── */
        .contact-wrap { margin-top: 48px; }
        .contact-box  { display: flex; gap: 10px; }
        input {
          flex: 1;
          padding: 13px 18px;
          border-radius: 100px;
          border: 1px solid #ddd;
          background: #fff;
          font-size: 15px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          font-family: 'DM Sans', sans-serif;
        }
        input:focus {
          border-color: var(--ink);
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
        .btn-contact {
          padding: 13px 28px;
          background: var(--ink);
          color: var(--cream);
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .btn-contact:hover { background: #333; transform: translateY(-1px); }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid var(--border);
          padding: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #aaa;
          font-size: 13px;
        }

        /* ── FADE SECTION ── */
        .fade-section {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
        }
        .fade-section.visible { opacity: 1; transform: translateY(0); }

        /* ── MOBILE NAV ── */
        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
        .hamburger span { display: block; width: 22px; height: 2px; background: var(--ink); margin: 5px 0; transition: .3s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .services-grid   { grid-template-columns: 1fr; }
          .service-card    { border-right: none; border-bottom: 2px solid var(--ink); }
          .service-card:last-child { border-bottom: none; }
          .about-layout    { grid-template-columns: 1fr; gap: 40px; }
          .about-visual    { display: none; }
          .hero-stats      { grid-template-columns: repeat(3,1fr); }
        }

        @media (max-width: 768px) {
          .nav            { padding: 16px 24px; }
          .nav-links, .nav-cta { display: none; }
          .hamburger      { display: block; }
          .hero-content   { padding: 120px 24px 0; }
          .hero-row       { flex-direction: column; align-items: flex-start; padding-bottom: 0; }
          .hero-actions   { align-items: flex-start; flex-direction: row; }
          .hero-divider   { display: none; }
          .hero-stats     { grid-template-columns: repeat(3,1fr); }
          .stat-item      { padding: 24px 20px; }
          .stat-number    { font-size: 28px; }
          section         { padding: 80px 24px; }
          .contact-box    { flex-direction: column; }
          input           { border-radius: 12px; }
          .btn-contact    { border-radius: 12px; }
          footer          { flex-direction: column; gap: 12px; text-align: center; }
          .bubble         { max-width: 85%; font-size: 14px; }
          .hero-watermark { font-size: 100px; bottom: 60px; }
          .scroll-hint    { display: none; }
        }

        @media (max-width: 480px) {
          .hero-title   { letter-spacing: -2px; }
          .hero-stats   { grid-template-columns: 1fr 1fr; }
          .stat-item:last-child { grid-column: 1/-1; border-right: none; border-top: 1px solid rgba(255,255,255,0.08); }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>YS Lab</div>
        <ul className="nav-links">
          {[["서비스", "services"], ["소개", "about"], ["기술", "skills"], ["문의", "contact"]].map(([label, id]) => (
            <li key={id} onClick={() => scrollTo(id)}>{label}</li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("contact")}>문의하기</button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* ══════════════════════
          ─── NEW HERO BANNER ───
      ══════════════════════ */}
      <div className="hero" id="hero">
        {/* 배경 장식 */}
        <div className="hero-grid" />
        <div className="hero-circle" />
        <div className="hero-watermark">YSLab</div>

        {/* 메인 컨텐츠 */}
        <div className="hero-content">
          {/* 상태 배지 */}
          <div className={`hero-badge${heroLoaded ? " loaded" : ""}`}>
            <span className="badge-dot" />
            현재 프로젝트 수락 가능
          </div>

          {/* 아이브로우 */}
          <p className={`hero-eyebrow${heroLoaded ? " loaded" : ""}`}>
            Fullstack Web Developer · Freelance
          </p>

          {/* 메인 타이틀 */}
          <h1 className={`hero-title${heroLoaded ? " loaded" : ""}`}>
            Design<br />
            meets <em>Code.</em>
          </h1>

          {/* 서브 + 액션 행 */}
          <div className={`hero-row${heroLoaded ? " loaded" : ""}`}>
            <div className="hero-divider" />
            <p className="hero-sub">
              디자이너 출신 프론트엔드 개발자.<br />
              기획 의도가 화면에 그대로 살아나는<br />
              웹·앱 서비스를 함께 만들어드립니다.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo("contact")}>
                프로젝트 문의하기 →
              </button>
              <span className="btn-ghost" onClick={() => scrollTo("services")}>
                서비스 살펴보기
              </span>
            </div>
          </div>
        </div>

        {/* 하단 스탯 바 */}
        <div className={`hero-stats${heroLoaded ? " loaded" : ""}`}>
          <div className="stat-item">
            <div className="stat-number">
              <CountUp end={4} suffix="+" />
            </div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <CountUp end={30} suffix="+" />
            </div>
            <div className="stat-label">Projects Delivered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              <CountUp end={16} />
            </div>
            <div className="stat-label">Tech Stack</div>
          </div>
        </div>

        {/* 스크롤 힌트 */}
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </div>

      {/* ─── SERVICES ─── */}
      <section id="services">
        <FadeSection>
          <p className="section-label">Services</p>
          <h2>이런 것을<br />도와드릴 수 있어요</h2>
          <div className="services-grid">
            {[
              { num: "01", title: "웹사이트 제작", desc: "기업 홈페이지, 랜딩페이지 제작. 브랜드 아이덴티티에 맞는 디자인과 개발을 함께 진행합니다." },
              { num: "02", title: "앱 UI 구현", desc: "모바일 앱 인터페이스 구현. 디자이너 출신 개발자로서 픽셀 퍼펙트한 구현을 목표합니다." },
              { num: "03", title: "프론트엔드 개발", desc: "React 기반 웹 서비스 개발. Firebase, 상태관리, API 연동까지 풀스택에 가까운 프론트 개발." },
            ].map((s) => (
              <div className="service-card" key={s.num}>
                <p className="service-num">{s.num}</p>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" style={{ background: "#fff", maxWidth: "100%", padding: "120px 0", scrollMarginTop: "72px" }}>
        <div style={{ maxWidth: 1200, margin: "auto", padding: "0 40px" }}>
          <FadeSection>
            <p className="section-label">About</p>
            <div className="about-layout">
              <div>
                <h2>디자인과 개발,<br />둘 다 합니다</h2>
                <p className="desc">
                  디자이너로 커리어를 시작해 현재 프론트엔드 개발자로 일하고 있습니다.
                  디자인과 개발을 모두 이해하는 경험을 바탕으로 UI 완성도를 높이고
                  사용자 경험을 개선하는 프론트엔드 개발을 진행하고 있습니다.
                </p>
                <p className="desc" style={{ marginTop: 20 }}>
                  디자이너와 개발자 사이의 간극을 좁히고, 기획 의도가 화면에 그대로
                  살아나는 결과물을 만드는 것을 중요하게 생각합니다.
                </p>
              </div>
              <div className="about-visual">
                <img src="/profile.jpg" alt="profile" />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section id="skills">
        <FadeSection>
          <p className="section-label">Skills</p>
          <h2>사용하는 기술들</h2>
        </FadeSection>
        <div className="marquee-section">
          <div className="marquee-track">
            {[...SKILLS, ...SKILLS].map((s, i) => (
              <div className="marquee-item" key={i}>
                {s}
                <span className="marquee-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHAT / QnA ─── */}
      <section style={{ background: "#fff", maxWidth: "100%", padding: "120px 0" }}>
        <div style={{ maxWidth: 1200, margin: "auto", padding: "0 40px" }}>
          <FadeSection>
            <p className="section-label">Q & A</p>
            <h2>자주 묻는 것들</h2>
            <AnimatedChat />
          </FadeSection>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact">
        <FadeSection>
          <p className="section-label">Contact</p>
          <h2>프로젝트 이야기를<br />시작해봐요</h2>
          <p className="desc">이메일로 편하게 연락 주세요. 24시간 내 답변드립니다.</p>
          <div className="contact-wrap">
            <div className="contact-box">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소를 입력해 주세요"
              />
              <button className="btn-contact">문의하기</button>
            </div>
          </div>
        </FadeSection>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} YS Lab. All rights reserved.</span>
        <span style={{ color: "#ccc" }}>Designed & Built by YS Lab</span>
      </footer>
    </div>
  );
}
