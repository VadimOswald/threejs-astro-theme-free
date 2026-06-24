import { useEffect } from 'preact/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PageAnimations() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.anim-reveal').forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });

      const heroContent = document.querySelector('.hero__content');
      if (heroContent) {
        gsap.from(heroContent.children, { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3 });
      }

      gsap.utils.toArray<HTMLElement>('.hiw__number').forEach(el => {
        gsap.from(el, { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
