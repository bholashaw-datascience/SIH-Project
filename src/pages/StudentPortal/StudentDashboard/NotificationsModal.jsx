import { useState } from 'react'

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) {
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'approvals'

  if (!isOpen) return null

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'approvals') return n.type === 'approval' || n.type === 'success'
    return true
  })

  return (
    <div className="notif-modal-overlay" onClick={onClose}>
      <style>{`
        .notif-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(12, 24, 36, 0.6);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          z-index: 1250;
          padding: 70px 24px 20px 20px;
          box-sizing: border-box;
          animation: notifFadeIn 0.15s ease-out;
        }

        .notif-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #ded9cc;
          box-shadow: 0 16px 36px rgba(15, 29, 47, 0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 80vh;
          box-sizing: border-box;
          animation: notifSlideDown 0.18s ease-out;
        }

        .notif-header {
          padding: 16px 20px;
          background-color: #112233;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .notif-header-title-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notif-header-title {
          font-size: 15px;
          font-weight: 700;
          margin: 0;
        }

        .notif-count-pill {
          background-color: #b3881e;
          color: #ffffff;
          font-size: 10.5px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
        }

        .notif-close-btn {
          background: transparent;
          border: none;
          color: #cbd5e1;
          font-size: 16px;
          cursor: pointer;
          padding: 2px 6px;
          line-height: 1;
        }

        .notif-close-btn:hover {
          color: #ffffff;
        }

        .notif-controls-bar {
          background-color: #faf7f0;
          border-bottom: 1px solid #ede8de;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .notif-filter-tabs {
          display: flex;
          gap: 4px;
        }

        .notif-filter-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #64748b;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .notif-filter-btn.active {
          background: #ffffff;
          border-color: #ded9cc;
          color: #0f1d2f;
          font-weight: 700;
        }

        .notif-quick-actions {
          display: flex;
          gap: 10px;
        }

        .notif-link-btn {
          background: transparent;
          border: none;
          color: #1b525c;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .notif-link-btn:hover {
          color: #112233;
        }

        .notif-list-body {
          padding: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: #fbfbf9;
        }

        .notif-empty {
          padding: 36px 20px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        .notif-item {
          background: #ffffff;
          border: 1px solid #ede8de;
          border-radius: 6px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: border-color 0.15s ease;
          position: relative;
        }

        .notif-item.is-unread {
          border-left: 3.5px solid #b3881e;
          background-color: #fffefb;
        }

        .notif-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .notif-source-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          text-transform: uppercase;
        }

        .badge-principal {
          background-color: #edf5f5;
          color: #1b525c;
          border: 1px solid #cfe0e2;
        }

        .badge-admin {
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
        }

        .notif-time {
          font-size: 10.5px;
          color: #94a3b8;
        }

        .notif-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 2px 0 0;
        }

        .notif-desc {
          font-size: 12px;
          color: #475569;
          line-height: 1.4;
          margin: 0;
        }

        .notif-reason-box {
          margin-top: 4px;
          background-color: #fef2f2;
          border-left: 3px solid #ef4444;
          padding: 6px 10px;
          font-size: 11.5px;
          color: #991b1b;
          border-radius: 3px;
        }

        @keyframes notifFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes notifSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .notif-modal-overlay {
            padding: 16px;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      <div className="notif-card" onClick={(e) => e.stopPropagation()}>
        <div className="notif-header">
          <div className="notif-header-title-box">
            <span style={{ fontSize: '16px' }}>🔔</span>
            <h4 className="notif-header-title">Notifications & Verification Events</h4>
            <span className="notif-count-pill">{notifications.filter((n) => !n.read).length}</span>
          </div>
          <button type="button" className="notif-close-btn" onClick={onClose} aria-label="Close notifications">
            ✕
          </button>
        </div>

        <div className="notif-controls-bar">
          <div className="notif-filter-tabs">
            <button
              type="button"
              className={`notif-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`notif-filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              type="button"
              className={`notif-filter-btn ${filter === 'approvals' ? 'active' : ''}`}
              onClick={() => setFilter('approvals')}
            >
              Approvals
            </button>
          </div>

          <div className="notif-quick-actions">
            <button type="button" className="notif-link-btn" onClick={onMarkAllRead}>
              Mark read
            </button>
            <button type="button" className="notif-link-btn" onClick={onClearAll}>
              Clear
            </button>
          </div>
        </div>

        <div className="notif-list-body">
          {filtered.length === 0 ? (
            <div className="notif-empty">
              <span>No notifications in this category.</span>
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className={`notif-item ${!item.read ? 'is-unread' : ''}`}>
                <div className="notif-item-top">
                  <span className={`notif-source-badge ${item.source === 'Principal' ? 'badge-principal' : 'badge-admin'}`}>
                    {item.source || 'Institutional Authority'}
                  </span>
                  <span className="notif-time">{item.time}</span>
                </div>
                <h5 className="notif-title">{item.title}</h5>
                <p className="notif-desc">{item.message}</p>
                {item.reason && (
                  <div className="notif-reason-box">
                    <strong>Official Remark:</strong> {item.reason}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
