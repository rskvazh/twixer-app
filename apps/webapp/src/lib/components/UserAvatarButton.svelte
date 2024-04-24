<script lang="ts">
  export let name: string

  $: char = name[0]?.toUpperCase() ?? ''
</script>

<div on:click>
  <div
    class="text-accent-dark pointer-events-none flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-white text-[17px] font-medium"
  >
    {char}
  </div>
</div>
