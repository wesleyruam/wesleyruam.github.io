window.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const nav = document.querySelector('[data-nav]');
  const retailerWorld = document.querySelector('[data-retailer-world]');
  const brandContext = document.querySelector('[data-brand-context]');
  const navCta = document.querySelector('[data-nav-cta]');
  const progress = document.querySelector('[data-scroll-progress]');

  const updateScrollProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const value = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(Math.max(value, 0), 1)})`;
  };
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);

  if (nav && retailerWorld) {
    const updateNavigation = ([entry]) => {
      const businessMode = entry.isIntersecting;
      nav.classList.toggle('nav--business', businessMode);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', businessMode ? '#f4f7fb' : '#120403');
      if (brandContext) brandContext.textContent = businessMode ? 'para lojistas' : 'para consumidores';
      if (navCta) {
        navCta.innerHTML = businessMode ? 'Ser parceiro <span aria-hidden="true">↗</span>' : 'Explorar o app <span aria-hidden="true">↘</span>';
        navCta.href = businessMode ? '#contato' : '#experiencia';
      }
    };
    new IntersectionObserver(updateNavigation, { rootMargin: '-18% 0px -72% 0px' }).observe(retailerWorld);
  }

  const navLinks = [...document.querySelectorAll('.nav nav a[href^="#"]')];
  const observedSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const currentSection = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .25, .5] });
  observedSections.forEach((section) => currentSection.observe(section));

  const tabs = [...document.querySelectorAll('[role="tab"][data-screen-src]')];
  const demoPhone = document.querySelector('.demo-phone');
  const demoImage = document.querySelector('[data-demo-image]');
  const demoPanel = document.querySelector('#experience-panel');
  const demoLabel = document.querySelector('[data-demo-label]');
  const demoTitle = document.querySelector('[data-demo-title]');
  const demoDescription = document.querySelector('[data-demo-description]');
  const demoMeta = document.querySelector('[data-demo-meta]');

  const selectDemo = (tab, moveFocus = false) => {
    if (!tab || !demoImage || !demoPanel) return;
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    demoPanel.setAttribute('aria-labelledby', tab.id);
    if (demoLabel) demoLabel.textContent = tab.dataset.demoLabel;
    if (demoTitle) demoTitle.textContent = tab.dataset.demoTitle;
    if (demoDescription) demoDescription.textContent = tab.dataset.demoDescription;
    if (demoMeta) demoMeta.textContent = tab.dataset.demoMeta;
    demoPhone?.classList.add('is-changing');

    const nextImage = new Image();
    nextImage.src = tab.dataset.screenSrc;
    nextImage.alt = tab.dataset.screenAlt;
    nextImage.onload = () => {
      window.setTimeout(() => {
        demoImage.src = nextImage.src;
        demoImage.alt = nextImage.alt;
        demoPhone?.classList.remove('is-changing');
      }, reduceMotion ? 0 : 110);
    };
    if (nextImage.complete) nextImage.onload();
    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectDemo(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      selectDemo(tabs[nextIndex], true);
    });
  });

  const counters = [...document.querySelectorAll('[data-counter]')];
  if (!reduceMotion && counters.length) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.counter);
        const decimals = String(element.dataset.counter).includes('.') ? String(element.dataset.counter).split('.')[1].length : 0;
        const duration = 900;
        const started = performance.now();
        const animateCounter = (now) => {
          const progressValue = Math.min((now - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progressValue, 3);
          element.textContent = (target * eased).toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          if (progressValue < 1) requestAnimationFrame(animateCounter);
        };
        requestAnimationFrame(animateCounter);
        observer.unobserve(element);
      });
    }, { threshold: .65 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  if (!reduceMotion && !coarsePointer) {
    document.querySelectorAll('[data-tilt]').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const bounds = surface.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        surface.style.setProperty('--tilt-x', `${(-y * 2.6).toFixed(2)}deg`);
        surface.style.setProperty('--tilt-y', `${(x * 3.2).toFixed(2)}deg`);
      });
      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--tilt-x', '0deg');
        surface.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.nav', { y: -24, xPercent: -50, opacity: 0 }, { y: 0, xPercent: -50, opacity: 1, duration: .7, ease: 'power3.out' });
    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.fromTo(element, { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
    });
    gsap.to('.hero-phone', { y: -34, rotate: 1.5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.ambient-flare-one', { x: '70vw', y: '40vh', ease: 'none', scrollTrigger: { trigger: '.consumer-world', start: 'top top', end: 'bottom bottom', scrub: true } });
    gsap.fromTo('.value-feature', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .1, ease: 'power3.out', scrollTrigger: { trigger: '.value-layout', start: 'top 80%', once: true } });
    gsap.fromTo('.process-list li', { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: .6, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '.process-list', start: 'top 82%', once: true } });
  } else {
    document.querySelectorAll('.reveal').forEach((element) => { element.style.opacity = '1'; });
  }
});
