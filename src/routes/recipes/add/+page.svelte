<script lang="ts">
  import * as Field from "$lib/components/ui/field/index";
  import * as Select from "$lib/components/ui/select/index";
  import * as InputGroup from "$lib/components/ui/input-group/index";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import Ingredients from "./Ingredients.svelte";
  import Instructions from "./Instructions.svelte";
  import BreadcrumbSelect from "./BreadcrumbSelect.svelte";
  import CuisineSearch from "./CuisineSearch.svelte";

  import { RECIPE_LIMITS } from "$lib/domain/recipe";
  import type { CuisineNode } from "$lib/domain/cuisines";

  import { Upload } from "lucide-svelte";

  type Props = {
    data: {
      cuisines: CuisineNode[];
    };
  };

  let { data }: Props = $props();

  let err: any = $state(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const response = await fetch("/recipes/add", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.type === "error") {
      err = data.errors;
    }
    if (data.type === "success") {
      window.location.href = data.redirectTo;
    }
  }

  const difficultyTriggerFallback = "Select difficulty";
  const difficulties = [
    { value: "very_easy", label: "Very Easy" },
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "hard", label: "Hard" },
    { value: "very_hard", label: "Very Hard" },
    { value: "nightmare", label: "Nightmare" },
  ];

  let name: string = $state("");
  let desc: string = $state("");
  let reference: string = $state("");
  let diff: string = $state("");
  let difficultyTriggerContent = $derived(
    difficulties.find((item) => item.value === diff)?.label ??
      difficultyTriggerFallback,
  );
  let servings: number | undefined = $state();
  let activeTime: string = $state("");
  let inactiveTime: string = $state("");
  let cuisineSelectionPath: string[] = $state([]);
  let cuisineCustomValue: string = $state("");
  let cuisine = $derived(
    cuisineCustomValue.length > 0
      ? cuisineCustomValue
      : cuisineSelectionPath.at(-1),
  );
  let ingredients = $state([
    {
      text: "",
      notes: [""],
    },
    {
      text: "",
      notes: [],
    },
  ]);
  let instructions = $state([
    {
      text: "",
      notes: [""],
    },
    {
      text: "",
      notes: [],
    },
  ]);

  let recipe = $derived({
    name,
    desc,
    reference,
    diff,
    servings,
    activeTime,
    inactiveTime,
    cuisine,
    ingredients,
    instructions,
  });
</script>

<form
  class="w-[clamp(310px,97%,450px)] place-self-center my-8 border border-border p-5 sm:p-10 rounded-lg"
  method="POST"
  onsubmit={async (e) => await handleSubmit(e)}
