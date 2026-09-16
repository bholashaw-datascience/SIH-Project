import { useState } from 'react'

export default function InternshipsPlacementsModal({ isOpen, onClose, student }) {
  const [filter, setFilter] = useState('all') // 'all' | 'placements' | 'internships' | 'applied'
  const [appliedIds, setAppliedIds] = useState([])

  if (!isOpen) return null

  const s = student || {}
  const studentCgpa = parseFloat(s.cgpa) || 0

  const opportunities = [
    {
      id: 'p1',
      type: 'placement',
      company: 'Microsoft India Development Center',
      role: 'Software Development Engineer - I (Full-Time)',
      package: '₹44.0 LPA',
      location: 'Hyderabad / Bengaluru / Noida',
      eligibility: 'B.Tech CSE/IT, CGPA >= 7.5, 0 active backlogs',
      minCgpa: 7.5,
      deadline: '15 Oct 2026',
      status: 'Eligible',
      tags: ['On-Campus Tier 1', 'Day 0 Drive'],
    },
    {
      id: 'p2',
      type: 'placement',
      company: 'Amazon Web Services (AWS)',
      role: 'Cloud Support & DevOps Engineer',
      package: '₹28.5 LPA',
      location: 'Bengaluru / Hybrid',
      eligibility: 'B.Tech All Engineering, CGPA >= 7.0',
      minCgpa: 7.0,
      deadline: '22 Oct 2026',
      status: 'Eligible',
      tags: ['On-Campus', 'Day 1 Drive'],
    },
    {
      id: 'i1',
      type: 'internship',
      company: 'Google Summer Internship 2026',
      role: 'Software Engineering Intern (Summer 2026)',
      package: '₹1,25,000 / month stipend',
      location: 'Bengaluru / Hyderabad',
      eligibility: 'Penultimate Year B.Tech, CGPA >= 8.0',
      minCgpa: 8.0,
      deadline: '30 Sep 2026',
      status: 'Eligible',
      tags: ['Summer Internship', 'Fast-Track PPO'],
    },
    {
      id: 'i2',
      type: 'internship',
      company: 'Oracle Cloud Infrastructure',
      role: 'Database Systems & Cloud Intern',
      package: '₹85,000 / month stipend',
      location: 'Pune / Hyderabad',
      eligibility: 'B.Tech CSE/ECE, CGPA >= 7.0',
      minCgpa: 7.0,
      deadline: '10 Nov 2026',
      status: 'Eligible',
      tags: ['Industry Internship'],
    },
  ]

  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id])
    }
  }

  const filteredOpportunities = opportunities.filter((op) => {
    if (filter === 'placements') return op.type === 'placement'
    if (filter === 'internships') return op.type === 'internship'
    if (filter === 'applied') return appliedIds.includes(op.id)
    return true
  })

  return (
    <div className="ip-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="ip-modal-title">
      <style>{`
        .ip-modal-overlay {
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
          animation: ipFadeIn 0.18s ease-out;
        }

        .ip-modal-card {
          width: 100%;
          max-width: 900px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #d9d4c7;
          box-shadow: 0 20px 48px rgba(12, 24, 38, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-sizing: border-box;
          animation: ipSlideUp 0.2s ease-out;
        }

        .ip-header {
          padding: 16px 24px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
        }

        .ip-tabs {
          display: flex;
          background: #f4f2eb;
          border-bottom: 1px solid #ded9cc;
          padding: 0 24px;
          gap: 8px;
        }

        .ip-tab-btn {
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

        .ip-tab-btn:hover {
          color: #112233;
        }

        .ip-tab-btn.active {
          color: #112233;
          border-bottom-color: #b38e44;
          background: #ffffff;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        .ip-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ip-cell-banner {
          background: #fdfbf7;
          border: 1px solid #e7dfcf;
          border-left: 4px solid #b38e44;
          border-radius: 6px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ip-opp-card {
          background: #ffffff;
          border: 1px solid #e2ded5;
          border-radius: 8px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .ip-opp-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(15, 29, 47, 0.05);
        }

        .ip-opp-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .ip-company-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #112233;
          margin: 0 0 4px;
        }

        .ip-role-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 6px;
        }

        .ip-package-badge {
          background: #f0fdf4;
          border: 1px solid #86efac;
          color: #166534;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .ip-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px 16px;
          font-size: 0.82rem;
          color: #475569;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 6px;
        }

        @media (max-width: 600px) {
          .ip-meta-grid {
            grid-template-columns: 1fr;
          }
        }

        .ip-btn-apply {
          background: #1e3a5f;
          border: 1px solid #152942;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .ip-btn-apply:hover {
          background: #162c48;
        }

        .ip-btn-applied {
          background: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .ip-footer {
          padding: 14px 24px;
          background: #f8f6f0;
          border-top: 1px solid #e2ded5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @keyframes ipFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ipSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="ip-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ip-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <div>
              <h3 id="ip-modal-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Internships & Campus Placements
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Official Institutional Career Portal • {s.institution || 'Institutional Career Portal'}
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
        <div className="ip-tabs">
          <button
            className={`ip-tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Opportunities ({opportunities.length})
          </button>
          <button
            className={`ip-tab-btn ${filter === 'placements' ? 'active' : ''}`}
            onClick={() => setFilter('placements')}
          >
            Full-Time Placements
          </button>
          <button
            className={`ip-tab-btn ${filter === 'internships' ? 'active' : ''}`}
            onClick={() => setFilter('internships')}
          >
            Summer Internships
          </button>
          <button
            className={`ip-tab-btn ${filter === 'applied' ? 'active' : ''}`}
            onClick={() => setFilter('applied')}
          >
            My Applications ({appliedIds.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="ip-body">
          {/* Institutional Status Banner */}
          <div className="ip-cell-banner">
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#112233' }}>
                Placement Cell Status: Active Regular Candidate
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                Verified CGPA: <strong>{studentCgpa > 0 ? studentCgpa.toFixed(2) : 'Pending Verification'}</strong> • Backlogs: <strong>0</strong> • Enrolment: Verified
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', background: '#e2f5ea', color: '#15803d', border: '1px solid #86efac', padding: '4px 10px', borderRadius: 12, fontWeight: 700 }}>
              ✓ All Eligible Drives Unlocked
            </div>
          </div>

          {/* Cards List */}
          {filteredOpportunities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              {filter === 'applied'
                ? 'No internship or placement applications submitted yet.'
                : 'No opportunities matching this category.'}
            </div>
          ) : (
            filteredOpportunities.map((op) => {
              const isApplied = appliedIds.includes(op.id)
              const isEligible = studentCgpa >= op.minCgpa

              return (
                <div key={op.id} className="ip-opp-card">
                  <div className="ip-opp-top">
                    <div>
                      <h4 className="ip-company-title">{op.company}</h4>
                      <div className="ip-role-title">{op.role}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {op.tags.map((t, idx) => (
                          <span key={idx} style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ip-package-badge">
                      {op.package}
                    </div>
                  </div>

                  <div className="ip-meta-grid">
                    <div><strong>Location:</strong> {op.location}</div>
                    <div><strong>Registration Deadline:</strong> {op.deadline}</div>
                    <div><strong>Eligibility:</strong> {op.eligibility}</div>
                    <div>
                      <strong>Status:</strong>{' '}
                      <span style={{ color: isApplied ? '#166534' : isEligible ? '#0369a1' : '#b91c1c', fontWeight: 600 }}>
                        {isApplied ? op.status : isEligible ? 'Eligible to Apply' : 'CGPA Requirement Not Met'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    {isApplied ? (
                      <div className="ip-btn-applied">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Application Submitted ({op.status})
                      </div>
                    ) : (
                      <button
                        className="ip-btn-apply"
                        disabled={!isEligible}
                        onClick={() => handleApply(op.id)}
                      >
                        Apply via Placement Cell
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="ip-footer">
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Managed by: <strong>Office of Training & Placement Cell</strong>
          </div>
          <button className="ip-btn-apply" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
