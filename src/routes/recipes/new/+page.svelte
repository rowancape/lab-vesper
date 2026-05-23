<script lang="ts">
  import { FieldGroup, FieldSeparator } from "$lib/components/ui/field";
  import Button from "$lib/components/ui/button/button.svelte";

  import DetailsFieldSet from "./DetailsFieldSet.svelte";
  import AboutFieldSet from "./AboutFieldSet.svelte";
  import DirectionsFieldSet from "./DirectionsFieldSet.svelte";

  import type { RecipePrimitive, Errors } from "$lib/domain/recipe";
  import { sanitizeRecipe } from "$lib/domain/recipe";

  import { Upload as UploadIcon } from "lucide-svelte";

  type Props = {
    data: {
      allCuisines: {
        id: number;
        parentId: number;
        label: string;
        path: string;
      }[];
    };
  };
  let { data }: Props = $props();

  let recipe = $state<RecipePrimitive>({
    title: "",
    description: "",
    references: [""],
    image: { isUrlTab: true, url: "" },
    difficulty: "",
    mealTypes: [],
    servings: null,
    yield: "",
    activeTime: { input: "", unit: "minute" },
    inactiveTime: { input: "", unit: "minute" },
    cuisineSelectionPath: [],
    customCuisine: null,
    generalNotes: [{ text: "", isImportant: false }],
    ingredients: [
      { text: "", notes: [""] },
      { text: "", notes: [] },
    ],
    instructions: [{ text: "", notes: [""] }],
  });

  let imageFile = $state<File | null>(null);

  let errors = $state<Errors>({});
</script>

<form
  class="w-[clamp(19rem,97%,35rem)] place-self-center my-8 border border-border p-5 sm:p-10 rounded-lg"
  onsubmit={async (e) => {
    e.preventDefault();

    sanitizeRecipe(recipe);

    const formData = new FormData();

    formData.set("recipe", JSON.stringify(recipe));
    if (imageFile) {
      formData.set("image", imageFile);
    }

    const response = await fetch("/recipes/new", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!data.success) {
      errors = data.errors;
      // This is some truly horrifying stuff right here. Root level Valibot errors are terrible.
      // This is most definitely not a permanent solution :D
      if (
        !(recipe.cuisineSelectionPath.length > 0) &&
        (!recipe.customCuisine || !(recipe.customCuisine.length > 0))
      ) {
        errors["cuisine"] = [
          "You must either select a cuisine or enter a custom one",
        ];
      }
    }
  }}
>
  <FieldGroup>
    <AboutFieldSet {imageFile} {errors} bind:recipe />
    <FieldSeparator />
    <DetailsFieldSet allCuisines={data.allCuisines} {errors} bind:recipe />
    <FieldSeparator />
    <DirectionsFieldSet {errors} bind:recipe />
    <Button type="submit" size="lg" class="font-bold">
      <UploadIcon strokeWidth={3} />
      Submit
    </Button>
  </FieldGroup>
</form>
