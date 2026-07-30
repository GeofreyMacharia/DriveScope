"use client"

import { useState } from "react"
import Link from "next/link"
import StatHex from "@/components/StatHex"

const STATS = [
  { label: "Fuel efficiency", value: 88, display: "34 MPG combined" },
  { label: "Running cost",    value: 85, display: "$1,390 a year" },
  { label: "City driving",    value: 78, display: "31 MPG city" },
  { label: "Highway",         value: 92, display: "40 MPG highway" },
  { label: "Cargo space",     value: 45, display: "Fits 3 large suitcases" },
  { label: "Purchase price",  value: 82, display: "$24k to $32k" },
]

const INCLUDES: [string, string][] = [
  ["Small displacement engines", "Typically 1.5 to 2.0 litres. The single biggest factor in fuel efficiency, since smaller engines burn less fuel for the same trip."],
  ["Front wheel drive", "Lighter and simpler than all wheel drive, which means less mechanical drag and lower fuel use."],
  ["Lower purchase price", "Usually the most affordable new car category, keeping both the loan and the running cost manageable."],
  ["Easy to park", "A shorter wheelbase makes city driving and tight parking far simpler than in larger vehicles."],
  ["Strong resale value", "Models like the Civic and Corolla hold value well and carry long reliability records."],
  ["Best economy per dollar", "For buyers whose priority is the lowest running cost, this category delivers the most miles per gallon for the money."],
]

export default function CompactPage() {
  const [activeStat, setActiveStat] = useState<number | null>(null)

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

      {/* HEADER */}
      <section className="wrap" style={{ paddingTop: "3.5rem", paddingBottom: "2rem" }}>
        <p className="eyebrow">Category</p>
        <h1 className="big-title" style={{ marginBottom: "1rem" }}>Compact Cars</h1>
        <div className="hero-rule" style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
          <span className="rule-dot" />
          <span className="rule-line" />
        </div>
        <p className="soft" style={{ fontSize: "1.05rem", maxWidth: "40rem", lineHeight: 1.7 }}>
          Small, efficient, and easy to live with. Compact cars are the most fuel efficient
          starting point for most buyers, built around small engines that keep running costs low
          without giving up everyday practicality.
        </p>
      </section>

      {/* MEDIA GALLERY */}
      <section className="wrap" style={{ paddingBottom: "3rem" }}>
        <div className="media-layout">
          <div className="media-main">
            <video
              className="media-video-el"
              src="/compact/compact-video.mp4"
              autoPlay muted loop playsInline
              poster="/compact/compact-3.jpg"
            />
          </div>
          <div className="media-side">
            {["compact-1", "compact-2", "compact-3", "compact-4"].map((img, n) => (
              <div key={img} className="media-img-wrap">
                <img src={`/compact/${img}.jpg`} alt={`Honda Civic view ${n + 1}`} className="media-img" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAT HEX */}
      <section className="wrap section-bordered" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <p className="eyebrow">At a glance</p>
        <h2 className="big-title" style={{ fontSize: "2rem", marginBottom: "2.5rem" }}>How compact cars perform</h2>
        <div className="hex-layout">
          <div className="hex-chart">
            <StatHex stats={STATS} activeIndex={activeStat} />
          </div>
          <div className="hex-stats">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`hex-stat-row ${activeStat === i ? "active" : ""}`}
                onMouseEnter={() => setActiveStat(i)}
                onMouseLeave={() => setActiveStat(null)}
              >
                <span className="hex-index">{String(i + 1).padStart(2, "0")}</span>
                <div className="hex-stat-body">
                  <p className="hex-stat-label">{s.label}</p>
                  <p className="hex-stat-value">{s.display}</p>
                </div>
                <span className="hex-score">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT THEY INCLUDE */}
      <section className="wrap section-bordered" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <p className="eyebrow">The details</p>
        <h2 className="big-title" style={{ fontSize: "2rem", marginBottom: "2rem" }}>What compact cars include</h2>
        <div className="feature-grid">
          {INCLUDES.map(([title, body]) => (
            <div key={title} className="feature-item">
              <h3 className="serif" style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{title}</h3>
              <p className="soft" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="wrap section-bordered" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <p className="eyebrow">Fit</p>
        <h2 className="big-title" style={{ fontSize: "2rem", marginBottom: "1.25rem" }}>Who a compact car is for</h2>
        <p className="soft" style={{ fontSize: "1rem", maxWidth: "42rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          If you are a first time buyer, a city commuter, or anyone whose main priority is keeping
          fuel and ownership costs as low as possible, a compact car is almost always the smartest
          financial starting point. It asks the least of your budget every month while still
          covering daily life comfortably.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {["First time buyers", "City drivers", "Budget conscious", "Low annual mileage", "Singles and couples"].map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: "5rem" }}>
        <Link href="/#vehicles" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          All categories
        </Link>
      </section>

      <a href="#top" className="back-to-top" aria-label="Back to top">↑</a>
    </div>
  )
}
