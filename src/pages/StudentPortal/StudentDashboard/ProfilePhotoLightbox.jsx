export default function ProfilePhotoLightbox({ isOpen, imageSrc, studentName, onClose }) {
  if (!isOpen) return null

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <style>{`
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(12, 24, 36, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1300;
          padding: 20px;
          box-sizing: border-box;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          animation: lightboxFadeIn 0.16s ease-out;
        }

        .lightbox-card {
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #ded9cc;
          box-shadow: 0 24px 48px rgba(15, 29, 47, 0.4);
          overflow: hidden;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: lightboxSlideUp 0.18s ease-out;
        }

        .lightbox-header {
          padding: 14px 18px;
          border-bottom: 1px solid #ede8de;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #faf7f0;
        }

        .lightbox-header-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lightbox-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b3881e;
        }

        .lightbox-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f1d2f;
          margin: 0;
        }

        .lightbox-close-btn {
          width: 28px;
          height: 28px;
          font-size: 14px;
          border: 1px solid #ded8cb;
          border-radius: 4px;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          background: #ffffff;
        }

        .lightbox-close-btn:hover {
          background-color: #f1f5f9;
          color: #0f1d2f;
          border-color: #94a3b8;
        }

        .lightbox-body {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #0f1d2f;
        }

        .lightbox-frame {
          width: 240px;
          height: 240px;
          border-radius: 50%;
          border: 4px solid #b3881e;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          background-color: #faf7f0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .lightbox-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .lightbox-placeholder {
          font-size: 72px;
          font-weight: 700;
          color: #1b525c;
        }

        .lightbox-footer {
          padding: 12px 18px;
          background-color: #faf7f0;
          border-top: 1px solid #ede8de;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #64748b;
        }

        .lightbox-btn-done {
          background-color: #112233;
          color: #ffffff;
          border: none;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .lightbox-btn-done:hover {
          background-color: #1b525c;
        }

        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes lightboxSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-header">
          <div className="lightbox-header-info">
            <span className="lightbox-badge">VERIFIED PROFILE PHOTO</span>
            <h4 className="lightbox-title">{studentName || 'Student Profile'}</h4>
          </div>
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={onClose}
            aria-label="Close photo preview"
          >
            ✕
          </button>
        </div>

        <div className="lightbox-body">
          <div className="lightbox-frame">
            {imageSrc ? (
              <img src={imageSrc} alt={studentName || 'Student'} className="lightbox-img" />
            ) : (
              <span className="lightbox-placeholder">
                {studentName?.charAt(0) || 'S'}
              </span>
            )}
          </div>
        </div>

        <div className="lightbox-footer">
          <span>View-only institutional record</span>
          <button type="button" className="lightbox-btn-done" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
