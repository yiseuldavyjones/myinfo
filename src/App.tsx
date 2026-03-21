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

/* ─── 프로젝트 목업 1: 쇼핑몰 ─── */
function ShopMockup() {
  return (
    <div style={{ background: "#fff", height: "100%", fontFamily: "sans-serif", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg, #FF6B9D, #FF8E53)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>✦ BLOOM SHOP</span>
        <div style={{ display: "flex", gap: 8 }}>
          {["홈", "컬렉션", "NEW"].map(t => <span key={t} style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>{t}</span>)}
        </div>
        <span style={{ color: "#fff", fontSize: 12 }}>🛍 3</span>
      </div>
      <div style={{ background: "linear-gradient(180deg, #FFF0F5 0%, #fff 100%)", padding: "16px 16px 8px" }}>
        <div style={{ background: "linear-gradient(135deg, #FF6B9D, #C850C0)", borderRadius: 12, padding: "20px 16px", color: "#fff", marginBottom: 12 }}>
          <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 4 }}>NEW ARRIVAL</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>봄 컬렉션 2025</div>
          <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 12 }}>트렌디한 스타일을 만나보세요</div>
          <div style={{ background: "#fff", color: "#FF6B9D", fontSize: 9, fontWeight: 700, padding: "5px 12px", borderRadius: 20, display: "inline-block" }}>SHOP NOW →</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[
            { name: "플로럴 원피스", price: "59,000", color: "#FFD6E7", emoji: "🌸" },
            { name: "린넨 자켓", price: "89,000", color: "#D6E8FF", emoji: "👔" },
            { name: "슬링 백", price: "45,000", color: "#D6FFE8", emoji: "👜" },
          ].map(item => (
            <div key={item.name} style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ background: item.color, height: 60, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{item.emoji}</div>
              <div style={{ padding: "6px 6px 8px" }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#333" }}>{item.name}</div>
                <div style={{ fontSize: 9, color: "#FF6B9D", fontWeight: 700 }}>₩{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 프로젝트 목업 2: SaaS 대시보드 ─── */
function DashboardMockup() {
  return (
    <div style={{ background: "#0F0F23", height: "100%", fontFamily: "sans-serif", overflow: "hidden", display: "flex" }}>
      <div style={{ width: 48, background: "#1a1a35", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, gap: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #7C3AED, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
        {["📊", "👥", "💰", "⚙️"].map((icon, i) => (
          <div key={i} style={{ fontSize: 14, opacity: i === 0 ? 1 : 0.4, cursor: "pointer" }}>{icon}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: "12px 14px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>Analytics</div>
            <div style={{ color: "#666", fontSize: 9 }}>2025년 1월 리포트</div>
          </div>
          <div style={{ background: "#7C3AED", color: "#fff", fontSize: 8, padding: "4px 10px", borderRadius: 20 }}>리포트 내보내기</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[
            { label: "총 매출", value: "₩12.4M", change: "+18%", up: true, color: "#7C3AED" },
            { label: "신규 유저", value: "2,841", change: "+32%", up: true, color: "#06B6D4" },
            { label: "전환율", value: "4.7%", change: "-0.3%", up: false, color: "#F59E0B" },
            { label: "재방문", value: "68%", change: "+5%", up: true, color: "#10B981" },
          ].map(stat => (
            <div key={stat.label} style={{ background: "#1a1a35", borderRadius: 8, padding: "8px 10px", borderLeft: `3px solid ${stat.color}` }}>
              <div style={{ color: "#666", fontSize: 8, marginBottom: 2 }}>{stat.label}</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{stat.value}</div>
              <div style={{ color: stat.up ? "#10B981" : "#EF4444", fontSize: 8 }}>{stat.change}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1a1a35", borderRadius: 8, padding: 10 }}>
          <div style={{ color: "#999", fontSize: 8, marginBottom: 8 }}>주간 매출 추이</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 50 }}>
            {[35, 55, 40, 70, 60, 85, 75].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? "linear-gradient(to top, #7C3AED, #A855F7)" : "#2a2a50", borderRadius: "3px 3px 0 0", transition: "height 0.3s" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {["월", "화", "수", "목", "금", "토", "일"].map(d => (
              <div key={d} style={{ color: "#444", fontSize: 7, textAlign: "center", flex: 1 }}>{d}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 프로젝트 목업 3: 예약 플랫폼 ─── */
function BookingMockup() {
  return (
    <div style={{ background: "#F0FFF4", height: "100%", fontFamily: "sans-serif", overflow: "hidden" }}>
      <div style={{ background: "linear-gradient(135deg, #059669, #10B981)", padding: "12px 16px" }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>🌿 GREENSTAY</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}>친환경 숙소 예약 플랫폼</div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12, boxShadow: "0 4px 20px rgba(5,150,105,0.1)", marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 8 }}>✦ 어디로 떠나세요?</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <div style={{ flex: 1, background: "#F0FFF4", borderRadius: 8, padding: "6px 8px", fontSize: 9, color: "#333", border: "1px solid #A7F3D0" }}>📍 제주도</div>
            <div style={{ flex: 1, background: "#F0FFF4", borderRadius: 8, padding: "6px 8px", fontSize: 9, color: "#333", border: "1px solid #A7F3D0" }}>📅 3월 25 - 27</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #059669, #10B981)", borderRadius: 8, padding: "7px 0", textAlign: "center", color: "#fff", fontSize: 10, fontWeight: 700 }}>숙소 검색하기 →</div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto" }}>
          {["🌊 해변", "🏔 산", "🌿 숲", "🏙 도심"].map((t, i) => (
            <div key={t} style={{ background: i === 0 ? "#059669" : "#fff", color: i === 0 ? "#fff" : "#666", fontSize: 9, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", border: "1px solid #D1FAE5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>{t}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { name: "바다뷰 펜션", loc: "제주 서귀포", price: "180,000", emoji: "🏠", color: "#ECFDF5" },
            { name: "오션 글램핑", loc: "제주 한림", price: "230,000", emoji: "⛺", color: "#ECFDF5" },
          ].map(item => (
            <div key={item.name} style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ background: item.color, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, borderBottom: "1px solid #D1FAE5" }}>{item.emoji}</div>
              <div style={{ padding: "6px 8px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#111", marginBottom: 1 }}>{item.name}</div>
                <div style={{ fontSize: 8, color: "#888", marginBottom: 3 }}>{item.loc}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#059669" }}>₩{item.price}<span style={{ fontSize: 7, fontWeight: 400, color: "#999" }}>/박</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 프로젝트 목업 4: 포트폴리오 사이트 ─── */
function PortfolioMockup() {
  return (
    <div style={{ background: "#0A0A0A", height: "100%", fontFamily: "sans-serif", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f1f1f" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 12, fontStyle: "italic" }}>Kim Studio</span>
        <div style={{ display: "flex", gap: 10 }}>
          {["Work", "About", "Contact"].map(t => <span key={t} style={{ color: "#555", fontSize: 9 }}>{t}</span>)}
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#555", fontSize: 8, letterSpacing: "0.2em", marginBottom: 4 }}>CREATIVE DIRECTOR</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: 2 }}>Turning</div>
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, background: "linear-gradient(90deg, #FF6B9D, #C850C0, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Ideas</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>Into Art.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {[
            { label: "BRANDING", color: "#FF6B9D", h: 70 },
            { label: "UI/UX", color: "#7C3AED", h: 55 },
            { label: "MOTION", color: "#06B6D4", h: 55 },
            { label: "WEB", color: "#F59E0B", h: 70 },
          ].map(item => (
            <div key={item.label} style={{ background: "#111", borderRadius: 8, height: item.h, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 8, position: "relative", overflow: "hidden", border: "1px solid #222" }}>
              <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: item.color, opacity: 0.6 }} />
              <div style={{ fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: "0.12em" }}>{item.label}</div>
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
    title: "BLOOM SHOP",
    category: "이커머스 · 쇼핑몰",
    desc: "패션 브랜드의 온라인 쇼핑몰 풀스택 구현. 상품 관리, 카트, 결제 흐름을 React + Firebase로 제작했습니다.",
    tags: ["React", "Firebase", "Styled-components"],
    accent: "#FF6B9D",
    Mockup: ShopMockup,
  },
  {
    num: "02",
    title: "ANALYTICS PRO",
    category: "SaaS · 대시보드",
    desc: "실시간 데이터 시각화 대시보드. 복잡한 차트와 KPI 패널을 직관적인 UI로 구현한 B2B 서비스입니다.",
    tags: ["Next.js", "TypeScript", "WebSocket"],
    accent: "#7C3AED",
    Mockup: DashboardMockup,
  },
  {
    num: "03",
    title: "GREENSTAY",
    category: "플랫폼 · 예약 서비스",
    desc: "친환경 숙소 예약 플랫폼. 지도 연동, 실시간 예약, 리뷰 시스템을 포함한 마켓플레이스입니다.",
    tags: ["Vue.js", "Node.js", "PostgreSQL"],
    accent: "#059669",
    Mockup: BookingMockup,
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
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          font-size: 22px;
          letter-spacing: -0.5px;
          cursor: pointer;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-links li {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          color: var(--muted);
          transition: color .2s;
        }
        .nav-links li:hover { color: var(--ink); }
        .nav-cta {
          padding: 9px 22px;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.3); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 1fr auto;
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 80% 30%, rgba(255,107,157,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 70% at 10% 80%, rgba(124,58,237,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0,212,170,0.06) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }
        .hero-blob1 {
          position: absolute;
          top: -100px; right: -60px;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,157,0.2), transparent 70%);
          pointer-events: none; z-index: 0;
          animation: floatBlob 8s ease-in-out infinite;
        }
        .hero-blob2 {
          position: absolute;
          bottom: 80px; left: -80px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
          pointer-events: none; z-index: 0;
          animation: floatBlob 10s ease-in-out infinite reverse;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-30px) scale(1.05); }
        }

        .hero-watermark {
          position: absolute;
          bottom: 60px; right: 30px;
          font-family: 'Instrument Serif', serif;
          font-size: 160px; font-style: italic;
          color: rgba(255,255,255,0.03);
          line-height: 1; pointer-events: none;
          z-index: 0; letter-spacing: -4px; user-select: none;
        }

        .hero-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 140px 48px 0;
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 7px 16px 7px 12px;
          border: 1px solid rgba(255,107,157,0.4);
          border-radius: 100px;
          font-size: 12px; font-weight: 600;
          color: var(--pink);
          letter-spacing: 0.05em;
          margin-bottom: 32px; width: fit-content;
          background: rgba(255,107,157,0.08);
          backdrop-filter: blur(10px);
          opacity: 0; transform: translateY(16px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .hero-badge.loaded { opacity: 1; transform: translateY(0); }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--pink);
          box-shadow: 0 0 0 3px rgba(255,107,157,0.25);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(255,107,157,0.25); }
          50%       { box-shadow: 0 0 0 7px rgba(255,107,157,0.1); }
        }

        .hero-eyebrow {
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 16px;
          opacity: 0; transform: translateY(20px);
          transition: opacity .7s .1s ease, transform .7s .1s ease;
        }
        .hero-eyebrow.loaded { opacity: 1; transform: translateY(0); }

        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(64px, 10vw, 120px);
          line-height: 0.92; letter-spacing: -3px;
          margin: 0; color: #fff;
          opacity: 0; transform: translateY(30px);
          transition: opacity .8s .2s ease, transform .8s .2s ease;
        }
        .hero-title.loaded { opacity: 1; transform: translateY(0); }
        .hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, var(--pink), var(--coral));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-title .em2 {
          font-style: italic;
          background: linear-gradient(135deg, #A78BFA, var(--mint));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-row {
          display: flex; align-items: flex-end;
          justify-content: space-between; gap: 40px;
          margin-top: 40px; padding-bottom: 60px;
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
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 14px; flex-shrink: 0;
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
          padding: 28px 40px;
          border-right: 1px solid rgba(255,255,255,0.06);
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
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(255,107,157,0.4);
        }
        .btn-ghost {
          font-size: 14px; color: rgba(255,255,255,0.45);
          cursor: pointer; transition: color .2s;
          letter-spacing: 0.02em;
        }
        .btn-ghost:hover { color: rgba(255,255,255,0.9); }

        .scroll-hint {
          position: absolute; bottom: 40px; left: 50%;
          transform: translateX(-50%);
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
          padding: 120px 48px;
          max-width: 1200px;
          margin: 0 auto;
          scroll-margin-top: 72px;
        }
        .section-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--pink); margin: 0 0 20px;
        }
        .section-label::before {
          content: ''; width: 20px; height: 2px;
          background: linear-gradient(90deg, var(--pink), var(--purple));
          border-radius: 2px;
        }
        section h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.05; letter-spacing: -1.5px;
          margin: 0 0 48px; color: var(--ink);
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
          background: var(--card-bg);
          border-radius: 20px;
          padding: 36px 28px;
          border: 1.5px solid var(--border);
          transition: transform .3s, box-shadow .3s, border-color .3s;
          position: relative; overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          opacity: 0; transition: opacity .3s;
        }
        .service-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(124,58,237,0.12); border-color: var(--pink); }
        .service-card:hover::before { opacity: 0.04; }
        .service-num {
          font-family: 'Instrument Serif', serif;
          font-size: 36px; font-style: italic;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin: 0 0 20px; line-height: 1;
        }
        .service-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 20px;
        }
        .service-title {
          font-size: 19px; font-weight: 700; margin: 0 0 12px;
          letter-spacing: -0.3px; color: var(--ink);
        }
        .service-desc {
          font-size: 14px; color: var(--muted); line-height: 1.75; margin: 0;
        }
        .service-tag {
          display: inline-block; margin-top: 16px;
          padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600;
          background: var(--surface); color: var(--purple);
        }

        /* ── ABOUT ── */
        .about-layout {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
        }
        .about-visual {
          aspect-ratio: 4/5; border-radius: 28px; overflow: hidden;
          position: relative;
          background: linear-gradient(160deg, #F0E6FF 0%, #FFE0F0 100%);
          display: flex; align-items: flex-end; justify-content: center;
          box-shadow: 0 24px 60px rgba(124,58,237,0.15);
        }
        .about-visual img {
          width: 100%; height: 100%; object-fit: cover; object-position: top;
          display: block;
        }
        .about-visual-tag {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 8px 20px; border-radius: 100px; display: inline-block;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(124,58,237,0.3);
          backdrop-filter: blur(10px);
        }
        .about-chips {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px;
        }
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
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-item {
          display: flex; align-items: center;
          font-size: 13px; font-weight: 600;
          padding: 0 24px; white-space: nowrap;
          color: var(--ink2); letter-spacing: 0.02em;
        }
        .marquee-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          margin-left: 24px;
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
          max-width: 68%; padding: 14px 18px;
          border-radius: 18px; font-size: 14.5px; line-height: 1.7;
          transition: transform .2s;
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
        .projects-outer {
          background: var(--ink);
          padding: 120px 0;
        }
        .projects-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
        }
        .projects-layout {
          display: grid; grid-template-columns: 1fr 1.5fr;
          gap: 60px; align-items: start; margin-top: 16px;
        }
        .project-list { display: flex; flex-direction: column; gap: 4px; }
        .project-list-item {
          padding: 20px 24px; border-radius: 14px; cursor: pointer;
          transition: background .2s, transform .2s;
          border: 1.5px solid transparent;
        }
        .project-list-item:hover { background: rgba(255,255,255,0.05); }
        .project-list-item.active {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.1);
        }
        .proj-num {
          font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
          margin-bottom: 4px;
        }
        .proj-name {
          font-size: 19px; font-weight: 700; color: #fff;
          letter-spacing: -0.3px; margin-bottom: 2px;
        }
        .proj-category { font-size: 12px; color: rgba(255,255,255,0.35); }

        .project-detail { position: sticky; top: 100px; }
        .project-mockup-wrap {
          border-radius: 20px; overflow: hidden;
          height: 360px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.4);
          margin-bottom: 28px;
          transition: box-shadow .4s;
        }
        .mockup-browser {
          width: 100%; height: 100%; display: flex; flex-direction: column;
        }
        .mockup-bar {
          padding: 10px 14px; display: flex; align-items: center; gap: 6px;
          flex-shrink: 0;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-url {
          flex: 1; background: rgba(0,0,0,0.2); border-radius: 20px;
          padding: 4px 12px; font-size: 10px; color: rgba(255,255,255,0.6);
          margin-left: 8px; display: flex; align-items: center;
        }
        .mockup-screen { flex: 1; overflow: hidden; position: relative; }

        .proj-detail-title {
          font-family: 'Instrument Serif', serif;
          font-size: 28px; color: #fff; margin: 0 0 10px; font-style: italic;
        }
        .proj-detail-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.8; margin-bottom: 16px; }
        .proj-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .proj-tag {
          padding: 5px 14px; border-radius: 100px; font-size: 11px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.6);
        }

        /* ── CONTACT ── */
        .contact-wrap { margin-top: 48px; }
        .soomgo-btn {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 18px 36px;
          background: linear-gradient(135deg, var(--pink), var(--purple));
          color: #fff; border-radius: 100px;
          font-size: 16px; font-weight: 700;
          text-decoration: none; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: transform .25s, box-shadow .25s;
          letter-spacing: -0.01em;
        }
        .soomgo-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(255,107,157,0.35);
        }
        .soomgo-arrow { font-size: 18px; transition: transform .25s; }
        .soomgo-btn:hover .soomgo-arrow { transform: translate(3px, -3px); }
        .contact-note {
          margin: 20px 0 0; font-size: 13px; color: var(--muted);
          display: flex; align-items: center; gap: 8px;
        }
        .contact-note::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--mint); display: inline-block; }

        /* ── FOOTER ── */
        footer {
          border-top: 1.5px solid var(--border);
          padding: 36px 48px;
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

        /* ══════════════════════════════
           MOBILE FIRST — 기본값이 모바일
        ══════════════════════════════ */

        /* NAV — 모바일 기본 */
        .nav            { padding: 14px 20px; }
        .nav-links, .nav-cta { display: none; }
        .hamburger      { display: flex; flex-direction: column; justify-content: center;
                          background: rgba(255,255,255,0.08); border: none; cursor: pointer;
                          padding: 8px; border-radius: 10px; gap: 4px; }
        .hamburger span { display: block; width: 20px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; }

        /* HERO — 모바일 기본 */
        .hero-content   { padding: 100px 20px 0; }
        .hero-badge     { font-size: 11px; padding: 6px 14px 6px 10px; margin-bottom: 24px; }
        .hero-eyebrow   { font-size: 11px; margin-bottom: 12px; letter-spacing: 0.15em; }
        .hero-title     { font-size: clamp(52px, 14vw, 80px); letter-spacing: -2px; line-height: 0.9; }
        .hero-row       { flex-direction: column; align-items: flex-start; gap: 20px;
                          margin-top: 24px; padding-bottom: 0; }
        .hero-divider   { display: none; }
        .hero-sub       { font-size: 14px; line-height: 1.75; max-width: 100%; }
        .hero-actions   { flex-direction: row; align-items: center; gap: 16px; flex-wrap: wrap; }
        .btn-primary    { padding: 13px 22px; font-size: 14px; white-space: nowrap; }

        /* HERO STATS — 모바일: 3칸 */
        .hero-stats     { grid-template-columns: repeat(3, 1fr); }
        .stat-item      { padding: 18px 12px; }
        .stat-number    { font-size: 26px; }
        .stat-label     { font-size: 9px; letter-spacing: 0.06em; }

        /* SECTION — 모바일 기본 */
        section         { padding: 72px 20px; }
        section h2      { font-size: clamp(30px, 8vw, 48px); margin-bottom: 28px; letter-spacing: -1px; }
        .desc           { font-size: 15px; max-width: 100%; }

        /* SERVICES — 모바일: 1칸 카드 */
        .services-grid  { grid-template-columns: 1fr; gap: 14px; margin-top: 8px; }
        .service-card   { padding: 28px 22px; border-radius: 18px; }
        .service-num    { font-size: 28px; margin-bottom: 12px; }
        .service-icon   { width: 40px; height: 40px; font-size: 20px; margin-bottom: 14px; border-radius: 10px; }
        .service-title  { font-size: 17px; margin-bottom: 8px; }
        .service-desc   { font-size: 13.5px; }

        /* ABOUT — 모바일: 이미지 상단, 텍스트 하단 */
        .about-layout   { grid-template-columns: 1fr; gap: 32px; }
        .about-visual   { display: block !important; aspect-ratio: 3/2; border-radius: 20px; }
        .about-visual img { object-position: center top; }
        .about-visual-tag { font-size: 11px; padding: 6px 14px; bottom: 14px; }
        .about-chips    { gap: 6px; margin-top: 20px; }
        .about-chip     { font-size: 11px; padding: 5px 12px; }

        /* PROJECTS — 모바일: 세로 스와이프 카드 */
        .projects-outer { padding: 72px 0; }
        .projects-inner { padding: 0 20px; }
        .projects-layout { grid-template-columns: 1fr; gap: 28px; }
        .project-detail  { position: static; }
        .project-mockup-wrap { height: 280px; border-radius: 16px; margin-bottom: 20px; }
        .proj-detail-title { font-size: 22px; }
        .proj-detail-desc { font-size: 13.5px; }

        /* 모바일 프로젝트 리스트: 가로 탭 스크롤 */
        .project-list {
          flex-direction: row; gap: 8px;
          overflow-x: auto; padding-bottom: 4px;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .project-list::-webkit-scrollbar { display: none; }
        .project-list-item {
          flex-shrink: 0; padding: 12px 18px; border-radius: 100px;
          white-space: nowrap;
        }
        .proj-num       { display: none; }
        .proj-name      { font-size: 13px; font-weight: 700; margin-bottom: 0; }
        .proj-category  { display: none; }

        /* CHAT — 모바일 */
        .bubble         { max-width: 82%; font-size: 14px; padding: 12px 16px; }
        .avatar         { width: 28px; height: 28px; font-size: 13px; }

        /* CONTACT — 모바일 */
        .contact-wrap   { margin-top: 32px; }
        .soomgo-btn     { padding: 16px 28px; font-size: 15px; width: 100%;
                          justify-content: center; border-radius: 18px; }

        /* FOOTER — 모바일 */
        footer          { flex-direction: column; gap: 10px; text-align: center;
                          padding: 28px 20px; font-size: 12px; }

        /* MARQUEE — 모바일 */
        .marquee-item   { font-size: 12px; padding: 0 18px; }
        .marquee-dot    { margin-left: 18px; }

        /* scroll-hint 모바일 숨김 */
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
              { num: "02", icon: "📱", bg: "#F0F0FF", title: "앱 UI 구현", desc: "모바일 앱 인터페이스 구현. 디자이너 출신 개발자로서 픽셀 퍼펙트한 구현을 목표합니다.", tag: "iOS · Android · React Native" },
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
