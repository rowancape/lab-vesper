<script lang="ts">
  import BreadcrumbSelect from "./BreadcrumbSelect.svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index"
  import * as Select from "$lib/components/ui/select/index"
  import type { CuisineNode } from "$lib/domain/cuisines";

  type Props = {
    selectionPath: string[]
    nodes: CuisineNode[]
    depth: number
  }

  let { 
    selectionPath = $bindable(), 
    nodes, 
    depth
  }: Props = $props();

  let selectedLabel = $derived(selectionPath[depth])

  let isSelected = $derived(nodes.some((n) => n.label === selectedLabel))

  let triggerContent = $derived(
    isSelected
      ? selectedLabel
      : depth === 0
        ? "Select cuisine"
        : "..."
  );

  let selectedIndex = $derived(
    nodes.findIndex((n) => n.label === selectedLabel),
  );
</script>

{#if depth !== 0}
  <Breadcrumb.Separator />
{/if}

<Breadcrumb.Item>
  <Select.Root
    type="single"
    value={selectedLabel}
    onValueChange={(value) => {
      if (!value) {
        selectionPath = selectionPath.slice(0, depth);
        return;
      }
      selectionPath = [...selectionPath.slice(0, depth), value];
    }}
    allowDeselect={true}
  >
    <Select.Trigger 
      type="button"
      class="bg-transparent! border-none p-0 h-min! text-primary! gap-1! 
        {selectionPath.at(-1) === selectedLabel ? 'font-semibold' : ''}"
      isIcon={!isSelected || isSelected && nodes[selectedIndex]?.children.length === 0}
    >
      {triggerContent}
    </Select.Trigger>
    <Select.Content>
      {#each nodes as cuisine (cuisine.label)}
        <Select.Item value={cuisine.label}>
          {cuisine.label}
        </Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</Breadcrumb.Item>

{#if selectedIndex !== -1 && nodes[selectedIndex]?.children.length > 0}
  <BreadcrumbSelect 
    bind:selectionPath
    nodes={nodes[selectedIndex].children}
    depth={depth + 1}
  />
{/if}