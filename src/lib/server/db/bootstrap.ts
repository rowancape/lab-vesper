import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/bun-sqlite"
import * as schema from "./schema"

const tagCategories = [
  { 
    key: "cuisine",
    labelEn: "Regions & Cuisines",
    labelFi: "Alueet & ruokakulttuurit",
    userTipEn: "Select regions or cuisines your recipe originates from or takes inspiration from.",
    userTipFi: "Valitse alueita tai ruokakulttuureja, joista reseptisi on peräisin tai joista se saa inspiraationsa."
  },
  { 
    key: "spiciness",
    labelEn: "Spiciness",
    labelFi: "Tulisuus",
    userTipEn: "Indicate how spicy the dish is, from mild to very hot.",
    userTipFi: "Kuvaa ruoan tulisuustaso miedosta erittäin tuliseen."
  },
  { 
    key: "nutrition",
    labelEn: "Diets & Nutrition",
    labelFi: "Ruokavaliot & ravitsemus",
    userTipEn: "Mark dietary styles or nutritional characteristics this recipe fits.",
    userTipFi: "Merkitse ruokavaliot tai ravitsemukselliset ominaisuudet, joihin resepti sopii."
  },
  { 
    key: "allergen",
    labelEn: "Allergens & Restrictions",
    labelFi: "Allergeenit & rajoitteet",
    userTipEn: "Highlight common allergens or ingredients people may need to avoid.",
    userTipFi: "Korosta yleiset allergeenit tai ainesosat, joita jotkut haluavat välttää."
  },
  { 
    key: "setting",
    labelEn: "Settings & Occasions",
    labelFi: "Tilanteet & tilaisuudet",
    userTipEn: "Describe when or where this dish is typically enjoyed.",
    userTipFi: "Kuvaa, millaisissa tilanteissa tai tilaisuuksissa ruoka sopii tarjottavaksi."
  },
  { 
    key: "seasonality",
    labelEn: "Seasonality",
    labelFi: "Sesonkiluonne",
    userTipEn: "Indicate seasons when this dish or its ingredients are most suitable.",
    userTipFi: "Merkitse vuodenajat, jolloin ruoka tai sen ainesosat ovat parhaimmillaan."
  },
  { 
    key: "effort",
    labelEn: "Time & Effort",
    labelFi: "Aika & vaivannäkö",
    userTipEn: "Help others understand how much work or time the recipe requires.",
    userTipFi: "Auta muita arvioimaan, kuinka paljon aikaa tai vaivaa resepti vaatii."
  },
  { 
    key: "vibe",
    labelEn: "Vibes & Feels",
    labelFi: "Tunnelma & fiilis",
    userTipEn: "Capture the overall mood or feeling associated with this dish.",
    userTipFi: "Kuvaa ruoan yleistä tunnelmaa tai fiilistä."
  },
  { 
    key: "method",
    labelEn: "Cooking Method",
    labelFi: "Valmistustapa",
    userTipEn: "Specify the primary cooking technique used.",
    userTipFi: "Määritä tärkein käytetty valmistustekniikka."
  },
  { 
    key: "flavor",
    labelEn: "Flavor Profile",
    labelFi: "Makuprofiili",
    userTipEn: "Describe the dominant tastes and flavor characteristics.",
    userTipFi: "Kuvaa hallitsevat maut ja makuominaisuudet."
  },
  { 
    key: "difficulty",
    labelEn: "Difficulty",
    labelFi: "Vaikeustaso",
    userTipEn: "Help others gauge the cooking skill required.",
    userTipFi: "Auta muita arvioimaan, millaista osaamista ruoan valmistus vaatii."
  },
  { 
    key: "techniques",
    labelEn: "Techniques",
    labelFi: "Tekniikat",
    userTipEn: "Highlight specific cooking techniques used in the recipe.",
    userTipFi: "Korosta reseptissä käytettyjä erityisiä valmistustekniikoita."
  },
  { 
    key: "pairings",
    labelEn: "Pairings",
    labelFi: "Yhdistelmät",
    userTipEn: "Suggest foods or drinks that pair well with this dish.",
    userTipFi: "Ehdota ruokia tai juomia, jotka sopivat hyvin tämän ruoan kanssa."
  }
];

const tagsByCategory = {
  cuisine: [
    "Italian",
    "Mexican",
    "Indian",
    "Thai",
    "Middle Eastern"
  ],

  spiciness: [
    "Mild",
    "Medium",
    "Hot",
    "Very Hot",
    "No Heat"
  ],

  nutrition: [
    "High Protein",
    "Low Carb",
    "High Fiber",
    "Low Fat",
    "Energy Dense"
  ],

  allergen: [
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Soy-Free",
    "Egg-Free"
  ],

  setting: [
    "Weeknight Dinner",
    "Party Food",
    "Meal Prep",
    "Comfort Food",
    "Holiday Dish"
  ],

  seasonality: [
    "Summer",
    "Autumn",
    "Winter",
    "Spring",
    "All-Year"
  ],

  effort: [
    "Quick (under 20 min)",
    "One-Pot",
    "Minimal Prep",
    "Batch Cooking",
    "Hands-Off"
  ],

  vibe: [
    "Cozy",
    "Fresh",
    "Indulgent",
    "Light",
    "Hearty"
  ],

  method: [
    "Baked",
    "Fried",
    "Grilled",
    "Boiled",
    "Roasted"
  ],

  flavor: [
    "Savory",
    "Sweet",
    "Spicy",
    "Tangy",
    "Umami"
  ],

  difficulty: [
    "Beginner",
    "Easy",
    "Intermediate",
    "Advanced",
    "Chef-Level"
  ],

  techniques: [
    "Marinating",
    "Caramelizing",
    "Fermenting",
    "Blending",
    "Slow Cooking"
  ],

  pairings: [
    "Rice",
    "Bread",
    "Salad",
    "Wine Pairing",
    "Beer Pairing"
  ]
};


async function bootstrap() {
  const sqlite = new Database(process.env.DATABASE_URL!);
  const db = drizzle({ client: sqlite });

  await db.delete(schema.tagCategories).execute();
  await db.delete(schema.tags).execute();

  // USER TIP IS NOT YET ADDED TO DATABASE SCHEMA AND AS SUCH IS REMOVED HERE
  await db.insert(schema.tagCategories).values(tagCategories);

  const categories = await db.select().from(schema.tagCategories);

  const categoryIdByKey = Object.fromEntries(
    categories.map(c => [c.key, c.id])
  );

  const tagRows = Object.entries(tagsByCategory).flatMap(
    ([categoryKey, labels]) => {
      const categoryId = categoryIdByKey[categoryKey];

      if (!categoryId) {
        throw new Error(`Missing category in DB: ${categoryKey}`);
      }

      return labels.map(label => ({
        categoryId,
        label
      }));
    }
  );

  await db.insert(schema.tags).values(tagRows);

  sqlite.close();
}

await bootstrap()