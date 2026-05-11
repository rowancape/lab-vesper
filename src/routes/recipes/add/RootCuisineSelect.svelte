<script lang="ts">
  let { children } = $props();
</script>

<div class="flex flex-wrap gap-1">
  {@render children()}
</div>