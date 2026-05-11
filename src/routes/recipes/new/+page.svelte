<script lang="ts">
  import { browser } from "$app/environment";

  import {
    Field,
    FieldSet,
    FieldGroup,
    FieldLegend,
    FieldDescription,
    FieldLabel,
    FieldError,
    FieldSeparator,
  } from "$lib/components/ui/field";
  import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
  } from "$lib/components/ui/input-group";
  import {
    NativeSelect,
    NativeSelectOption,
  } from "$lib/components/ui/native-select";
  import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
  } from "$lib/components/ui/select";
  import { RadioGroup, RadioGroupItem } from "$lib/components/ui/radio-group";
  import { ButtonGroup } from "$lib/components/ui/button-group";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  import { PlusIcon, Trash2Icon, ImageUpIcon, SearchIcon, CheckIcon, ChevronDownIcon } from "lucide-svelte";

  type Form = {
    recipeName: string;
    recipeDescription: string;
    recipeReferences: string[];
    imageTab: "upload" | "url";
    recipeImageUrl: string;
    recipeImageSrc: string;
    recipeDifficulty: string;
    recipeServings: number;
    recipeActiveTime: string;
    recipeInactiveTime: string;
    recipeCuisineSearchResults: {
      label: string;
      path: string;
      id: number
    }[];
  };
  type Props = {
    form: Form;
  };
  let { form }: Props = $props();

  const data: Form = $derived({
    recipeName: form?.recipeName ?? "",
    recipeDescription: form?.recipeDescription ?? "",
    recipeReferences: form?.recipeReferences ?? [""],
    imageTab: form?.imageTab ?? "url",
    recipeImageUrl: form?.recipeImageUrl ?? "",
    recipeImageSrc: form?.recipeImageSrc ?? "",
    recipeDifficulty: form?.recipeDifficulty ?? "",
    recipeServings: form?.recipeServings,
    recipeActiveTime: form?.recipeActiveTime ?? "",
    recipeInactiveTime: form?.recipeInactiveTime ?? "",
    recipeCuisineSearchResults: form?.recipeCuisineSearchResults
  });

  const difficulties = [
    { value: "", label: "Select difficulty" },
    { value: "very_easy", label: "Very Easy" },
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "hard", label: "Hard" },
    { value: "very_hard", label: "Very Hard" },
    { value: "nightmare", label: "Nightmare" },
  ];

  let difficulty = $state("");
  let difficultyTriggerContent = $derived(
    difficulties.find((diff) => diff.value === difficulty)?.label,
  );
</script>

<form
  class="w-[clamp(19rem,97%,35rem)] place-self-center my-8 border border-border p-5 sm:p-10 rounded-lg"
