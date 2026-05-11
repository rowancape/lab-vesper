<script lang="ts">
  import * as Field from "$lib/components/ui/field/index";
  import * as InputGroup from "$lib/components/ui/input-group/index";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import { RECIPE_LIMITS } from "$lib/domain/recipe";
  import { Plus, Trash2 } from "lucide-svelte";

  type Props = {
    ingredients: {
      text: string;
      notes: string[];
    }[];
    err: any;
  };

  let { ingredients, err }: Props = $props();

  function handleInput(index: number, event: Event) {
    const e = event as InputEvent;
    const text = ingredients[index].text;

    // Automatically add a new ingredient if:
    // 1. The ingredient input being used is the current last one
    // 2. The input was empty
    // 3. The user just input the first character
    if (
      index === ingredients.length - 1 &&
      text.length === 1 &&
      e.inputType === "insertText"
    ) {
      ingredients.push({ text: "", notes: [] });
    }
  }
</script>

<Field.Set>
  <Field.Legend>Ingredients</Field.Legend>
  <Field.Description>
    Enter all the ingredients used in the recipe. You can also add comments to individual ingredients.
  </Field.Description>

  <Field.Group class="gap-2">
    {#each ingredients as ingredient, i}
      <Field.Group class="gap-2!">
        <!--INGREDIENT TEXT INPUT FIELD-->
        <Field.Field>
          <InputGroup.Root>
            <InputGroup.Input
              placeholder={i === 0 ? "e.g. 3 dl red lentils" : null}
              bind:value={ingredient.text}
              maxlength={RECIPE_LIMITS.ingredient.max}
              oninput={(e) => {
                handleInput(i, e);
              }}
            />
            <InputGroup.Addon>
              <InputGroup.Text>
                {i + 1}.
              </InputGroup.Text>
            </InputGroup.Addon>
            <InputGroup.Addon align="inline-end">
              <InputGroup.Button
                type="button"
                onclick={() => {
                  ingredient.notes.push("");
                }}
                disabled={ingredient.notes.length >=
                  RECIPE_LIMITS.note.maxCount}
                variant="secondary"
              >
                <InputGroup.Text>Add note</InputGroup.Text>
              </InputGroup.Button>
              <InputGroup.Button
                size="icon-xs"
                variant="destructive"
                onclick={() => {
                  if (ingredients.length > 1) {
                    ingredients.splice(i, 1);
                  }
                }}
              >
                <Trash2 />
              </InputGroup.Button>
            </InputGroup.Addon>
          </InputGroup.Root>
        </Field.Field>
        {#if err?.ingredients[i]?.text.errors.length}
          <Field.Error>{err.ingredients[i].text.errors[0]}</Field.Error>
        {/if}

        <!--NOTE TEXT AREAS GROUP-->
        {#if ingredients[i].notes.length > 0}
          <Field.Group class="ps-4 gap-2! mb-4">
            {#each ingredients[i].notes as note, j}
              <Field.Field>
                <InputGroup.Root>
                  <InputGroup.Textarea
                    placeholder={i === 0 && j === 0
                      ? `e.g. Any husked lentils work, but I prefer the color of red husked lentils
                            for this recipe. (this is here as an example and can be deleted
                            if you do not wish to add a note here)
                            `
                          .trim()
                          .replace(/\s+/g, " ")
                      : "Write your note here."}
                    bind:value={ingredient.notes[j]}
                    maxlength={RECIPE_LIMITS.note.max}
                  />
                  <InputGroup.Addon align="block-end" class="*:text-xs">
                    <InputGroup.Text>Note {j + 1}</InputGroup.Text>
                    <InputGroup.Text class="ms-auto">
                      {RECIPE_LIMITS.note.max - note.length} characters left
                    </InputGroup.Text>
                    <Separator orientation="vertical" class="h-6" />
                    <InputGroup.Button
                      size="icon-xs"
                      variant="destructive"
                      onclick={() => {
                        ingredient.notes.splice(j, 1);
                      }}
                    >
                      <Trash2 />
                    </InputGroup.Button>
                  </InputGroup.Addon>
                </InputGroup.Root>

                {#if err?.ingredients[i]?.notes[j]?.errors.length}
                  <Field.Error>{err.ingredients[i].notes[j].errors[0]}</Field.Error>
                {/if}
              </Field.Field>
            {/each}
          </Field.Group>
        {/if}
      </Field.Group>
    {/each}

    <Button
      variant="outline"
      onclick={() => {
        ingredients.push({ text: "", notes: [] });
      }}
    >
      Add ingredient
      <Plus />
    </Button>
  </Field.Group>
</Field.Set>
