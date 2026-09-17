window.addEventListener('DOMContentLoaded', () => {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo('.nav', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out' });
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.fromTo(el, { y: 54, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, delay: Math.min(i * .04, .18), ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });
    gsap.to('.phone-main', { y: -45, rotate: 2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.savings-card', { y: 38, x: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hot-card', { y: -30, x: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.utils.toArray('.step').forEach((step, i) => {
      gsap.fromTo(step, { scale: .88, opacity: 0 }, { scale: 1, opacity: 1, duration: .55, delay: i * .08, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.flow-line', start: 'top 78%' } });
    });
    gsap.fromTo('.screen-gallery .phone-shell', { y: 44, opacity: 0, rotate: 2 }, {
      y: 0, opacity: 1, rotate: 0, duration: .8, stagger: .08, ease: 'power3.out',
      scrollTrigger: { trigger: '.screen-gallery', start: 'top 82%' }
    });
    gsap.fromTo('.uiverse-search', { x: -18, opacity: 0 }, {
      x: 0, opacity: 1, duration: .7, ease: 'power3.out',
      scrollTrigger: { trigger: '.uiverse-search', start: 'top 88%' }
    });
    gsap.to('.page-glow', { x: '110vw', y: '-20vh', scale: 1.5, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true } });
  }

  document.querySelectorAll('.uiverse-card,.phone-shell,.dashboard-frame').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y*5}deg) rotateY(${x*5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
});
