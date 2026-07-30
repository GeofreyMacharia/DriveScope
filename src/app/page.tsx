"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import type { FormEvent } from "react"
import { getFeatured, runQuiz, compareVehicles, runFinance, getGasPrice } from "@/lib/api"
import type {
  Vehicle, QuizAnswers, QuizResult, CompareResult,
  EfficiencyTier, VehicleOption,
} from "@/lib/types"
import type { FinanceResult } from "@/lib/types"
import CarIllustration from "@/components/CarIllustration"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts"

function categoryRoute(category: string): string | null {
  if (category === "Best Compact") return "/vehicle/compact"
  if (category === "Best Midsize") return "/vehicle/midsize"
  if (category === "Best SUV") return "/vehicle/suv"
  if (category === "Best Truck") return "/vehicle/truck"
  if (category === "Best Hybrid") return "/vehicle/hybrid"
  return null
}

function bgForCategory(category: string): string {
  if (category === "Best Compact") return "bg-civic"
  if (category === "Best Midsize") return "bg-camry"
  if (category === "Best SUV")     return "bg-rav4"
  if (category === "Best Truck")   return "bg-mav"
  if (category === "Best Hybrid")  return "bg-prius"
  return "bg-civic"
}

function TierBadge({ tier }: { tier: EfficiencyTier }) {
  const cls = tier === "HIGH" ? "tier-high" : tier === "MEDIUM" ? "tier-medium" : "tier-low"
  return <span className={`tier-badge ${cls}`}>{tier}</span>
}

