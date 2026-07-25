-- Initial Seed Data for Cloudflare D1

INSERT OR IGNORE INTO SiteSettings (id, siteUrl, siteName, title, description)
VALUES (
  'singleton',
  'https://adsimulator.web.id',
  'MetaLabs',
  'MetaLabs — Simulator Iklan Facebook & Instagram Gratis',
  'MetaLabs adalah simulator Meta Ads Manager berbahasa Indonesia. Belajar iklan Facebook dan Instagram secara gratis tanpa budget nyata.'
);

-- Admin User (Password: admin123)
INSERT OR IGNORE INTO User (id, name, email, passwordHash, role, status)
VALUES (
  'admin-user-id-001',
  'Admin AdSimulator',
  'admin@AdSimulator.id',
  '$2a$10$wN1Q/X3mF5cR/dGj98bpeO6S0XQ5yU81qT3A4a8mG59C4u6qZ/xK6',
  'ADMIN',
  'ACTIVE'
);

INSERT OR IGNORE INTO AdAccount (id, userId, name, balance)
VALUES (
  'admin-ad-acc-001',
  'admin-user-id-001',
  'Admin Ad Account',
  99999999
);
