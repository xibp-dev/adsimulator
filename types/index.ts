export type Role = "ADMIN" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type CampaignObjective = "AWARENESS" | "TRAFFIC" | "ENGAGEMENT" | "LEADS" | "APP_PROMOTION" | "SALES";
export type CampaignStatus = "ACTIVE" | "PAUSED" | "DRAFT";
export type AdStatus = "ACTIVE" | "PAUSED" | "DRAFT" | "IN_REVIEW";
export type AdFormat = "SINGLE_IMAGE_VIDEO" | "CAROUSEL" | "COLLECTION";
export type CTA = "LEARN_MORE" | "SHOP_NOW" | "SIGN_UP" | "BOOK_NOW" | "CONTACT_US" | "DOWNLOAD" | "GET_OFFER" | "GET_QUOTE" | "SUBSCRIBE" | "WATCH_MORE" | "SEND_MESSAGE" | "INSTALL_NOW" | "USE_APP" | "CALL_NOW" | "WHATSAPP_MESSAGE" | "APPLY_NOW";
export type BudgetType = "DAILY" | "LIFETIME";

export interface SimMetricsData {
  id: string;
  entityType: string;
  entityId: string;
  reach: number;
  impressions: number;
  results: number;
  costPerResult: number;
  amountSpent: number;
  ctr: number;
  cpm: number;
  frequency: number;
  date: Date;
}

export interface CampaignWithMetrics {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budgetType: BudgetType;
  budgetAmount: number;
  cboEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: { adSets: number };
  simMetrics: SimMetricsData[];
}

export interface AdSetWithMetrics {
  id: string;
  campaignId: string;
  name: string;
  performanceGoal: string;
  conversionLocation: string;
  budgetType: BudgetType;
  budgetAmount: number;
  status: AdStatus;
  scheduleStart: Date;
  scheduleEnd: Date | null;
  ageMin: number;
  ageMax: number;
  advantageAudienceOn: boolean;
  advantagePlacementsOn: boolean;
  createdAt: Date;
  _count: { ads: number };
  simMetrics: SimMetricsData[];
}

export interface AdWithDetails {
  id: string;
  adSetId: string;
  name: string;
  identityPage: string;
  identityInstagram: string;
  format: AdFormat;
  primaryText: string;
  headline: string;
  description: string;
  mediaUrls: string[];
  cta: CTA;
  destinationUrl: string;
  status: AdStatus;
  createdAt: Date;
  simMetrics: SimMetricsData[];
}

export interface CreateCampaignInput {
  name: string;
  objective: CampaignObjective;
  cboEnabled: boolean;
  budgetType: BudgetType;
  budgetAmount: number;
  specialAdCategories: string[];
}

export interface CreateAdSetInput {
  campaignId: string;
  name: string;
  performanceGoal: string;
  conversionLocation: string;
  budgetType: BudgetType;
  budgetAmount: number;
  scheduleStart: string;
  scheduleEnd?: string;
  advantageAudienceOn: boolean;
  locations: string[];
  ageMin: number;
  ageMax: number;
  genders: string[];
  detailedTargeting: string[];
  languages: string[];
  advantagePlacementsOn: boolean;
  manualPlacements: string[];
}

export interface CreateAdInput {
  adSetId: string;
  name: string;
  identityPage: string;
  identityInstagram: string;
  format: AdFormat;
  primaryText: string;
  headline: string;
  description: string;
  mediaUrls: string[];
  cta: CTA;
  destinationUrl: string;
}
