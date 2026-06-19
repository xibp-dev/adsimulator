import { CampaignObjective } from "@/types";

export interface SimulateInput {
  budgetAmount: number;
  budgetType: "DAILY" | "LIFETIME";
  objective: CampaignObjective;
  ageMin: number;
  ageMax: number;
  advantagePlacementsOn: boolean;
  locations: string[];
  qualityScore?: number; // Added quality score
  previousResults?: number; // Added for learning phase tracking
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max));
}

const objectiveMultipliers: Record<CampaignObjective, { cpm: number; ctr: number; cvr: number }> = {
  AWARENESS:     { cpm: 18000, ctr: 0.8,  cvr: 0.02 },
  TRAFFIC:       { cpm: 25000, ctr: 2.5,  cvr: 0.05 },
  ENGAGEMENT:    { cpm: 15000, ctr: 3.0,  cvr: 0.08 },
  LEADS:         { cpm: 45000, ctr: 1.5,  cvr: 0.12 },
  APP_PROMOTION: { cpm: 35000, ctr: 1.8,  cvr: 0.06 },
  SALES:         { cpm: 50000, ctr: 2.0,  cvr: 0.04 },
};

export function simulateDailyMetrics(input: SimulateInput) {
  const { 
    budgetAmount, objective, ageMin, ageMax, advantagePlacementsOn, locations, 
    qualityScore = 1.0, previousResults = 0 
  } = input;

  const mult = objectiveMultipliers[objective];
  
  // Learning Phase Logic (Shortened for fast classroom simulation: < 15 optimization events instead of 50)
  const isLearningPhase = previousResults < 15;
  
  const learningPhaseCpmPenalty = isLearningPhase ? rand(1.1, 1.4) : 1.0; // CPM up to 40% more expensive
  const learningPhaseCvrPenalty = isLearningPhase ? rand(0.6, 0.9) : 1.0; // Conversions drop by 10-40%
  
  // High quality score LOWERS the CPM (good), low score INCREASES it (bad)
  const cpmQualityModifier = 1 / qualityScore; 
  const cpmVariance = rand(0.75, 1.35) * cpmQualityModifier * learningPhaseCpmPenalty;
  const cpm = mult.cpm * cpmVariance;

  const placementBonus = advantagePlacementsOn ? 1.15 : 1.0;
  const geoBonus = locations.length > 1 ? 1.1 : 1.0;
  const ageRangeBonus = (ageMax - ageMin) > 30 ? 1.1 : 0.9;

  const effectiveBudget = budgetAmount * placementBonus * geoBonus * ageRangeBonus;
  const impressions = Math.floor((effectiveBudget / cpm) * 1000 * rand(0.85, 1.15));
  const reach = Math.floor(impressions / rand(1.1, 1.6));
  const frequency = impressions / Math.max(reach, 1);

  // High quality score INCREASES the CTR (good), low score DECREASES it (bad)
  const ctr = mult.ctr * rand(0.7, 1.4) * qualityScore;
  const clicks = Math.floor(impressions * (ctr / 100));
  
  // Apply learning phase CVR penalty
  const results = Math.floor(clicks * mult.cvr * rand(0.8, 1.3) * qualityScore * learningPhaseCvrPenalty); 
  const amountSpent = Math.min(budgetAmount, effectiveBudget * rand(0.85, 1.0));
  const costPerResult = results > 0 ? amountSpent / results : 0;

  return {
    reach: Math.max(reach, 0),
    impressions: Math.max(impressions, 0),
    results: Math.max(results, 0),
    costPerResult: parseFloat(costPerResult.toFixed(0)),
    amountSpent: parseFloat(amountSpent.toFixed(0)),
    ctr: parseFloat(ctr.toFixed(2)),
    cpm: parseFloat(cpm.toFixed(0)),
    frequency: parseFloat(frequency.toFixed(2)),
    isLearningPhase // Return this so UI can know
  };
}

export function estimateAudienceSize(input: Partial<SimulateInput>): number {
  let base = 50_000_000;
  const { ageMin = 18, ageMax = 65, locations = [], advantagePlacementsOn = true } = input;

  const ageRatio = (ageMax - ageMin) / 52;
  base *= ageRatio;
  base *= locations.length > 0 ? 0.15 : 1;
  base *= advantagePlacementsOn ? 1.2 : 0.85;

  return Math.max(Math.floor(base + rand(-base * 0.1, base * 0.1)), 10000);
}

export function estimateDailyReach(budget: number, objective: CampaignObjective): { min: number; max: number } {
  const mult = objectiveMultipliers[objective];
  const minReach = Math.floor((budget / (mult.cpm * 1.35)) * 1000 * 0.7);
  const maxReach = Math.floor((budget / (mult.cpm * 0.75)) * 1000 * 1.1);
  return { min: minReach, max: maxReach };
}

export function estimateDailyResults(budget: number, objective: CampaignObjective): { min: number; max: number } {
  const { min: minReach, max: maxReach } = estimateDailyReach(budget, objective);
  const mult = objectiveMultipliers[objective];
  return {
    min: Math.floor(minReach * (mult.ctr / 100) * mult.cvr * 0.7),
    max: Math.floor(maxReach * (mult.ctr / 100) * mult.cvr * 1.2),
  };
}

export function formatCurrency(amount: number, currency = "IDR"): string {
  if (currency === "IDR") {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