>
  <Field.Group>
    <Field.Set>
      <Field.Legend>Basic information</Field.Legend>
      <Field.Description>
        First some basic information about the recipe
      </Field.Description>

      <Field.Group>
        <Field.Field>
          <Field.Label for="recipe-name">Recipe name</Field.Label>
          <Field.Description
            >Give a simple, unique and memorable name to the recipe</Field.Description
          >
          <Input
            id="recipe-name"
            placeholder="e.g. Lentil Bolognese"
            required
            autocomplete="off"
            maxlength={RECIPE_LIMITS.name.max}
            bind:value={name}
          />
          {#if err?.name.errors.length}
            <Field.Error>{err?.name.errors[0]}</Field.Error>
          {/if}
        </Field.Field>

        <Field.Field>
          <Field.Label for="recipe-desc">Recipe description</Field.Label>
          <Field.Description
            >Describe the recipe in a few words</Field.Description
          >
          <Textarea
            id="recipe-desc"
            placeholder="e.g. Traditional Italian bolognese sauce made from lentils"
            maxlength={RECIPE_LIMITS.desc.max}
            bind:value={desc}
          ></Textarea>
          {#if err?.desc.errors.length}
            <Field.Error>{err?.desc.errors[0]}</Field.Error>
          {/if}
        </Field.Field>

        <Field.Field>
          <Field.Label>Reference to original</Field.Label>
          <Field.Description
            >Provide a link to the original recipe if the recipe is based on
            an existing one</Field.Description
          >
          <Input
            id="recipe-reference"
            placeholder="e.g. https://www.k-ruoka.fi/reseptit/linssibolognese"
            maxlength={RECIPE_LIMITS.reference.max}
            bind:value={reference}
          />
          {#if err?.reference.errors.length}
            <Field.Error>{err?.reference.errors[0]}</Field.Error>
          {/if}
        </Field.Field>
      </Field.Group>
    </Field.Set>

    <Field.Separator />

    <Field.Set>
      <Field.Legend>Preparation details</Field.Legend>
      <Field.Description
        >Serving and preparation information</Field.Description
      >

      <Field.Group>
        <div class="grid grid-cols-2 gap-4">
          <Field.Field class="grid grid-rows-subgrid row-span-4 min-w-0">
            <Field.Label>Difficulty</Field.Label>
            <Field.Description>
              How difficult is the preparation?
            </Field.Description>
            <Select.Root type="single" bind:value={diff}>
              <Select.Trigger class="w-full min-w-0">
                <span class="truncate min-w-0">
                  {difficultyTriggerContent}
                </span>
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Difficulties</Select.Label>

                  {#each difficulties as diff (diff.value)}
                    <Select.Item value={diff.value} label={diff.label}>
                      {diff.label}
                    </Select.Item>
                  {/each}
                </Select.Group>
              </Select.Content>
            </Select.Root>
            {#if err?.diff.errors.length}
              <Field.Error>{err?.diff.errors[0]}</Field.Error>
            {/if}
          </Field.Field>
          <Field.Field class="grid grid-rows-subgrid row-span-4">
            <Field.Label for="recipe-servings">
              Number of servings</Field.Label
            >
            <Field.Description>
              How many servings does the recipe yield?
            </Field.Description>
            <Input
              id="recipe-servings"
              type="number"
              placeholder="e.g. 6"
              bind:value={servings}
            />
            {#if err?.servings.errors.length}
              <Field.Error>{err.servings.errors[0]}</Field.Error>
            {/if}
          </Field.Field>

          <Field.Field class="grid grid-rows-subgrid row-span-4">
            <Field.Label for="active-time">Active time</Field.Label>
            <Field.Description
              >How much active work is required?</Field.Description
            >
            <InputGroup.Root>
              <InputGroup.Input
                id="active-time"
                placeholder="e.g. 30-45"
                bind:value={activeTime}
              />
              <InputGroup.Addon align="inline-end">
                <InputGroup.Text>min</InputGroup.Text>
              </InputGroup.Addon>
            </InputGroup.Root>
            {#if err?.activeTime.errors.length}
              <Field.Error>{err?.activeTime.errors[0]}</Field.Error>
            {/if}
          </Field.Field>

          <Field.Field class="grid grid-rows-subgrid row-span-4">
            <Field.Label for="inactive-time">Inactive time</Field.Label>
            <Field.Description
              >How much inactive time is required?</Field.Description
            >
            <InputGroup.Root>
              <InputGroup.Input
                id="inactive-time"
                placeholder="e.g. 50"
                bind:value={inactiveTime}
              />
              <InputGroup.Addon align="inline-end">
                <InputGroup.Text>min</InputGroup.Text>
              </InputGroup.Addon>
            </InputGroup.Root>
            {#if err?.inactiveTime.errors.length}
              <Field.Error>{err?.inactiveTime.errors[0]}</Field.Error>
            {/if}
          </Field.Field>
        </div>

        <Field.Field>
          <Field.Label>Cuisine</Field.Label>
          <Field.Description
            >What food culture or location does the recipe originate from?</Field.Description
          >

          <div class="flex flex-col gap-1">
            <span class="text-muted-foreground text-sm"
              >You can manually select:</span
            >
            <Breadcrumb.Root>
              <Breadcrumb.List>
                <BreadcrumbSelect
                  bind:selectionPath={cuisineSelectionPath}
                  nodes={data.cuisines}
                  depth={0}
                />
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </div>

          <div class="flex flex-col gap-2.5">
            <span class="text-muted-foreground text-sm"
              >Or you can search:</span
            >
            <CuisineSearch
              bind:selectionPath={cuisineSelectionPath}
              nodes={data.cuisines}
            />
          </div>

          <div class="flex flex-col gap-2.5">
            <span class="text-muted-foreground text-sm"
              >Or you can enter a new one if you couldn't find it:</span
            >
            <Input
              name="customCuisineInput"
              placeholder="e.g. Ancient Maya"
              bind:value={cuisineCustomValue}
              maxlength={RECIPE_LIMITS.cuisine.max}
            />
          </div>

          {#if err?.cuisine.errors.length}
            <Field.Error>{err?.cuisine.errors[0]}</Field.Error>
          {/if}
        </Field.Field>
      </Field.Group>
    </Field.Set>

    <Field.Separator />
    <!--INGREDIENTS-->
    <Ingredients {ingredients} {err} />
    <Field.Separator />
    <!--INSTRUCTIONS-->
    <Instructions {instructions} {err} />
    <Field.Separator />

    <Button
      type="submit"
      variant="default"
      class="font-extrabold h-12 w-full"
    >
      Submit
      <Upload strokeWidth={3} />
    </Button>
  </Field.Group>
</form>