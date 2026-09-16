import { useState } from 'react'

export default function SkillAssessmentsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'completed' | 'available'

  if (!isOpen) return null

  const availableCatalog = [
    {
      id: 'a3',
      title: 'System Design & Distributed Cloud Architectures',
      category: 'Cloud & Infrastructure',
      duration: '75 Minutes',
      questions: '1 Architecture Scenario + 20 Design MCQs',
      status: 'available',
      passingScore: '75%',
      badge: 'Pro Tier Badge',
    },
    {
      id: 'a4',
      title: 'Database Management Systems & Query Optimization',
      category: 'Data Engineering',
      duration: '60 Minutes',
      questions: '15 Query Optimization Tasks + Indexing',
      status: 'available',
      passingScore: '70%',
      badge: 'Advanced Badge',
    },
  ]

  const assessments = availableCatalog

  const filtered = assessments.filter((a) => {
    if (activeTab === 'completed') return a.status === 'completed'
    if (activeTab === 'available') return a.status === 'available'
    return true
  })

  return (
    <div className="sa-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="sa-modal-title">
      <style>{`
        .sa-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 29, 47, 0.65);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 20px;
          box-sizing: border-box;
          animation: saFadeIn 0.18s ease-out;
        }

        .sa-modal-card {
          width: 100%;
          max-width: 860px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #d9d4c7;
          box-shadow: 0 20px 48px rgba(12, 24, 38, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-sizing: border-box;
          animation: saSlideUp 0.2s ease-out;
        }

        .sa-header {
          padding: 16px 24px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
        }

        .sa-tabs {
          display: flex;
          background: #f4f2eb;
          border-bottom: 1px solid #ded9cc;
          padding: 0 24px;
          gap: 8px;
        }

        .sa-tab-btn {
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          padding: 12px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .sa-tab-btn:hover {
          color: #112233;
        }

        .sa-tab-btn.active {
          color: #112233;
          border-bottom-color: #b38e44;
          background: #ffffff;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        .sa-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sa-card-item {
          background: #ffffff;
          border: 1px solid #e2ded5;
          border-radius: 8px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.15s ease;
        }

        .sa-card-item.completed {
          border-left: 4px solid #16a34a;
        }

        .sa-card-item.available {
          border-left: 4px solid #1e3a5f;
        }

        .sa-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .sa-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #112233;
          margin: 0 0 4px;
        }

        .sa-card-meta {
          font-size: 0.8rem;
          color: #64748b;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sa-score-badge {
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .sa-btn-start {
          background: #1e3a5f;
          border: 1px solid #152942;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .sa-btn-start:hover {
          background: #162c48;
        }

        .sa-footer {
          padding: 14px 24px;
          background: #f8f6f0;
          border-top: 1px solid #e2ded5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @keyframes saFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes saSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="sa-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sa-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <div>
              <h3 id="sa-modal-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Institutional Skill Assessments
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Standardized Competency Benchmarks • Proctored Evaluations
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 6 }}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab Filters */}
        <div className="sa-tabs">
          <button
            className={`sa-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Assessments ({assessments.length})
          </button>
          <button
            className={`sa-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed & Verified ({assessments.filter((a) => a.status === 'completed').length})
          </button>
          <button
            className={`sa-tab-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available to Take ({assessments.filter((a) => a.status === 'available').length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="sa-body">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              {activeTab === 'completed'
                ? 'No skill assessments completed yet. Take an assessment from the Available tab to earn verified badges.'
                : 'No skill assessments available in this category.'}
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className={`sa-card-item ${item.status}`}>
                <div className="sa-card-top">
                  <div>
                    <h4 className="sa-card-title">{item.title}</h4>
                    <div className="sa-card-meta">
                      <span><strong>Domain:</strong> {item.category}</span>
                      <span>•</span>
                      <span><strong>Duration:</strong> {item.duration}</span>
                      <span>•</span>
                      <span><strong>Format:</strong> {item.questions}</span>
                    </div>
                  </div>

                  {item.status === 'completed' ? (
                    <div className="sa-score-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Score: {item.score} ({item.badge})
                    </div>
                  ) : (
                    <button
                      className="sa-btn-start"
                      onClick={() => alert(`Starting assessment: "${item.title}". Proctored environment initialization will begin.`)}
                    >
                      Start Assessment
                    </button>
                  )}
                </div>

                {item.status === 'completed' && (
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: 6, fontSize: '0.8rem', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      Ranking: <strong>{item.percentile}</strong> • Completed on: <strong>{item.completedDate}</strong>
                    </div>
                    <div style={{ color: '#0369a1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      Credential ID: {item.certId}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="sa-footer">
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Assessment criteria aligned with <strong>National Institutional Framework</strong>
          </div>
          <button className="sa-btn-start" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
