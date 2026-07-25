-- Cloudflare D1 SQLite Schema for MetaLabs / AdSimulator

CREATE TABLE IF NOT EXISTS User (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  lastLoginAt TEXT,
  referredById TEXT,
  FOREIGN KEY (referredById) REFERENCES User(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS AdAccount (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  balance REAL NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Campaign (
  id TEXT PRIMARY KEY,
  adAccountId TEXT NOT NULL,
  name TEXT NOT NULL,
  objective TEXT NOT NULL DEFAULT 'AWARENESS',
  buyingType TEXT NOT NULL DEFAULT 'AUCTION',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  specialAdCategories TEXT NOT NULL DEFAULT '[]',
  cboEnabled INTEGER NOT NULL DEFAULT 0,
  budgetType TEXT NOT NULL DEFAULT 'DAILY',
  budgetAmount REAL NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (adAccountId) REFERENCES AdAccount(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS AdSet (
  id TEXT PRIMARY KEY,
  campaignId TEXT NOT NULL,
  name TEXT NOT NULL,
  performanceGoal TEXT NOT NULL DEFAULT 'MAXIMIZE_LINK_CLICKS',
  conversionLocation TEXT NOT NULL DEFAULT 'WEBSITE',
  pixel TEXT,
  budgetType TEXT NOT NULL DEFAULT 'DAILY',
  budgetAmount REAL NOT NULL DEFAULT 0,
  scheduleStart TEXT NOT NULL DEFAULT (datetime('now')),
  scheduleEnd TEXT,
  advantageAudienceOn INTEGER NOT NULL DEFAULT 1,
  locations TEXT NOT NULL DEFAULT '[]',
  ageMin INTEGER NOT NULL DEFAULT 18,
  ageMax INTEGER NOT NULL DEFAULT 65,
  genders TEXT NOT NULL DEFAULT '[]',
  detailedTargeting TEXT NOT NULL DEFAULT '[]',
  languages TEXT NOT NULL DEFAULT '[]',
  advantagePlacementsOn INTEGER NOT NULL DEFAULT 1,
  manualPlacements TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (campaignId) REFERENCES Campaign(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Ad (
  id TEXT PRIMARY KEY,
  adSetId TEXT NOT NULL,
  name TEXT NOT NULL,
  identityPage TEXT NOT NULL DEFAULT '',
  identityInstagram TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT 'SINGLE_IMAGE_VIDEO',
  primaryText TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  mediaUrls TEXT NOT NULL DEFAULT '[]',
  cta TEXT NOT NULL DEFAULT 'LEARN_MORE',
  destinationUrl TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  rejectionReason TEXT,
  qualityScore REAL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (adSetId) REFERENCES AdSet(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SimMetrics (
  id TEXT PRIMARY KEY,
  entityType TEXT NOT NULL,
  entityId TEXT NOT NULL,
  reach INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  results INTEGER NOT NULL DEFAULT 0,
  costPerResult REAL NOT NULL DEFAULT 0,
  amountSpent REAL NOT NULL DEFAULT 0,
  ctr REAL NOT NULL DEFAULT 0,
  cpm REAL NOT NULL DEFAULT 0,
  frequency REAL NOT NULL DEFAULT 0,
  date TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS BusinessPortfolio (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  businessEmail TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Fanspage (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Pixel (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  websiteUrl TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS SiteSettings (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  siteUrl TEXT NOT NULL DEFAULT 'https://adsimulator.web.id',
  siteName TEXT NOT NULL DEFAULT 'MetaLabs',
  title TEXT NOT NULL DEFAULT 'MetaLabs — Simulator Iklan Facebook & Instagram Gratis',
  description TEXT NOT NULL DEFAULT 'MetaLabs adalah simulator Meta Ads Manager berbahasa Indonesia.',
  keywords TEXT NOT NULL DEFAULT 'simulator iklan,simulator iklan facebook,belajar meta ads',
  ogImageUrl TEXT NOT NULL DEFAULT '/og-image.png',
  qrisString TEXT NOT NULL DEFAULT '',
  logoUrl TEXT NOT NULL DEFAULT '',
  faviconUrl TEXT NOT NULL DEFAULT '',
  qrisImageUrl TEXT NOT NULL DEFAULT '',
  gtmContainerId TEXT NOT NULL DEFAULT '',
  certInstitution TEXT NOT NULL DEFAULT 'AdSimulator Academy',
  certSignatory TEXT NOT NULL DEFAULT 'AdSimulator Academy',
  certSignatoryTitle TEXT NOT NULL DEFAULT 'Penyelenggara',
  certLogoUrl TEXT NOT NULL DEFAULT '',
  certAccent TEXT NOT NULL DEFAULT '#0866FF',
  traktirEnabled INTEGER NOT NULL DEFAULT 1,
  surveyEnabled INTEGER NOT NULL DEFAULT 0,
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Preset (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS LandingPage (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT NOT NULL,
  pixelCode TEXT NOT NULL DEFAULT '',
  template TEXT NOT NULL DEFAULT 'ecommerce',
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '0',
  ctaText TEXT NOT NULL,
  buttonEvent TEXT NOT NULL DEFAULT 'Purchase',
  imageUrl TEXT NOT NULL DEFAULT '',
  trackingRules TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS SocialAccount (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Terkoneksi',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Subscription (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  planSlug TEXT NOT NULL,
  planName TEXT NOT NULL,
  amount REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'MONTHLY',
  durationDays INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'PENDING',
  qrisString TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  startedAt TEXT,
  expiresAt TEXT,
  approvedBy TEXT,
  approvedAt TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_subscription_userId ON Subscription(userId);
CREATE INDEX IF NOT EXISTS idx_subscription_status ON Subscription(status);

CREATE TABLE IF NOT EXISTS Course (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'Pemula',
  category TEXT NOT NULL DEFAULT 'Meta Ads',
  thumbnailEmoji TEXT NOT NULL DEFAULT '📘',
  accent TEXT NOT NULL DEFAULT 'blue',
  isFree INTEGER NOT NULL DEFAULT 0,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Lesson (
  id TEXT PRIMARY KEY,
  courseId TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'Umum',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  videoUrl TEXT NOT NULL DEFAULT '',
  durationMin INTEGER NOT NULL DEFAULT 5,
  content TEXT NOT NULL DEFAULT '',
  isPreview INTEGER NOT NULL DEFAULT 0,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_lesson_courseId ON Lesson(courseId);

CREATE TABLE IF NOT EXISTS ExamQuestion (
  id TEXT PRIMARY KEY,
  courseId TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL DEFAULT '[]',
  correctIndex INTEGER NOT NULL DEFAULT 0,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (courseId) REFERENCES Course(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_exam_courseId ON ExamQuestion(courseId);

CREATE TABLE IF NOT EXISTS ExamAttempt (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  courseId TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  correctCount INTEGER NOT NULL DEFAULT 0,
  totalCount INTEGER NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0,
  certNumber TEXT,
  answers TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_examattempt_user_course ON ExamAttempt(userId, courseId);

CREATE TABLE IF NOT EXISTS Webinar (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  speaker TEXT NOT NULL DEFAULT '',
  schedule TEXT NOT NULL,
  meetingLink TEXT NOT NULL DEFAULT '',
  examPasscode TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 1,
  examDeadline TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS WebinarQuestion (
  id TEXT PRIMARY KEY,
  webinarId TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL DEFAULT '[]',
  correctIndex INTEGER NOT NULL DEFAULT 0,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (webinarId) REFERENCES Webinar(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_webinarquestion_webinarId ON WebinarQuestion(webinarId);

CREATE TABLE IF NOT EXISTS WebinarAttempt (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  webinarId TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  correctCount INTEGER NOT NULL DEFAULT 0,
  totalCount INTEGER NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0,
  certNumber TEXT,
  answers TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (webinarId) REFERENCES Webinar(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_webinarattempt_user_webinar ON WebinarAttempt(userId, webinarId);

CREATE TABLE IF NOT EXISTS WebinarRegistration (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  webinarId TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (webinarId) REFERENCES Webinar(id) ON DELETE CASCADE,
  UNIQUE(userId, webinarId)
);
CREATE INDEX IF NOT EXISTS idx_webinarreg_webinarId ON WebinarRegistration(webinarId);

CREATE TABLE IF NOT EXISTS AffiliateCommission (
  id TEXT PRIMARY KEY,
  referrerId TEXT NOT NULL,
  referredUserId TEXT NOT NULL,
  subscriptionId TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'APPROVED',
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrerId ON AffiliateCommission(referrerId);
CREATE INDEX IF NOT EXISTS idx_affiliate_referredUserId ON AffiliateCommission(referredUserId);

CREATE TABLE IF NOT EXISTS SurveyResponse (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL,
  hasAdvertised TEXT NOT NULL,
  profession TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  hasWebsite TEXT NOT NULL,
  socialMedia TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);
