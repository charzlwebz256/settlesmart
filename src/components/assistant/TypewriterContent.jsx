import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function TypewriterContent({ content, className = '', speed = 38, charsPerTick = 1, onDone, onTick }) {
  const [displayed, setDisplayed] = useState('');
  const doneRef = useRef(false);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!content) return;
    setDisplayed('');
    doneRef.current = false;
    let i = 0;
    const interval = setInterval(() => {
      i += charsPerTick;
      if (i >= content.length) {
        setDisplayed(content);
        clearInterval(interval);
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
      } else {
        setDisplayed(content.slice(0, i));
      }
      const now = Date.now();
      if (onTick && now - lastTickRef.current > 80) {
        lastTickRef.current = now;
        onTick();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className={className}>
      <ReactMarkdown>{displayed}</ReactMarkdown>
      {displayed.length < (content?.length || 0) && (
        <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 -mb-0.5 rounded-sm" />
      )}
    </div>
  );
}