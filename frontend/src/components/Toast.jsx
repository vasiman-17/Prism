import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Toast = ({ message, type, onClose }) => {
  const toastRef = useRef(null);
  // Store onClose in a ref so the effect doesn't re-run when onClose reference changes
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    // Mount animation
    const tl = gsap.timeline();
    tl.fromTo(toastRef.current, 
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    // Auto-dismiss after 4s
    const timer = setTimeout(() => {
      if (toastRef.current) {
        gsap.to(toastRef.current, {
          x: 60,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => {
            if (onCloseRef.current) onCloseRef.current();
          }
        });
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []); // Empty deps — runs once on mount only

  const borderColor = type === 'error' ? '#ff3d00' : '#3ecf8e';

  return (
    <div
      ref={toastRef}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        backgroundColor: '#0f0f0f',
        border: `1px solid ${borderColor}`,
        padding: '16px 20px',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '13px',
        color: '#f0ede5'
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
