// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---------- Scroll progress bar ----------
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// ---------- Navbar scroll style ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

// ---------- Typewriter effect ----------
const roles = ['Frontend Developer', 'Web Developer', '문제 해결러'];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 85);
}

typeLoop();

// ---------- Card spotlight (mouse-following glow) ----------
if (!prefersReducedMotion) {
  document.querySelectorAll('.skill-card, .project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}

// ---------- GSAP setup ----------
const gsapReady = typeof gsap !== 'undefined';
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (gsapReady) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// ---------- Magnetic buttons/links ----------
function initMagnetic(selector, strength) {
  document.querySelectorAll(selector).forEach((el) => {
    let rect;

    if (gsapReady) {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

      el.addEventListener('mouseenter', () => {
        rect = el.getBoundingClientRect();
      });
      el.addEventListener('mousemove', (e) => {
        xTo((e.clientX - rect.left - rect.width / 2) * strength);
        yTo((e.clientY - rect.top - rect.height / 2) * strength);
      });
      el.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    } else {
      el.addEventListener('mousemove', (e) => {
        rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transition = 'transform 0.1s ease-out';
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.4s ease';
        el.style.transform = 'translate(0, 0)';
      });
    }
  });
}

if (!prefersReducedMotion && finePointer) {
  initMagnetic('.btn', 0.25);
  initMagnetic('.project-link', 0.5);
  initMagnetic('.contact-email, .contact-links a', 0.35);
}

// ---------- Hero blob parallax ----------
const heroBg = document.querySelector('.hero-bg');

if (heroBg && !prefersReducedMotion && finePointer) {
  const hero = document.getElementById('home');

  if (gsapReady) {
    const xTo = gsap.quickTo(heroBg, 'x', { duration: 0.8, ease: 'power3' });
    const yTo = gsap.quickTo(heroBg, 'y', { duration: 0.8, ease: 'power3' });

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      xTo(((e.clientX - rect.left) / rect.width - 0.5) * 24);
      yTo(((e.clientY - rect.top) / rect.height - 0.5) * 24);
    });
    hero.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  } else {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroBg.style.transform = `translate(${x * 24}px, ${y * 24}px)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = 'translate(0, 0)';
    });
  }
}

// ---------- GSAP scroll animations ----------
// 웹폰트 로드 전에 SplitText로 글자를 쪼개면 폴백 폰트 기준으로 줄바꿈이 계산돼
// 폰트 교체 순간 레이아웃이 틀어지고, ScrollTrigger 시작점도 어긋난다.
// 그래서 document.fonts.ready 이후에 초기화한다. (아래 맨 끝 참고)
function initScrollAnimations() {
  // --- Hero 진입 타임라인 ---
  const heroSplit = new SplitText('.hero-title', { type: 'chars' });

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-eyebrow', { y: 24, autoAlpha: 0, duration: 0.6 })
    .from(
      heroSplit.chars,
      { y: 44, autoAlpha: 0, rotateX: -60, stagger: 0.028, duration: 0.7 },
      '-=0.3'
    )
    .from('.hero-subtitle', { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.35')
    .from('.hero-desc', { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-actions .btn', { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
    .from('.scroll-indicator', { autoAlpha: 0, duration: 0.6 }, '-=0.2');

  // --- 섹션 헤더 (번호 → 제목 순서로) ---
  document.querySelectorAll('.section-head').forEach((head) => {
    gsap.from(head.children, {
      y: 30,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: head, start: 'top 85%' },
    });
  });

  // --- 섹션 번호 패럴랙스 ---
  document.querySelectorAll('.section-num').forEach((num) => {
    gsap.fromTo(
      num,
      { y: 14 },
      {
        y: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: num.closest('.section-head'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  // --- 카드/블록 stagger 등장 ---
  function staggerReveal(trigger, targets) {
    gsap.from(targets, {
      y: 36,
      autoAlpha: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger, start: 'top 80%' },
    });
  }

  staggerReveal('.about-grid', '.about-photo, .about-text');
  staggerReveal('.skills-grid', '.skill-card');
  staggerReveal('.projects-grid', '.project-card');
  staggerReveal('.timeline', '.timeline-content');
  staggerReveal('.contact-inner', '.contact-lead, .contact-links');

  // --- Experience 세로선: 스크롤에 맞춰 그리기 ---
  gsap.fromTo(
    '.timeline',
    { '--line-progress': 0 },
    {
      '--line-progress': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 75%',
        end: 'bottom 55%',
        scrub: true,
      },
    }
  );

  // --- 타임라인 dot: 지나갈 때 톡 튀어나오기 ---
  document.querySelectorAll('.timeline-item').forEach((item) => {
    gsap.from(item.querySelector('.timeline-dot'), {
      scale: 0,
      duration: 0.5,
      ease: 'back.out(2.5)',
      scrollTrigger: { trigger: item, start: 'top 72%' },
    });
  });

  // --- Contact 이메일: back ease로 팝 ---
  gsap.from('.contact-email', {
    scale: 0.85,
    autoAlpha: 0,
    duration: 0.7,
    ease: 'back.out(1.8)',
    scrollTrigger: { trigger: '.contact-inner', start: 'top 80%' },
  });

  // 페이지 중간에서 새로고침하면 브라우저가 스크롤을 복원하므로,
  // 이미 지나온 트리거는 재생하지 않고 완료 상태로 건너뛴다.
  // (scrub 계열은 스크롤 위치에 자동 동기화되니 제외)
  ScrollTrigger.getAll().forEach((st) => {
    if (st.animation && !st.vars.scrub && st.scroll() > st.start) {
      st.animation.progress(1);
    }
  });
}

if (gsapReady && !prefersReducedMotion) {
  document.fonts.ready.then(initScrollAnimations);

  // 이미지 등 늦게 로드되는 리소스로 문서 높이가 바뀌면 트리거 위치 재계산
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
