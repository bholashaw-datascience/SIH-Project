export default function PortalFooter({ className = '', style = {} }) {
  return (
    <footer className={`portal-footer ${className}`} style={style}>
      <style>{`
        .portal-footer {
          margin-top: auto;
          background: #0f1d2f;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 28px;
          color: #94a3b8;
          font-size: 13px;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          z-index: 10;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .portal-footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .portal-footer-brand {
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.02em;
        }

        .portal-footer-attribution {
          color: #e2e8f0;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        @media (max-width: 600px) {
          .portal-footer {
            padding: 12px 18px;
          }
          .portal-footer-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
        }
      `}</style>
      <div className="portal-footer-inner">
        <span className="portal-footer-brand">IAS Collaboration Portal</span>
        <span className="portal-footer-attribution">Built by Team UDAAN</span>
      </div>
    </footer>
  )
}