interface VehicleCardProps {
  vehicle: Vehicle
  isExpanded: boolean
  onToggle: () => void
}
function VehicleCard({ vehicle, isExpanded, onToggle }: VehicleCardProps) {
  const [imgError, setImgError] = useState(false)
  const route = categoryRoute(vehicle.category)
  return (
    <div className="product-card">
      <div className={`car-canvas photo-wrap ${bgForCategory(vehicle.category)}`}>
        {route ? (
          <Link href={route} className="canvas-link" aria-label={`View ${vehicle.category}`}>
            {(imgError || !vehicle.image_url) ? (
              <CarIllustration category={vehicle.category} />
            ) : (
              <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="car-photo" onError={() => setImgError(true)} loading="lazy" />
            )}
          </Link>
        ) : (
          (imgError || !vehicle.image_url) ? (
            <CarIllustration category={vehicle.category} />
          ) : (
            <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="car-photo" onError={() => setImgError(true)} loading="lazy" />
          )
        )}
        <span className="canvas-tag">{vehicle.category}</span>
        <span className="canvas-tier"><TierBadge tier={vehicle.tier} /></span>
      </div>
      <div className="card-pad">
        <h3 className="card-title">{vehicle.make} {vehicle.model}</h3>
        <p className="card-sub">{vehicle.year} · {vehicle.price_range}</p>

        <div className="metric-row">
          <div>
            <p className="metric-label">MPG{vehicle.approximate ? " ~" : ""}</p>
            <p className="metric-value">{vehicle.predicted_mpg}</p>
            <p className="range-text">{vehicle.mpg_low}–{vehicle.mpg_high} range</p>
          </div>
          <div>
            <p className="metric-label">5-Year</p>
            <p className="metric-value">${(vehicle.five_year_cost / 1000).toFixed(1)}k</p>
          </div>
        </div>

        <div className="mini-grid">
          <div><span className="lbl">Monthly</span><span className="val">${vehicle.monthly_cost.toLocaleString()}</span></div>
          <div><span className="lbl">Annual</span><span className="val">${vehicle.annual_cost.toLocaleString()}</span></div>
        </div>

        <div className="card-actions">
          {route ? (
            <Link href={route} className="btn-ghost" style={{ textAlign: "center", textDecoration: "none" }}>
              Know more
            </Link>
          ) : (
            <button onClick={onToggle} className="btn-ghost">
              {isExpanded ? "Hide" : "Know more"}
            </button>
          )}
          <a href={vehicle.buy_url} target="_blank" rel="noopener noreferrer" className="buy-btn">
            Find to buy
          </a>
        </div>

        {isExpanded && (
          <div className="animate-fade-up" style={{ marginTop: "0.85rem", paddingTop: "0.85rem", borderTop: "1px solid var(--line)", fontSize: "0.75rem" }}>
            <p className="soft" style={{ lineHeight: 1.6, marginBottom: "0.85rem" }}>{vehicle.why}</p>
            <p className="metric-label" style={{ marginBottom: "0.5rem" }}>Best for</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.85rem" }}>
              {vehicle.best_for.map((b) => <span key={b} className="chip">{b}</span>)}
            </div>
            <div style={{ fontSize: "0.7rem", lineHeight: 1.8 }}>
              <div><span className="muted">Engine: </span>{vehicle.displacement_liters}L {vehicle.cylinders}-cyl</div>
              <div><span className="muted">Drive: </span>{vehicle.drivetrain}</div>
              <div><span className="muted">Fuel: </span>{vehicle.fuel_type}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [gasPrice, setGasPrice] = useState<number>(4.0)
  const [annualMiles, setAnnualMiles] = useState<number>(13500)
  const [featured, setFeatured] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ down: false, startX: 0, scrollLeft: 0 })

  function onRowDown(e: React.PointerEvent) {
    const el = rowRef.current
    if (!el) return
    dragState.current = { down: true, startX: e.clientX, scrollLeft: el.scrollLeft }
    el.classList.add("dragging")
  }
  function onRowMove(e: React.PointerEvent) {
    const el = rowRef.current
    if (!el || !dragState.current.down) return
    const dx = e.clientX - dragState.current.startX
    el.scrollLeft = dragState.current.scrollLeft - dx
  }
  function onRowUp() {
    const el = rowRef.current
    dragState.current.down = false
    if (el) el.classList.remove("dragging")
  }
  function scrollRow(dir: number) {
    const el = rowRef.current
    if (!el) return
    el.scrollBy({ left: dir * 320, behavior: "smooth" })
  }

  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({
    budget: "Under $25,000",
    need_space: "Just me or one other person",
    drive_type: "Mix of both",
    priority: "Lowest possible fuel cost",
  })
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [quizLoading, setQuizLoading] = useState<boolean>(false)

  // Optional financing
  const [showFinance, setShowFinance] = useState<boolean>(false)
  const [price, setPrice] = useState<number>(28000)
  const [downPayment, setDownPayment] = useState<number>(3000)
  const [termMonths, setTermMonths] = useState<number>(60)
  const [apr, setApr] = useState<number>(7.5)
  const [finance, setFinance] = useState<FinanceResult | null>(null)
  const [financeLoading, setFinanceLoading] = useState<boolean>(false)

  async function handleFinance(): Promise<void> {
    setFinanceLoading(true)
    setFinance(null)
    try {
      const result = await runFinance({ price, down_payment: downPayment, term_months: termMonths, apr })
      setFinance(result)
    } catch { console.error("Finance failed") }
    setFinanceLoading(false)
  }

  const [vehicleA, setVehicleA] = useState<string>("civic")
  const [vehicleB, setVehicleB] = useState<string>("camry")
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null)
  const [compareLoading, setCompareLoading] = useState<boolean>(false)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  useEffect(() => {
    getGasPrice().then((r) => setGasPrice(r.us_average)).catch(() => {})
  }, [])

  useEffect(() => {
    void loadFeatured()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasPrice, annualMiles])

  async function loadFeatured(): Promise<void> {
    setLoading(true)
    try {
      const data = await getFeatured(gasPrice, annualMiles)
      setFeatured(data)
    } catch { console.error("Backend not running") }
    setLoading(false)
  }

  async function handleQuiz(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setQuizLoading(true)
    setQuizResult(null)
    try {
      const result = await runQuiz({ ...quizAnswers, gas_price: gasPrice, annual_miles: annualMiles })
      setQuizResult(result)
    } catch { console.error("Quiz failed") }
    setQuizLoading(false)
  }

  async function handleCompare(): Promise<void> {
    if (vehicleA === vehicleB) return
    setCompareLoading(true)
    setCompareResult(null)
    try {
      const result = await compareVehicles(vehicleA, vehicleB, gasPrice, annualMiles)
      setCompareResult(result)
    } catch { console.error("Compare failed") }
    setCompareLoading(false)
  }

  const vehicleOptions: VehicleOption[] = [
    { id: "civic",    label: "Honda Civic, Compact" },
    { id: "camry",    label: "Toyota Camry, Midsize" },
    { id: "rav4",     label: "Toyota RAV4, SUV" },
    { id: "maverick", label: "Ford Maverick, Truck" },
    { id: "prius",    label: "Toyota Prius, Hybrid" },
  ]

  const quizQuestions: { key: keyof QuizAnswers; label: string; options: string[] }[] = [
    { key: "budget",     label: "Your budget",     options: ["Under $25,000", "$25,000 to $35,000", "$35,000 to $50,000", "Over $50,000"] },
    { key: "need_space", label: "Space you need",  options: ["Just me or one other person", "Small family (3 to 4 people)", "Large family or cargo hauling"] },
    { key: "drive_type", label: "Type of driving", options: ["City driving, lots of stops and starts", "Highway commuting, mostly steady speeds", "Mix of both"] },
    { key: "priority",   label: "What matters most", options: ["Lowest possible fuel cost", "Balance of efficiency and comfort", "Space and practicality"] },
  ]

  return (
    <div id="top" style={{ minHeight: "100vh", width: "100%", overflowX: "hidden" }}>

      {/* NAV */}
      <nav className="nav-bar">
        <div className="wrap nav-inner">
          <div className="brand-link">
            <span className="brand-mark" aria-hidden>◈</span>
            <span className="serif" style={{ fontSize: "1.5rem" }}>DriveScope</span>
          </div>
          <div className="nav-links">
            <a href="#vehicles">Vehicles</a>
            <a href="#find">Find My Car</a>
            <a href="#compare">Compare</a>
          </div>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme" className="theme-switch">
            <span className={`icon-slot ${theme === "light" ? "active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            </span>
            <span className={`icon-slot ${theme === "dark" ? "active" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            </span>
            <span className="switch-pill" />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-full">
        <video
          className={`hero-full-video ${theme === "dark" ? "video-on" : "video-off"}`}
          src="/hero-car.mp4"
          autoPlay muted loop playsInline
        />
        <video
          className={`hero-full-video ${theme === "light" ? "video-on" : "video-off"}`}
          src="/morning-car.mp4"
          autoPlay muted loop playsInline
        />
        <div className="hero-full-overlay" />
        <div className="hero-full-content wrap animate-fade-up">
          <h1 className="hero-headline">
            Find the car<br />
            that <span className="hero-italic">goes furthest</span><br />
            for your money.
          </h1>
          <div className="hero-rule">
            <span className="rule-dot" />
            <span className="rule-line" />
          </div>

        </div>
      </section>

      {/* FEATURED */}
      <section id="vehicles" className="section section-bordered">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="big-title">Five vehicles,<br /><span className="hero-italic">five categories.</span></h2>
            </div>
          </div>

          {loading ? (
            <div className="loading-box">Loading vehicle data...</div>
          ) : featured.length === 0 ? (
            <div className="error-box">
              <p className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Backend not connected</p>
              <p className="muted" style={{ fontSize: "0.875rem" }}>Start the Python backend with <code>uvicorn main:app --reload --port 8000</code></p>
            </div>
          ) : (
            <div className="row-shell">
              <button className="row-arrow row-arrow-left" onClick={() => scrollRow(-1)} aria-label="Scroll left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
              <div className="vehicle-row" ref={rowRef} onPointerDown={onRowDown} onPointerMove={onRowMove} onPointerUp={onRowUp} onPointerLeave={onRowUp}>
              {featured.map((v) => (
                <VehicleCard key={v.id} vehicle={v} isExpanded={expandedId === v.id} onToggle={() => setExpandedId(expandedId === v.id ? null : v.id)} />
              ))}
              </div>
              <button className="row-arrow row-arrow-right" onClick={() => scrollRow(1)} aria-label="Scroll right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
          )}
        </div>
      </section>

      {/* FIND MY CAR */}
      <section id="find" className="section section-bordered">
        <div className="wrap">
          <div style={{ marginBottom: "2rem" }}>
            <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Find your match</p>
            <h2 className="big-title" style={{ marginBottom: "0.75rem" }}>Four questions. <span className="hero-italic">One answer.</span></h2>
            <p className="soft" style={{ fontSize: "1rem", maxWidth: "34rem" }}>Tell us how you drive and what you need. We will find the most efficient vehicle for your life.</p>
          </div>

          <div className={showFinance && quizResult ? "find-grid-three" : "find-grid"}>

            {/* COLUMN 1: FORM */}
            <form onSubmit={handleQuiz}>
              <div className="quiz-inputs">
                <div className="quiz-field">
                  <label>Gas price ($/gal)</label>
                  <input type="number" value={gasPrice} onChange={(e) => setGasPrice(parseFloat(e.target.value) || 3.5)} step="0.10" min="1" max="10" className="pill-input" />
                  <span className="field-hint">US average, auto-filled</span>
                </div>
                <div className="quiz-field">
                  <label>Annual miles</label>
                  <input type="number" value={annualMiles} onChange={(e) => setAnnualMiles(parseInt(e.target.value) || 13500)} step="500" min="1000" max="60000" className="pill-input" />
                  <span className="field-hint">How far you drive a year</span>
                </div>
              </div>
              {quizQuestions.map((q) => (
                <div className="field" key={q.key}>
                  <label>{q.label}</label>
                  <select value={quizAnswers[q.key]} onChange={(e) => setQuizAnswers((a) => ({ ...a, [q.key]: e.target.value }))} className="pill-input">
                    {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button type="submit" disabled={quizLoading} className="btn-primary" style={{ marginTop: "0.5rem" }}>
                {quizLoading ? "Finding your match..." : "Find my match →"}
              </button>
            </form>

            {/* COLUMN 2: MATCH RESULT */}
            <div>
              {quizLoading ? (
                <div className="result-empty">
                  <div className="spinner" />
                  <p className="muted" style={{ fontSize: "0.875rem", marginTop: "1rem" }}>Finding your best match...</p>
                </div>
              ) : quizResult ? (
                <div key={`${quizResult.label}-${quizResult.predicted_mpg}`} className="product-card animate-fade-up">
                  <div className="card-pad-lg">
                    <p className="eyebrow">Your match</p>
                    <h3 className="serif" style={{ fontSize: "2rem", lineHeight: 1.1, marginBottom: "0.5rem" }}>{quizResult.label}</h3>
                    <p className="muted" style={{ fontSize: "0.875rem", marginBottom: "1.25rem" }}>2024 model year</p>
                    <div className="result-metrics">
                      <div>
                        <p className="metric-label">MPG{quizResult.approximate ? " ~" : ""}</p>
                        <p className="serif" style={{ fontSize: "1.75rem" }}>{quizResult.predicted_mpg}</p>
                        <p className="range-text">{quizResult.mpg_low}–{quizResult.mpg_high} range</p>
                      </div>
                      <div>
                        <p className="metric-label">Annual cost</p>
                        <p className="serif" style={{ fontSize: "1.75rem" }}>${quizResult.annual_cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="metric-label">Monthly</p>
                        <p className="serif" style={{ fontSize: "1.5rem" }}>${quizResult.monthly_cost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="metric-label">5-Year</p>
                        <p className="serif" style={{ fontSize: "1.5rem" }}>${(quizResult.five_year_cost / 1000).toFixed(1)}k</p>
                      </div>
                    </div>
                    <p className="soft" style={{ fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                      Over five years you save <strong style={{ color: "var(--ink)" }}>${quizResult.five_year_savings.toLocaleString()}</strong> compared to the average US vehicle.
                    </p>
                    {quizResult.approximate && (
                      <p className="disclaimer-note">
                        High efficiency estimate. The model cannot fully capture electric motor gains, so treat this as approximate.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => { setShowFinance((s) => !s); setFinance(null); }}
                      className="btn-ghost"
                      style={{ width: "auto", padding: "0.5rem 1rem", marginTop: "1.25rem" }}
                    >
                      {showFinance ? "Hide financing ×" : "Add financing →"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="result-empty">
                  <p className="serif muted" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your match</p>
                  <p className="muted" style={{ fontSize: "0.875rem" }}>will appear here.</p>
                </div>
              )}
            </div>

            {/* COLUMN 3: FINANCING, only renders when showFinance is true */}
            {showFinance && quizResult && (
              <div className="product-card fin-reveal">
                <div className="card-pad-lg">
                  <p className="eyebrow">Financing</p>
                  <h3 className="serif" style={{ fontSize: "1.35rem", marginBottom: "1rem" }}>Monthly payment estimate</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div>
                      <label className="metric-label" style={{ display: "block", marginBottom: "0.35rem" }}>Vehicle price</label>
                      <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} className="pill-input" />
                    </div>
                    <div>
                      <label className="metric-label" style={{ display: "block", marginBottom: "0.35rem" }}>Down payment</label>
                      <input type="number" value={downPayment} onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)} className="pill-input" />
                    </div>
                    <div>
                      <label className="metric-label" style={{ display: "block", marginBottom: "0.35rem" }}>Term (months)</label>
                      <input type="number" value={termMonths} onChange={(e) => setTermMonths(parseInt(e.target.value) || 60)} className="pill-input" />
                    </div>
                    <div>
                      <label className="metric-label" style={{ display: "block", marginBottom: "0.35rem" }}>APR (%)</label>
                      <input type="number" step="0.1" value={apr} onChange={(e) => setApr(parseFloat(e.target.value) || 0)} className="pill-input" />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    <button type="button" onClick={handleFinance} disabled={financeLoading} className="btn-primary" style={{ flex: 1 }}>
                      {financeLoading ? "Calculating..." : "Calculate →"}
                    </button>
                    <button type="button" onClick={() => { setFinance(null); setPrice(28000); setDownPayment(3000); setTermMonths(60); setApr(7.5); }} className="btn-ghost" style={{ width: "auto", padding: "0.6rem 1rem" }}>
                      Clear
                    </button>
                  </div>
                  {finance && (
                    <div className="animate-fade-up" style={{ padding: "1rem", background: "var(--paper-soft)", borderRadius: "12px", border: "1px solid var(--line)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div><p className="metric-label">Loan / mo</p><p className="serif" style={{ fontSize: "1.4rem" }}>${finance.monthly_payment.toLocaleString()}</p></div>
                        <div><p className="metric-label">Fuel + loan / mo</p><p className="serif" style={{ fontSize: "1.4rem" }}>${(finance.monthly_payment + quizResult.monthly_cost).toLocaleString()}</p></div>
                        <div><p className="metric-label">Total interest</p><p className="serif" style={{ fontSize: "1.2rem" }}>${finance.total_interest.toLocaleString()}</p></div>
                        <div><p className="metric-label">Total paid</p><p className="serif" style={{ fontSize: "1.2rem" }}>${finance.total_paid.toLocaleString()}</p></div>
                      </div>
                      <p className="soft" style={{ fontSize: "0.72rem", lineHeight: 1.5 }}>
                        Fuel plus loan. Depreciation, insurance and maintenance not yet included.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare" className="section section-bordered">
        <div className="wrap">
          <div style={{ marginBottom: "4rem" }}>
            <p className="eyebrow">Compare cars</p>
            <h2 className="big-title">See what the difference<br /><span className="hero-italic">actually costs.</span></h2>
          </div>

          <div className="compare-controls">
            <div>
              <label className="input-label" style={{ display: "block", marginBottom: "0.6rem" }}>First vehicle</label>
              <select value={vehicleA} onChange={(e) => setVehicleA(e.target.value)} className="pill-input">
                {vehicleOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label" style={{ display: "block", marginBottom: "0.6rem" }}>Second vehicle</label>
              <select value={vehicleB} onChange={(e) => setVehicleB(e.target.value)} className="pill-input">
                {vehicleOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <button onClick={handleCompare} disabled={compareLoading || vehicleA === vehicleB} className="btn-primary">
              {compareLoading ? "Comparing..." : "Compare →"}
            </button>
          </div>

          {compareResult && (
            <div key={`${compareResult.vehicle_a.id}-${compareResult.vehicle_b.id}`} className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="compare-cards">
                {[
                  { v: compareResult.vehicle_a, isWinner: compareResult.cheaper === compareResult.vehicle_a.id },
                  { v: compareResult.vehicle_b, isWinner: compareResult.cheaper === compareResult.vehicle_b.id },
                ].map(({ v, isWinner }) => (
                  <div key={v.id} className={`product-card ${isWinner ? "is-winner" : ""}`}>
                    <div className={`car-canvas photo-wrap ${bgForCategory(v.category)}`}>
                      {v.image_url ? (
                        <img src={v.image_url} alt={`${v.make} ${v.model}`} className="car-photo" loading="lazy" />
                      ) : (
                        <CarIllustration category={v.category} />
                      )}
                      {isWinner && <div className="winner-tag">Better choice</div>}
                    </div>
                    <div className="card-pad">
                      <h4 className="serif" style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{v.year} {v.make} {v.model}</h4>
                      <p className="muted" style={{ fontSize: "0.75rem", marginBottom: "1.25rem" }}>{v.category}</p>
                      <div className="compare-metrics">
                        <div><p className="metric-label">MPG</p><p className="serif" style={{ fontSize: "1.5rem" }}>{v.predicted_mpg}</p></div>
                        <div><p className="metric-label">Annual</p><p className="serif" style={{ fontSize: "1.5rem" }}>${v.annual_cost.toLocaleString()}</p></div>
                        <div><p className="metric-label">Monthly</p><p className="serif" style={{ fontSize: "1.25rem" }}>${v.monthly_cost.toLocaleString()}</p></div>
                        <div><p className="metric-label">5-Year</p><p className="serif" style={{ fontSize: "1.25rem" }}>${(v.five_year_cost / 1000).toFixed(1)}k</p></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="product-card">
                <div className="card-pad-lg">
                  <p className="eyebrow">Bottom line</p>
                  <p className="serif" style={{ fontSize: "1.875rem", lineHeight: 1.3 }}>
                    Over five years the{" "}
                    <span style={{ fontStyle: "italic", color: "var(--accent)" }}>
                      {compareResult.cheaper === compareResult.vehicle_a.id
                        ? `${compareResult.vehicle_a.make} ${compareResult.vehicle_a.model}`
                        : `${compareResult.vehicle_b.make} ${compareResult.vehicle_b.model}`}
                    </span>{" "}
                    saves you ${compareResult.five_year_savings.toLocaleString()} in fuel costs.
                  </p>
                </div>
              </div>

              <div className="product-card">
                <div className="card-pad-lg">
                  <p className="eyebrow">Cumulative fuel cost</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[1,2,3,4,5].map((y) => ({
                      year: `Year ${y}`,
                      [`${compareResult.vehicle_a.make} ${compareResult.vehicle_a.model}`]: Math.round(compareResult.vehicle_a.annual_cost * y),
                      [`${compareResult.vehicle_b.make} ${compareResult.vehicle_b.model}`]: Math.round(compareResult.vehicle_b.annual_cost * y),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                      <XAxis dataKey="year" tick={{ fill: "var(--ink-muted)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "var(--ink-muted)", fontSize: 11 }} tickFormatter={(v: number) => `$${(v/1000).toFixed(1)}k`} />
                      <Tooltip contentStyle={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "12px" }} formatter={(value: number | string) => [`$${Number(value).toLocaleString()}`, ""]} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line dataKey={`${compareResult.vehicle_a.make} ${compareResult.vehicle_a.model}`} stroke="var(--accent)" strokeWidth={2} dot={{ r: 4 }} />
                      <Line dataKey={`${compareResult.vehicle_b.make} ${compareResult.vehicle_b.model}`} stroke="var(--ink-muted)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BACK TO TOP */}
      <a href="#top" className="back-to-top" aria-label="Back to top">↑</a>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap">
          <p className="serif" style={{ fontSize: "2rem", marginBottom: "1rem" }}>DriveScope</p>
          <p className="muted" style={{ fontSize: "0.775rem", marginBottom: "0.5rem" }}>· Vehicle Intelligence Platform · Data Driven · EPA Trained Configured ·</p>
          </div>
      </footer>
    </div>
  )
}
