// ════════════════════════════════════════════════════════════════
// DriveScope API Client
// Typed wrappers around the FastAPI backend endpoints.
// ════════════════════════════════════════════════════════════════

import type {
  Vehicle,
  QuizRequest,
  QuizResult,
  CompareResult,
  GasPriceResult,
  FinanceRequest,
  FinanceResult,
} from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// GET /featured, returns the five featured vehicles with predictions
export async function getFeatured(
  gasPrice: number = 4.0,
  annualMiles: number = 13500
): Promise<Vehicle[]> {
  const res = await fetch(
    `${API_BASE}/featured?gas_price=${gasPrice}&annual_miles=${annualMiles}`,
    { cache: "no-store" }
  )
  if (!res.ok) {
    throw new Error(`Failed to fetch featured vehicles: ${res.status}`)
  }
  return res.json() as Promise<Vehicle[]>
}

// POST /quiz, returns the best matching vehicle for the buyer profile
export async function runQuiz(data: QuizRequest): Promise<QuizResult> {
  const res = await fetch(`${API_BASE}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to run quiz: ${res.status}`)
  }
  return res.json() as Promise<QuizResult>
}

// POST /compare, returns a side by side comparison of two vehicles
export async function compareVehicles(
  vehicleAId: string,
  vehicleBId: string,
  gasPrice: number,
  annualMiles: number
): Promise<CompareResult> {
  const res = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vehicle_a_id: vehicleAId,
      vehicle_b_id: vehicleBId,
      gas_price: gasPrice,
      annual_miles: annualMiles,
    }),
  })
  if (!res.ok) {
    throw new Error(`Failed to compare vehicles: ${res.status}`)
  }
  return res.json() as Promise<CompareResult>
}

// POST /finance, loan math (monthly payment, total interest)
export async function runFinance(data: FinanceRequest): Promise<FinanceResult> {
  const res = await fetch(`${API_BASE}/finance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(`Failed to calculate financing: ${res.status}`)
  }
  return res.json() as Promise<FinanceResult>
}

// GET /gas-price, current US average, used to auto-fill the gas price
export async function getGasPrice(): Promise<GasPriceResult> {
  const res = await fetch(`${API_BASE}/gas-price`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch gas price: ${res.status}`)
  return res.json() as Promise<GasPriceResult>
}
