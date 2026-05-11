<script lang="ts">
  import TreeNode from "./TreeNode.svelte";
  import { ChevronRight, ChevronDown } from "lucide-svelte";

  import * as ButtonGroup from "$lib/components/ui/button-group/index";
  import Toggle from "$lib/components/ui/toggle/toggle.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  import type { CuisineNode } from "$lib/domain/cuisines";

  type Props = {
    node: CuisineNode;
    parentPath: string[];
    selectedPath: string[];
    isRoot: boolean;
  }

  let { node, parentPath, selectedPath = $bindable(), isRoot }: Props = $props();

  let expanded = $state(false);

  let hasChildren = $derived(!!node.children?.length);
  let isPressed = $derived(selectedPath.includes(node.label));
</script>

<div 
  class="{isRoot ? '' : 'pl-4'} flex flex-col gap-1!"
>
  <ButtonGroup.Root>
    <Button
      onclick={() => {
        if (hasChildren) expanded = !expanded;
      }}
      variant="outline"
      size="icon-sm"
      disabled={!hasChildren}
    >
      {#if expanded}
        <ChevronDown size={16} />
      {:else}
        <ChevronRight size={16} />
      {/if}
    </Button>

    <Toggle 
      variant="outline"
      pressed={isPressed}
      onPressedChange={() => {
        const index = selectedPath.indexOf(node.label);

        if (index === -1) {
          selectedPath = [...parentPath, node.label];
        } else {
          selectedPath = selectedPath.slice(0, index);
        }
      }}
    >
      {node.label}
    </Toggle>
  </ButtonGroup.Root>

  {#if hasChildren && expanded}
    {#each node.children ?? [] as child}
      <TreeNode 
        node={child} 
        parentPath={[...parentPath, node.label]}
        bind:selectedPath
        isRoot={false}
      />
    {/each}
  {/if}
</div>
