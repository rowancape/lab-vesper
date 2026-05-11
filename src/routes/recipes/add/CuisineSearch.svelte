<script lang="ts">
  import { ChevronDown, Search, Check } from "lucide-svelte";
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "$lib/components/ui/command";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import type { CuisineNode } from "$lib/domain/cuisines";

  type Props = {
    selectionPath: string[];
    nodes: CuisineNode[];
  };
  let { selectionPath = $bindable(), nodes }: Props = $props();

  type FlatCuisine = {
    path: string[];
    display: string;
    searchValue: string;
  };

  let isOpen = $state(false);

  let flatCuisines = $derived.by(() => {
    function flatten(
      nodes: CuisineNode[],
      parentPath: string[] = [],
    ): FlatCuisine[] {
      return nodes.flatMap((node) => {
        const currentPath = [...parentPath, node.label];
        const searchValue = currentPath.join(" › ");

        const item: FlatCuisine = {
          path: currentPath,
          display: node.label,
          searchValue,
        };

        // Recurse into children
        return [item, ...flatten(node.children ?? [], currentPath)];
      });
    }

    return flatten(nodes);
  });

  let triggerContent = $derived(
    selectionPath.length ? selectionPath.at(-1) : "Search cuisines",
  );

  function handleSelect(item: FlatCuisine) {
    selectionPath = item.path;
    isOpen = false;
  }

  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
  }
</script>

<Popover bind:open={isOpen}>
  <PopoverTrigger>
    <Button
      variant="outline"
      role="combobox"
      class="w-full justify-between h-10 px-3"
    >
      <span class="truncate">{triggerContent}</span>
      <div class="flex opacity-50">
        <Search />
        <ChevronDown
          class="transition-[rotate] duration-150 {isOpen ? 'rotate-180' : ''}"
        />
      </div>
    </Button>
  </PopoverTrigger>

  <PopoverContent class="w-[calc(100vw-3rem)] max-w-md p-0" sideOffset={4} align="start">
    <Command>
      <CommandInput placeholder="Search cuisines…" class="h-9" />

      <CommandList class="max-h-75">
        <CommandEmpty>No cuisine found.</CommandEmpty>

        <CommandGroup>
          {#each flatCuisines as item (item.path.join("|"))}
            <CommandItem
              value={item.searchValue}
              onSelect={() => handleSelect(item)}
              class="py-1! {arraysEqual(selectionPath, item.path) ? "bg-accent" : ""}"
            >
              {#if arraysEqual(selectionPath, item.path)}
                <Check class="h-4 w-4" />
              {/if}

              <div class="flex flex-col gap-0.5 truncate">
                <span class="font-medium leading-none">{item.display}</span>

                <span class="text-xs text-muted-foreground truncate">
                  {item.path.join(" > ")}
                </span>
              </div>
            </CommandItem>
          {/each}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
