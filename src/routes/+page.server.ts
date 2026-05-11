import { redirect } from '@sveltejs/kit';

type City = { name: string };

const ALL_CITIES: City[] = [
  { name: 'London' },
  { name: 'Oslo' },
  { name: 'Helsinki' },
  { name: 'Tokyo' },
  { name: 'Paris' },
  { name: 'Madrid' },
  { name: 'Dublin' },
  { name: 'Kyiv' },
  { name: 'Wien' },
];

export const load = async () => {
  return { cities: ALL_CITIES };
};

export const actions = {
  search: async ({ request }) => {
    const form = await request.formData();
    const base = Object.fromEntries(form);

    const query = form.get("query")?.toString() ?? "";

    console.log(`SEARCH ACTION:`);
    console.log(`Input:`);
    console.log(base);
    
    const results = ALL_CITIES.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );

    console.log("Output:");
    console.log({ ...base, searchResults: results });

    return {
      ...base,
      searchResults: results,
    }
  },
  create: async ({ request }) => {
    const form = await request.formData();

    console.log("Validating form data...");
    console.log("Successfully created new order with id 12345!");

    return redirect(303, "/orders/12345");
  },
  selectCity: async ({ request }) => {
    const form = await request.formData();
    const { query, ...rest } = Object.fromEntries(form);

    console.log("Selecting a city: ");
    console.log(rest);

    return {
      ...rest,
      currentlySelectedCity: form.get('cityToSelect'),
      searchResults: [],
    };
  }
};