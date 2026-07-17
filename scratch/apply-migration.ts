import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

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
  // Split commands by semicolon to run them individually (avoiding transactional limitations of some commands)
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    try {
      console.log(`Executing statement: ${statement.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(statement);
    } catch (err: any) {
      // Ignore if column or table already exists
      if (err.message && (err.message.includes("already exists") || err.message.includes("duplicate column"))) {
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
