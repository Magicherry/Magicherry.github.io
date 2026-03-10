import React, { useState, useRef, useEffect } from 'react';

const FadeInOnScroll = ({ children, delay = 0, eager = false, skipAnimation = false }) => {
  const [isVisible, setIsVisible] = useState(skipAnimation);
  const domRef = useRef();

  useEffect(() => {
    if (skipAnimation) {
      setIsVisible(true);
      return;
    }

    if (eager) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [delay, eager, skipAnimation]);

  return (
    <div
      ref={domRef}
      className={skipAnimation ? '' : `fade-in-section ${isVisible ? 'is-visible' : ''}`}
      style={skipAnimation ? {} : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;
