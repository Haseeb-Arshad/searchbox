import barba from '@barba/core';
import { gsap } from 'gsap';

// Initialize Barba with page transitions
export const initBarba = () => {
  // Helper functions for transitions
  function fadeOut(container: HTMLElement) {
    return gsap.to(container, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }

  function fadeIn(container: HTMLElement) {
    return gsap.from(container, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }

  function slideOut(container: HTMLElement) {
    return gsap.to(container, {
      xPercent: -5,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }

  function slideIn(container: HTMLElement) {
    gsap.set(container, { xPercent: 5 });
    return gsap.to(container, {
      xPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }

  // Initialize Barba
  barba.init({
    transitions: [
      {
        name: 'default-transition',
        leave(data) {
          return fadeOut(data.current.container as HTMLElement);
        },
        enter(data) {
          return fadeIn(data.next.container as HTMLElement);
        }
      },
      {
        name: 'product-transition',
        to: { namespace: ['product'] },
        leave(data) {
          return slideOut(data.current.container as HTMLElement);
        },
        enter(data) {
          return slideIn(data.next.container as HTMLElement);
        }
      }
    ]
  });
};

// Execute initialization when document is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      initBarba();
    } catch (e) {
      console.error('Error initializing Barba.js:', e);
    }
  });
} 