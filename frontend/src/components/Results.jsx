import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Results.css';

const Results = ({ data, onReset }) => {
  const [displayScore, setDisplayScore] = useState(0);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const riskCardRef = useRef(null);
  const barFillRef = useRef(null);
  const overviewRef = useRef(null);
  const risksRef = useRef(null);
  const suggestionsRef = useRef(null);
  const fileAnalysisRef = useRef(null);
  const verdictRef = useRef(null);
  const buttonRef = useRef(null);
  const summaryTextRef = useRef(null);

  const riskScore = data?.risk_score || 0;
  const verdict = data?.verdict || 'PENDING';
  const additions = data?.additions || 0;
  const deletions = data?.deletions || 0;
  const filesChanged = data?.files_changed || 0;
  const title = data?.title || 'Pull Request';
  const author = data?.pr_author || 'Unknown';
  const prUrl = data?.pr_url || '#';

  const getRiskColor = (score) => {
    if (score >= 70) return '#ff3d00';
    if (score >= 30) return '#f5c542';
    return '#3ecf8e';
  };

  const riskColor = getRiskColor(riskScore);

  // All GSAP animations on mount
  useEffect(() => {
    if (!data) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Header slides in
      tl.from(headerRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power4.out' });

      // 2. Risk card appears
      tl.from(riskCardRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.3');

      // 3. Risk score counts from 0 to actual
      const scoreObj = { value: 0 };
      tl.to(scoreObj, {
        value: riskScore,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => setDisplayScore(Math.round(scoreObj.value))
      }, '-=0.4');

      // 4. Risk bar fills
      if (barFillRef.current) {
        tl.to(barFillRef.current, {
          width: riskScore + '%',
          duration: 2,
          ease: 'power2.out'
        }, '<');
      }

      // 5. Cards stagger in
      const cards = [overviewRef.current, risksRef.current, suggestionsRef.current].filter(Boolean);
      tl.from(cards, {
        opacity: 0, y: 40,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=1.2');

      // 6. Typewriter on summary words
      if (summaryTextRef.current) {
        const words = summaryTextRef.current.querySelectorAll('.summary-word');
        if (words.length > 0) {
          tl.from(words, {
            opacity: 0, y: 8,
            stagger: 0.04,
            duration: 0.3,
          }, '-=0.8');
        }
      }

      // 7. Risk items stagger from left
      const riskItems = containerRef.current?.querySelectorAll('.risk-item');
      if (riskItems && riskItems.length > 0) {
        tl.from(riskItems, {
          opacity: 0, x: -20,
          stagger: 0.1,
          duration: 0.5
        }, '-=0.5');
      }

      // 8. File analysis
      if (fileAnalysisRef.current) {
        tl.from(fileAnalysisRef.current, { y: 30, opacity: 0, duration: 0.6 }, '-=0.3');
      }

      // 9. Verdict
      if (verdictRef.current) {
        tl.from(verdictRef.current, { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.2');
      }

      // 10. Button
      if (buttonRef.current) {
        tl.from(buttonRef.current, { y: 20, opacity: 0, duration: 0.5 }, '-=0.2');
      }
    }, containerRef);

    return () => ctx.revert();
  }, [data, riskScore]);

  // Split summary into words for typewriter
  const summaryWords = (data?.plain_summary || '').split(' ');

  if (!data) {
    return (
      <div className="results-container">
        <div className="results-empty">
          <div>No data available</div>
          <button onClick={onReset} className="reset-btn-inline">ANALYZE ANOTHER PR</button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container" ref={containerRef}>
      {/* Header — smaller title + PR link */}
      <div className="results-header" ref={headerRef}>
        <div className="results-tag">ANALYSIS COMPLETE</div>
        <h2 className="results-title">{title}</h2>
        <a href={prUrl} target="_blank" rel="noopener noreferrer" className="pr-link">{prUrl}</a>
        <div className="results-author">by {author}</div>
      </div>

      {/* Risk Score Card — full width with animated bar */}
      <div className="risk-card" ref={riskCardRef}>
        <div className="risk-card-inner">
          <div className="risk-left">
            <div className="risk-label">RISK SCORE</div>
            <div className="risk-bar-track">
              <div className="risk-bar-fill" ref={barFillRef} style={{ width: '0%', backgroundColor: riskColor, boxShadow: `0 0 16px ${riskColor}` }}></div>
            </div>
          </div>
          <div className="risk-right">
            <div className="risk-score-number" style={{ color: riskColor }}>{displayScore}</div>
            <div className="risk-verdict" style={{ color: riskColor, borderColor: riskColor }}>{verdict}</div>
          </div>
        </div>
        {data?.risk_reasoning && (
          <div className="risk-reasoning">{data.risk_reasoning}</div>
        )}
      </div>

      {/* Content Cards — 3 columns */}
      <div className="cards-grid">
        {/* Overview */}
        <div className="result-card" ref={overviewRef}>
          <div className="card-header" style={{ borderTopColor: '#3ecf8e' }}>
            <span className="card-title">OVERVIEW</span>
          </div>
          <div className="card-body">
            <div className="summary-text" ref={summaryTextRef}>
              {summaryWords.map((word, i) => (
                <span key={i} className="summary-word">{word} </span>
              ))}
            </div>
          </div>
        </div>

        {/* Risks */}
        <div className="result-card" ref={risksRef}>
          <div className="card-header" style={{ borderTopColor: '#ff3d00' }}>
            <span className="card-title">RISKS</span>
            <span className="card-count">{(data?.risks || []).length}</span>
          </div>
          <div className="card-body">
            {(data?.risks || []).length > 0 ? (
              data.risks.map((risk, idx) => (
                <div key={idx} className="risk-item">
                  <span className="risk-bullet">▸</span>
                  <span>{risk}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">No significant risks detected</div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="result-card" ref={suggestionsRef}>
          <div className="card-header" style={{ borderTopColor: '#f5c542' }}>
            <span className="card-title">SUGGESTIONS</span>
            <span className="card-count">{(data?.suggestions || []).length}</span>
          </div>
          <div className="card-body">
            {(data?.suggestions || []).length > 0 ? (
              data.suggestions.map((s, idx) => (
                <div key={idx} className="suggestion-item">
                  <div className="suggestion-title">
                    <span className="suggestion-num">{idx + 1}.</span>
                    {s.title || `Suggestion ${idx + 1}`}
                  </div>
                  <div className="suggestion-detail">{s.detail || s.description || ''}</div>
                  {s.code && (
                    <div className="code-block">
                      <div className="code-header">RECOMMENDED FIX</div>
                      <pre>{s.code}</pre>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">No specific suggestions</div>
            )}
          </div>
        </div>
      </div>

      {/* File Analysis — 3 stat cards (no avg/file) */}
      <div className="file-analysis" ref={fileAnalysisRef}>
        <div className="file-stat">
          <div className="file-stat-val">{filesChanged}</div>
          <div className="file-stat-lbl">FILES MODIFIED</div>
        </div>
        <div className="file-stat">
          <div className="file-stat-val" style={{ color: '#3ecf8e' }}>+{additions}</div>
          <div className="file-stat-lbl">LINES ADDED</div>
        </div>
        <div className="file-stat">
          <div className="file-stat-val" style={{ color: '#ff3d00' }}>-{deletions}</div>
          <div className="file-stat-lbl">LINES DELETED</div>
        </div>
      </div>

      {/* Verdict */}
      <div className="verdict-section" ref={verdictRef}>
        <div className="verdict-label">VERDICT</div>
        <div className="verdict-text" style={{ color: riskColor }}>{verdict}</div>
      </div>

      {/* Reset Button */}
      <button className="reset-button" ref={buttonRef} onClick={onReset} data-cursor="pointer">
        ANALYZE ANOTHER PR →
      </button>
    </div>
  );
};

export default Results;
