<script lang="ts">
  import {
    Field,
    FieldSet,
    FieldGroup,
    FieldLegend,
    FieldDescription,
    FieldLabel,
  } from "$lib/components/ui/field";
  import {
    InputGroup,
    InputGroupTextarea,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
  } from "$lib/components/ui/input-group";
  import Button from "$lib/components/ui/button/button.svelte";
  import Toggle from "$lib/components/ui/toggle/toggle.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import type { RecipePrimitive } from "$lib/domain/recipe";
  import { RECIPE_LIMITS } from "$lib/domain/recipe";

  import {
    Plus as PlusIcon,
    Trash2 as Trash2Icon,
    TriangleAlert as TriangleAlertIcon,
  } from "lucide-svelte";

  type Props = {
    recipe: RecipePrimitive;
  };
  let { recipe = $bindable() }: Props = $props();
</script>

<FieldSet>
  <FieldLegend>Directions</FieldLegend>
  <FieldDescription
    >Everything needed to make the recipe — ingredients, step-by-step
    instructions, and any notes on those or the recipe as a whole.</FieldDescription
  >

  <FieldGroup>
    <!----------------->
    <!--GENERAL NOTES-->
    <!----------------->
    <Field>
      <div class="flex justify-between">
        <FieldLabel id="recipeGeneralNotesLabel">General notes</FieldLabel>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Add general note ${recipe.generalNotes.length + 1}`}
          disabled={recipe.generalNotes.length >=
            RECIPE_LIMITS.generalNotes.maxCount}
          aria-disabled={recipe.generalNotes.length >=
            RECIPE_LIMITS.generalNotes.maxCount}
          onclick={() => {
            if (
              recipe.generalNotes.length < RECIPE_LIMITS.generalNotes.maxCount
            ) {
              recipe.generalNotes.push({ text: "", isImportant: false });
            }
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <FieldDescription id="recipeGeneralNotesDescription"
        >Use general notes for overall tips, storage, or serving suggestions.
        For notes about a specific ingredient or instruction step, attach the
        note field to that item below instead.</FieldDescription
      >
      <div
        class="space-y-2"
        role="group"
        aria-labelledby="recipeGeneralNotesLabel"
        aria-describedby="recipeGeneralNotesDescription"
      >
        {#each recipe.generalNotes as _generalNote, i}
          <InputGroup>
            <InputGroupTextarea
              placeholder={i === 0
                ? `e.g. If cooking solo, prep and measure all ingredients before turning on the heat.
                  Once the spices and aromatics start cooking, the recipe moves quickly and there won’t be much time to
                  chop or measure ingredients between steps.`
                    .trim()
                    .replace(/\s+/g, " ")
                : "Write your note here."}
              bind:value={recipe.generalNotes[i].text}
              maxlength={RECIPE_LIMITS.generalNotes.maxChars}
              aria-label={`Recipe general note ${i + 1}`}
            />
            <InputGroupAddon align="block-end" class="*:text-xs">
              <InputGroupText>
                Note {i + 1}
              </InputGroupText>

              <Toggle
                class="ms-auto px-0 data-[state=on]:bg-transparent hover:bg-transparent
                    data-[state=on]:*:[svg]:stroke-orange-400"
                bind:pressed={recipe.generalNotes[i].isImportant}
              >
                Mark important
                <TriangleAlertIcon />
              </Toggle>

              <Separator orientation="vertical" class="h-6" />
              <InputGroupButton
                size="icon-xs"
                variant="secondary"
                class="text-destructive"
                aria-label={`Remove general note ${i + 1}`}
                onclick={() => {
                  recipe.generalNotes.splice(i, 1);
                }}
              >
                <Trash2Icon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        {/each}
      </div>
    </Field>

    <!----------------->
    <!---INGREDIENTS--->
    <!----------------->
    <Field>
      <div class="flex justify-between">
        <FieldLabel id="recipeIngredientsLabel">Ingredients</FieldLabel>
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={recipe.ingredients.length >=
            RECIPE_LIMITS.ingredients.maxCount}
          aria-disabled={recipe.ingredients.length >=
            RECIPE_LIMITS.ingredients.maxCount}
          onclick={() => {
            recipe.ingredients.push({ text: "", notes: [] });
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <FieldDescription id="recipeIngredientsDescription"
        >Enter all the ingredients used in the recipe. You can also add comments
        to individual ingredients.</FieldDescription
      >
      <div
        role="group"
        class="space-y-2"
        aria-labelledby="recipeIngredientsLabel"
        aria-describedby="recipeIngredientsDescription"
      >
        {#each recipe.ingredients as ingredient, i}
          <InputGroup>
            <InputGroupInput
              placeholder={i === 0
                ? "e.g. 3 dl red lentils"
                : "Write ingredient here."}
              bind:value={recipe.ingredients[i].text}
              maxlength={RECIPE_LIMITS.ingredients.maxChars}
            />
            <InputGroupAddon>
              <InputGroupText>
                {i + 1}.
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onclick={() => {
                  recipe.ingredients[i].notes.push("");
                }}
                disabled={ingredient.notes.length >=
                  RECIPE_LIMITS.ingredients.notes.maxCount}
                variant="secondary"
              >
                <InputGroupText>Add note</InputGroupText>
              </InputGroupButton>
              <InputGroupButton
                size="icon-xs"
                variant="secondary"
                class="text-destructive"
                onclick={() => {
                  if (
                    recipe.ingredients.length >
                    RECIPE_LIMITS.ingredients.minCount
                  ) {
                    recipe.ingredients.splice(i, 1);
                  }
                }}
              >
                <Trash2Icon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {#if ingredient.notes.length}
            <div
              class="space-y-2 ml-4 mb-4"
              role="group"
              aria-label="recipeIngredientsNotes"
            >
              {#each ingredient.notes as ingredientNote, j}
                <InputGroup>
                  <InputGroupTextarea
                    placeholder={i === 0 && j === 0
                      ? `e.g. Any husked lentils work, but I prefer the color of red husked lentils
                          for this recipe. (this is here as an example and can be deleted
                          if you do not wish to add a note here)
                          `
                          .trim()
                          .replace(/\s+/g, " ")
                      : "Write your note here."}
                    bind:value={recipe.ingredients[i].notes[j]}
                    maxlength={RECIPE_LIMITS.ingredients.notes.maxChars}
                  />
                  <InputGroupAddon align="block-end" class="*:text-xs">
                    <InputGroupText>Note {j + 1}</InputGroupText>
                    <InputGroupText class="ms-auto">
                      {RECIPE_LIMITS.ingredients.notes.maxChars -
                        ingredientNote.length} characters left
                    </InputGroupText>
                    <Separator orientation="vertical" class="h-6" />
                    <InputGroupButton
                      size="icon-xs"
                      variant="secondary"
                      class="text-destructive"
                      onclick={() => {
                        recipe.ingredients[i].notes.splice(j, 1);
                      }}
                    >
                      <Trash2Icon />
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              {/each}
            </div>
          {/if}
        {/each}
        <Button
          class="w-full"
          variant="outline"
          onclick={() => {
            recipe.ingredients.push({ text: "", notes: [] });
          }}
        >
          Add ingredient
          <PlusIcon />
        </Button>
      </div>
    </Field>

    <!----------------->
    <!--INSTRUCTIONS--->
    <!----------------->
    <Field>
      <div class="flex justify-between">
        <FieldLabel id="recipeInstructionsLabel">Instructions</FieldLabel>
        <Button
          size="icon-sm"
          variant="ghost"
          disabled={recipe.instructions.length >=
            RECIPE_LIMITS.instructions.maxCount}
          aria-disabled={recipe.instructions.length >=
            RECIPE_LIMITS.instructions.maxCount}
          onclick={() => {
            recipe.instructions.push({ text: "", notes: [] });
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <FieldDescription id="recipeInstructionsDescription"
        >Write all the instructions for the recipe. Notes can be added for
        individual instructions, too.</FieldDescription
      >

      <div
        class="space-y-2"
        role="group"
        aria-labelledby="recipeInstructionsLabel"
        aria-describedby="recipeInstructionsDescription"
      >
        {#each recipe.instructions as instruction, i}
          <InputGroup>
            <InputGroupTextarea
              placeholder={i === 0
                ? `e.g. Brunoise the onions and thinly slice the garlic. Saute the onion for 4 minutes 
                              on medium-high heat, then add the garlic and saute for another minute.`
                    .trim()
                    .replace(/\s+/g, " ")
                : "Write your instruction here."}
              bind:value={recipe.instructions[i].text}
              maxlength={RECIPE_LIMITS.instructions.maxChars}
            />
            <InputGroupAddon align="block-start" class="border-b h-10 pr-2">
              <InputGroupText class="text-foreground">
                Instruction {i + 1}</InputGroupText
              >
              <InputGroupButton
                class="ms-auto"
                variant="secondary"
                onclick={() => {
                  recipe.instructions[i].notes.push("");
                }}
                disabled={instruction.notes.length >=
                  RECIPE_LIMITS.instructions.notes.maxCount}
              >
                <InputGroupText>Add note</InputGroupText>
              </InputGroupButton>
              <InputGroupButton
                variant="secondary"
                class="text-destructive"
                size="icon-xs"
                onclick={() => {
                  if (recipe.instructions.length > 1) {
                    recipe.instructions.splice(i, 1);
                  }
                }}
              >
                <Trash2Icon />
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align="block-end">
              <InputGroupText class="text-xs mr-auto">
                {RECIPE_LIMITS.instructions.maxChars - instruction.text.length}
                characters left
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div class="ml-4 mb-4" role="group">
            {#each instruction.notes as instructionNote, j}
              <InputGroup>
                <InputGroupTextarea
                  placeholder={i === 0 && j === 0
                    ? `e.g. Any husked lentils work, but I prefer the color of red husked lentils
                                  for this recipe. (this is here as an example and can be deleted
                                  if you do not wish to add a note here)
                                  `
                        .trim()
                        .replace(/\s+/g, " ")
                    : "Write your note here."}
                  bind:value={recipe.instructions[i].notes[j]}
                  maxlength={RECIPE_LIMITS.instructions.notes.maxChars}
                />
                <InputGroupAddon align="block-end" class="*:text-xs">
                  <InputGroupText>Note {j + 1}</InputGroupText>
                  <InputGroupText class="ms-auto">
                    {RECIPE_LIMITS.instructions.notes.maxChars - instructionNote.length} characters
                    left
                  </InputGroupText>
                  <Separator orientation="vertical" class="h-6" />
                  <InputGroupButton
                    size="icon-xs"
                    variant="secondary"
                    class="text-destructive"
                    onclick={() => {
                      recipe.instructions[i].notes.splice(j, 1);
                    }}
                  >
                    <Trash2Icon />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            {/each}
          </div>
        {/each}
        <Button
          class="w-full"
          variant="outline"
          onclick={() => {
            recipe.instructions.push({ text: "", notes: [] });
          }}
        >
          Add instruction
          <PlusIcon />
        </Button>
      </div>
    </Field>
  </FieldGroup>
</FieldSet>
