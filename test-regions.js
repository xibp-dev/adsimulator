const { PrismaClient } = require('@prisma/client');

const regions = [
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'sa-east-1',
  'ca-central-1'
];

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  // URL-encode the password password @@KangBp21@@
  const connectionString = `postgresql://postgres.rertnbzartiabkncsyax:%40%40KangBp21%40%40@${host}:6543/postgres?pgbouncer=true&connection_limit=1`;
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  });

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ SUCCESS connecting to region: ${region} (${host})`);
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.log(`❌ FAILED region: ${region} (${host}) - Error: ${error.message}`);
    await prisma.$disconnect();
    return false;
  }
}

async function run() {
  console.log("Testing regional pooler hosts using Prisma...");
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      console.log(`Found working region: ${region}!`);
      break;
    }
  }
}

run();
