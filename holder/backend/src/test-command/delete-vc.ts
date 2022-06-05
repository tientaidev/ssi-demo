import { VeramoDatabase } from '../db/db'

const db = new VeramoDatabase();

async function main() {
  const result = await db.deleteCredential('6ce5d368cc54e2686e9e5949ebf0778c0e2d085619e2bed33910c969974dae60bb2ab7746dcfac1782b2f2149353f7eca63134c122f70b88bb88ebcfb3bcdaed');

  console.log(result);
}

main().catch(console.log)