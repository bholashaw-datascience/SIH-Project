export default function StudentPortalPageHeader({
  eyebrow = '',
  title = '',
  description = '',
  className = '',
  style = {},
}) {
  return (
    <section className={`sp-page-header ${className}`} style={style}>
      <style>{`
        .sp-page-header {
          background: linear-gradient(135deg, #112233 0%, #193855 100%);
          color: #ffffff;
          padding: clamp(10px, 1.5vh, 16px) clamp(24px, 3vw, 40px);
          border-bottom: 3px solid #b3881e;
          text-align: center;
          flex-shrink: 0;
          width: 100%;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .sp-page-header-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        .sp-page-header-badge {
          display: inline-flex;
          align-items: center;
          background-color: rgba(179, 136, 30, 0.2);
          border: 1px solid rgba(241, 207, 124, 0.4);
          color: #f1cf7c;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 11px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .sp-page-header-title {
          font-size: clamp(20px, 2.3vh, 23px);
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }

        .sp-page-header-subtitle {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.4;
          max-width: 760px;
          margin: 0 auto;
        }
      `}</style>
      <div className="sp-page-header-inner">
        {eyebrow && (
          <div className="sp-page-header-badge">
            <span>{eyebrow}</span>
          </div>
        )}
        {title && <h2 className="sp-page-header-title">{title}</h2>}
        {description && <p className="sp-page-header-subtitle">{description}</p>}
      </div>
    </section>
  )
}
