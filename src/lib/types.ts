// ════════════════════════════════════════════════════════════════
// DriveScope Type Definitions
// These interfaces define the exact shape of data exchanged between
// the Next.js frontend and the FastAPI Python backend.
// ════════════════════════════════════════════════════════════════

// Efficiency tier returned by the model
export type EfficiencyTier = "HIGH" | "MEDIUM" | "LOW"

// A prediction result returned by the backend for any vehicle.
// Matches the dict returned by predict() and calculate_costs() in main.py
export interface Prediction {
  predicted_mpg: number
  mpg_low: number
  mpg_high: number
  approximate: boolean
  annual_cost: number
  monthly_cost: number
  five_year_cost: number
  cost_per_mile: number
  tier: EfficiencyTier
}

// A featured vehicle. Combines the static vehicle data from the
// FEATURED list in main.py with the Prediction fields merged in
// by the /featured endpoint.
export interface Vehicle extends Prediction {
  id: string
  category: string
  make: string
  model: string
  year: number
  displacement_liters: number
  cylinders: number
  drivetrain: string
  fuel_type: string
  vehicle_class: string
  transmission_type: string
  price_range: string
  why: string
  best_for: string[]
  icon: string
  image_url: string
  buy_url: string
}

// The four quiz answers plus context, sent to POST /quiz.
// Field names must match the QuizInput pydantic model in main.py exactly.
export interface QuizAnswers {
  budget: string
  need_space: string
  drive_type: string
  priority: string
}

export interface QuizRequest extends QuizAnswers {
  gas_price: number
  annual_miles: number
}

// The response from POST /quiz
export interface QuizResult extends Prediction {
  label: string
  vehicle_class: string
  avg_us_five_year_cost: number
  five_year_savings: number
}

// The request body for POST /compare
export interface CompareRequest {
  vehicle_a_id: string
  vehicle_b_id: string
  gas_price: number
  annual_miles: number
}

// The response from POST /compare
export interface CompareResult {
  vehicle_a: Vehicle
  vehicle_b: Vehicle
  mpg_diff: number
  annual_cost_diff: number
  five_year_diff: number
  cheaper: string
  five_year_savings: number
}

// Simple option type used for the compare dropdowns
export interface VehicleOption {
  id: string
  label: string
}


// Financing
export interface FinanceRequest {
  price: number
  down_payment: number
  term_months: number
  apr: number
}

export interface FinanceResult {
  monthly_payment: number
  total_interest: number
  total_paid: number
  principal: number
}


export interface GasPriceResult {
  us_average: number
}
