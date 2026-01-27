import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 120,
  delay = 500,
  className = ""
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer: any;
    if (index === 0) {
      // initial delay before starting
      timer = setTimeout(() => setIndex(1), delay);
    } else if (index < text.length) {
      timer = setTimeout(() => setIndex(i => i + 1), speed);
    } else if (index === text.length) {
      // finished, wait 5s then restart
      timer = setTimeout(() => setIndex(0), 5000);
    }
    return () => clearTimeout(timer);
  }, [index, text, speed, delay]);

  return (
    <span className={className}>
      {text.slice(0, index)}
      <span className="animate-pulse text-cyan-500 font-bold">_</span>
    </span>
  );
};

export default Typewriter;