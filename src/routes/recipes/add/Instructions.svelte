<script lang="ts">
  import * as Field from "$lib/components/ui/field/index";
  import * as InputGroup from "$lib/components/ui/input-group/index";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import { RECIPE_LIMITS } from "$lib/domain/recipe";
  import { Plus, Trash2 } from "lucide-svelte";

  type Props = {
    instructions: {
      text: string;
      notes: string[];
    }[];
    err: any;
  };

  let { instructions, err }: Props = $props();

  function handleInput(index: number, event: Event) {
    const e = event as InputEvent;
    const text = instructions[index].text;

    // Automatically add a new instruction if:
    // 1. The instruction input being used is the current last one
    // 2. The input was empty
    // 3. The user just input the first character
    if (
      index === instructions.length - 1 &&
      text.length === 1 &&
      e.inputType === "insertText"
    ) {
      instructions.push({ text: "", notes: [] });
    }
  }
</script>

<Field.Set>
  <Field.Legend>Instructions</Field.Legend>
  <Field.Description>
    Enter the instructions. AI will analyze them and relate each ingredient to
    the corresponding instructions.
  </Field.Description>

  <!--INSTRUCTIONS-->
  <Field.Group class="gap-2">
    {#each instructions as instruction, i}
      <Field.Group class="gap-2!">
        <Field.Field>
          <InputGroup.Root>
            <InputGroup.Textarea
              placeholder={i === 0
                ? `e.g. Brunoise the onions and thinly slice the garlic. Saute the onion for 4 minutes 
                        on medium-high heat, then add the garlic and saute for another minute.`
                    .trim()
                    .replace(/\s+/g, " ")
                : "Write your instruction here."}
              bind:value={instruction.text}
              maxlength={RECIPE_LIMITS.instruction.max}
              oninput={(e) => handleInput(i, e)}
            />
            <InputGroup.Addon align="block-start" class="border-b h-10 pr-2">
              <InputGroup.Text class="text-foreground">
                Instruction {i + 1}</InputGroup.Text
              >
              <InputGroup.Button
                class="ms-auto"
                variant="secondary"
                onclick={() => {
                  instruction.notes.push("");
                }}
                disabled={instruction.notes.length >=
                  RECIPE_LIMITS.note.maxCount}
              >
                <InputGroup.Text>Add note</InputGroup.Text>
              </InputGroup.Button>
              <InputGroup.Button
                variant="destructive"
                size="icon-xs"
                onclick={() => {
                  if (instructions.length > 1) {
                    instructions.splice(i, 1);
                  }
                }}
              >
                <Trash2 />
              </InputGroup.Button>
            </InputGroup.Addon>
            <InputGroup.Addon align="block-end">
              <InputGroup.Text class="text-xs mr-auto">
                {RECIPE_LIMITS.instruction.max - instruction.text.length}
                characters left
              </InputGroup.Text>
            </InputGroup.Addon>
          </InputGroup.Root>

          {#if err?.instructions[i]?.text.errors.length}
            <Field.Error>{err.instructions[i].text.errors[0]}</Field.Error>
          {/if}
        </Field.Field>

        {#if instruction.notes.length > 0}
          <Field.Group class="ps-4 gap-2! mb-4">
            {#each instruction.notes as note, j}
              <Field.Field>
                <InputGroup.Root>
                  <InputGroup.Textarea
                    placeholder={i === 0 && j === 0 && instruction.text === ""
                      ? `e.g. Brunoise means to cut into very fine uniform cubes, about 1-2 mm.`
                          .trim()
                          .replace(/\s+/g, " ")
                      : "Write your note here."}
                    bind:value={instruction.notes[j]}
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
                        instruction.notes.splice(j, 1);
                      }}
                    >
                      <Trash2 />
                    </InputGroup.Button>
                  </InputGroup.Addon>
                </InputGroup.Root>

                {#if err?.instructions[i]?.notes[j]?.errors.length}
                  <Field.Error>{err.instructions[i].notes[j].errors[0]}</Field.Error>
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
        instructions.push({ text: "", notes: [] });
      }}
    >
      Add instruction
      <Plus />
    </Button>
  </Field.Group>
</Field.Set>
