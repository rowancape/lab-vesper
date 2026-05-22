<script lang="ts">
  import {
    Field,
    FieldSet,
    FieldLegend,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldError
  } from "$lib/components/ui/field";
  import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
  } from "$lib/components/ui/input-group";
  import { ButtonGroup } from "$lib/components/ui/button-group";
  import Input from "$lib/components/ui/input/input.svelte";
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import { RECIPE_LIMITS } from "$lib/domain/recipe";
  import { type RecipePrimitive, type Errors, getErrors, getAllErrors } from "$lib/domain/recipe";

  import {
    Plus as PlusIcon,
    Trash2 as Trash2Icon,
    Link as LinkIcon,
    Upload as UploadIcon,
    X as XIcon,
  } from "lucide-svelte";

  type Props = {
    recipe: RecipePrimitive
    errors: Errors
    imageFile: File | null
  }
  let { imageFile, errors, recipe = $bindable() }: Props = $props();

  let isDraggingImageFile = $state(false);
  let uploadedImageBase64String = $state<string | undefined>();
  let imagePreviewSrc = $state<string | undefined>();

  function handleImageFile(file: File) {
    imageFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageBase64String = e.target?.result as string;
      imagePreviewSrc = uploadedImageBase64String;
    };
    reader.readAsDataURL(file);
  }
</script>