>
  <FieldGroup>
    <FieldSet>
      <FieldLegend>Basic information</FieldLegend>
      <FieldDescription
        >Enter some basic information about the recipe</FieldDescription
      >
      <FieldGroup>
        <!--------------->
        <!-----TITLE----->
        <!--------------->
        <Field>
          <FieldLabel for="recipeName">Title</FieldLabel>
          <FieldDescription
            >Give a short, unique and memorable name to the recipe</FieldDescription
          >
          <Input
            id="recipeName"
            name="recipeName"
            placeholder="Chana Masala"
            autocomplete="off"
            value={data.recipeName}
          />
        </Field>

        <!--------------->
        <!--DESCRIPTION-->
        <!--------------->
        <Field>
          <FieldLabel for="recipeDescription">Description</FieldLabel>
          <FieldDescription>Describe the recipe in a few words</FieldDescription
          >
          <Textarea
            id="recipeDescription"
            name="recipeDescription"
            placeholder="This vegan Chana Masala is packed with authentic Indian flavor and rivals any restaurant dish, but is easy and quick to make."
            autocomplete="off"
            value={data.recipeDescription}
          />
        </Field>

        <!--------------->
        <!--REFERENCES--->
        <!--------------->
        <Field>
          <div class="flex justify-between">
            <FieldLabel for="recipeReferences">References</FieldLabel>
            <Button
              size="icon-sm"
              variant="ghost"
              type="submit"
              formaction="?/addReference"
              formmethod="POST"
            >
              <PlusIcon />
            </Button>
          </div>
          <FieldDescription>
            If the recipe is based on or takes inspiration from an existing
            one(s), you should reference those here
          </FieldDescription>
          {#each data.recipeReferences ?? [""] as recipeReference, referenceIndex}
            <InputGroup>
              <InputGroupInput
                id="recipeReferences"
                name="recipeReferences"
                placeholder={referenceIndex === 0
                  ? "https://fakerecipesite.com/chana-masala"
                  : referenceIndex === 1
                    ? "The Imaginary Cookbook, Gordon Ramsay (2018)"
                    : "Another reference"}
                autocomplete="off"
                value={recipeReference}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  name="indexOfReferenceToRemove"
                  size="icon-xs"
                  variant="secondary"
                  value={referenceIndex}
                  type="submit"
                  formaction="?/removeReference"
                  formmethod="POST"
                >
                  <Trash2Icon class="text-destructive" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          {/each}
        </Field>

        <!--------------->
        <!-----IMAGE----->
        <!--------------->
        <Field>
          <FieldLabel
            for={data.imageTab === "upload"
              ? "recipeImageFile"
              : "recipeImageUrl"}>Image</FieldLabel
          >
          <FieldDescription>
            Add an image for the recipe via URL or by uploading from disk
          </FieldDescription>

          <ButtonGroup class="w-full">
            <Button
              type="submit"
              name="imageTabToSwitchTo"
              value="url"
              formaction="?/toggleImageTab"
              formmethod="POST"
              variant={data.imageTab === "upload" ? "secondary" : "outline"}
              disabled={data.imageTab === "url"}
              size="sm"
              class="disabled:opacity-100 disabled:cursor-default disabled:pointer-events-auto"
              >URL</Button
            >

            <Button
              type="submit"
              name="imageTabToSwitchTo"
              value="upload"
              formaction="?/toggleImageTab"
              formmethod="POST"
              variant={data.imageTab === "upload" ? "outline" : "secondary"}
              disabled={data.imageTab === "upload"}
              size="sm"
              class="disabled:opacity-100 disabled:cursor-default disabled:pointer-events-auto"
              >Upload</Button
            >
          </ButtonGroup>

          <ButtonGroup class="w-full">
            {#if data.imageTab === "upload"}
              <Input
                type="file"
                id="recipeImageFile"
                name="recipeImageFile"
                accept="image/*"
                class="file-input"
              />
            {:else}
              <Input
                id="recipeImageUrl"
                name="recipeImageUrl"
                placeholder="https://example.com/image.jpg"
                autocomplete="off"
                value={data.recipeImageUrl}
              />
            {/if}

            <Button
              type="submit"
              formaction="?/saveImageFile"
              formmethod="POST"
              formenctype={data.imageTab === "upload"
                ? "multipart/form-data"
                : "application/x-www-form-urlencoded"}
              variant="secondary"
            >
              <ImageUpIcon />
              Save
            </Button>
          </ButtonGroup>

          {#if data.imageTab}
            <input
              type="hidden"
              name="imageTab"
              id="imageTab"
              value={data.imageTab}
            />
          {/if}

          {#if data.recipeImageSrc}
            <img
              src={data.recipeImageSrc}
              alt="Recipe preview"
              class="mt-2 rounded-md max-h-48 object-cover"
            />
            <input
              type="hidden"
              name="recipeImageSrc"
              value={data.recipeImageSrc}
            />
          {/if}
        </Field>
      </FieldGroup>
    </FieldSet>

    <FieldSeparator />

    <FieldSet>
      <FieldLegend>Preparation details</FieldLegend>
      <FieldDescription
        >Additional information about serving and preparation</FieldDescription
      >

      <FieldGroup>
        <div class="grid grid-cols-2 gap-4 gap-y-6">
          <!--------------->
          <!--DIFFICULTY--->
          <!--------------->
          <Field class="grid grid-rows-subgrid row-span-3">
            <FieldLabel for="recipeDifficulty">Difficulty</FieldLabel>
            <FieldDescription
              >How difficult is the preparation?</FieldDescription
            >

            {#if browser}
              <NativeSelect name="recipeDifficulty" id="recipeDifficulty">
                {#each difficulties as difficulty}
                  <NativeSelectOption
                    value={difficulty.value}
                    selected={data.recipeDifficulty === difficulty.value}
                  >
                    {difficulty.label}
                  </NativeSelectOption>
                {/each}
              </NativeSelect>
            {:else}
              <Select
                type="single"
                name="recipeDifficulty"
                bind:value={difficulty}
              >
                <SelectTrigger>{difficultyTriggerContent}</SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Difficulties</SelectLabel>
                    {#each difficulties.slice(1) as difficulty}
                      <SelectItem
                        value={difficulty.value}
                        label={difficulty.label}>{difficulty.label}</SelectItem
                      >
                    {/each}
                  </SelectGroup>
                </SelectContent>
              </Select>
            {/if}
          </Field>

          <!--------------->
          <!---SERVINGS---->
          <!--------------->
          <Field class="grid grid-rows-subgrid row-span-3">
            <FieldLabel for="recipeServings">Number of servings</FieldLabel>
            <FieldDescription
              >How many servings does the recipe yield?</FieldDescription
            >
            <Input
              id="recipeServings"
              name="recipeServings"
              type="number"
              placeholder="6"
              value={data.recipeServings}
            />
          </Field>

          <!--------------->
          <!--ACTIVE TIME-->
          <!--------------->
          <Field class="grid grid-rows-subgrid row-span-3">
            <FieldLabel for="recipeActiveTime">Active time</FieldLabel>
            <FieldDescription
              >Roughly how much active cooking time does it take by one person?</FieldDescription
            >
            <InputGroup>
              <InputGroupInput
                id="recipeActiveTime"
                name="recipeActiveTime"
                placeholder="30-45"
                autocomplete="off"
                value={data.recipeActiveTime}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>min</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <!----------------->
          <!--INACTIVE TIME-->
          <!----------------->
          <Field class="grid grid-rows-subgrid row-span-3">
            <FieldLabel for="recipeInactiveTime">Inactive time</FieldLabel>
            <FieldDescription
              >Roughly how much inactive time does the prepartion take?</FieldDescription
            >
            <InputGroup>
              <InputGroupInput
                id="recipeInactiveTime"
                name="recipeInactiveTime"
                placeholder="25"
                autocomplete="off"
                value={data.recipeInactiveTime}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>min</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>

        <!----------------->
        <!-----CUISINE----->
        <!----------------->
        <Field>
          <FieldLabel>Cuisine</FieldLabel>
          <FieldDescription>
            Select the region/culture where this recipe originates — or takes
            inspiration — from.
          </FieldDescription>
          <div class="flex flex-col gap-1">
            <ButtonGroup class="w-full">
              <Input
                id="recipeCuisineSearchQuery"
                name="recipeCuisineSearchQuery"
                placeholder="Search cuisines..."
                autocomplete="off"
              />
              <Button
                type="submit"
                formaction="?/searchCuisines"
                formmethod="POST"
                variant="secondary"
              >
                <SearchIcon />
                Search
              </Button>
            </ButtonGroup>
            {#if data.recipeCuisineSearchResults?.length > 0}
              <details open>
                <summary class="list-none w-full h-6 bg-primary dark:bg-input/30 rounded-md border border-input
                  in-[[open]]:rounded-b-none in-[[open]]:border-b-0 flex justify-center items-center cursor-pointer"
                >
                  <ChevronDownIcon size="16" class="in-[[open]]:rotate-180 transition-[rotate]"/>
                </summary>
                <RadioGroup
                  class="max-h-70 rounded-b-md overflow-y-auto no-scrollbar border border-input bg-background
                    dark:bg-input/30 gap-0.5 p-0.5"
                >
                  {#each data.recipeCuisineSearchResults as cuisine, index (cuisine.id)}
                    <Label
                      for={`cuisine${index}`}
                      class="flex gap-x-2 px-2 py-1.5 cursor-pointer hover:bg-accent has-checked:bg-accent rounded-md"
                    >
                      <div class="relative">
                        <Input
                          type="radio"
                          value={cuisine.id.toString()}
                          id={`cuisine${index}`}
                          name="recipeCuisine"
                          aria-describedby={`cuisinePath${index}`}
                          class="sr-only peer"
                        />
                        <div
                          id="fakeRadioIndicator"
                          class="hidden peer-checked:block"
                        >
                          <CheckIcon />
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium">{cuisine.label}</span>
                        <span
                          id={`cuisinePath${index}`}
                          class="text-xs text-muted-foreground"
                        >{cuisine.path}</span>
                      </div>
                    </Label>
                  {/each}
                </RadioGroup>
              </details>
            {/if}
          </div>
        </Field>
      </FieldGroup>
    </FieldSet>
  </FieldGroup>
</form>
