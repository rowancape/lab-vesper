<script lang="ts">
  import BreadcrumbSelect from "./BreadcrumbSelect.svelte";
  import {
    BreadcrumbItem,
    BreadcrumbSeparator,
  } from "$lib/components/ui/breadcrumb";
  import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
  } from "$lib/components/ui/select";
  
  import { Ellipsis as EllipsisIcon } from "lucide-svelte";

  type Props = {
    allCuisines: {
      id: number;
      parentId: number;
      label: string;
      path: string;
    }[];
    idOfSelectedParent?: number;
    selectionPath: number[];
    depth?: number;
  };
  let { 
    allCuisines = [],
    idOfSelectedParent = 0,
    selectionPath = $bindable(),
    depth = 0,
  }: Props = $props();

  let selectedCuisineId = $derived(selectionPath[depth]?.toString())
  let selectedHasAtLeastOneChild = $derived(
    allCuisines.some((cuisine) => cuisine.parentId === Number(selectedCuisineId))
  )

  let selectContent = $derived({
    options: allCuisines.filter((cuisine) => cuisine.parentId === idOfSelectedParent),
    trigger: allCuisines.find((cuisine) => cuisine.id === Number(selectedCuisineId))?.label
  });
</script>

{#if depth}
  <BreadcrumbSeparator />
{/if}

<BreadcrumbItem>
  <Select 
    type="single"
    value={selectedCuisineId}
    onValueChange={(value) => {
      selectionPath = [...selectionPath.slice(0, depth), Number(value)];
    }}
  >
    <SelectTrigger
      class="py-0.5 px-2 h-min! text-primary! gap-1!"
    >
      {#if selectContent.trigger}
        {selectContent.trigger}
      {:else if depth === 0}
        Select cuisine
      {:else}
        <EllipsisIcon />
      {/if}
    </SelectTrigger>
    <SelectContent>
      {#each selectContent.options as cuisine (cuisine.id)}
        <SelectItem value={cuisine.id.toString()} label={cuisine.label}>
          {cuisine.label}
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
</BreadcrumbItem>

{#if selectedCuisineId && selectedHasAtLeastOneChild}
  <BreadcrumbSelect
    {allCuisines}
    idOfSelectedParent={Number(selectedCuisineId)}
    bind:selectionPath
    depth={depth + 1}
  />
{/if}