<FieldSet>
  <FieldLegend>About</FieldLegend>
  <FieldDescription
    >Enter some basic information about the recipe.</FieldDescription
  >
  <FieldGroup>
    <!--------------->
    <!-----TITLE----->
    <!--------------->
    <Field>
      <FieldLabel for="recipeTitle">Title</FieldLabel>
      <FieldDescription
        >Give a short, unique and memorable name to the recipe.</FieldDescription
      >
      <Input
        id="recipeTitle"
        placeholder="e.g. Chana Masala"
        autocomplete="off"
        maxlength={RECIPE_LIMITS.title.maxChars}
        bind:value={recipe.title}
      />
      {#if getErrors("title", errors).length}
        <FieldError>{getErrors("title", errors)[0]}</FieldError>
      {/if}
    </Field>

    <!--------------->
    <!--DESCRIPTION-->
    <!--------------->
    <Field>
      <FieldLabel for="recipeDescription">Description</FieldLabel>
      <FieldDescription>Describe the recipe in a few words</FieldDescription>
      <Textarea
        id="recipeDescription"
        placeholder="e.g. This vegan Chana Masala is packed with authentic Indian flavor and rivals any restaurant dish, but is easy and quick to make."
        autocomplete="off"
        maxlength={RECIPE_LIMITS.description.maxChars}
        bind:value={recipe.description}
      />
      {#if getErrors("description", errors).length}
        <FieldError>{getErrors("description", errors)[0]}</FieldError>
      {/if}
    </Field>

    <!--------------->
    <!--REFERENCES--->
    <!--------------->
    <Field>
      <div class="flex justify-between">
        <FieldLabel id="recipeReferencesLabel">References</FieldLabel>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Add recipe reference input ${recipe.references.length + 1}`}
          disabled={recipe.references.length >=
            RECIPE_LIMITS.references.maxCount}
          aria-disabled={recipe.references.length >=
            RECIPE_LIMITS.references.maxCount}
          onclick={() => {
            if (recipe.references.length <= RECIPE_LIMITS.references.maxCount) {
              recipe.references.push("");
            }
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <FieldDescription id="recipeReferencesDescription">
        If the recipe is based on or takes inspiration from an existing one(s),
        you should reference those here
      </FieldDescription>

      <div
        class="space-y-2"
        role="group"
        aria-labelledby="recipeReferencesLabel"
        aria-describedby="recipeReferencesDescription"
      >
        {#each recipe.references as _recipeReference, i}
          <InputGroup>
            <InputGroupInput
              aria-label={`Recipe reference ${i + 1}`}
              placeholder={i === 0
                ? "e.g. https://fakerecipesite.com/chana-masala"
                : i === 1
                  ? "e.g. The Imaginary Cookbook, Gordon Ramsay (2018)"
                  : "Another reference"}
              autocomplete="off"
              maxlength={RECIPE_LIMITS.references.maxChars}
              bind:value={recipe.references[i]}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="secondary"
                aria-label={`Remove recipe reference input ${i + 1}`}
                onclick={() => {
                  recipe.references.splice(i, 1);
                }}
              >
                <Trash2Icon class="text-destructive" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        {/each}
      </div>
      {#if getAllErrors("references.%", errors).length}
        <FieldError>{getAllErrors("references.%", errors)[0]}</FieldError>
      {/if}
    </Field>

    <!--------------->
    <!-----IMAGE----->
    <!--------------->
    <Field>
      <FieldLabel>Image</FieldLabel>
      <FieldDescription>
        Add an image for the recipe via URL or by uploading from disk
      </FieldDescription>

      <div class="flex flex-col gap-3">
        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            class="flex-1 {recipe.image.isUrlTab
              ? 'bg-accent'
              : 'bg-primary dark:bg-accent/30'}"
            onclick={() => {
              imagePreviewSrc = recipe.image.url;
              recipe.image.isUrlTab = true;
            }}
          >
            <LinkIcon />
            URL
          </Button>
          <Button
            type="button"
            variant="secondary"
            class="flex-1 {!recipe.image.isUrlTab
              ? 'bg-accent'
              : 'bg-primary dark:bg-accent/30'}"
            onclick={() => {
              imagePreviewSrc = uploadedImageBase64String;
              recipe.image.isUrlTab = false;
            }}
          >
            <UploadIcon />
            Upload
          </Button>
        </ButtonGroup>

        {#if recipe.image.isUrlTab}
          <InputGroup>
            <InputGroupInput
              placeholder="e.g. https://example.com/image.jpg"
              autocomplete="off"
              maxlength={RECIPE_LIMITS.imageUrl.maxChars}
              bind:value={recipe.image.url}
              onblur={() => {
                if (recipe.image.url) imagePreviewSrc = recipe.image.url;
              }}
            />
            {#if recipe.image.url}
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onclick={() => {
                    recipe.image.url = "";
                    imagePreviewSrc = "";
                  }}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            {/if}
          </InputGroup>
          {#if getErrors("image.url", errors).length}
            <FieldError>{getErrors("image.url", errors)[0]}</FieldError>
          {/if}
        {:else}
          <label
            class="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed
                  border-input rounded-md p-8 cursor-pointer transition-colors
                  hover:border-ring hover:bg-accent/50
                  {isDraggingImageFile ? 'border-ring bg-accent/50' : ''}"
            ondragover={(e) => {
              e.preventDefault();
              isDraggingImageFile = true;
            }}
            ondragleave={() => (isDraggingImageFile = false)}
            ondrop={(e) => {
              e.preventDefault();
              isDraggingImageFile = false;
              const file = e.dataTransfer?.files[0];
              if (file) handleImageFile(file);
            }}
          >
            <input
              type="file"
              accept="image/*"
              class="sr-only"
              onchange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) handleImageFile(file);
              }}
            />
            <UploadIcon class="h-8 w-8 text-muted-foreground" />
            <div class="flex flex-col items-center gap-1 text-center">
              <span class="text-sm font-medium">Drop an image here</span>
              <span class="text-xs text-muted-foreground"
                >or click to browse</span
              >
            </div>
          </label>
        {/if}

        {#if imagePreviewSrc}
          <div class="relative rounded-md overflow-hidden">
            <img
              src={imagePreviewSrc}
              alt="Recipe preview"
              class="w-full max-h-48 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon-sm"
              class="absolute top-2 right-2"
              onclick={() => {
                imagePreviewSrc = "";
                recipe.image.url = "";
              }}
            >
              <Trash2Icon class="h-4 w-4" />
            </Button>
          </div>
        {/if}
      </div>
    </Field>
  </FieldGroup>
</FieldSet>
