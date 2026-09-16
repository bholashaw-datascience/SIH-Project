import { useState } from 'react'

export default function SkillsProjectsModal({
  isOpen,
  onClose,
  initialTab = 'skills',
  skills = [],
  projects = [],
  internships = [],
  onAddSkill,
  onAddProject,
  onAddInternship,
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [showAddForm, setShowAddForm] = useState(false)

  // Add Skill Form State
  const [skillName, setSkillName] = useState('')
  const [skillCategory, setSkillCategory] = useState('Frontend')
  const [skillLevel, setSkillLevel] = useState('Intermediate')
  const [skillCertName, setSkillCertName] = useState('')

  // Add Project Form State
  const [projTitle, setProjTitle] = useState('')
  const [projTech, setProjTech] = useState('')
  const [projUrl, setProjUrl] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const [projDocName, setProjDocName] = useState('')

  // Add Internship Form State
  const [internCompany, setInternCompany] = useState('')
  const [internRole, setInternRole] = useState('')
  const [internDuration, setInternDuration] = useState('')
  const [internDesc, setInternDesc] = useState('')
  const [internCertName, setInternCertName] = useState('')

  if (!isOpen) return null

  const handleCreateSkill = (e) => {
    e.preventDefault()
    if (!skillName.trim()) return
    onAddSkill?.({
      name: skillName.trim(),
      category: skillCategory,
      level: skillLevel,
      certificateFile: skillCertName || 'Skill_Certificate.pdf',
    })
    setSkillName('')
    setSkillCertName('')
    setShowAddForm(false)
  }

  const handleCreateProject = (e) => {
    e.preventDefault()
    if (!projTitle.trim()) return
    onAddProject?.({
      title: projTitle.trim(),
      techStack: projTech.split(',').map((t) => t.trim()).filter(Boolean),
      url: projUrl.trim(),
      description: projDesc.trim(),
      documentFile: projDocName || 'Project_Documentation.pdf',
    })
    setProjTitle('')
    setProjTech('')
    setProjUrl('')
    setProjDesc('')
    setProjDocName('')
    setShowAddForm(false)
  }

  const handleCreateInternship = (e) => {
    e.preventDefault()
    if (!internCompany.trim()) return
    onAddInternship?.({
      company: internCompany.trim(),
      role: internRole.trim() || 'Software Engineering Intern',
      duration: internDuration.trim() || '3 Months (Jun 2025 - Aug 2025)',
      description: internDesc.trim(),
      certificateFile: internCertName || 'Internship_Completion_Letter.pdf',
    })
    setInternCompany('')
    setInternRole('')
    setInternDuration('')
    setInternDesc('')
    setInternCertName('')
    setShowAddForm(false)
  }

  return (
    <div className="sp-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="sp-modal-title">
      <style>{`
        .sp-modal-overlay {
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
          animation: spFadeIn 0.18s ease-out;
        }

        .sp-modal-card {
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
          animation: spSlideUp 0.2s ease-out;
        }

        .sp-header {
          padding: 16px 24px;
          background: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #b38e44;
        }

        .sp-tab-bar {
          display: flex;
          background: #f4f2eb;
          border-bottom: 1px solid #ded9cc;
          padding: 0 24px;
          gap: 8px;
        }

        .sp-tab-btn {
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

        .sp-tab-btn:hover {
          color: #112233;
        }

        .sp-tab-btn.active {
          color: #112233;
          border-bottom-color: #b38e44;
          background: #ffffff;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }

        .sp-badge-count {
          font-size: 0.72rem;
          background: #e2ded5;
          color: #475569;
          padding: 2px 7px;
          border-radius: 10px;
          font-weight: 700;
        }

        .sp-tab-btn.active .sp-badge-count {
          background: #1e3a5f;
          color: #ffffff;
        }

        .sp-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sp-top-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sp-notice-box {
          background: #f0f7ff;
          border: 1px solid #bae0fd;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 0.82rem;
          color: #03447c;
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .sp-add-btn {
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

        .sp-add-btn:hover {
          background: #162c48;
        }

        .sp-form-card {
          background: #fbfaf8;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: spFadeIn 0.15s ease-out;
        }

        .sp-form-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #112233;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sp-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 640px) {
          .sp-form-grid {
            grid-template-columns: 1fr;
          }
        }

        .sp-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sp-field input, .sp-field select, .sp-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 10px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 0.88rem;
          color: #1e293b;
          background: #ffffff;
          font-family: inherit;
        }

        .sp-field input:focus, .sp-field select:focus, .sp-field textarea:focus {
          outline: none;
          border-color: #1e3a5f;
          box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.15);
        }

        .sp-items-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sp-item-card {
          background: #ffffff;
          border: 1px solid #e2ded5;
          border-radius: 6px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.15s ease;
        }

        .sp-item-card:hover {
          border-color: #cbd5e1;
        }

        .sp-item-card.verified {
          border-left: 4px solid #16a34a;
        }

        .sp-item-card.pending {
          border-left: 4px solid #d97706;
          background: #fffdfa;
        }

        .sp-item-card.rejected {
          border-left: 4px solid #dc2626;
          background: #fffafa;
        }

        .sp-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .sp-item-title {
          font-size: 0.96rem;
          font-weight: 700;
          color: #112233;
          margin: 0 0 4px;
        }

        .sp-item-meta {
          font-size: 0.78rem;
          color: #64748b;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .sp-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sp-status-chip.verified {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .sp-status-chip.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .sp-status-chip.rejected {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .sp-rejection-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 0.8rem;
          color: #991b1b;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sp-rejection-title {
          font-weight: 700;
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .sp-doc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 4px;
        }

        .sp-footer {
          padding: 14px 24px;
          background: #f8f6f0;
          border-top: 1px solid #e2ded5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @keyframes spFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="sp-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sp-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <div>
              <h3 id="sp-modal-title" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                Skills, Projects & Internship Experience
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Managed Submissions • Portal Admin Verification System
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

        {/* Tab Navigation */}
        <div className="sp-tab-bar">
          <button
            className={`sp-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => { setActiveTab('skills'); setShowAddForm(false) }}
          >
            <span>Technical Skills</span>
            <span className="sp-badge-count">{skills.filter((s) => s.verified).length}/{skills.length}</span>
          </button>
          <button
            className={`sp-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => { setActiveTab('projects'); setShowAddForm(false) }}
          >
            <span>Projects Portfolio</span>
            <span className="sp-badge-count">{projects.filter((p) => p.verified).length}/{projects.length}</span>
          </button>
          <button
            className={`sp-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => { setActiveTab('experience'); setShowAddForm(false) }}
          >
            <span>Internship Experience</span>
            <span className="sp-badge-count">{internships.filter((i) => i.verified).length}/{internships.length}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="sp-body">
          {/* Top Info Banner & Add Button */}
          <div className="sp-top-actions">
            <div className="sp-notice-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>
                <strong>Verification Workflow:</strong> All additions require supporting documents and undergo review by <strong>Portal Admin</strong>. Unverified items show as <em>Pending Verification</em>.
              </span>
            </div>

            <button className="sp-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? (
                <>Cancel</>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {activeTab === 'skills' && 'Add Skill'}
                  {activeTab === 'projects' && 'Add Project'}
                  {activeTab === 'experience' && 'Add Internship'}
                </>
              )}
            </button>
          </div>

          {/* ADD SKILL FORM */}
          {showAddForm && activeTab === 'skills' && (
            <form className="sp-form-card" onSubmit={handleCreateSkill}>
              <div className="sp-form-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Submit New Technical Skill for Verification
              </div>
              <div className="sp-form-grid">
                <div className="sp-field">
                  <label>Skill Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React.js, Python, PostgreSQL"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Domain Category</label>
                  <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)}>
                    <option value="Frontend">Frontend Development</option>
                    <option value="Backend">Backend & APIs</option>
                    <option value="Database">Databases & Storage</option>
                    <option value="Cloud">Cloud & DevOps</option>
                    <option value="Mobile">Mobile Application</option>
                    <option value="AI / ML">AI / Machine Learning</option>
                    <option value="Core Engineering">Core Engineering & Algorithms</option>
                  </select>
                </div>
                <div className="sp-field">
                  <label>Proficiency Level</label>
                  <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
                    <option value="Beginner">Beginner (Basic Syntax & Concepts)</option>
                    <option value="Intermediate">Intermediate (Independent Projects)</option>
                    <option value="Advanced">Advanced (Production Experience)</option>
                    <option value="Expert">Expert / Specialist</option>
                  </select>
                </div>
                <div className="sp-field">
                  <label>Supporting Certificate / Document Proof</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setSkillCertName(e.target.files[0]?.name || '')}
                  />
                  {skillCertName && (
                    <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: 4 }}>
                      Selected: {skillCertName}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="sp-sim-btn-reject" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="sp-add-btn">
                  Submit to Portal Admin
                </button>
              </div>
            </form>
          )}

          {/* ADD PROJECT FORM */}
          {showAddForm && activeTab === 'projects' && (
            <form className="sp-form-card" onSubmit={handleCreateProject}>
              <div className="sp-form-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                Submit Project for Portal Admin Verification
              </div>
              <div className="sp-form-grid">
                <div className="sp-field">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed E-Commerce Microservices"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, Docker, MongoDB"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Repository / Live Demo Link</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projUrl}
                    onChange={(e) => setProjUrl(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Supporting Project Report / Proof Document</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setProjDocName(e.target.files[0]?.name || '')}
                  />
                  {projDocName && (
                    <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: 4 }}>
                      Selected: {projDocName}
                    </div>
                  )}
                </div>
              </div>
              <div className="sp-field">
                <label>Project Overview & Key Highlights</label>
                <textarea
                  rows="2"
                  placeholder="Describe the architectural objectives, system features, and your individual contribution..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="sp-sim-btn-reject" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="sp-add-btn">
                  Submit to Portal Admin
                </button>
              </div>
            </form>
          )}

          {/* ADD INTERNSHIP FORM */}
          {showAddForm && activeTab === 'experience' && (
            <form className="sp-form-card" onSubmit={handleCreateInternship}>
              <div className="sp-form-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Submit Internship Experience for Verification
              </div>
              <div className="sp-form-grid">
                <div className="sp-field">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco Systems / Google / Infosys"
                    value={internCompany}
                    onChange={(e) => setInternCompany(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Designation / Role</label>
                  <input
                    type="text"
                    placeholder="Software Engineering Intern"
                    value={internRole}
                    onChange={(e) => setInternRole(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Duration / Period</label>
                  <input
                    type="text"
                    placeholder="May 2025 - Jul 2025 (3 Months)"
                    value={internDuration}
                    onChange={(e) => setInternDuration(e.target.value)}
                  />
                </div>
                <div className="sp-field">
                  <label>Offer Letter / Completion Certificate *</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setInternCertName(e.target.files[0]?.name || '')}
                  />
                  {internCertName && (
                    <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: 4 }}>
                      Selected: {internCertName}
                    </div>
                  )}
                </div>
              </div>
              <div className="sp-field">
                <label>Key Responsibilities & Deliverables</label>
                <textarea
                  rows="2"
                  placeholder="Engineered telemetry dashboards, refactored API microservices, integrated Kafka..."
                  value={internDesc}
                  onChange={(e) => setInternDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="sp-sim-btn-reject" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="sp-add-btn">
                  Submit to Portal Admin
                </button>
              </div>
            </form>
          )}

          {/* LIST ITEMS: SKILLS */}
          {activeTab === 'skills' && (
            <div className="sp-items-grid">
              {skills.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No skills submitted yet. Click &quot;Add Skill&quot; above to submit.
                </div>
              ) : (
                skills.map((s) => {
                  const statusClass = s.verified ? 'verified' : s.status === 'rejected' ? 'rejected' : 'pending'
                  return (
                    <div key={s.id} className={`sp-item-card ${statusClass}`}>
                      <div className="sp-item-top">
                        <div>
                          <div className="sp-item-title">{s.name}</div>
                          <div className="sp-item-meta">
                            <span><strong>Category:</strong> {s.category || 'General'}</span>
                            <span>•</span>
                            <span><strong>Proficiency:</strong> {s.level || 'Intermediate'}</span>
                            {s.certificateFile && (
                              <>
                                <span>•</span>
                                <span className="sp-doc-badge">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                  </svg>
                                  {s.certificateFile}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          {s.verified ? (
                            <span className="sp-status-chip verified">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              Verified
                            </span>
                          ) : s.status === 'rejected' ? (
                            <span className="sp-status-chip rejected">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Rejected
                            </span>
                          ) : (
                            <span className="sp-status-chip pending">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Exact Rejection Reason Box */}
                      {s.status === 'rejected' && s.rejectionReason && (
                        <div className="sp-rejection-box">
                          <span className="sp-rejection-title">Portal Admin Rejection Reason:</span>
                          <span>&quot;{s.rejectionReason}&quot;</span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* LIST ITEMS: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="sp-items-grid">
              {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No projects submitted yet. Click &quot;Add Project&quot; above to submit.
                </div>
              ) : (
                projects.map((p) => {
                  const statusClass = p.verified ? 'verified' : p.status === 'rejected' ? 'rejected' : 'pending'
                  return (
                    <div key={p.id} className={`sp-item-card ${statusClass}`}>
                      <div className="sp-item-top">
                        <div>
                          <div className="sp-item-title">{p.title}</div>
                          <div style={{ fontSize: '0.84rem', color: '#334155', marginBottom: 6 }}>
                            {p.description}
                          </div>
                          <div className="sp-item-meta">
                            {p.techStack && (
                              <span><strong>Stack:</strong> {Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack}</span>
                            )}
                            {p.url && (
                              <>
                                <span>•</span>
                                <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#0369a1', textDecoration: 'underline' }}>
                                  View Source / Demo
                                </a>
                              </>
                            )}
                            {p.documentFile && (
                              <>
                                <span>•</span>
                                <span className="sp-doc-badge">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                  </svg>
                                  {p.documentFile}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          {p.verified ? (
                            <span className="sp-status-chip verified">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              Verified
                            </span>
                          ) : p.status === 'rejected' ? (
                            <span className="sp-status-chip rejected">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Rejected
                            </span>
                          ) : (
                            <span className="sp-status-chip pending">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Exact Rejection Reason Box */}
                      {p.status === 'rejected' && p.rejectionReason && (
                        <div className="sp-rejection-box">
                          <span className="sp-rejection-title">Portal Admin Rejection Reason:</span>
                          <span>&quot;{p.rejectionReason}&quot;</span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* LIST ITEMS: INTERNSHIP EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="sp-items-grid">
              {internships.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  No internship experience submitted yet. Click &quot;Add Internship&quot; above to submit.
                </div>
              ) : (
                internships.map((item) => {
                  const statusClass = item.verified ? 'verified' : item.status === 'rejected' ? 'rejected' : 'pending'
                  return (
                    <div key={item.id} className={`sp-item-card ${statusClass}`}>
                      <div className="sp-item-top">
                        <div>
                          <div className="sp-item-title">{item.company}</div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1e3a5f', marginBottom: 4 }}>
                            {item.role}
                          </div>
                          {item.description && (
                            <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: 6 }}>
                              {item.description}
                            </div>
                          )}
                          <div className="sp-item-meta">
                            <span><strong>Period:</strong> {item.duration}</span>
                            {item.certificateFile && (
                              <>
                                <span>•</span>
                                <span className="sp-doc-badge">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                  </svg>
                                  {item.certificateFile}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          {item.verified ? (
                            <span className="sp-status-chip verified">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              Verified
                            </span>
                          ) : item.status === 'rejected' ? (
                            <span className="sp-status-chip rejected">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Rejected
                            </span>
                          ) : (
                            <span className="sp-status-chip pending">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Exact Rejection Reason Box */}
                      {item.status === 'rejected' && item.rejectionReason && (
                        <div className="sp-rejection-box">
                          <span className="sp-rejection-title">Portal Admin Rejection Reason:</span>
                          <span>&quot;{item.rejectionReason}&quot;</span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sp-footer">
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Verification authority: <strong>Udaan Central Portal Administration</strong>
          </div>
          <button className="sp-add-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
