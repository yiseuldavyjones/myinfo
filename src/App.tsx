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
    // 컨테이너가 뷰포트에 들어오면 버블들을 순차 표시
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

export default function App() {
  const [email, setEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
          background: #f8f7f4;
          color: #111;
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
          background: rgba(248,247,244,0.85);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
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
          opacity: 0.5;
          transition: opacity .2s;
        }
        .nav-links li:hover { opacity: 1; }
        .nav-cta {
          padding: 9px 20px;
          background: #111;
          color: #f8f7f4;
          border: none;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: transform .2s, background .2s;
        }
        .nav-cta:hover { background: #333; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 40px 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 24px;
        }
        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: 1;
          letter-spacing: -2px;
          margin: 0 0 24px;
          overflow: hidden;
        }
        .hero-sub {
          font-size: 16px;
          color: #555;
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 40px;
          text-align:start;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .btn-primary {
          padding: 14px 32px;
          background: #111;
          color: #f8f7f4;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
        .btn-ghost {
          font-size: 14px;
          color: #555;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: color .2s;
        }
        .btn-ghost:hover { color: #111; }

        /* hero deco */
        .hero-deco {
          position: absolute;
          top: 120px; right: 40px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%, rgba(99,102,241,0.18), rgba(56,189,248,0.12), transparent 70%);
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }
        .hero-line {
          position: absolute;
          top: 0; right: 200px;
          width: 1px; height: 60%;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.08), transparent);
        }

        /* ── SPLIT TEXT ── */
        .split-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(30px);
          animation: charIn .6s forwards;
        }
        @keyframes charIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .cursor {
          animation: blink 1s infinite;
          color: #6366f1;
          font-weight: 300;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* ── MARQUEE ── */
        .marquee-section {
          border-top: 1px solid #e8e4de;
          border-bottom: 1px solid #e8e4de;
          padding: 18px 0;
          overflow: hidden;
          background: #fff;
          border-radius:100px;
        }
        .marquee-track {
          display: flex;
          gap: 0;
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 28px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          color: #555;
        }
        .marquee-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #bbb;
          flex-shrink: 0;
        }

        /* ── SECTIONS ── */
        section {
          max-width: 1100px;
          margin: auto;
          padding: 120px 40px;
          scroll-margin-top: 72px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e0ddd8;
        }
        h2 {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(32px, 5vw, 52px);
          letter-spacing: -1px;
          margin: 0 0 24px;
          line-height: 1.1;
          color: #0a0a0a;
        }
        .desc {
          color: #555;
          text-align:start;
          line-height: 1.8;
          font-size: 16px;
          max-width: 560px;
        }

        /* ── SERVICES ── */
        @keyframes cardGradient {
          0%   { background: linear-gradient(135deg, #e8e4f8, #d4eeff, #f0e4f8); }
          33%  { background: linear-gradient(135deg, #d4eeff, #f0e4f8, #e8e4f8); }
          66%  { background: linear-gradient(135deg, #f0e4f8, #e8e4f8, #d4eeff); }
          100% { background: linear-gradient(135deg, #e8e4f8, #d4eeff, #f0e4f8); }
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 48px;
          border: 2px solid #111;
        }
        .service-card {
          padding: 40px 32px;
          cursor: default;
          border-right: 2px solid #111;
          animation: cardGradient 6s ease-in-out infinite;
          transition: background 0.5s ease, color 0.3s ease;
          background-size: 200% 200%;
        }
        .service-card:nth-child(1) { animation-delay: 0s; }
        .service-card:nth-child(2) { animation-delay: -2s; }
        .service-card:nth-child(3) { animation-delay: -4s; }
        .service-card:last-child { border-right: none; }
        .service-card:hover {
          animation: none;
          background: #111 !important;
          color: #f8f7f4;
        }
        .service-card:hover .service-desc { color: #aaa; }
        .service-num {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #888;
          margin-bottom: 24px;
          transition: color 0.3s;
        }
        .service-card:hover .service-num { color: #555; }
        .service-title {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          margin: 0 0 12px;
          transition: color 0.3s;
        }
        .service-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          transition: color 0.3s;
        }

        /* ── ABOUT ── */
        .about-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-visual {
          aspect-ratio: 1;
          background: linear-gradient(135deg, #e8e4f8, #d4eeff, #f0e4f8);
          border-radius: 24px;
          display: flex;
          justify-content: center;
          font-family: 'Instrument Serif', serif;
          font-size: 80px;
          color: rgba(0,0,0,0.08);
          letter-spacing: -4px;
          overflow: hidden;
          position: relative;
        }
        .about-visual-inner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 96px;
          opacity: 0.12;
        }

        /* ── CHAT ── */
        .chat { display: flex; flex-direction: column; gap: 20px;  }
        .chat-row { display: flex; }
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

        .chat-row { opacity: 0; }
        .chat-row.animate-left {
          animation: bubbleInLeft 0.55s cubic-bezier(.22,1,.36,1) forwards;
        }
        .chat-row.animate-right {
          animation: bubbleInRight 0.55s cubic-bezier(.22,1,.36,1) forwards;
        }

        .bubble {
          max-width: 72%;
          padding: 16px 20px;
          border-radius: 20px;
          font-size: 15px;
          line-height: 1.65;
          transition: transform .2s;
        }
        .bubble:hover { transform: scale(1.01); }
        .client .bubble { background: #fff; border: 1px solid #e8e4de; box-shadow: 0 2px 12px rgba(0,0,0,0.05); text-align:start; }
        .me .bubble { background: #111; color: #f8f7f4; text-align:start;}

        /* ── CONTACT ── */
        .contact-wrap { margin-top: 48px; }
        .contact-box {
          display: flex;
          gap: 10px;
        }
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
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid #e8e4de;
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
        .fade-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── MOBILE ── */
        .hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; }
        .hamburger span { display: block; width: 22px; height: 2px; background: #111; margin: 5px 0; transition: .3s; }

        @media (max-width: 900px) {
          .services-grid { grid-template-columns: 1fr; }
          .service-card { border-right: none; border-bottom: 2px solid #111; }
          .service-card:last-child { border-bottom: none; }
          .about-layout { grid-template-columns: 1fr; gap: 40px; }
          .about-visual { display: none; }
        }

        @media (max-width: 768px) {
          .nav { padding: 16px 24px; }
          .nav-links, .nav-cta { display: none; }
          .hamburger { display: block; }
          .hero { padding: 0 24px 60px; }
          section { padding: 80px 24px; }
          .contact-box { flex-direction: column; }
          input { border-radius: 12px; }
          .btn-primary { border-radius: 12px; }
          footer { flex-direction: column; gap: 12px; text-align: center; }
          .bubble { max-width: 85%; font-size: 14px; }
        }

        @media (max-width: 480px) {
          .hero-title { letter-spacing: -1px; }
          .hero-deco { width: 240px; height: 240px; right: -40px; }
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

      {/* ─── HERO ─── */}
      <div className="hero" id="hero">
        <div className="hero-deco" />
        <div className="hero-line" />
        <div>
          <p className="hero-label">Web Developer · 경력 4년</p>
          <h1 className="hero-title">
            <SplitText text="YS Lab" />
          </h1>
          <p className="hero-sub">
            <TypeWriter text="디자인 경험을 기반으로 웹·앱 인터페이스를 구현하는 프론트엔드 개발자입니다. 디자인의 의도를 정확하게 코드로 옮기고, 실제 서비스에서 통하는 UI를 만드는 것이 강점입니다." delay={600} />
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => scrollTo("contact")}>프로젝트 문의</button>
            <span className="btn-ghost" onClick={() => scrollTo("services")}>서비스 보기 →</span>
          </div>
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
        <div style={{ maxWidth: 1100, margin: "auto", padding: "0 40px" }}>
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
            {/* ─── MARQUEE ─── */}
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
        <div style={{ maxWidth: 1100, margin: "auto", padding: "0 40px" }}>
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
              <button className="btn-primary">문의하기</button>
            </div>
          </div>
        </FadeSection>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} YS Lab. All rights reserved.</span>
      </footer>
    </div>
  );
}