export type CuisineNode = {
  label: string;
  weight: number;
  children?: CuisineNode[];
}

export const CUISINES: CuisineNode[] = [
  {
    label: "African",
    weight: 10,
    children: [
      { label: "North African", weight: 7 },
      { label: "West African", weight: 7 },
      { label: "East African", weight: 7 },
      { label: "Southern African", weight: 7 },
    ]
  },
  {
    label: "North American",
    weight: 10,
    children: [
      { label: "American", weight: 8 },
      { 
        label: "Mexican", 
        weight: 9,
        children: [
          {
            label: "Mesoamerican",
            weight: 1,
            children: [
              { label: "Aztec", weight: 1 },
              { label: "Ancient Maya", weight: 1 }
            ]
          },
          {
            label: "Mexico City",
            weight: 1
          }
        ]
      },
      { label: "Canadian", weight: 7 },
      { label: "Caribbean", weight: 8 }
    ]
  },
  {
    label: "South American",
    weight: 9,
    children: [
      { label: "Brazilian", weight: 8 },
      { label: "Argentine", weight: 7 },
      { label: "Peruvian", weight: 8 },
      { label: "Colombian", weight: 7 },
      { label: "Venezuelan", weight: 7 }
    ]
  },
  {
    label: "European",
    weight: 10,
    children: [
      { label: "Italian", weight: 10 },
      { label: "French", weight: 9 },
      { label: "Spanish", weight: 8 },
      { label: "Greek", weight: 8 },
      { label: "German", weight: 7 },
      { label: "British", weight: 7 },
      { label: "Eastern European", weight: 7 }
    ]
  },
  {
    label: "Middle Eastern",
    weight: 9,
    children: [
      { label: "Turkish", weight: 8 },
      { label: "Lebanese", weight: 8 },
      { label: "Persian", weight: 8 },
      { label: "Israeli", weight: 7 },
      { label: "Arabian Gulf", weight: 7 }
    ]
  },
  {
    label: "South Asian",
    weight: 10,
    children: [
      { label: "Indian", weight: 10 },
      { label: "Pakistani", weight: 8 },
      { label: "Sri Lankan", weight: 7 },
      { label: "Bangladeshi", weight: 7 },
      { label: "Nepalese", weight: 6 }
    ]
  },
  {
    label: "East Asian",
    weight: 10,
    children: [
      { label: "Chinese", weight: 10 },
      { label: "Japanese", weight: 9 },
      { label: "Korean", weight: 9 },
      { label: "Taiwanese", weight: 7 }
    ]
  },
  {
    label: "Southeast Asian",
    weight: 9,
    children: [
      { label: "Thai", weight: 9 },
      { label: "Vietnamese", weight: 9 },
      { label: "Indonesian", weight: 7 },
      { label: "Filipino", weight: 7 },
      { label: "Malaysian", weight: 7 }
    ]
  },
  {
    label: "Oceanian",
    weight: 6,
    children: [
      { label: "Australian", weight: 7 },
      { label: "New Zealand", weight: 6 },
      { label: "Polynesian", weight: 6 }
    ]
  }
] as const;


export const TAG_CATEGORIES = [
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
] as const;

export const TAGS_BY_CATEGORY = {
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
} as const;