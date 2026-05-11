<script lang="ts">
  import type { CuisineNode } from "$lib/domain/cuisines";
  import * as Select from "$lib/components/ui/select";
  import CuisineSelect from "./CuisineSelect.svelte";

  type Props = {
    nodes: CuisineNode[];
    selectionPath: string[];
    depth: number;
  };

  let { nodes, selectionPath = $bindable(), depth }: Props = $props();

  const fallback = "Select cuisine";
  let selectedLabel = $derived(selectionPath[depth]);

  let selectedIndex = $derived(
    nodes.findIndex((n) => n.label === selectedLabel),
  );

  let triggerContent = $derived.by(() => {
    if (nodes.some((n) => n.label === selectedLabel)) {
      return selectedLabel;
    } else {
      return fallback;
    }
  });
</script>

<div class="flex items-center">
  <Select.Root
    type="single"
    value={selectedLabel}
    onValueChange={(value) => {
      selectionPath = [...selectionPath.slice(0, depth), value];
    }}
  >
    <Select.Trigger>
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
</div>

{#if selectedIndex !== -1 && nodes[selectedIndex]?.children.length > 0}
  <CuisineSelect
    nodes={nodes[selectedIndex]?.children}
    bind:selectionPath
    depth={depth + 1}
  />
{/if}
