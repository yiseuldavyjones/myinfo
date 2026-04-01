import { useState, useEffect, useRef } from "react";

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
      { threshold: 0.1 }
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
  { side: "me",     text: "디자이너 출신이라 웹·앱 디자인과 프론트엔드 개발을 함께 진행할 수 있습니다. ✨" },
];

function AnimatedChat() {
  const containerRef = useRef<HTMLDivElement>(null);
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
          className={`chat-row ${msg.side}${visible[i] ? (msg.side === "client" ? " animate-left" : " animate-right") : ""}`}
        >
          {msg.side === "client" && <div className="avatar client-avatar">👤</div>}
          <div className="bubble">{msg.text}</div>
          {msg.side === "me" && <div className="avatar me-avatar">✦</div>}
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

/* ─── 프로젝트 가짜 목업 SVG 컴포넌트 ─── */
function MockupBrowser({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="mockup-browser">
      <div className="mockup-bar" style={{ background: accent }}>
        <span className="dot" style={{ background: "#ff6b6b" }} />
        <span className="dot" style={{ background: "#ffd93d" }} />
        <span className="dot" style={{ background: "#6bcb77" }} />
        <div className="mockup-url">
          <span>🔒 yslab.dev/project</span>
        </div>
      </div>
      <div className="mockup-screen">{children}</div>
    </div>
  );
}

/* ─── 이미지 목업 ─── */
function ImageMockup({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="project screenshot"
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
    />
  );
}

function PortfolioMockup() {
  return (
    <div style={{ background: "#0A0A0A", height: "100%", fontFamily: "'Plus Jakarta Sans', sans-serif", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* NAV */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid #1e1e1e" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 12, fontStyle: "italic", fontFamily: "serif" }}>Kim Studio</span>
        <div style={{ display: "flex", gap: 14 }}>
          {["Work", "About", "Contact"].map(t => (
            <span key={t} style={{ color: "#555", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em" }}>{t}</span>
          ))}
        </div>
        <div style={{ background: "#fff", color: "#000", fontSize: 8, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>Hire me</div>
      </div>

      {/* HERO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 18px 0" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ color: "#555", fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>Available for work</span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>Creative Director & Developer</div>
            <div style={{ lineHeight: 1.05, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: "serif", fontStyle: "italic", letterSpacing: -1 }}>Turning Ideas</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "serif", fontStyle: "italic", letterSpacing: -1, background: "linear-gradient(90deg,#FF6B9D,#C850C0,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.05 }}>Into Art.</div>
          </div>
          <p style={{ color: "#555", fontSize: 9, lineHeight: 1.7, maxWidth: 200, margin: "0 0 16px" }}>
            Brand identity, UI/UX design, and web development — crafted with intention and built to last.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <div style={{ background: "#fff", color: "#000", fontSize: 8, fontWeight: 700, padding: "6px 14px", borderRadius: 20 }}>View Work →</div>
            <div style={{ border: "1px solid #333", color: "#aaa", fontSize: 8, fontWeight: 600, padding: "6px 14px", borderRadius: 20 }}>Get in touch</div>
          </div>
        </div>

        {/* WORK GRID */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#555", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase" }}>Selected Work</span>
            <span style={{ color: "#555", fontSize: 8 }}>04 Projects</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            {[
              { label: "BRANDING", sub: "2024", color: "#FF6B9D", bg: "#1a0a10" },
              { label: "UI/UX",    sub: "2024", color: "#7C3AED", bg: "#100a1a" },
              { label: "MOTION",   sub: "2023", color: "#06B6D4", bg: "#0a1318" },
              { label: "WEB DEV",  sub: "2023", color: "#F59E0B", bg: "#1a1200" },
            ].map(item => (
              <div key={item.label} style={{ background: item.bg, borderRadius: 8, padding: "10px 10px 8px", border: `1px solid ${item.color}22`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: -10, width: 40, height: 40, borderRadius: "50%", background: item.color, opacity: 0.12 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${item.color}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: 1, background: item.color }} />
                  </div>
                  <span style={{ color: "#444", fontSize: 7 }}>↗</span>
                </div>
                <div style={{ fontSize: 8, fontWeight: 800, color: "#fff", letterSpacing: "0.1em" }}>{item.label}</div>
                <div style={{ fontSize: 7, color: "#444", marginTop: 1 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1a1a1a", padding: "10px 0", marginTop: 8 }}>
          {[["50+", "Projects"], ["4yr", "Experience"], ["98%", "Satisfaction"]].map(([num, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 11, fontFamily: "serif", fontStyle: "italic" }}>{num}</div>
              <div style={{ color: "#444", fontSize: 7, letterSpacing: "0.08em" }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    num: "01",
    title: "PERFUME SHOP",
    category: "이커머스 · 쇼핑몰",
    desc: "퍼퓸 브랜드의 온라인 쇼핑몰 풀스택 구현. 상품 관리, 카트, 결제 흐름을 React + Firebase로 제작했습니다.",
    tags: ["React", "Firebase", "Styled-components"],
    accent: "#FF6B9D",
    Mockup: () => <ImageMockup src="/project1.png" />,
  },
  {
    num: "02",
    title: "ANALYTICS PRO",
    category: "SaaS · 대시보드",
    desc: "실시간 데이터 시각화 대시보드. 복잡한 차트와 패널을 직관적인 UI로 구현한 B2B 서비스입니다.",
    tags: ["Next.js", "TypeScript", "WebSocket"],
    accent: "#7C3AED",
    Mockup: () => <ImageMockup src="/project2.png" />,
  },
  {
    num: "03",
    title: "GREENSTAY",
    category: "플랫폼 · 예약 서비스",
    desc: "친환경 숙소 예약 플랫폼. 지도 연동, 실시간 예약, 리뷰 시스템을 포함한 마켓플레이스입니다.",
    tags: ["Vue.js", "Node.js", "PostgreSQL"],
    accent: "#059669",
    Mockup: () => <ImageMockup src="/project3.png" />,
  },
  {
    num: "04",
    title: "KIM STUDIO",
    category: "포트폴리오 · 브랜딩",
    desc: "크리에이티브 디렉터를 위한 개인 포트폴리오 사이트. 작업물의 분위기를 살린 다크 무드 디자인입니다.",
    tags: ["React", "GSAP", "Three.js"],
    accent: "#FF6B9D",
    Mockup: PortfolioMockup,
  },
];

/* ─── 후기 ─── */
const REVIEWS = [
  {
    name: "박지수",
    role: "뷰티 브랜드 대표",
    avatar: "💄",
    rating: 5,
    text: "디자인과 개발을 한 분이 다 해주시니까 커뮤니케이션이 정말 편했어요. 제가 원하는 느낌을 말로만 해도 딱 맞게 구현해주셨고, 수정 요청도 빠르게 반영해주셨습니다. 결과물에 완전 만족해요!",
    project: "쇼핑몰 제작",
    date: "2024.11",
  },
  {
    name: "이준혁",
    role: "SaaS 스타트업 PM",
    avatar: "💻",
    rating: 5,
    text: "대시보드 UI가 복잡했는데 정말 깔끔하게 구현해주셨어요. 개발만 하시는 분들과 달리 디자인 감각이 있으셔서 기획 단계부터 좋은 의견을 많이 주셨습니다. 다음 프로젝트도 꼭 함께하고 싶어요.",
    project: "SaaS 대시보드",
    date: "2024.09",
  },
  {
    name: "최유나",
    role: "프리랜서 포토그래퍼",
    avatar: "📷",
    rating: 5,
    text: "포트폴리오 사이트를 맡겼는데 제 작업물의 분위기를 너무 잘 살려주셨어요. 모바일에서도 예쁘고 빠르게 로딩돼서 클라이언트들 반응이 정말 좋아졌습니다. 강력 추천드려요.",
    project: "포트폴리오 사이트",
    date: "2024.08",
  },
];

function ReviewSection() {
  return (
    <section id="reviews">
      <FadeSection>
        <p className="section-label">Reviews</p>
        <h2>함께한 분들의<br /><em>이야기</em></h2>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="review-top">
                <div className="review-avatar">{r.avatar}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-role">{r.role}</div>
                </div>
                <div className="review-stars">{"★".repeat(r.rating)}</div>
              </div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-meta">
                <span className="review-project">#{r.project}</span>
                <span className="review-date">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

/* ─── 프로세스 ─── */
const PROCESS_STEPS = [
  {
    num: "01",
    icon: "💬",
    title: "상담",
    duration: "1–2일",
    desc: "목적, 레퍼런스, 예산, 일정을 파악합니다. 숨고 채팅 또는 화상통화로 진행합니다.",
  },
  {
    num: "02",
    icon: "📐",
    title: "기획·설계",
    duration: "2–3일",
    desc: "페이지 구조, 기능 목록, 디자인 방향을 정리한 기획안을 공유드립니다.",
  },
  {
    num: "03",
    icon: "🎨",
    title: "디자인",
    duration: "3–5일",
    desc: "Figma로 UI 시안을 제작합니다. 피드백을 반영해 확정 후 개발로 넘어갑니다.",
  },
  {
    num: "04",
    icon: "⚡",
    title: "개발",
    duration: "5–14일",
    desc: "React 기반으로 개발합니다. 중간 공유 링크로 진행 상황을 실시간으로 확인하실 수 있습니다.",
  },
  {
    num: "05",
    icon: "✅",
    title: "납품·인수인계",
    duration: "1–2일",
    desc: "최종 검수 후 배포합니다. 소스코드, 관리 방법, 간단한 가이드를 함께 전달드립니다.",
  },
];

function ProcessSection() {
  return (
    <section id="process">
      <FadeSection>
        <p className="section-label">Process</p>
        <h2>이렇게<br /><em>진행됩니다</em></h2>
        <p className="desc">
          처음 의뢰하시는 분도 걱정 없이 진행할 수 있도록<br />
          단계마다 꼼꼼하게 소통합니다.
        </p>
        <div className="process-list">
          {PROCESS_STEPS.map((step, i) => (
            <div className="process-item" key={i}>
              <div className="process-left">
                <div className="process-icon-wrap">
                  <span className="process-icon">{step.icon}</span>
                  {i < PROCESS_STEPS.length - 1 && <div className="process-line" />}
                </div>
              </div>
              <div className="process-body">
                <div className="process-header">
                  <span className="process-num">{step.num}</span>
                  <span className="process-title">{step.title}</span>
                  <span className="process-duration">{step.duration}</span>
                </div>
                <p className="process-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeSection>
    </section>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

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

  const proj = PROJECTS[activeProject];

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --bg: #FFFBF5;
          --ink: #1A1A2E;
          --ink2: #2D2D44;
          --muted: #9090A8;
          --border: #E8E4F0;
          --pink: #FF6B9D;
          --purple: #7C3AED;
          --coral: #FF8E53;
          --mint: #00D4AA;
          --yellow: #FFD93D;
          --card-bg: #FFFFFF;
          --surface: #F8F5FF;
        }

        body {
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 40px;
          transition: background .4s, backdrop-filter .4s, box-shadow .4s;
        }
        .nav.scrolled {
          background: rgba(255,251,245,0.92);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.05);
        }
        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 22px; letter-spacing: -0.5px; cursor: pointer;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          font-weight: 700;
        }
        .nav-links {
          display: flex; gap: 32px; list-style: none; margin: 0; padding: 0;
        }
        .nav-links li {
          font-size: 13px; font-weight: 600; letter-spacing: 0.05em;
          text-transform: uppercase; cursor: pointer; color: var(--muted);
          transition: color .2s;
        }
        .nav-links li:hover { color: var(--ink); }
        .nav-cta {
          padding: 9px 22px;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; border: none; border-radius: 100px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh; display: grid; grid-template-rows: 1fr auto;
          position: relative; overflow: hidden;
          background: linear-gradient(160deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 30%, rgba(255,107,157,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 10% 80%, rgba(124,58,237,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,212,170,0.06) 0%, transparent 50%);
          pointer-events: none; z-index: 0;
        }
        .hero-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none; z-index: 0;
        }
        .hero-blob1 {
          position: absolute; top: -100px; right: -60px;
          width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,157,0.2), transparent 70%);
          pointer-events: none; z-index: 0;
          animation: floatBlob 8s ease-in-out infinite;
        }
        .hero-blob2 {
          position: absolute; bottom: 80px; left: -80px;
          width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
          pointer-events: none; z-index: 0;
          animation: floatBlob 10s ease-in-out infinite reverse;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-30px) scale(1.05); }
        }
        .hero-watermark {
          position: absolute; bottom: 60px; right: 30px;
          font-family: 'Instrument Serif', serif;
          font-size: 160px; font-style: italic;
          color: rgba(255,255,255,0.03); line-height: 1;
          pointer-events: none; z-index: 0; letter-spacing: -4px; user-select: none;
        }
        .hero-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 140px 48px 0;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 16px 7px 12px;
          border: 1px solid rgba(255,107,157,0.4); border-radius: 100px;
          font-size: 12px; font-weight: 600; color: var(--pink); letter-spacing: 0.05em;
          margin-bottom: 32px; width: fit-content;
          background: rgba(255,107,157,0.08); backdrop-filter: blur(10px);
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .hero-badge.loaded { opacity: 1; transform: translateY(0); }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%; background: var(--pink);
          box-shadow: 0 0 0 3px rgba(255,107,157,0.25);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(255,107,157,0.25); }
          50%       { box-shadow: 0 0 0 7px rgba(255,107,157,0.1); }
        }
        .hero-eyebrow {
          font-size: 12px; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 16px;
          opacity: 0; transform: translateY(20px);
          transition: opacity .7s .1s ease, transform .7s .1s ease;
        }
        .hero-eyebrow.loaded { opacity: 1; transform: translateY(0); }
        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(64px, 10vw, 120px); line-height: 0.92;
          letter-spacing: -3px; margin: 0; color: #fff;
          opacity: 0; transform: translateY(30px);
          transition: opacity .8s .2s ease, transform .8s .2s ease;
        }
        .hero-title.loaded { opacity: 1; transform: translateY(0); }
        .hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--pink), var(--coral));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-title .em2 {
          font-style: italic;
          background: linear-gradient(135deg, #A78BFA, var(--mint));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; margin-top: 40px; padding-bottom: 60px;
          opacity: 0; transform: translateY(24px);
          transition: opacity .8s .5s ease, transform .8s .5s ease;
        }
        .hero-row.loaded { opacity: 1; transform: translateY(0); }
        .hero-divider {
          width: 1px; height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
          flex-shrink: 0;
        }
        .hero-sub {
          font-size: 15px; color: rgba(255,255,255,0.5);
          max-width: 380px; line-height: 1.8; font-weight: 300;
        }
        .hero-actions {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 14px; flex-shrink: 0;
        }
        .hero-stats {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(3,1fr);
          border-top: 1px solid rgba(255,255,255,0.08);
          opacity: 0; transform: translateY(20px);
          transition: opacity .8s .7s ease, transform .8s .7s ease;
        }
        .hero-stats.loaded { opacity: 1; transform: translateY(0); }
        .stat-item {
          padding: 28px 40px; border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; gap: 5;
        }
        .stat-item:last-child { border-right: none; }
        .stat-number {
          font-family: 'Instrument Serif', serif;
          font-size: 40px; color: #fff; line-height: 1; letter-spacing: -1px;
        }
        .stat-label {
          font-size: 11px; color: rgba(255,255,255,0.3);
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .btn-primary {
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; border: none; border-radius: 100px;
          font-size: 14px; font-weight: 700; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          font-family: 'Plus Jakarta Sans', sans-serif; letter-spacing: -0.01em;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255,107,157,0.4); }
        .btn-ghost {
          font-size: 14px; color: rgba(255,255,255,0.45);
          cursor: pointer; transition: color .2s; letter-spacing: 0.02em;
        }
        .btn-ghost:hover { color: rgba(255,255,255,0.9); }
        .scroll-hint {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          z-index: 2; opacity: 0; animation: fadeInUp 1s 1.4s forwards;
        }
        .scroll-hint span {
          font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
        }
        .scroll-line {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent);
          animation: scrollDown 2s 1.4s infinite;
        }
        @keyframes scrollDown {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes fadeInUp { to { opacity: 1; } }

        /* ── SECTION COMMONS ── */
        section {
          padding: 120px 48px; max-width: 1200px;
          margin: 0 auto; scroll-margin-top: 72px;
        }
        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--pink); margin: 0 0 20px;
        }
        .section-label::before {
          content: ''; width: 20px; height: 2px;
          background: linear-gradient(90deg, var(--pink), var(--purple)); border-radius: 2px;
        }
        section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 5vw, 58px); line-height: 1.05;
          letter-spacing: -1.5px; margin: 0 0 48px; color: var(--ink);
        }
        section h2 em {
          font-style: italic;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .desc {
          font-size: 16px; color: #6B6B8A; line-height: 1.8;
          max-width: 540px; margin: 0; font-weight: 400;
        }

        /* ── SERVICES ── */
        .services-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 20px; margin-top: 16px;
        }
        .service-card {
          background: var(--card-bg); border-radius: 20px; padding: 36px 28px;
          border: 1.5px solid var(--border);
          transition: transform .3s, box-shadow .3s, border-color .3s;
          position: relative; overflow: hidden;
        }
        .service-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          opacity: 0; transition: opacity .3s;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(124,58,237,0.12); border-color: var(--pink); }
        .service-card:hover::before { opacity: 0.04; }
        .service-num {
          font-family: 'Instrument Serif', serif; font-size: 36px; font-style: italic;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin: 0 0 20px; line-height: 1;
        }
        .service-title { font-size: 19px; font-weight: 700; margin: 0 0 12px; letter-spacing: -0.3px; color: var(--ink); }
        .service-desc { font-size: 14px; color: var(--muted); line-height: 1.75; margin: 0; }
        .service-tag {
          display: inline-block; margin-top: 16px; padding: 4px 12px;
          border-radius: 100px; font-size: 11px; font-weight: 600;
          background: var(--surface); color: var(--purple);
        }

        /* ── ABOUT ── */
        .about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .about-visual {
          aspect-ratio: 4/5; border-radius: 28px; overflow: hidden; position: relative;
          background: linear-gradient(160deg, #F0E6FF 0%, #FFE0F0 100%);
          display: flex; align-items: flex-end; justify-content: center;
          box-shadow: 0 24px 60px rgba(124,58,237,0.15);
        }
        .about-visual img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
        .about-visual-tag {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 8px 20px; border-radius: 100px; display: inline-block; white-space: nowrap;
          box-shadow: 0 8px 24px rgba(124,58,237,0.3); backdrop-filter: blur(10px);
        }
        .about-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
        .about-chip {
          padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600;
          background: var(--surface); color: var(--purple);
          border: 1px solid rgba(124,58,237,0.15);
        }

        /* ── MARQUEE ── */
        .marquee-section {
          overflow: hidden;
          border-top: 1.5px solid var(--border); border-bottom: 1.5px solid var(--border);
          padding: 20px 0; margin-top: 48px;
          background: linear-gradient(90deg, rgba(255,107,157,0.02), rgba(124,58,237,0.02));
        }
        .marquee-track {
          display: flex; gap: 0;
          animation: marquee 28s linear infinite; width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-item {
          display: flex; align-items: center; font-size: 13px; font-weight: 600;
          padding: 0 24px; white-space: nowrap; color: var(--ink2); letter-spacing: 0.02em;
        }
        .marquee-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: linear-gradient(135deg, var(--pink), var(--purple)); margin-left: 24px;
        }

        /* ── CHAT ── */
        .chat { display: flex; flex-direction: column; gap: 16px; }
        .chat-row { display: flex; align-items: flex-end; gap: 10px; opacity: 0; }
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
        .chat-row.animate-left  { animation: bubbleInLeft  0.5s cubic-bezier(.22,1,.36,1) forwards; }
        .chat-row.animate-right { animation: bubbleInRight 0.5s cubic-bezier(.22,1,.36,1) forwards; }
        .avatar {
          width: 30px; height: 30px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .client-avatar { background: #f0f0f0; }
        .me-avatar {
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; font-size: 12px; font-weight: 700;
        }
        .bubble {
          max-width: 68%; padding: 14px 18px; border-radius: 18px;
          font-size: 14.5px; line-height: 1.7; transition: transform .2s;
        }
        .bubble:hover { transform: scale(1.01); }
        .client .bubble {
          background: #fff; border: 1.5px solid var(--border);
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          border-radius: 18px 18px 18px 4px; color: var(--ink);
        }
        .me .bubble {
          background: linear-gradient(135deg, #F0E6FF, #FFE0F0);
          color: var(--ink); border: 1.5px solid rgba(124,58,237,0.15);
          border-radius: 18px 18px 4px 18px;
        }

        /* ── PROJECTS ── */
        .projects-outer { background: var(--ink); padding: 120px 0; }
        .projects-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .projects-layout {
          display: grid; grid-template-columns: 1fr 1.5fr;
          gap: 60px; align-items: start; margin-top: 16px;
        }
        .project-list { display: flex; flex-direction: column; gap: 4px; }
        .project-list-item {
          padding: 20px 24px; border-radius: 14px; cursor: pointer;
          transition: background .2s, transform .2s; border: 1.5px solid transparent;
        }
        .project-list-item:hover { background: rgba(255,255,255,0.05); }
        .project-list-item.active { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.1); }
        .proj-num { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; margin-bottom: 4px; }
        .proj-name { font-size: 19px; font-weight: 700; color: #fff; letter-spacing: -0.3px; margin-bottom: 2px; }
        .proj-category { font-size: 12px; color: rgba(255,255,255,0.35); }
        .project-detail { position: sticky; top: 100px; }
        .project-mockup-wrap {
          border-radius: 20px; overflow: hidden; height: 360px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.4); margin-bottom: 28px; transition: box-shadow .4s;
        }
        .mockup-browser { width: 100%; height: 100%; display: flex; flex-direction: column; }
        .mockup-bar { padding: 10px 14px; display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-url {
          flex: 1; background: rgba(0,0,0,0.2); border-radius: 20px;
          padding: 4px 12px; font-size: 10px; color: rgba(255,255,255,0.6);
          margin-left: 8px; display: flex; align-items: center;
        }
        .mockup-screen { flex: 1; overflow: hidden; position: relative; }
        .proj-detail-title { font-family: 'Instrument Serif', serif; font-size: 28px; color: #fff; margin: 0 0 10px; font-style: italic; }
        .proj-detail-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.8; margin-bottom: 16px; }
        .proj-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .proj-tag {
          padding: 5px 14px; border-radius: 100px; font-size: 11px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6);
        }

        /* ── REVIEWS ── */
        .reviews-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 16px; }
        @media (min-width: 768px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }
        .review-card {
          background: var(--card-bg); border: 1.5px solid var(--border);
          border-radius: 20px; padding: 28px 24px;
          display: flex; flex-direction: column; gap: 16px;
          transition: transform .3s, box-shadow .3s;
        }
        .review-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(124,58,237,0.1); }
        .review-top { display: flex; align-items: center; gap: 12px; }
        .review-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--surface); display: flex; align-items: center;
          justify-content: center; font-size: 20px; flex-shrink: 0;
        }
        .review-name { font-size: 14px; font-weight: 700; color: var(--ink); }
        .review-role { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .review-stars { margin-left: auto; color: #FFD93D; font-size: 13px; letter-spacing: 1px; flex-shrink: 0; }
        .review-text { font-size: 14px; color: #5a5a7a; line-height: 1.8; margin: 0; flex: 1; }
        .review-meta {
          display: flex; justify-content: space-between; align-items: center;
          padding-top: 12px; border-top: 1px solid var(--border);
        }
        .review-project {
          font-size: 11px; font-weight: 600; color: var(--purple);
          background: var(--surface); padding: 3px 10px; border-radius: 100px;
        }
        .review-date { font-size: 11px; color: var(--muted); }

        /* ── PROCESS ── */
        .process-list { margin-top: 48px; display: flex; flex-direction: column; }
        .process-item { display: flex; gap: 20px; }
        .process-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .process-icon-wrap { display: flex; flex-direction: column; align-items: center; }
        .process-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: var(--surface); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .process-line {
          width: 2px; flex: 1; min-height: 32px;
          background: linear-gradient(to bottom, var(--border), transparent);
          margin: 6px 0;
        }
        .process-body { padding-bottom: 36px; flex: 1; }
        .process-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .process-num {
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .process-title { font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.2px; }
        .process-duration {
          margin-left: auto; font-size: 11px; font-weight: 600; color: var(--muted);
          background: var(--surface); padding: 3px 10px; border-radius: 100px;
          border: 1px solid var(--border); white-space: nowrap;
        }
        .process-desc { font-size: 14px; color: #6B6B8A; line-height: 1.8; margin: 0; max-width: 520px; }

        /* ── CONTACT ── */
        .contact-wrap { margin-top: 48px; }
        .soomgo-btn {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 18px 36px;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; border-radius: 100px; font-size: 16px; font-weight: 700;
          text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: transform .25s, box-shadow .25s; letter-spacing: -0.01em;
        }
        .soomgo-btn:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(255,107,157,0.35); }
        .soomgo-arrow { font-size: 18px; transition: transform .25s; }
        .soomgo-btn:hover .soomgo-arrow { transform: translate(3px, -3px); }
        .contact-note {
          margin: 20px 0 0; font-size: 13px; color: var(--muted);
          display: flex; align-items: center; gap: 8px;
        }
        .contact-note::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--mint); display: inline-block; }

        /* ── FOOTER ── */
        footer {
          border-top: 1.5px solid var(--border); padding: 36px 48px;
          display: flex; justify-content: space-between; align-items: center;
          color: var(--muted); font-size: 13px;
        }
        .footer-logo {
          font-family: 'Instrument Serif', serif; font-style: italic;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          font-size: 18px; font-weight: 700;
        }

        /* ── FADE SECTION ── */
        .fade-section {
          opacity: 0; transform: translateY(48px);
          transition: opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1);
        }
        .fade-section.visible { opacity: 1; transform: translateY(0); }

        /* ── ABOUT / QNA 풀폭 섹션 ── */
        .about-section-outer, .qna-section-outer {
          background: var(--surface); max-width: 100%; margin: 0;
          padding: 72px 0; scroll-margin-top: 72px;
        }
        .about-section-inner, .qna-section-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 20px;
        }
        @media (min-width: 768px) {
          .about-section-outer, .qna-section-outer { padding: 120px 0; }
          .about-section-inner, .qna-section-inner { padding: 0 48px; }
        }

        /* ── 모바일 터치 피드백 ── */
        .service-card:active { transform: scale(0.98); }
        .project-list-item:active { opacity: 0.7; }
        .btn-primary:active { transform: scale(0.96); }
        .soomgo-btn:active { transform: scale(0.97); }
        * { -webkit-tap-highlight-color: transparent; }

        /* ── CURSOR ── */
        .cursor { display: inline-block; animation: blink 1s step-end infinite; color: var(--pink); }
        @keyframes blink { 50% { opacity: 0; } }

        /* ══ MOBILE FIRST ══ */
        .nav            { padding: 14px 20px; }
        .nav-links, .nav-cta { display: none; }
        .hamburger      { display: flex; flex-direction: column; justify-content: center;
                          background: rgba(255,255,255,0.08); border: none; cursor: pointer;
                          padding: 8px; border-radius: 10px; gap: 4px; }
        .hamburger span { display: block; width: 20px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; }
        .hero-content   { padding: 100px 20px 0; }
        .hero-badge     { font-size: 11px; padding: 6px 14px 6px 10px; margin-bottom: 24px; }
        .hero-eyebrow   { font-size: 11px; margin-bottom: 12px; letter-spacing: 0.15em; }
        .hero-title     { font-size: clamp(52px, 14vw, 80px); letter-spacing: -2px; line-height: 0.9; }
        .hero-row       { flex-direction: column; align-items: flex-start; gap: 20px; margin-top: 24px; padding-bottom: 0; }
        .hero-divider   { display: none; }
        .hero-sub       { font-size: 14px; line-height: 1.75; max-width: 100%; }
        .hero-actions   { flex-direction: row; align-items: center; gap: 16px; flex-wrap: wrap; }
        .btn-primary    { padding: 13px 22px; font-size: 14px; white-space: nowrap; }
        .hero-stats     { grid-template-columns: repeat(3, 1fr); }
        .stat-item      { padding: 18px 12px; }
        .stat-number    { font-size: 26px; }
        .stat-label     { font-size: 9px; letter-spacing: 0.06em; }
        section         { padding: 72px 20px; }
        section h2      { font-size: clamp(30px, 8vw, 48px); margin-bottom: 28px; letter-spacing: -1px; }
        .desc           { font-size: 15px; max-width: 100%; }
        .services-grid  { grid-template-columns: 1fr; gap: 14px; margin-top: 8px; }
        .service-card   { padding: 28px 22px; border-radius: 18px; }
        .service-num    { font-size: 28px; margin-bottom: 12px; }
        .service-title  { font-size: 17px; margin-bottom: 8px; }
        .service-desc   { font-size: 13.5px; }
        .about-layout   { grid-template-columns: 1fr; gap: 32px; }
        .about-visual   { display: block !important; aspect-ratio: 3/2; border-radius: 20px; }
        .about-visual img { object-position: center top; }
        .about-visual-tag { font-size: 11px; padding: 6px 14px; bottom: 14px; }
        .about-chips    { gap: 6px; margin-top: 20px; }
        .about-chip     { font-size: 11px; padding: 5px 12px; }
        .projects-outer { padding: 72px 0; }
        .projects-inner { padding: 0 20px; }
        .projects-layout { grid-template-columns: 1fr; gap: 28px; }
        .project-detail  { position: static; }
        .project-mockup-wrap { height: 280px; border-radius: 16px; margin-bottom: 20px; }
        .proj-detail-title { font-size: 22px; }
        .proj-detail-desc { font-size: 13.5px; }
        .project-list   { flex-direction: row; gap: 8px; overflow-x: auto; padding-bottom: 4px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .project-list::-webkit-scrollbar { display: none; }
        .project-list-item { flex-shrink: 0; padding: 12px 18px; border-radius: 100px; white-space: nowrap; }
        .proj-num       { display: none; }
        .proj-name      { font-size: 13px; font-weight: 700; margin-bottom: 0; }
        .proj-category  { display: none; }
        .bubble         { max-width: 82%; font-size: 14px; padding: 12px 16px; }
        .avatar         { width: 28px; height: 28px; font-size: 13px; }
        .contact-wrap   { margin-top: 32px; }
        .soomgo-btn     { padding: 16px 28px; font-size: 15px; width: 100%; justify-content: center; border-radius: 18px; }
        footer          { flex-direction: column; gap: 10px; text-align: center; padding: 28px 20px; font-size: 12px; }
        .marquee-item   { font-size: 12px; padding: 0 18px; }
        .marquee-dot    { margin-left: 18px; }
        .scroll-hint    { display: none; }

        /* ── 태블릿 이상 (768px+) ── */
        @media (min-width: 768px) {
          .nav            { padding: 18px 40px; }
          .nav-links      { display: flex; }
          .nav-cta        { display: block; }
          .hamburger      { display: none; }
          .hero-content   { padding: 140px 48px 0; }
          .hero-title     { font-size: clamp(72px, 10vw, 120px); letter-spacing: -3px; }
          .hero-row       { flex-direction: row; align-items: flex-end; gap: 40px; padding-bottom: 60px; }
          .hero-divider   { display: block; }
          .hero-sub       { font-size: 15px; max-width: 380px; }
          .hero-actions   { flex-direction: column; align-items: flex-end; }
          .stat-item      { padding: 28px 40px; }
          .stat-number    { font-size: 40px; }
          .stat-label     { font-size: 11px; letter-spacing: 0.1em; }
          section         { padding: 120px 48px; }
          section h2      { font-size: clamp(36px, 5vw, 58px); margin-bottom: 48px; letter-spacing: -1.5px; }
          .desc           { font-size: 16px; max-width: 540px; }
          .services-grid  { grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .service-card   { padding: 36px 28px; }
          .service-title  { font-size: 19px; }
          .about-layout   { grid-template-columns: 1fr 1fr; gap: 80px; }
          .about-visual   { aspect-ratio: 4/5; border-radius: 28px; }
          .projects-outer { padding: 120px 0; }
          .projects-inner { padding: 0 48px; }
          .projects-layout { grid-template-columns: 1fr 1.5fr; gap: 60px; }
          .project-detail  { position: sticky; top: 100px; }
          .project-mockup-wrap { height: 360px; border-radius: 20px; }
          .proj-detail-title { font-size: 28px; }
          .project-list   { flex-direction: column; overflow-x: visible; gap: 4px; padding-bottom: 0; }
          .project-list-item { border-radius: 14px; padding: 20px 24px; }
          .proj-num       { display: block; }
          .proj-name      { font-size: 19px; margin-bottom: 2px; }
          .proj-category  { display: block; }
          .soomgo-btn     { width: auto; border-radius: 100px; padding: 18px 36px; font-size: 16px; justify-content: flex-start; }
          footer          { flex-direction: row; padding: 36px 48px; font-size: 13px; }
          .bubble         { max-width: 68%; font-size: 14.5px; padding: 14px 18px; }
          .scroll-hint    { display: flex; }
        }

        /* ── 데스크탑 (1024px+) ── */
        @media (min-width: 1024px) {
          .hero-title { font-size: clamp(90px, 10vw, 120px); }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>YS Lab</div>
        <ul className="nav-links">
          {[["서비스", "services"], ["프로젝트", "projects"], ["소개", "about"], ["문의", "contact"]].map(([label, id]) => (
            <li key={id} onClick={() => scrollTo(id)}>{label}</li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("contact")}>문의하기</button>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* ─── HERO ─── */}
      <div className="hero" id="hero">
        <div className="hero-dots" />
        <div className="hero-blob1" />
        <div className="hero-blob2" />
        <div className="hero-watermark">YSLab</div>

        <div className="hero-content">
          <div className={`hero-badge${heroLoaded ? " loaded" : ""}`}>
            <span className="badge-dot" />
            현재 프로젝트 수락 가능 ✦
          </div>
          <p className={`hero-eyebrow${heroLoaded ? " loaded" : ""}`}>
            Fullstack Web Developer · Freelance
          </p>
          <h1 className={`hero-title${heroLoaded ? " loaded" : ""}`}>
            Design<br />
            meets <em>Code.</em>
          </h1>
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

        <div className={`hero-stats${heroLoaded ? " loaded" : ""}`}>
          <div className="stat-item">
            <div className="stat-number"><CountUp end={4} suffix="+" /></div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><CountUp end={30} suffix="+" /></div>
            <div className="stat-label">Projects Delivered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number"><CountUp end={16} /></div>
            <div className="stat-label">Tech Stack</div>
          </div>
        </div>

        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </div>

      {/* ─── SERVICES ─── */}
      <section id="services">
        <FadeSection>
          <p className="section-label">Services</p>
          <h2>이런 것을<br /><em>도와드릴 수 있어요</em></h2>
          <div className="services-grid">
            {[
              { num: "01", icon: "🎨", bg: "#FFF0F5", title: "웹사이트 제작", desc: "기업 홈페이지, 랜딩페이지 제작. 브랜드 아이덴티티에 맞는 디자인과 개발을 함께 진행합니다.", tag: "Landing · Corporate" },
              { num: "02", icon: "📱", bg: "#F0F0FF", title: "앱 UI 구현",   desc: "모바일 앱 인터페이스 구현. 디자이너 출신 개발자로서 픽셀 퍼펙트한 구현을 목표합니다.", tag: "iOS · Android · React Native" },
              { num: "03", icon: "⚡", bg: "#F0FFF8", title: "프론트엔드 개발", desc: "React 기반 웹 서비스 개발. Firebase, 상태관리, API 연동까지 풀스택에 가까운 프론트 개발.", tag: "React · Next.js · Firebase" },
            ].map((s) => (
              <div className="service-card" key={s.num}>
                <p className="service-num">{s.num}</p>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <span className="service-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ─── PROJECTS ─── */}
      <div className="projects-outer" id="projects">
        <div className="projects-inner">
          <FadeSection>
            <p className="section-label" style={{ color: "var(--pink)" }}>Projects</p>
          </FadeSection>
          <FadeSection>
            <div className="projects-layout">
              <div className="project-list">
                {PROJECTS.map((p, i) => (
                  <div
                    key={p.num}
                    className={`project-list-item${activeProject === i ? " active" : ""}`}
                    onClick={() => setActiveProject(i)}
                  >
                    <div className="proj-num" style={{ color: activeProject === i ? p.accent : "rgba(255,255,255,0.2)" }}>
                      {p.num}
                    </div>
                    <div className="proj-name">{p.title}</div>
                    <div className="proj-category">{p.category}</div>
                  </div>
                ))}
              </div>
              <div className="project-detail">
                <div className="project-mockup-wrap" style={{ boxShadow: `0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)` }}>
                  <MockupBrowser accent={proj.accent}>
                    <proj.Mockup />
                  </MockupBrowser>
                </div>
                <div className="proj-detail-title">{proj.title}</div>
                <div className="proj-detail-desc">{proj.desc}</div>
                <div className="proj-tags">
                  {proj.tags.map(t => (
                    <span key={t} className="proj-tag" style={{ borderColor: `${proj.accent}30`, color: proj.accent }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" className="about-section-outer">
        <div className="about-section-inner">
          <FadeSection>
            <p className="section-label">About</p>
            <div className="about-layout">
              <div>
                <h2>디자인과 개발,<br /><em>둘 다 합니다</em></h2>
                <p className="desc">
                  디자이너로 커리어를 시작해 현재 프론트엔드 개발자로 일하고 있습니다.
                  디자인과 개발을 모두 이해하는 경험을 바탕으로 UI 완성도를 높이고
                  사용자 경험을 개선하는 프론트엔드 개발을 진행하고 있습니다.
                </p>
                <p className="desc" style={{ marginTop: 20 }}>
                  디자이너와 개발자 사이의 간극을 좁히고, 기획 의도가 화면에 그대로
                  살아나는 결과물을 만드는 것을 중요하게 생각합니다.
                </p>
                <div className="about-chips">
                  {["UI/UX 디자인", "React 개발", "Firebase", "반응형 웹", "Figma", "협업 커뮤니케이션"].map(c => (
                    <span key={c} className="about-chip">{c}</span>
                  ))}
                </div>
              </div>
              <div className="about-visual">
                <img src="/profile.jpg" alt="YS Lab 프로필" />
                <span className="about-visual-tag">Designer × Developer ✦ Yiseul Kim</span>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section id="skills">
        <FadeSection>
          <p className="section-label">Skills</p>
          <h2>사용하는 <em>기술들</em></h2>
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
      <section className="qna-section-outer">
        <div className="qna-section-inner">
          <FadeSection>
            <p className="section-label">Q & A</p>
            <h2>자주 묻는것들</h2>
            <AnimatedChat />
          </FadeSection>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <ProcessSection />

      {/* ─── REVIEWS ─── */}
      <ReviewSection />

      {/* ─── CONTACT ─── */}
      <section id="contact">
        <FadeSection>
          <p className="section-label">Contact</p>
          <h2>프로젝트 이야기를<br /><em>시작해봐요</em></h2>
          <p className="desc">
            간단한 내용만 남겨주셔도 됩니다.<br />
            숨고를 통해 빠르게 연락드릴게요.
          </p>
          <div className="contact-wrap">
            <a
              className="soomgo-btn"
              href="https://soomgo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>✦</span>
              숨고에서 문의하기
              <span className="soomgo-arrow">↗</span>
            </a>
            <p className="contact-note">평균 응답시간 · 24시간 이내</p>
          </div>
        </FadeSection>
      </section>

      <footer>
        <span className="footer-logo">YS Lab</span>
        <span>© {new Date().getFullYear()} YS Lab. All rights reserved.</span>
      </footer>
    </div>
  );
}