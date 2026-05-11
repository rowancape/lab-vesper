import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { reset, seed } from "drizzle-seed";
import * as schemaFull from "./schema";

const { tagCategories, tags, recipeTags, ...schemaForSeed } = schemaFull;

async function seed_all() {
  const sqlite = new Database(process.env.DATABASE_URL!);
  const db = drizzle({ client: sqlite })

  await reset(db, schemaForSeed);
  
  await seed(db, schemaForSeed).refine((f) => ({
    recipes: {
      columns: {
        name: f.valuesFromArray({ values: [
          "Curry",
          "Chili sin carne",
          "Lemony chickpea soup",
          "Marry me tofu",
          "Cowboy soup",
          "Vegan meatballs",
          "Crispy broccoli",
          "Vegan nuggets",
          "Tortillas",
          "Guacamole"
        ]}),
        description: f.loremIpsum(),
        servings: f.int({ minValue: 1, maxValue: 20 }),
        difficulty: f.int({ minValue: 1, maxValue: 10 }),
        activeTimeMin: f.int({ minValue: 5, maxValue: 20 }),
        activeTimeMax: f.int({ minValue: 25, maxValue: 120 }),
        inactiveTimeMin: f.int({ minValue: 5, maxValue: 20 }),
        inactiveTimeMax: f.int({ minValue: 25, maxValue: 120 }),
      }
    }
  }));

  sqlite.close();
}

seed_all();