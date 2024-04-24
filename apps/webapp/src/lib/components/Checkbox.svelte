<script lang="ts">
  export let checked: boolean
</script>

<div
  class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
  class:bg-accent={checked}
  class:text-white={checked}
  class:bg-bg-secondary={!checked}
  class:text-bg={!checked}
>
  <input type="checkbox" class="hidden" on:change bind:checked />
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.7188 1.28001C12.0937 1.65335 12.0937 2.25865 11.7188 2.632L4.32 10L0.281177 5.978C-0.0937259 5.60466 -0.0937259 4.99935 0.281177 4.62601C0.656081 4.25267 1.26392 4.25267 1.63882 4.62601L4.32 7.29602L10.3612 1.28001C10.7361 0.906665 11.3439 0.906665 11.7188 1.28001Z"
      fill="currentColor"
    />
  </svg>
</div>
