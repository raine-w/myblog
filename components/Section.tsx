import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section id={id} className={`py-32 relative ${className}`}>
      <div 
        ref={sectionRef}
        className={`max-w-7xl mx-auto px-6 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {(title || subtitle) && (
          <div className="mb-24 text-center relative">
            {/* Decorative line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10"></div>
            
            <div className="inline-block bg-slate-50/80 backdrop-blur px-8 relative z-10">
              {title && (
                <h2 className="text-4xl md:text-5xl font-tech font-bold text-slate-800 mb-3 tracking-wide uppercase">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-lg font-tech text-slate-500 tracking-wider text-cyan-600">
                  // {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;