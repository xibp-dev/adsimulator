const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Load .env manually
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join("=").trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

// Connect to pooler (DATABASE_URL)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log("Reading migration SQL...");
  const sqlPath = path.join(__dirname, "../prisma/affiliate-migration.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  console.log("Applying migration to database...");
  const statements = sql
    .split(";")
    .map(s => {
      // Strip SQL comments from each statement
      return s
        .split("\n")
        .filter(line => !line.trim().startsWith("--"))
        .join("\n")
        .trim();
    })
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      console.log(`Executing statement: ${statement.substring(0, 50).replace(/\n/g, " ")}...`);
      await prisma.$executeRawUnsafe(statement);
      console.log("→ Success");
    } catch (err) {
      if (err.message && (err.message.includes("already exists") || err.message.includes("duplicate column") || err.message.includes("already a foreign key"))) {
        console.log("→ Already exists, skipping.");
      } else {
        console.error("→ Error executing statement:", err.message || err);
      }
    }
  }

  console.log("Migration complete!");
}

main()
  .catch(e => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
