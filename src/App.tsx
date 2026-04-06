import { useState, useEffect, useRef } from "react";
import './portfolio.css';

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

/* ─── 프로젝트 캐러셀 ─── */
const PROJECT_IMAGES = Array.from({ length: 10 }, (_, i) => `/${String(i + 1).padStart(3, "0")}.png`);

function ProjectsCarousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % PROJECT_IMAGES.length);
    }, 1500);
  };

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const go = (dir: 1 | -1) => {
    setCurrent(prev => (prev + dir + PROJECT_IMAGES.length) % PROJECT_IMAGES.length);
    startAuto();
  };

  return (
    <div className="proj-carousel-wrap">
      <div className="proj-carousel-stage">
        {PROJECT_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`프로젝트 ${i + 1}`}
            className={`proj-carousel-img${i === current ? " active" : ""}`}
          />
        ))}
        <button className="proj-carousel-btn prev" onClick={() => go(-1)}>‹</button>
        <button className="proj-carousel-btn next" onClick={() => go(1)}>›</button>
        <div className="proj-carousel-counter">{current + 1} / {PROJECT_IMAGES.length}</div>
      </div>
      <div className="proj-carousel-dots">
        {PROJECT_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`proj-carousel-dot${i === current ? " active" : ""}`}
            onClick={() => { setCurrent(i); startAuto(); }}
          />
        ))}
      </div>
    </div>
  );
}

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
    desc: "요청하신 스택으로 개발합니다. 중간 공유 링크로 진행 상황을 실시간으로 확인하실 수 있습니다.",
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

      {/* ─── 모바일 메뉴 ─── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        {[["서비스", "services"], ["프로젝트", "projects"], ["소개", "about"], ["문의", "contact"]].map(([label, id]) => (
          <div key={id} className="mobile-menu-item" onClick={() => scrollTo(id)}>{label}</div>
        ))}
        <button className="mobile-menu-cta" onClick={() => scrollTo("contact")}>문의하기 →</button>
      </div>

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
            <h2>함께 만든<br /><em>프로젝트들</em></h2>
            <p className="desc" style={{ marginBottom: 40 }}>
              실제로 진행한 프로젝트 작업물 모음입니다.
            </p>
            <ProjectsCarousel />
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
      {/* <section id="contact">
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
      </section> */}

      <footer>
        <span className="footer-logo">YS Lab</span>
        <span>© {new Date().getFullYear()} YS Lab. All rights reserved.</span>
      </footer>
    </div>
  );
}