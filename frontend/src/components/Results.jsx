import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Results.css';

const Results = ({ data, onReset }) => {

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const scoreRef = useRef(null);
  const verdictRef = useRef(null);
  const metaRef = useRef(null);
  const summaryRef = useRef(null);
  const fileAnalysisRef = useRef(null);
  const risksRef = useRef(null);
  const suggestionsRef = useRef(null);
  const metricsRef = useRef(null);
  const buttonRef = useRef(null);

  // Safe checks for data structure
  const riskScore = data?.risk_score || 0;
  const verdict = data?.verdict || 'PENDING';
  const additions = data?.additions || 0;
  const deletions = data?.deletions || 0;
  const filesChanged = data?.files_changed || 0;
  const title = data?.title || 'Pull Request';
  const author = data?.pr_author || 'Unknown';
  const prUrl = data?.pr_url || '#';

  // Determine risk color
  const getRiskColor = (score) => {
    if (score >= 70) return '#ff3d00';
    if (score >= 30) return '#f5c542';
    return '#3ecf8e';
  };

  const riskColor = getRiskColor(riskScore);

  // GSAP animations on mount
  useEffect(() => {
    if (!data) return;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(headerRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power4.out' })
        .from(scoreRef.current, { scale: 0.5, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
        .from(verdictRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(metaRef.current, { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
        .from(summaryRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.3')
        .from(fileAnalysisRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(risksRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(suggestionsRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(metricsRef.current, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(buttonRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  if (!data) {
    return (
      <div className="results-container">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          color: '#888',
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>No data available</div>
          <button 
            onClick={onReset}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #ff3d00 0%, #ff5722 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '16px',
              letterSpacing: '2px'
            }}
          >
            ANALYZE ANOTHER PR
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container" ref={containerRef}>
      {/* Header Section */}
      <div className="results-header" ref={headerRef}>
        <div className="results-title">{title}</div>
        <a href={prUrl} target="_blank" rel="noopener noreferrer" className="pr-url">
          {prUrl}
        </a>
      </div>

      {/* Main Content Grid */}
      <div className="results-grid">
        {/* Left Column - Score & Meta */}
        <div className="left-column">
          {/* Score Section */}
          <div className="score-section">
            <div className="score-display" ref={scoreRef} style={{ color: riskColor }}>
              {riskScore}
            </div>
            <div className="score-label">RISK SCORE</div>
            <div className="verdict-display" ref={verdictRef} style={{ 
              borderColor: riskColor, 
              color: riskColor 
            }}>
              {verdict}
            </div>
          </div>

          {/* Metadata Section */}
          <div className="meta-section" ref={metaRef}>
            <div className="meta-row">
              <span className="meta-label">AUTHOR</span>
              <span className="meta-value">{author}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">FILES CHANGED</span>
              <span className="meta-value">{filesChanged}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">ADDITIONS</span>
              <span className="meta-value" style={{ color: '#3ecf8e' }}>+{additions}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">DELETIONS</span>
              <span className="meta-value" style={{ color: '#ff3d00' }}>-{deletions}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">TOTAL CHANGES</span>
              <span className="meta-value">{additions + deletions}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="right-column">
          {/* Summary */}
          <div className="content-section" ref={summaryRef}>
            <div className="section-title">OVERVIEW</div>
            <div className="section-text">
              {data?.plain_summary || 'No summary available for this pull request.'}
            </div>
          </div>

          {/* File Analysis */}
          <div className="content-section" ref={fileAnalysisRef}>
            <div className="section-title">
              FILE ANALYSIS
              <span className="section-count">{filesChanged}</span>
            </div>
            <div className="file-analysis-grid">
              <div className="file-stat-box">
                <div className="file-stat-value">{filesChanged}</div>
                <div className="file-stat-label">Files Modified</div>
              </div>
              <div className="file-stat-box">
                <div className="file-stat-value" style={{ color: '#3ecf8e' }}>+{additions}</div>
                <div className="file-stat-label">Lines Added</div>
              </div>
              <div className="file-stat-box">
                <div className="file-stat-value" style={{ color: '#ff3d00' }}>-{deletions}</div>
                <div className="file-stat-label">Lines Deleted</div>
              </div>
              <div className="file-stat-box">
                <div className="file-stat-value">{((additions + deletions) / Math.max(filesChanged, 1)).toFixed(0)}</div>
                <div className="file-stat-label">Avg/File</div>
              </div>
            </div>
          </div>

          {/* Risks */}
          <div className="content-section" ref={risksRef}>
            <div className="section-title">
              POTENTIAL RISKS
              <span className="section-count">{(data?.risks || []).length}</span>
            </div>
            <div className="section-text">
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
          <div className="content-section" ref={suggestionsRef}>
            <div className="section-title">
              SUGGESTIONS
              <span className="section-count">{(data?.suggestions || []).length}</span>
            </div>
            <div className="section-text">
              {(data?.suggestions || []).length > 0 ? (
                data.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="suggestion-item">
                    <div className="suggestion-title">
                      <span className="suggestion-number">{idx + 1}.</span>
                      {suggestion.title || `Suggestion ${idx + 1}`}
                    </div>
                    <div className="suggestion-detail">
                      {suggestion.detail || suggestion.description || 'No details provided'}
                    </div>
                    {suggestion.code && (
                      <div className="code-block">
                        <div className="code-block-header">RECOMMENDED CODE:</div>
                        <pre>{suggestion.code}</pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No specific suggestions</div>
              )}
            </div>
          </div>

          {/* Code Quality Metrics */}
          <div className="content-section" ref={metricsRef}>
            <div className="section-title">CODE QUALITY METRICS</div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: `${100 - riskScore}%`, backgroundColor: getRiskColor(riskScore) }}></div>
                </div>
                <div className="metric-label">Overall Quality</div>
                <div className="metric-value">{100 - riskScore}%</div>
              </div>
              <div className="metric-item">
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: `${Math.min(100, (additions / Math.max(filesChanged, 1)) * 2)}%`, backgroundColor: '#3ecf8e' }}></div>
                </div>
                <div className="metric-label">Code Complexity</div>
                <div className="metric-value">{Math.min(100, Math.round((additions / Math.max(filesChanged, 1)) * 2))}%</div>
              </div>
              <div className="metric-item">
                <div className="metric-bar">
                  <div className="metric-fill" style={{ width: `${Math.max(0, Math.min(100, 85 - (deletions / Math.max(additions, 1) * 50)))}%`, backgroundColor: '#f5c542' }}></div>
                </div>
                <div className="metric-label">Maintainability</div>
                <div className="metric-value">{Math.max(0, Math.min(100, Math.round(85 - (deletions / Math.max(additions, 1) * 50))))}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button className="reset-button" ref={buttonRef} onClick={onReset} data-cursor="pointer">
        ANALYZE ANOTHER PR →
      </button>
    </div>
  );
};

export default Results;
