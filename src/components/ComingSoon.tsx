"use client"

import Link from "next/link"

interface ComingSoonProps {
  category: string
  blurb: string
}

export default function ComingSoon({ category, blurb }: ComingSoonProps) {
  return (
    <div id="top" style={{ minHeight: "100vh" }}>
      <nav className="nav-bar">
        <div className="wrap nav-inner">
          <Link href="/" className="brand-link">
            <span className="brand-mark" aria-hidden>◈</span>
            <span className="serif" style={{ fontSize: "1.5rem" }}>DriveScope</span>
          </Link>
          <Link href="/#vehicles" className="back-btn" aria-label="Back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </Link>
        </div>
      </nav>

      <section className="wip-shell">
        <div className="wip-inner">
          <div className="wip-badge">Work in progress</div>

          <div className="wip-icon">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>

          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>{category}</p>
          <h1 className="big-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", marginBottom: "1rem" }}>
            This page is <span className="hero-italic">coming soon.</span>
          </h1>
          <p className="soft" style={{ fontSize: "1.05rem", maxWidth: "34rem", lineHeight: 1.7, margin: "0 auto 2rem" }}>
            {blurb}
          </p>

          <div className="wip-bar"><span className="wip-fill" /></div>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "0.75rem" }}>
            The Compact Cars page is live now. The rest are on the way.
          </p>

          <div style={{ marginTop: "2.5rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/vehicle/compact" className="btn-primary" style={{ textDecoration: "none" }}>
              See the Compact page
            </Link>
            <Link href="/#vehicles" className="btn-ghost" style={{ width: "auto", padding: "0.85rem 1.5rem", textDecoration: "none" }}>
              Back to categories
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
