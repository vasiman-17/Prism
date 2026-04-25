import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RiskMeter = ({ score, verdict }) => {
  const containerRef = useRef(null);
  const fillRef = useRef(null);
  const counterRef = useRef(null);
  const verdictRef = useRef(null);

  // Determine color based on final score
  let fillColor = '#3ecf8e';
  if (score >= 30 && score <= 69) fillColor = '#f5c542';
  if (score >= 70) fillColor = '#ff3d00';

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      
      // Animate bar and numbers
      tl.to(fillRef.current, {
        width: `${score}%`,
        duration: 2,
        ease: 'power3.out'
      })
      .to(counterRef.current, {
        innerHTML: score,
        duration: 2,
        ease: 'power3.out',
        snap: { innerHTML: 1 },
        onUpdate: function() {
          if (counterRef.current) {
            counterRef.current.innerHTML = Math.round(this.targets()[0].innerHTML);
          }
        }
      }, '<')
      .from(verdictRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.4
      }, '-=1');

      // Screen shake for high risk
      if (score >= 70 && containerRef.current) {
        tl.to(containerRef.current, {
          x: [-5, 5, -5, 5, -2, 2, 0],
          duration: 0.5,
          ease: 'power1.inOut'
        }, '-=0.5');
      }
    });
    
    return () => ctx.revert();
  }, [score]);

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Label and Score Info Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ 
          fontFamily: "'Bebas Neue', 'sans-serif'", 
          fontSize: '12px', 
          color: '#555', 
          letterSpacing: '3px',
          marginTop: '70px' // Aligning with the bottom of the large text visually 
        }}>
          RISK SCORE
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div ref={counterRef} className="risk-score-counter" style={{ 
            fontFamily: "'Bebas Neue', 'sans-serif'", 
            fontSize: '96px', 
            lineHeight: '1',
            color: fillColor,
            transition: 'color 0.3s ease'
          }}>
            0
          </div>
        </div>
      </div>

      {/* The bar track */}
      <div style={{ 
        width: '100%', 
        height: '6px', 
        backgroundColor: '#0f0f0f', 
        border: '1px solid #1e1e1e',
        position: 'relative'
      }}>
        {/* The bar fill */}
        <div ref={fillRef} style={{
          width: '0%',
          height: '100%',
          backgroundColor: fillColor,
          boxShadow: `0 0 16px ${fillColor}`,
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
        }} />
      </div>

      {/* Verdict Context below track */}
      <div ref={verdictRef} style={{
        marginTop: '12px',
        textAlign: 'right',
        fontFamily: "'Bebas Neue', 'sans-serif'",
        fontSize: '18px',
        letterSpacing: '2px',
        color: fillColor,
        opacity: 0,
        transition: 'color 0.3s ease'
      }}>
        {verdict}
      </div>

    </div>
  );
};

export default RiskMeter;
