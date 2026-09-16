export default function AcademicDetailsModal({ isOpen, onClose, student }) {
  if (!isOpen) return null

  const s = student || {}
  const semHistory = s.semesterHistory && Array.isArray(s.semesterHistory) ? s.semesterHistory : []

  return (
    <div className="acad-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="acad-modal-title">
      <style>{`
        .acad-modal-overlay {
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
          animation: acadFadeIn 0.18s ease-out;
        }

        .acad-modal-card {
          width: 100%;
          max-width: 820px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #d9d4c7;
          box-shadow: 0 20px 48px rgba(12, 24, 38, 0.28);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          box-sizing: border-box;
          animation: acadSlideUp 0.2s ease-out;
        }

        .acad-header {
          padding: 18px 24px;
          background: linear-gradient(135deg, #102437 0%, #1e3a5f 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
        }

        .acad-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .acad-badge-icon {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          background: rgba(179, 142, 68, 0.2);
          border: 1px solid rgba(179, 142, 68, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f5d78e;
        }

        .acad-close-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .acad-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        .acad-body {
          padding: 24px;
          overflow-y: auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .acad-section-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #475569;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #e8e4db;
          padding-bottom: 6px;
        }

        .acad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 768px) {
          .acad-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .acad-grid {
            grid-template-columns: 1fr;
          }
        }

        .acad-data-item {
          background: #fbfaf8;
          border: 1px solid #e6e2d8;
          border-radius: 6px;
          padding: 12px 14px;
        }

        .acad-data-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 4px;
        }

        .acad-data-val {
          font-size: 0.95rem;
          font-weight: 600;
          color: #112233;
          word-break: break-word;
        }

        .acad-gpa-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .acad-gpa-card {
          background: #f4f6f9;
          border: 1px solid #cbd5e1;
          border-left: 4px solid #1e3a5f;
          border-radius: 6px;
          padding: 14px 16px;
          text-align: center;
        }

        .acad-gpa-card.highlight {
          background: #fdfbf7;
          border-color: #b38e44;
          border-left: 4px solid #b38e44;
        }

        .acad-gpa-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }

        .acad-gpa-score {
          font-size: 1.75rem;
          font-weight: 800;
          color: #102437;
          line-height: 1.1;
        }

        .acad-gpa-card.highlight .acad-gpa-score {
          color: #8c681b;
        }

        .acad-gpa-note {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
        }

        .acad-table-wrap {
          overflow-x: auto;
          border: 1px solid #e2ded5;
          border-radius: 6px;
        }

        .acad-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }

        .acad-table th {
          background: #f3f0e8;
          padding: 10px 14px;
          font-weight: 700;
          color: #334155;
          border-bottom: 1px solid #ded9cc;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
        }

        .acad-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #f1eeea;
          color: #1e293b;
        }

        .acad-table tr:last-child td {
          border-bottom: none;
        }

        .acad-table tr:nth-child(even) td {
          background: #faf8f5;
        }

        .acad-footer {
          padding: 16px 24px;
          background: #f8f6f0;
          border-top: 1px solid #e2ded5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .acad-status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #166534;
          background: #dcfce7;
          border: 1px solid #86efac;
          padding: 4px 10px;
          border-radius: 12px;
        }

        .acad-print-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .acad-print-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .acad-done-btn {
          background: #1e3a5f;
          border: 1px solid #152942;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .acad-done-btn:hover {
          background: #162c48;
        }

        @keyframes acadFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes acadSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="acad-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="acad-header">
          <div className="acad-title-group">
            <div className="acad-badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h3 id="acad-modal-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Academic Transcript & Institutional Record
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
                Official Enrolment & Performance Ledger • {s.institution || 'Institutional Record'}
              </p>
            </div>
          </div>
          <button className="acad-close-btn" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="acad-body">
          {/* Standing & GPA Highlights */}
          <div>
            <div className="acad-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              GPA Performance Summary
            </div>
            <div className="acad-gpa-summary">
              <div className="acad-gpa-card">
                <div className="acad-gpa-label">Latest SGPA</div>
                <div className="acad-gpa-score">{s.sgpa || '—'}</div>
                <div className="acad-gpa-note">{s.sgpa ? (s.semester ? `${s.semester} Evaluation` : 'Latest Evaluation') : 'Not available yet'}</div>
              </div>
              <div className="acad-gpa-card">
                <div className="acad-gpa-label">Current YGPA</div>
                <div className="acad-gpa-score">{s.ygpa || '—'}</div>
                <div className="acad-gpa-note">{s.ygpa ? 'Academic Year Standing' : 'Not available yet'}</div>
              </div>
              <div className="acad-gpa-card highlight">
                <div className="acad-gpa-label">Cumulative CGPA</div>
                <div className="acad-gpa-score">{s.cgpa || '—'}</div>
                <div className="acad-gpa-note">{s.cgpa ? 'Cumulative Score' : 'Not available yet'}</div>
              </div>
            </div>
          </div>

          {/* Enrolment & Identification Details */}
          <div>
            <div className="acad-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Institutional Registration & Enrolment Information
            </div>
            <div className="acad-grid">
              <div className="acad-data-item">
                <div className="acad-data-label">College / Institution</div>
                <div className="acad-data-val">{s.institution || 'Not available yet'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">Course / Program</div>
                <div className="acad-data-val">{s.course || 'Not specified'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">Current Standing</div>
                <div className="acad-data-val">
                  {s.year && s.semester ? `${s.year} • ${s.semester}` : s.year || s.semester || 'Not available yet'}
                </div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">College Roll Number</div>
                <div className="acad-data-val">{s.collegeRollNo || 'Not available yet'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">University Roll Number</div>
                <div className="acad-data-val">{s.universityRollNo || 'Not available yet'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">Admission Course</div>
                <div className="acad-data-val">{s.admissionCourse || 'Not available yet'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">Admission Year</div>
                <div className="acad-data-val">{s.admissionYear || 'Not available yet'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">Expected Completion Year</div>
                <div className="acad-data-val">{s.completionYear || 'Not available yet'}</div>
              </div>
              <div className="acad-data-item">
                <div className="acad-data-label">Enrolment Status</div>
                <div className="acad-data-val" style={{ color: '#166534' }}>{s.enrolmentStatus || 'Active Regular Student'}</div>
              </div>
            </div>
          </div>

          {/* Semester Progress Ledger */}
          <div>
            <div className="acad-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Semester-wise Academic Evaluation
            </div>
            {semHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', background: '#fafbfc', borderRadius: 8, border: '1px dashed #cbd5e1', color: '#64748b' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" style={{ margin: '0 auto 10px', display: 'block' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div style={{ fontWeight: 600, color: '#334155', marginBottom: 4 }}>No Official Semester Transcripts Available Yet</div>
                <div style={{ fontSize: '0.8rem', maxWidth: 460, margin: '0 auto', lineHeight: 1.4 }}>
                  Official semester grade cards, credits, and evaluation certificates will appear here following institutional publication by your college administration.
                </div>
              </div>
            ) : (
              <div className="acad-table-wrap">
                <table className="acad-table">
                  <thead>
                    <tr>
                      <th>Term / Session</th>
                      <th>Credits Earned</th>
                      <th>SGPA</th>
                      <th>Evaluation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semHistory.map((row, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{row.sem}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{row.year}</div>
                        </td>
                        <td>{row.credits}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: row.sgpa === 'In Progress' ? '#64748b' : '#1e3a5f' }}>
                            {row.sgpa}
                          </span>
                        </td>
                        <td>
                          {row.status.includes('Passed') ? (
                            <span style={{ color: '#166534', fontWeight: 600 }}>Passed</span>
                          ) : (
                            <span style={{ color: '#0369a1', fontWeight: 600 }}>Active Term</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="acad-footer">
          <div className="acad-status-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Verified by Principal Office
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="acad-print-btn"
              onClick={() => window.print()}
              title="Print academic summary"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Transcript
            </button>
            <button className="acad-done-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
