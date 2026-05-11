// @ts-ignore
import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite";
import { initCuisines } from "./cuisines.init";

async function main() {
  try {
    const sqlite = new Database(process.env.DATABASE_URL);
    const db = drizzle({ client: sqlite });
  
    await initCuisines(db);
    console.log("Successfully initialized database");
  } 
  catch (err) {
    console.error("Failed to initialize database", err);

    process.exit(1);
  }
}

main();