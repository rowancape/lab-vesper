<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldError
  } from "$lib/components/ui/field";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
  } from "$lib/components/ui/select";
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "$lib/components/ui/command";
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
  } from "$lib/components/ui/input-group";
  import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
  } from "$lib/components/ui/tooltip";
  import { Breadcrumb, BreadcrumbList } from "$lib/components/ui/breadcrumb";
  import { ButtonGroup } from "$lib/components/ui/button-group";

  import Input from "$lib/components/ui/input/input.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  import BreadcrumbSelect from "./BreadcrumbSelect.svelte";

  import { RECIPE_LIMITS } from "$lib/domain/recipe";
  import { type RecipePrimitive, type Errors, getErrors, getAllErrors } from "$lib/domain/recipe";

  import {
    Check as CheckIcon,
    ChevronRight as ChevronRightIcon,
    ListTree as ListTreeIcon,
    Pen as PenIcon,
    Search as SearchIcon,
    Info as InfoIcon,
  } from "lucide-svelte";

  type Props = {
    allCuisines: {
      id: number;
      parentId: number;
      label: string;
      path: string;
    }[];
    errors: Errors;
    recipe: RecipePrimitive;
  };
  let { allCuisines, errors, recipe = $bindable() }: Props = $props();

  const difficulties = [
    { value: "very_easy", label: "Very Easy" },
    { value: "easy", label: "Easy" },
    { value: "moderate", label: "Moderate" },
    { value: "hard", label: "Hard" },
    { value: "very_hard", label: "Very Hard" },
    { value: "nightmare", label: "Nightmare" },
  ];

  const mealTypes = [
    { value: "breakfast", label: "Breakfast" },
    { value: "brunch", label: "Brunch" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
    { value: "dessert", label: "Dessert" },
    { value: "drink", label: "Drink" },
    { value: "side", label: "Side dish" },
    { value: "appetizer", label: "Appetizer" },
    { value: "condiment", label: "Condiment" },
  ];

  const timeUnits = [
    { value: "minute", label: "min" },
    { value: "hour", label: "h" },
    { value: "day", label: "days" },
    { value: "week", label: "weeks" },
  ];

  function buildPathFromId(id: number): number[] {
    const path: number[] = [];
    let current = allCuisines.find((c) => c.id === id);
    while (current && current.parentId !== 0) {
      path.push(current.id);
      current = allCuisines.find((c) => c.id === current!.parentId);
    }
    if (current) path.push(current.id);
    return path.reverse();
  }
</script>

<FieldSet>
  <FieldLegend>Details</FieldLegend>
  <FieldDescription
    >Additional information about serving and preparation</FieldDescription
  >

  <FieldGroup>
    <div class="grid grid-cols-1 min-[370px]:grid-cols-2 gap-4 gap-y-6">
      <!--------------->
      <!--DIFFICULTY--->
      <!--------------->
      <Field class="grid grid-rows-subgrid row-span-4">
        <FieldLabel>Difficulty</FieldLabel>
        <FieldDescription>How difficult is the preparation?</FieldDescription>
        <Select type="single" bind:value={recipe.difficulty}>
          <SelectTrigger class="w-full min-w-0">
            <span class="truncate min-w-0">
              {difficulties.find((diff) => diff.value === recipe.difficulty)
                ?.label ?? "Select difficulty"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Difficulties</SelectLabel>
              {#each difficulties as difficulty}
                <SelectItem value={difficulty.value} label={difficulty.label}
                  >{difficulty.label}</SelectItem
                >
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError>{getErrors("difficulty", errors)[0]}</FieldError>
      </Field>

      <!--------------->
      <!--MEAL TYPES--->
      <!--------------->
      <Field class="grid grid-rows-subgrid row-span-4">
        <FieldLabel>Meal type</FieldLabel>
        <FieldDescription>How difficult is the preparation?</FieldDescription>
        <Select type="multiple" bind:value={recipe.mealTypes}>
          <SelectTrigger class="w-full min-w-0">
            <div class="flex gap-0">
              <span class="truncate min-w-0">
                {mealTypes.find((meal) => recipe.mealTypes.includes(meal.value))
                  ?.label ?? "Select meal type"}
              </span>
              {#if recipe.mealTypes.length > 1}
                <span class="relative -top-1 text-xs text-muted-foreground">
                  +{recipe.mealTypes.length - 1} more
                </span>
              {/if}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Difficulties</SelectLabel>
              {#each mealTypes as mealType}
                <SelectItem value={mealType.value} label={mealType.label}
                  >{mealType.label}</SelectItem
                >
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError>{getErrors("mealTypes", errors)[0]}</FieldError>
      </Field>

      <!--------------->
      <!---SERVINGS---->
      <!--------------->
      <Field class="grid grid-rows-subgrid row-span-4">
        <FieldLabel for="recipeServings">Number of servings</FieldLabel>
        <FieldDescription
          >How many servings does the recipe produce?</FieldDescription
        >
        <Input
          id="recipeServings"
          type="number"
          placeholder="e.g. 6"
          bind:value={recipe.servings}
        />
        <FieldError>{getErrors("servings", errors)[0]}</FieldError>
      </Field>

      <!--------------->
      <!-----YIELD----->
      <!--------------->
      <Field class="grid grid-rows-subgrid row-span-4">
        <FieldLabel for="recipeYield">Yield</FieldLabel>
        <FieldDescription
          >If the recipe produces distinct pieces, how many and what?</FieldDescription
        >

        <InputGroup>
          <InputGroupInput
            id="recipeYield"
            placeholder="e.g. 6 pieces"
            autocomplete="off"
            maxlength={RECIPE_LIMITS.yield.maxChars}
            bind:value={recipe.yield}
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger class="p-1">
                <InfoIcon size={16} />
              </TooltipTrigger>
              <TooltipContent class="max-w-80">
                <p>
                  Optional. Use this for recipes that produce distinct items or
                  portions, such as “12 cookies”, “2 pizzas”, or “24 dumplings”.
                  Leave empty for recipes where a yield doesn't make sense or is
                  already obvious.
                </p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
        <FieldError>{getErrors("yield", errors)[0]}</FieldError>
      </Field>

      <!--------------->
      <!--ACTIVE TIME-->
      <!--------------->
      <Field class="grid grid-rows-subgrid row-span-4">
        <FieldLabel for="recipeActiveTime">Active time</FieldLabel>
        <FieldDescription
          >Roughly how much active cooking time does it take by one person?</FieldDescription
        >
        <ButtonGroup>
          <Input
            id="recipeActiveTime"
            name="recipeActiveTime"
            placeholder="e.g. 30-45"
            autocomplete="off"
            maxlength={RECIPE_LIMITS.activeTime.maxChars}
            bind:value={recipe.activeTime.input}
          />
          <Select type="single" bind:value={recipe.activeTime.unit}>
            <SelectTrigger
              >{timeUnits.find((u) => u.value === recipe.activeTime.unit)
                ?.label}</SelectTrigger
            >
            <SelectContent>
              {#each timeUnits as timeUnit}
                <SelectItem value={timeUnit.value}>
                  {timeUnit.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </ButtonGroup>
        <FieldError>{getErrors("activeTime.input", errors)[0]}</FieldError>
      </Field>

      <!----------------->
      <!--INACTIVE TIME-->
      <!----------------->
      <Field class="grid grid-rows-subgrid row-span-4">
        <FieldLabel for="recipeInactiveTime">Inactive time</FieldLabel>
        <FieldDescription
          >Roughly how much inactive time does the prepartion take?</FieldDescription
        >
        <ButtonGroup>
          <Input
            id="recipeActiveTime"
            name="recipeActiveTime"
            placeholder="e.g. 30-45"
            autocomplete="off"
            maxlength={RECIPE_LIMITS.inactiveTime.maxChars}
            bind:value={recipe.inactiveTime.input}
          />
          <Select type="single" bind:value={recipe.inactiveTime.unit}>
            <SelectTrigger
              >{timeUnits.find((u) => u.value === recipe.inactiveTime.unit)
                ?.label}</SelectTrigger
            >
            <SelectContent>
              {#each timeUnits as timeUnit}
                <SelectItem value={timeUnit.value}>
                  {timeUnit.label}
                </SelectItem>
              {/each}
            </SelectContent>
          </Select>
        </ButtonGroup>
        <FieldError>{getErrors("inactiveTime.input", errors)[0]}</FieldError>
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

      <div class="bg-primary dark:bg-input/30 rounded-md border border-input">
        <div class="flex flex-col p-3 gap-3">
          <Label class="text-muted-foreground font-semibold flex gap-1.5">
            <ListTreeIcon size={14} />
            BROWSE
          </Label>
          <Breadcrumb>
            <BreadcrumbList class="gap-y-1 gap-x-0.5">
              <BreadcrumbSelect
                {allCuisines}
                bind:selectionPath={recipe.cuisineSelectionPath}
              />
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Separator />

        <div class="flex flex-col p-3 gap-3">
          <Label class="text-muted-foreground font-semibold flex gap-1.5">
            <SearchIcon size={14} />
            SEARCH
          </Label>
          <Command
            class="p-0 bg-transparent *:data-[slot='command-input-wrapper']:p-0 gap-1"
          >
            <CommandInput placeholder="Search cuisines" />
            <CommandList class="border rounded-md p-0.5">
              <CommandEmpty>No cuisines found!</CommandEmpty>
              <CommandGroup class="p-0! max-h-40 overflow-y-auto no-scrollbar">
                {#each allCuisines as cuisine (cuisine.id)}
                  <CommandItem
                    value={cuisine.path}
                    onSelect={() => {
                      recipe.cuisineSelectionPath = buildPathFromId(
                        cuisine.id,
                      ) as any;
                      recipe.customCuisine = null;
                    }}
                    class="rounded-md!"
                  >
                    {#if recipe.cuisineSelectionPath.at(-1) === cuisine.id}
                      <CheckIcon
                        class={recipe.cuisineSelectionPath.at(-1) === cuisine.id
                          ? "block"
                          : "invisible"}
                      />
                    {:else}
                      <ChevronRightIcon
                        class="text-muted-foreground
                        {recipe.cuisineSelectionPath.some(
                          (cid: number) => cid === cuisine.id,
                        )
                          ? 'block'
                          : 'invisible'}"
                      />
                    {/if}
                    <div class="flex flex-col gap-0.5 truncate px-0.5">
                      <span class="font-medium leading-none"
                        >{cuisine.label}</span
                      >

                      <span class="text-xs text-muted-foreground truncate">
                        {cuisine.path}
                      </span>
                    </div>
                  </CommandItem>
                {/each}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>

        <Separator />

        <div class="flex flex-col p-3 gap-3">
          <Label class="text-muted-foreground font-semibold flex gap-1.5">
            <PenIcon size={14} />
            CUSTOM
          </Label>
          <InputGroup>
            <InputGroupInput
              placeholder="e.g. Ancient Maya"
              autocomplete="off"
              maxlength={RECIPE_LIMITS.customCuisine.maxChars}
              bind:value={recipe.customCuisine}
              oninput={() => {
                recipe.cuisineSelectionPath = [];
              }}
            />
            {#if recipe.customCuisine?.length}
              <InputGroupAddon align="inline-end">
                <CheckIcon size={14} />
              </InputGroupAddon>
            {/if}
          </InputGroup>
          {#if getErrors("customCuisine", errors).length}
            <FieldError>{getErrors("customCuisine", errors)[0]}</FieldError>
          {:else if getErrors("cuisine", errors).length}
            <FieldError>{getErrors("cuisine", errors)[0]}</FieldError>
          {:else}
            <FieldDescription class="text-xs"
              >Can't find your cuisine above? Enter it here and it'll be
              automatically placed in the right category for you.</FieldDescription
            >
          {/if}
        </div>
      </div>
    </Field>
  </FieldGroup>
</FieldSet>
