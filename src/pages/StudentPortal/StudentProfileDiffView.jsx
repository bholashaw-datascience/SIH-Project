import { DOCUMENT_SPECS } from './documentSpecs'

export default function StudentProfileDiffView({
  verifiedData,
  verifiedDocuments,
  pendingData,
  pendingDocuments,
  pendingStatus, // 'pending' | 'rejected'
  rejectionReason,
  onEditPending,
  onCancelPending,
  onBackToDashboard,
}) {
  const isRejected = pendingStatus === 'rejected'

  // Comparison fields definitions
  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Mobile Number' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'gender', label: 'Gender' },
    { key: 'presentAddress', label: 'Present Address' },
    { key: 'permanentAddress', label: 'Permanent Address' },
    { key: 'institution', label: 'College / Institution' },
    { key: 'course', label: 'Course / Program' },
    { key: 'currentYear', label: 'Current Year' },
    { key: 'currentSemester', label: 'Current Semester' },
    { key: 'collegeRoll', label: 'College Roll Number' },
    { key: 'universityRoll', label: 'University Roll Number' },
    { key: 'admissionYear', label: 'Admission Year' },
    { key: 'completionYear', label: 'Expected Completion Year' },
    { key: 'sgpa', label: 'SGPA' },
    { key: 'ygpa', label: 'YGPA' },
    { key: 'cgpa', label: 'CGPA' },
  ]

  const isFieldChanged = (key) => {
    const oldVal = (verifiedData?.[key] || '').toString().trim()
    const newVal = (pendingData?.[key] || '').toString().trim()
    return oldVal !== newVal && newVal !== ''
  }

  const isPhotoChanged = verifiedData?.profilePic !== pendingData?.profilePic && pendingData?.profilePic

  return (
    <div className="diff-page-wrapper">
      <style>{`
        .diff-page-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #f5f2ea;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #0f1d2f;
          padding-bottom: 60px;
          box-sizing: border-box;
        }

        .diff-top-nav-bar {
          background-color: #112233;
          color: #ffffff;
          padding: 16px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .diff-nav-title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .diff-btn-back {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .diff-btn-back:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #b3881e;
          color: #f1cf7c;
        }

        /* Banner */
        .diff-banner {
          background: linear-gradient(135deg, #112233 0%, #1a3c5c 100%);
          color: #ffffff;
          padding: 28px 36px;
          border-bottom: 3px solid #b3881e;
        }

        .diff-banner-inner {
          max-width: 1080px;
          margin: 0 auto;
        }

        .diff-banner-badge {
          display: inline-block;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .diff-badge-pending {
          background-color: rgba(179, 136, 30, 0.25);
          border: 1px solid #f1cf7c;
          color: #f1cf7c;
        }

        .diff-badge-rejected {
          background-color: rgba(220, 38, 38, 0.25);
          border: 1px solid #fca5a5;
          color: #fca5a5;
        }

        .diff-banner-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 8px;
        }

        .diff-banner-desc {
          font-size: 13.5px;
          color: #c7d5e0;
          line-height: 1.5;
          max-width: 780px;
          margin: 0;
        }

        .diff-content-container {
          max-width: 1080px;
          margin: 28px auto 0;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-sizing: border-box;
        }

        /* Alert Callout */
        .diff-status-card {
          border-radius: 8px;
          padding: 18px 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .diff-status-card.is-pending {
          background-color: #fefce8;
          border: 1px solid #fef08a;
          border-left: 5px solid #ca8a04;
        }

        .diff-status-card.is-rejected {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 5px solid #ef4444;
        }

        .diff-status-text h4 {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 4px;
        }

        .is-pending .diff-status-text h4 { color: #854d0e; }
        .is-rejected .diff-status-text h4 { color: #991b1b; }

        .diff-status-text p {
          font-size: 13px;
          margin: 0;
          line-height: 1.45;
        }

        .is-pending .diff-status-text p { color: #713f12; }
        .is-rejected .diff-status-text p { color: #7f1d1d; }

        .diff-btn-edit {
          background-color: #112233;
          color: #ffffff;
          border: none;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .diff-btn-edit:hover {
          background-color: #1b525c;
        }

        /* Side-by-side Layout Grid */
        .diff-columns-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .diff-col-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(15, 29, 47, 0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .diff-col-card.is-pending-col {
          border-color: #b3881e;
          box-shadow: 0 4px 16px rgba(179, 136, 30, 0.1);
        }

        .diff-col-header {
          padding: 16px 20px;
          border-bottom: 1px solid #ede8de;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .diff-col-header.verified-head {
          background-color: #f1f7f6;
          border-bottom-color: #d1e7e4;
        }

        .diff-col-header.pending-head {
          background-color: #faf7f0;
          border-bottom-color: #ede8de;
        }

        .diff-col-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .diff-col-tag {
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .diff-tag-live {
          background-color: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .diff-tag-pending {
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .diff-col-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Avatar Comparison Block */
        .diff-avatar-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #eee8db;
        }

        .diff-avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2.5px solid #ded9cc;
          overflow: hidden;
          background-color: #faf7f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .diff-avatar-circle.is-changed {
          border-color: #b3881e;
        }

        .diff-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .diff-avatar-initial {
          font-size: 26px;
          font-weight: 700;
          color: #1b525c;
        }

        /* Field Item Rows */
        .diff-field-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 10px;
          border-radius: 5px;
          background-color: #faf7f0;
          border: 1px solid #ede8de;
        }

        .diff-field-row.is-highlight {
          background-color: #fefce8;
          border-color: #fde047;
        }

        .diff-field-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .diff-changed-pill {
          background-color: #b3881e;
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 3px;
        }

        .diff-field-val {
          font-size: 13.5px;
          font-weight: 600;
          color: #0f1d2f;
          word-break: break-word;
        }

        /* Document Diff List */
        .diff-docs-card {
          background: #ffffff;
          border: 1px solid #ded9cc;
          border-radius: 8px;
          overflow: hidden;
        }

        .diff-docs-header {
          background-color: #faf7f0;
          padding: 14px 20px;
          border-bottom: 1px solid #ede8de;
        }

        .diff-docs-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
        }

        .diff-docs-table-wrap {
          overflow-x: auto;
        }

        .diff-docs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          text-align: left;
        }

        .diff-docs-table th {
          background-color: #f7fafb;
          padding: 11px 16px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
        }

        .diff-docs-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1ece1;
          vertical-align: middle;
        }

        .diff-doc-status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          word-break: break-word;
          max-width: 320px;
          line-height: 1.4;
        }

        .diff-doc-verified {
          background-color: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .diff-doc-pending {
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .diff-doc-none {
          color: #94a3b8;
          font-style: italic;
        }

        @media (max-width: 820px) {
          .diff-top-nav-bar {
            padding: 14px 18px;
          }
          .diff-banner {
            padding: 20px 18px;
          }
          .diff-content-container {
            padding: 0 12px;
          }
          .diff-columns-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Top Navbar */}
      <header className="diff-top-nav-bar">
        <h1 className="diff-nav-title">Student Portal • Profile Changes</h1>
        <button
          type="button"
          className="diff-btn-back"
          onClick={onBackToDashboard}
        >
          ← Return to Dashboard
        </button>
      </header>

      {/* Banner */}
      <section className="diff-banner">
        <div className="diff-banner-inner">
          <span className={`diff-banner-badge ${isRejected ? 'diff-badge-rejected' : 'diff-badge-pending'}`}>
            {isRejected ? 'Changes Rejected' : 'Awaiting Institutional Approval'}
          </span>
          <h2 className="diff-banner-title">Profile Change Review & Institutional Verification</h2>
          <p className="diff-banner-desc">
            Your profile changes have been submitted to your Principal / Institutional Coordinator for review.
            Your current verified profile remains active across all platform features until institutional approval is granted.
          </p>
        </div>
      </section>

      <div className="diff-content-container">
        {/* Status Callout Card */}
        <div className={`diff-status-card ${isRejected ? 'is-rejected' : 'is-pending'}`}>
          <div className="diff-status-text">
            <h4>
              {isRejected
                ? 'Your submitted profile changes were rejected'
                : 'Your profile changes are awaiting institutional approval.'}
            </h4>
            <p>
              {isRejected
                ? (rejectionReason || 'The institutional reviewer requested corrections to your submission. Review the details below and re-submit.')
                : 'Until your Principal or Coordinator approves these updates, your existing verified information remains live. You may edit your submission or wait for approval.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="diff-btn-edit"
              onClick={onEditPending}
            >
              {isRejected ? '↻ Edit & Re-submit Changes' : '✎ Edit Pending Changes'}
            </button>
            {onCancelPending && !isRejected && (
              <button
                type="button"
                className="diff-btn-edit"
                style={{ backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1' }}
                onClick={onCancelPending}
              >
                Withdraw Changes
              </button>
            )}
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="diff-columns-grid">
          {/* LEFT: Current Verified Information */}
          <div className="diff-col-card">
            <div className="diff-col-header verified-head">
              <h3 className="diff-col-title">
                <span>Current Verified Information</span>
              </h3>
              <span className="diff-col-tag diff-tag-live">✓ Live & Active</span>
            </div>

            <div className="diff-col-body">
              {/* Profile Photo */}
              <div className="diff-avatar-wrap">
                <div className="diff-avatar-circle">
                  {verifiedData?.profilePic ? (
                    <img src={verifiedData.profilePic} alt="Verified photo" className="diff-avatar-img" />
                  ) : (
                    <span className="diff-avatar-initial">
                      {verifiedData?.name ? verifiedData.name.charAt(0) : 'S'}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                    Current Profile Picture
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155' }}>
                    Institutional Verified Photo
                  </div>
                </div>
              </div>

              {/* Verified Field Values */}
              {fields.map((f) => (
                <div key={f.key} className="diff-field-row">
                  <div className="diff-field-label">{f.label}</div>
                  <div className="diff-field-val">
                    {verifiedData?.[f.key] || <span style={{ color: '#94a3b8' }}>—</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Pending Changes Awaiting Approval */}
          <div className="diff-col-card is-pending-col">
            <div className="diff-col-header pending-head">
              <h3 className="diff-col-title">
                <span>Pending Changes</span>
              </h3>
              <span className="diff-col-tag diff-tag-pending">⏳ Awaiting Approval</span>
            </div>

            <div className="diff-col-body">
              {/* Pending Profile Photo */}
              <div className="diff-avatar-wrap">
                <div className={`diff-avatar-circle ${isPhotoChanged ? 'is-changed' : ''}`}>
                  {pendingData?.profilePic ? (
                    <img src={pendingData.profilePic} alt="Pending photo" className="diff-avatar-img" />
                  ) : (
                    <span className="diff-avatar-initial">
                      {pendingData?.name ? pendingData.name.charAt(0) : 'S'}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#8f650b', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Pending Profile Picture</span>
                    {isPhotoChanged && <span className="diff-changed-pill">MODIFIED</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155' }}>
                    {isPhotoChanged ? 'New photo submitted for verification' : 'Unchanged'}
                  </div>
                </div>
              </div>

              {/* Pending Field Values */}
              {fields.map((f) => {
                const changed = isFieldChanged(f.key)
                return (
                  <div key={f.key} className={`diff-field-row ${changed ? 'is-highlight' : ''}`}>
                    <div className="diff-field-label">
                      <span>Pending {f.label}</span>
                      {changed && <span className="diff-changed-pill">MODIFIED</span>}
                    </div>
                    <div className="diff-field-val">
                      {pendingData?.[f.key] || <span style={{ color: '#94a3b8' }}>—</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Document Comparisons Table */}
        <section className="diff-docs-card">
          <div className="diff-docs-header">
            <h3 className="diff-docs-title">Document Verification Status</h3>
          </div>

          <div className="diff-docs-table-wrap">
            <table className="diff-docs-table">
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Current Verified Document</th>
                  <th>Pending Document Submission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DOCUMENT_SPECS.map((doc) => {
                  const verifiedDoc = verifiedDocuments?.[doc.id]
                  const pendingDoc = pendingDocuments?.[doc.id]
                  const isModified = pendingDoc && pendingDoc.fileName !== verifiedDoc?.fileName

                  return (
                    <tr key={doc.id}>
                      <td>
                        <strong>{doc.name}</strong>
                        {doc.required ? (
                          <span style={{ color: '#dc2626', marginLeft: '4px', fontSize: '11px' }}>
                            (Required)
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', marginLeft: '4px', fontSize: '11px' }}>
                            (Optional)
                          </span>
                        )}
                      </td>
                      <td>
                        {verifiedDoc ? (
                          <span className="diff-doc-status-badge diff-doc-verified">
                            📄 {verifiedDoc.fileName} ({verifiedDoc.fileSize})
                          </span>
                        ) : (
                          <span className="diff-doc-none">No verified document</span>
                        )}
                      </td>
                      <td>
                        {pendingDoc ? (
                          <span className="diff-doc-status-badge diff-doc-pending">
                            📄 {pendingDoc.fileName} ({pendingDoc.fileSize})
                          </span>
                        ) : (
                          <span className="diff-doc-none">Unchanged</span>
                        )}
                      </td>
                      <td>
                        {isModified ? (
                          <span className="diff-changed-pill">UPDATED</span>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: '#64748b' }}>Active</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
